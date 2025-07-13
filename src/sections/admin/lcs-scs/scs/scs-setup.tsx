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
import { useFetchLcsEhf, useFetchStates, useUpsertScs } from 'src/hooks/apis/lcs-scs/scs-hooks';
import { toast } from 'react-toastify';
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import DoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import DoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';


export default function ScsSetup() {

  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const activeTab = state?.activeTab || 0;    

  const { data: states = [] } = useFetchStates();
  const  upsertScs = useUpsertScs();
   const { data: ehfList = [] } = useFetchLcsEhf();

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
      ehf_list: []
    };

  const [data, setData] = useState<SCSType>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof SCSType, string>>>({});
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [filteredEhf, setFilteredEHF] = useState<any[]>([]);

  const setCurrentState = () => {
    if (state?.data) {
      const scsData = state.data;
      setData({
        ...initialValues,
        ...scsData,
        stat_id: scsData.stat_id || '',
        storage_capcity: scsData.storage_capcity || 0,
        ehf_list: scsData.ehf_list || '',
      });
      setIsUpdate(state.isUpdate || false);
      setIsView(state.isView || false);
    }
  };

  useEffect(() => {
    setCurrentState();
  }, [state]);

  useEffect(() => {
    if (data.stat_id && ehfList.length > 0) {
      const filtered = ehfList.filter((ehf: any) => ehf.state === data.stat_id);
      setFilteredEHF(filtered);
    } else {
      setFilteredEHF([]);
    }
  }, [data.stat_id, ehfList]);
    
  // const calculateStorage = () => {
  //   const C = data.storage_capcity || 0;
  //   const U = (data.utilization_factor || 0) / 100;
  //   const D = data.doses_vial || 0;
  //   const P = data.packing_factor || 0;
  //   const B = (data.buffer_stock || 0) / 100;
  
  //   if (C > 0 && P > 0 && !isView) {
  //     const maxVial = ((C * 1000) * U) / P;
  //     const maxDoses = maxVial * D;
  //     const adjustedMaxDoses = maxDoses * (1 - B);
  
  //     setData((prev) => ({
  //       ...prev,
  //       max_vial: Math.round(maxVial),
  //       max_doses: Math.round(maxDoses),
  //       adjusted_max_doses: Math.round(adjustedMaxDoses),
  //     }));
  //   }
  // };
    
      // useEffect(() => {
      //   if (!isView) calculateStorage();
      // }, [
      //   data.storage_capcity,
      //   data.utilization_factor,
      //   data.vaccine_volume,
      //   data.doses_vial,
      //   data.packing_factor,
      //   data.buffer_stock,
      // ]);


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

    temp.ehf_list = (data.ehf_list?.length ?? 0) > 0 
      ? '' 
      : 'At least one EHF must be selected';
    
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

      if (name === 'stat_id') {
        setData((prev) => ({
          ...prev,
          [name]: value,
          ehf_list: name === 'stat_id' ? [] : prev.ehf_list,
        }));
      } else {
        setData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setData((prev) => ({
        ...prev,
        [name]: value, 
      }));
    };

    const handleEhfChange = (selected: string[]) => {
      setData((prev) => ({
        ...prev,
        ehf_list: selected,
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

  const ehfOptions = filteredEhf.map((ehf) => ({
    value: ehf.id?.toString() || '',
    label: ehf.name || ehf.ehf_name || `EHF ${ehf.id}`,
  }));

  const handleEHFChange = (selected: string[]) => {
      setData((prev) => ({
        ...prev,
        ehf_list: selected
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
              navigate('/lcs-scs-page', { state: { activeTab } });
            },
          }
        );
      } else {
        upsertScs.mutate(
          { data },
          {
            onSuccess: (response) => {
              toast.success(response?.status || "SCS Created Successfully");
              navigate('/lcs-scs-page', { state: { activeTab } });
            },
          }
        );
      }
    }
  };

  return (
    <Container sx={{ mt: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
        <Typography variant="h5">
          {isUpdate ? 'Edit State Cold Chain Store' : isView ? 'View State Cold Chain Store' : 'State Cold Chain Store Setup'}
        </Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/lcs-scs-page', { state: { activeTab } })}>
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

        {/* <Grid item xs={6}>
          <FormControl sx={{ m: 0, width: '100%' }}>
            <Typography component="label" htmlFor="ehf_list">
              Equipped Health Facility (EHF) <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
            </Typography>
            <Select
              id="ehf_list"
              name="ehf_list"
              value={data.ehf_list}
              onChange={handleSelectChange}
              sx={{ width: '100%' }}
              displayEmpty
              variant="outlined"
              disabled={isView || !data.stat_id}
            >
              <MenuItem value="" disabled>
                {'Select EHF'}
              </MenuItem>
              {filteredEhf.map((ehf) => (
                <MenuItem key={ehf.id} value={ehf.id}>
                  {ehf.name || ehf.ehf_name || `EHF ${ehf.id}`}
                </MenuItem>
              ))}
            </Select>
            {errors?.ehf_list !== '' && (
              <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                {errors?.ehf_list}
              </Typography>
            )}
          </FormControl>
        </Grid> */}

        <Grid item xs={6}>
          <Typography component="label" htmlFor="scs_name">
            State Cold Chain Store Name<span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
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

         <Grid item xs={6}>
             <FormControl sx={{ mt: 4, width: '100%' }}> 
                <Typography component="label" htmlFor="ehf_list">
              Equipped Health Facility (EHF) <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
            </Typography>
            <DualListBox
              canFilter
              options={ehfOptions}
              onChange={handleEHFChange}
              selected={data.ehf_list}
              className="dual-listbox-custom"
              alignActions="middle" 
              disabled={isView}
              icons={{
                  moveToAvailable: <ArrowLeftIcon sx={{ fontSize: '16px' }} />, 
                  moveAllToAvailable: <DoubleArrowLeftIcon sx={{ fontSize: '16px' }} />,
                  moveToSelected: <ArrowRightIcon sx={{ fontSize: '16px' }} />,
                  moveAllToSelected: <DoubleArrowRightIcon sx={{ fontSize: '16px' }} />, 
                }}
            />
            {errors?.ehf_list !== '' && (
              <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                {errors?.ehf_list}
              </Typography>
            )}
              </FormControl>
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

          </Grid>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
        <Typography
          variant="h5"
  
        >
          State Cold Chain Officer Contact Information
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
        <Button 
          variant="contained" 
          color="inherit" 
          size="large" 
          onClick={() => navigate('/lcs-scs-page', { state: { activeTab } })}>
          Cancel
        </Button>
      </Box>
    </Container>
  );
};
