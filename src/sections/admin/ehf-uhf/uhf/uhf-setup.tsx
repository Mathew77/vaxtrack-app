import { useEffect, useState } from 'react';
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
import { UHFType } from 'src/hooks/apis/ehf-uhf/uhf-type';
import { useFetchStates, useFetchLgas, useUpsertUHF, useFetchHFAList} from 'src/hooks/apis/ehf-uhf/uhf-hooks';
import { toast } from 'react-toastify';
import { preventInvalidKeys } from 'src/utils/preventInvalidkeys';


export default function UhfSetup() {

  const navigate = useNavigate()
  const location = useLocation();
  const { state } = location;
  const activeTab = state?.activeTab || 0;  

  const {data: states = [] } = useFetchStates();

  const [selectedState, setSelectedState] = useState('');
  const { data: lgas = [] } = useFetchLgas(selectedState);

  const [selectedLga, setSelectedLga] = useState('');
  // const { data: wards = [] } = useFetchWards(selectedLga);

  // const { data: orgUnits = [] } = useFetchOrgUnits();

  const upsertUHF = useUpsertUHF();
  const { data: hfaList = [], isLoading: hfaLoading } = useFetchHFAList(selectedState, selectedLga, 'UHF');

  const initialValues: UHFType = {
    status: '',
    state: '',
    lga: '',
    // ward: '',
    // org_unit: '',
    uhf_name: '',
    longtitude: "",
    lagtitude: "",
    contact_person_name: '',
    contact_person_phone: '',
    contact_person_email: '',
    assigned_ehf_unique_id: '',
  };

  const [data, setData] = useState<UHFType>(initialValues);
  const [errors, setErrors] = useState<Partial<UHFType>>({});
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);


  const setCurrentState = () => {
      if (state?.data) {
        const uhfData = state.data;
        setData({
          ...initialValues,
          ...uhfData,
          state: uhfData.state || '',
          lga: uhfData.lga || '',
          // ward: uhfData.ward || ''
        });
        setSelectedState(uhfData.state || ''); 
        setSelectedLga(uhfData.lga || ''); 
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
    // temp.ward = data.ward 
    //     ? '' 
    //     : 'Ward is required';
    // temp.org_unit = data.org_unit 
    //     ? '' 
    //     : 'Org unit required';
    temp.uhf_name = data.uhf_name 
        ? '' 
        : 'uhf name required';
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

  const GetLGA = (e: SelectChangeEvent<string>) => {
    const state = e.target.value;
    setSelectedState(state); 
    setData((prev) => ({
      ...prev,
      state: state,
      lga: '',
      uhf_name: '',
    }));
    setSelectedLga('');
  };

   const handleLgaChange = (e: SelectChangeEvent<string>) => {
      const lga = e.target.value;
      setSelectedLga(lga);

      setData((prev) => ({
        ...prev,
        lga: lga, 
        uhf_name: '',
      }));
    };

    const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      const numericValue = value.replace(/[^0-9]/g, '').slice(0, 11);
      setData((prev) => ({ ...prev, contact_person_phone: numericValue }));
    };

    const handleUhfNameChange = (event: SelectChangeEvent<string>) => {
      const uhf_name = event.target.value;
      const selectedFacility = hfaList.find(hfa => hfa.name_of_ehf === uhf_name)
      setData((prev) => ({
        ...prev,
        uhf_name: uhf_name,
        longtitude: selectedFacility ? selectedFacility.longitude?.toString() || '' : '',
        lagtitude: selectedFacility ? selectedFacility.latitude?.toString() || '' : ''
      }));
    }
  

  //  const GetWards = (event: SelectChangeEvent<string>) => {
  //     const lga = event.target.value;
  //     setSelectedLga(lga)
  //     setData((prev) => ({ 
  //       ...prev, 
  //       lga: lga,
  //       ward: ''
  //     }));
  //   };
  
    const handleSubmit = () => {
      if (validate()) {
        if (isUpdate) {
          upsertUHF.mutate(
            { id: data.id, data },
            {
              onSuccess: response => {
                toast.success(response?.status || "UHF Updated Successfully");
                navigate('/ehf-uhf-page', { state: { activeTab } });
              },
            }
          );
        } else {
          upsertUHF.mutate(
            { data },
            {
              onSuccess: (response) => {
                toast.success(response?.status || "UHF Updated Successfully");
                navigate('/ehf-uhf-page', { state: { activeTab } });
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
          {isUpdate ? 'Edit Unequipped Health Facilty' : isView ? 'View Unequipped Health Facilty' : 'Unequipped Health Facilty Setup'}
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
              id="lga"
              name="lga"
              value={data.lga}
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
            {errors?.lga !== '' && (
              <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                {errors?.lga}
              </Typography>
            )}
          </FormControl>
        </Grid>

        {/* <Grid item xs={6}>
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
        </Grid> */}

        {/* <Grid item xs={6}>
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
        </Grid> */}

          <Grid item xs={6}>
            <FormControl sx={{ m: 0, width: '100%' }}>
              <Typography component="label" htmlFor="uhf_name" >
                Unequipped Health Facility Name <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
              </Typography>
              <Select
                id="uhf_name"
                name="uhf_name"
                value={data.uhf_name}
                onChange={handleUhfNameChange}
                sx={{ width: '100%' }}
                displayEmpty
                variant="outlined"
                disabled={isView || !selectedState || !selectedLga || hfaLoading}
              >
                <MenuItem value="" disabled>
                  {hfaLoading ? 'Loading facilities...' : 
                  !selectedState || !selectedLga ? 'Select State and LGA first' : 
                  hfaList.length === 0 ? 'No facilities found' :
                  'Select UHF Name'}
                </MenuItem>
                {hfaList.map((hfa, index) => (
                  <MenuItem key={`${hfa.name_of_ehf}-${index}`} value={hfa.name_of_ehf}>
                    {hfa.name_of_ehf}
                  </MenuItem>
                ))}
              </Select>
              {errors?.uhf_name !== '' && (
                <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                  {errors?.uhf_name}
                </Typography>
              )}
            </FormControl>
          </Grid>


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
                onChange={handleChange}
                variant="outlined"
                disabled={true}
                // helperText={
                //   errors?.longtitude !== '' ? (
                //     <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.longtitude}</span>
                //   ) : ''
                // }
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
                onChange={handleChange}
                variant="outlined"
                disabled={true}
                // helperText={
                //   errors?.lagtitude !== '' ? (
                //     <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.lagtitude}</span>
                //   ) : ''
                // }
              />
            </Grid>

      </Grid>

       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
          <Typography
            variant="h5"
          >
            Unequipped Health Facility Contact Information
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
                  onChange={handlePhoneChange}
                  variant="outlined"
                  disabled={isView}
                  type='text'
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
        <Button 
          variant="outlined" 
          // color="inherit" 
          size="large" 
          onClick={() => navigate('/ehf-uhf-page', { state: { activeTab } })}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" size="large" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Container>
  );
}
