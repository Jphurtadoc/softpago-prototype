import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import LoginPage from './features/auth/pages/LoginPage';
import SignUpPage from './features/auth/pages/SignUpPage';

import RoutesPage from './features/routes/pages/RoutesPage';
import CreateRoutePage from './features/routes/pages/CreateRoutePage';
import EditRoutePage from './features/routes/pages/EditRoutePage';
import RouteDetailsPage from './features/routes/pages/RouteDetailsPage';

function HomePage() {
  return <h1>Welcome to Loan Software</h1>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/sign-up" element={<SignUpPage />} />

        <Route path="/home" element={<HomePage />} />

        <Route path="/routes" element={<RoutesPage />} />

        <Route path="/routes/new" element={<CreateRoutePage />} />

        <Route path="/routes/:id" element={<RouteDetailsPage />} />

        <Route path="/routes/:id/edit" element={<EditRoutePage />} />
      </Routes>
    </BrowserRouter>
  );
}
