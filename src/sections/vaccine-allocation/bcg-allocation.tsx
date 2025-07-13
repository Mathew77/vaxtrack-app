import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Grid } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { BcgAllocationData } from 'src/types/allocations/bcg';
import { useFetchUsers } from 'src/hooks/apis/user/user-hooks';

interface ExtendedBcgAllocationProps {
  initialData?: Partial<BcgAllocationData>;
  onDataChange: (data: BcgAllocationData) => void;
  status?: number; 
  key?: string;
  isView?: boolean;
  isUpdate?: boolean;
}

export const BcgAllocation = ({
  initialData = {},
  onDataChange,
  status = 1,
  isView = false, 
  isUpdate = false
}: ExtendedBcgAllocationProps): JSX.Element => {

  const userPermission = useFetchUsers()

  const defaultFormData: BcgAllocationData = {
    bcgVaccineAllocated: '',
    bcgDiluentAllocated: '',
    bcg005mlSyringeAllocated: '',
    bcg2mlSyringeAllocated: '',
    bcgVaccineRequested: '',
    bcgDiluentRequested: '',
    bcg005mlSyringeRequested: '',
    bcg2mlSyringeRequested: '',
    bcgVaccineReturned: '',
    bcgDiluentReturned: '',
    bcg005mlSyringeReturned: '',
    bcg2mlSyringeReturned: '',
    bcgVaccineReceived: '',
    bcgDiluentReceived: '',
    bcg005mlSyringeReceived: '',
    bcg2mlSyringeReceived: '',
    bcgVaccineConveyorDelivered: '',
    bcgDiluentConveyorDelivered: '',
    bcg005mlSyringeConveyorDelivered: '',
    bcg2mlSyringeConveyorDelivered: '',
    bcgVaccineConveyorReturned: '',
    bcgDiluentConveyorReturned: '',
    bcg005mlSyringeConveyorReturned: '',
    bcg2mlSyringeConveyorReturned: '',
  };

  const [formData, setFormData] = useState<BcgAllocationData>(() => ({
    ...defaultFormData,
    ...initialData,
  }));

  useEffect(() => {
    setFormData((prev) => {
      const newFormData = { ...defaultFormData, ...initialData };
      if (JSON.stringify(prev) !== JSON.stringify(newFormData)) {
        return newFormData;
      }
      return prev;
    });
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };
      onDataChange(newFormData);
      return newFormData;
    });
  };


  const userRole = sessionStorage.getItem('userRole');
  // console.log(userRole);
  const isUHF = userRole === 'uhf';
  const isEHF = userRole === 'ehf';
  const isConveyor = userRole === 'conveyor';
  const isThreePl = userRole === 'threepl'

  const canEditUHFRequest = (isUHF || isThreePl) && status === 1 && (isUpdate || !isView);
  const canEditEHFAllocation = isEHF && status === 2 && (isUpdate || !isView);
  const canEditConveyorDelivered = (isConveyor || isThreePl) && status === 3 && (isUpdate || !isView);
  const canEditUHFReturned = (isUHF || isThreePl) && status === 4 && (isUpdate || !isView);
  const canEditConveyorReturned = (isConveyor || isThreePl) && status === 5 && (isUpdate || !isView);
  const canEditEHFReceived = isEHF && status === 6 && (isUpdate || !isView);
  const isReverseLogisticsEnabled = status >= 3;


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          border: '1px solid #1976D2',
          borderRadius: 1,
          backgroundColor: '#1976D2',
          color: 'white',
          padding: 2,
          textAlign: 'left',
          width: '100%',
        }}
      >
        BCG Allocation
      </Typography>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
          aria-controls="forward-logistics-content"
          id="forward-logistics-header"
          sx={{
            backgroundColor: '#37474F',
            color: 'white',
            border: '1px solid #37474F',
            borderRadius: 1,
          }}
        >
          <Typography component="span" variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Forward Logistics
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}> 
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                sx={{
                  color: 'black',
                  paddingBottom: 1,
                  textAlign: 'left',
                  mt: 3,
                  mb: 2,
                  borderRadius: 1,
                }}
              >
                BCG Vaccine Requested by UHF
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>BCG Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="bcgVaccineRequested"
                      value={formData.bcgVaccineRequested}
                      onChange={handleChange}
                      disabled={isView || !canEditUHFRequest}
                      required={canEditUHFRequest}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>BCG Diluent</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="bcgDiluentRequested"
                      value={formData.bcgDiluentRequested}
                      onChange={handleChange}
                      disabled={isView || !canEditUHFRequest}
                      required={canEditUHFRequest}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>BCG 0.05ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="bcg005mlSyringeRequested"
                      value={formData.bcg005mlSyringeRequested}
                      onChange={handleChange}
                      disabled={isView || !canEditUHFRequest}
                      required={canEditUHFRequest}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>BCG 2ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="bcg2mlSyringeRequested"
                      value={formData.bcg2mlSyringeRequested}
                      onChange={handleChange}
                      disabled={isView || !canEditUHFRequest}
                      required={canEditUHFRequest}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                sx={{
                  color: 'black',
                  paddingBottom: 1,
                  textAlign: 'left',
                  mt: 3,
                  mb: 2,
                  borderRadius: 1,
                }}
              >
                BCG Vaccine Allocated by EHF
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>BCG Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="bcgVaccineAllocated"
                      value={formData.bcgVaccineAllocated}
                      onChange={handleChange}
                      disabled={isView || !canEditEHFAllocation}
                      required={canEditEHFAllocation}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>BCG Diluent</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="bcgDiluentAllocated"
                      value={formData.bcgDiluentAllocated}
                      onChange={handleChange}
                      disabled={isView || !canEditEHFAllocation}
                      required={canEditEHFAllocation}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>BCG 0.05ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="bcg005mlSyringeAllocated"
                      value={formData.bcg005mlSyringeAllocated}
                      onChange={handleChange}
                      disabled={isView || !canEditEHFAllocation}
                      required={canEditEHFAllocation}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>BCG 2ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="bcg2mlSyringeAllocated"
                      value={formData.bcg2mlSyringeAllocated}
                      onChange={handleChange}
                      disabled={isView || !canEditEHFAllocation}
                      required={canEditEHFAllocation}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                sx={{
                  color: 'black',
                  paddingBottom: 1,
                  textAlign: 'left',
                  mt: 3,
                  mb: 2,
                  borderRadius: 1,
                }}
              >
                BCG Vaccine Delivered by Conveyor/3PL
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>BCG Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="bcgVaccineConveyorDelivered"
                      value={formData.bcgVaccineConveyorDelivered}
                      onChange={handleChange}
                      disabled={isView || !canEditConveyorDelivered}
                      required={canEditConveyorDelivered}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>BCG Diluent</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="bcgDiluentConveyorDelivered"
                      value={formData.bcgDiluentConveyorDelivered}
                      onChange={handleChange}
                      disabled={isView || !canEditConveyorDelivered}
                      required={canEditConveyorDelivered}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>BCG 0.05ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="bcg005mlSyringeConveyorDelivered"
                      value={formData.bcg005mlSyringeConveyorDelivered}
                      onChange={handleChange}
                      disabled={isView || !canEditConveyorDelivered}
                      required={canEditConveyorDelivered}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>BCG 2ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="bcg2mlSyringeConveyorDelivered"
                      value={formData.bcg2mlSyringeConveyorDelivered}
                      onChange={handleChange}
                      disabled={isView || !canEditConveyorDelivered}
                      required={canEditConveyorDelivered}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion disabled={!isReverseLogisticsEnabled}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
          aria-controls="reverse-logistics-content"
          id="reverse-logistics-header"
          sx={{
            backgroundColor: '#6B6B6B',
            color: 'white',
            border: '1px solid #6B6B6B',
            borderRadius: 1,
          }}
        >
          <Typography component="span" variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Reverse Logistics
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                sx={{
                  color: 'black',
                  paddingBottom: 1,
                  textAlign: 'left',
                  mt: 3,
                  mb: 2,
                  borderRadius: 1,
                }}
              >
                BCG Vaccine Returned by UHF
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>BCG Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="bcgVaccineReturned"
                      value={formData.bcgVaccineReturned}
                      onChange={handleChange}
                      disabled={isView || !canEditUHFReturned}
                      required={canEditUHFReturned}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>BCG Diluent</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="bcgDiluentReturned"
                      value={formData.bcgDiluentReturned}
                      onChange={handleChange}
                      disabled={isView || !canEditUHFReturned}
                      required={canEditUHFReturned}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>BCG 0.05ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="bcg005mlSyringeReturned"
                      value={formData.bcg005mlSyringeReturned}
                      onChange={handleChange}
                      disabled={isView || !canEditUHFReturned}
                      required={canEditUHFReturned}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>BCG 2ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="bcg2mlSyringeReturned"
                      value={formData.bcg2mlSyringeReturned}
                      onChange={handleChange}
                      disabled={isView || !canEditUHFReturned}
                      required={canEditUHFReturned}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                sx={{
                  color: 'black',
                  paddingBottom: 1,
                  textAlign: 'left',
                  mt: 3,
                  mb: 2,
                  borderRadius: 1,
                }}
              >
                BCG Vaccine Returned by Conveyor/3PL
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>BCG Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="bcgVaccineConveyorReturned"
                      value={formData.bcgVaccineConveyorReturned}
                      onChange={handleChange}
                      disabled={isView || !canEditConveyorReturned}
                      required={canEditConveyorReturned}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>BCG Diluent</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="bcgDiluentConveyorReturned"
                      value={formData.bcgDiluentConveyorReturned}
                      onChange={handleChange}
                      disabled={isView || !canEditConveyorReturned}
                      required={canEditConveyorReturned}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>BCG 0.05ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="bcg005mlSyringeConveyorReturned"
                      value={formData.bcg005mlSyringeConveyorReturned}
                      onChange={handleChange}
                      disabled={isView || !canEditConveyorReturned}
                      required={canEditConveyorReturned}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>BCG 2ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="bcg2mlSyringeConveyorReturned"
                      value={formData.bcg2mlSyringeConveyorReturned}
                      onChange={handleChange}
                      disabled={isView || !canEditConveyorReturned}
                      required={canEditConveyorReturned}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                sx={{
                  color: 'black',
                  paddingBottom: 1,
                  textAlign: 'left',
                  mt: 3,
                  mb: 2,
                  borderRadius: 1,
                }}
              >
                BCG Vaccine Received by EHF
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>BCG Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="bcgVaccineReceived"
                      value={formData.bcgVaccineReceived}
                      onChange={handleChange}
                      disabled={isView || !canEditEHFReceived}
                      required={canEditEHFReceived}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>BCG Diluent</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="bcgDiluentReceived"
                      value={formData.bcgDiluentReceived}
                      onChange={handleChange}
                      disabled={isView || !canEditEHFReceived}
                      required={canEditEHFReceived}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>BCG 0.05ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="bcg005mlSyringeReceived"
                      value={formData.bcg005mlSyringeReceived}
                      onChange={handleChange}
                      disabled={isView || !canEditEHFReceived}
                      required={canEditEHFReceived}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>BCG 2ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="bcg2mlSyringeReceived"
                      value={formData.bcg2mlSyringeReceived}
                      onChange={handleChange}
                      disabled={isView || !canEditEHFReceived}
                      required={canEditEHFReceived}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};