import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { FormListItem } from '@/types';
import { Copy, Trash2, Eye, ExternalLink } from 'lucide-react';

interface FormCardProps {
  form: FormListItem;
  onDelete: (formId: string) => void;
}

export function FormCard({ form, onDelete }: FormCardProps) {
  const [copied, setCopied] = useState(false);

  const publicUrl = `${window.location.origin}/f/${form.form_token}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error('Failed to copy');
    }
  };

  const getStatusBadge = () => {
    switch (form.status) {
      case 'Active':
        return <Badge variant="success">Active</Badge>;
      case 'Submitted':
        return <Badge variant="default">Submitted</Badge>;
      case 'Expired':
        return <Badge variant="warning">Expired</Badge>;
      default:
        return <Badge variant="outline">{form.status}</Badge>;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg truncate">{form.title}</CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Form ID</span>
            <span className="font-mono text-xs">{form.form_id.slice(0, 8)}...</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Token</span>
            <span className="font-mono text-xs">{form.form_token.slice(0, 8)}...</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Created</span>
            <span>{new Date(form.created_at).toLocaleDateString()}</span>
          </div>
          {form.submitted_at && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Submitted</span>
              <span>{new Date(form.submitted_at).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={handleCopy} className="flex-1">
            <Copy className="w-4 h-4 mr-1" />
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
          <Link to={`/admin/forms/${form.form_id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <Eye className="w-4 h-4 mr-1" />
              Details
            </Button>
          </Link>
          {form.is_submitted && (
            <Link to={`/admin/forms/${form.form_id}/submission`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="w-4 h-4 mr-1" />
                View
              </Button>
            </Link>
          )}
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(form.form_id)}
            className="flex-1"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
