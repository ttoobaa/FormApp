import { Outlet, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, FileText, PlusCircle } from 'lucide-react';

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-6xl">
          <Link to="/admin" className="font-bold text-lg">
            Unique Form Generator
          </Link>
          <nav className="flex items-center gap-2">
            <Link to="/admin">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                <LayoutDashboard className="w-4 h-4 mr-1" />
                Dashboard
              </Button>
            </Link>
            <Link to="/admin/forms">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                <FileText className="w-4 h-4 mr-1" />
                Forms
              </Button>
            </Link>
            <Link to="/admin/forms/create">
              <Button size="sm">
                <PlusCircle className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Create</span>
              </Button>
            </Link>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
