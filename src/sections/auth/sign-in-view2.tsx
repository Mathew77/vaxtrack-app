import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import { useNavigate } from 'react-router-dom';
import { Iconify } from 'src/components/iconify';
import { useMutation } from '@tanstack/react-query';
import { login, LoginResponse, LoginVariables } from '../../hooks/apis/auth/auth-api';
import { useAuth } from '../../contexts/AuthContext';
import { RouterLink } from 'src/routes/components';

export function SignInView2() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { setToken } = useAuth();

  const roleMapping: { [key: string]: string } = {
    nationalstrategiccoldstore: 'ncs',
    equippedhealthfacility: 'ehf',
    unequippedhealthfacility: 'uhf',
    localcoldchainstore: 'lcs',
    statecoldchainstore: 'scs',
    statelogisticsworkinggroup: 'slwg',
    mobilecoldchainstore: 'mcco',
    mobilecoldchainofficer: 'mcco',
    '3pl': 'threepl',
    conveyor: 'conveyor',
    mcco: 'mcco',
    admin: 'admin',
    guest: 'guest',
  };

  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const { mutate: loginUser, status, error } = useMutation<LoginResponse, Error, LoginVariables>({
    mutationFn: login,
    onSuccess: (data: LoginResponse) => {
      console.log('Login Response Full Data:', data);
      console.log('SLWG List from API:', data.userdata?.slwg_list);

      setToken(data.access);
      if (data.access) {
        localStorage.setItem('token', data.access);
      }
      sessionStorage.setItem('username', username);
      sessionStorage.setItem('firstName', data.userdata?.first_name || '');
      sessionStorage.setItem('lastName', data.userdata?.last_name || '');
      sessionStorage.setItem('ehf_list', JSON.stringify(data.userdata?.ehf_list || []));
      sessionStorage.setItem('uhf_list', JSON.stringify(data.userdata?.uhf_list || []));
      sessionStorage.setItem('ncs_list', JSON.stringify(data.userdata?.ncs_list || []));
      sessionStorage.setItem('scs_list', JSON.stringify(data.userdata?.scs_list || []));
      sessionStorage.setItem('lcs_list', JSON.stringify(data.userdata?.lcs_list || []));
      sessionStorage.setItem('slwg_list', JSON.stringify(data.userdata?.slwg_list || []));
      sessionStorage.setItem('threepl_list', JSON.stringify(data.userdata?.threepl_list || []));
      sessionStorage.setItem('conveyor_list', JSON.stringify(data.userdata?.conveyor_list || []));
      sessionStorage.setItem('email', data.userdata?.email || '');

      console.log('Stored slwg_list in sessionStorage:', sessionStorage.getItem('slwg_list'));

      const fullRoleName = data.userdata?.groups[0]?.name
        .toLowerCase()
        .replace(/\s+/g, '');
      console.log(fullRoleName);
      const mappedRole = roleMapping[fullRoleName] || 'guest';
      console.log(mappedRole);
      if (mappedRole) {
        sessionStorage.setItem('userRole', mappedRole);
        navigate(`/${mappedRole}-home`);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser({ username, password });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'rgba(255, 255, 255, 0.5)'
      }}
    >
      <Grid container sx={{ width: '90%', height: '80vh', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)', borderRadius: 1 }}>
        {/* Left side - Sign in form */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default',
            p: 3
          }}
        >
        <Box sx={{ width: '100%', maxWidth: 450, px: 3 }}>
          <Typography
              variant="h4"
              fontWeight="bold"
              sx={{
                letterSpacing: 1,
                color: 'rgb(12,125,64)',
                textTransform: 'uppercase',
                textShadow: '1px 1px 4px rgba(0, 0, 0, 0.2)',
                textAlign: 'center',
                mb: 4
              }}
            >
              VAXTRACK
            </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              name="username"
              label="Username"
              placeholder="Enter username"
              value={username}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 3 }}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              name="password"
              label="Password"
              placeholder="••••••••"
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
              variant="contained"
              onClick={handleSubmit}
              disabled={status === 'pending'}
              sx={{
                mb: 3,
                bgcolor: 'rgb(12,125,64)',
                '&:hover': {
                  bgcolor: 'rgb(10,105,54)',
                },
                textTransform: 'none',
                fontSize: '16px',
                py: 1.5
              }}
            >
              {status === 'pending' ? 'Signing in...' : 'Sign in'}
            </LoadingButton>

            {error && (
              <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
                {error.message}
              </Typography>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 2 }}>
              <Box
                component="img"
                src="/assets/images/sign-in/sign-in-logo-remove1.png"
                alt="Sign in logo"
                sx={{ height: 60, objectFit: 'contain' }}
              />
              <Box
                component="img"
                src="/assets/images/sign-in/sign-in-logo2-remove2.png"
                alt="Sign in logo 2"
                sx={{ height: 60, objectFit: 'contain' }}
              />
            </Box>

            {/* <Link
              component={RouterLink}
              href="#"
              color="inherit"
              sx={{
                typography: 'body2',
                display: 'block',
                textAlign: 'center',
                mt: 2
              }}
            >
              Need help?
            </Link> */}
          </Box>
        </Box>
      </Grid>

      {/* Right side - Welcome message */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: 'url(/assets/images/sign-in/login-image.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          p: 5,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(12, 125, 64, 0.2)',
            zIndex: 1
          }
        }}
      >
        {/* <Box sx={{ textAlign: 'center', color: 'white', maxWidth: 500, position: 'relative', zIndex: 2 }}>
          <Typography
            variant="h3"
            sx={{
              mb: 3,
              fontWeight: 700,
              letterSpacing: 1
            }}
          >
            🌍 Welcome to VaxTrack
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              fontWeight: 400,
              lineHeight: 1.6,
              opacity: 0.95
            }}
          >
            Empowering Smarter, Safer, and More Transparent Vaccine Distribution

            VaxTrack ensures that vaccines reach every community safely, efficiently, and on time.
          </Typography>
        </Box> */}
      </Grid>
    </Grid>

    <Backdrop
      sx={{
        color: 'rgb(12, 125, 64)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backdropFilter: 'blur(10px)',
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        display: 'flex',
        flexDirection: 'column',
        gap: 4
      }}
      open={status === 'pending'}
    >
      <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Outer rotating ring with glow */}
        <CircularProgress
          size={140}
          thickness={2.5}
          sx={{
            color: 'rgb(12, 125, 64)',
            opacity: 0.4,
            filter: 'blur(2px)'
          }}
        />
        {/* Main rotating ring */}
        <CircularProgress
          size={140}
          thickness={3}
          sx={{
            color: 'rgb(12, 125, 64)',
            position: 'absolute',
            left: 0,
            animationDuration: '1.2s',
            filter: 'drop-shadow(0 0 8px rgba(12, 125, 64, 0.4))'
          }}
          variant="indeterminate"
        />
        {/* Counter-rotating inner ring */}
        <CircularProgress
          size={110}
          thickness={2}
          sx={{
            color: 'rgba(12, 125, 64, 0.6)',
            position: 'absolute',
            left: 0,
            right: 0,
            margin: 'auto',
            animation: 'rotate-reverse 2s linear infinite',
            '@keyframes rotate-reverse': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(-360deg)' }
            }
          }}
          variant="indeterminate"
        />
        {/* Center pulsing icon */}
        <Box
          sx={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'pulse-scale 2s ease-in-out infinite',
            '@keyframes pulse-scale': {
              '0%, 100%': { transform: 'scale(1)', opacity: 1 },
              '50%': { transform: 'scale(1.1)', opacity: 0.8 }
            }
          }}
        >
          <Iconify
            icon="healthicons:medicines"
            width={60}
            sx={{
              color: 'rgb(12, 125, 64)',
              filter: 'drop-shadow(0 2px 8px rgba(12, 125, 64, 0.3))'
            }}
          />
        </Box>
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: 'rgb(12, 125, 64)',
            mb: 1,
            animation: 'fade-in-out 1.5s ease-in-out infinite',
            '@keyframes fade-in-out': {
              '0%, 100%': { opacity: 1 },
              '50%': { opacity: 0.5 }
            }
          }}
        >
          Loading.........
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontStyle: 'italic',
            fontWeight: 500
          }}
        >
          Now proceeding to the dashboard
        </Typography>
      </Box>
    </Backdrop>
    </Box>
  );
}