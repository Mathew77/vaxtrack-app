import React, { useEffect, useState } from 'react';
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
  SelectChangeEvent,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { LcsType } from 'src/hooks/apis/lcs-scs/lcs-type';
import { useFetchLgas, useFetchStates, useUpsertLcs } from 'src/hooks/apis/lcs-scs/lcs-hooks';
import { toast } from 'react-toastify';
import { useVaccineStorage } from 'src/hooks/apis/ehf-uhf/ehf-hooks';
import { useFetchHFAList } from 'src/hooks/apis/ehf-uhf/uhf-hooks';
import { preventInvalidKeys } from 'src/utils/preventInvalidkeys';



export default function LcsSetup() {

  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const activeTab = state?.activeTab || 0

  const {data: states = []} = useFetchStates()
  const [selectedState, setSelectedState] = useState('');

  const { data: lgas = [] } = useFetchLgas(selectedState);
  const [selectedLga, setSelectedLga] = useState('');
  const upsertLcs = useUpsertLcs()

  const { data: vaccineStorageEquipment = [] } = useVaccineStorage();

  // const { data: hfaList = [], isLoading: hfaLoading } = useFetchHFAList(selectedState, selectedLga)

  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);

  const initialValues: LcsType = {
    status: "",
    stat_id: "",
    lga_id: "",
    lcs_name: "",
    longtitude: "",
    lagtitude: "",
    contact_person_name: "",
    contact_person_phone: "",
    contact_person_email: "",
    storage_capcity: "", 
  }
  

  const [data, setData] = useState<LcsType>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof LcsType, string>>>({});
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);


  const setCurrentState = () => {
    if (state?.data) {
      const lcsData = state.data;
      setData({
        ...initialValues,
        ...lcsData,
        stat_id: lcsData.stat_id || '',
        lga_id: lcsData.lga_id || '',
      });
      setSelectedState(lcsData.stat_id || ''); 
      setSelectedLga(lcsData.lga || '');
      setIsUpdate(state.isUpdate || false);
      setIsView(state.isView || false);

      if (lcsData.storage_capcity) {
        const equipment = vaccineStorageEquipment.find(eq => eq.code === lcsData.storage_capcity);
        if (equipment) {
          setSelectedEquipment(equipment);
        }
      }
    }
  };

  useEffect(() => {
    setCurrentState();
  }, [state, vaccineStorageEquipment]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setData((prev) => ({
            ...prev,
            longtitude: longitude.toString(),
            lagtitude: latitude.toString(),
          }));
        } );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);


  const validate = () => {
    let temp = { ...errors };
    temp.stat_id = data.stat_id 
        ? '' 
        : 'State is required';
    temp.lga_id = data.lga_id 
        ? '' 
        : 'Lga is required';
    temp.lcs_name = data.lcs_name 
        ? '' 
        : 'Lcs name required';
    // temp.longtitude = data.longtitude 
    //     ? '' 
    //     : 'Longitude required';
    // temp.lagtitude = data.lagtitude 
    //     ? '' 
    //     : 'Latitude required';
    temp.contact_person_name = data.contact_person_name 
        ? '' 
        : 'Contact person name required';
    temp.contact_person_phone = data.contact_person_phone
      ? data.contact_person_phone.length === 11
        ? ''
        : 'Phone number must be exactly 11 digits'
      : 'Phone number is required';
    temp.contact_person_email = data.contact_person_email 
        ? '' 
        : 'Contact person email required';
    temp.storage_capcity = data.storage_capcity && data.storage_capcity.trim() !== ''
        ? '' 
        : 'Storage equipment is required';

    setErrors({ ...temp });
    return Object.values(temp).every((x) => x === '');
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
  
    setData((prev) => ({
      ...prev,
      [name]: value, 
    }));
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 11);
    setData((prev) => ({ ...prev, contact_person_phone: numericValue }));
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
    const stateId = e.target.value;
    setSelectedState(stateId); 
    setData((prev) => ({
      ...prev,
      stat_id: stateId,
      lga_id: '',
    }));
  };
  
  const handleLgaChange = (event: SelectChangeEvent<string>) => {
    const lgaId = event.target.value;
    setSelectedLga(lgaId)
    setData((prev) => ({ 
        ...prev,
        lga_id: lgaId, 
        // lcs_name: '',
      }));
  };

  // const handleLcsNameChange = (event: SelectChangeEvent<string>) => {
  //   const lcs_name = event.target.value;
  //   const selectedFacility = hfaList.find(hfa => hfa.facility_name === lcs_name)
  //   setData((prev) => ({
  //     ...prev,
  //     lcs_name: lcs_name,
  //     longtitude: selectedFacility ? selectedFacility.longitude?.toString() || '' : '',
  //     lagtitude: selectedFacility ? selectedFacility.latitude?.toString() || '' : ''
  //   }));
  // }

  const handleSubmit = () => {
    if (validate()) {
      if (isUpdate) {
        upsertLcs.mutate(
          { id: data.id, data },
          {
            onSuccess: (response) => {
              toast.success(response?.status || "LCS Updated Successfully");
              navigate('/lcs-scs-page', {state: { activeTab }});
            },
          }
        );
      } else {
        upsertLcs.mutate(
          { data },
          {
            onSuccess: (response) => {
              toast.success(response?.status || "LCS Created Successfully");
              navigate('/lcs-scs-page', {state: { activeTab }});
            },
          }
        );
      }
    }
  };
  

  return (
    <Container sx={{ mt:2 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
        <Typography variant="h5">
          {isUpdate ? 'Edit Local Cold Chain Store' : isView ? 'View Local Cold Chain Store' : 'Local Cold Chain Store Setup'}
        </Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/lcs-scs-page', {state: { activeTab }})}>
          Back
        </Button>
     
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormControl sx={{ m: 0, width: '100%' }}>
            <Typography component="label" htmlFor="stat_id" sx={{ mb: 1 }}>
              State <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
            </Typography>
            <Select
              id="stat_id"
              name="stat_id"
              value={data.stat_id}
              onChange={GetLGA}
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
            {errors?.stat_id !== '' && (
              <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                {errors?.stat_id}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl sx={{ m: 0, width: '100%' }}>
            <Typography component="label" htmlFor="lga_id" sx={{ mb: 1 }}>
              Local Government <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
            </Typography>
            <Select
              id="lga_id"
              name="lga_id"
              value={data.lga_id}
              onChange={handleLgaChange}
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
            {errors?.lga_id !== '' && (
              <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                {errors?.lga_id}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <Typography component="label" htmlFor="lcs_name" >
            Local Cold Chain Store Name <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            id="lcs_name"
            name="lcs_name"
            placeholder="Lcs Name"
            value={data.lcs_name}
            onChange={handleInputChange}
            variant="outlined"
            disabled={isView}
            helperText={
              errors?.lcs_name !== '' ? (
                <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.lcs_name}</span>
              ) : ''
            }
          />
        </Grid>

        {/* <Grid item xs={6}>
          <FormControl sx={{ m: 0, width: '100%' }}>
            <Typography component="label" htmlFor="lcs_name" >
              Local Cold Chain Store Name  <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
            </Typography>
            <Select
              id="lcs_name"
              name="lcs_name"
              value={data.lcs_name}
              onChange={handleLcsNameChange}
              sx={{ width: '100%' }}
              displayEmpty
              variant="outlined"
              disabled={isView || !selectedState || !selectedLga || hfaLoading}
            >
              <MenuItem value="" disabled>
                {hfaLoading ? 'Loading facilities...' : 
                !selectedState || !selectedLga ? 'Select State and LGA first' : 
                hfaList.length === 0 ? 'No facilities found' :
                'Select LCS Name'}
              </MenuItem>
              {hfaList.map((hfa, index) => (
                <MenuItem key={`${hfa.facility_name}-${index}`} value={hfa.facility_name}>
                  {hfa.facility_name}
                </MenuItem>
              ))}
            </Select>
            {errors?.lcs_name !== '' && (
              <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                {errors?.lcs_name}
              </Typography>
            )}
          </FormControl>
        </Grid> */}

        <Grid item xs={6}>
          <Typography component="label" htmlFor="longtitude" >
            Longitude
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
            Latitude
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

      {/* Vaccine Storage Capacity Section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
        <Typography variant="h5">Vaccine Storage Capacity</Typography>
        <Box>
          <Grid container spacing={3}>
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

          </Grid>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
          <Typography
            variant="h5" 
          >
           Local Cold Chain Officer Contact Information
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
                  onChange={handlePhoneChange}
                  variant="outlined"
                  disabled={isView}
                  type="text"
                  inputProps={{ inputMode: 'numeric', maxLength: 11 }}
                  onKeyDown={preventInvalidKeys}
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
                  type="email"
                  disabled={isView}
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
        <Button 
          variant="contained" 
          color="inherit" 
          size="large" 
          onClick={() => navigate('/lcs-scs-page', { state: { activeTab }})}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" size="large" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Container>
  );
}