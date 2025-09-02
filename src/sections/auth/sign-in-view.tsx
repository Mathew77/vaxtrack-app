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
import { RouterLink } from 'src/routes/components';


// ----------------------------------------------------------------------


export function SignInView() {
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
   '3pl': 'threepl',
   conveyor: 'conveyor',
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
    
    //   console.log('Login successful:', JSON.stringify(data, null, 2));
    //  console.log('Access Token:', data.userdata.groups[0]?.name);
    //  console.log('Username:', data.userdata);
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
      sessionStorage.setItem('email', data.userdata?.email || '');

      // sessionStorage.setItem('email', email);

     const fullRoleName = data.userdata?.groups[0]?.name
       .toLowerCase()
       .replace(/\s+/g, '');
       console.log(fullRoleName)
     const mappedRole = roleMapping[fullRoleName] || 'guest';
     console.log(mappedRole)
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


 const renderForm = (
   <Box display="flex" flexDirection="column" alignItems="center">
     <TextField
       fullWidth
       name="email"
       label="Username"
       value={username}
       InputLabelProps={{ shrink: true }}
       sx={{ mb: 3 }}
       onChange={handleChange}
     />


     {/* <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
       Forgot password?
     </Link> */}


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
      <Link
        component={RouterLink}
        href="#"
        color="inherit"
        sx={{ typography: 'subtitle2', mt : 1 }}
      >
        Need help?
      </Link>
   </Box>
 );


 return (
   <>
     <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
      <Typography
        variant="h4" 
        fontWeight="bold"
        sx={{
          letterSpacing: 1,
          color: 'primary.main',
          textTransform: 'uppercase',
          textShadow: '1px 1px 4px rgba(0, 0, 0, 0.2)',
        }}
      >
        VAXTRACK
      </Typography>
       <Typography variant="h5">Sign in</Typography>
     </Box>
     {renderForm}
   </>
 );
}
