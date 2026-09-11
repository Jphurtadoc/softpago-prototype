import { createBrowserRouter } from 'react-router-dom';

import { MainLayout } from '@/shared/components/layouts/MainLayout';

import { DEFAULT_ITEMS } from '@/shared/components/Navbar/defaultNavItems';

import { HomePage } from '@/pages/dashboard/HomePage';
import { PaymentsPage } from '@/pages/dashboard/PaymentsPage';
import { SettingsPage } from '@/pages/dashboard/SettingsPage';
import { ReportsPage } from '@/pages/dashboard/ReportsPage';

import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';

import LoansPage from '@/features/loans/pages/LoansPage';
import CreateLoanPage from '@/features/loans/pages/CreateLoanPage';
import EditLoanPage from '@/features/loans/pages/EditLoanPage';
import LoanDetailsPage from '@/features/loans/pages/LoanDetailsPage';

import RoutesPage from '@/features/routes/pages/RoutesPage';
import CreateRoutePage from '@/features/routes/pages/CreateRoutePage';
import EditRoutePage from '@/features/routes/pages/EditRoutePage';
import RouteDetailsPage from '@/features/routes/pages/RouteDetailsPage';

import type { ComponentType } from 'react';

// Connect each NavItem id with its corresponding page.
// If you add a new item to DEFAULT_ITEMS (in defaultNavItems.tsx),
// you only need to add its component here — no need to touch
// the dashboard routes array.

const PAGE_BY_ID: Record<string, ComponentType> = {
  inicio: HomePage,
  pagos: PaymentsPage,
  configuraciones: SettingsPage,
  reportes: ReportsPage,
  prestamos: LoansPage,
  rutas: RoutesPage,
};

const dashboardRoutes = DEFAULT_ITEMS.map((item) => {
  const Page = PAGE_BY_ID[item.id];

  return {
    path: item.url,
    element: <Page />,
  };
});

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },

  {
    path: '/registro',
    element: <RegisterPage />,
  },

  {
    path: '/olvide-contrasena',
    element: <ForgotPasswordPage />,
  },

  {
    element: <MainLayout />,
    children: [
      ...dashboardRoutes,

      {
        path: '/loans/new',
        element: <CreateLoanPage />,
      },

      {
        path: '/loans/:id',
        element: <LoanDetailsPage />,
      },

      {
        path: '/loans/:id/edit',
        element: <EditLoanPage />,
      },

      {
        path: '/routes/new',
        element: <CreateRoutePage />,
      },

      {
        path: '/routes/:id',
        element: <RouteDetailsPage />,
      },

      {
        path: '/routes/:id/edit',
        element: <EditRoutePage />,
      },
    ],
  },
]);
