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
  SelectChangeEvent,
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
import { useUpsertUser, useFetchOrgUnitLevel, useFetchRoles } from 'src/hooks/apis/user/user-hooks';
import { useFetchNcs } from 'src/hooks/apis/ncs/ncs-hooks';
import { useFetchScs } from 'src/hooks/apis/lcs-scs/scs-hooks';
import { useFetchLcs } from 'src/hooks/apis/lcs-scs/lcs-hooks';
import { useFetchEHF } from 'src/hooks/apis/ehf-uhf/ehf-hooks';
import { useFetchUHF } from 'src/hooks/apis/ehf-uhf/uhf-hooks';
import { useFetchThreePl } from 'src/hooks/apis/threepl/threepl-hooks';
import { toast } from 'react-toastify';

interface RoleEntry {
  roleId: string;
  roleName: string;
  selectedItems: string[];
  healthFacilityType?: string;
}

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
    health_facility_category: null,
  };

  const [data, setData] = useState<UserType>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof UserType, string>>>({});
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [healthFacilityType, setHealthFacilityType] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [roleEntries, setRoleEntries] = useState<RoleEntry[]>([]);
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
        health_facility_category: userData.health_facility_category || null,
      });
      setIsUpdate(state.isUpdate || false);
      setIsView(state.isView || false);

      const updatedtedRoleEntries: RoleEntry[] = [];
      userData.groups.forEach((roleId: number) => {
        const role = roles.find((r) => r.id === roleId);
        if (role) {
          let selectedItems: string[] = [];
          switch (role.name) {
            case 'National Level':
              selectedItems = userData.ncs_list || [];
              break;
            case 'State Level':
              selectedItems = userData.scs_list || [];
              break;
            case 'LGA Level':
              selectedItems = userData.lcs_list || [];
              break;
            case 'Health Facility Level':
              selectedItems =
                userData.health_facility_category === 'EHF'
                  ? userData.ehf_list || []
                  : userData.health_facility_category === 'UHF'
                  ? userData.uhf_list || []
                  : [];
              break;
            case '3PL':
              selectedItems = userData.threePL_list || [];
              break;
            default:
              selectedItems = [];
          }
          updatedtedRoleEntries.push({
            roleId: role.id.toString(),
            roleName: role.name,
            selectedItems,
            ...(role.name === 'Health Facility Level' && {
              healthFacilityType: userData.health_facility_category || undefined,
            }),
          });
        }
      });
      setRoleEntries(updatedtedRoleEntries);
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
    temp.groups = roleEntries.length > 0 ? '' : 'Add at least one role';

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

  const handleRoleSelectChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSelectedRoleId(value);
    setSelectedItems([]);
    if (value !== 'Health Facility Level') setHealthFacilityType('');
  };

  const handleItemChange = (selected: string[]) => {
    setSelectedItems(selected);
  };

  const handleHealthFacilityTypeChange = (event: SelectChangeEvent<string>) => {
    setHealthFacilityType(event.target.value);
    setSelectedItems([]);
  };

  const handleAddRole = () => {
    if (!selectedRoleId || selectedItems.length === 0) {
      alert('Please select a role and at least one item.');
      return;
    }
    const role = roles.find((r) => r.id.toString() === selectedRoleId);
    if (role) {
      setRoleEntries((prev) => [
        ...prev,
        {
          roleId: role.id.toString(),
          roleName: role.name,
          selectedItems: [...selectedItems],
          ...(role.name === 'Health Facility Level' && { healthFacilityType }),
        },
      ]);
      setSelectedRoleId('');
      setSelectedItems([]);
      setHealthFacilityType('');
    }
   
  };

  const handleDeleteRole = (indexToDelete: number) => {
    setRoleEntries((prev) => prev.filter((_, index) => index !== indexToDelete));
  };

  const availableRoles = roles.filter(
    (role) => !roleEntries.some((entry) => entry.roleId === role.id.toString())
  );



  const getItemOptions = () => {
    const selectedRole = roles.find((role) => role.id.toString() === selectedRoleId)?.name;
    switch (selectedRole) {
      case 'National Level':
        return ncs
          .filter((nc) => nc.id !== undefined)
          .map((nc) => ({ label: nc.ncs_name, value: nc.id!.toString() }));
      case 'State Level':
        return scs
          .filter((sc) => sc.id !== undefined)
          .map((sc) => ({ label: sc.scs_name, value: sc.id!.toString() }));
      case 'LGA Level':
        return lcs
          .filter((lc) => lc.id !== undefined)
          .map((lc) => ({ label: lc.lcs_name, value: lc.id!.toString() }));
      case 'Health Facility Level':
        return healthFacilityType === 'EHF'
          ? ehfs
              .filter((ehf) => ehf.id !== undefined)
              .map((ehf) => ({ label: ehf.ehf_name, value: ehf.id!.toString() }))
          : healthFacilityType === 'UHF'
          ? uhfs
              .filter((uhf) => uhf.id !== undefined)
              .map((uhf) => ({ label: uhf.uhf_name, value: uhf.id!.toString() }))
          : [];
      case '3PL':
        return threePLs
          .filter((threepl) => threepl.id !== undefined)
          .map((threepl) => ({ label: threepl.threepl_name, value: threepl.id!.toString() }));
      case 'UNICEF':
        return [];
      default:
        return [];
    }
  };

  const getSelectedItemsDisplay = (entry: RoleEntry) => {
    if (!Array.isArray(entry.selectedItems)) return 'No items available';
    const items = entry.selectedItems;
    switch (entry.roleName) {
      case 'National Level':
        return items
          .map((id) => ncs.find((nc) => nc.id?.toString() === id)?.ncs_name)
          .join(', ');
      case 'State Level':
        return items
          .map((id) => scs.find((sc) => sc.id?.toString() === id)?.scs_name)
          .join(', ');
      case 'LGA Level':
        return items
          .map((id) => lcs.find((lc) => lc.id?.toString() === id)?.lcs_name)
          .join(', ');
      case 'Health Facility Level':
        return entry.healthFacilityType === 'EHF'
          ? items
              .map((id) => ehfs.find((ehf) => ehf.id?.toString() === id)?.ehf_name)
              .join(', ')
          : entry.healthFacilityType === 'UHF'
          ? items
              .map((id) => uhfs.find((uhf) => uhf.id?.toString() === id)?.uhf_name)
              .join(', ')
          : 'Unknown Facility Type';
      case '3PL':
        return items
          .map((id) => threePLs.find((threepl) => threepl.id?.toString() === id)?.threepl_name)
          .join(', ');
      default:
        return items.join(', ');
    }
  };


  const handleSubmit = () => {
    if (validate()) {
      const roleIds = roleEntries.map((entry) => parseInt(entry.roleId));
      const ncsList = roleEntries
        .filter((entry) => entry.roleName === 'National Level')
        .flatMap((entry) => entry.selectedItems);
      const scsList = roleEntries
        .filter((entry) => entry.roleName === 'State Level')
        .flatMap((entry) => entry.selectedItems);
      const lcsList = roleEntries
        .filter((entry) => entry.roleName === 'LGA Level')
        .flatMap((entry) => entry.selectedItems);
      const ehfList = roleEntries
        .filter((entry) => entry.roleName === 'Health Facility Level' && entry.healthFacilityType === 'EHF')
        .flatMap((entry) => entry.selectedItems);
      const uhfList = roleEntries
        .filter((entry) => entry.roleName === 'Health Facility Level' && entry.healthFacilityType === 'UHF')
        .flatMap((entry) => entry.selectedItems);
      const healthFacilityCategory =
        roleEntries.find((entry) => entry.roleName === 'Health Facility Level')?.healthFacilityType || null;

      const submitData: UserType = {
        ...data,
        groups: roleIds,
        ncs_list: ncsList.length > 0 ? ncsList : undefined,
        scs_list: scsList.length > 0 ? scsList : undefined,
        lcs_list: lcsList.length > 0 ? lcsList : undefined,
        ehf_list: ehfList.length > 0 ? ehfList : undefined,
        uhf_list: uhfList.length > 0 ? uhfList : undefined,
        health_facility_category: healthFacilityCategory,
      };

      if (isUpdate) {
        upsertUser.mutate(
          { id: data.id, data: submitData },
          {
            onSuccess: (response) => {
              toast.success(response?.status || "User Updated Successfully")
              navigate('/user-management');
            },
          }
        );
      } else {
        upsertUser.mutate(
          { data: submitData },
          {
            onSuccess: (response) => {
              toast.success(response?.status || "User Created Successfully")
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
              errors?.first_name !== '' ? (
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
              errors?.last_name !== '' ? (
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
              errors?.username !== '' ? (
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
                  errors?.password !== '' ? (
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
                  errors?.confirm_password !== '' ? (
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
              errors?.phone_number !== '' ? (
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
              errors?.email !== '' ? (
                <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.email}</span>
              ) : ''
            }
          />
        </Grid>

        <Grid item xs={6}>
          <FormControl sx={{ m: 0, width: '100%' }}>
            <Typography component="label" htmlFor="groups">
              Roles <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
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
              {availableRoles.map((role) => (
                <MenuItem key={`${role.name}-${role.id}`} value={role.id.toString()}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
            {errors?.groups !== '' && (
              <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
                {errors?.groups}
              </Typography>
            )}
          </FormControl>
        </Grid>

        {roles.find((role) => role.id.toString() === selectedRoleId)?.name === 'Health Facility Level' && (
          <Grid item xs={6}>
            <FormControl sx={{ m: 0, width: '100%' }}>
              <Typography component="label" htmlFor="health_facility_type">
                Facility Type <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
              </Typography>
              <Select
                id="health_facility_type"
                name="health_facility_type"
                value={healthFacilityType}
                onChange={handleHealthFacilityTypeChange}
                sx={{ width: '100%' }}
                displayEmpty
                variant="outlined"
                disabled={isView}
              >
                <MenuItem value="">Select Type</MenuItem>
                <MenuItem value="EHF">EHF</MenuItem>
                <MenuItem value="UHF">UHF</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}

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

        {selectedRoleId && (
          <Grid item xs={12}>
            <Button variant="outlined" color="primary" onClick={handleAddRole} disabled={isView}>
              Add Role
            </Button>
          </Grid>
        )}

        {roleEntries.length > 0 && (
        <Grid item xs={12}>
          <Box sx={{ width: '100%', mt: 2 }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                border: '1px solid #ddd',
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: '#1976d2',
                    color: '#fff',
                  }}
                >
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      borderBottom: '1px solid #ddd',
                    }}
                  >
                    Role Name
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      borderBottom: '1px solid #ddd',
                    }}
                  >
                    Role Informations
                  </th>
                  {!isView && (
                    <th
                      style={{
                        padding: '12px',
                        textAlign: 'left',
                        borderBottom: '1px solid #ddd',
                      }}
                    >
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {roleEntries.map((entry, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff',
                    }}
                  >
                    <td
                      style={{
                        padding: '12px',
                        borderBottom: '1px solid #ddd',
                      }}
                    >
                      {entry.roleName}
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        borderBottom: '1px solid #ddd',
                      }}
                    >
                      {getSelectedItemsDisplay(entry)}
                    </td>
                    {!isView && (
                      <td
                        style={{
                          padding: '12px',
                          borderBottom: '1px solid #ddd',
                        }}
                      >
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleDeleteRole(index)}
                        >
                          Delete
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
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