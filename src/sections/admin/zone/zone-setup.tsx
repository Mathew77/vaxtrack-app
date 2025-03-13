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
  zone_name: string;
  state: string;
  lga: string;
}

interface Role {
  id: string | number; 
  name: string;
}


export default function ZoneSetup() {

  const navigate = useNavigate()

 const initialValues: FormData = {
    zone_name: '',
   state: '',
   lga: '',
 };




 const [data, setData] = useState<FormData>(initialValues);
 const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
 const [states, setStates] = useState<Role[]>([]);
 const [permission, setPermission] = useState([]);


 const validate = () => {
   let temp = { ...errors };
   temp.zone_name = data.zone_name
       ? ''
       : 'First name is required';
   temp.state = data.state
       ? ''
       : 'Last name is required';
   temp.lga = data.lga
       ? ''
       : 'LGA required';
      
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
      setStates(roleData); 
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
      <Typography variant="h5">Zone Management Setup</Typography>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/zone-page')}>
        Back
      </Button>
     
    </Box>

     <Grid container spacing={2}>
       <Grid item xs={6}>
         <Typography component="label" htmlFor="zone_name" >
           Zone Name<span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
         </Typography>
         <TextField
           fullWidth
           id="zone_name"
           name="zone_name"
           placeholder="Zone Name"
           value={data.zone_name}
           onChange={handleChange}
           variant="outlined"
           helperText={
             errors?.zone_name !== '' ? (
               <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.zone_name}</span>
             ) : ''
           }
         />
       </Grid>

        <Grid item xs={6}>
          <Typography component="label" htmlFor="state" >
            State <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
          </Typography>
          <Select
            fullWidth
            id="state"
            name="state"
            value={data.state}
            onChange={GetPermission}
            variant="outlined"
            displayEmpty
          >
            <MenuItem value="">Select Role</MenuItem>
            {states.map((state) => (
              <MenuItem key={`${state.name}-${state.id}`} value={state.id}>
                {state.name}
              </MenuItem>
            ))}
          </Select>
          {errors?.state !== '' && (
            <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
              {errors?.state}
            </Typography>
          )}
        </Grid>

        <Grid item xs={6}>
          <FormControl sx={{ m: 0, width: '100%' }}>
            <Typography component="label" htmlFor="lga" >
              LGA <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
            </Typography>
            <Select
              id="lga"
              name="lga"
              // value={data.orgUnit} 
              onChange={handleChangePermission}
              sx={{ width: '100%' }}
              displayEmpty
              variant="outlined" 
            >
              <MenuItem value="">Select Lga</MenuItem>
              {/* {orgUnit.map((each) => (
                <MenuItem key={`${each.name}-${each.id}`} value={each.id}>
                  {each.name} // Fixed from role.name to each.name
                </MenuItem>
              ))} */}
            </Select>
            {errors?.lga !== '' && (
              <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                {errors?.lga}
              </Typography>
            )}
          </FormControl>
        </Grid>

      </Grid>

     <Box sx={{ display:'flex', gap: 2, mt: 4, mb: 2 }}>
       <Button variant="contained" color="primary" size="large" onClick={handleSubmit}>
         Submit
       </Button>
       <Button variant="contained" color="inherit" size="large" onClick={() => navigate('/zone-page')}>
         Cancel
       </Button>
     </Box>
   </Container>
 );
}
