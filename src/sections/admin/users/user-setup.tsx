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
import { useUpsertUser, useFetchRoles } from 'src/hooks/apis/user/user-hooks';
import { useFetchNcs } from 'src/hooks/apis/ncs/ncs-hooks';
import { useFetchScs } from 'src/hooks/apis/lcs-scs/scs-hooks';
import { useFetchLcs } from 'src/hooks/apis/lcs-scs/lcs-hooks';
import { useFetchEHF } from 'src/hooks/apis/ehf-uhf/ehf-hooks';
import { useFetchUHF } from 'src/hooks/apis/ehf-uhf/uhf-hooks';
import { useFetchThreePl } from 'src/hooks/apis/threepl/threepl-hooks';
import { toast } from 'react-toastify';

export default function UserSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const { data: roles = [] } = useFetchRoles();
  const upsertUser = useUpsertUser();

  const { data: ncs = [] } = useFetchNcs();
  const { data: scs = [] } = useFetchScs();
  const { data: lcs = [] } = useFetchLcs();
  const { data: ehfs = [] } = useFetchEHF();
  const { data: uhfs = [] } = useFetchUHF();
  const { data: threePLs = [] } = useFetchThreePl();

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
  };

  const [data, setData] = useState<UserType>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof UserType, string>>>({});
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');

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
      });
      setIsUpdate(state.isUpdate || false);
      setIsView(state.isView || false);

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
            case 'Unequipped Health Facility':
              setSelectedItems(userData.uhf_list || []);
              break;
            case '3PL':
              setSelectedItems(userData.threePL_list || []);
              break;
            default:
              setSelectedItems([]);
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
    temp.phone_number = data.phone_number ? '' : 'Phone Number is required';
    temp.email = data.email ? '' : 'Email required';
    temp.groups = selectedRoleId ? '' : 'Please select a role';

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

  const handleRoleSelectChange = (event: any) => {
    const value = event.target.value;
    setSelectedRoleId(value);
    setSelectedItems([]); 
  };

  const handleItemChange = (selected: string[]) => {
    setSelectedItems(selected);
  };

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
        return ehfs
          .filter((ehf) => ehf.id !== undefined && ehf.id !== null)
          .map((ehf) => ({ label: ehf.ehf_name, value: ehf.id!.toString() }));
      case 'Unequipped Health Facility':
        return uhfs
          .filter((uhf) => uhf.id !== undefined && uhf.id !== null)
          .map((uhf) => ({ label: uhf.uhf_name, value: uhf.id!.toString() }));
      case '3PL':
        return threePLs
          .filter((threepl) => threepl.id !== undefined && threepl.id !== null)
          .map((threepl) => ({ label: threepl.threepl_name, value: threepl.id!.toString() }));
      // case 'Conveyor':
      //   return threePLs
      //     .filter((conveyor) => conveyor.id !== undefined && conveyor.id !== null)
      //     .map((conveyor) => ({ label: conveyor.conveyor_name, value: conveyor.id!.toString() }));
      case 'UNICEF':
        return [];
      default:
        return [];
    }
  };

  const handleSubmit = () => {
    if (validate()) {
      const role = roles.find((r) => r.id.toString() === selectedRoleId);
      if (!role) return;

      const submitData: UserType = {
        ...data,
        groups: [parseInt(selectedRoleId)],
        ncs_list: role.name === 'National Strategic Cold Store' && selectedItems.length > 0 ? selectedItems : undefined,
        scs_list: role.name === 'State Cold Chain Store' && selectedItems.length > 0 ? selectedItems : undefined,
        lcs_list: role.name === 'Local Cold Chain Store' && selectedItems.length > 0 ? selectedItems : undefined,
        ehf_list: role.name === 'Equipped Health Facility' && selectedItems.length > 0 ? selectedItems : undefined,
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
            onChange={handleChange}
            variant="outlined"
            disabled={isView}
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

        {selectedRoleId && (
          <Grid item xs={12}>
            <Typography component="label">
              Select Items <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
            </Typography>
            <DualListBox
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
        <Button variant="contained" color="primary" size="large" onClick={handleSubmit} disabled={isView}>
          Submit
        </Button>
        <Button variant="contained" color="inherit" size="large" onClick={() => navigate('/user-management')}>
          Cancel
        </Button>
      </Box>
    </Container>
  );
}