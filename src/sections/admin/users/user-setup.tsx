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
import { UserType } from 'src/hooks/apis/user/user-types';
import { useUpsertUser, useFetchRoles, useFetchStates } from 'src/hooks/apis/user/user-hooks';
import { useFetchNcs } from 'src/hooks/apis/ncs/ncs-hooks';
import { useFetchScs } from 'src/hooks/apis/lcs-scs/scs-hooks';
import { useFetchLcs } from 'src/hooks/apis/lcs-scs/lcs-hooks';
import { useFetchEHFList } from 'src/hooks/apis/ehf-uhf/ehf-hooks';
import { useFetchUHF } from 'src/hooks/apis/ehf-uhf/uhf-hooks';
import { useFetchThreePl } from 'src/hooks/apis/threepl/threepl-hooks';
import { toast } from 'react-toastify';
import { preventInvalidKeys } from 'src/utils/preventInvalidkeys';
import { generateMfaCode } from 'src/utils/mfa-code-generator';

export default function UserSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const { data: roles = [] } = useFetchRoles();
  const upsertUser = useUpsertUser();

  const { data: ncs = [] } = useFetchNcs();
  const { data: scs = [] } = useFetchScs();
  const { data: lcs = [] } = useFetchLcs();
  const { data: ehfs = [] } = useFetchEHFList();
  const { data: uhfs = [] } = useFetchUHF();
  const { data: threePLs = [] } = useFetchThreePl();
   const { data: states = [] } = useFetchStates();

  const initialValues: UserType = {
    status: '',
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    confirm_password: '',
    phone_number: '',
    email: '',
    groups: [],
    ncs_list: [],
    scs_list: [],
    lcs_list: [],
    ehf_list: [],
    uhf_list: [],
    user_permissions: [],
    state: [],
    mfa_code: generateMfaCode(),
  };

  const [data, setData] = useState<UserType>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof UserType, string>>>({});
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [selectedScsId, setSelectedScsId] = useState<string>(''); 
  const [selectedStateId, setSelectedStateId] = useState<string>('');

  const setCurrentState = () => {
    if (state?.data) {
      const userData = state.data;
      setData({
        ...initialValues,
        ...userData,
        groups: userData.groups || [],
        ncs_list: userData.ncs_list || [],
        scs_list: userData.scs_list || [],
        lcs_list: userData.lcs_list || [],
        ehf_list: userData.ehf_list || [],
        uhf_list: userData.uhf_list || [],
        user_permissions: userData.user_permissions || [],
        state: userData.state || [],
        mfa_code: userData.mfa_code || generateMfaCode(),
      });
      setIsUpdate(state.isUpdate || false);
      setIsView(state.isView || false);
      setSelectedStateId(userData.state && userData.state.length > 0 ? userData.state[0] : '');

      if (userData.groups.length > 0) {
        const roleId = userData.groups[0];
        const role = roles.find((r) => r.id === roleId);
        if (role) {
          setSelectedRoleId(role.id.toString());
          switch (role.name) {
            case 'National Strategic Cold Store':
              setSelectedItems(userData.ncs_list || []);
              break;
            case 'State Cold Chain Store':
              setSelectedItems(userData.scs_list || []);
              break;
            case 'Local Cold Chain Store':
              setSelectedItems(userData.lcs_list || []);
              break;
            case 'Equipped Health Facility':
              setSelectedItems(userData.ehf_list || []);
              break;
            case 'Mobile Cold Chain Officer':
              setSelectedItems(userData.ehf_list || []);
              break;
            case 'Unequipped Health Facility':
              setSelectedItems(userData.uhf_list || []);
              break;
            case '3PL':
              setSelectedItems(userData.threePL_list || []);
              break;
              case 'State Logistic Working Group':
              setSelectedScsId(userData.scs_list?.[0] || ''); 
              break;
            default:
              setSelectedItems([]);
              setSelectedScsId('');
          }
        }
      }
    }
  };

  useEffect(() => {
    setCurrentState();
  }, [state, roles, ncs, scs, lcs, ehfs, uhfs, threePLs]);

  const validate = () => {
    let temp = { ...errors };
    temp.first_name = data.first_name ? '' : 'First name is required';
    temp.last_name = data.last_name ? '' : 'Last name is required';
    temp.username = data.username ? '' : 'Username is required';
    if (!isUpdate) {
      temp.password = data.password ? '' : 'Password required';
      temp.confirm_password = data.confirm_password
        ? data.password === data.confirm_password
          ? ''
          : 'Passwords do not match'
        : 'Confirm password required';
    } else {
      temp.password = '';
      temp.confirm_password = '';
    }
    // temp.phone_number = data.phone_number ? '' : 'Phone Number is required';
    temp.phone_number = data.phone_number
      ? data.phone_number.length === 11
        ? ''
        : 'Phone number must be exactly 11 digits'
      : 'Phone number is required';
    temp.email = data.email ? '' : 'Email required';
    temp.groups = selectedRoleId ? '' : 'Please select a role';
    if (isEhfRole() && (!data.state || data.state.length === 0)) {
    temp.state = 'Please select a state';
    } else {
      temp.state = '';
    }

    const selectedRole = roles.find((role) => role.id.toString() === selectedRoleId)?.name;
    if (selectedRole === 'State Logistics Working Group' && !selectedScsId) {
      temp.scs_list = 'Please select a State Cold Chain Store';
    } else if (
      selectedRole &&
      [
        'National Strategic Cold Store',
        'State Cold Chain Store',
        'Local Cold Chain Store',
        'Equipped Health Facility',
        'Mobile Cold Chain Officer',
        'Unequipped Health Facility',
        '3PL',
      ].includes(selectedRole) &&
      selectedItems.length === 0
    ) {
      temp.scs_list = `Please select at least one ${getSelectedLists()}`;
    } else {
      temp.scs_list = '';
    }

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

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      const numericValue = value.replace(/[^0-9]/g, '').slice(0, 11);
      setData((prev) => ({ ...prev, phone_number: numericValue }));
    };

  const handleRoleSelectChange = (event: any) => {
    const value = event.target.value;
    setSelectedRoleId(value);
    setSelectedItems([]); 
    setSelectedScsId('');
    setSelectedStateId('');
  };

  const handleItemChange = (selected: string[]) => {
    setSelectedItems(selected);
  };

  const handleScsChange = (event: any) => {
    setSelectedScsId(event.target.value);
  };
  const handleStateChange = (event: any) => {
    const value = event.target.value;
    setSelectedStateId(value);
    setSelectedItems([]);
    setData((prev) => ({
      ...prev,
      state: value ? [value] : [],
    }));
  }

   const getItemOptions = () => {
  const selectedRole = roles.find((role) => role.id.toString() === selectedRoleId)?.name;

  switch (selectedRole) {
    case 'National Strategic Cold Store':
      return ncs
        .filter((nc) => nc.id !== undefined && nc.id !== null)
        .map((nc) => ({ label: nc.ncs_name, value: nc.id!.toString() }));

    case 'State Cold Chain Store':
      return scs
        .filter((sc) => sc.id !== undefined && sc.id !== null)
        .map((sc) => ({ label: sc.scs_name, value: sc.id!.toString() }));

    case 'Local Cold Chain Store':
      return lcs
        .filter((lc) => lc.id !== undefined && lc.id !== null)
        .map((lc) => ({ label: lc.lcs_name, value: lc.id!.toString() }));

    case 'Equipped Health Facility':
      if (selectedStateId) {
        const filteredEhfs = ehfs.filter((ehf) => {
          return ehf.assigned_unique_id &&
            ehf.state?.toLowerCase() === selectedStateId.toLowerCase();
        });
        return filteredEhfs.map((ehf) => ({ label: ehf.name_of_ehf, value: ehf.assigned_unique_id }));
      }
      return ehfs
        .filter((ehf) => ehf.assigned_unique_id)
        .map((ehf) => ({ label: ehf.name_of_ehf, value: ehf.assigned_unique_id }));

    case 'Mobile Cold Chain Officer':
      if (selectedStateId) {
        const filteredEhfs = ehfs.filter((ehf) => {
          return ehf.assigned_unique_id &&
            ehf.state?.toLowerCase() === selectedStateId.toLowerCase();
        });
        return filteredEhfs.map((ehf) => ({ label: ehf.name_of_ehf, value: ehf.assigned_unique_id }));
      }
      return ehfs
        .filter((ehf) => ehf.assigned_unique_id)
        .map((ehf) => ({ label: ehf.name_of_ehf, value: ehf.assigned_unique_id }));

    case 'Unequipped Health Facility':
      return uhfs
        .filter((uhf) => uhf.id !== undefined && uhf.id !== null)
        .map((uhf) => ({ label: uhf.uhf_name, value: uhf.id!.toString() }));

    case '3PL':
      return threePLs
        .filter((threepl) => threepl.id !== undefined && threepl.id !== null)
        .map((threepl) => {
          const ehfList = threepl.ehf_list || [];
          const ehfNames = ehfList.length > 0 ? ehfList.join(', ') : '';
          const label = ehfNames ? `${threepl.threepl_name} - ( ${ehfNames} )` : threepl.threepl_name;
          return { label, value: threepl.id!.toString() };
        });

    case 'UNICEF':
      return [];

    case 'Community Case Worker':
      return [];

    default:
      return [];
  }
};

  const getSelectedLists = () => {
    const selectedRole = roles.find((role) => role.id.toString() === selectedRoleId)?.name;
    switch (selectedRole) {
      case 'National Strategic Cold Store':
        return 'Select National Strategic Cold Stores';
      case 'State Cold Chain Store':
        return 'Select State Cold Chain Stores';
      case 'Local Cold Chain Store':
        return 'Select Local Cold Chain Stores';
      case 'Equipped Health Facility':
        return 'Select Equipped Health Facilities';
      case 'Mobile Cold Chain Officer':
        return 'Select Equipped Health Facilities';
      case 'Unequipped Health Facility':
        return 'Select Unequipped Health Facilities';
      case '3PL':
        return 'Select 3PLs';
      case 'State Logistics Working Group':
        return 'Select Cold Chain Store';
      default:
        return '';
    }
  };

  const isEhfRole = () => {
    const selectedRole = roles.find((role) => role.id.toString() === selectedRoleId)?.name;
    return selectedRole === 'Equipped Health Facility' || selectedRole === 'Mobile Cold Chain Officer';
  };

  const handleSubmit = () => {
    if (validate()) {
      const role = roles.find((r) => r.id.toString() === selectedRoleId);
      if (!role) return;

      const submitData: UserType = {
        ...data,
        groups: [parseInt(selectedRoleId)],
        ncs_list: role.name === 'National Strategic Cold Store' && selectedItems.length > 0 ? selectedItems : undefined,
        scs_list:
          role.name === 'State Cold Chain Store' && selectedItems.length > 0
            ? selectedItems
            : role.name === 'State Logistics Working Group' && selectedScsId
            ? [selectedScsId]
            : undefined,
        lcs_list: role.name === 'Local Cold Chain Store' && selectedItems.length > 0 ? selectedItems : undefined,
        ehf_list: (role.name === 'Equipped Health Facility' || role.name === 'Mobile Cold Chain Officer') && selectedItems.length > 0 ? selectedItems : undefined,
        uhf_list: role.name === 'Unequipped Health Facility' && selectedItems.length > 0 ? selectedItems : undefined,
        user_permissions: role.permissions ? role.permissions.map((perm) => parseInt(perm, 10)) : [],
      };

      if (isUpdate) {
        upsertUser.mutate(
          { id: data.id, data: submitData },
          {
            onSuccess: (response) => {
              toast.success(response?.status || "User Updated Successfully");
              navigate('/user-management');
            },
          }
        );
      } else {
        upsertUser.mutate(
          { data: submitData },
          {
            onSuccess: (response) => {
              toast.success(response?.status || "User Created Successfully");
              navigate('/user-management');
            },
          }
        );
      }
    }
  };

  return (
    <Container sx={{ mt: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
        <Typography variant="h5">User Management Setup</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/user-management')}>
          Back
        </Button>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography component="label" htmlFor="first_name">
            First Name<span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            id="first_name"
            name="first_name"
            placeholder="First Name"
            value={data.first_name}
            onChange={handleChange}
            variant="outlined"
            disabled={isView}
            helperText={
              errors?.first_name ? (
                <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.first_name}</span>
              ) : ''
            }
          />
        </Grid>

        <Grid item xs={6}>
          <Typography component="label" htmlFor="last_name">
            Last Name <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            id="last_name"
            name="last_name"
            placeholder="Last Name"
            value={data.last_name}
            onChange={handleChange}
            variant="outlined"
            disabled={isView}
            helperText={
              errors?.last_name ? (
                <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.last_name}</span>
              ) : ''
            }
          />
        </Grid>

        <Grid item xs={6}>
          <Typography component="label" htmlFor="username">
            Username <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            id="username"
            name="username"
            placeholder="Username"
            value={data.username}
            onChange={handleChange}
            variant="outlined"
            disabled={isView}
            helperText={
              errors?.username ? (
                <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.username}</span>
              ) : ''
            }
          />
        </Grid>

        {!isUpdate && !isView && (
          <>
            <Grid item xs={6}>
              <Typography component="label" htmlFor="password">
                Password <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
              </Typography>
              <TextField
                type="password"
                fullWidth
                id="password"
                name="password"
                placeholder="Password"
                value={data.password}
                onChange={handleChange}
                variant="outlined"
                helperText={
                  errors?.password ? (
                    <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.password}</span>
                  ) : ''
                }
              />
            </Grid>

            <Grid item xs={6}>
              <Typography component="label" htmlFor="confirm_password">
                Confirm Password <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
              </Typography>
              <TextField
                type="password"
                fullWidth
                id="confirm_password"
                name="confirm_password"
                placeholder="Confirm Password"
                value={data.confirm_password}
                onChange={handleChange}
                variant="outlined"
                helperText={
                  errors?.confirm_password ? (
                    <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.confirm_password}</span>
                  ) : ''
                }
              />
            </Grid>
          </>
        )}

        <Grid item xs={6}>
          <Typography component="label" htmlFor="phone_number">
            Phone Number <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            id="phone_number"
            name="phone_number"
            placeholder="Phone Number"
            value={data.phone_number}
            onChange={handlePhoneChange}
            variant="outlined"
            disabled={isView}
            type="text"
            inputProps={{ inputMode: 'numeric', maxLength: 11 }}
            onKeyDown={preventInvalidKeys}
            helperText={
              errors?.phone_number ? (
                <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.phone_number}</span>
              ) : ''
            }
          />
        </Grid>

        <Grid item xs={6}>
          <Typography component="label" htmlFor="email">
            Email Address <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            id="email"
            name="email"
            placeholder="Email Address"
            value={data.email}
            onChange={handleChange}
            variant="outlined"
            disabled={isView}
            helperText={
              errors?.email ? (
                <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.email}</span>
              ) : ''
            }
          />
        </Grid>

        <Grid item xs={6}>
          <Typography component="label" htmlFor="mfa_code">
            MFA Code
          </Typography>
          <TextField
            fullWidth
            id="mfa_code"
            name="mfa_code"
            placeholder="MFA Code"
            value={data.mfa_code}
            variant="outlined"
            disabled
            // helperText="Auto-generated 4-digit code"
          />
        </Grid>

        <Grid item xs={6}>
          <FormControl sx={{ m: 0, width: '100%' }}>
            <Typography component="label" htmlFor="groups">
              Role <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
            </Typography>
            <Select
              id="groups"
              name="groups"
              value={selectedRoleId}
              onChange={handleRoleSelectChange}
              sx={{ width: '100%' }}
              displayEmpty
              variant="outlined"
              disabled={isView}
            >
              <MenuItem value="">Select Role</MenuItem>
              {roles.map((role) => (
                <MenuItem key={`${role.name}-${role.id}`} value={role.id.toString()}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
            {errors?.groups && (
              <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                {errors?.groups}
              </Typography>
            )}
          </FormControl>
        </Grid>

        {isEhfRole() && (
          <Grid item xs={6}>
            <FormControl sx={{ m: 0, width: '100%' }}>
              <Typography component="label" htmlFor="state_select">
                Select State (Optional)
              </Typography>
              <Select
                id="state_select"
                name="state_select"
                value={selectedStateId}
                onChange={handleStateChange}
                sx={{ width: '100%' }}
                displayEmpty
                variant="outlined"
                disabled={isView}
              >
                <MenuItem value="">All States</MenuItem>
                {states.map((state) => (
                  <MenuItem key={`state-${state.id}`} value={state.id}>
                    {state.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        {selectedRoleId && roles.find((role) => role.id.toString() === selectedRoleId)?.name === 'State Logistics Working Group' && (
          <Grid item xs={6}>
            <Typography component="label">
              {getSelectedLists()} <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
            </Typography>
            <FormControl sx={{ m: 0, width: '100%' }}>
              <Select
                id="scs_select"
                name="scs_select"
                value={selectedScsId}
                onChange={handleScsChange}
                sx={{ width: '100%' }}
                displayEmpty
                variant="outlined"
                disabled={isView}
              >
                <MenuItem value="">Select State Cold Chain Store</MenuItem>
                {scs
                  .filter((sc) => sc.id !== undefined && sc.id !== null)
                  .map((sc) => (
                    <MenuItem key={`scs-${sc.id}`} value={sc.id!.toString()}>
                      {sc.scs_name}
                    </MenuItem>
                  ))}
              </Select>
              {errors?.scs_list && (
                <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                  {errors?.scs_list}
                </Typography>
              )}
            </FormControl>
          </Grid>
        )}

        {selectedRoleId &&
          (() => {
            const roleName = roles.find((role) => role.id.toString() === selectedRoleId)?.name?.trim() || '';
            return !['State Logistics Working Group', 'UNICEF', 'Community Case Worker'].includes(roleName);
          })() && (
          <Grid item xs={12}>
            <Typography component="label">
              {getSelectedLists()} <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
            </Typography>
            <DualListBox
              canFilter
              options={getItemOptions()}
              selected={selectedItems}
              onChange={handleItemChange}
              disabled={isView}
              icons={{
                moveToAvailable: <ArrowLeftIcon sx={{ fontSize: '16px' }} />,
                moveAllToAvailable: <DoubleArrowLeftIcon sx={{ fontSize: '16px' }} />,
                moveToSelected: <ArrowRightIcon sx={{ fontSize: '16px' }} />,
                moveAllToSelected: <DoubleArrowRightIcon sx={{ fontSize: '16px' }} />,
              }}
            />
          </Grid>
        )}
      </Grid>

      <Box sx={{ display: 'flex', gap: 2, mt: 4, mb: 2 }}>
        <Button variant="outlined"  size="large" onClick={() => navigate('/user-management')}>
          Cancel
        </Button>
        
        <Button variant="contained" color="primary" size="large" onClick={handleSubmit} disabled={isView}>
          Submit
        </Button>
      </Box>
    </Container>
  );
}