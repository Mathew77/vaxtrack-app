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
import { useVaccineStorage } from 'src/hooks/apis/ehf-uhf/ehf-hooks';

export default function NcsSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const { data: states = [] } = useFetchStates();
  const upsertNcs = useUpsertNcs();

  const { data: vaccineStorageEquipment = [] } = useVaccineStorage();
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);

  const initialValues: NCSType = {
    status: "",
    state: "",
    ncs_name: "",
    state_list: [],
    storage_capcity: "",
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
      });
      setIsUpdate(state.isUpdate || false);
      setIsView(state.isView || false);

      if (ncsData.storage_capcity) {
        const equipment = vaccineStorageEquipment.find(eq => eq.code === ncsData.storage_capcity);
        if (equipment) {
          setSelectedEquipment(equipment);
        }
      }
    }
  };

  useEffect(() => {
    setCurrentState();
  }, [state, vaccineStorageEquipment]);

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
    temp.storage_capcity = data.storage_capcity && data.storage_capcity.trim() !== ''
        ? '' 
        : 'Storage equipment is required';

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

  const handleEquipmentChange = (event: SelectChangeEvent<string>) => {
    const selectedCode = event.target.value;
    const equipment = vaccineStorageEquipment.find(eq => eq.code === selectedCode); 
    
      if (equipment) {
        setSelectedEquipment(equipment); 
        setData((prev) => ({
          ...prev,
          storage_capcity: equipment.code, 
        }));
      } else {
        setSelectedEquipment(null); 
        setData((prev) => ({
          ...prev,
          storage_capcity: '',
        }));
      }
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
            }
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
        <Typography variant="h5">
          {isUpdate ? 'Edit National Strategic Cold Store Setup' : isView ? 'View National Strategic Cold Store Setup' : 'National Strategic Cold Store Setup'}
        </Typography>
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
            National Strategic Cold Store Name<span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
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
          <FormControl sx={{ m: 0, width: '100%' }}>
            <Typography component="label" htmlFor="storage_equipment" sx={{ mb: 1 }}>
              Storage Equipment <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
            </Typography>
            <Select
              id="storage_equipment"
              name="storage_equipment"
              value={selectedEquipment?.code || ''}
              onChange={handleEquipmentChange}
              sx={{ width: '100%' }}
              displayEmpty
              variant="outlined"
              disabled={isView}
            >
              <MenuItem value="" disabled>
                Select Storage Equipment
              </MenuItem>
              {vaccineStorageEquipment.map((equipment) => (
                <MenuItem key={equipment.code} value={equipment.code}>
                  {equipment.description} - {equipment.liters_minustwenty}L
                </MenuItem>
              ))}
            </Select>
            {errors?.storage_capcity !== '' && (
              <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                {errors?.storage_capcity}
              </Typography>
            )}
          </FormControl>
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
        <Button variant="outlined" size="large" onClick={() => navigate('/ncs-page')}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" size="large" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Container>
  );
}