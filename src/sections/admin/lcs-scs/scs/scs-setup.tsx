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
  SelectChangeEvent,
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
        storage_capcity: 0, 
        utilization_factor: 0,
        vaccine_volume: 0,
        doses_vial: 0,
        packing_factor: 0,
        buffer_stock: 0,
        max_vial: 0, 
        max_doses: 0,
        adjusted_max_doses: 0,
    };

  const [data, setData] = useState<SCSType>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof SCSType, string>>>({});
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);

  const setCurrentState = () => {
    if (state?.data) {
      const scsData = state.data;
      setData({
        ...initialValues,
        ...scsData,
        stat_id: scsData.stat_id || '',
        storage_capcity: scsData.storage_capcity || 0,
        utilization_factor: scsData.utilization_factor || 0,
        vaccine_volume: scsData.vaccine_volume || 0,
        doses_vial: scsData.doses_vial || 0,
        packing_factor: scsData.packing_factor || 0, 
        buffer_stock: scsData.buffer_stock || 0,     
        max_vial: scsData.max_vial || 0,
        max_doses: scsData.max_doses || 0,
        adjusted_max_doses: scsData.adjusted_max_doses || 0,
      });
      setIsUpdate(state.isUpdate || false);
      setIsView(state.isView || false);
    }
  };

  useEffect(() => {
    setCurrentState();
  }, [state]);
    
  const calculateStorage = () => {
        const C = data.storage_capcity || 0;
        const U = (data.utilization_factor || 0) / 100;
        const D = data.doses_vial || 0;
        const P = data.packing_factor || 0;
        const B = (data.buffer_stock || 0) / 100;
      
        if (C > 0 && P > 0 && !isView) {
          const maxVial = ((C * 1000) * U) / P;
          const maxDoses = maxVial * D;
          const adjustedMaxDoses = maxDoses * (1 - B);
      
          setData((prev) => ({
            ...prev,
            max_vial: Math.round(maxVial),
            max_doses: Math.round(maxDoses),
            adjusted_max_doses: Math.round(adjustedMaxDoses),
          }));
        }
      };
    
      useEffect(() => {
        if (!isView) calculateStorage();
      }, [
        data.storage_capcity,
        data.utilization_factor,
        data.vaccine_volume,
        data.doses_vial,
        data.packing_factor,
        data.buffer_stock,
      ]);


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
    temp.storage_capcity = data.storage_capcity > 0 
        ? '' 
        : 'Storage capacity must be greater than 0';
    temp.utilization_factor = data.utilization_factor >= 75 && data.utilization_factor <= 85
        ? ''
        : 'Utilization factor must be between 75 and 85';
    temp.vaccine_volume = data.vaccine_volume > 0 
        ? '' 
        : 'Vaccine volume must be greater than 0';
    temp.doses_vial = data.doses_vial > 0 
        ? '' 
        : 'Doses per vial must be greater than 0';
    temp.packing_factor = data.packing_factor > 0 
        ? '' 
        : 'Packing factor must be greater than 0';
    temp.buffer_stock = data.buffer_stock >= 25 && data.buffer_stock <= 50
      ? ''
      : 'Buffer stock must be between 25 and 50';
    
    setErrors({ ...temp });
    return Object.values(temp).every((x) => x === '');
  };

   const preventNegativeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value !== '' && Number(value) < 0) {
        e.target.value = '0';
      }
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
      const { name, value } = event.target;
      setData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setData((prev) => ({
        ...prev,
        [name]: value, 
      }));
    };
      
    
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
  
    let numericValue = value === '' ? 0 : Number(value);
    if (numericValue < 0) numericValue = 0; 
  
    setData((prev) => ({
      ...prev,
      [name]: numericValue,
    }));
  };
    
  const getDisplayValue = (value: number): string => {
    return value === 0 ? '' : value.toString();
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
                onChange={handleSelectChange}
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
            onChange={handleInputChange}
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
            onChange={handleInputChange}
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
            onChange={handleInputChange}
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
        <Typography variant="h5">Vaccine Storage Capacity</Typography>
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Typography component="label" htmlFor="storage_capcity">
                Storage Capacity (liters) <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
              </Typography>
              <TextField
                  fullWidth
                  id="storage_capcity"
                  name="storage_capcity"
                  value={getDisplayValue(data.storage_capcity)} 
                  onChange={handleChange}
                  inputProps={{ min: 0 }}
                  variant="outlined"
                  disabled={isView}
                  type="number"
                  helperText={
                    errors?.storage_capcity ? (
                      <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors.storage_capcity}</span>
                    ) : ''
                  }
                />
            </Grid>

            <Grid item xs={6}>
              <Typography component="label" htmlFor="utilization_factor">
                Utilization Factor (75-85%) <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
              </Typography>
              <TextField
                  fullWidth
                  id="utilization_factor"
                  name="utilization_factor"
                  placeholder="Utilization Factor"
                  value={getDisplayValue(data.utilization_factor)} 
                  onChange={handleChange}
                  onInput={preventNegativeInput} 
                  inputProps={{ min: 0 }}
                  variant="outlined"
                  disabled={isView}
                  type="number"
                  helperText={
                    errors?.utilization_factor ? (
                      <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors.utilization_factor}</span>
                    ) : ''
                  }
                />
            </Grid>

            <Grid item xs={6}>
              <Typography component="label" htmlFor="vaccine_volume">
                Vaccine Volume (cm³) <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                id="vaccine_volume"
                name="vaccine_volume"
                placeholder="Vaccine Volume"
                value={getDisplayValue(data.vaccine_volume)} 
                onChange={handleChange}
                onInput={preventNegativeInput}
                inputProps={{ min: 0 }} 
                variant="outlined"
                disabled={isView}
                type="number"
                helperText={
                  errors?.vaccine_volume ? (
                    <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors.vaccine_volume}</span>
                  ) : ''
                }
              />
            </Grid>

            <Grid item xs={6}>
              <Typography component="label" htmlFor="doses_vial">
                Doses per Vial <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                id="doses_vial"
                name="doses_vial"
                placeholder="Doses per Vial"
                value={getDisplayValue(data.doses_vial)} 
                onChange={handleChange}
                onInput={preventNegativeInput}
                inputProps={{ min: 0 }} 
                variant="outlined"
                disabled={isView}
                type="number"
                helperText={
                  errors?.doses_vial ? (
                    <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors.doses_vial}</span>
                  ) : ''
                }
              />
            </Grid>

            <Grid item xs={6}>
              <Typography component="label" htmlFor="packing_factor">
                Packing Factor (cm³ per vial) <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                id="packing_factor"
                name="packing_factor"
                placeholder="Packing Factor"
                value={getDisplayValue(data.packing_factor)} 
                onChange={handleChange}
                onInput={preventNegativeInput}
                inputProps={{ min: 0 }} 
                variant="outlined"
                disabled={isView}
                type="number"
                helperText={
                  errors?.packing_factor ? (
                    <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors.packing_factor}</span>
                  ) : ''
                }
              />
            </Grid>

            <Grid item xs={6}>
              <Typography component="label" htmlFor="buffer_stock">
                Buffer Stock (25-50%) <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
              </Typography>
              <TextField
                fullWidth
                id="buffer_stock"
                name="buffer_stock"
                placeholder="Buffer Stock"
                value={getDisplayValue(data.buffer_stock)} 
                onChange={handleChange}
                onInput={preventNegativeInput}
                inputProps={{ min: 0 }} 
                variant="outlined"
                disabled={isView}
                type="number"
                helperText={
                  errors?.buffer_stock ? (
                    <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors.buffer_stock}</span>
                  ) : ''
                }
              />
            </Grid>

            <Grid item xs={6}>
              <Typography component="label" htmlFor="max_vial">Max Vials</Typography>
              <TextField
                fullWidth
                id="max_vial"
                name="max_vial"
                value={data.max_vial}
                variant="outlined"
                disabled
              
              />
            </Grid>

            <Grid item xs={6}>
              <Typography component="label" htmlFor="max_doses">Max Doses</Typography>
              <TextField
                fullWidth
                id="max_doses"
                name="max_doses"
                value={data.max_doses}
                variant="outlined"
                disabled
              
              />
            </Grid>

            <Grid item xs={6}>
              <Typography component="label" htmlFor="adjusted_max_doses">Adjusted Max Doses</Typography>
              <TextField
                fullWidth
                id="adjusted_max_doses"
                name="adjusted_max_doses"
                value={data.adjusted_max_doses}
                variant="outlined"
                disabled
              />
            </Grid>
          </Grid>
        </Box>
      </Box>

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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
