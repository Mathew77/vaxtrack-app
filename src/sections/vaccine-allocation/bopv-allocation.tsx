import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, TextField, Typography, Grid, Tooltip } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { BopvAllocationData } from 'src/types/allocations/bopv';
import { preventInvalidKeys } from 'src/utils/preventInvalidkeys';

interface ExtendedBopvAllocationProps {
  initialData?: Partial<BopvAllocationData>;
  onDataChange: (data: BopvAllocationData) => void;
  status?: number;
  key?: string;
  isView: boolean;
  isUpdate: boolean;
}

const BopvAllocationComponent = ({
  initialData = {},
  onDataChange,
  status = 1,
  isView = false,
  isUpdate = false,
}: ExtendedBopvAllocationProps): JSX.Element => {
  const defaultFormData: BopvAllocationData = {
    bopvVaccineAllocated: '',
    bopvDropperAllocated: '',
    bopvVaccineRequested: '',
    bopvDropperRequested: '',
    bopvVaccineReturned: '',
    bopvDropperReturned: '',
    bopvVaccineReceived: '',
    bopvDropperReceived: '',
    bopvEmptyVials: '',
    bopvSafetyBoxes: '',
    bopvUnusedVials: '',
    bopvVaccineConveyorDelivered: '',
    bopvDropperConveyorDelivered: '',
    bopvVaccineConveyorReturned: '',
    bopvDropperConveyorReturned: '',
  };

  const [formData, setFormData] = useState<BopvAllocationData>(() => ({
    ...defaultFormData,
    ...initialData,
  }));

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
    const numValue = parseInt(value, 10) || 0;

    // Exclude non-quantity fields from validation
    const excludedBopvFields = ['bopvEmptyVials', 'bopvSafetyBoxes', 'bopvUnusedVials'];

    // Handle bOPV vaccine allocation - validate divisibility by 20 and auto-calculate droppers
    if (name === 'bopvVaccineAllocated' && !excludedBopvFields.includes(name)) {
      if (value !== '' && numValue % 20 !== 0) {
        // Invalid value - set error and clear droppers but keep the value
        setErrors((prev) => ({ ...prev, [name]: 'Quantity must be divisible by 20' }));
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          bopvDropperAllocated: '',
        }));
      } else if (numValue > 0 && numValue % 20 === 0) {
        // Valid value - clear error and auto-calculate droppers (1 dropper per vial of 20 doses)
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
        const vials = numValue / 20;
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          bopvDropperAllocated: vials.toString(),
        }));
      } else {
        // Empty or zero - clear error and droppers
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          bopvDropperAllocated: '',
        }));
      }
    }
    // Handle bOPV vaccine received - validate divisibility by 20 and auto-calculate droppers
    else if (name === 'bopvVaccineReceived' && !excludedBopvFields.includes(name)) {
      if (value !== '' && numValue % 20 !== 0) {
        // Invalid value - set error and clear droppers but keep the value
        setErrors((prev) => ({ ...prev, [name]: 'Quantity must be divisible by 20' }));
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          bopvDropperReceived: '',
        }));
      } else if (numValue > 0 && numValue % 20 === 0) {
        // Valid value - clear error and auto-calculate droppers
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
        const vials = numValue / 20;
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          bopvDropperReceived: vials.toString(),
        }));
      } else {
        // Empty or zero - clear error and droppers
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          bopvDropperReceived: '',
        }));
      }
    }
    // For other bOPV fields, just update normally
    else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

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
  const canEditEHFAllocation = (isEHF || isConveyor) && status === 1 && (isUpdate || !isView);
  const canEditConveyorDelivered = (isConveyor || isThreePl) && status === 3 && (isUpdate || !isView);
  const canEditUHFReturned = (isUHF || isThreePl) && status === 4 && (isUpdate || !isView);
  const canEditConveyorReturned = (isConveyor || isThreePl) && status === 5 && (isUpdate || !isView);
  const canEditEHFReceived = (isEHF || isConveyor) && status === 6 && (isUpdate || !isView);
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
        BOPV Allocation
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
                BOPV Vaccine Requested by UHF
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>BOPV Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="bopvVaccineRequested"
                      value={formData.bopvVaccineRequested}
                      onChange={handleChange}
                      disabled={!canEditUHFRequest}
                      required={canEditUHFRequest}
                      type='number'
                      onKeyDown={preventInvalidKeys}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>BOPV Dropper</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="bopvDropperRequested"
                      value={formData.bopvDropperRequested}
                      onChange={handleChange}
                      disabled={!canEditUHFRequest}
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
                BOPV Vaccine Allocated by EHF
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>BOPV Vaccine</Typography>
                    <Tooltip title="Enter BOPV vaccine quantity (20 doses per vial)" arrow placement="top">
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="bopvVaccineAllocated"
                        value={formData.bopvVaccineAllocated}
                        onChange={handleChange}
                        disabled={!canEditEHFAllocation}
                        required={canEditEHFAllocation}
                        type='number'
                        onKeyDown={preventInvalidKeys}
                        error={!!errors.bopvVaccineAllocated}
                        helperText={errors.bopvVaccineAllocated}
                        inputProps={{ min: 0 }}
                      />
                    </Tooltip>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>BOPV Dropper</Typography>
                    <Tooltip title="Enter BOPV dropper quantity" arrow placement="top">
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="bopvDropperAllocated"
                        value={formData.bopvDropperAllocated}
                        onChange={handleChange}
                        // disabled={!canEditEHFAllocation}
                        required={canEditEHFAllocation}
                        type='number'
                        onKeyDown={preventInvalidKeys}
                        inputProps={{ min: 0 }}
                      />
                    </Tooltip>
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
                BOPV Vaccine Delivered by Conveyor/3PL
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>BOPV Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="bopvVaccineConveyorDelivered"
                      value={formData.bopvVaccineConveyorDelivered}
                      onChange={handleChange}
                      disabled={!canEditConveyorDelivered}
                      required={canEditConveyorDelivered}
                      type='number'
                      onKeyDown={preventInvalidKeys}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>BOPV Dropper</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="bopvDropperConveyorDelivered"
                      value={formData.bopvDropperConveyorDelivered}
                      onChange={handleChange}
                      disabled={!canEditConveyorDelivered}
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
                BOPV Vaccine Returned by UHF
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>BOPV Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="bopvVaccineReturned"
                      value={formData.bopvVaccineReturned}
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
                    <Typography>BOPV Dropper</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="bopvDropperReturned"
                      value={formData.bopvDropperReturned}
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
                BOPV Vaccine Returned by Conveyor/3PL
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>BOPV Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="bopvVaccineConveyorReturned"
                      value={formData.bopvVaccineConveyorReturned}
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
                    <Typography>BOPV Dropper</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="bopvDropperConveyorReturned"
                      value={formData.bopvDropperConveyorReturned}
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
                BOPV Vaccine Received by EHF
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>BOPV Vaccine</Typography>
                    <Tooltip title="Enter BOPV vaccine quantity received (20 doses per vial)" arrow placement="top">
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="bopvVaccineReceived"
                        value={formData.bopvVaccineReceived}
                        onChange={handleChange}
                        disabled={isView || !canEditEHFReceived}
                        required={canEditEHFReceived}
                        type='number'
                        onKeyDown={preventInvalidKeys}
                        error={!!errors.bopvVaccineReceived}
                        helperText={errors.bopvVaccineReceived}
                        inputProps={{ min: 0 }}
                      />
                    </Tooltip>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>BOPV Dropper</Typography>
                    <Tooltip title="Enter BOPV dropper quantity received" arrow placement="top">
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="bopvDropperReceived"
                        value={formData.bopvDropperReceived}
                        onChange={handleChange}
                        // disabled={true}
                        required={canEditEHFReceived}
                        type='number'
                        onKeyDown={preventInvalidKeys}
                        inputProps={{ min: 0 }}
                      />
                    </Tooltip>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Empty Vials</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="bopvEmptyVials"
                      value={formData.bopvEmptyVials}
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
                      name="bopvSafetyBoxes"
                      value={formData.bopvSafetyBoxes}
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
                      name="bopvUnusedVials"
                      value={formData.bopvUnusedVials}
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

export const BopvAllocation = React.memo(BopvAllocationComponent);