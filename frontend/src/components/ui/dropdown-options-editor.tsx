import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface DropdownOptionsEditorProps {
  options: string[];
  onChange: (options: string[]) => void;
}

export function DropdownOptionsEditor({ options, onChange }: DropdownOptionsEditorProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newOption, setNewOption] = useState('');

  const addOption = () => {
    const val = newOption.trim();
    if (val) {
      onChange([...options, val]);
      setNewOption('');
      setIsAdding(false);
    }
  };

  const removeOption = (index: number) => {
    onChange(options.filter((_, i) => i !== index));
  };

  return (
    <div className="px-3 pb-2 pt-1">
      <div className="flex flex-wrap gap-1">
        {options.map((opt, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted text-xs">
            {opt}
            <button
              type="button"
              onClick={() => removeOption(i)}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </span>
        ))}
        {isAdding ? (
          <div className="flex gap-1 items-center w-full mt-1">
            <Input
              placeholder="Enter option"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); addOption(); }
              }}
              className="h-7 text-xs max-w-40"
              autoFocus
            />
            <Button type="button" size="sm" variant="outline" className="h-7 text-xs px-2" onClick={addOption}>Add</Button>
            <Button type="button" size="sm" variant="ghost" className="h-7 text-xs px-2" onClick={() => { setIsAdding(false); setNewOption(''); }}>Cancel</Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-dashed border-input text-xs text-muted-foreground hover:bg-muted"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        )}
      </div>
    </div>
  );
}
