import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSubmission } from '@/api/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Download } from 'lucide-react';

type FileInfo = { url: string; name: string };

function detectFileValue(value: unknown): FileInfo | null {
  if (typeof value !== 'string') return null;
  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed.url === 'string' && typeof parsed.name === 'string') {
      return parsed;
    }
  } catch {
    return null;
  }
  return null;
}

export function ViewSubmission() {
  const { formId } = useParams<{ formId: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ['submission', formId],
    queryFn: () => getSubmission(formId!),
    enabled: !!formId,
  });

  const submission = data?.data;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <p className="text-muted-foreground text-center">Loading submission...</p>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
        <Card>
          <CardContent className="py-12">
            <p className="text-muted-foreground text-lg">Not Submitted</p>
            <p className="text-muted-foreground mt-2">This form has not been submitted yet.</p>
            <Link to="/admin/forms">
              <Button className="mt-4">Back to Forms</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderValue = (value: unknown) => {
    if (value === null || value === undefined) return <span className="text-muted-foreground">N/A</span>;

    const fileInfo = detectFileValue(value);
    if (fileInfo) {
      return (
        <a
          href={fileInfo.url}
          target="_blank"
          rel="noopener noreferrer"
          download={fileInfo.name}
          className="inline-flex items-center gap-2 text-primary hover:underline"
        >
          <FileText className="w-4 h-4" />
          <span>{fileInfo.name}</span>
          <Download className="w-3 h-3" />
        </a>
      );
    }

    if (typeof value === 'string' && value.startsWith('data:image/')) {
      return <img src={value} alt="Signature" className="max-w-xs max-h-32 border rounded" />;
    }

    if (typeof value === 'object') {
      return <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(value, null, 2)}</pre>;
    }

    return <span>{String(value)}</span>;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin/forms">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Submission</h1>
          <p className="text-muted-foreground mt-1">
            Submitted on {new Date(submission.submitted_at).toLocaleString()}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Submission Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(submission.data).map(([key, value]) => (
              <div key={key} className="border-b pb-3 last:border-b-0">
                <div className="font-medium text-sm text-muted-foreground capitalize">
                  {key.replace(/_/g, ' ')}
                </div>
                <div className="mt-1 text-sm break-words">
                  {renderValue(value)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex gap-2">
        <Link to="/admin/forms">
          <Button variant="outline">Back to Forms</Button>
        </Link>
      </div>
    </div>
  );
}
