import 'dotenv/config';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { createServer as createViteServer } from 'vite';
import { put, del } from '@vercel/blob';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';
const LOCAL_STORAGE_DIR = path.resolve(process.cwd(), '.blob-storage');

function ensureLocalDir(subFolder: string): string {
  const safeFolder = subFolder.replace(/[^a-zA-Z0-9_-]/g, '') || 'media';
  const target = path.join(LOCAL_STORAGE_DIR, safeFolder);
  fs.mkdirSync(target, { recursive: true });
  return target;
}

function sanitizeFileName(rawName: string): string {
  const base = path.basename(rawName || `arquivo-${Date.now()}`);
  const cleaned = base
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-');
  return cleaned || `media-${Date.now()}`;
}

async function startServer() {
  const app = express();

  // Serve locally persisted preview blobs when BLOB_READ_WRITE_TOKEN is absent
  fs.mkdirSync(LOCAL_STORAGE_DIR, { recursive: true });
  app.use('/blob-files', express.static(LOCAL_STORAGE_DIR, { maxAge: '30d' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, timestamp: new Date().toISOString() });
  });

  app.get('/api/blob/status', (_req, res) => {
    const hasToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
    res.json({
      configured: hasToken,
      provider: hasToken ? 'vercel-blob' : 'local-storage',
      storeId: process.env.BLOB_STORE_ID || null,
    });
  });

  // Official Vercel Blob Client Token / Multipart Upload Handler
  app.post('/api/blob/handle-upload', express.json(), async (req, res) => {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      res.status(503).json({
        error: 'BLOB_READ_WRITE_TOKEN não configurado neste ambiente.',
      });
      return;
    }

    try {
      const body = req.body as HandleUploadBody;
      const appUrl = process.env.APP_URL;
      const callbackUrl =
        appUrl && appUrl.startsWith('https://')
          ? `${appUrl.replace(/\/$/, '')}/api/blob/handle-upload`
          : undefined;

      const jsonResponse = await handleUpload({
        token,
        body,
        request: req,
        onBeforeGenerateToken: async (_pathname) => {
          return {
            allowedContentTypes: [
              'image/jpeg',
              'image/png',
              'image/webp',
              'image/avif',
              'image/gif',
              'video/mp4',
              'video/webm',
              'video/quicktime',
              'video/ogg',
              'video/x-msvideo',
            ],
            maximumSizeInBytes: 500 * 1024 * 1024, // 500 MB per file for HD videos
            addRandomSuffix: true,
            ...(callbackUrl ? { callbackUrl } : {}),
          };
        },
        onUploadCompleted: async ({ blob }) => {
          console.log('Vercel Blob upload completed:', blob.url);
        },
      });
      res.json(jsonResponse);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro no upload Vercel Blob';
      res.status(400).json({ error: message });
    }
  });

  // Direct Upload Route (supports Vercel Blob put() when token is configured, or local disk preview)
  app.post(
    '/api/blob/upload',
    express.raw({ type: '*/*', limit: '250mb' }),
    async (req, res) => {
      try {
        const rawFilename = String(req.headers['x-file-name'] || `media-${Date.now()}`);
        const contentType = String(req.headers['x-content-type'] || 'application/octet-stream');
        const folder = String(req.headers['x-folder'] || 'properties').replace(/[^a-zA-Z0-9_-]/g, '');
        const safeName = sanitizeFileName(decodeURIComponent(rawFilename));
        const bodyBuffer = Buffer.isBuffer(req.body) ? req.body : Buffer.from(req.body || '');

        if (!bodyBuffer.length) {
          res.status(400).json({ error: 'Arquivo vazio recebido no upload.' });
          return;
        }

        const token = process.env.BLOB_READ_WRITE_TOKEN;
        if (token) {
          const blob = await put(`${folder}/${safeName}`, bodyBuffer, {
            access: 'public',
            contentType,
            addRandomSuffix: true,
            token,
          });
          res.json({
            url: blob.url,
            pathname: blob.pathname,
            contentType: blob.contentType,
            size: bodyBuffer.length,
            provider: 'vercel-blob',
          });
          return;
        }

        // Local preview storage fallback so compressed uploads and videos work cleanly before token setup
        const targetDir = ensureLocalDir(folder);
        const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${safeName}`;
        const fullPath = path.join(targetDir, uniqueName);
        await fs.promises.writeFile(fullPath, bodyBuffer);

        const publicUrl = `/blob-files/${folder}/${uniqueName}`;
        res.json({
          url: publicUrl,
          pathname: `${folder}/${uniqueName}`,
          contentType,
          size: bodyBuffer.length,
          provider: 'local-storage',
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Falha ao processar upload de mídia';
        res.status(500).json({ error: message });
      }
    }
  );

  // Delete media from Vercel Blob (or local storage)
  app.post('/api/blob/delete', express.json(), async (req, res) => {
    try {
      const targetUrl = String(req.body?.url || '');
      if (!targetUrl) {
        res.status(400).json({ error: 'URL inválida' });
        return;
      }

      const token = process.env.BLOB_READ_WRITE_TOKEN;
      if (token && targetUrl.includes('vercel-storage.com')) {
        await del(targetUrl, { token });
        res.json({ deleted: true, provider: 'vercel-blob' });
        return;
      }

      if (targetUrl.startsWith('/blob-files/')) {
        const rel = targetUrl.replace(/^\/blob-files\//, '');
        const resolved = path.resolve(LOCAL_STORAGE_DIR, rel);
        if (resolved.startsWith(LOCAL_STORAGE_DIR) && fs.existsSync(resolved)) {
          await fs.promises.unlink(resolved);
        }
        res.json({ deleted: true, provider: 'local-storage' });
        return;
      }

      res.json({ deleted: false, skipped: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao remover arquivo';
      res.status(500).json({ error: message });
    }
  });

  if (!IS_PROD) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
