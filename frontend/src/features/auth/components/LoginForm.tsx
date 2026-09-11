import { useState } from 'react';
import { Alert, Box, Button, Link, Stack, TextField } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { login, saveAccessToken } from '../services/auth.service';

interface LoginFormProps {
  onSuccess: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError('');

      const response = await login({
        email,
        password,
      });

      saveAccessToken(response.accessToken, true);

      onSuccess();
    } catch {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={3}>
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

        <Button type="submit" variant="contained" disabled={loading} fullWidth>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>

        <Box
          sx={{
            textAlign: 'center',
          }}
        >
          <Link component={RouterLink} to="/sign-up" underline="hover">
            Don't have an account? Create one
          </Link>
        </Box>
      </Stack>
    </Box>
  );
}
