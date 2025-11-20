import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, TextField, Typography, Grid } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MalariaAllocationData } from 'src/types/allocations/malaria';
import { preventInvalidKeys } from 'src/utils/preventInvalidkeys';

interface ExtendedMalariaAllocationProps {
  initialData?: Partial<MalariaAllocationData>;
  onDataChange: (data: MalariaAllocationData) => void;
  status?: number; 
  key?: string;
  isView?: boolean;
  isUpdate?: boolean;
}

const MalariaAllocationComponent = ({
  initialData = {},
  onDataChange,
  status = 1,
  isView = false,
  isUpdate = false,
}: ExtendedMalariaAllocationProps): JSX.Element => {
  const defaultFormData: MalariaAllocationData = {
    malariaVaccineAllocated: '',
    malariaDiluentAllocated: '',
    malaria05mlSyringeAllocated: '',
    malaria2mlSyringeAllocated: '',
    malariaVaccineRequested: '',
    malariaDiluentRequested: '',
    malaria05mlSyringeRequested: '',
    malaria2mlSyringeRequested: '',
    malariaVaccineReturned: '',
    malariaDiluentReturned: '',
    malaria05mlSyringeReturned: '',
    malaria2mlSyringeReturned: '',
    malariaVaccineReceived: '',
    malariaDiluentReceived: '',
    malaria05mlSyringeReceived: '',
    malaria2mlSyringeReceived: '',
    malariaEmptyVials: '',
    malariaSafetyBoxes: '',
    malariaUnusedVials: '',
    malariaVaccineConveyorDelivered: '',
    malariaDiluentConveyorDelivered: '',
    malaria05mlSyringeConveyorDelivered: '',
    malaria2mlSyringeConveyorDelivered: '',
    malariaVaccineConveyorReturned: '',
    malariaDiluentConveyorReturned: '',
    malaria05mlSyringeConveyorReturned: '',
    malaria2mlSyringeConveyorReturned: '',
  };

  const [formData, setFormData] = useState<MalariaAllocationData>(() => ({
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

  const debounceRef = useRef<NodeJS.Timeout>();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setFormData((current) => {
        onDataChange(current);
        return current;
      });
    }, 150);
  }, [onDataChange]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const userRole = sessionStorage.getItem('userRole');
  // console.log(userRole);
  const isUHF = userRole === 'uhf';
  const isEHF = userRole === 'ehf';
  const isConveyor = userRole === 'conveyor';
  const isThreePl = userRole === 'threepl'

  const canEditUHFRequest = (isUHF || isThreePl) && status === 1 && (isUpdate || !isView);
  const canEditEHFAllocation = (isEHF || isConveyor) && status ===  1 && (isUpdate || !isView);
  const canEditConveyorDelivered = (isConveyor || isThreePl) && status === 3 && (isUpdate || !isView);
  const canEditUHFReturned = (isUHF || isThreePl) && status === 4 && (isUpdate || !isView);
  const canEditConveyorReturned = (isConveyor || isThreePl) && status === 5 && (isUpdate || !isView);
  const canEditEHFReceived = (isEHF || isConveyor) && status ===  6 && (isUpdate || !isView);
  const isReverseLogisticsEnabled = status >= 3;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          border: '1px solid rgb(12, 125, 64)',
          borderRadius: 1,
          backgroundColor: 'rgb(12, 125, 64)',
          color: 'white',
          padding: 2,
          textAlign: 'left',
          width: '100%',
        }}
      >
        Malaria Allocation
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
            {/* <Grid item xs={12}>
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
                Malaria Vaccine Requested by UHF
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Malaria Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="malariaVaccineRequested"
                      value={formData.malariaVaccineRequested}
                      onChange={handleChange}
                      disabled={isView || !canEditUHFRequest}
                      required={canEditUHFRequest}
                      type='number'
                      onKeyDown={preventInvalidKeys}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Malaria Diluent</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="malariaDiluentRequested"
                      value={formData.malariaDiluentRequested}
                      onChange={handleChange}
                      disabled={isView || !canEditUHFRequest}
                      required={canEditUHFRequest}
                      type='number'
                      onKeyDown={preventInvalidKeys}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Malaria 0.5ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="malaria05mlSyringeRequested"
                      value={formData.malaria05mlSyringeRequested}
                      onChange={handleChange}
                      disabled={isView || !canEditUHFRequest}
                      required={canEditUHFRequest}
                      type='number'
                      onKeyDown={preventInvalidKeys}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Malaria 2ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="malaria2mlSyringeRequested"
                      value={formData.malaria2mlSyringeRequested}
                      onChange={handleChange}
                      disabled={isView || !canEditUHFRequest}
                      required={canEditUHFRequest}
                      type='number'
                      onKeyDown={preventInvalidKeys}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Grid> */}
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
                Malaria Vaccine Allocated by EHF
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Malaria Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="malariaVaccineAllocated"
                      value={formData.malariaVaccineAllocated}
                      onChange={handleChange}
                      disabled={isView || !canEditEHFAllocation}
                      required={canEditEHFAllocation}
                      type='number'
                      onKeyDown={preventInvalidKeys}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Malaria Diluent</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="malariaDiluentAllocated"
                      value={formData.malariaDiluentAllocated}
                      onChange={handleChange}
                      disabled={isView || !canEditEHFAllocation}
                      required={canEditEHFAllocation}
                      type='number'
                      onKeyDown={preventInvalidKeys}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Malaria 0.5ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="malaria05mlSyringeAllocated"
                      value={formData.malaria05mlSyringeAllocated}
                      onChange={handleChange}
                      disabled={isView || !canEditEHFAllocation}
                      required={canEditEHFAllocation}
                      type='number'
                      onKeyDown={preventInvalidKeys}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Malaria 2ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="malaria2mlSyringeAllocated"
                      value={formData.malaria2mlSyringeAllocated}
                      onChange={handleChange}
                      disabled={isView || !canEditEHFAllocation}
                      required={canEditEHFAllocation}
                      type='number'
                      onKeyDown={preventInvalidKeys}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            {/* <Grid item xs={12}>
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
                Malaria Vaccine Delivered by Conveyor/3PL
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Malaria Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="malariaVaccineConveyorDelivered"
                      value={formData.malariaVaccineConveyorDelivered}
                      onChange={handleChange}
                      disabled={isView || !canEditConveyorDelivered}
                      required={canEditConveyorDelivered}
                      type='number'
                      onKeyDown={preventInvalidKeys}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Malaria Diluent</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="malariaDiluentConveyorDelivered"
                      value={formData.malariaDiluentConveyorDelivered}
                      onChange={handleChange}
                      disabled={isView || !canEditConveyorDelivered}
                      required={canEditConveyorDelivered}
                      type='number'
                      onKeyDown={preventInvalidKeys}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Malaria 0.5ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="malaria05mlSyringeConveyorDelivered"
                      value={formData.malaria05mlSyringeConveyorDelivered}
                      onChange={handleChange}
                      disabled={isView || !canEditConveyorDelivered}
                      required={canEditConveyorDelivered}
                      type='number'
                      onKeyDown={preventInvalidKeys}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Malaria 2ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="malaria2mlSyringeConveyorDelivered"
                      value={formData.malaria2mlSyringeConveyorDelivered}
                      onChange={handleChange}
                      disabled={isView || !canEditConveyorDelivered}
                      required={canEditConveyorDelivered}
                      type='number'
                      onKeyDown={preventInvalidKeys}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Grid> */}
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
            {/* <Grid item xs={12}>
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
                Malaria Vaccine Returned by UHF
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Malaria Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="malariaVaccineReturned"
                      value={formData.malariaVaccineReturned}
                      onChange={handleChange}
                      disabled={isView || !canEditUHFReturned}
                      required={canEditUHFReturned}
                      type='number'
                      onKeyDown={preventInvalidKeys}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Malaria Diluent</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="malariaDiluentReturned"
                      value={formData.malariaDiluentReturned}
                      onChange={handleChange}
                      disabled={isView || !canEditUHFReturned}
                      required={canEditUHFReturned}
                      type='number'
                      onKeyDown={preventInvalidKeys}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Malaria 0.5ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="malaria05mlSyringeReturned"
                      value={formData.malaria05mlSyringeReturned}
                      onChange={handleChange}
                      disabled={isView || !canEditUHFReturned}
                      required={canEditUHFReturned}
                      type='number'
                      onKeyDown={preventInvalidKeys}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Malaria 2ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="malaria2mlSyringeReturned"
                      value={formData.malaria2mlSyringeReturned}
                      onChange={handleChange}
                      disabled={isView || !canEditUHFReturned}
                      required={canEditUHFReturned}
                      type='number'
                      onKeyDown={preventInvalidKeys}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Grid> */}
            {/* <Grid item xs={12}>
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
                Malaria Vaccine Returned by Conveyor/3PL
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Malaria Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="malariaVaccineConveyorReturned"
                      value={formData.malariaVaccineConveyorReturned}
                      onChange={handleChange}
                      disabled={isView || !canEditConveyorReturned}
                      required={canEditConveyorReturned}
                      type='number'
                      onKeyDown={preventInvalidKeys}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Malaria Diluent</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="malariaDiluentConveyorReturned"
                      value={formData.malariaDiluentConveyorReturned}
                      onChange={handleChange}
                      disabled={isView || !canEditConveyorReturned}
                      required={canEditConveyorReturned}
                      type='number'
                      onKeyDown={preventInvalidKeys}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Malaria 0.5ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="malaria05mlSyringeConveyorReturned"
                      value={formData.malaria05mlSyringeConveyorReturned}
                      onChange={handleChange}
                      disabled={isView || !canEditConveyorReturned}
                      required={canEditConveyorReturned}
                      type='number'
                      onKeyDown={preventInvalidKeys}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Malaria 2ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="malaria2mlSyringeConveyorReturned"
                      value={formData.malaria2mlSyringeConveyorReturned}
                      onChange={handleChange}
                      disabled={isView || !canEditConveyorReturned}
                      required={canEditConveyorReturned}
                      type='number'
                      onKeyDown={preventInvalidKeys}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Grid> */}
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
                Malaria Vaccine Received by EHF
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Malaria Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="malariaVaccineReceived"
                      value={formData.malariaVaccineReceived}
                      onChange={handleChange}
                      disabled={isView || !canEditEHFReceived}
                      required={canEditEHFReceived}
                      type='number'
                      onKeyDown={preventInvalidKeys}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Malaria Diluent</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="malariaDiluentReceived"
                      value={formData.malariaDiluentReceived}
                      onChange={handleChange}
                      disabled={isView || !canEditEHFReceived}
                      required={canEditEHFReceived}
                      type='number'
                      onKeyDown={preventInvalidKeys}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Malaria 0.5ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="malaria05mlSyringeReceived"
                      value={formData.malaria05mlSyringeReceived}
                      onChange={handleChange}
                      disabled={isView || !canEditEHFReceived}
                      required={canEditEHFReceived}
                      type='number'
                      onKeyDown={preventInvalidKeys}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Malaria 2ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="malaria2mlSyringeReceived"
                      value={formData.malaria2mlSyringeReceived}
                      onChange={handleChange}
                      disabled={isView || !canEditEHFReceived}
                      required={canEditEHFReceived}
                      type='number'
                      onKeyDown={preventInvalidKeys}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Empty Vials</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="malariaEmptyVials"
                      value={formData.malariaEmptyVials}
                      onChange={handleChange}
                      disabled={isView || !canEditEHFReceived}
                      required={canEditEHFReceived}
                      type='number'
                      onKeyDown={preventInvalidKeys}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Safety Boxes</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="malariaSafetyBoxes"
                      value={formData.malariaSafetyBoxes}
                      onChange={handleChange}
                      disabled={isView || !canEditEHFReceived}
                      required={canEditEHFReceived}
                      type='number'
                      onKeyDown={preventInvalidKeys}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Unused Vials</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="malariaUnusedVials"
                      value={formData.malariaUnusedVials}
                      onChange={handleChange}
                      disabled={isView || !canEditEHFReceived}
                      required={canEditEHFReceived}
                      type='number'
                      onKeyDown={preventInvalidKeys}
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

export const MalariaAllocation = React.memo(MalariaAllocationComponent);