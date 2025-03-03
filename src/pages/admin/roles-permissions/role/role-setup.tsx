import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Container,
  FormControl,
 
} from '@mui/material';
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import DoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import DoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { useNavigate } from 'react-router-dom';


interface FormData {
  name: string; 
  description: string; 
  permissionId: string[];
}

export default function ScsSetup() {

  const navigate = useNavigate();

  const initialValues: FormData = {
    name: '',
    description: '',
    permissionId: [],
  };

  const [data, setData] = useState<FormData>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const permissionOptions = [
    { value: '1', label: 'Permission 1' },
    { value: '2', label: 'Permission 2' },
    { value: '3', label: 'Permission 3' },
  ];

  const validate = () => {
    let temp = { ...errors };
    temp.name = data.name 
        ? '' 
        : 'Name is required';
    temp.description = data.description 
        ? '' 
        : 'Description is required';
        temp.permissionId = data.permissionId.length > 0 ? '' : 'UHF required';
    
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

  const handleChangePermission = (selected: string[]) => {
    setData((prev) => ({
      ...prev,
      permissionId: selected,
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
      <Typography variant="h5" sx={{ mb: 4 }}>
        Role Setup
      </Typography>

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

        <Grid item xs={12}> 
          <FormControl sx={{ m: 0, width: '100%' }}>
            <Typography component="label" sx={{ mb: 1 }}>
              Permissions <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
            </Typography>
            <DualListBox
                canFilter
                options={permissionOptions}
                onChange={handleChangePermission}
                selected={data.permissionId}
                className="dual-listbox-custom"
                alignActions="middle" 
                icons={{
                  moveToAvailable: <ArrowLeftIcon sx={{ fontSize: '16px' }} />, 
                  moveAllToAvailable: <DoubleArrowLeftIcon sx={{ fontSize: '16px' }} />,
                  moveToSelected: <ArrowRightIcon sx={{ fontSize: '16px' }} />,
                  moveAllToSelected: <DoubleArrowRightIcon sx={{ fontSize: '16px' }} />, 
                }}
              />
            {errors?.permissionId !== '' && (
              <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                {errors?.permissionId}
              </Typography>
            )}
          </FormControl>
        </Grid>

      </Grid>

      <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button variant="contained" color="primary" size="large" onClick={handleSubmit}>
          Submit
        </Button>
        <Button variant="contained" color="inherit" size="large" onClick={() => navigate('/roles-permissions-setup')}>
          Back
        </Button>
      </Box>
    </Container>
  );
};
