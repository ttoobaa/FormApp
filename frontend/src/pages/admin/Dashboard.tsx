import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your forms and submissions</p>
        </div>
        <Link to="/admin/forms/create">
          <Button>Create New Form</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">All Forms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">View and manage all your forms</p>
            <Link to="/admin/forms">
              <Button variant="outline" className="mt-4 w-full">View Forms</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Create Form</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Generate a new form with custom fields</p>
            <Link to="/admin/forms/create">
              <Button className="mt-4 w-full">Create Form</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
