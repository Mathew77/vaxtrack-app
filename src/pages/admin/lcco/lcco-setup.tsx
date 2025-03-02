import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Container,
  FormControl,
  MenuItem,
  Select,
} from '@mui/material';

interface FormData {
  State_id: string;
  lga_id: string;
  lcco_name: string;
  longitude: string;
  latitude: string;
}

export default function LccoSetup() {

  const initialValues: FormData = {
    State_id: '',
    lga_id: '',
    lcco_name: '',
    longitude: '',
    latitude: '',
  };

  const [data, setData] = useState<FormData>(initialValues);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validate = () => {
    let temp = { ...errors };
    temp.State_id = data.State_id 
        ? '' 
        : 'State is required';
    temp.lga_id = data.lga_id 
        ? '' 
        : 'Lga is required';
    temp.lcco_name = data.lcco_name 
        ? '' 
        : 'Lcco name required';
    temp.longitude = data.longitude 
        ? '' 
        : 'Longitude required';
    temp.latitude = data.latitude 
        ? '' 
        : 'Latitude required';

    setErrors({ ...temp });
    return Object.values(temp).every((x) => x === '');
  };

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (validate()) {
      console.log('Form Data:', data);
    }
  };

  return (
    <Container sx={{ mt:2 }}>
      <Typography variant="h5" sx={{ mb: 4 }}>
        LCCO Setup
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormControl sx={{ m: 0, width: '100%' }}>
            <Typography component="label" htmlFor="State_id" sx={{ mb: 1 }}>
              State <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
            </Typography>
            <Select
              id="State_id"
              name="State_id"
              value={data.State_id}
              onChange={handleChange}
              sx={{ width: '100%' }}
              displayEmpty
              variant="outlined"
            >
              <MenuItem value="" disabled>
                Select State
              </MenuItem>
            </Select>
            {errors?.State_id !== '' && (
              <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                {errors?.State_id}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl sx={{ m: 0, width: '100%' }}>
            <Typography component="label" htmlFor="lga_id" sx={{ mb: 1 }}>
              Lga <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
            </Typography>
            <Select
              id="lga_id"
              name="lga_id"
              value={data.lga_id}
              onChange={handleChange}
              sx={{ width: '100%' }}
              displayEmpty
              variant="outlined"
            >
              <MenuItem value="" disabled>
                Select LGA
              </MenuItem>
            </Select>
            {errors?.lga_id !== '' && (
              <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                {errors?.lga_id}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <Typography component="label" htmlFor="lcco_name" >
            Lcco Name <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            id="lcco_name"
            name="lcco_name"
            placeholder="Lcco Name"
            value={data.lcco_name}
            onChange={handleChange}
            variant="outlined"
            helperText={
              errors?.lcco_name !== '' ? (
                <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.lcco_name}</span>
              ) : ''
            }
          />
        </Grid>

        <Grid item xs={6}>
          <Typography component="label" htmlFor="longitude" >
            Longitude <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            id="longitude"
            name="longitude"
            placeholder="Longitude"
            value={data.longitude}
            onChange={handleChange}
            variant="outlined"
            helperText={
              errors?.longitude !== '' ? (
                <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.longitude}</span>
              ) : ''
            }
          />
        </Grid>

        <Grid item xs={6}>
          <Typography component="label" htmlFor="latitude" >
            Latitude <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            id="latitude"
            name="latitude"
            placeholder="Latitude"
            value={data.latitude}
            onChange={handleChange}
            variant="outlined"
            helperText={
              errors?.latitude !== '' ? (
                <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.latitude}</span>
              ) : ''
            }
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>
        <Button variant="contained" color="primary" size="large" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Container>
  );
}