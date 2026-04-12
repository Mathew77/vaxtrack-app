import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, TextField, Typography, Grid, Tooltip } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { HepBAllocationData } from 'src/types/allocations/hepb';
import { preventInvalidKeys } from 'src/utils/preventInvalidkeys';

interface ExtendedHepBAllocationProps {
  initialData?: Partial<HepBAllocationData>;
  onDataChange: (data: HepBAllocationData) => void;
  status?: number;
  key?: string;
  isView: boolean;
  isUpdate: boolean;
  isHealthFacilitySelected?: boolean;
}

const HepBAllocationComponent = ({
  initialData = {},
  onDataChange,
  status = 1,
  isView = false,
  isUpdate = false,
  isHealthFacilitySelected = true,
}: ExtendedHepBAllocationProps): JSX.Element => {
  const defaultFormData: HepBAllocationData = {
    hepBVaccineAllocated: '',
    hepB05mlSyringeAllocated: '',
    hepBVaccineRequested: '',
    hepB05mlSyringeRequested: '',
    hepBVaccineReturned: '',
    hepB05mlSyringeReturned: '',
    hepBVaccineReceived: '',
    hepB05mlSyringeReceived: '',
    hepBEmptyVials: '',
    hepBSafetyBoxes: '',
    hepBUnusedVials: '',
    hepBVaccineConveyorDelivered: '',
    hepB05mlSyringeConveyorDelivered: '',
    hepBVaccineConveyorReturned: '',
    hepB05mlSyringeConveyorReturned: '',
  };

  const [formData, setFormData] = useState<HepBAllocationData>(() => ({
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
    const excludedHepBFields = ['hepBEmptyVials', 'hepBSafetyBoxes', 'hepBUnusedVials'];

    // Handle HepB vaccine allocation - validate divisibility by 10 and auto-calculate syringes
    if (name === 'hepBVaccineAllocated' && !excludedHepBFields.includes(name)) {
      if (value !== '' && numValue % 10 !== 0) {
        // Invalid value - set error and clear syringes but keep the value
        setErrors((prev) => ({ ...prev, [name]: 'Quantity must be divisible by 10' }));
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          hepB05mlSyringeAllocated: '',
        }));
      } else if (numValue > 0 && numValue % 10 === 0) {
        // Valid value - clear error and auto-calculate syringes
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          hepB05mlSyringeAllocated: numValue.toString(),
        }));
      } else {
        // Empty or zero - clear error and syringes
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          hepB05mlSyringeAllocated: '',
        }));
      }
    }
    // Handle HepB vaccine received - validate divisibility by 10 and auto-calculate syringes
    else if (name === 'hepBVaccineReceived' && !excludedHepBFields.includes(name)) {
      if (value !== '' && numValue % 10 !== 0) {
        // Invalid value - set error and clear syringes but keep the value
        setErrors((prev) => ({ ...prev, [name]: 'Quantity must be divisible by 10' }));
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          hepB05mlSyringeReceived: '',
        }));
      } else if (numValue > 0 && numValue % 10 === 0) {
        // Valid value - clear error and auto-calculate syringes
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          hepB05mlSyringeReceived: numValue.toString(),
        }));
      } else {
        // Empty or zero - clear error and syringes
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          hepB05mlSyringeReceived: '',
        }));
      }
    }
    // For other HepB fields, just update normally
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
        HepB Allocation
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
                HepB Vaccine Requested by UHF
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>HepB Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="hepBVaccineRequested"
                      value={formData.hepBVaccineRequested}
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
                    <Typography>HepB 0.5ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="hepB05mlSyringeRequested"
                      value={formData.hepB05mlSyringeRequested}
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
                HepB Vaccine Allocated by EHF
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>HepB Vaccine</Typography>
                    <Tooltip title="Enter HepB vaccine quantity (10 doses per vial)" arrow placement="top">
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="hepBVaccineAllocated"
                        value={formData.hepBVaccineAllocated}
                        onChange={handleChange}
                        disabled={!canEditEHFAllocation}
                        required={canEditEHFAllocation}
                        type='number'
                        onKeyDown={preventInvalidKeys}
                        error={!!errors.hepBVaccineAllocated}
                        helperText={errors.hepBVaccineAllocated}
                        inputProps={{ min: 0 }}
                      />
                    </Tooltip>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>HepB 0.5ml Syringe</Typography>
                    <Tooltip title="Enter HepB 0.5ml syringe quantity" arrow placement="top">
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="hepB05mlSyringeAllocated"
                        value={formData.hepB05mlSyringeAllocated}
                        onChange={handleChange}
                        // disabled={true}
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
                HepB Vaccine Delivered by Conveyor/3PL
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>HepB Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="hepBVaccineConveyorDelivered"
                      value={formData.hepBVaccineConveyorDelivered}
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
                    <Typography>HepB 0.5ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="hepB05mlSyringeConveyorDelivered"
                      value={formData.hepB05mlSyringeConveyorDelivered}
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
                HepB Vaccine Returned by UHF
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>HepB Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="hepBVaccineReturned"
                      value={formData.hepBVaccineReturned}
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
                    <Typography>HepB 0.5ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="hepB05mlSyringeReturned"
                      value={formData.hepB05mlSyringeReturned}
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
                HepB Vaccine Returned by Conveyor/3PL
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>HepB Vaccine</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="hepBVaccineConveyorReturned"
                      value={formData.hepBVaccineConveyorReturned}
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
                    <Typography>HepB 0.5ml Syringe</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="hepB05mlSyringeConveyorReturned"
                      value={formData.hepB05mlSyringeConveyorReturned}
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
                HepB Vaccine Received by EHF
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography>HepB Vaccine</Typography>
                    <Tooltip title="Enter HepB vaccine quantity received (10 doses per vial)" arrow placement="top">
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="hepBVaccineReceived"
                        value={formData.hepBVaccineReceived}
                        onChange={handleChange}
                        disabled={isView || !canEditEHFReceived}
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
                    <Typography>HepB 0.5ml Syringe</Typography>
                    <Tooltip title="Enter HepB 0.5ml syringe quantity received" arrow placement="top">
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="hepB05mlSyringeReceived"
                        value={formData.hepB05mlSyringeReceived}
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
                      name="hepBEmptyVials"
                      value={formData.hepBEmptyVials}
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
                      name="hepBSafetyBoxes"
                      value={formData.hepBSafetyBoxes}
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
                      name="hepBUnusedVials"
                      value={formData.hepBUnusedVials}
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

export const HepBAllocation = React.memo(HepBAllocationComponent);