import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Grid } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MeaslesAllocationData } from 'src/types/allocations/measles';

interface ExtendedMeaslesAllocationProps {
  initialData?: Partial<MeaslesAllocationData>;
  onDataChange: (data: MeaslesAllocationData) => void;
  status?: number; 
  key?: string;
  isView?: boolean;
  isUpdate?: boolean;
}

export const MeaslesAllocation = ({
  initialData = {},
  onDataChange,
  status = 1,
  isView = false,
  isUpdate = false,
}: ExtendedMeaslesAllocationProps): JSX.Element => {
  const defaultFormData: MeaslesAllocationData = {
    measlesVaccineAllocated: '',
    measlesDiluentAllocated: '',
    measles05mlSyringeAllocated: '',
    measles2mlSyringeAllocated: '',
    measlesVaccineRequested: '',
    measlesDiluentRequested: '',
    measles05mlSyringeRequested: '',
    measles2mlSyringeRequested: '',
    measlesVaccineReturned: '',
    measlesDiluentReturned: '',
    measles05mlSyringeReturned: '',
    measles2mlSyringeReturned: '',
    measlesVaccineReceived: '',
    measlesDiluentReceived: '',
    measles05mlSyringeReceived: '',
    measles2mlSyringeReceived: '',
    measlesVaccineConveyorDelivered: '',
    measlesDiluentConveyorDelivered: '',
    measles05mlSyringeConveyorDelivered: '',
    measles2mlSyringeConveyorDelivered: '',
    measlesVaccineConveyorReturned: '',
    measlesDiluentConveyorReturned: '',
    measles05mlSyringeConveyorReturned: '',
    measles2mlSyringeConveyorReturned: '',
  };

  const [formData, setFormData] = useState<MeaslesAllocationData>(() => ({
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
        Measles Allocation
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
                Measles Vaccine Requested by UHF
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Measles Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="measlesVaccineRequested"
                      value={formData.measlesVaccineRequested}
                      onChange={handleChange}
                      disabled={isView || !canEditUHFRequest}
                      required={canEditUHFRequest}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Measles Diluent</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="measlesDiluentRequested"
                      value={formData.measlesDiluentRequested}
                      onChange={handleChange}
                      disabled={isView || !canEditUHFRequest}
                      required={canEditUHFRequest}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Measles 0.5ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="measles05mlSyringeRequested"
                      value={formData.measles05mlSyringeRequested}
                      onChange={handleChange}
                      disabled={isView || !canEditUHFRequest}
                      required={canEditUHFRequest}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Measles 2ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="measles2mlSyringeRequested"
                      value={formData.measles2mlSyringeRequested}
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
                Measles Vaccine Allocated by EHF
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Measles Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="measlesVaccineAllocated"
                      value={formData.measlesVaccineAllocated}
                      onChange={handleChange}
                      disabled={isView || !canEditEHFAllocation}
                      required={canEditEHFAllocation}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Measles Diluent</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="measlesDiluentAllocated"
                      value={formData.measlesDiluentAllocated}
                      onChange={handleChange}
                      disabled={isView || !canEditEHFAllocation}
                      required={canEditEHFAllocation}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Measles 0.5ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="measles05mlSyringeAllocated"
                      value={formData.measles05mlSyringeAllocated}
                      onChange={handleChange}
                      disabled={isView || !canEditEHFAllocation}
                      required={canEditEHFAllocation}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Measles 2ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="measles2mlSyringeAllocated"
                      value={formData.measles2mlSyringeAllocated}
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
                Measles Vaccine Delivered by Conveyor/3PL
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Measles Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="measlesVaccineConveyorDelivered"
                      value={formData.measlesVaccineConveyorDelivered}
                      onChange={handleChange}
                      disabled={isView || !canEditConveyorDelivered}
                      required={canEditConveyorDelivered}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Measles Diluent</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="measlesDiluentConveyorDelivered"
                      value={formData.measlesDiluentConveyorDelivered}
                      onChange={handleChange}
                      disabled={isView || !canEditConveyorDelivered}
                      required={canEditConveyorDelivered}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Measles 0.5ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="measles05mlSyringeConveyorDelivered"
                      value={formData.measles05mlSyringeConveyorDelivered}
                      onChange={handleChange}
                      disabled={isView || !canEditConveyorDelivered}
                      required={canEditConveyorDelivered}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Measles 2ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="measles2mlSyringeConveyorDelivered"
                      value={formData.measles2mlSyringeConveyorDelivered}
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
                Measles Vaccine Returned by UHF
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Measles Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="measlesVaccineReturned"
                      value={formData.measlesVaccineReturned}
                      onChange={handleChange}
                      disabled={isView || !canEditUHFReturned}
                      required={canEditUHFReturned}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Measles Diluent</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="measlesDiluentReturned"
                      value={formData.measlesDiluentReturned}
                      onChange={handleChange}
                      disabled={isView || !canEditUHFReturned}
                      required={canEditUHFReturned}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Measles 0.5ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="measles05mlSyringeReturned"
                      value={formData.measles05mlSyringeReturned}
                      onChange={handleChange}
                      disabled={isView || !canEditUHFReturned}
                      required={canEditUHFReturned}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Measles 2ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="measles2mlSyringeReturned"
                      value={formData.measles2mlSyringeReturned}
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
                Measles Vaccine Returned by Conveyor/3PL
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Measles Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="measlesVaccineConveyorReturned"
                      value={formData.measlesVaccineConveyorReturned}
                      onChange={handleChange}
                      disabled={isView || !canEditConveyorReturned}
                      required={canEditConveyorReturned}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Measles Diluent</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="measlesDiluentConveyorReturned"
                      value={formData.measlesDiluentConveyorReturned}
                      onChange={handleChange}
                      disabled={isView || !canEditConveyorReturned}
                      required={canEditConveyorReturned}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Measles 0.5ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="measles05mlSyringeConveyorReturned"
                      value={formData.measles05mlSyringeConveyorReturned}
                      onChange={handleChange}
                      disabled={isView || !canEditConveyorReturned}
                      required={canEditConveyorReturned}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Measles 2ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="measles2mlSyringeConveyorReturned"
                      value={formData.measles2mlSyringeConveyorReturned}
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
                Measles Vaccine Received by EHF
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Measles Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="measlesVaccineReceived"
                      value={formData.measlesVaccineReceived}
                      onChange={handleChange}
                      disabled={isView || !canEditEHFReceived}
                      required={canEditEHFReceived}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Measles Diluent</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="measlesDiluentReceived"
                      value={formData.measlesDiluentReceived}
                      onChange={handleChange}
                      disabled={isView || !canEditEHFReceived}
                      required={canEditEHFReceived}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Measles 0.5ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="measles05mlSyringeReceived"
                      value={formData.measles05mlSyringeReceived}
                      onChange={handleChange}
                      disabled={isView || !canEditEHFReceived}
                      required={canEditEHFReceived}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Measles 2ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="measles2mlSyringeReceived"
                      value={formData.measles2mlSyringeReceived}
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