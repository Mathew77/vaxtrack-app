import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, TextField, Typography, Grid, Tooltip } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MeaslesAllocationData } from 'src/types/allocations/measles';
import { preventInvalidKeys } from 'src/utils/preventInvalidkeys';

interface ExtendedMeaslesAllocationProps {
  initialData?: Partial<MeaslesAllocationData>;
  onDataChange: (data: MeaslesAllocationData) => void;
  status?: number;
  key?: string;
  isView?: boolean;
  isUpdate?: boolean;
  isHealthFacilitySelected?: boolean;
}

const MeaslesAllocationComponent = ({
  initialData = {},
  onDataChange,
  status = 1,
  isView = false,
  isUpdate = false,
  isHealthFacilitySelected = true,
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
    measlesEmptyVials: '',
    measlesSafetyBoxes: '',
    measlesUnusedVials: '',
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
    const excludedMeaslesFields = ['measlesEmptyVials', 'measlesSafetyBoxes', 'measlesUnusedVials'];

    if (name === 'measlesVaccineAllocated' && !excludedMeaslesFields.includes(name)) {
      if (value !== '' && numValue % 10 !== 0) {
        // Invalid value - set error and clear consumables but keep the value
        setErrors((prev) => ({ ...prev, [name]: 'Quantity must be divisible by 10' }));
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          measlesDiluentAllocated: '',
          measles2mlSyringeAllocated: '',
          measles05mlSyringeAllocated: '',
        }));
      } else if (numValue > 0 && numValue % 10 === 0) {
        // Valid value - clear error and auto-calculate consumables
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
        const vials = numValue / 10;
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          measlesDiluentAllocated: vials.toString(),
          measles2mlSyringeAllocated: vials.toString(),
          measles05mlSyringeAllocated: numValue.toString(),
        }));
      } else {
        // Empty or zero - clear error and consumables
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          measlesDiluentAllocated: '',
          measles2mlSyringeAllocated: '',
          measles05mlSyringeAllocated: '',
        }));
      }
    }
    // Handle Measles vaccine received - validate divisibility by 10 and auto-calculate consumables
    else if (name === 'measlesVaccineReceived' && !excludedMeaslesFields.includes(name)) {
      if (value !== '' && numValue % 10 !== 0) {
        // Invalid value - set error and clear consumables but keep the value
        setErrors((prev) => ({ ...prev, [name]: 'Quantity must be divisible by 10' }));
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          measlesDiluentReceived: '',
          measles2mlSyringeReceived: '',
          measles05mlSyringeReceived: '',
        }));
      } else if (numValue > 0 && numValue % 10 === 0) {
        // Valid value - clear error and auto-calculate consumables
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
        const vials = numValue / 10;
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          measlesDiluentReceived: vials.toString(),
          measles2mlSyringeReceived: vials.toString(),
          measles05mlSyringeReceived: numValue.toString(),
        }));
      } else {
        // Empty or zero - clear error and consumables
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          measlesDiluentReceived: '',
          measles2mlSyringeReceived: '',
          measles05mlSyringeReceived: '',
        }));
      }
    }
    // For other Measles fields, just update normally
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
        Measles & Rubella Allocation
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
                Measles & Rubella Vaccine Requested by UHF
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Measles & Rubella Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="measlesVaccineRequested"
                      value={formData.measlesVaccineRequested}
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
                    <Typography>Measles & Rubella Diluent</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="measlesDiluentRequested"
                      value={formData.measlesDiluentRequested}
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
                    <Typography>Measles & Rubella 0.5ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="measles05mlSyringeRequested"
                      value={formData.measles05mlSyringeRequested}
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
                    <Typography>Measles & Rubella 2ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="measles2mlSyringeRequested"
                      value={formData.measles2mlSyringeRequested}
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
                Measles & Rubella Vaccine Allocated by EHF
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Measles & Rubella Vaccine</Typography>
                    <Tooltip title="Enter Measles & Rubella vaccine quantity (10 doses per vial)" arrow placement="top">
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="measlesVaccineAllocated"
                        value={formData.measlesVaccineAllocated}
                        onChange={handleChange}
                        disabled={isView || !canEditEHFAllocation}
                        required={canEditEHFAllocation}
                        type='number'
                        onKeyDown={preventInvalidKeys}
                        error={!!errors.measlesVaccineAllocated}
                        helperText={errors.measlesVaccineAllocated}
                        inputProps={{ max: 10, min: 0 }}
                      />
                    </Tooltip>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Measles & Rubella Diluent</Typography>
                    <Tooltip title="Enter Measles & Rubella diluent quantity" arrow placement="top">
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="measlesDiluentAllocated"
                        value={formData.measlesDiluentAllocated}
                        onChange={handleChange}
                        // disabled={true}
                        required={canEditEHFAllocation}
                        type='number'
                        onKeyDown={preventInvalidKeys}
                        inputProps={{ max: 10, min: 0 }}
                      />
                    </Tooltip>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Measles & Rubella 0.5ml Syringe</Typography>
                    <Tooltip title="Enter Measles & Rubella 0.5ml syringe quantity" arrow placement="top">
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="measles05mlSyringeAllocated"
                        value={formData.measles05mlSyringeAllocated}
                        onChange={handleChange}
                        // disabled={true}
                        required={canEditEHFAllocation}
                        type='number'
                        onKeyDown={preventInvalidKeys}
                        inputProps={{ max: 10, min: 0 }}
                      />
                    </Tooltip>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Measles & Rubella 2ml Syringe</Typography>
                    <Tooltip title="Enter Measles & Rubella 2ml syringe quantity" arrow placement="top">
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="measles2mlSyringeAllocated"
                        value={formData.measles2mlSyringeAllocated}
                        onChange={handleChange}
                        // disabled={true}
                        required={canEditEHFAllocation}
                        type='number'
                        onKeyDown={preventInvalidKeys}
                        inputProps={{ max: 10, min: 0 }}
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
                Measles & Rubella Vaccine Delivered by Conveyor/3PL
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Measles & Rubella Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="measlesVaccineConveyorDelivered"
                      value={formData.measlesVaccineConveyorDelivered}
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
                    <Typography>Measles & Rubella Diluent</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="measlesDiluentConveyorDelivered"
                      value={formData.measlesDiluentConveyorDelivered}
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
                    <Typography>Measles & Rubella 0.5ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="measles05mlSyringeConveyorDelivered"
                      value={formData.measles05mlSyringeConveyorDelivered}
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
                    <Typography>Measles & Rubella 2ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="measles2mlSyringeConveyorDelivered"
                      value={formData.measles2mlSyringeConveyorDelivered}
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
                Measles & Rubella Vaccine Returned by UHF
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Measles & Rubella Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="measlesVaccineReturned"
                      value={formData.measlesVaccineReturned}
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
                    <Typography>Measles & Rubella Diluent</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="measlesDiluentReturned"
                      value={formData.measlesDiluentReturned}
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
                    <Typography>Measles & Rubella 0.5ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="measles05mlSyringeReturned"
                      value={formData.measles05mlSyringeReturned}
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
                    <Typography>Measles & Rubella 2ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="measles2mlSyringeReturned"
                      value={formData.measles2mlSyringeReturned}
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
                Measles & Rubella Vaccine Returned by Conveyor/3PL
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Measles & Rubella Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="measlesVaccineConveyorReturned"
                      value={formData.measlesVaccineConveyorReturned}
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
                    <Typography>Measles & Rubella Diluent</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="measlesDiluentConveyorReturned"
                      value={formData.measlesDiluentConveyorReturned}
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
                    <Typography>Measles & Rubella 0.5ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="measles05mlSyringeConveyorReturned"
                      value={formData.measles05mlSyringeConveyorReturned}
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
                    <Typography>Measles & Rubella 2ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="measles2mlSyringeConveyorReturned"
                      value={formData.measles2mlSyringeConveyorReturned}
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
                Measles & Rubella Vaccine Received by EHF
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Measles & Rubella Vaccine</Typography>
                    <Tooltip title="Enter Measles & Rubella vaccine quantity received (10 doses per vial)" arrow placement="top">
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="measlesVaccineReceived"
                        value={formData.measlesVaccineReceived}
                        onChange={handleChange}
                        disabled={isView || !canEditEHFReceived}
                        required={canEditEHFReceived}
                        type='number'
                        onKeyDown={preventInvalidKeys}
                        error={!!errors.measlesVaccineReceived}
                        helperText={errors.measlesVaccineReceived}
                        inputProps={{ max: 10, min: 0 }}
                      />
                    </Tooltip>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Measles & Rubella Diluent</Typography>
                    <Tooltip title="Enter Measles & Rubella diluent quantity received" arrow placement="top">
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="measlesDiluentReceived"
                        value={formData.measlesDiluentReceived}
                        onChange={handleChange}
                        // disabled={true}
                        required={canEditEHFReceived}
                        type='number'
                        onKeyDown={preventInvalidKeys}
                        inputProps={{ max: 10, min: 0 }}
                      />
                    </Tooltip>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Measles & Rubella 0.5ml Syringe</Typography>
                    <Tooltip title="Enter Measles & Rubella 0.5ml syringe quantity received" arrow placement="top">
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="measles05mlSyringeReceived"
                        value={formData.measles05mlSyringeReceived}
                        onChange={handleChange}
                        // disabled={true}
                        required={canEditEHFReceived}
                        type='number'
                        onKeyDown={preventInvalidKeys}
                        inputProps={{ max: 10, min: 0 }}
                      />
                    </Tooltip>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>Measles & Rubella 2ml Syringe</Typography>
                    <Tooltip title="Enter Measles & Rubella 2ml syringe quantity received" arrow placement="top">
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="measles2mlSyringeReceived"
                        value={formData.measles2mlSyringeReceived}
                        onChange={handleChange}
                        // disabled={true}
                        required={canEditEHFReceived}
                        type='number'
                        onKeyDown={preventInvalidKeys}
                        inputProps={{ max: 10, min: 0 }}
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
                      name="measlesEmptyVials"
                      value={formData.measlesEmptyVials}
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
                      name="measlesSafetyBoxes"
                      value={formData.measlesSafetyBoxes}
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
                      name="measlesUnusedVials"
                      value={formData.measlesUnusedVials}
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

export const MeaslesAllocation = React.memo(MeaslesAllocationComponent);