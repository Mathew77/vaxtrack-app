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
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import DoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import DoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useFetchPermissions, useFetchOrgUnits,  useUpsertRole } from 'src/hooks/apis/roles-permissions/roles-hook';
import { RoleAPIPayload, RoleType } from 'src/hooks/apis/roles-permissions/roles-type';
import { toast } from 'react-toastify';


export default function RolesSetup() {
 const navigate = useNavigate();
 const location = useLocation();
 const { state } = location;
 const activeTab = state?.activeTab || 0;


 const { data: permissions = [] } = useFetchPermissions();
 const { data: orgUnits = [] } = useFetchOrgUnits();
 const upsertRole = useUpsertRole();


 const initialValues: RoleType = {
   status: '',
   name: '',
   fk_org_unit_level_id: '',
   org_unit_level_name: '',
   permissions: [],
 };


 const [data, setData] = useState<RoleType>(initialValues);
 const [errors, setErrors] = useState<Partial<Record<keyof RoleType, string>>>({});
 const [isUpdate, setIsUpdate] = useState<boolean>(false);
 const [isView, setIsView] = useState<boolean>(false);


 const setCurrentState = () => {
   const roleData = state.data;
   const persistPermissions = (roleData.permissions?.map((perm: any) =>
     typeof perm === 'object' ? perm.id.toString() : perm.toString()
   ) || []);
   setData({ ...roleData, permissions: persistPermissions });
   setIsUpdate(state.isUpdate || false);
   setIsView(state.isView || false);
 };


 useEffect(() => {
   if (state?.data) {
     setCurrentState();
   }
 }, [state]);


 const validate = () => {
   let temp = { ...errors };
   temp.name = data.name
     ? ''
     : 'Name is required';
   temp.fk_org_unit_level_id = data.fk_org_unit_level_id
   ? ''
    : 'Org Unit level is required';
   temp.org_unit_level_name = data.org_unit_level_name
   ? ''
    : 'Org Unit level name is required';
   temp.permissions = data.permissions.length > 0
   ? ''
   : 'Permissions required';
   setErrors({ ...temp });
  
   return Object.values(temp).every((x) => x === '');
 };


 const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
   const { name, value } = event.target;
   setData((prev) => ({ ...prev, [name]: value }));
 };


 const handleSelectChange = (event: SelectChangeEvent<string>) => {
   const { name, value } = event.target;
   const selectedOrgUnit = orgUnits.find(unit => unit.id.toString() === value);
   const orgUnitName = selectedOrgUnit ? selectedOrgUnit.name : '';
  
   setData((prev) => ({
     ...prev,
     [name]: value,
     ...(name === 'fk_org_unit_level_id' && { org_unit_level_name: orgUnitName })
   }));
 };


 const handleChangePermission = (selected: string[]) => {
   setData((prev) => ({ ...prev, permissions: selected }));
 };


 const handleSubmit = async () => {


   if (validate()) {
     const payload: RoleAPIPayload = {
       ...data,
       fk_org_unit_level_id: parseInt(data.fk_org_unit_level_id),
       permissions: data.permissions.map((p) => parseInt(p)),
     };


     if (isUpdate) {
       upsertRole.mutate(
         { id: data.id, data: payload },
         {
           onSuccess: (response) => {
             toast.success(response?.status || 'Role updated successfully');
             navigate('/roles-permissions-page', { state: { activeTab } });
           },
         }
       );
     } else {
       upsertRole.mutate(
         { data: payload },
         {
           onSuccess: (response) => {
             toast.success(response?.status || 'Role created successfully');
             navigate('/roles-permissions-page', { state: { activeTab } });
           },
         }
       );
     }
   }
 };


 //This is to fit the DualBoxList display method
 const permissionOptions = permissions.map((perm) => ({
   label: perm.name,
   value: perm.id.toString(),
 }));




 return (
   <Container sx={{ mt: 2 }}>
     <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
       <Typography variant="h5">
         {isUpdate ? 'Edit Role' : isView ? 'View Role' : 'Role Setup'}
       </Typography>
       <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/roles-permissions-page', { state: { activeTab } })}>
         Back
       </Button>
     </Box>


     <Grid container spacing={2}>
       <Grid item xs={6}>
         <Typography component="label" htmlFor="name">
           Name<span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
         </Typography>
         <TextField
           fullWidth
           id="name"
           name="name"
           placeholder="Enter Name"
           value={data.name}
           onChange={handleTextChange}
           variant="outlined"
           disabled={isView}
           error={!!errors?.name}
           helperText={errors?.name}
         />
       </Grid>


       <Grid item xs={6}>
         <Typography component="label" htmlFor="fk_org_unit_level_id">
           Organisation level unit<span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
         </Typography>
         <Select
           fullWidth
           id="fk_org_unit_level_id"
           name="fk_org_unit_level_id"
           value={data.fk_org_unit_level_id}
           onChange={handleSelectChange}
           variant="outlined"
           displayEmpty
           disabled={isView}
           error={!!errors?.fk_org_unit_level_id}
         >
           <MenuItem value="">Select Organisation level</MenuItem>
           {orgUnits.map((orgUnit) => (
             <MenuItem key={`${orgUnit.name}-${orgUnit.id}`} value={orgUnit.id.toString()}>
               {orgUnit.name}
             </MenuItem>
           ))}
         </Select>
         {errors?.fk_org_unit_level_id && (
           <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
             {errors?.fk_org_unit_level_id}
           </Typography>
         )}
       </Grid>


       <Grid item xs={12}>
         <FormControl sx={{ m: 0, width: '100%' }}>
           <Typography component="label" sx={{ mb: 1 }}>
             Permissions <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
           </Typography>
           <DualListBox
             canFilter
             options={permissionOptions}
             onChange={handleChangePermission}
             selected={data.permissions}
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
           {errors?.permissions && (
             <Typography component="span" sx={{ color: '#DC143C', fontSize: '13px', mt: 1 }}>
               {errors?.permissions}
             </Typography>
           )}
      
   </FormControl>
       </Grid>
     </Grid>


     <Box sx={{ display: 'flex', gap: 4, mt: 4, mb: 4 }}>
       <Button
         variant="contained"
         color="primary"
         size="large"
         onClick={handleSubmit}
         disabled={upsertRole.isPending || isView}
       >
         {upsertRole.isPending ? 'Submitting...' : 'Submit'}
       </Button>
       <Button
         variant="contained"
         color="inherit"
         size="large"
         onClick={() => navigate('/roles-permissions-page', { state: { activeTab } })}
       >
         Cancel
       </Button>
     </Box>
   </Container>
 );
}
