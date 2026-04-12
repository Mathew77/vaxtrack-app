import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, TextField, Typography, Grid, Tooltip } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { YfAllocationData } from 'src/types/allocations/yf';
import { preventInvalidKeys } from 'src/utils/preventInvalidkeys';

interface ExtendedYfAllocationProps {
  initialData?: Partial<YfAllocationData>;
  onDataChange: (data: YfAllocationData) => void;
  status?: number;
  key?: string;
  isView: boolean;
  isUpdate: boolean;
  isHealthFacilitySelected?: boolean;
}

const YfAllocationComponent = ({
  initialData = {},
  onDataChange,
  status = 1,
  isView = false,
  isUpdate = false,
  isHealthFacilitySelected = true,
}: ExtendedYfAllocationProps): JSX.Element => {
  const defaultFormData: YfAllocationData = {
    yfVaccineAllocated: '',
    yfDiluentAllocated: '',
    yf05mlSyringeAllocated: '',
    yf5mlSyringeAllocated: '',
    yfVaccineRequested: '',
    yfDiluentRequested: '',
    yf05mlSyringeRequested: '',
    yf5mlSyringeRequested: '',
    yfVaccineReturned: '',
    yfDiluentReturned: '',
    yf05mlSyringeReturned: '',
    yf5mlSyringeReturned: '',
    yfVaccineReceived: '',
    yfDiluentReceived: '',
    yf05mlSyringeReceived: '',
    yf5mlSyringeReceived: '',
    yfEmptyVials: '',
    yfSafetyBoxes: '',
    yfUnusedVials: '',
    yfVaccineConveyorDelivered: '',
    yfDiluentConveyorDelivered: '',
    yf05mlSyringeConveyorDelivered: '',
    yf5mlSyringeConveyorDelivered: '',
    yfVaccineConveyorReturned: '',
    yfDiluentConveyorReturned: '',
    yf05mlSyringeConveyorReturned: '',
    yf5mlSyringeConveyorReturned: '',
  };

  const [formData, setFormData] = useState<YfAllocationData>(() => ({
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
    const excludedYfFields = ['yfEmptyVials', 'yfSafetyBoxes', 'yfUnusedVials'];

    // Handle YF vaccine allocation - validate divisibility by 10 and auto-calculate consumables
    if (name === 'yfVaccineAllocated' && !excludedYfFields.includes(name)) {
      if (value !== '' && numValue % 10 !== 0) {
        // Invalid value - set error and clear consumables but keep the value
        setErrors((prev) => ({ ...prev, [name]: 'Quantity must be divisible by 10' }));
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          yfDiluentAllocated: '',
          yf5mlSyringeAllocated: '',
          yf05mlSyringeAllocated: '',
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
          yfDiluentAllocated: vials.toString(),
          yf5mlSyringeAllocated: vials.toString(),
          yf05mlSyringeAllocated: numValue.toString(),
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
          yfDiluentAllocated: '',
          yf5mlSyringeAllocated: '',
          yf05mlSyringeAllocated: '',
        }));
      }
    }
    // Handle YF vaccine received - validate divisibility by 10 and auto-calculate consumables
    else if (name === 'yfVaccineReceived' && !excludedYfFields.includes(name)) {
      if (value !== '' && numValue % 10 !== 0) {
        // Invalid value - set error and clear consumables but keep the value
        setErrors((prev) => ({ ...prev, [name]: 'Quantity must be divisible by 10' }));
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          yfDiluentReceived: '',
          yf5mlSyringeReceived: '',
          yf05mlSyringeReceived: '',
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
          yfDiluentReceived: vials.toString(),
          yf5mlSyringeReceived: vials.toString(),
          yf05mlSyringeReceived: numValue.toString(),
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
          yfDiluentReceived: '',
          yf5mlSyringeReceived: '',
          yf05mlSyringeReceived: '',
        }));
      }
    }
    // For other YF fields, just update normally
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
        YF Allocation
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
                YF Vaccine Requested by UHF
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>YF Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="yfVaccineRequested"
                      value={formData.yfVaccineRequested}
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
                    <Typography>YF Diluent</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="yfDiluentRequested"
                      value={formData.yfDiluentRequested}
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
                    <Typography>YF 0.5ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="yf05mlSyringeRequested"
                      value={formData.yf05mlSyringeRequested}
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
                    <Typography>YF 5ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="yf5mlSyringeRequested"
                      value={formData.yf5mlSyringeRequested}
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
                YF Vaccine Allocated by EHF
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>YF Vaccine</Typography>
                    <Tooltip title="Enter YF vaccine quantity (10 doses per vial)" arrow placement="top">
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="yfVaccineAllocated"
                        value={formData.yfVaccineAllocated}
                        onChange={handleChange}
                        disabled={!canEditEHFAllocation}
                        required={canEditEHFAllocation}
                        type='number'
                        onKeyDown={preventInvalidKeys}
                        error={!!errors.yfVaccineAllocated}
                        helperText={errors.yfVaccineAllocated}
                        inputProps={{ max: 10, min: 0 }}
                      />
                    </Tooltip>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>YF Diluent</Typography>
                    <Tooltip title="Enter YF diluent quantity" arrow placement="top">
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="yfDiluentAllocated"
                        value={formData.yfDiluentAllocated}
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
                    <Typography>YF 0.5ml Syringe</Typography>
                    <Tooltip title="Enter YF 0.5ml syringe quantity" arrow placement="top">
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="yf05mlSyringeAllocated"
                        value={formData.yf05mlSyringeAllocated}
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
                    <Typography>YF 5ml Syringe</Typography>
                    <Tooltip title="Enter YF 5ml syringe quantity" arrow placement="top">
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="yf5mlSyringeAllocated"
                        value={formData.yf5mlSyringeAllocated}
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
                YF Vaccine Delivered by Conveyor/3PL
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>YF Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="yfVaccineConveyorDelivered"
                      value={formData.yfVaccineConveyorDelivered}
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
                    <Typography>YF Diluent</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="yfDiluentConveyorDelivered"
                      value={formData.yfDiluentConveyorDelivered}
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
                    <Typography>YF 0.5ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="yf05mlSyringeConveyorDelivered"
                      value={formData.yf05mlSyringeConveyorDelivered}
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
                    <Typography>YF 5ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="yf5mlSyringeConveyorDelivered"
                      value={formData.yf5mlSyringeConveyorDelivered}
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
                YF Vaccine Returned by UHF
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>YF Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="yfVaccineReturned"
                      value={formData.yfVaccineReturned}
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
                    <Typography>YF Diluent</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="yfDiluentReturned"
                      value={formData.yfDiluentReturned}
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
                    <Typography>YF 0.5ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="yf05mlSyringeReturned"
                      value={formData.yf05mlSyringeReturned}
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
                    <Typography>YF 5ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="yf5mlSyringeReturned"
                      value={formData.yf5mlSyringeReturned}
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
                YF Vaccine Returned by Conveyor/3PL
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>YF Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="yfVaccineConveyorReturned"
                      value={formData.yfVaccineConveyorReturned}
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
                    <Typography>YF Diluent</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="yfDiluentConveyorReturned"
                      value={formData.yfDiluentConveyorReturned}
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
                    <Typography>YF 0.5ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="yf05mlSyringeConveyorReturned"
                      value={formData.yf05mlSyringeConveyorReturned}
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
                    <Typography>YF 5ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="yf5mlSyringeConveyorReturned"
                      value={formData.yf5mlSyringeConveyorReturned}
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
                YF Vaccine Received by EHF
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>YF Vaccine</Typography>
                    <Tooltip title="Enter YF vaccine quantity received (10 doses per vial)" arrow placement="top">
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="yfVaccineReceived"
                        value={formData.yfVaccineReceived}
                        onChange={handleChange}
                        disabled={isView || !canEditEHFReceived}
                        required={canEditEHFReceived}
                        type='number'
                        onKeyDown={preventInvalidKeys}
                        error={!!errors.yfVaccineReceived}
                        helperText={errors.yfVaccineReceived}
                        inputProps={{ max: 10, min: 0 }}
                      />
                    </Tooltip>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>YF Diluent</Typography>
                    <Tooltip title="Enter YF diluent quantity received" arrow placement="top">
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="yfDiluentReceived"
                        value={formData.yfDiluentReceived}
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
                    <Typography>YF 0.5ml Syringe</Typography>
                    <Tooltip title="Enter YF 0.5ml syringe quantity received" arrow placement="top">
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="yf05mlSyringeReceived"
                        value={formData.yf05mlSyringeReceived}
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
                    <Typography>YF 5ml Syringe</Typography>
                    <Tooltip title="Enter YF 5ml syringe quantity received" arrow placement="top">
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="yf5mlSyringeReceived"
                        value={formData.yf5mlSyringeReceived}
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
                      name="yfEmptyVials"
                      value={formData.yfEmptyVials}
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
                      name="yfSafetyBoxes"
                      value={formData.yfSafetyBoxes}
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
                      name="yfUnusedVials"
                      value={formData.yfUnusedVials}
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

export const YfAllocation = React.memo(YfAllocationComponent);