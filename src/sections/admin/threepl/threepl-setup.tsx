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
import { useFetchEHFs, useFetchLgas, useFetchStates, useFetchWards, useUpsertThreepl } from 'src/hooks/apis/threepl/threepl-hooks';
import { ThreePlType } from 'src/hooks/apis/threepl/threepl-type';
import { useFetchUsers, useFetchRoles } from 'src/hooks/apis/user/user-hooks';
import { toast } from 'react-toastify';

export default function ThreePlSetup() {

  const navigate = useNavigate()
  const location = useLocation();
  const { state } = location;

  const upsertThreepl = useUpsertThreepl();
  const {data: states = []} = useFetchStates()
  const { data: users = [] } = useFetchUsers();
  const { data: roles = [] } = useFetchRoles();
  const [selectedState, setSelectedState] = useState('');
  const [selectedLga, setSelectedLga] = useState('');
  const { data: lgas = [] } = useFetchLgas(selectedState);
  const { data: ehfs = [] } = useFetchEHFs(selectedState, selectedLga || undefined);


const initialValues: ThreePlType = {
    status: '',
    category_type: '',
    state: '',
    lga: '',
    threepl_name: '',
    ehf_list: [],
    state_list: [],
    ccw: '',
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
          state_list: threePlData.state_list || [],
          category_type: threePlData.category_type || '',
          ccw: threePlData.ccw || '',
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
      temp.threepl_name = data.threepl_name 
          ? '' 
          : '3pl required';
      if (data.category_type === 'State') {
        temp.state = data.state 
          ? '' 
          : 'State is required';
        temp.lga = data.lga ? '' : 'LGA is required';
        temp.ehf_list = data.ehf_list.length > 0 ? '' : 'EHF required';
        temp.state_list = ''; 
      } else if (data.category_type === 'National') {
        temp.state_list = data.state_list.length > 0 ? '' : 'At least a state is required';
        temp.state = ''; 
        temp.lga = '';
        temp.ehf_list = '';
      }

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

  const handleLevelChange = (e: any) => {
    const levelValue = e.target.value;
    setData((prev) => ({
      ...prev,
      category_type: levelValue,
      state: '',
      lga: '',
      ehf_list: [],
      state_list: [],
      ccw: '',
    }));
    setSelectedState('');
    setSelectedLga('');
  };

  const handleStateMultiSelect = (selected: string[]) => {
    setData((prev) => ({
      ...prev,
      state_list: selected,
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
      ehf_list: [],
    }));
  };

  const GetEHF = (e: any) => {
    const lgaValue = e.target.value;
    setSelectedLga(lgaValue); 
    setData((prev) => ({
      ...prev,
      lga: lgaValue, 
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
    value: ehf.assigned_unique_id || '',
    label: ehf.name_of_ehf || '',
  }));

  const stateOptions = states.map((state) => ({
    value: state.state,
    label: state.state,
  }));

  // const ccwRole = roles.find((role) => role.name === 'Community Case Worker');
  // const ccwRoleId = ccwRole?.id?.toString();

  // const ccwUsers = users.filter((user) =>
  //   user.groups?.includes(ccwRoleId ? parseInt(ccwRoleId) : -1)
  // );

  const handleSubmit = () => {
    if (validate()) {
      const submitData = data.category_type === 'National'
        ? {
          ...data,
          state: '',
          lga: '',
          ehf_list: [],
          ccw: '',
          }
        : { ...data, state_list: [] }; 

      if (isUpdate) {
        upsertThreepl.mutate(
          { id: data.id, data: submitData },
          {
            onSuccess: (response) => {
              toast.success(response?.status || '3PL Updated Successfully');
              navigate('/threepl-page');
            },
          }
        );
      } else {
        upsertThreepl.mutate(
          { data: submitData },
          {
            onSuccess: (response) => {
              toast.success(response?.status || '3PL Created Successfully');
              navigate('/threepl-page');
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
          {isUpdate ? 'Edit 3PL Setup' : isView ? 'View 3PL Setup' : '3PL Setup'}
        </Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/threepl-page')}>
          Back
        </Button>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormControl sx={{ m: 0, width: '100%' }}>
            <Typography component="label" htmlFor="category_type">
              Level <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
            </Typography>
            <Select
              id="category_type"
              value={data.category_type}
              onChange={handleLevelChange}
              sx={{ width: '100%' }}
              displayEmpty
              variant="outlined"
              disabled={isView}
            >
              <MenuItem value="">Select Level</MenuItem>
              <MenuItem value="National">National</MenuItem>
              <MenuItem value="State">State</MenuItem>
            </Select>
            {errors?.category_type && (
              <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                {errors?.category_type}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <Typography component="label" htmlFor="threepl_name">
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

        {data.category_type === 'National' && (
          <Grid item xs={12}>
            <FormControl sx={{ m: 0, width: '100%' }}>
              <Typography component="label" sx={{ mb: 1 }}>
                States <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
              </Typography>
              <DualListBox
                canFilter
                options={stateOptions}
                onChange={handleStateMultiSelect}
                selected={data.state_list}
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
              {errors?.state_list !== '' && (
                <Typography sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                  {errors?.state_list}
                </Typography>
              )}
            </FormControl>
          </Grid>
        )}

        {data.category_type === 'State' && (
          <>
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
                  LGA <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
                </Typography>
                <Select
                  id="lga"
                  name="lga"
                  value={data.lga}
                  onChange={GetEHF}
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

            {/* <Grid item xs={6}>
              <FormControl sx={{ m: 0, width: '100%' }}>
                <Typography component="label" htmlFor="ccw" sx={{ mb: 1 }}>
                  Community Case Worker
                </Typography>
                <Select
                  id="ccw"
                  name="ccw"
                  value={data.ccw}
                  onChange={handleChange}
                  sx={{ width: '100%' }}
                  displayEmpty
                  variant="outlined"
                  disabled={isView}
                >
                  <MenuItem value="">Select Community Case Worker</MenuItem>
                  {ccwUsers.map((user) => (
                    <MenuItem key={user.id} value={user.id?.toString()}>
                      {user.first_name} {user.last_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid> */}

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
                {ehfOptions.length === 0 && data.state && data.lga && (
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
          </>
        )}
      </Grid>

      <Box sx={{ display: 'flex', gap: 2, mt: 4, mb: 4 }}>
        <Button variant="outlined"  size="large" onClick={() => navigate('/threepl-page')}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" size="large" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Container>
  );
}
