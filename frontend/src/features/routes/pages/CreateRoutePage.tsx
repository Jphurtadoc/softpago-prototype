import { useNavigate } from 'react-router-dom';

import RouteForm from '../components/RouteForm';

export default function CreateRoutePage() {
  const navigate = useNavigate();

  return (
    <RouteForm
      onSuccess={() => {
        navigate('/routes');
      }}
      onCancel={() => {
        navigate('/routes');
      }}
    />
  );
}
