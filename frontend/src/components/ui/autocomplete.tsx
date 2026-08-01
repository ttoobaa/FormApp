import { useState, useRef, useEffect, useCallback } from 'react';
import Fuse from 'fuse.js';
import { cn } from '@/lib/utils';

interface AutocompleteProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
}

export function Autocomplete({
  id,
  value,
  onChange,
  options,
  placeholder,
  disabled,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedby,
}: AutocompleteProps) {
  const [inputValue, setInputValue] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const fuse = useRef(new Fuse(options, {
    threshold: 0.4,
    distance: 100,
    minMatchCharLength: 1,
    keys: [],
  }));

  useEffect(() => {
    fuse.current = new Fuse(options, {
      threshold: 0.4,
      distance: 100,
      minMatchCharLength: 1,
    });
  }, [options]);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  const suggestions = inputValue.trim()
    ? fuse.current.search(inputValue).map((r) => r.item)
    : options;

  const displayed = suggestions.slice(0, 10);

  const selectItem = useCallback((item: string) => {
    setInputValue(item);
    onChange(item);
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, [onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    onChange(val);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleBlur = () => {
    setTimeout(() => setIsOpen(false), 150);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true);
        e.preventDefault();
        return;
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < displayed.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : displayed.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < displayed.length) {
          selectItem(displayed[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex]);

  return (
    <div ref={wrapperRef} className="relative">
      <input
        ref={inputRef}
        id={id}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || 'Type to search...'}
        disabled={disabled}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedby}
        aria-expanded={isOpen}
        aria-autocomplete="list"
        role="combobox"
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        )}
      />
      {isOpen && displayed.length > 0 && !disabled && (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute z-50 mt-1 w-full rounded-md border border-input bg-background shadow-lg max-h-60 overflow-auto"
        >
          {displayed.map((item, index) => (
            <li
              key={item}
              role="option"
              aria-selected={index === highlightedIndex}
              onMouseDown={(e) => {
                e.preventDefault();
                selectItem(item);
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={cn(
                'px-3 py-2 text-sm cursor-pointer',
                index === highlightedIndex
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted',
              )}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
