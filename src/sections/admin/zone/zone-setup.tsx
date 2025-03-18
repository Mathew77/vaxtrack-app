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
} from '@mui/material';
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import DoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import DoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFetchStates, useFetchLgas, useUpsertZone } from 'src/hooks/apis/zone-management/zone-hooks';
import { ZoneType } from 'src/hooks/apis/zone-management/zoneType';
import { toast } from 'react-toastify';


export default function ZoneSetup() {

  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const upsertZone = useUpsertZone();
  const { data: states = [] } = useFetchStates();

  const [selectedState, setSelectedState] = useState('');
  const { data: lgas = [] } = useFetchLgas(selectedState);


 const initialValues: ZoneType = {
    status: '',
    state: '',
    lgas: [],
    zone_name: '',
 };

 const setCurrentState = () => {
  const zoneData = state.data;
  const persistLga = zoneData.lgas || []; 
  setData({ ...zoneData, lgas: persistLga });
  setIsUpdate(state.isUpdate || false);
  setIsView(state.isView || false);
};

useEffect(() => {
  if (state?.data) {
    setCurrentState();
    setSelectedState(state.data.state); 
  }
}, [state]);

  const [data, setData] = useState<ZoneType>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof ZoneType, string>>>({});
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);


 const validate = () => {
   let temp = { ...errors };
   temp.state = data.state
       ? ''
       : 'State is required';
   temp.zone_name = data.zone_name
       ? ''
       : 'Zone name is required';
   temp.lgas = data.lgas
       ? ''
       : 'LGA required';
      
   setErrors({ ...temp });
   return Object.values(temp).every((x) => x === '');
 };


 const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
   const { name, value } = event.target;
   setData((prev) => ({
     ...prev,
     [name]: value,
   }));
 };

const GetLGA = (e: any) => {
  const stateValue = e.target.value;
  setSelectedState(stateValue);
  setData((prev) => ({...prev, [e.target.name]: stateValue, lgas: []}));
}

const handleLgaChange = (selectedLga: string[]) => {  
  setData((prev => ({...prev, lgas: selectedLga})))
}

 const lgaOptions = lgas.map((lga) => ({
  label: lga.lga,
  value: lga.lga,
}));


const handleSubmit = () => {
  if (validate()) {
    if (isUpdate) {
      upsertZone.mutate(
        { id: data.id, data },
        {
          onSuccess: (response) => {
            toast.success(response?.status || "Zone Updated Successfully");
            navigate('/zone-page');
          },
        }
      );
    } else {
      upsertZone.mutate(
        { data },
        {
          onSuccess: (response) => {
            toast.success(response?.status || "Zone Created Successfully");
            navigate('/zone-page');
          },
        }
      );
    }
  }
};


 return (
   <Container sx={{ mt:2 }}>
    <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
      <Typography variant="h5">Zone Management Setup</Typography>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/zone-page')}>
        Back
      </Button>
     
    </Box>

     <Grid container spacing={2}>
       <Grid item xs={6}>
         <Typography component="label" htmlFor="zone_name" >
           Zone Name<span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
         </Typography>
         <TextField
           fullWidth
           id="zone_name"
           name="zone_name"
           placeholder="Zone Name"
           value={data.zone_name}
           onChange={handleChange}
           variant="outlined"
           disabled={isView}
           helperText={
             errors?.zone_name !== '' ? (
               <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.zone_name}</span>
             ) : ''
           }
         />
       </Grid>

        <Grid item xs={6}>
          <Typography component="label" htmlFor="state" >
            State <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
          </Typography>
          <Select
            fullWidth
            id="state"
            name="state"
            value={data.state}
            onChange={GetLGA}
            variant="outlined"
            disabled={isView}
            displayEmpty
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
        </Grid>

        <Grid item xs={12}>
          <FormControl sx={{ m: 0, width: '100%' }}>
            <Typography component="label" sx={{ mb: 1 }}>
              LGA <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
            </Typography>
            <DualListBox
              canFilter
              options={lgaOptions} 
              onChange={handleLgaChange}
              selected={data.lgas}
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
            {errors?.lgas && (
              <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                {errors?.lgas}
              </Typography>
            )}
          </FormControl>
        </Grid>

      </Grid>

     <Box sx={{ display:'flex', gap: 2, mt: 4, mb: 2 }}>
       <Button variant="contained" color="primary" size="large" onClick={handleSubmit}>
         Submit
       </Button>
       <Button variant="contained" color="inherit" size="large" onClick={() => navigate('/zone-page')}>
         Cancel
       </Button>
     </Box>
   </Container>
 );
}
