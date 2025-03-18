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
} from '@mui/material';
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import DoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import DoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFetchEHFs, useFetchLgas, useFetchOrgUnits, useFetchStates, useFetchWards, useUpsertThreepl } from 'src/hooks/apis/threepl/threepl-hooks';
import { ThreePlType } from 'src/hooks/apis/threepl/threepl-type';
import { toast } from 'react-toastify';

export default function ThreePlSetup() {

  const navigate = useNavigate()
  const location = useLocation();
  const { state } = location;

  const upsertThreepl = useUpsertThreepl();
  const {data: states = []} = useFetchStates()
  const [selectedState, setSelectedState] = useState('');
  const [selectedLga, setSelectedLga] = useState('');
  const { data: lgas = [] } = useFetchLgas(selectedState);
  const { data: wards = [] } = useFetchWards(selectedLga);
  const { data: orgUnits = [] } = useFetchOrgUnits();
  const { data: ehfs = [] } = useFetchEHFs(selectedState, selectedLga || undefined);


const initialValues: ThreePlType = {
    status: '',
    state: '',
    lga: '',
    ward: '',
    org_unit: '',
    threepl_name: '',
    ehf_list: [],
  };

  const [data, setData] = useState<ThreePlType>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof ThreePlType, string>>>({});
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);

   const setCurrentState = () => {
      if (state?.data) {
        const threePlData = state.data;
        setData({
          ...initialValues,
          ...threePlData,
          state: threePlData.state || '',
          lga: threePlData.lga || '',
          ward: threePlData.ward || ''
        });
        setSelectedState(threePlData.state || ''); 
        setSelectedLga(threePlData.lga || ''); 
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
      temp.threepl_name = data.threepl_name 
          ? '' 
          : '3pl required';
      temp.ehf_list = data.ehf_list.length > 0 ? '' : 'EHF required';
  
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

  const GetLGA = (e: any) => {
    const stateValue = e.target.value;
    setSelectedState(stateValue);
    setSelectedLga(''); 
    setData((prev) => ({
      ...prev,
      state: stateValue,
      lga: '', 
      ward: '' ,
      ehf_list: [],
    }));
  };

  const GetWard = (e: any) => {
    const lgaValue = e.target.value;
    setSelectedLga(lgaValue); 
    setData((prev) => ({
      ...prev,
      lga: lgaValue,
      ward: '',
      ehf_list: [],
    }));
  };

  const handleChangeEHF = (selected: string[]) => {
    setData((prev) => ({
      ...prev,
      ehf_list: selected, 
    }));
  };

  const ehfOptions = ehfs.map((ehf) => ({
    value: ehf.id?.toString(),
    label: ehf.ehf_name
  }))

  const handleSubmit = () => {
    if (validate()) {
      if (isUpdate) {
        upsertThreepl.mutate(
          { id: data.id, data },
          {
            onSuccess: (response) => {
               toast.success(response?.status || "3PL Updated Successfully");
              navigate('/threepl-page');
            },
          }
        );
      } else {
        upsertThreepl.mutate(
          { data },
          {
            onSuccess: (response) => {
               toast.success(response?.status || "3pl Created Successfully");
              navigate('/threepl-page');
            },
          }
        );
      }
    } 
  };

  return (
    <Container sx={{ mt:2 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
        <Typography variant="h5">3PL Setup</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/threepl-page')}>
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
              <MenuItem value="">Select State</MenuItem>
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
              id="lga"
              name="lga"
              value={data.lga}
              onChange={GetWard}
              sx={{ width: '100%' }}
              displayEmpty
              variant="outlined"
              disabled={isView}
            >
              <MenuItem value="">Select LGA</MenuItem>
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
              <MenuItem value="">Select Ward</MenuItem>
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
                <MenuItem key={orgUnit.id} value={orgUnit.name}>
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
          <Typography component="label" htmlFor="threepl_name" >
            3PL Name <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            id="threepl_name"
            name="threepl_name"
            placeholder="Enter 3PL Name"
            value={data.threepl_name}
            onChange={handleChange}
            variant="outlined"
            disabled={isView}
            helperText={
              errors?.threepl_name !== '' ? (
                <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.threepl_name}</span>
              ) : ''
            }
          />
        </Grid>

        <Grid item xs={12}>
        <FormControl sx={{ m: 0, width: '100%' }}>
          <Typography component="label" sx={{ mb: 1 }}>
            EHF Name <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
          </Typography>
          <DualListBox
            canFilter
            options={ehfOptions}
            onChange={handleChangeEHF}
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
          {ehfOptions.length === 0 && selectedState && (
            <Typography sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
              No EHFs available for selected State/LGA
            </Typography>
          )}
          {errors.ehf_list && (
            <Typography sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
              {errors.ehf_list}
            </Typography>
          )}
        </FormControl>
      </Grid>

      </Grid>

      <Box sx={{display: 'flex', gap:4, mt: 4, mb: 4 }}>
        <Button variant="contained" color="primary" size="large" onClick={handleSubmit}>
          Submit
        </Button>
        <Button variant="contained" color="inherit" size="large" onClick={() => navigate('/threepl-page')}>
          Cancel
        </Button>
      </Box>
    </Container>
  );
}
