import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getPublicForm, submitForm } from '@/api/forms';
import { DynamicFormRenderer } from '@/components/form/DynamicFormRenderer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export function PublicForm() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['public-form', token],
    queryFn: () => getPublicForm(token!),
    enabled: !!token,
  });

  const submitMutation = useMutation({
    mutationFn: ({ data: formData }: { data: Record<string, unknown> }) =>
      submitForm(token!, formData),
    onSuccess: () => {
      navigate('/submitted');
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-muted-foreground">Loading form...</p>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <AlertCircle className="w-12 h-12 text-destructive mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                {data?.message || 'Form Unavailable'}
              </h2>
              <p className="text-muted-foreground">
                This form may have already been submitted, expired, or does not exist.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const form = data.data;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 flex items-start justify-center p-4 py-8 sm:py-12">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-3">
          <CardTitle className="text-2xl sm:text-3xl">{form.title}</CardTitle>
          {form.description && (
            <CardDescription className="text-base">{form.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <DynamicFormRenderer
            fields={form.enabled_fields}
            dynamicFields={form.dynamic_fields}
            onSubmit={(formData) => submitMutation.mutate({ data: formData })}
            disabled={submitMutation.isPending}
          />
          {submitMutation.error && (
            <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>
                {submitMutation.error instanceof Error
                  ? submitMutation.error.message
                  : 'Failed to submit form'}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
