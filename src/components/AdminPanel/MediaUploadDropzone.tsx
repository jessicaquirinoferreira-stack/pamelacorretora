import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Film, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { compressImageFile, formatBytes } from '../../utils/mediaCompression';
import { uploadMediaToBlob } from '../../utils/blobStorage';

interface MediaUploadDropzoneProps {
  mode: 'image' | 'video';
  folder: 'properties' | 'videos' | 'branding' | 'landing-pages';
  multiple?: boolean;
  label: string;
  helperText?: string;
  onUploaded: (urls: string[]) => void;
}

interface UploadItemState {
  id: string;
  name: string;
  status: 'compressing' | 'uploading' | 'done' | 'error';
  progress: number;
  info?: string;
  error?: string;
}

export const MediaUploadDropzone: React.FC<MediaUploadDropzoneProps> = ({
  mode,
  folder,
  multiple = true,
  label,
  helperText,
  onUploaded,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [queue, setQueue] = useState<UploadItemState[]>([]);
  const [isBusy, setIsBusy] = useState(false);

  const updateItem = (id: string, patch: Partial<UploadItemState>) => {
    setQueue((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const processFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList).filter((f) =>
      mode === 'image' ? f.type.startsWith('image/') : f.type.startsWith('video/')
    );

    if (files.length === 0) return;

    const selectedFiles = multiple ? files : [files[0]];
    const initialQueue: UploadItemState[] = selectedFiles.map((f, idx) => ({
      id: `${Date.now()}-${idx}-${f.name}`,
      name: f.name,
      status: mode === 'image' ? 'compressing' : 'uploading',
      progress: 0,
    }));

    setQueue(initialQueue);
    setIsBusy(true);

    const uploadedUrls: string[] = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const originalFile = selectedFiles[i];
      const itemId = initialQueue[i].id;

      try {
        let fileToUpload = originalFile;
        let compressionInfo = formatBytes(originalFile.size);

        if (mode === 'image') {
          updateItem(itemId, { status: 'compressing', progress: 15 });
          const compressed = await compressImageFile(originalFile);
          fileToUpload = compressed.file;
          compressionInfo =
            compressed.reductionPercent > 0
              ? `${formatBytes(compressed.originalSize)} → ${formatBytes(compressed.compressedSize)} (-${compressed.reductionPercent}%)`
              : formatBytes(compressed.compressedSize);
        }

        updateItem(itemId, {
          status: 'uploading',
          progress: 20,
          info: compressionInfo,
        });

        const result = await uploadMediaToBlob(fileToUpload, {
          folder,
          onProgress: (pct) => {
            updateItem(itemId, { progress: Math.max(20, pct) });
          },
        });

        uploadedUrls.push(result.url);
        updateItem(itemId, {
          status: 'done',
          progress: 100,
          info: `${compressionInfo} · ${result.provider === 'vercel-blob' ? 'Vercel Blob' : 'Salvo'}`,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Falha no envio';
        updateItem(itemId, { status: 'error', error: message });
      }
    }

    if (uploadedUrls.length > 0) {
      onUploaded(uploadedUrls);
    }

    setIsBusy(false);
    if (inputRef.current) inputRef.current.value = '';

    window.setTimeout(() => {
      setQueue((prev) => prev.filter((item) => item.status === 'error'));
    }, 4000);
  };

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          processFiles(e.dataTransfer.files);
        }}
        onClick={() => !isBusy && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !isBusy) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={`border-2 border-dashed rounded-xl p-4 sm:p-5 text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-[#B55D3E] bg-[#F9EBE5]/60'
            : 'border-[#C6D4C8] bg-[#FAF7F2] hover:border-[#586E5E] hover:bg-[#F3EDE4]/70'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={mode === 'image' ? 'image/*' : 'video/mp4,video/webm,video/quicktime,video/*'}
          multiple={multiple}
          onChange={(e) => processFiles(e.target.files)}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-1.5">
          <div className="w-10 h-10 rounded-full bg-[#E6ECE6] text-[#586E5E] flex items-center justify-center">
            {isBusy ? (
              <Loader2 className="w-5 h-5 animate-spin text-[#B55D3E]" />
            ) : mode === 'image' ? (
              <ImageIcon className="w-5 h-5 text-[#9B4D32]" />
            ) : (
              <Film className="w-5 h-5 text-[#9B4D32]" />
            )}
          </div>
          <div className="text-xs font-semibold text-[#2D3B32] flex items-center gap-1.5">
            <UploadCloud className="w-4 h-4 text-[#586E5E]" />
            <span>{label}</span>
          </div>
          <p className="text-[11px] text-[#586E5E]">
            {helperText ||
              (mode === 'image'
                ? 'Arraste ou selecione quantas fotos quiser · Compressão automática WebP sem perda visual'
                : 'Arraste ou selecione quantos vídeos quiser (MP4, MOV, WebM) · Upload direto para Vercel Blob')}
          </p>
        </div>
      </div>

      {/* Upload & Compression Progress Queue */}
      {queue.length > 0 && (
        <div className="space-y-1.5 bg-white border border-[#E3DACF] rounded-xl p-3">
          {queue.map((item) => (
            <div key={item.id} className="space-y-1">
              <div className="flex items-center justify-between text-[11px] gap-2">
                <span className="font-medium text-[#2D3B32] truncate">{item.name}</span>
                <span className="shrink-0 flex items-center gap-1 text-[#586E5E]">
                  {item.status === 'compressing' && 'Comprimindo...'}
                  {item.status === 'uploading' && `${item.progress}% ${item.info ? `· ${item.info}` : ''}`}
                  {item.status === 'done' && (
                    <span className="text-[#586E5E] font-medium inline-flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-[#586E5E]" />
                      {item.info}
                    </span>
                  )}
                  {item.status === 'error' && (
                    <span className="text-[#9B4D32] font-medium inline-flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {item.error}
                    </span>
                  )}
                </span>
              </div>
              {item.status !== 'error' && (
                <div className="w-full h-1.5 bg-[#E6ECE6] rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      item.status === 'done' ? 'bg-[#586E5E]' : 'bg-[#B55D3E]'
                    }`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
