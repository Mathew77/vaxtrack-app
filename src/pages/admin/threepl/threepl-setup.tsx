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

interface FormData {
  State_id: string;
  lga_id: string;
  ward_id: string;
  org_unit_id: string;
  ehf_name: string;
  threepl: string;
}

export default function ThreePlSetup() {

  const initialValues: FormData = {
    State_id: '',
    lga_id: '',
    ward_id: '',
    org_unit_id: '',
    ehf_name: '',
    threepl: ''
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
    temp.threepl = data.threepl 
        ? '' 
        : '3pl required';

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
        3PL Setup
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
            EHF Name <span style={{ fontWeight: 'bold', color: '#DC143C'}}>*</span>
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

        <Grid item xs={6}>
          <FormControl sx={{ m: 0, width: '100%' }}>
            <Typography component="label" htmlFor="threepl" >
              3PL Name <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
            </Typography>
            <Select
              id="threepl"
              name="threepl"
              value={data.threepl}
              onChange={handleChange}
              sx={{ width: '100%' }}
              displayEmpty
              variant="outlined"
            >
              <MenuItem value="" disabled>
                Select 3pl Name
              </MenuItem>
            </Select>
            {errors?.threepl !== '' && (
              <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                {errors?.threepl}
              </Typography>
            )}
          </FormControl>
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
