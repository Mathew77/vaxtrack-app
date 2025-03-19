import React, { useEffect, useState } from 'react';
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
  SelectChangeEvent,
} from '@mui/material';
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLocation, useNavigate } from 'react-router-dom';
import { NCSType } from 'src/hooks/apis/ncs/ncs-type';
import { toast } from 'react-toastify';
import { useFetchStates, useUpsertNcs } from 'src/hooks/apis/ncs/ncs-hooks';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import DoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import DoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

export default function NcsSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const { data: states = [] } = useFetchStates();
  const upsertNcs = useUpsertNcs();

  const initialValues: NCSType = {
    status: "",
    state: "",
    ncs_name: "",
    state_list: [],
    utilization_factor: 0,
    storage_capcity: 0,
    vaccine_volume: 0,
  };

  const [data, setData] = useState<NCSType>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof NCSType, string>>>({});
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);

  const setCurrentState = () => {
    if (state?.data) {
      const ncsData = state.data;
      setData({
        ...initialValues,
        ...ncsData,
        state: ncsData.state || '',
        storage_capacity: ncsData.storage_capacity || 0, 
        utilization_factor: ncsData.utilization_factor || 0,
        vaccine_volume: ncsData.vaccine_volume || 0,
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
    temp.state = data.state 
        ? '' 
        : 'State is required';
    temp.ncs_name = data.ncs_name 
        ? '' 
        : 'NCS Name is required';
    temp.state_list = data.state_list.length > 0 
        ? '' 
        : 'At least one state must be selected';
    temp.storage_capcity = data.storage_capcity > 0 
        ? '' 
        : 'Storage capacity must be greater than 0'; 
    temp.utilization_factor = data.utilization_factor >= 75 && data.utilization_factor <= 85
        ? '' 
        : 'Utilization factor must be between 75 and 85';
    temp.vaccine_volume = data.vaccine_volume > 0 
        ? '' 
        : 'Vaccine volume must be greater than 0';

    setErrors({ ...temp });
    return Object.values(temp).every((x) => x === '');
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setData((prev) => ({
      ...prev,
      [name]: name === 'ncs_name' ? value : value === '' ? 0 : Number(value),
    }));
  };

  const getDisplayValue = (value: number) => (value === 0 ? '' : value.toString());

  const handleChangePermission = (selected: string[]) => {
    setData((prev) => ({
      ...prev,
      state_list: selected,
    }));
  };

  const handleSubmit = () => {
    if (validate()) {
      if (isUpdate) {
        upsertNcs.mutate(
          { id: data.id, data },
          {
            onSuccess: (response) => {
              toast.success(response?.status || "NCS Updated Successfully");
              navigate('/ncs-page');
            },
            onError: (error) => {
              console.error("Update error:", error);
              toast.error("Failed to update NCS");
            },
          }
        );
      } else {
        upsertNcs.mutate(
          { data },
          {
            onSuccess: (response) => {
              toast.success(response?.status || "NCS Created Successfully");
              navigate('/ncs-page');
            },
            onError: (error) => {
              console.error("Create error:", error);
              toast.error("Failed to create NCS");
            },
          }
        );
      }
    }
  };

  const stateListOptions = states.map((state) => ({
    label: state.state,
    value: state.state,
  }));

  return (
    <Container sx={{ mt: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
        <Typography variant="h5">Storage Center Management Setup</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/ncs-page')}>
          Back
        </Button>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormControl sx={{ m: 0, width: '100%' }}>
            <Typography component="label" htmlFor="state">
              State <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
            </Typography>
            <Select
              id="state"
              name="state"
              value={data.state}
              onChange={handleSelectChange}
              sx={{ width: '100%' }}
              displayEmpty
              disabled={isView}
              variant="outlined"
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
            {errors.state && (
              <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                {errors.state}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <Typography component="label" htmlFor="ncs_name">
            NCS Name<span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            id="ncs_name"
            name="ncs_name"
            placeholder="NCS Name"
            value={data.ncs_name}
            onChange={handleChange}
            variant="outlined"
            disabled={isView}
            error={!!errors.ncs_name}
            helperText={errors.ncs_name}
          />
        </Grid>

        <Grid item xs={6}>
          <Typography component="label" htmlFor="utilization_factor">
            Utilization Factor (%)
          </Typography>
          <TextField
            fullWidth
            id="utilization_factor"
            name="utilization_factor"
            type="number"
            value={getDisplayValue(data.utilization_factor)}
            onChange={handleChange}
            variant="outlined"
            disabled={isView}
            inputProps={{ min: 0 }}
            error={!!errors.utilization_factor}
            helperText={errors.utilization_factor}
          />
        </Grid>

        <Grid item xs={6}>
          <Typography component="label" htmlFor="storage_capcity">
            Storage Capacity
          </Typography>
          <TextField
            fullWidth
            id="storage_capcity"
            name="storage_capcity"
            type="number"
            value={getDisplayValue(data.storage_capcity)}
            onChange={handleChange}
            variant="outlined"
            disabled={isView}
            inputProps={{ min: 0 }}
            error={!!errors.storage_capcity}
            helperText={errors.storage_capcity}
          />
        </Grid>

        <Grid item xs={6}>
          <Typography component="label" htmlFor="vaccine_volume">
            Vaccine Volume
          </Typography>
          <TextField
            fullWidth
            id="vaccine_volume"
            name="vaccine_volume"
            type="number"
            value={getDisplayValue(data.vaccine_volume)}
            onChange={handleChange}
            variant="outlined"
            disabled={isView}
            inputProps={{ min: 0 }}
            error={!!errors.vaccine_volume}
            helperText={errors.vaccine_volume}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl sx={{ m: 0, width: '100%' }}>
            <Typography component="label" sx={{ mb: 1 }}>
              State List <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
            </Typography>
            <DualListBox
              canFilter
              options={stateListOptions}
              selected={data.state_list}
              onChange={handleChangePermission}
              disabled={isView}
              icons={{
                moveToAvailable: <ArrowLeftIcon sx={{ fontSize: '16px' }} />,
                moveAllToAvailable: <DoubleArrowLeftIcon sx={{ fontSize: '16px' }} />,
                moveToSelected: <ArrowRightIcon sx={{ fontSize: '16px' }} />,
                moveAllToSelected: <DoubleArrowRightIcon sx={{ fontSize: '16px' }} />,
              }}
            />
            {errors.state_list && (
              <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                {errors.state_list}
              </Typography>
            )}
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 2, mt: 4, mb: 2 }}>
        <Button variant="contained" color="primary" size="large" onClick={handleSubmit}>
          Submit
        </Button>
        <Button variant="contained" color="inherit" size="large" onClick={() => navigate('/ncs-page')}>
          Cancel
        </Button>
      </Box>
    </Container>
  );
}