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
 SelectChangeEvent,
} from '@mui/material';
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import DoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import DoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserType } from 'src/hooks/apis/user/user-types';
import { useUpsertUser, useFetchOrgUnitLevel, useFetchPermissions, useFetchRoles, useFetchUsers } from 'src/hooks/apis/user/user-hooks';


export default function UserSetup() {

  const navigate = useNavigate()
  const location = useLocation();
  const { state } = location;

  const { data: permissions = [] } = useFetchPermissions();
  const { data: orgUnits = [] } = useFetchOrgUnitLevel();
  const { data: roles = [] } = useFetchRoles();
  const upsertUser = useUpsertUser();

 const initialValues: UserType = {
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    confirm_password: '',
    org_unit: '',
    phone_number: '',
    email: '',
    groups: [],
    user_permissions: []
 };


 const [data, setData] = useState<UserType>(initialValues);
 const [errors, setErrors] = useState<Partial<Record<keyof UserType, string>>>({});
//  const [roles, setRoles] = useState<Role[]>([]);
 const [permission, setPermission] = useState([]);
 const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);

  const setCurrentState = () => {
    if (state?.data) {
      const userData = state.data;
      setData({
        ...initialValues,
        ...userData,
        groups: userData.groups?.map((id: number) => id.toString()) || [],
        user_permissions: userData.user_permissions?.map((id: number) => id.toString()) || [],
      });
      setIsUpdate(state.isUpdate || false);
      setIsView(state.isView || false);
    }
  };

  useEffect(() => {
    setCurrentState();
  }, [state]);


 const validate = () => {
   let temp = { ...errors };
   temp.first_name = data.first_name
       ? ''
       : 'First name is required';
   temp.last_name = data.last_name
       ? ''
       : 'Last name is required';
   temp.username = data.username
       ? ''
       : 'Username is required';
    if (!isUpdate) {
    temp.password = data.password ? '' : 'Password required';
    temp.confirm_password = data.confirm_password
      ? data.password === data.confirm_password
        ? ''
        : 'Passwords do not match'
      : 'Confirm password required';
  } else {
    temp.password = '';
    temp.confirm_password = '';
  }
   temp.org_unit = data.org_unit
       ? ''
       : 'Org Unit required';
  temp.phone_number = data.phone_number
       ? ''
       : 'Phone Number is required';
  temp.email = data.email
       ? ''
       : 'Email required';
  temp.groups = data.groups.length > 0 
      ? '' 
      : 'Select at least one role';
  temp.user_permissions = data.user_permissions.length > 0 
      ? '' 
      : 'Permission required';
      
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


 const handleRoleChange = (selected: string[]) => {
  setData((prev) => ({
    ...prev,
    groups: selected, 
  }));
};

const handlePermissionChange = (selected: string[]) => {
  setData((prev) => ({
    ...prev,
    user_permissions: selected,
  }));
};

const handleSelectChange = (event: SelectChangeEvent<string>) => {
  const { name, value } = event.target;
  setData((prev) => ({ ...prev, [name]: value }));
};
 

const permissionOptions = permissions.map((perm) => ({
  label: perm.name,
  value: perm.id.toString(),
}));

const rolesOptions = roles.map((role) => ({
  label: role.name,
  value: role.id.toString(),
}));

const handleSubmit = () => {
  if (validate()) {
    if (isUpdate) {
      upsertUser.mutate(
        { id: data.id, data },
        {
          onSuccess: () => {
            navigate('/user-management');
          },
        }
      );
    } else {
      upsertUser.mutate(
        { data },
        {
          onSuccess: () => {
            navigate('/user-management');
          },
        }
      );
    }
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
         <Typography component="label" htmlFor="first_name" >
           First Name<span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
         </Typography>
         <TextField
           fullWidth
           id="first_name"
           name="first_name"
           placeholder="First Name"
           value={data.first_name}
           onChange={handleChange}
           variant="outlined"
           disabled={isView}
           helperText={
             errors?.first_name !== '' ? (
               <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.first_name}</span>
             ) : ''
           }
         />
       </Grid>


       <Grid item xs={6}>
         <Typography component="label" htmlFor="last_name" >
           Last Name <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
         </Typography>
         <TextField
           fullWidth
           id="last_name"
           name="last_name"
           placeholder="Last Name"
           value={data.last_name}
           onChange={handleChange}
           variant="outlined"
           disabled={isView}
           helperText={
             errors?.last_name !== '' ? (
               <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.last_name}</span>
             ) : ''
           }
         />
       </Grid>


       <Grid item xs={6}>
         <Typography component="label" htmlFor="username" >
           Username <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
         </Typography>
         <TextField
           fullWidth
           id="username"
           name="username"
           placeholder="Username"
           value={data.username}
           onChange={handleChange}
           variant="outlined"
           disabled={isView}
           helperText={
             errors?.username !== '' ? (
               <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.username}</span>
             ) : ''
           }
         />
       </Grid>

        {!isUpdate && !isView && (
        <>
          <Grid item xs={6}>
            <Typography component="label" htmlFor="password">
              Password <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
            </Typography>
            <TextField
              type="password"
              fullWidth
              id="password"
              name="password"
              placeholder="Password"
              value={data.password}
              onChange={handleChange}
              variant="outlined"
              helperText={
                errors?.password !== '' ? (
                  <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.password}</span>
                ) : ''
              }
            />
          </Grid>

          <Grid item xs={6}>
            <Typography component="label" htmlFor="confirm_password">
              Confirm Password <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
            </Typography>
            <TextField
              type="password"
              fullWidth
              id="confirm_password"
              name="confirm_password"
              placeholder="Confirm Password"
              value={data.confirm_password}
              onChange={handleChange}
              variant="outlined"
              helperText={
                errors?.confirm_password !== '' ? (
                  <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.confirm_password}</span>
                ) : ''
              }
            />
          </Grid>
        </>
        )}
        
        <Grid item xs={6}>
          <FormControl sx={{ m: 0, width: '100%' }}>
            <Typography component="label" htmlFor="org_unit" >
              Org Unit ID <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
            </Typography>
            <Select
              id="org_unit"
              name="org_unit"
              value={data.org_unit} 
              onChange={handleSelectChange}
              sx={{ width: '100%' }}
              displayEmpty
              variant="outlined" 
              disabled={isView}
            >
              <MenuItem value="">Select Org Unit</MenuItem>
              {orgUnits.map((orgUnit) => (
                <MenuItem key={`${orgUnit.name}-${orgUnit.id}`} value={orgUnit.id}>
                  {orgUnit.name}
                </MenuItem>
              ))}
            </Select>
            {errors?.org_unit !== '' && (
              <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                {errors?.org_unit}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
         <Typography component="label" htmlFor="phone_number" >
           Phone Number <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
         </Typography>
         <TextField
           fullWidth
           id="phone_number"
           name="phone_number"
           placeholder="Phone Number"
           value={data.phone_number}
           onChange={handleChange}
           variant="outlined"
           disabled={isView}
           helperText={
             errors?.phone_number !== '' ? (
               <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.phone_number}</span>
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
           disabled={isView}
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
              Role <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
            </Typography>
            <DualListBox
              canFilter
              options={rolesOptions}
              onChange={handleRoleChange}
              selected={data.groups as string[]}
              className="dual-listbox-custom"
              alignActions="middle" 
              disabled={isView}
              icons={{
                moveToAvailable: <ArrowLeftIcon sx={{ fontSize: '16px' }} />, 
                moveAllToAvailable: <DoubleArrowLeftIcon sx={{ fontSize: '16px' }} />,
                moveToSelected: <ArrowRightIcon sx={{ fontSize: '16px' }} />,
                moveAllToSelected: <DoubleArrowRightIcon sx={{ fontSize: '16px' }} />, 
              }}
            />
            {errors?.groups !== '' && (
              <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                {errors?.groups}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12}> 
          <FormControl sx={{ m: 0, width: '100%' }}>
            <Typography component="label" sx={{ mb: 1 }}>
              Permissions <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
            </Typography>
            <DualListBox
              canFilter
              options={permissionOptions}
              onChange={handlePermissionChange}
              selected={data.user_permissions as string[]}
              className="dual-listbox-custom"
              alignActions="middle" 
              disabled={isView}
              icons={{
                moveToAvailable: <ArrowLeftIcon sx={{ fontSize: '16px' }} />, 
                moveAllToAvailable: <DoubleArrowLeftIcon sx={{ fontSize: '16px' }} />,
                moveToSelected: <ArrowRightIcon sx={{ fontSize: '16px' }} />,
                moveAllToSelected: <DoubleArrowRightIcon sx={{ fontSize: '16px' }} />, 
              }}
            />
            {errors?.user_permissions !== '' && (
              <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                {errors?.user_permissions}
              </Typography>
            )}
          </FormControl>
        </Grid>
            
      </Grid>

     <Box sx={{ display:'flex', gap: 2, mt: 4, mb: 2 }}>
       <Button variant="contained" color="primary" size="large" onClick={handleSubmit}  disabled={isView}>
         Submit
       </Button>
       <Button variant="contained" color="inherit" size="large" onClick={() => navigate('/user-management')}>
         Cancel
       </Button>
     </Box>
   </Container>
 );
}