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
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface FormData {
  name: string; 
  description: string; 
}

export default function PermissionSetup() {

  const navigate = useNavigate();

  const initialValues: FormData = {
    name: '',
    description: '',
  };

  const [data, setData] = useState<FormData>(initialValues);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validate = () => {
    let temp = { ...errors };
    temp.name = data.name 
        ? '' 
        : 'Name is required';
    temp.description = data.description 
        ? '' 
        : 'Description is required';
    
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

  const handleSubmit = () => {
    if (validate()) {
      console.log('Form Data:', data);
      setData(initialValues);
      setErrors({});
    }
  };

  return (
    <Container sx={{ mt: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
        <Typography variant="h5">Permission Setup</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/roles-permissions-page')}>
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
          <Typography component="label" htmlFor="description">
            Description <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            id="description"
            name="description"
            placeholder="Enter Description"
            value={data.description}
            onChange={handleChange}
            variant="outlined"
            helperText={
              errors?.description && (
                <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.description}</span>
              )
            }
          />
        </Grid>
      </Grid>

      <Box sx={{display: 'flex', gap:4, mt: 4, mb: 4 }}>
        <Button variant="contained" color="primary" size="large" onClick={handleSubmit}>
          Submit
        </Button>
        <Button variant="contained" color="inherit" size="large" onClick={() => navigate('/roles-permissions-page')}>
          Cancel
        </Button>
      </Box>
    </Container>
  );
}