import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import DoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import DoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { useNavigate } from 'react-router-dom';
interface FormData {
  State_id: string;
  lga_id: string;
  ward_id: string;
  org_unit_id: string;
  ehf_name: string;
  uhf_ids: string[];
  contactPersonName: string;
  contactPersonPhone: string;
  contactPersonEmail: string;
}

export default function EhfSetup() {

  const navigate = useNavigate()

  const initialValues: FormData = {
    State_id: '',
    lga_id: '',
    ward_id: '',
    org_unit_id: '',
    ehf_name: '',
    uhf_ids: [],
    contactPersonName: '',
    contactPersonPhone: '',
    contactPersonEmail: ''
  };

  const [data, setData] = useState<FormData>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

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
        : 'EHF name required';
    temp.uhf_ids = data.uhf_ids.length > 0 ? '' : 'UHF required';

    temp.contactPersonName = data.contactPersonName 
        ? '' 
        : 'Contact person name required';
    temp.contactPersonPhone = data.contactPersonPhone 
        ? '' 
        : 'Contact person phone required';
    temp.contactPersonEmail = data.contactPersonEmail 
        ? '' 
        : 'Contact person email required';

    setErrors({ ...temp });
    return Object.values(temp).every((x) => x === '');
  };

  const uhfOptions = [
    { value: 'uhf1', label: 'UHF 1' },
    { value: 'uhf2', label: 'UHF 2' },
    { value: 'uhf3', label: 'UHF 3' },
  ];

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeUHF = (selected: string[]) => {
    setData((prev) => ({
      ...prev,
      uhf_ids: selected,
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
        EHF Setup
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
          <Typography component="label" htmlFor="ehf_name">
            EHF Name (Apex / HUB) <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            id="ehf_name"
            name="ehf_name"
            placeholder="EHF Name"
            value={data.ehf_name}
            onChange={handleChange}
            variant="outlined"
            helperText={
              errors?.ehf_name !== '' ? (
                <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.ehf_name}</span>
              ) : ''
            }
          />
        </Grid>

        <Grid item xs={12}> 
          <FormControl sx={{ m: 0, width: '100%' }}>
            <Typography component="label" sx={{ mb: 1 }}>
              UHF (Cascade / Spoke)<span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
            </Typography>
              <DualListBox
                canFilter
                options={uhfOptions}
                onChange={handleChangeUHF}
                selected={data.uhf_ids}
                className="dual-listbox-custom"
                alignActions="middle" 
                icons={{
                  moveToAvailable: <ArrowLeftIcon sx={{ fontSize: '16px' }} />, 
                  moveAllToAvailable: <DoubleArrowLeftIcon sx={{ fontSize: '16px' }} />,
                  moveToSelected: <ArrowRightIcon sx={{ fontSize: '16px' }} />,
                  moveAllToSelected: <DoubleArrowRightIcon sx={{ fontSize: '16px' }} />, 
                }}
              />
            {errors?.uhf_ids !== '' && (
              <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                {errors?.uhf_ids}
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

      <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 2, mb: 4 }}>
        <Button variant="contained" color="primary" size="large" onClick={handleSubmit}>
          Submit
        </Button>
        <Button variant="contained" color="inherit" size="large" onClick={() => navigate('/ehf-uhf-setup')}>
          Back
        </Button>
      </Box>
    </Container>
  );
}

