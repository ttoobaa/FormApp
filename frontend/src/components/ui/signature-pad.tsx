import { useRef, useState, useEffect, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Eraser } from 'lucide-react';

export interface SignaturePadProps {
  id?: string;
  value?: string;
  onChange?: (dataUrl: string) => void;
  disabled?: boolean;
  className?: string;
  width?: number;
  height?: number;
}

const SignaturePad = forwardRef<HTMLCanvasElement, SignaturePadProps>(
  ({ id, value, onChange, disabled, className, width = 400, height = 150 }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (value) {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          setHasSignature(true);
        };
        img.src = value;
      }
    }, [value]);

    const getPos = (e: React.MouseEvent | React.TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };

      const rect = canvas.getBoundingClientRect();
      if ('touches' in e) {
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
        };
      }
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;

      setIsDrawing(true);
      const { x, y } = getPos(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      if (!isDrawing) return;

      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;

      const { x, y } = getPos(e);
      ctx.lineTo(x, y);
      ctx.stroke();
    };

    const stopDrawing = () => {
      if (!isDrawing) return;
      setIsDrawing(false);

      const canvas = canvasRef.current;
      if (!canvas) return;

      const dataUrl = canvas.toDataURL('image/png');
      setHasSignature(true);
      onChange?.(dataUrl);
    };

    const clearSignature = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasSignature(false);
      onChange?.('');
    };

    return (
      <div className="space-y-2">
        <div className="relative">
          <canvas
            ref={(node) => {
              canvasRef.current = node;
              if (typeof ref === 'function') ref(node);
              else if (ref) (ref as React.MutableRefObject<HTMLCanvasElement | null>).current = node;
            }}
            id={id}
            width={width}
            height={height}
            className={cn(
              'border border-input rounded-md bg-background touch-none',
              disabled && 'opacity-50 cursor-not-allowed',
              className
            )}
            style={{ width: '100%', maxWidth: width }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          {!hasSignature && !isDrawing && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-muted-foreground text-sm">Sign here</p>
            </div>
          )}
          {hasSignature && !disabled && (
            <button
              type="button"
              onClick={clearSignature}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-muted text-muted-foreground"
            >
              <Eraser className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

SignaturePad.displayName = 'SignaturePad';

export { SignaturePad };
