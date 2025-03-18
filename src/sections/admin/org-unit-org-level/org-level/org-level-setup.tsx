import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Container,
  FormControl,
 
} from '@mui/material';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { OrgLevelType } from 'src/hooks/apis/org-unit/org-level-type';
import { useUpsertOrgLevel } from 'src/hooks/apis/org-unit/org-level-hook';
import { toast } from 'react-toastify';


export default function OrgLevelSetup() {

    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;

  const initialValues: OrgLevelType = {
    status: '',
    name: '',
    description: '',
  };

  const [data, setData] = useState<OrgLevelType>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof OrgLevelType, string>>>({});
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);

  const upsertOrgLevel = useUpsertOrgLevel();

  useEffect(() => {
    if (state?.data) {
      setData(state.data);
      setIsUpdate(state.isUpdate || false);
      setIsView(state.isView || false);
    }
  }, [state]);


  const validate = () => {
    let temp = { ...errors };
    temp.name = data.name 
        ? '' 
        : 'Name is required';
    temp.description = data.description 
        ? '' 
        : 'Description is required';
    
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


  const handleSubmit = () => {
    if (validate()) {
      if (isUpdate) {
        upsertOrgLevel.mutate(
          { id: data.id, data },
          {
            onSuccess: (response) => {
              toast.success(response?.status || "Org Level Updated Successfully");
              navigate('/org-units-page');
            },
          }
        );
      } else {
        upsertOrgLevel.mutate(
          { data },
          {
            onSuccess: (response) => {
              toast.success(response?.status || "Org Level Created Successfully");
              navigate('/org-units-page');
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
          {isUpdate ? 'Edit Organisation Level' : isView ? 'View Organisation Level' : 'Organisation Level Setup'}
        </Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/org-units-page')}>
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
            onChange={handleChange}
            disabled={isView} 
            variant="outlined"
            helperText={
              errors?.name && (
                <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.name}</span>
              )
            }
          />
        </Grid>

        <Grid item xs={6}>
          <Typography component="label" htmlFor="description">
            Description <span style={{ fontWeight: 'bold', color: '#DC143C' }}>*</span>
          </Typography>
          <TextField
            fullWidth
            id="description"
            name="description"
            placeholder="Enter Description"
            value={data.description}
            onChange={handleChange}
            disabled={isView} 
            variant="outlined"
            helperText={
              errors?.description && (
                <span style={{ color: '#DC143C', fontSize: '13px' }}>{errors?.description}</span>
              )
            }
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 4, mt: 4, mb: 4 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSubmit}
          disabled={isView}
        >
          Submit
        </Button>
        <Button variant="contained" color="inherit" size="large" onClick={() => navigate('/org-units-page')}>
          Cancel
        </Button>
      </Box>
    </Container>
  );
};
