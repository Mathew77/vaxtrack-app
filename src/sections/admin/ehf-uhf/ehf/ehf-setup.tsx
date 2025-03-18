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
    contact_person_email: ''
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
        ward: ehfData.ward || ''
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

    setErrors({ ...temp });
    return Object.values(temp).every((x) => x === '');
  };

  const uhfOptions = uhfs.map(uhf => ({
    value: uhf.id?.toString() || '', 
    label: uhf.uhf_name 
  }));

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
              onChange={handleChange}
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
              onChange={handleChange}
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
            onChange={handleChange}
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

