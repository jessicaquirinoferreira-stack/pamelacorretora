import { upload } from '@vercel/blob/client';

export interface BlobUploadResult {
  url: string;
  pathname: string;
  contentType: string;
  size: number;
  provider: 'vercel-blob' | 'local-storage';
}

export interface BlobStatusResult {
  configured: boolean;
  provider: 'vercel-blob' | 'local-storage';
}

let cachedStatus: BlobStatusResult | null = null;

export async function getBlobStorageStatus(forceRefresh = false): Promise<BlobStatusResult> {
  if (cachedStatus && !forceRefresh) return cachedStatus;
  try {
    const res = await fetch('/api/blob/status');
    if (res.ok) {
      cachedStatus = (await res.json()) as BlobStatusResult;
      return cachedStatus;
    }
  } catch {
    // Fallback
  }
  return { configured: false, provider: 'local-storage' };
}

function uploadViaServerXhr(
  file: File,
  folder: string,
  onProgress?: (percentage: number) => void
): Promise<BlobUploadResult> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/blob/upload');
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
    xhr.setRequestHeader('x-file-name', encodeURIComponent(file.name));
    xhr.setRequestHeader('x-content-type', file.type || 'application/octet-stream');
    xhr.setRequestHeader('x-folder', folder);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText) as BlobUploadResult);
        } catch {
          reject(new Error('Resposta inválida do servidor de storage.'));
        }
      } else {
        try {
          const parsed = JSON.parse(xhr.responseText);
          reject(new Error(parsed.error || `Erro HTTP ${xhr.status}`));
        } catch {
          reject(new Error(`Falha no upload (HTTP ${xhr.status})`));
        }
      }
    };

    xhr.onerror = () => reject(new Error('Erro de rede ao enviar arquivo.'));
    xhr.send(file);
  });
}

export async function uploadMediaToBlob(
  file: File,
  options: {
    folder: 'properties' | 'videos' | 'branding' | 'landing-pages';
    onProgress?: (percentage: number) => void;
  }
): Promise<BlobUploadResult> {
  const status = await getBlobStorageStatus();

  if (status.configured) {
    try {
      const cleanName = file.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9._-]/g, '-');
      const blob = await upload(`${options.folder}/${cleanName}`, file, {
        access: 'public',
        handleUploadUrl: '/api/blob/handle-upload',
        multipart: file.size > 5 * 1024 * 1024,
        onUploadProgress: (evt) => {
          options.onProgress?.(Math.round(evt.percentage));
        },
      });

      return {
        url: blob.url,
        pathname: blob.pathname,
        contentType: blob.contentType,
        size: file.size,
        provider: 'vercel-blob',
      };
    } catch {
      // Fallback to direct server put() if browser cannot reach handleUpload callback
      return uploadViaServerXhr(file, options.folder, options.onProgress);
    }
  }

  return uploadViaServerXhr(file, options.folder, options.onProgress);
}

export async function deleteMediaFromBlob(url: string): Promise<void> {
  if (!url) return;
  try {
    await fetch('/api/blob/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
  } catch {
    // Non-fatal cleanup error
  }
}
