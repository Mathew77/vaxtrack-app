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
import { useFetchStates, useFetchLgas, useFetchWards, useFetchOrgUnits, useUpsertEHF } from 'src/hooks/apis/ehf-uhf/ehf-hooks';
import { useFetchUHF } from 'src/hooks/apis/ehf-uhf/uhf-hooks';
import { toast } from 'react-toastify';


export default function EhfSetup() {

  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const upsertEHF = useUpsertEHF();

  const {data: states = [] } = useFetchStates();
  
  const [selectedState, setSelectedState] = useState('');
  const { data: lgas = [] } = useFetchLgas(selectedState);

  const [selectedLga, setSelectedLga] = useState('');
  const { data: wards = [] } = useFetchWards(selectedLga);

  const { data: orgUnits = [] } = useFetchOrgUnits();

  const { data: uhfs = [] } = useFetchUHF();

  const initialValues: EHFType = {
    status: '',
    state: '',
    lga: '',
    ward: '',
    org_unit: '',
    ehf_name: '',
    uhf_list: [],
    contact_person_name: '',
    contact_person_phone: '',
    contact_person_email: '',
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
        storage_capcity: ehfData.storage_capcity || 0,
        utilization_factor: ehfData.utilization_factor || 0,
        vaccine_volume: ehfData.vaccine_volume || 0,
        doses_vial: ehfData.doses_vial || 0,
        packing_factor: ehfData.packing_factor || 0, 
        buffer_stock: ehfData.buffer_stock || 0,     
        max_vial: ehfData.max_vial || 0,
        max_doses: ehfData.max_doses || 0,
        adjusted_max_doses: ehfData.adjusted_max_doses || 0,
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
    temp.state = data.state 
        ? '' 
        : 'State is required';
    temp.lga = data.lga 
        ? '' 
        : 'Lga is required';
    temp.ward = data.ward 
        ? '' 
        : 'Ward is required';
    temp.org_unit = data.org_unit 
        ? '' 
        : 'Org unit required';
    temp.ehf_name = data.ehf_name 
        ? '' 
        : 'EHF name required';
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
  
  const getDisplayValue = (value: number): string => {
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
                navigate('/ehf-uhf-page');
              },
            }
          );
        } else {
          upsertEHF.mutate(
            { data },
            {
              onSuccess: (response) => {
                toast.success(response?.status || "EHF Created Successfully");
                navigate('/ehf-uhf-page');
              },
            }
          );
        }
      }
    };


  return (
    <Container sx={{ mt: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
        <Typography variant="h5">EHF Setup</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/ehf-uhf-page')}>
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
              Lga <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
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
          <FormControl sx={{ m: 0, width: '100%' }}>
            <Typography component="label" htmlFor="org_unit" sx={{ mb: 1 }}>
              Org Unit <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
            </Typography>
            <Select
              id="org_unit"
              name="org_unit"
              value={data.org_unit}
              onChange={handleSelectChange}
              sx={{ width: '100%' }}
              displayEmpty
              variant="outlined"
              disabled={isView}
            >
              <MenuItem value="" disabled>
                Select Org Unit
              </MenuItem>
              {orgUnits.map((orgUnit) => (
                <MenuItem key={`${orgUnit.name}-${orgUnit.id}`} value={orgUnit.id}>
                  {orgUnit.name}
                </MenuItem>
              ))}
            </Select>
            {errors?.org_unit !== '' && (
              <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                {errors?.org_unit}
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

        <Grid item xs={12}> 
          <FormControl sx={{ m: 0, width: '100%' }}>
            <Typography component="label" sx={{ mb: 1 }}>
              UHF (Cascade / Spoke)<span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
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
              <Typography component="label" htmlFor="utilization_factor">
                Utilization Factor (75-85%) <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
              </Typography>
              <TextField
                  fullWidth
                  id="utilization_factor"
                  name="utilization_factor"
                  value={getDisplayValue(data.utilization_factor)}
                  onChange={handleChange}
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
                value={getDisplayValue(data.vaccine_volume)}
                onChange={handleChange}
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
                value={getDisplayValue(data.doses_vial)}
                onChange={handleChange}
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
                value={getDisplayValue(data.packing_factor)}
                onChange={handleChange}
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
                value={getDisplayValue(data.buffer_stock)}
                onChange={handleChange}
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

      {/* Contact Information Section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
        <Typography variant="h5">
          Contact Information
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
        <Button variant="contained" color="inherit" size="large" onClick={() => navigate('/ehf-uhf-page')}>
          Cancel
        </Button>
      </Box>
    </Container>
  );
}

