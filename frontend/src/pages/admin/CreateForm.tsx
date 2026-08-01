import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { createForm } from '@/api/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownOptionsEditor } from '@/components/ui/dropdown-options-editor';
import { ArrowLeft, Plus, Trash2, Copy } from 'lucide-react';
import type { FieldConfig } from '@/types';
import { countryOptions } from '@/constants/countries';

const DEFAULT_FIXED_FIELDS: FieldConfig[] = [
  { field_key: 'full_name', label: 'Full Name', type: 'text', enabled: true, is_required: true, placeholder: 'Enter your full name' },
  { field_key: 'email', label: 'Email', type: 'email', enabled: true, is_required: true, placeholder: 'Enter your email' },
  { field_key: 'first_name', label: 'First Name', type: 'text', enabled: true, is_required: false, placeholder: 'Enter your first name' },
  { field_key: 'last_name', label: 'Last Name', type: 'text', enabled: true, is_required: false, placeholder: 'Enter your last name' },
  // { field_key: 'phone_number', label: 'Phone Number', type: 'tel', enabled: true, is_required: false, placeholder: 'Enter your phone number' },
  { field_key: 'age', label: 'Age', type: 'number', enabled: true, is_required: false, placeholder: 'Enter your age' },
  { field_key: 'title', label: 'Title', type: 'text', enabled: true, is_required: false, placeholder: 'Enter title' },
  { field_key: 'description', label: 'Description', type: 'textarea', enabled: true, is_required: false, placeholder: 'Enter description' },
  // { field_key: 'country', label: 'Country', type: 'select', enabled: true, is_required: false, options: [] },
  { field_key: 'country', label: 'Country', type: 'select', enabled: true, is_required: false, options: countryOptions },
  { field_key: 'phone_number', label: 'Phone Number', type: 'tel', enabled: true, is_required: false, placeholder: 'Enter your phone number' },
  { field_key: 'state', label: 'State', type: 'select', enabled: true, is_required: false, options: [] },
  { field_key: 'city', label: 'City', type: 'select', enabled: true, is_required: false, options: [] },
  { field_key: 'gender', label: 'Gender', type: 'select', enabled: true, is_required: false, options: ['Male', 'Female', 'Other'] },
  { field_key: 'password', label: 'Password', type: 'password', enabled: true, is_required: false, placeholder: 'Enter password' },
  { field_key: 'confirm_password', label: 'Confirm Password', type: 'confirm_password', enabled: true, is_required: false, placeholder: 'Confirm password' },
  // { field_key: 'otp_code', label: 'OTP Code', type: 'text', enabled: true, is_required: false, placeholder: 'Enter OTP code' },
  // { field_key: 'verification_code', label: 'Verification Code', type: 'text', enabled: true, is_required: false, placeholder: 'Enter verification code' },
  { field_key: 'category', label: 'Category', type: 'select', enabled: true, is_required: false, options: [] },
  { field_key: 'options', label: 'Options', type: 'select', enabled: true, is_required: false, options: [] },
  { field_key: 'preferences', label: 'Preferences', type: 'select', enabled: true, is_required: false, options: [] },
  { field_key: 'interests', label: 'Interests', type: 'select', enabled: true, is_required: false, options: [] },
  { field_key: 'date_of_birth', label: 'Date of Birth', type: 'date', enabled: true, is_required: false },
  { field_key: 'start_date', label: 'Start Date', type: 'date', enabled: true, is_required: false },
  { field_key: 'end_date', label: 'End Date', type: 'date', enabled: true, is_required: false },
  { field_key: 'appointment_date', label: 'Appointment Date', type: 'date', enabled: true, is_required: false },
  { field_key: 'appointment_time', label: 'Appointment Time', type: 'time', enabled: true, is_required: false },
  { field_key: 'address', label: 'Address', type: 'textarea', enabled: true, is_required: false, placeholder: 'Enter your address' },
  { field_key: 'signature', label: 'Signature', type: 'signature', enabled: true, is_required: false },
  { field_key: 'rich_text_content', label: 'Rich Text Content', type: 'rich_text_content', enabled: true, is_required: false, placeholder: 'Enter rich text content' },
  { field_key: 'rating', label: 'Rating', type: 'rating', enabled: true, is_required: false },
  { field_key: 'location', label: 'Location', type: 'text', enabled: true, is_required: false, placeholder: 'Enter location' },
  { field_key: 'latitude', label: 'Latitude', type: 'number', enabled: true, is_required: false, placeholder: 'Enter latitude' },
  { field_key: 'longitude', label: 'Longitude', type: 'number', enabled: true, is_required: false, placeholder: 'Enter longitude' },
  { field_key: 'website_url', label: 'Website URL', type: 'url', enabled: true, is_required: false, placeholder: 'https://example.com' },
  { field_key: 'additional_info', label: 'Additional Info', type: 'textarea', enabled: true, is_required: false, placeholder: 'Any additional information' },
  { field_key: 'file_upload', label: 'File Upload', type: 'file_upload', enabled: true, is_required: false },
  { field_key: 'document', label: 'Document', type: 'file_upload', enabled: true, is_required: false },
  { field_key: 'profile_image', label: 'Profile Image', type: 'file_upload', enabled: true, is_required: false },
  { field_key: 'attachments', label: 'Attachments', type: 'file_upload', enabled: true, is_required: false },
];

export function CreateForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [linkExpiry, setLinkExpiry] = useState('');
  const [fixedFields, setFixedFields] = useState<FieldConfig[]>(DEFAULT_FIXED_FIELDS.map(f => ({ ...f })));
  const [dynamicFields, setDynamicFields] = useState<FieldConfig[]>([]);
  const [createdUrl, setCreatedUrl] = useState('');
  const [editingOptions, setEditingOptions] = useState<Record<string, boolean>>({});
  const [optionInput, setOptionInput] = useState<Record<string, string>>({});

  const createMutation = useMutation({
    mutationFn: createForm,
    onSuccess: (data) => {
      if (data.data) {
        setCreatedUrl(`${window.location.origin}/f/${data.data.form_token}`);
      }
    },
  });

  const addDynamicField = () => {
    setDynamicFields([
      ...dynamicFields,
      {
        field_key: `dynamic_field_${dynamicFields.length + 1}`,
        label: 'Custom Field',
        type: 'text',
        enabled: true,
        is_required: false,
      },
    ]);
  };

  const removeDynamicField = (index: number) => {
    setDynamicFields(dynamicFields.filter((_, i) => i !== index));
  };

  const updateFixedFieldOptions = (fieldKey: string, options: string[]) => {
    setFixedFields(fixedFields.map((f) =>
      f.field_key === fieldKey ? { ...f, options } : f
    ));
  };

  const updateDynamicField = (index: number, updates: Partial<FieldConfig>) => {
    const updated = [...dynamicFields];
    updated[index] = { ...updated[index], ...updates };
    if (updates.type === 'conditional_field' && !updated[index].options) {
      updated[index].options = ['Yes', 'No'];
    }
    setDynamicFields(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createMutation.mutate({
      title: title.trim(),
      description: description.trim() || undefined,
      enabled_fields: fixedFields,
      dynamic_fields: dynamicFields,
      link_expiry: linkExpiry || undefined,
    });
  };

  if (createdUrl) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Form Created Successfully!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
              <code className="text-sm flex-1 break-all">{createdUrl}</code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(createdUrl)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Link to="/admin/forms">
                <Button variant="outline">View All Forms</Button>
              </Link>
              <Button onClick={() => { setCreatedUrl(''); setTitle(''); setDescription(''); setLinkExpiry(''); setDynamicFields([]); }}>
                Create Another
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Create New Form</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Form Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter form title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter form description (optional)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry">Link Expiry (optional)</Label>
              <Input
                id="expiry"
                type="datetime-local"
                value={linkExpiry}
                onChange={(e) => setLinkExpiry(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fixed Fields</CardTitle>
            <CardDescription>
              These fields are always included. Full Name and Email are required, others are optional.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {fixedFields.map((field) => (
                <div key={field.field_key}>
                  <div className="flex items-center justify-between p-3 rounded-md border bg-card text-sm">
                    <div>
                      <span className="font-medium">{field.label}</span>
                      <span className="text-muted-foreground text-xs ml-2">({field.type})</span>
                    </div>
                    {field.is_required && (
                      <Badge variant="destructive" className="text-xs">Required</Badge>
                    )}
                  </div>

                  {/* {field.type === 'select' && field.field_key !== 'gender' && (
                    <DropdownOptionsEditor
                      options={field.options ?? []}
                      onChange={(options) => updateFixedFieldOptions(field.field_key, options)}
                    />
                  )} */}

                  {/* {field.type === 'select' && field.field_key === 'gender' && (
                    <div className="flex flex-wrap gap-1 mt-1 px-3 pb-2">
                      {(field.options ?? []).map((opt) => (
                        <span key={opt} className="inline-flex items-center px-2 py-0.5 rounded bg-muted text-xs text-muted-foreground">{opt}</span>
                      ))}
                    </div>
                  )} */}

                  {field.type === 'select' && field.field_key === 'country' && (
                    <div className="flex flex-wrap gap-1 mt-1 px-3 pb-2">
                      {(field.options ?? []).slice(0, 3).map((opt) => (
                        <span key={opt} className="inline-flex items-center px-2 py-0.5 rounded bg-muted text-xs text-muted-foreground">{opt}</span>
                      ))}
                      {(field.options ?? []).length > 3 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-muted text-xs text-muted-foreground">
                          +{(field.options ?? []).length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {field.type === 'select' && field.field_key === 'gender' && (
                    <div className="flex flex-wrap gap-1 mt-1 px-3 pb-2">
                      {(field.options ?? []).map((opt) => (
                        <span key={opt} className="inline-flex items-center px-2 py-0.5 rounded bg-muted text-xs text-muted-foreground">{opt}</span>
                      ))}
                    </div>
                  )}

                  {field.type === 'select' && field.field_key !== 'country' && field.field_key !== 'gender' && (
                    <DropdownOptionsEditor
                      options={field.options ?? []}
                      onChange={(options) => updateFixedFieldOptions(field.field_key, options)}
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Dynamic Fields</CardTitle>
              <CardDescription>Add custom fields specific to this form</CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addDynamicField}>
              <Plus className="w-4 h-4 mr-1" />
              Add Field
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {dynamicFields.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">
                No dynamic fields added yet. Click "Add Field" to create custom fields.
              </p>
            ) : (
              dynamicFields.map((field, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label>Field Key</Label>
                        <Input
                          value={field.field_key}
                          onChange={(e) => updateDynamicField(index, { field_key: e.target.value })}
                          placeholder="field_key"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Label</Label>
                        <Input
                          value={field.label}
                          onChange={(e) => updateDynamicField(index, { label: e.target.value })}
                          placeholder="Field Label"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Type</Label>
                        <select
                          value={field.type}
                          onChange={(e) => updateDynamicField(index, { type: e.target.value })}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="text">Text</option>
                          <option value="email">Email</option>
                          <option value="password">Password</option>
                          <option value="number">Number</option>
                          <option value="tel">Phone</option>
                          <option value="url">URL</option>
                          <option value="date">Date</option>
                          <option value="time">Time</option>
                          <option value="date_of_birth">Date of Birth</option>
                          <option value="start_date">Start Date</option>
                          <option value="end_date">End Date</option>
                          <option value="appointment_date">Appointment Date</option>
                          <option value="appointment_time">Appointment Time</option>
                          <option value="textarea">Textarea</option>
                          <option value="select">Select</option>
                          <option value="file_upload">File Upload</option>
                          <option value="signature">Signature</option>
                          <option value="rating">Rating</option>
                          <option value="repeatable_group">Repeatable Group</option>
                          <option value="conditional_field">Conditional Field</option>
                        </select>
                      </div>
                      {field.type !== 'select' && field.type !== 'country' && field.type !== 'state' && field.type !== 'city' && field.type !== 'gender' && field.type !== 'category' && field.type !== 'options' && field.type !== 'preferences' && field.type !== 'interests' && (
                        <div className="space-y-1">
                          <Label>Placeholder</Label>
                          <Input
                            value={field.placeholder ?? ''}
                            onChange={(e) => updateDynamicField(index, { placeholder: e.target.value })}
                            placeholder="Placeholder text"
                          />
                        </div>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDynamicField(index)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {(field.type === 'select' || field.type === 'country' || field.type === 'state' || field.type === 'city' || field.type === 'gender' || field.type === 'category' || field.type === 'options' || field.type === 'preferences' || field.type === 'interests') && (
                    <div className="space-y-2 pt-2 border-t">
                      <Label>Dropdown Options</Label>
                      <div className="flex flex-wrap gap-2">
                        {(field.options ?? []).filter((o) => o).map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center gap-1 bg-muted rounded-md px-2 py-1">
                            <span className="text-sm">{option}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const originalIdx = (field.options ?? []).indexOf(option);
                                const newOptions = (field.options ?? []).filter((_, i) => i !== originalIdx);
                                updateDynamicField(index, { options: newOptions });
                              }}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        {!editingOptions[index] ? (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingOptions({ ...editingOptions, [index]: true });
                              setOptionInput({ ...optionInput, [index]: '' });
                            }}
                            className="flex items-center gap-1 px-2 py-1 rounded-md border border-dashed border-input hover:bg-muted text-sm text-muted-foreground"
                          >
                            <Plus className="w-3 h-3" />
                            Add Option
                          </button>
                        ) : (
                          <div className="flex gap-2 w-full mt-2">
                            <Input
                              placeholder="Enter option text"
                              value={optionInput[index] ?? ''}
                              onChange={(e) => {
                                setOptionInput({ ...optionInput, [index]: e.target.value });
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const val = optionInput[index]?.trim();
                                  if (val) {
                                    const newOptions = [...(field.options ?? []), val];
                                    updateDynamicField(index, { options: newOptions });
                                  }
                                  setOptionInput({ ...optionInput, [index]: '' });
                                  setEditingOptions({ ...editingOptions, [index]: false });
                                }
                              }}
                              className="max-w-xs"
                              autoFocus
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const val = optionInput[index]?.trim();
                                if (val) {
                                  const newOptions = [...(field.options ?? []), val];
                                  updateDynamicField(index, { options: newOptions });
                                }
                                setOptionInput({ ...optionInput, [index]: '' });
                                setEditingOptions({ ...editingOptions, [index]: false });
                              }}
                            >
                              Add
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setOptionInput({ ...optionInput, [index]: '' });
                                setEditingOptions({ ...editingOptions, [index]: false });
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {field.type === 'conditional_field' && (
                    <div className="space-y-2 pt-2 border-t">
                      <Label>Condition Options (Radio Buttons)</Label>
                      <div className="space-y-2">
                        {(field.options ?? []).map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground w-6">{optIndex + 1}.</span>
                            <Input
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...(field.options ?? [])];
                                newOptions[optIndex] = e.target.value;
                                updateDynamicField(index, { options: newOptions });
                              }}
                              placeholder={`Option ${optIndex + 1}`}
                              className="max-w-xs"
                            />
                            {(field.options ?? []).length > 2 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newOptions = (field.options ?? []).filter((_, i) => i !== optIndex);
                                  updateDynamicField(index, { options: newOptions });
                                }}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const newOptions = [...(field.options ?? []), ''];
                            updateDynamicField(index, { options: newOptions });
                          }}
                          className="flex items-center gap-1 px-2 py-1 rounded-md border border-dashed border-input hover:bg-muted text-sm text-muted-foreground"
                        >
                          <Plus className="w-3 h-3" />
                          Add Option
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={field.enabled}
                        onChange={(e) => updateDynamicField(index, { enabled: e.target.checked })}
                        className="rounded"
                      />
                      Enabled
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={field.is_required ?? false}
                        onChange={(e) => updateDynamicField(index, { is_required: e.target.checked })}
                        className="rounded"
                      />
                      Required
                    </label>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Link to="/admin">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={!title.trim() || createMutation.isPending}>
            {createMutation.isPending ? 'Creating...' : 'Create Form'}
          </Button>
        </div>
      </form>
    </div>
  );
}
