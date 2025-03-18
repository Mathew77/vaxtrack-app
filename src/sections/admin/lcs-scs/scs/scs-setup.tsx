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
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SCSType } from 'src/hooks/apis/lcs-scs/scs-type';
import { useFetchStates, useUpsertScs } from 'src/hooks/apis/lcs-scs/scs-hooks';
import { toast } from 'react-toastify';


export default function ScsSetup() {

  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const { data: states = [] } = useFetchStates();
  const  upsertScs = useUpsertScs();

    const initialValues: SCSType = {
        status: '',
        stat_id: '',
        scs_name: '',
        contact_person_name: '',
        contact_person_phone: '',
        contact_person_email: '',
        longtitude: '',
        lagtitude: '', 
    };

  const [data, setData] = useState<SCSType>(initialValues);
  const [errors, setErrors] = useState<Partial<SCSType>>({});
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);

  const setCurrentState = () => {
    if (state?.data) {
      const scsData = state.data;
      setData({
        ...initialValues,
        ...scsData,
        stat_id: scsData.stat_id || '',
      });
      setIsUpdate(state.isUpdate || false);
      setIsView(state.isView || false);
    }
  };

  useEffect(() => {
    setCurrentState();
  }, [state]);
    


  const validate = () => {
    let temp = { ...errors };
    temp.stat_id = data.stat_id 
        ? '' 
        : 'State is required';
    temp.scs_name = data.scs_name 
        ? '' 
        : 'Scs is required';
    temp.contact_person_name = data.contact_person_name 
        ? '' 
        : 'Contact person naame required';
    temp.contact_person_phone = data.contact_person_phone 
        ? '' 
        : 'Contact person phone required';
    temp.contact_person_email = data.contact_person_email 
        ? '' 
        : 'Contact person email required';
    temp.longtitude = data.longtitude 
        ? '' 
        : 'Longitude is required';
    temp.lagtitude = data.lagtitude 
        ? '' 
        : 'Latitude is required';

    
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
      if (isUpdate) {
        upsertScs.mutate(
          { id: data.id, data },
          {
            onSuccess: (response) => {
              toast.success(response?.status || "SCS Updated Successfully");
              navigate('/lcs-scs-page');
            },
          }
        );
      } else {
        upsertScs.mutate(
          { data },
          {
            onSuccess: (response) => {
              toast.success(response?.status || "SCS Created Successfully");
              navigate('/lcs-scs-page');
            },
          }
        );
      }
    }
  };

  return (
    <Container sx={{ mt: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
        <Typography variant="h5">SCS Setup</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/lcs-scs-page')}>
          Back
        </Button>   
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
            <FormControl sx={{ m: 0, width: '100%' }}>
            <Typography component="label" htmlFor="stat_id" >
                State <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
            </Typography>
            <Select
                id="stat_id"
                name="stat_id"
                value={data.stat_id}
                onChange={handleChange}
                sx={{ width: '100%' }}
                displayEmpty
                variant="outlined"
                disabled={isView}
            >
                <MenuItem value="" disabled>
                Select State
                </MenuItem>
                 {states.map((state) => (
                    <MenuItem key={state.state} value={state.state}>
                      {state.state}
                    </MenuItem>
                  ))}
            </Select>
            {errors?.stat_id !== '' && (
                <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                {errors?.stat_id}
                </Typography>
            )}
            </FormControl>
        </Grid>

        <Grid item xs={6}>
          <Typography component="label" htmlFor="scs_name">
            SCS Name<span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            id="scs_name"
            name="scs_name"
            placeholder="Enter Scs Name"
            value={data.scs_name}
            onChange={handleChange}
            variant="outlined"
            disabled={isView}
            helperText={
              errors?.scs_name && (
                <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.scs_name}</span>
              )
            }
          />
        </Grid>

        <Grid item xs={6}>
          <Typography component="label" htmlFor="longtitude" >
            Longitude <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            id="longtitude"
            name="longtitude"
            placeholder="Longitude"
            value={data.longtitude}
            onChange={handleChange}
            variant="outlined"
            disabled={isView}
            helperText={
              errors?.longtitude !== '' ? (
                <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.longtitude}</span>
              ) : ''
            }
          />
        </Grid>

        <Grid item xs={6}>
          <Typography component="label" htmlFor="lagtitude" >
            Latitude <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            id="lagtitude"
            name="lagtitude"
            placeholder="Latitude"
            value={data.lagtitude}
            onChange={handleChange}
            variant="outlined"
            disabled={isView}
            helperText={
              errors?.lagtitude !== '' ? (
                <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.lagtitude}</span>
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
                value={data.contact_person_name}
                onChange={handleChange}
                variant="outlined"
                disabled={isView}
                helperText={
                  errors?.contact_person_name ? (
                    <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors.contact_person_name}</span>
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
                value={data.contact_person_phone}
                onChange={handleChange}
                variant="outlined"
                disabled={isView}
                type="tel"
                helperText={
                  errors?.contact_person_phone ? (
                    <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors.contact_person_phone}</span>
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
                value={data.contact_person_email}
                onChange={handleChange}
                variant="outlined"
                disabled={isView}
                type="email"
                helperText={
                  errors?.contact_person_email ? (
                    <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors.contact_person_email}</span>
                  ) : ''
                }
              />
            </Grid>
          </Grid>
        </Box>
      </Box>


      <Box sx={{display: 'flex', gap:4, mt: 4, mb: 4 }}>
        <Button variant="contained" color="primary" size="large" onClick={handleSubmit}>
          Submit
        </Button>
        <Button variant="contained" color="inherit" size="large" onClick={() => navigate('/lcs-scs-page')}>
          Cancel
        </Button>
      </Box>
    </Container>
  );
};
