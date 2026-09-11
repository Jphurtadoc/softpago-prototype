import { useState } from 'react';
import { Alert, Box, Button, Link, Stack, TextField } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface SignUpFormProps {
  onSuccess?: () => void;
}

export default function SignUpForm(_props: SignUpFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(
      'El registro no está disponible en el prototipo. Usa root@answertic.co',
    );
    setLoading(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={3}>
        {success && <Alert severity="success">{success}</Alert>}

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Email"
          type="email"
          placeholder="john@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <TextField
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <Button type="submit" variant="contained" fullWidth disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </Button>

        <Box
          sx={{
            textAlign: 'center',
          }}
        >
          <Link component={RouterLink} to="/login" underline="hover">
            Already have an account? Sign in
          </Link>
        </Box>
      </Stack>
    </Box>
  );
}
