import { useState, useCallback, useEffect } from 'react';


import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';


import { useNavigate } from 'react-router-dom';
import { Iconify } from 'src/components/iconify';


// ----------------------------------------------------------------------


export function SignInView() {
 const navigate = useNavigate();


 const [username, setUsername] = useState('');
 const [showPassword, setShowPassword] = useState(false);


 useEffect(() => {
   const storedUsername = sessionStorage.getItem('username')
   if(storedUsername){
     setUsername(storedUsername)
   }
 }, []);


 const handleSignIn = useCallback(() => {
   const allowedRoles = ['admin', 'ehf', 'uhf', 'lcs', 'scs', 'slwg', 'threepl', 'conveyor'];
   const userRole = allowedRoles.find((role) => username.toLowerCase().includes(role));




   if (userRole) {
     sessionStorage.setItem('username', username);
     const targetPath = `/${userRole}-home`;
     // console.log('Navigating to:', targetPath);
     navigate(targetPath);
   } else {
     navigate('/unauthorized');
   }
 }, [username, navigate]);


 const handleChange = (e: any) => {
   // console.log("my e", e.target.value)
   setUsername(e.target.value)
   console.log("user", username);


 }
 const renderForm = (
   <Box display="flex" flexDirection="column" alignItems="flex-end">
     <TextField
       fullWidth
       name="email"
       label="Email address"
       defaultValue="hello@gmail.com"
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
       defaultValue="@demo1234"
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
     />


     <LoadingButton
       fullWidth
       size="large"
       type="submit"
       color="inherit"
       variant="contained"
       onClick={handleSignIn}
     >
       Sign in
     </LoadingButton>
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
