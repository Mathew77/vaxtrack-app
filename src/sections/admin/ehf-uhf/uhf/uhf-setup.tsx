import { useState } from 'react';
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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface FormData {
  State_id: string;
  lga_id: string;
  ward_id: string;
  org_unit_id: string;
  ehf_name: string;
  uhf_name: string;
  contactPersonName: string;
  contactPersonPhone: string;
  contactPersonEmail: string;
}

export default function UhfSetup() {

  const navigate = useNavigate()

  const initialValues: FormData = {
    State_id: '',
    lga_id: '',
    ward_id: '',
    org_unit_id: '',
    ehf_name: '',
    uhf_name: '',
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
    temp.ward_id = data.ward_id 
        ? '' 
        : 'Ward is required';
    temp.org_unit_id = data.org_unit_id 
        ? '' 
        : 'Org unit required';
    temp.ehf_name = data.ehf_name 
        ? '' 
        : 'ehf name required';
    temp.uhf_name = data.uhf_name 
        ? '' 
        : 'uhf name required';
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
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
        <Typography variant="h5">UHF Setup</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/ehf-uhf-page')}>
          Back
        </Button>
     
      </Box>


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
          <FormControl sx={{ m: 0, width: '100%' }}>
            <Typography component="label" htmlFor="ward_id" sx={{ mb: 1 }}>
              Ward <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
            </Typography>
            <Select
              id="ward_id"
              name="ward_id"
              value={data.ward_id}
              onChange={handleChange}
              sx={{ width: '100%' }}
              displayEmpty
              variant="outlined"
            >
              <MenuItem value="" disabled>
                Select Ward
              </MenuItem>
            </Select>
            {errors?.ward_id !== '' && (
              <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                {errors?.ward_id}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl sx={{ m: 0, width: '100%' }}>
            <Typography component="label" htmlFor="org_unit_id" sx={{ mb: 1 }}>
              Org Unit <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
            </Typography>
            <Select
              id="org_unit_id"
              name="org_unit_id"
              value={data.org_unit_id}
              onChange={handleChange}
              sx={{ width: '100%' }}
              displayEmpty
              variant="outlined"
            >
              <MenuItem value="" disabled>
                Select Org Unit
              </MenuItem>
            </Select>
            {errors?.org_unit_id !== '' && (
              <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                {errors?.org_unit_id}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl sx={{ m: 0, width: '100%' }}>
            <Typography component="label" htmlFor="ehf_name" >
              EHF Name <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
            </Typography>
            <Select
              id="ehf_name"
              name="ehf_name"
              value={data.ehf_name}
              onChange={handleChange}
              sx={{ width: '100%' }}
              displayEmpty
              variant="outlined"
            >
              <MenuItem value="" disabled>
                EHF name
              </MenuItem>
            </Select>
            {errors?.ehf_name !== '' && (
              <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                {errors?.ehf_name}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl sx={{ m: 0, width: '100%' }}>
            <Typography component="label" htmlFor="uhf_name" >
              UHF Name <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
            </Typography>
            <Select
              id="uhf_name"
              name="uhf_name"
              value={data.uhf_name}
              onChange={handleChange}
              sx={{ width: '100%' }}
              displayEmpty
              variant="outlined"
            >
              <MenuItem value="" disabled>
                UHF name
              </MenuItem>
            </Select>
            {errors?.uhf_name !== '' && (
              <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                {errors?.uhf_name}
              </Typography>
            )}
          </FormControl>
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

      <Box sx={{display: 'flex', gap: 2, mt: 4, mb: 4 }}>
        <Button variant="contained" color="primary" size="large" onClick={handleSubmit}>
          Submit
        </Button>
        <Button variant="contained" color="inherit" size="large" onClick={() => navigate('/ehf-uhf-page')}>
          Cancel
        </Button>
      </Box>
    </Container>
  );
}
