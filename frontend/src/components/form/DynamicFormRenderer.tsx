import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { FieldConfig } from '@/types';
import { buildZodSchema } from '@/schemas/form';
import { FormField } from './FormField';
import { Button } from '@/components/ui/button';
import { RepeatableGroup } from '@/components/ui/repeatable-group';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { getDialCode } from '@/constants/countries';

interface DynamicFormRendererProps {
  fields: FieldConfig[];
  dynamicFields?: FieldConfig[];
  onSubmit: (data: Record<string, unknown>) => void;
  disabled?: boolean;
  submitLabel?: string;
}

export function DynamicFormRenderer({
  fields,
  dynamicFields = [],
  onSubmit,
  disabled,
  submitLabel = 'Submit',
}: DynamicFormRendererProps) {
  const allEnabledFields = [...fields, ...dynamicFields].filter((f) => f.enabled);

  const schema = buildZodSchema(allEnabledFields);

  const defaultValues: Record<string, unknown> = {};
  for (const field of allEnabledFields) {
    if (field.default_value !== undefined) {
      defaultValues[field.field_key] = field.default_value;
    } else {
      defaultValues[field.field_key] = '';
    }
  }

  const form = useForm<Record<string, unknown>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { watch, setValue } = form;
  const allValues = watch();

  const countryValue = watch('country') as string | undefined;
  useEffect(() => {
    if (countryValue) {
      const dialCode = getDialCode(countryValue);
      if (dialCode) {
        setValue('phone_number', dialCode);
      }
    } else {
      setValue('phone_number', '');
    }
  }, [countryValue, setValue]);

  const renderField = (field: FieldConfig) => {
    if (field.type === 'repeatable_group') {
      return (
        <RepeatableGroup
          key={field.field_key}
          label={field.label}
          maxItems={field.max_value ? Math.round(field.max_value) : 10}
          minItems={field.min_value ? Math.round(field.min_value) : 1}
          disabled={disabled || !field.enabled}
          renderItem={(index) => (
            <FormField
              field={{ ...field, field_key: `${field.field_key}_${index}` }}
              form={form as never}
              disabled={disabled}
            />
          )}
        />
      );
    }

    if (field.type === 'conditional_field') {
      const options = field.options ?? ['Yes', 'No'];

      return (
        <div key={field.field_key} className="space-y-3">
          <Label>{field.label}{field.is_required && <span className="text-destructive ml-1">*</span>}</Label>
          <RadioGroup
            value={String(allValues[field.field_key] ?? '')}
            onValueChange={(value) => form.setValue(field.field_key, value)}
            disabled={disabled || !field.enabled}
            className="flex flex-wrap gap-4"
          >
            {options.map((option) => (
              <div key={option} className="flex items-center gap-2">
                <RadioGroupItem value={option} id={`${field.field_key}_${option}`} />
                <Label htmlFor={`${field.field_key}_${option}`} className="cursor-pointer font-normal">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      );
    }

    return (
      <FormField key={field.field_key} field={field} form={form as never} disabled={disabled} />
    );
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {allEnabledFields.map(renderField)}
      <Button type="submit" disabled={disabled || form.formState.isSubmitting} className="w-full">
        {form.formState.isSubmitting ? 'Submitting...' : submitLabel}
      </Button>
    </form>
  );
}
