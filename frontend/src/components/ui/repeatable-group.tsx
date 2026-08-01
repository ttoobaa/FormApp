import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface RepeatableGroupProps {
  label?: string;
  maxItems?: number;
  minItems?: number;
  disabled?: boolean;
  className?: string;
  renderItem: (index: number, remove: () => void) => React.ReactNode;
}

export function RepeatableGroup({
  label = 'Items',
  maxItems = 10,
  minItems = 1,
  disabled,
  className,
  renderItem,
}: RepeatableGroupProps) {
  const [items, setItems] = useState([Date.now()]);

  const addItem = () => {
    if (items.length < maxItems) {
      setItems([...items, Date.now()]);
    }
  };

  const removeItem = (index: number) => {
    if (items.length > minItems) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">{label}</h4>
        <span className="text-xs text-muted-foreground">
          {items.length}/{maxItems}
        </span>
      </div>

      <div className="space-y-3">
        {items.map((id, index) => (
          <div
            key={id}
            className="relative border rounded-md p-4 bg-card space-y-2 group"
          >
            <div className="flex items-center gap-2 mb-2">
              <GripVertical className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                {label} {index + 1}
              </span>
              {items.length > minItems && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="ml-auto h-6 w-6 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeItem(index)}
                  disabled={disabled}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
            {renderItem(index, () => removeItem(index))}
          </div>
        ))}
      </div>

      {items.length < maxItems && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addItem}
          disabled={disabled}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add {label}
        </Button>
      )}
    </div>
  );
}
