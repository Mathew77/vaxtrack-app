import React, { useEffect, useState } from 'react';
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
  SelectChangeEvent,
} from '@mui/material';
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import DoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import DoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { EHFType } from 'src/hooks/apis/ehf-uhf/ehf-type';
import { useFetchStates, useFetchLgas, useFetchWards, useUpsertEHF } from 'src/hooks/apis/ehf-uhf/ehf-hooks';
import { useFetchUHF } from 'src/hooks/apis/ehf-uhf/uhf-hooks';
import { toast } from 'react-toastify';


export default function EhfSetup() {

  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const activeTab = state?.activeTab || 0;    

  const upsertEHF = useUpsertEHF();

  const {data: states = [] } = useFetchStates();
  
  const [selectedState, setSelectedState] = useState('');
  const { data: lgas = [] } = useFetchLgas(selectedState);

  const [selectedLga, setSelectedLga] = useState('');
  const { data: wards = [] } = useFetchWards(selectedLga);

  // const { data: orgUnits = [] } = useFetchOrgUnits();

  const { data: uhfs = [] } = useFetchUHF();

  const initialValues: EHFType = {
    status: '',
    state: '',
    lga: '',
    ward: '',
    ehf_name: '',
    longtitude: "",
    lagtitude: "",
    uhf_list: [],
    contact_person_name: '',
    contact_person_phone: '',
    contact_person_email: '',
    storage_capcity: 0, 
    equipment_model_number: 0
  };

  const [data, setData] = useState<EHFType>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof EHFType, string>>>({});
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);

  const setCurrentState = () => {
    if (state?.data) {
      const ehfData = state.data;
      setData({
        ...initialValues,
        ...ehfData,
        state: ehfData.state || '',
        lga: ehfData.lga || '',
        ward: ehfData.ward || '',
        storage_capcity: ehfData.storage_capcity ?? 0,
        equipment_model_number: ehfData.equipment_model_number ?? 0,
      });
      setSelectedState(ehfData.state || '');
      setSelectedLga(ehfData.lga || '');
      setIsUpdate(state.isUpdate || false);
      setIsView(state.isView || false);
    }
  };

  useEffect(() => {
    setCurrentState();
  }, [state]);

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
  // ]);

  const validate = () => {
    let temp = { ...errors };
    temp.state = data.state 
        ? '' 
        : 'State is required';
    temp.lga = data.lga 
        ? '' 
        : 'Lga is required';
    temp.ward = data.ward 
        ? '' 
        : 'Ward is required';
    temp.ehf_name = data.ehf_name 
        ? '' 
        : 'EHF name required';
    temp.longtitude = data.longtitude 
        ? '' 
        : 'Longitude required';
    temp.lagtitude = data.lagtitude 
        ? '' 
        : 'Latitude required';
    temp.uhf_list = data.uhf_list.length > 0 ? '' : 'UHF required';

    temp.contact_person_name = data.contact_person_name 
        ? '' 
        : 'Contact person name required';
    temp.contact_person_phone = data.contact_person_phone 
        ? '' 
        : 'Contact person phone required';
    temp.contact_person_email = data.contact_person_email 
        ? '' 
        : 'Contact person email required';
        temp.storage_capcity = data.storage_capcity != null && data.storage_capcity > 0 
          ? '' 
          : 'Storage capacity must be greater than 0';

    setErrors({ ...temp });
    return Object.values(temp).every((x) => x === '');
  };

  const uhfOptions = uhfs.map(uhf => ({
    value: uhf.id?.toString() || '', 
    label: uhf.uhf_name 
  }));

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
  
  const getDisplayValue = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return '';
    return value === 0 ? '' : value.toString();
  };
  
  
  const GetLGA = (e: SelectChangeEvent<string>) => {
      const state = e.target.value;
      setSelectedState(state); 
      setData((prev) => ({
        ...prev,
        state: state,
        lga_id: '',
      }));
    };
  
    const GetWards = (event: SelectChangeEvent<string>) => {
      const lga = event.target.value;
      setSelectedLga(lga)
      setData((prev) => ({ 
        ...prev, 
        lga: lga,
        ward: ''
      }));
    };

    const handleUHFChange = (selected: string[]) => {
      setData((prev) => ({
        ...prev,
        uhf_list: selected
      }));
    };

    const handleSubmit = () => {
      if (validate()) {
        if (isUpdate) {
          upsertEHF.mutate(
            { id: data.id, data },
            {
              onSuccess: (response) => {
                toast.success(response?.status || "EHF Updated Successfully");
                navigate('/ehf-uhf-page', { state: { activeTab } });
              },
            }
          );
        } else {
          upsertEHF.mutate(
            { data },
            {
              onSuccess: (response) => {
                toast.success(response?.status || "EHF Created Successfully");
                navigate('/ehf-uhf-page', { state: { activeTab } });
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
          {isUpdate ? 'Edit Equipped Health Facilty' : isView ? 'View Equipped Health Facilty' : 'Equipped Health Facilty Setup'}
        </Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/ehf-uhf-page', { state: { activeTab } })}>
          Back
        </Button>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormControl sx={{ m: 0, width: '100%' }}>
            <Typography component="label" htmlFor="state" sx={{ mb: 1 }}>
              State <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
            </Typography>
            <Select
              id="state"
              name="state"
              value={data.state}
              onChange={GetLGA}
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
            {errors?.state !== '' && (
              <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                {errors?.state}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl sx={{ m: 0, width: '100%' }}>
            <Typography component="label" htmlFor="lga" sx={{ mb: 1 }}>
              Local Government <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
            </Typography>
            <Select
              id="lga_lgaid"
              name="lga"
              value={data.lga}
              onChange={GetWards}
              sx={{ width: '100%' }}
              displayEmpty
              variant="outlined"
              disabled={isView}
            >
              <MenuItem value="" disabled>
                Select LGA
              </MenuItem>
              {lgas.map((lga) => (
                <MenuItem key={lga.lga} value={lga.lga}>
                  {lga.lga}
                </MenuItem>
              ))}
            </Select>
            {errors?.lga !== '' && (
              <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                {errors?.lga}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl sx={{ m: 0, width: '100%' }}>
            <Typography component="label" htmlFor="ward" sx={{ mb: 1 }}>
              Ward <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
            </Typography>
            <Select
              id="ward"
              name="ward"
              value={data.ward}
              onChange={handleSelectChange}
              sx={{ width: '100%' }}
              displayEmpty
              variant="outlined"
              disabled={isView}
            >
              <MenuItem value="" disabled>
                Select Ward
              </MenuItem>
              {wards.map((ward) => (
                <MenuItem key={ward.ward} value={ward.ward}>
                  {ward.ward}
                </MenuItem>
              ))}
            </Select>
            {errors?.ward !== '' && (
              <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                {errors?.ward}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <Typography component="label" htmlFor="ehf_name">
            Equipped Health Facilty Name <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            id="ehf_name"
            name="ehf_name"
            placeholder="EHF Name"
            value={data.ehf_name}
            onChange={handleInputChange}
            variant="outlined"
            disabled={isView}
            helperText={
              errors?.ehf_name !== '' ? (
                <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.ehf_name}</span>
              ) : ''
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

        <Grid item xs={12}> 
          <FormControl sx={{ m: 0, width: '100%' }}>
            <Typography component="label" sx={{ mb: 1 }}>
              Unequipped Health Facilty (Cascade / Spoke)<span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
            </Typography>
            <DualListBox
              canFilter
              options={uhfOptions}
              onChange={handleUHFChange}
              selected={data.uhf_list}
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
            {errors?.uhf_list !== '' && (
              <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                {errors?.uhf_list}
              </Typography>
            )}
          </FormControl>
        </Grid>
      </Grid>

      {/* Vaccine Storage Capacity Section */}
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
              <Typography component="label" htmlFor="equipment_model_number">
                Cold Chain Equipment Model Number <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
              </Typography>
              <TextField
                  fullWidth
                  id="equipment_model_number"
                  name="equipment_model_number"
                  value={getDisplayValue(data.equipment_model_number)}
                  onChange={handleChange}
                  inputProps={{ min: 0 }}
                  variant="outlined"
                  disabled={isView}
                  type="number"
                  helperText={
                    errors?.equipment_model_number ? (
                      <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors.equipment_model_number}</span>
                    ) : ''
                  }
                />
            </Grid>

          </Grid>
        </Box>
      </Box>

      {/* Contact Information Section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
        <Typography variant="h5">
          Equipped Health Facility Contact Information
        </Typography>
        <Box>
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

      <Box sx={{ display: 'flex', gap: 2, mt: 4, mb: 4 }}>
        <Button variant="contained" color="primary" size="large" onClick={handleSubmit}>
          Submit
        </Button>
        <Button 
          variant="contained" 
          color="inherit" 
          size="large" 
          onClick={() => navigate('/ehf-uhf-page', { state: { activeTab } })}>
          Cancel
        </Button>
      </Box>
    </Container>
  );
}

