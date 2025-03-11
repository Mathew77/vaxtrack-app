import { useEffect, useState } from 'react';
import {
 Box,
 Button,
 TextField,
 Typography,
 Grid,
 Container,
 MenuItem,
 Select,
 FormControl,
} from '@mui/material';
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import DoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import DoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

interface FormData {
  firstName: string;
  lastName: string;
  userName: string;
  passWord: string;
  confirmPassword: string;
  roleId: string;
  phoneNumber: string;
  email: string;
  permission: string[]
}

interface Role {
  id: string | number; 
  name: string;
}


export default function UserSetup() {

  const navigate = useNavigate()

 const initialValues: FormData = {
   firstName: '',
   lastName: '',
   userName: '',
   passWord: '',
   confirmPassword: '',
   roleId: '',
   phoneNumber: '',
  email: '',
  permission: []
  //  roleId: '',
 };




 const [data, setData] = useState<FormData>(initialValues);
 const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
 const [roles, setRoles] = useState<Role[]>([]);
 const [permission, setPermission] = useState([]);


 const permisionOptions = [
  { value: '1', label: 'Permission 1' },
  { value: '2', label: 'Permission 2' },
  { value: '3', label: 'Permission 3' },
];

const handlePermission = (selected: string[]) => {
  setData((prev) => ({
    ...prev,
    permission: selected,
  }));
};


 const validate = () => {
   let temp = { ...errors };
   temp.firstName = data.firstName
       ? ''
       : 'First name is required';
   temp.lastName = data.lastName
       ? ''
       : 'Last name is required';
   temp.userName = data.userName
       ? ''
       : 'Username is required';
   temp.passWord = data.passWord
       ? ''
       : 'Password required';
  temp.confirmPassword = data.confirmPassword
       ? ''
       : 'Confirm password required';
   temp.roleId = data.roleId
       ? ''
       : 'Role required';
  temp.phoneNumber = data.phoneNumber
       ? ''
       : 'Phone Number is required';
  temp.email = data.email
       ? ''
       : 'Email required';

  temp.permission = data.permission.length > 0 ? '' : 'UHF required';
      
   setErrors({ ...temp });
   return Object.values(temp).every((x) => x === '');
 };


 const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
   const { name, value } = event.target;
   setData((prev) => ({
     ...prev,
     [name]: value,
   }));
 };


 useEffect(() => {
  FetchRoles();
}, []);

  const FetchRoles = async () => {
    try {
      const response = await fetch('your-api-endpoint/permission');
      const roleData = await response.json();
      setRoles(roleData); 
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleChangePermission = (e: any) => {
    const value = e.target.value
    setPermission(typeof value === 'string' ? value.split(',') : value)
    // setData()
}

  const GetPermission = (e: any) => {
    setData({ ...data, [e.target.name]: e.target.value });
    const stateId = e.target.value;
    async function getCharacters() {
                console.log("response");
         
    }
    getCharacters();

}

 const handleSubmit = () => {
   if (validate()) {
     console.log('Form Data:', data);
     setData(initialValues);
     setErrors({});
   }
 };


 return (
   <Container sx={{ mt:2 }}>
    <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
      <Typography variant="h5">User Management Setup</Typography>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/user-management')}>
        Back
      </Button>
     
    </Box>


     <Grid container spacing={2}>
       <Grid item xs={6}>
         <Typography component="label" htmlFor="firstName" >
           First Name<span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
         </Typography>
         <TextField
           fullWidth
           id="firstName"
           name="firstName"
           placeholder="First Name"
           value={data.firstName}
           onChange={handleChange}
           variant="outlined"
           helperText={
             errors?.firstName !== '' ? (
               <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.firstName}</span>
             ) : ''
           }
         />
       </Grid>


       <Grid item xs={6}>
         <Typography component="label" htmlFor="lastName" >
           Last Name <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
         </Typography>
         <TextField
           fullWidth
           id="lastName"
           name="lastName"
           placeholder="Last Name"
           value={data.lastName}
           onChange={handleChange}
           variant="outlined"
           helperText={
             errors?.lastName !== '' ? (
               <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.lastName}</span>
             ) : ''
           }
         />
       </Grid>


       <Grid item xs={6}>
         <Typography component="label" htmlFor="userName" >
           Username <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
         </Typography>
         <TextField
           fullWidth
           id="lccouserName_name"
           name="userName"
           placeholder="Userame"
           value={data.userName}
           onChange={handleChange}
           variant="outlined"
           helperText={
             errors?.userName !== '' ? (
               <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.userName}</span>
             ) : ''
           }
         />
       </Grid>

       <Grid item xs={6}>
         <Typography component="label" htmlFor="passWord" >
           Password <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
         </Typography>
         <TextField
            type='password'
           fullWidth
           id="passWord"
           name="passWord"
           placeholder="Password"
           value={data.passWord}
           onChange={handleChange}
           variant="outlined"
           helperText={
             errors?.passWord !== '' ? (
               <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.passWord}</span>
             ) : ''
           }
         />
        </Grid>

        <Grid item xs={6}>
         <Typography component="label" htmlFor="confirmPassword" >
           Confirm Password <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
         </Typography>
         <TextField
            type='password'
           fullWidth
           id="confirmPassword"
           name="confirmPassword"
           placeholder="confirm Password"
           value={data.confirmPassword}
           onChange={handleChange}
           variant="outlined"
           helperText={
             errors?.confirmPassword !== '' ? (
               <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.confirmPassword}</span>
             ) : ''
           }
         />
        </Grid>


        <Grid item xs={6}>
          <Typography component="label" htmlFor="roleId" >
            Role <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
          </Typography>
          <Select
            fullWidth
            id="roleId"
            name="roleId"
            value={data.roleId}
            onChange={GetPermission}
            variant="outlined"
            displayEmpty
          >
            <MenuItem value="">Select Role</MenuItem>
            {roles.map((role) => (
              <MenuItem key={`${role.name}-${role.id}`} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </Select>
          {errors?.roleId !== '' && (
            <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
              {errors?.roleId}
            </Typography>
          )}
        </Grid>

        <Grid item xs={6}>
          <FormControl sx={{ m: 0, width: '100%' }}>
            <Typography component="label" htmlFor="orgUnit" >
              Org Unit ID <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
            </Typography>
            <Select
              id="orgUnit"
              name="orgUnit"
              // value={data.orgUnit} 
              onChange={handleChangePermission}
              sx={{ width: '100%' }}
              displayEmpty
              variant="outlined" 
            >
              <MenuItem value="">Select Org Unit</MenuItem>
              {/* {orgUnit.map((each) => (
                <MenuItem key={`${each.name}-${each.id}`} value={each.id}>
                  {each.name} // Fixed from role.name to each.name
                </MenuItem>
              ))} */}
            </Select>
            {errors?.roleId !== '' && (
              <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                {errors?.roleId}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
         <Typography component="label" htmlFor="phoneNumber" >
           Phone Number <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
         </Typography>
         <TextField
           fullWidth
           id="phoneNumber"
           name="phoneNumber"
           placeholder="Phone Number"
           value={data.phoneNumber}
           onChange={handleChange}
           variant="outlined"
           helperText={
             errors?.phoneNumber !== '' ? (
               <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.phoneNumber}</span>
             ) : ''
           }
         />
       </Grid>

       <Grid item xs={6}>
         <Typography component="label" htmlFor="email" >
           Email Address <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
         </Typography>
         <TextField
           fullWidth
           id="email"
           name="email"
           placeholder="Email Adress"
           value={data.email}
           onChange={handleChange}
           variant="outlined"
           helperText={
             errors?.email !== '' ? (
               <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.email}</span>
             ) : ''
           }
         />
       </Grid>

        <Grid item xs={12}> 
          <FormControl sx={{ m: 0, width: '100%' }}>
            <Typography component="label" sx={{ mb: 1 }}>
              Permissions <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
            </Typography>
            <DualListBox
              canFilter
              options={permisionOptions}
              onChange={handlePermission}
              selected={data.permission}
              className="dual-listbox-custom"
              alignActions="middle" 
              icons={{
                moveToAvailable: <ArrowLeftIcon sx={{ fontSize: '16px' }} />, 
                moveAllToAvailable: <DoubleArrowLeftIcon sx={{ fontSize: '16px' }} />,
                moveToSelected: <ArrowRightIcon sx={{ fontSize: '16px' }} />,
                moveAllToSelected: <DoubleArrowRightIcon sx={{ fontSize: '16px' }} />, 
              }}
            />
            {errors?.permission !== '' && (
              <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                {errors?.permission}
              </Typography>
            )}
          </FormControl>
        </Grid>
            
      </Grid>

     <Box sx={{ display:'flex', gap: 2, mt: 4, mb: 2 }}>
       <Button variant="contained" color="primary" size="large" onClick={handleSubmit}>
         Submit
       </Button>
       <Button variant="contained" color="inherit" size="large" onClick={() => navigate('/user-management')}>
         Cancel
       </Button>
     </Box>
   </Container>
 );
}
