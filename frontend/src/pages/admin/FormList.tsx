import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getForms, deleteForm } from '@/api/admin';
import { FormCard } from '@/components/dashboard/FormCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search } from 'lucide-react';

export function FormList() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data, isLoading } = useQuery({
    queryKey: ['forms'],
    queryFn: getForms,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteForm,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['forms'] }),
  });

  const forms = data?.data ?? [];

  const filteredForms = forms.filter((form) => {
    const matchesSearch =
      search === '' ||
      form.form_id.toLowerCase().includes(search.toLowerCase()) ||
      form.form_token.toLowerCase().includes(search.toLowerCase()) ||
      form.title.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || form.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">All Forms</h1>
          <p className="text-muted-foreground mt-1">{forms.length} total forms</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by form ID, token, or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="flex h-10 w-full sm:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Submitted">Submitted</option>
          <option value="Expired">Expired</option>
        </select>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading forms...</p>
        </div>
      ) : filteredForms.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {search || statusFilter !== 'all'
              ? 'No forms match your filters.'
              : 'No forms created yet.'}
          </p>
          {!search && statusFilter === 'all' && (
            <Link to="/admin/forms/create">
              <Button>Create Your First Form</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredForms.map((form) => (
            <FormCard
              key={form.form_id}
              form={form}
              onDelete={(formId) => {
                if (window.confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
                  deleteMutation.mutate(formId);
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
