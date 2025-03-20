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
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useCreatePermission } from 'src/hooks/apis/roles-permissions/permissions-hook';
import { PermissionType } from 'src/hooks/apis/roles-permissions/permissions-type';

// interface FormData {
//   name: string; 
//   description: string; 
// }

export default function PermissionSetup() {

  const navigate = useNavigate();
   const location = useLocation();
    const { state } = location;
    const activeTab = state?.activeTab || 0

  const initialValues: Omit<PermissionType, 'id'> = {
    name: '',
    codename: '',
  };

  const [data, setData] = useState<Omit<PermissionType, 'id'>>(initialValues);
  const [errors, setErrors] = useState<Partial<Omit<PermissionType, 'id'>>>({});
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);

  const { mutate: createPermission } = useCreatePermission();

  const validate = () => {
    let temp = { ...errors };
    temp.name = data.name 
        ? '' 
        : 'Name is required';
    temp.codename = data.codename 
        ? '' 
        : 'Codenaame is required';
    
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

  const handleSubmit = async () => {
    if (validate()) {
      createPermission(data, {
        onSuccess: () => {
          navigate('/org-units-page', {state: { activeTab }});
        },
        onError: (error) => {
        },
      });
    }
  };

  return (
    <Container sx={{ mt: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
        <Typography variant="h5">Permission Setup</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/roles-permissions-page', {state: { activeTab }})}>
          Back
        </Button>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography component="label" htmlFor="name">
            Name<span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            id="name"
            name="name"
            placeholder="Enter Name"
            value={data.name}
            onChange={handleChange}
            variant="outlined"
            helperText={
              errors?.name && (
                <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.name}</span>
              )
            }
          />
        </Grid>

        <Grid item xs={6}>
          <Typography component="label" htmlFor="codename">
            Description <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            id="codename"
            name="codename"
            placeholder="Enter Description"
            value={data.codename}
            onChange={handleChange}
            variant="outlined"
            helperText={
              errors?.codename && (
                <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.codename}</span>
              )
            }
          />
        </Grid>
      </Grid>

      <Box sx={{display: 'flex', gap:4, mt: 4, mb: 4 }}>
        <Button variant="contained" color="primary" size="large" onClick={handleSubmit}>
          Submit
        </Button>
        <Button 
          variant="contained" 
          color="inherit" 
          size="large" 
          onClick={() => navigate('/roles-permissions-page', {state: { activeTab }})}>
          Cancel
        </Button>
      </Box>
    </Container>
  );
}