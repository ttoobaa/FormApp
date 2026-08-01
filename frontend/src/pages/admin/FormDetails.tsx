import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getForm } from '@/api/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

export function FormDetails() {
  const { formId } = useParams<{ formId: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ['form', formId],
    queryFn: () => getForm(formId!),
    enabled: !!formId,
  });

  const form = data?.data;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <p className="text-muted-foreground text-center">Loading form details...</p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
        <p className="text-muted-foreground">Form not found.</p>
        <Link to="/admin/forms">
          <Button className="mt-4">Back to Forms</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin/forms">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{form.title}</h1>
          <p className="text-muted-foreground mt-1">Form Details</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Form ID</span>
              <span className="font-mono">{form.form_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Token</span>
              <span className="font-mono">{form.form_token}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge
                variant={
                  form.status === 'Active'
                    ? 'success'
                    : form.status === 'Submitted'
                    ? 'default'
                    : 'warning'
                }
              >
                {form.status}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created</span>
              <span>{new Date(form.created_at).toLocaleString()}</span>
            </div>
            {form.submitted_at && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Submitted</span>
                <span>{new Date(form.submitted_at).toLocaleString()}</span>
              </div>
            )}
            {form.link_expiry && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expires</span>
                <span>{new Date(form.link_expiry).toLocaleString()}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{form.description || 'No description provided.'}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Enabled Fields ({form.enabled_fields.filter((f) => f.enabled).length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {form.enabled_fields.map((field) => (
              <div
                key={field.field_key}
                className={`p-3 rounded-md border text-sm ${
                  field.enabled ? 'bg-background' : 'bg-muted opacity-50'
                }`}
              >
                <div className="font-medium">{field.label}</div>
                <div className="text-muted-foreground text-xs">{field.field_key}</div>
                <div className="text-muted-foreground text-xs">{field.type}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {form.dynamic_fields && form.dynamic_fields.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Dynamic Fields ({form.dynamic_fields.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {form.dynamic_fields.map((field) => (
                <div key={field.field_key} className="p-3 rounded-md border text-sm">
                  <div className="font-medium">{field.label}</div>
                  <div className="text-muted-foreground text-xs">{field.field_key}</div>
                  <div className="text-muted-foreground text-xs">{field.type}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
