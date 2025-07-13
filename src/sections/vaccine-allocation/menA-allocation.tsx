import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Grid } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MenAAllocationData } from 'src/types/allocations/menA';

interface ExtendedMenAAllocationProps {
  initialData?: Partial<MenAAllocationData>;
  onDataChange: (data: MenAAllocationData) => void;
  status?: number; 
  key?: string;
  isView: boolean;
  isUpdate: boolean;
}

export const MenAAllocation = ({
  initialData = {},
  onDataChange,
  status = 1, 
  isView = false,
  isUpdate = false,
}: ExtendedMenAAllocationProps): JSX.Element => {
  const defaultFormData: MenAAllocationData = {
    menAVaccineAllocated: '',
    menADiluentAllocated: '',
    menA05mlSyringeAllocated: '',
    menA5mlSyringeAllocated: '',
    menAVaccineRequested: '',
    menADiluentRequested: '',
    menA05mlSyringeRequested: '',
    menA5mlSyringeRequested: '',
    menAVaccineReturned: '',
    menADiluentReturned: '',
    menA05mlSyringeReturned: '',
    menA5mlSyringeReturned: '',
    menAVaccineReceived: '',
    menADiluentReceived: '',
    menA05mlSyringeReceived: '',
    menA5mlSyringeReceived: '',
    menAVaccineConveyorDelivered: '',
    menADiluentConveyorDelivered: '',
    menA05mlSyringeConveyorDelivered: '',
    menA5mlSyringeConveyorDelivered: '',
    menAVaccineConveyorReturned: '',
    menADiluentConveyorReturned: '',
    menA05mlSyringeConveyorReturned: '',
    menA5mlSyringeConveyorReturned: '',
  };

  const [formData, setFormData] = useState<MenAAllocationData>(() => ({
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
        MenA Allocation
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
                MenA Vaccine Requested by UHF
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>MenA Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="menAVaccineRequested"
                      value={formData.menAVaccineRequested}
                      onChange={handleChange}
                      disabled={!canEditUHFRequest}
                      required={canEditUHFRequest}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>MenA Diluent</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="menADiluentRequested"
                      value={formData.menADiluentRequested}
                      onChange={handleChange}
                      disabled={!canEditUHFRequest}
                      required={canEditUHFRequest}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>MenA 0.5ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="menA05mlSyringeRequested"
                      value={formData.menA05mlSyringeRequested}
                      onChange={handleChange}
                      disabled={!canEditUHFRequest}
                      required={canEditUHFRequest}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>MenA 5ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="menA5mlSyringeRequested"
                      value={formData.menA5mlSyringeRequested}
                      onChange={handleChange}
                      disabled={!canEditUHFRequest}
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
                MenA Vaccine Allocated by EHF
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>MenA Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="menAVaccineAllocated"
                      value={formData.menAVaccineAllocated}
                      onChange={handleChange}
                      disabled={!canEditEHFAllocation}
                      required={canEditEHFAllocation}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>MenA Diluent</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="menADiluentAllocated"
                      value={formData.menADiluentAllocated}
                      onChange={handleChange}
                      disabled={!canEditEHFAllocation}
                      required={canEditEHFAllocation}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>MenA 0.5ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="menA05mlSyringeAllocated"
                      value={formData.menA05mlSyringeAllocated}
                      onChange={handleChange}
                      disabled={!canEditEHFAllocation}
                      required={canEditEHFAllocation}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>MenA 5ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="menA5mlSyringeAllocated"
                      value={formData.menA5mlSyringeAllocated}
                      onChange={handleChange}
                      disabled={!canEditEHFAllocation}
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
                MenA Vaccine Delivered by Conveyor/3PL
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>MenA Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="menAVaccineConveyorDelivered"
                      value={formData.menAVaccineConveyorDelivered}
                      onChange={handleChange}
                      disabled={!canEditConveyorDelivered}
                      required={canEditConveyorDelivered}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>MenA Diluent</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="menADiluentConveyorDelivered"
                      value={formData.menADiluentConveyorDelivered}
                      onChange={handleChange}
                      disabled={!canEditConveyorDelivered}
                      required={canEditConveyorDelivered}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>MenA 0.5ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="menA05mlSyringeConveyorDelivered"
                      value={formData.menA05mlSyringeConveyorDelivered}
                      onChange={handleChange}
                      disabled={!canEditConveyorDelivered}
                      required={canEditConveyorDelivered}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>MenA 5ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="menA5mlSyringeConveyorDelivered"
                      value={formData.menA5mlSyringeConveyorDelivered}
                      onChange={handleChange}
                      disabled={!canEditConveyorDelivered}
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
                MenA Vaccine Returned by UHF
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>MenA Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="menAVaccineReturned"
                      value={formData.menAVaccineReturned}
                      onChange={handleChange}
                      disabled={isView || !canEditUHFReturned}
                      required={canEditUHFReturned}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>MenA Diluent</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="menADiluentReturned"
                      value={formData.menADiluentReturned}
                      onChange={handleChange}
                      disabled={isView || !canEditUHFReturned}
                      required={canEditUHFReturned}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>MenA 0.5ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="menA05mlSyringeReturned"
                      value={formData.menA05mlSyringeReturned}
                      onChange={handleChange}
                      disabled={isView || !canEditUHFReturned}
                      required={canEditUHFReturned}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>MenA 5ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="menA5mlSyringeReturned"
                      value={formData.menA5mlSyringeReturned}
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
                MenA Vaccine Returned by Conveyor/3PL
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>MenA Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="menAVaccineConveyorReturned"
                      value={formData.menAVaccineConveyorReturned}
                      onChange={handleChange}
                      disabled={isView || !canEditConveyorReturned}
                      required={canEditConveyorReturned}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>MenA Diluent</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="menADiluentConveyorReturned"
                      value={formData.menADiluentConveyorReturned}
                      onChange={handleChange}
                      disabled={isView || !canEditConveyorReturned}
                      required={canEditConveyorReturned}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>MenA 0.5ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="menA05mlSyringeConveyorReturned"
                      value={formData.menA05mlSyringeConveyorReturned}
                      onChange={handleChange}
                      disabled={isView || !canEditConveyorReturned}
                      required={canEditConveyorReturned}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>MenA 5ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="menA5mlSyringeConveyorReturned"
                      value={formData.menA5mlSyringeConveyorReturned}
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
                MenA Vaccine Received by EHF
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>MenA Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="menAVaccineReceived"
                      value={formData.menAVaccineReceived}
                      onChange={handleChange}
                      disabled={isView || !canEditEHFReceived}
                      required={canEditEHFReceived}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>MenA Diluent</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="menADiluentReceived"
                      value={formData.menADiluentReceived}
                      onChange={handleChange}
                      disabled={isView || !canEditEHFReceived}
                      required={canEditEHFReceived}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>MenA 0.5ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="menA05mlSyringeReceived"
                      value={formData.menA05mlSyringeReceived}
                      onChange={handleChange}
                      disabled={isView || !canEditEHFReceived}
                      required={canEditEHFReceived}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>MenA 5ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="menA5mlSyringeReceived"
                      value={formData.menA5mlSyringeReceived}
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