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
import { useNavigate } from 'react-router-dom';

interface FormData {
  State_id: string;
  lga_id: string;
  lcco_name: string;
  longitude: string;
  latitude: string;
  contactPersonName: string;
  contactPersonPhone: string;
  contactPersonEmail: string;
}

export default function LccoSetup() {

  const navigate = useNavigate()

  const initialValues: FormData = {
    State_id: '',
    lga_id: '',
    lcco_name: '',
    longitude: '',
    latitude: '',
    contactPersonName: '',
    contactPersonPhone: '',
    contactPersonEmail: '',
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
    temp.contactPersonName = data.contactPersonName 
        ? '' 
        : 'Contact person naame required';
    temp.contactPersonPhone = data.contactPersonPhone 
        ? '' 
        : 'Contact person phone required';
    temp.contactPersonEmail = data.contactPersonEmail 
        ? '' 
        : 'Contact person email required';

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
        LCS Setup
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

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
          <Typography
            variant="h5"
    
          >
            Contact Information
          </Typography>
    
          <Box >
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Typography component="label" htmlFor="contact_person_name">
                  Contact Person Name <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  id="contact_person_name"
                  name="contact_person_name"
                  placeholder="Contact Person Name"
                  value={data.contactPersonName}
                  onChange={handleChange}
                  variant="outlined"
                  helperText={
                    errors?.contactPersonName ? (
                      <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors.contactPersonName}</span>
                    ) : ''
                  }
                />
              </Grid>
    
              <Grid item xs={6}>
                <Typography component="label" htmlFor="contact_person_phone">
                  Phone Number <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  id="contact_person_phone"
                  name="contact_person_phone"
                  placeholder="Phone Number "
                  value={data.contactPersonPhone}
                  onChange={handleChange}
                  variant="outlined"
                  type="tel"
                  helperText={
                    errors?.contactPersonPhone ? (
                      <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors.contactPersonPhone}</span>
                    ) : ''
                  }
                />
              </Grid>
    
              <Grid item xs={6}>
                <Typography component="label" htmlFor="contact_person_email">
                  Email <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  id="contact_person_email"
                  name="contact_person_email"
                  placeholder="Email Address"
                  value={data.contactPersonEmail}
                  onChange={handleChange}
                  variant="outlined"
                  type="email"
                  helperText={
                    errors?.contactPersonEmail ? (
                      <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors.contactPersonEmail}</span>
                    ) : ''
                  }
                />
              </Grid>
            </Grid>
          </Box>
        </Box>

      <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button variant="contained" color="primary" size="large" onClick={handleSubmit}>
          Submit
        </Button>
        <Button variant="contained" color="inherit" size="large" onClick={() => navigate('/lcs-scs-setup')}>
          Back
        </Button>
      </Box>
    </Container>
  );
}