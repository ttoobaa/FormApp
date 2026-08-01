import { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

export interface RatingProps {
  id?: string;
  value?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Rating = forwardRef<HTMLDivElement, RatingProps>(
  ({ id, value = 0, onChange, disabled, max = 5, size = 'md', className }, ref) => {
    const [hover, setHover] = useState(0);

    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
    };

    const handleClick = (newValue: number) => {
      if (!disabled) {
        onChange?.(newValue);
      }
    };

    return (
      <div ref={ref} id={id} className={cn('flex items-center gap-1', className)}>
        {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
          <button
            key={star}
            type="button"
            disabled={disabled}
            className={cn(
              'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded',
              disabled && 'cursor-not-allowed',
              !disabled && 'cursor-pointer hover:scale-110'
            )}
            onClick={() => handleClick(star)}
            onMouseEnter={() => !disabled && setHover(star)}
            onMouseLeave={() => setHover(0)}
          >
            <Star
              className={cn(
                sizeClasses[size],
                (hover || value) >= star
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-muted-foreground'
              )}
            />
          </button>
        ))}
        {value > 0 && (
          <span className="ml-2 text-sm text-muted-foreground">
            {value}/{max}
          </span>
        )}
      </div>
    );
  }
);

Rating.displayName = 'Rating';

export { Rating };
