import { useNavigate } from 'react-router-dom';

import LoginForm from '../components/LoginForm';
import AuthLayout from '../../../shared/layouts/AuthLayout';

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <AuthLayout
      title="Welcome back 👋"
      subtitle="Sign in to continue to Loan Software"
    >
      <LoginForm
        onSuccess={() => {
          navigate('/home');
        }}
      />
    </AuthLayout>
  );
}
