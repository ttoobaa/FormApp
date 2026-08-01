import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Upload, X, FileText, Download } from 'lucide-react';
import { uploadFile } from '@/api/upload';

export interface FileUploadProps {
  id?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  accept?: string;
  maxSize?: number;
  className?: string;
}

export function FileUpload({ id, value, onChange, disabled, accept, maxSize, className }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const parsedValue = value ? (() => {
    try { return JSON.parse(value) as { url: string; name: string }; }
    catch { return null; }
  })() : null;

  const validateFile = (file: File): boolean => {
    if (maxSize && file.size > maxSize) {
      setError(`File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`);
      return false;
    }
    if (accept) {
      const allowedTypes = accept.split(',').map((t) => t.trim());
      const matchesType = allowedTypes.some((type) => {
        if (type.endsWith('/*')) {
          const prefix = type.slice(0, -1);
          return file.type.startsWith(prefix);
        }
        return file.type === type || file.name.endsWith(type.replace('*', ''));
      });
      if (!matchesType) {
        setError('File type not allowed');
        return false;
      }
    }
    setError(null);
    return true;
  };

  const handleFile = async (file: File) => {
    if (!validateFile(file)) return;
    setUploading(true);
    try {
      const res = await uploadFile(file);
      if (res.success && res.data) {
        onChange?.(JSON.stringify({ url: res.data.url, name: file.name }));
      } else {
        setError('Upload failed');
      }
    } catch {
      setError('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  return (
    <div className="space-y-2">
      <div
        className={cn(
          'relative border-2 border-dashed rounded-md p-4 text-center transition-colors',
          dragActive ? 'border-primary bg-primary/5' : 'border-input',
          disabled && 'opacity-50 cursor-not-allowed',
          error && 'border-destructive',
          className
        )}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        {parsedValue ? (
          <div className="flex items-center justify-center gap-3">
            <FileText className="w-8 h-8 text-muted-foreground" />
            <div className="text-left min-w-0">
              <p className="text-sm font-medium truncate max-w-[200px]">{parsedValue.name}</p>
            </div>
            <a href={parsedValue.url} target="_blank" rel="noopener noreferrer" download={parsedValue.name}>
              <Download className="w-4 h-4 text-primary hover:text-primary/80" />
            </a>
            {!disabled && (
              <button type="button" onClick={() => { onChange?.(''); setError(null); }} className="p-1 rounded-full hover:bg-destructive/10 text-destructive">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <label className="cursor-pointer block">
            {uploading ? (
              <p className="text-sm text-muted-foreground">Uploading...</p>
            ) : (
              <>
                <Upload className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  <span className="text-primary font-medium">Click to upload</span> or drag
                </p>
                {maxSize && <p className="text-xs text-muted-foreground">max {Math.round(maxSize / 1024 / 1024)}MB</p>}
              </>
            )}
            <input id={id} type="file" accept={accept} onChange={handleChange} disabled={disabled || uploading} className="hidden" />
          </label>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
