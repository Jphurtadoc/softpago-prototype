import { createBrowserRouter } from 'react-router-dom';

import type { DictionaryNamespace } from '@/dictionaries';
import {
  DocumentTitleOutlet,
  type DocumentTitleHandle,
} from '@/shared/components/layouts/DocumentTitleOutlet';
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
  reportes: ReportsPage,
  prestamos: LoansPage,
  rutas: RoutesPage,
};

const DOCUMENT_TITLE_NS_BY_ID: Record<string, DictionaryNamespace> = {
  inicio: 'home/overview',
  pagos: 'payments/dashboard',
  reportes: 'reports/dashboard',
  prestamos: 'loans/list',
  rutas: 'routes/list',
};

/**
 * Builds a route handle that maps a screen to its document title key.
 */
function createDocumentTitleHandle(
  documentTitleNs: DictionaryNamespace,
  documentTitleKey?: string,
): DocumentTitleHandle {
  return documentTitleKey
    ? { documentTitleNs, documentTitleKey }
    : { documentTitleNs };
}

const dashboardRoutes = DEFAULT_ITEMS.map((item) => {
  const Page = PAGE_BY_ID[item.id];

  return {
    path: item.url,
    element: <Page />,
    handle: createDocumentTitleHandle(DOCUMENT_TITLE_NS_BY_ID[item.id]),
  };
});

export const router = createBrowserRouter([
  {
    element: <DocumentTitleOutlet />,
    children: [
      {
        path: '/',
        element: <LoginPage />,
      },

      {
        path: '/registro',
        element: <RegisterPage />,
        handle: createDocumentTitleHandle('auth/create-account'),
      },

      {
        path: '/olvide-contrasena',
        element: <ForgotPasswordPage />,
        handle: createDocumentTitleHandle('auth/forgot-password'),
      },

      {
        element: <MainLayout />,
        children: [
          ...dashboardRoutes,

          {
            path: '/configuraciones',
            element: <SettingsPage />,
            handle: createDocumentTitleHandle('settings/page'),
          },

          {
            path: '/loans/new',
            element: <CreateLoanPage />,
            handle: createDocumentTitleHandle('loans/list', 'createLoan'),
          },

          {
            path: '/loans/:id',
            element: <LoanDetailsPage />,
            handle: createDocumentTitleHandle('loans/details'),
          },

          {
            path: '/loans/:id/edit',
            element: <EditLoanPage />,
            handle: createDocumentTitleHandle('loans/edit'),
          },

          {
            path: '/routes/new',
            element: <CreateRoutePage />,
            handle: createDocumentTitleHandle('routes/list', 'createRoute'),
          },

          {
            path: '/routes/:id',
            element: <RouteDetailsPage />,
            handle: createDocumentTitleHandle('routes/details', 'titleFallback'),
          },

          {
            path: '/routes/:id/edit',
            element: <EditRoutePage />,
            handle: createDocumentTitleHandle('routes/edit'),
          },
        ],
      },
    ],
  },
]);
