import { forwardRef, createContext, useContext } from 'react';
import { cn } from '@/lib/utils';

interface RadioGroupContextValue {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

interface RadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

function RadioGroup({ value = '', onValueChange, disabled, className, children }: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange: onValueChange ?? (() => {}), disabled }}>
      <div role="radiogroup" className={cn('flex flex-col gap-2', className)}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

interface RadioGroupItemProps {
  value: string;
  id: string;
  className?: string;
}

const RadioGroupItem = forwardRef<HTMLButtonElement, RadioGroupItemProps>(
  ({ value, id, className }, ref) => {
    const context = useContext(RadioGroupContext);
    if (!context) throw new Error('RadioGroupItem must be used within RadioGroup');

    const isChecked = context.value === value;

    return (
      <button
        ref={ref}
        type="button"
        id={id}
        role="radio"
        aria-checked={isChecked}
        disabled={context.disabled}
        className={cn(
          'h-4 w-4 rounded-full border border-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center',
          isChecked && 'border-primary',
          className
        )}
        onClick={() => context.onValueChange(value)}
      >
        {isChecked && <span className="h-2 w-2 rounded-full bg-primary" />}
      </button>
    );
  }
);

RadioGroupItem.displayName = 'RadioGroupItem';

export { RadioGroup, RadioGroupItem };
