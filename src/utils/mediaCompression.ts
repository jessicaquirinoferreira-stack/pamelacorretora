export interface CompressedImageResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
  reductionPercent: number;
}

export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 KB';
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

function loadHtmlImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), mimeType, quality);
  });
}

/**
 * Compresses image files on the client using WebP (fallback JPEG)
 * while maintaining high perceptual sharpness and small byte size.
 */
export async function compressImageFile(
  file: File,
  options?: {
    maxDimension?: number;
    initialQuality?: number;
    targetMaxBytes?: number;
  }
): Promise<CompressedImageResult> {
  const maxDimension = options?.maxDimension ?? 1920;
  const initialQuality = options?.initialQuality ?? 0.85;
  const targetMaxBytes = options?.targetMaxBytes ?? 450_000; // ~450 KB target for fast web loading

  // Skip SVG or animated GIFs
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return {
      file,
      originalSize: file.size,
      compressedSize: file.size,
      width: 0,
      height: 0,
      reductionPercent: 0,
    };
  }

  let width = 0;
  let height = 0;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return {
      file,
      originalSize: file.size,
      compressedSize: file.size,
      width: 0,
      height: 0,
      reductionPercent: 0,
    };
  }

  try {
    let source: ImageBitmap | HTMLImageElement;
    if (typeof createImageBitmap === 'function') {
      const bitmap = await createImageBitmap(file);
      width = bitmap.width;
      height = bitmap.height;
      source = bitmap;
    } else {
      const img = await loadHtmlImage(file);
      width = img.naturalWidth || img.width;
      height = img.naturalHeight || img.height;
      source = img;
    }

    // Scale down proportionally if larger than maxDimension
    let targetWidth = width;
    let targetHeight = height;
    if (width > maxDimension || height > maxDimension) {
      if (width >= height) {
        targetWidth = maxDimension;
        targetHeight = Math.round((height / width) * maxDimension);
      } else {
        targetHeight = maxDimension;
        targetWidth = Math.round((width / height) * maxDimension);
      }
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(source, 0, 0, targetWidth, targetHeight);

    if ('close' in source && typeof source.close === 'function') {
      source.close();
    }

    // Encode preferentially as WebP; fallback to JPEG if WebP encoding unsupported
    let mimeType = 'image/webp';
    let bestBlob = await canvasToBlob(canvas, mimeType, initialQuality);

    if (!bestBlob || bestBlob.type !== 'image/webp') {
      mimeType = 'image/jpeg';
      bestBlob = await canvasToBlob(canvas, mimeType, initialQuality);
    }

    // Gentle iterative quality step-down only if still above targetMaxBytes (never drops below 0.72)
    const qualitySteps = [0.80, 0.76, 0.72];
    for (const q of qualitySteps) {
      if (!bestBlob || bestBlob.size <= targetMaxBytes) break;
      const nextBlob = await canvasToBlob(canvas, mimeType, q);
      if (nextBlob && nextBlob.size < bestBlob.size) {
        bestBlob = nextBlob;
      }
    }

    if (!bestBlob) {
      return {
        file,
        originalSize: file.size,
        compressedSize: file.size,
        width: targetWidth,
        height: targetHeight,
        reductionPercent: 0,
      };
    }

    // Keep original if somehow already smaller and same/modern format
    if (bestBlob.size >= file.size && (file.type === 'image/webp' || file.type === 'image/jpeg')) {
      return {
        file,
        originalSize: file.size,
        compressedSize: file.size,
        width: targetWidth,
        height: targetHeight,
        reductionPercent: 0,
      };
    }

    const baseName = file.name.replace(/\.[^.]+$/, '');
    const ext = mimeType === 'image/webp' ? 'webp' : 'jpg';
    const compressedFile = new File([bestBlob], `${baseName}.${ext}`, {
      type: mimeType,
      lastModified: Date.now(),
    });

    const reductionPercent = Math.max(
      0,
      Math.round(((file.size - compressedFile.size) / file.size) * 100)
    );

    return {
      file: compressedFile,
      originalSize: file.size,
      compressedSize: compressedFile.size,
      width: targetWidth,
      height: targetHeight,
      reductionPercent,
    };
  } catch {
    return {
      file,
      originalSize: file.size,
      compressedSize: file.size,
      width: 0,
      height: 0,
      reductionPercent: 0,
    };
  }
}
