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
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import DoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import DoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

interface FormData {
  State_id: string;
  lga_id: string;
  ward_id: string;
  org_unit_id: string;
  threepl: string;
  ehf_name: string[];
}

export default function ThreePlSetup() {

  const navigate = useNavigate()

  const initialValues: FormData = {
    State_id: '',
    lga_id: '',
    ward_id: '',
    org_unit_id: '',
    threepl: '',
    ehf_name: [],
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
    temp.threepl = data.threepl 
        ? '' 
        : '3pl required';
    temp.ehf_name = data.ehf_name.length > 0 ? '' : 'EHF required';

    setErrors({ ...temp });
    return Object.values(temp).every((x) => x === '');
  };

  const ehfOptions = [
    { value: '1', label: 'EHF 1' },
    { value: '2', label: 'EHF 2' },
    { value: '3', label: 'EHF 3' },
  ];

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeEHF = (selected: string[]) => {
    setData((prev) => ({
      ...prev,
      ehf_name: selected,
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
        <Typography variant="h5">3PL Setup</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/threepl-page')}>
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
          <Typography component="label" htmlFor="threepl" >
            3PL Name <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            id="threepl"
            name="threepl"
            placeholder="Enter 3PL Name"
            value={data.threepl}
            onChange={handleChange}
            variant="outlined"
            helperText={
              errors?.threepl !== '' ? (
                <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.threepl}</span>
              ) : ''
            }
          />
        </Grid>

        <Grid item xs={12}> 
          <FormControl sx={{ m: 0, width: '100%' }}>
            <Typography component="label" sx={{ mb: 1 }}>
              EHF Name <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
            </Typography>
              <DualListBox
                canFilter
                options={ehfOptions}
                onChange={handleChangeEHF}
                selected={data.ehf_name}
                className="dual-listbox-custom"
                alignActions="middle" 
                icons={{
                  moveToAvailable: <ArrowLeftIcon sx={{ fontSize: '16px' }} />, 
                  moveAllToAvailable: <DoubleArrowLeftIcon sx={{ fontSize: '16px' }} />,
                  moveToSelected: <ArrowRightIcon sx={{ fontSize: '16px' }} />,
                  moveAllToSelected: <DoubleArrowRightIcon sx={{ fontSize: '16px' }} />, 
                }}
              />
            {errors?.ehf_name !== '' && (
              <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                {errors?.ehf_name}
              </Typography>
            )}
          </FormControl>
        </Grid>

      </Grid>

      <Box sx={{display: 'flex', gap:4, mt: 4, mb: 4 }}>
        <Button variant="contained" color="primary" size="large" onClick={handleSubmit}>
          Submit
        </Button>
        <Button variant="contained" color="inherit" size="large" onClick={() => navigate('/threepl-page')}>
          Cancel
        </Button>
      </Box>
    </Container>
  );
}
