import type { UseFormReturn } from 'react-hook-form';
import type { FieldConfig } from '@/types';
import { Input } from '@/components/ui/input';
// import { Select } from '@/components/ui/select';
import { Autocomplete } from '@/components/ui/autocomplete';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileUpload } from '@/components/ui/file-upload';
import { SignaturePad } from '@/components/ui/signature-pad';
import { Rating } from '@/components/ui/rating';

interface FormFieldProps {
  field: FieldConfig;
  form: UseFormReturn<Record<string, unknown>>;
  disabled?: boolean;
}

export function FormField({ field, form, disabled }: FormFieldProps) {
  const { register, formState, setValue, watch } = form;
  const error = formState.errors[field.field_key]?.message as string | undefined;
  const watchedValue = watch(field.field_key);

  const renderInput = () => {
    const props = {
      ...register(field.field_key),
      id: field.field_key,
      placeholder: field.placeholder,
      disabled: disabled || !field.enabled,
      'aria-invalid': !!error,
      'aria-describedby': error ? `${field.field_key}-error` : undefined,
    };

    switch (field.type) {
      case 'email':
        return <Input type="email" {...props} />;
      case 'password':
      case 'confirm_password':
        return <Input type="password" {...props} />;
      case 'date':
      case 'date_of_birth':
      case 'start_date':
      case 'end_date':
      case 'appointment_date':
      case 'created_at':
        return <Input type="date" {...props} />;
      case 'time':
      case 'appointment_time':
        return <Input type="time" {...props} />;
      case 'phone_number':
        return <Input type="tel" {...props} />;
      case 'age':
      case 'latitude':
      case 'longitude':
        return <Input type="number" {...props} />;
      case 'website_url':
        return <Input type="url" {...props} />;
      // case 'country':
      // case 'state':
      // case 'city':
      // case 'gender':
      // case 'category':
      // case 'options':
      // case 'preferences':
      // case 'interests':
      // case 'select':
      //   return (
      //     <Select
      //       {...props}
      //       options={(field.options ?? []).map((opt) => ({ value: opt, label: opt }))}
      //     />
      //   );
      case 'country':
      case 'state':
      case 'city':
      case 'gender':
      case 'category':
      case 'options':
      case 'preferences':
      case 'interests':
      case 'select':
        return (
          <Autocomplete
            id={field.field_key}
            value={watchedValue as string}
            onChange={(val) => setValue(field.field_key, val)}
            options={field.options ?? []}
            placeholder={field.placeholder}
            disabled={disabled || !field.enabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${field.field_key}-error` : undefined}
          />
        );
      case 'additional_info':
      case 'custom_field_1':
      case 'custom_field_2':
      case 'rich_text_content':
      case 'address':
        return <Textarea {...props} />;
      case 'file_upload':
      case 'document':
      case 'profile_image':
      case 'attachments':
        return (
          <FileUpload
            id={field.field_key}
            value={watchedValue as string}
            onChange={(val) => setValue(field.field_key, val)}
            disabled={disabled || !field.enabled}
            accept={field.field_key === 'profile_image' ? 'image/*' : undefined}
            maxSize={field.max_value ? field.max_value * 1024 * 1024 : undefined}
          />
        );
      case 'signature':
        return (
          <SignaturePad
            id={field.field_key}
            value={watchedValue as string}
            onChange={(dataUrl) => setValue(field.field_key, dataUrl)}
            disabled={disabled || !field.enabled}
          />
        );
      case 'rating':
        return (
          <Rating
            id={field.field_key}
            value={Number(watchedValue) || 0}
            onChange={(value) => setValue(field.field_key, value)}
            disabled={disabled || !field.enabled}
            max={field.max_value ? Math.round(field.max_value) : 5}
          />
        );
      default:
        return <Input type="text" {...props} />;
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={field.field_key}>
        {field.label}
        {field.is_required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {renderInput()}
      {error && (
        <p id={`${field.field_key}-error`} className="text-sm text-destructive">
          {field.error_message ?? error}
        </p>
      )}
    </div>
  );
}
