import SignUpForm from '../components/SignUpForm';
import AuthLayout from '../../../shared/layouts/AuthLayout';

export default function SignUpPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start using Loan Software"
    >
      <SignUpForm />
    </AuthLayout>
  );
}
