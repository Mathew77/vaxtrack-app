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
  InputLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface FormData {
  stateId: string;
  orgUnitId: string;
  scsName: string;
  contactPersonName: string;
  contactPersonPhone: string;
  contactPersonEmail: string;
}


export default function ScsSetup() {

  const navigate = useNavigate()

    const initialValues: FormData = {
        stateId: '',
        orgUnitId: '',
        scsName: '',
        contactPersonName: '',
        contactPersonPhone: '',
        contactPersonEmail: '',
    };

    const [data, setData] = useState<FormData>(initialValues);
    const [errors, setErrors] = useState<Partial<FormData>>({});


  const validate = () => {
    let temp = { ...errors };
    temp.stateId = data.stateId ? '' : 'State is required';
    temp.orgUnitId = data.orgUnitId ? '' : 'Org Unit required';
    temp.scsName = data.scsName ? '' : 'Scs is required';
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
    <Container sx={{ mt: 2 }}>
      <Typography variant="h5" sx={{ mb: 4 }}>
        SCS Setup
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6}>
            <FormControl sx={{ m: 0, width: '100%' }}>
            <Typography component="label" htmlFor="stateId" sx={{ mb: 1 }}>
                State <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
            </Typography>
            <Select
                id="stateId"
                name="stateId"
                value={data.stateId}
                onChange={handleChange}
                sx={{ width: '100%' }}
                displayEmpty
                variant="outlined"
            >
                <MenuItem value="" disabled>
                Select State
                </MenuItem>
            </Select>
            {errors?.stateId !== '' && (
                <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                {errors?.stateId}
                </Typography>
            )}
            </FormControl>
        </Grid>

        <Grid item xs={6}>
            <FormControl sx={{ m: 0, width: '100%' }}>
            <Typography component="label" htmlFor="orgUnitId" sx={{ mb: 1 }}>
                Org Unit <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
            </Typography>
            <Select
                id="orgUnitId"
                name="orgUnitId"
                value={data.orgUnitId}
                onChange={handleChange}
                sx={{ width: '100%' }}
                displayEmpty
                variant="outlined"
            >
                <MenuItem value="" disabled>
                Select Org Unit
                </MenuItem>
            </Select>
            {errors?.orgUnitId !== '' && (
                <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                {errors?.orgUnitId}
                </Typography>
            )}
            </FormControl>
        </Grid>

        <Grid item xs={6}>
          <Typography component="label" htmlFor="scsName">
            SCS Name<span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            id="scsName"
            name="scsName"
            placeholder="Enter School Name"
            value={data.scsName}
            onChange={handleChange}
            variant="outlined"
            helperText={
              errors?.scsName && (
                <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.scsName}</span>
              )
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
};
