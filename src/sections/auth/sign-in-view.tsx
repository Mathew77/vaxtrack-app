import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useNavigate } from 'react-router-dom';
import { Iconify } from 'src/components/iconify';
import { useMutation } from '@tanstack/react-query';
import { login, LoginResponse, LoginVariables } from '../../hooks/apis/auth/auth-api';
import { useAuth } from '../../contexts/AuthContext';
import { apiHelper } from '../../hooks/apis/apiHelper';

// ----------------------------------------------------------------------

export function SignInView() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { setToken } = useAuth();

  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);


  const { mutate: loginUser, status, error } = useMutation<LoginResponse, Error, LoginVariables>({
    mutationFn: login,
    onSuccess: (data: LoginResponse) => {
      setToken(data.access);
      apiHelper.setToken(data.access); // Set the token in apiHelper

      sessionStorage.setItem('username', username);
      navigate('/admin-home'); // Navigate to the dashboard or home page
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser({ username, password });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <TextField
        fullWidth
        name="email"
        label="Email address"
        value={username}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
        onChange={handleChange}
      />

      <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
        Forgot password?
      </Link>

      <TextField
        fullWidth
        name="password"
        label="Password"
        value={password}
        InputLabelProps={{ shrink: true }}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
        onChange={(e) => setPassword(e.target.value)}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleSubmit}
        disabled={status === 'pending'}
      >
        {status === 'pending' ? 'Signing in...' : 'Sign In'}
      </LoadingButton>
      {error && <div style={{ color: 'red' }}>Error: {error.message}</div>}
    </Box>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Sign in</Typography>
      </Box>
      {renderForm}
    </>
  );
}