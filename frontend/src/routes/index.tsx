import { createBrowserRouter } from 'react-router-dom';
import { AdminLayout } from '@/layouts/AdminLayout';
import { AdminDashboard } from '@/pages/admin/Dashboard';
import { FormList } from '@/pages/admin/FormList';
import { CreateForm } from '@/pages/admin/CreateForm';
import { FormDetails } from '@/pages/admin/FormDetails';
import { ViewSubmission } from '@/pages/admin/ViewSubmission';
import { PublicForm } from '@/pages/public/PublicForm';
import { SuccessPage } from '@/pages/public/SuccessPage';

export const router = createBrowserRouter([
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'forms', element: <FormList /> },
      { path: 'forms/create', element: <CreateForm /> },
      { path: 'forms/:formId', element: <FormDetails /> },
      { path: 'forms/:formId/submission', element: <ViewSubmission /> },
    ],
  },
  {
    path: '/f/:token',
    element: <PublicForm />,
  },
  {
    path: '/submitted',
    element: <SuccessPage />,
  },
  {
    path: '/',
    element: <AdminDashboard />,
  },
]);
