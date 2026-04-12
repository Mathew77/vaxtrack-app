import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, TextField, Typography, Grid, Tooltip } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { RotaAllocationData } from 'src/types/allocations/rota';
import { preventInvalidKeys } from 'src/utils/preventInvalidkeys';

interface ExtendedRotaAllocationProps {
  initialData?: Partial<RotaAllocationData>;
  onDataChange: (data: RotaAllocationData) => void;
  status?: number;
  key?: string;
  isView: boolean;
  isUpdate: boolean;
  isHealthFacilitySelected?: boolean;
}

const RotaAllocationComponent = ({
  initialData = {},
  onDataChange,
  status = 1,
  isView = false,
  isUpdate = false,
  isHealthFacilitySelected = true,
}: ExtendedRotaAllocationProps): JSX.Element => {
  const defaultFormData: RotaAllocationData = {
    rotaVaccineAllocated: '',
    rotaDropperAllocated: '',
    rotaVaccineRequested: '',
    rotaDropperRequested: '',
    rotaVaccineReturned: '',
    rotaDropperReturned: '',
    rotaVaccineReceived: '',
    rotaDropperReceived: '',
    rotaEmptyVials: '',
    rotaSafetyBoxes: '',
    rotaUnusedVials: '',
    rotaVaccineConveyorDelivered: '',
    rotaDropperConveyorDelivered: '',
    rotaVaccineConveyorReturned: '',
    rotaDropperConveyorReturned: '',
  };

  const [formData, setFormData] = useState<RotaAllocationData>(() => ({
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
    const excludedRotaFields = ['rotaEmptyVials', 'rotaSafetyBoxes', 'rotaUnusedVials'];

    // Handle Rota vaccine allocation - validate divisibility by 10 and auto-calculate droppers
    if (name === 'rotaVaccineAllocated' && !excludedRotaFields.includes(name)) {
      if (value !== '' && numValue % 10 !== 0) {
        // Invalid value - set error and clear droppers but keep the value
        setErrors((prev) => ({ ...prev, [name]: 'Quantity must be divisible by 10' }));
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          rotaDropperAllocated: '',
        }));
      } else if (numValue > 0 && numValue % 10 === 0) {
        // Valid value - clear error and auto-calculate droppers (1 dropper per vial of 10 doses)
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
        const vials = numValue / 10;
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          rotaDropperAllocated: vials.toString(),
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
          rotaDropperAllocated: '',
        }));
      }
    }
    // Handle Rota vaccine received - validate divisibility by 10 and auto-calculate droppers
    else if (name === 'rotaVaccineReceived' && !excludedRotaFields.includes(name)) {
      if (value !== '' && numValue % 10 !== 0) {
        // Invalid value - set error and clear droppers but keep the value
        setErrors((prev) => ({ ...prev, [name]: 'Quantity must be divisible by 10' }));
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          rotaDropperReceived: '',
        }));
      } else if (numValue > 0 && numValue % 10 === 0) {
        // Valid value - clear error and auto-calculate droppers
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
        const vials = numValue / 10;
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          rotaDropperReceived: vials.toString(),
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
          rotaDropperReceived: '',
        }));
      }
    }
    // For other Rota fields, just update normally
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
        Rota Allocation
      </Typography>

      <Accordion disabled={!isHealthFacilitySelected}>
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
                Rota Vaccine Requested by UHF
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Rota Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="rotaVaccineRequested"
                      value={formData.rotaVaccineRequested}
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
                    <Typography>Rota Dropper</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="rotaDropperRequested"
                      value={formData.rotaDropperRequested}
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
                Rota Vaccine Allocated by EHF
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Rota Vaccine</Typography>
                    <Tooltip title="Enter Rota vaccine quantity (10 doses per vial)" arrow placement="top">
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="rotaVaccineAllocated"
                        value={formData.rotaVaccineAllocated}
                        onChange={handleChange}
                        disabled={!canEditEHFAllocation}
                        required={canEditEHFAllocation}
                        type='number'
                        onKeyDown={preventInvalidKeys}
                      />
                    </Tooltip>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Rota Dropper</Typography>
                    <Tooltip title="Enter Rota dropper quantity" arrow placement="top">
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="rotaDropperAllocated"
                        value={formData.rotaDropperAllocated}
                        onChange={handleChange}
                        // disabled={true}
                        required={canEditEHFAllocation}
                        type='number'
                        onKeyDown={preventInvalidKeys}
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
                Rota Vaccine Delivered by Conveyor/3PL
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Rota Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="rotaVaccineConveyorDelivered"
                      value={formData.rotaVaccineConveyorDelivered}
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
                    <Typography>Rota Dropper</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="rotaDropperConveyorDelivered"
                      value={formData.rotaDropperConveyorDelivered}
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
                Rota Vaccine Returned by UHF
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Rota Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="rotaVaccineReturned"
                      value={formData.rotaVaccineReturned}
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
                    <Typography>Rota Dropper</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="rotaDropperReturned"
                      value={formData.rotaDropperReturned}
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
                Rota Vaccine Returned by Conveyor/3PL
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Rota Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="rotaVaccineConveyorReturned"
                      value={formData.rotaVaccineConveyorReturned}
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
                    <Typography>Rota Dropper</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="rotaDropperConveyorReturned"
                      value={formData.rotaDropperConveyorReturned}
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
                Rota Vaccine Received by EHF
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Rota Vaccine</Typography>
                    <Tooltip title="Enter Rota vaccine quantity received (10 doses per vial)" arrow placement="top">
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="rotaVaccineReceived"
                        value={formData.rotaVaccineReceived}
                        onChange={handleChange}
                        disabled={isView || !canEditEHFReceived}
                        required={canEditEHFReceived}
                        type='number'
                        onKeyDown={preventInvalidKeys}
                      />
                    </Tooltip>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Rota Dropper</Typography>
                    <Tooltip title="Enter Rota dropper quantity received" arrow placement="top">
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="rotaDropperReceived"
                        value={formData.rotaDropperReceived}
                        onChange={handleChange}
                        // disabled={true}
                        required={canEditEHFReceived}
                        type='number'
                        onKeyDown={preventInvalidKeys}
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
                      name="rotaEmptyVials"
                      value={formData.rotaEmptyVials}
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
                      name="rotaSafetyBoxes"
                      value={formData.rotaSafetyBoxes}
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
                      name="rotaUnusedVials"
                      value={formData.rotaUnusedVials}
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

export const RotaAllocation = React.memo(RotaAllocationComponent);