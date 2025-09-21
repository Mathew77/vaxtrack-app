import React, { useState, useEffect } from "react";
import {
  TextField,
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { BopvVaccineData } from "src/types/vaccines/bopv";
import { sectionBorderStyle } from "src/utils/constants";
import { preventInvalidKeys } from 'src/utils/preventInvalidkeys';

interface ExtendedBopvVaccineProps {
  initialData?: Partial<BopvVaccineData>;
  onDataChange: (data: BopvVaccineData) => void;
  hideTitle?: boolean;
  isView?: boolean;
  userRole?: string;
  vaccineStatus?: number;
}

export const BopvVaccine = ({
  initialData = {},
  onDataChange,
  hideTitle = false,
  isView = false,
  userRole = '',
  vaccineStatus = 0
}: ExtendedBopvVaccineProps): JSX.Element => {
  const defaultFormData: BopvVaccineData = {
    physicalStock: '',
    avgDailyConsumption: '',
    expiryDate: '',
    batchNo: '',
    vvm2: '',
    numberImmunized: '',
    daysOfStock: '',
    belowMinStock: '',
    aboveMaxStock: '',
    qtyReceived: '',
    dropperPhysicalStock: '',
    dropperMismatchOutcome: '',
    dropperMismatchAdjustedValue: '',
    lcsAntigenQuantitySent: '',
    lcsAntigenMismatchAdjusted: '',
    lcsDropperQuantitySent: '',
    lcsDropperMismatchAdjusted: '',
    
    slwgAntigenQuantitySent: '',
    slwgAntigenMismatchAdjusted: '',
    slwgDropperQuantitySent: '',
    slwgDropperMismatchAdjusted: '',
    
    scsAntigenQuantitySent: '',
    scsAntigenMismatchAdjusted: '',
    scsDropperQuantitySent: '',
    scsDropperMismatchAdjusted: '',
    
    threePlAntigenQuantitySent: '',
    threePlAntigenMismatchAdjusted: '',
    threePlDropperQuantitySent: '',
    threePlDropperMismatchAdjusted: '',
    
    ehfAntigenQuantityReceived: '',
    ehfAntigenMismatchOutcome: '',
    ehfDropperQuantityReceived: '',
    ehfDropperMismatchOutcome: '',
  };
  
  const [formData, setFormData] = useState<BopvVaccineData>(() => ({
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
  
  
  const isLcsUser = userRole === 'lcs';
  const isPendingForLcsApproval = vaccineStatus === 0; 
  const isLcsApproved = vaccineStatus >= 1; 
  const showLcsFields = isLcsUser && (isPendingForLcsApproval || isLcsApproved); 
  const isLcsFieldsEditable = isLcsUser && isPendingForLcsApproval; 
  
  const isSlwgUser = userRole === 'slwg';
  const isPendingForSlwgApproval = vaccineStatus === 1; 
  const showLcsDataForSlwg = isSlwgUser && vaccineStatus >= 1; 
  const isSlwgFieldsEditable = isSlwgUser && isPendingForSlwgApproval;
  
  
  const isScsUser = userRole === 'scs';
  const isPendingForScsApproval = vaccineStatus === 3; 
  const showSlwgDataForScs = isScsUser && vaccineStatus >= 3; 
  const isScsFieldsEditable = isScsUser && isPendingForScsApproval;
  
  
  const isThreePlUser = userRole === 'threepl';
  const isPendingForThreePlApproval = vaccineStatus === 5; 
  const showScsDataForThreePl = isThreePlUser && vaccineStatus >= 5; 
  const isThreePlFieldsEditable = isThreePlUser && isPendingForThreePlApproval;
  const showThreePlDataForCompleted = vaccineStatus >= 6; 
  
  
  const isEhfUser = userRole === 'ehf';
  const showThreePlDataForEhf = isEhfUser && vaccineStatus >= 6; 
  const isEhfFieldsEditable = isEhfUser && vaccineStatus >= 6 && vaccineStatus < 8; 
  const showEhfFields = isEhfUser && vaccineStatus >= 6; 

  
  const calculateMismatchOutcome = (antigenStock: string, dropperStock: string): string => {
    if (!antigenStock.trim() || !dropperStock.trim()) {
      return '';
    }
    const antigenValue = parseFloat(antigenStock) || 0;
    const dropperValue = parseFloat(dropperStock) || 0;
    if (antigenValue === 0 && dropperValue === 0) {
      return '';
    }
    if (dropperValue === antigenValue) {
      return 'none';
    } else if (dropperValue > antigenValue) {
      return 'excess';
    } else {
      return 'deficit';
    }
  };
  
  const calculateDropperMismatchAdjustedValue = (antigenStock: string, dropperStock: string): string => {
    if (!antigenStock.trim() || !dropperStock.trim()) {
      return '';
    }
    const antigenValue = parseFloat(antigenStock) || 0;
    const dropperValue = parseFloat(dropperStock) || 0;
    if (antigenValue === 0 && dropperValue === 0) {
      return '';
    }
    const adjustedValue = antigenValue - dropperValue;
    return adjustedValue.toString();
  };
  
  
  const calculateLcsAntigenMismatch = (lcsSentQuantity: string, dosesRequiredToMax: string): string => {
    if (!lcsSentQuantity.trim() || !dosesRequiredToMax.trim()) {
      return '';
    }
    const lcsSent = parseFloat(lcsSentQuantity) || 0;
    const dosesRequired = parseFloat(dosesRequiredToMax) || 0;
    if (lcsSent === 0 && dosesRequired === 0) {
      return '';
    }
    if (lcsSent === dosesRequired) {
      return 'none';
    } else if (lcsSent > dosesRequired) {
      return 'excess';
    } else {
      return 'deficient';
    }
  };
  
  const calculateLcsDropperMismatch = (lcsSentDropper: string, antigenStock: string): string => {
    if (!lcsSentDropper.trim() || !antigenStock.trim()) {
      return '';
    }
    const dropperSent = parseFloat(lcsSentDropper) || 0;
    const antigenAmount = parseFloat(antigenStock) || 0;
    if (dropperSent === 0 && antigenAmount === 0) {
      return '';
    }
    if (dropperSent === antigenAmount) {
      return 'none';
    } else if (dropperSent > antigenAmount) {
      return 'excess';
    } else {
      return 'deficient';
    }
  };
  
  
  const calculateSlwgAntigenMismatch = (slwgSentQuantity: string, lcsSentQuantity: string): string => {
    if (!slwgSentQuantity.trim() || !lcsSentQuantity.trim()) {
      return '';
    }
    const slwgSent = parseFloat(slwgSentQuantity) || 0;
    const lcsQuantity = parseFloat(lcsSentQuantity) || 0;
    if (slwgSent === 0 && lcsQuantity === 0) {
      return '';
    }
    if (slwgSent === lcsQuantity) {
      return 'none';
    } else if (slwgSent > lcsQuantity) {
      return 'excess';
    } else {
      return 'deficient';
    }
  };
  
  const calculateSlwgDropperMismatch = (slwgSentDropper: string, lcsSentDropper: string): string => {
    if (!slwgSentDropper.trim() || !lcsSentDropper.trim()) {
      return '';
    }
    const dropperSent = parseFloat(slwgSentDropper) || 0;
    const lcsQuantity = parseFloat(lcsSentDropper) || 0;
    if (dropperSent === 0 && lcsQuantity === 0) {
      return '';
    }
    if (dropperSent === lcsQuantity) {
      return 'none';
    } else if (dropperSent > lcsQuantity) {
      return 'excess';
    } else {
      return 'deficient';
    }
  };
  
  
  const calculateScsAntigenMismatch = (scsSentQuantity: string, slwgSentQuantity: string): string => {
    if (!scsSentQuantity.trim() || !slwgSentQuantity.trim()) {
      return '';
    }
    const scsSent = parseFloat(scsSentQuantity) || 0;
    const slwgQuantity = parseFloat(slwgSentQuantity) || 0;
    if (scsSent === 0 && slwgQuantity === 0) {
      return '';
    }
    if (scsSent === slwgQuantity) {
      return 'none';
    } else if (scsSent > slwgQuantity) {
      return 'excess';
    } else {
      return 'deficient';
    }
  };
  
  const calculateScsDropperMismatch = (scsSentDropper: string, slwgSentDropper: string): string => {
    if (!scsSentDropper.trim() || !slwgSentDropper.trim()) {
      return '';
    }
    const dropperSent = parseFloat(scsSentDropper) || 0;
    const slwgQuantity = parseFloat(slwgSentDropper) || 0;
    if (dropperSent === 0 && slwgQuantity === 0) {
      return '';
    }
    if (dropperSent === slwgQuantity) {
      return 'none';
    } else if (dropperSent > slwgQuantity) {
      return 'excess';
    } else {
      return 'deficient';
    }
  };
  
  
  const calculateThreePlAntigenMismatch = (threePlSentQuantity: string, scsSentQuantity: string): string => {
    if (!threePlSentQuantity.trim() || !scsSentQuantity.trim()) {
      return '';
    }
    const threePlSent = parseFloat(threePlSentQuantity) || 0;
    const scsQuantity = parseFloat(scsSentQuantity) || 0;
    if (threePlSent === 0 && scsQuantity === 0) {
      return '';
    }
    if (threePlSent === scsQuantity) {
      return 'none';
    } else if (threePlSent > scsQuantity) {
      return 'excess';
    } else {
      return 'deficient';
    }
  };
  
  const calculateThreePlDropperMismatch = (threePlSentDropper: string, scsSentDropper: string): string => {
    if (!threePlSentDropper.trim() || !scsSentDropper.trim()) {
      return '';
    }
    const dropperSent = parseFloat(threePlSentDropper) || 0;
    const scsQuantity = parseFloat(scsSentDropper) || 0;
    if (dropperSent === 0 && scsQuantity === 0) {
      return '';
    }
    if (dropperSent === scsQuantity) {
      return 'none';
    } else if (dropperSent > scsQuantity) {
      return 'excess';
    } else {
      return 'deficient';
    }
  };
  
  
  const calculateEhfAntigenMismatch = (ehfReceivedQuantity: string, threePlSentQuantity: string): string => {
    if (!ehfReceivedQuantity.trim() || !threePlSentQuantity.trim()) {
      return '';
    }
    const ehfReceived = parseFloat(ehfReceivedQuantity) || 0;
    const threePlSent = parseFloat(threePlSentQuantity) || 0;
    if (ehfReceived === 0 && threePlSent === 0) {
      return '';
    }
    if (ehfReceived === threePlSent) {
      return 'none';
    } else if (ehfReceived > threePlSent) {
      return 'excess';
    } else {
      return 'deficient';
    }
  };
  
  const calculateEhfDropperMismatch = (ehfReceivedDropper: string, threePlSentDropper: string): string => {
    if (!ehfReceivedDropper.trim() || !threePlSentDropper.trim()) {
      return '';
    }
    const dropperReceived = parseFloat(ehfReceivedDropper) || 0;
    const threePlSent = parseFloat(threePlSentDropper) || 0;
    if (dropperReceived === 0 && threePlSent === 0) {
      return '';
    }
    if (dropperReceived === threePlSent) {
      return 'none';
    } else if (dropperReceived > threePlSent) {
      return 'excess';
    } else {
      return 'deficient';
    }
  };
  
  
  const handleInputChange = (field: keyof BopvVaccineData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const value = event.target.value as string;
    setFormData((prev) => {
      const newFormData = { ...prev, [field]: value };
      
      if (field === 'physicalStock' || field === 'avgDailyConsumption') {
        const psb = parseFloat(field === 'physicalStock' ? value : newFormData.physicalStock) || 0;
        const adc = parseFloat(field === 'avgDailyConsumption' ? value : newFormData.avgDailyConsumption) || 0;
        if (adc > 0) {
          const daysOfStock = Math.floor(psb / adc);
          newFormData.daysOfStock = daysOfStock.toString();
          const dosesRequiredToMax = 70 - daysOfStock;
          newFormData.qtyReceived = dosesRequiredToMax.toString();
          newFormData.belowMinStock = daysOfStock < 60 ? 'yes' : 'no';
          newFormData.aboveMaxStock = daysOfStock > 70 ? 'yes' : 'no';
        } else {
          newFormData.daysOfStock = '';
          newFormData.belowMinStock = '';
          newFormData.aboveMaxStock = '';
        }
      }
      
      if (field === 'physicalStock' || field === 'dropperPhysicalStock') {
        const antigenStock = field === 'physicalStock' ? value : newFormData.physicalStock;
        const dropperStock = field === 'dropperPhysicalStock' ? value : newFormData.dropperPhysicalStock;
        newFormData.dropperMismatchOutcome = calculateMismatchOutcome(antigenStock, dropperStock);
        newFormData.dropperMismatchAdjustedValue = calculateDropperMismatchAdjustedValue(antigenStock, dropperStock);
      }
      
      
      if (field === 'lcsAntigenQuantitySent') {
        newFormData.lcsAntigenMismatchAdjusted = calculateLcsAntigenMismatch(value, newFormData.qtyReceived);
      }
      if (field === 'lcsDropperQuantitySent') {
        newFormData.lcsDropperMismatchAdjusted = calculateLcsDropperMismatch(value, newFormData.physicalStock);
      }
      
      
      if (field === 'slwgAntigenQuantitySent') {
        newFormData.slwgAntigenMismatchAdjusted = calculateSlwgAntigenMismatch(value, newFormData.lcsAntigenQuantitySent || '');
      }
      if (field === 'slwgDropperQuantitySent') {
        newFormData.slwgDropperMismatchAdjusted = calculateSlwgDropperMismatch(value, newFormData.lcsDropperQuantitySent || '');
      }
      
      
      if (field === 'scsAntigenQuantitySent') {
        newFormData.scsAntigenMismatchAdjusted = calculateScsAntigenMismatch(value, newFormData.slwgAntigenQuantitySent || '');
      }
      if (field === 'scsDropperQuantitySent') {
        newFormData.scsDropperMismatchAdjusted = calculateScsDropperMismatch(value, newFormData.slwgDropperQuantitySent || '');
      }
      
      
      if (field === 'threePlAntigenQuantitySent') {
        newFormData.threePlAntigenMismatchAdjusted = calculateThreePlAntigenMismatch(value, newFormData.scsAntigenQuantitySent || '');
      }
      if (field === 'threePlDropperQuantitySent') {
        newFormData.threePlDropperMismatchAdjusted = calculateThreePlDropperMismatch(value, newFormData.scsDropperQuantitySent || '');
      }
      
      
      if (field === 'ehfAntigenQuantityReceived') {
        newFormData.ehfAntigenMismatchOutcome = calculateEhfAntigenMismatch(value, newFormData.threePlAntigenQuantitySent || '');
      }
      if (field === 'ehfDropperQuantityReceived') {
        newFormData.ehfDropperMismatchOutcome = calculateEhfDropperMismatch(value, newFormData.threePlDropperQuantitySent || '');
      }
      
      onDataChange(newFormData); 
      return newFormData;
    });
  };
  
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {!hideTitle && (
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
          BOPV Vaccine
        </Typography>
      )}
      
      
      <Box sx={sectionBorderStyle}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>BOPV Antigen</Typography>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Physical Stock Balance</InputLabel>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Physical Stock Balance"
                value={formData.physicalStock}
                onChange={handleInputChange('physicalStock')}
                disabled={isView}
                type='number'
                onKeyDown={preventInvalidKeys}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Average Daily Consumption</InputLabel>
              <TextField
                fullWidth
                variant="outlined"
                value={formData.avgDailyConsumption}
                onChange={handleInputChange('avgDailyConsumption')}
                disabled={isView}
                type='number'
                onKeyDown={preventInvalidKeys}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Days of Stock</InputLabel>
              <TextField
                fullWidth
                variant="outlined"
                value={formData.daysOfStock}
                onChange={handleInputChange('daysOfStock')}
                disabled={true}
                type='number'
                onKeyDown={preventInvalidKeys}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Earliest Expiry Dates</InputLabel>
              <TextField
                fullWidth
                type="date"
                variant="outlined"
                value={formData.expiryDate}
                onChange={handleInputChange('expiryDate')}
                InputLabelProps={{ shrink: true }}
                disabled={isView}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Batch No for Earliest Expiry Dates</InputLabel>
              <TextField
                fullWidth
                variant="outlined"
                value={formData.batchNo}
                onChange={handleInputChange('batchNo')}
                disabled={isView}
                type='number'
                onKeyDown={preventInvalidKeys}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel htmlFor="vvm2">VVM Stage</InputLabel>
              <FormControl fullWidth>
                <Select
                  id="vvm2"
                  value={formData.vvm2}
                  onChange={handleInputChange('vvm2')}
                  inputProps={{ name: 'vvm2' }}
                  disabled={isView}
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="stage-1">Stage 1</MenuItem>
                  <MenuItem value="stage-2">Stage 2</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Number Immunized</InputLabel>
              <TextField
                fullWidth
                variant="outlined"
                value={formData.numberImmunized}
                onChange={handleInputChange('numberImmunized')}
                disabled={isView}
                type='number'
                onKeyDown={preventInvalidKeys}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel htmlFor="min-stock">Below Min Stock Level</InputLabel>
              <FormControl fullWidth>
                <Select
                  id="min-stock"
                  value={formData.belowMinStock}
                  onChange={handleInputChange('belowMinStock')}
                  inputProps={{ name: 'min-stock' }}
                  disabled={true}
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel htmlFor="max-stock">Above Max Stock Level</InputLabel>
              <FormControl fullWidth>
                <Select
                  id="max-stock"
                  value={formData.aboveMaxStock}
                  onChange={handleInputChange('aboveMaxStock')}
                  inputProps={{ name: 'max-stock' }}
                  disabled={true}
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Doses Required to Max</InputLabel>
              <TextField
                fullWidth
                variant="outlined"
                value={formData.qtyReceived}
                onChange={handleInputChange('qtyReceived')}
                disabled={true}
                type='number'
                onKeyDown={preventInvalidKeys}
              />
            </Box>
          </Grid>
          
          
          {showLcsFields && (
            <>
              <Grid item xs={12}>
                <Typography 
                  variant="subtitle1"
                  sx={{
                    color: '#1976D2',
                    marginTop: 3,
                  }}
                >
                  Approval Section By The Local Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by LCS</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Quantity Sent"
                    value={formData.lcsAntigenQuantitySent}
                    onChange={handleInputChange('lcsAntigenQuantitySent')}
                    disabled={!isLcsFieldsEditable}
                    type='number'
                    onKeyDown={preventInvalidKeys}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.lcsAntigenMismatchAdjusted}
                      onChange={handleInputChange('lcsAntigenMismatchAdjusted')}
                      disabled={true}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </>
          )}
          
          
          {showLcsDataForSlwg && (
            <>
              <Grid item xs={12}>
                <Typography 
                  variant="subtitle1"
                  sx={{
                    color: '#1976D2',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The Local Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by LCS</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsAntigenQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsAntigenMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
            </>
          )}
          
          
          {showLcsDataForSlwg && (
            <>
              <Grid item xs={12}>
                <Typography 
                  variant="subtitle1"
                  sx={{
                    color: '#FF9800',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Logistics Working Group
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by SLWG</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter quantity"
                    value={formData.slwgAntigenQuantitySent || ''}
                    onChange={handleInputChange('slwgAntigenQuantitySent')}
                    disabled={!isSlwgFieldsEditable}
                    type='number'
                    onKeyDown={preventInvalidKeys}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.slwgAntigenMismatchAdjusted || ''}
                      onChange={handleInputChange('slwgAntigenMismatchAdjusted')}
                      disabled={true}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </>
          )}
          
          
          {showSlwgDataForScs && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#1976D2',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The Local Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>LCS Quantity Sent</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsAntigenQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>LCS Mismatch Status</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsAntigenMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
            </>
          )}
          
          
          {showSlwgDataForScs && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#FF9800',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Logistics Working Group
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>SLWG Quantity Sent</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.slwgAntigenQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>SLWG Mismatch Status</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.slwgAntigenMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
            </>
          )}
          
          
          {showSlwgDataForScs && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#9C27B0',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by SCS</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter quantity"
                    value={formData.scsAntigenQuantitySent || ''}
                    onChange={handleInputChange('scsAntigenQuantitySent')}
                    disabled={!isScsFieldsEditable}
                    type='number'
                    onKeyDown={preventInvalidKeys}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.scsAntigenMismatchAdjusted || ''}
                      onChange={handleInputChange('scsAntigenMismatchAdjusted')}
                      disabled={true}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </>
          )}
          
          
          {showScsDataForThreePl && (
            <>
              <Grid item xs={12}>
                <Typography 
                  variant="subtitle1"
                  sx={{
                    color: '#1976D2',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The Local Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by LCS</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsAntigenQuantitySent || ''}
                    disabled={true}
                    type='number'
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.lcsAntigenMismatchAdjusted || ''}
                      disabled={true}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography 
                  variant="subtitle1"
                  sx={{
                    color: '#FF9800',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Logistics Working Group
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by SLWG</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.slwgAntigenQuantitySent || ''}
                    disabled={true}
                    type='number'
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.slwgAntigenMismatchAdjusted || ''}
                      disabled={true}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography 
                  variant="subtitle1"
                  sx={{
                    color: '#9C27B0',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by SCS</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.scsAntigenQuantitySent || ''}
                    disabled={true}
                    type='number'
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.scsAntigenMismatchAdjusted || ''}
                      disabled={true}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </>
          )}
          
          
          {isThreePlFieldsEditable && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#795548', 
                    marginTop: 2,
                  }}
                >
                  Approval Section By The Third Party Logistics
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by 3PL</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter quantity"
                    value={formData.threePlAntigenQuantitySent || ''}
                    onChange={handleInputChange('threePlAntigenQuantitySent')}
                    disabled={!isThreePlFieldsEditable}
                    type='number'
                    onKeyDown={preventInvalidKeys}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.threePlAntigenMismatchAdjusted || ''}
                      onChange={handleInputChange('threePlAntigenMismatchAdjusted')}
                      disabled={true}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </>
          )}
          
          
          {showThreePlDataForCompleted && isThreePlUser && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#795548',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The Third Party Logistics
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by 3PL</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.threePlAntigenQuantitySent || ''}
                    disabled={true}
                    type='number'
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.threePlAntigenMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
            </>
          )}
          
          
          {showThreePlDataForEhf && (
            <>
              
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#1976D2',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The Local Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>LCS Quantity Sent</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsAntigenQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>LCS Mismatch Status</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsAntigenMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>

              
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#FF9800',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Logistics Working Group
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>SLWG Quantity Sent</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.slwgAntigenQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>SLWG Mismatch Status</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.slwgAntigenMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>

              
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#9C27B0',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>SCS Quantity Sent</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.scsAntigenQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>SCS Mismatch Status</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.scsAntigenMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>

              
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#795548',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The Third Party Logistics
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>3PL Quantity Sent</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.threePlAntigenQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>3PL Mismatch Status</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.threePlAntigenMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
            </>
          )}
          
          
          {showEhfFields && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#FF5722',
                    marginTop: 2,
                  }}
                >
                  Vaccine Received by the Equipped Health Facility
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Received by EHF</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter quantity"
                    value={formData.ehfAntigenQuantityReceived || ''}
                    onChange={handleInputChange('ehfAntigenQuantityReceived')}
                    disabled={!isEhfFieldsEditable}
                    type='number'
                    onKeyDown={preventInvalidKeys}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.ehfAntigenMismatchOutcome || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
            </>
          )}
        </Grid>
      </Box>
      
      
      <Box sx={sectionBorderStyle}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>Dropper</Typography>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Physical Stock Balance</InputLabel>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Physical Stock Balance"
                value={formData.dropperPhysicalStock}
                onChange={handleInputChange('dropperPhysicalStock')}
                disabled={isView}
                type='number'
                onKeyDown={preventInvalidKeys}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel htmlFor="dropper-mis-match">Mismatch outcome</InputLabel>
              <FormControl fullWidth>
                <Select
                  id="dropper-mis-match"
                  value={formData.dropperMismatchOutcome}
                  onChange={handleInputChange('dropperMismatchOutcome')}
                  inputProps={{ name: 'dropper-mis-match' }}
                  disabled={true}
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="deficit">Deficit</MenuItem>
                  <MenuItem value="excess">Excess</MenuItem>
                  <MenuItem value="none">None</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Mismatch adjusted Value</InputLabel>
              <TextField
                fullWidth
                variant="outlined"
                value={formData.dropperMismatchAdjustedValue}
                onChange={handleInputChange('dropperMismatchAdjustedValue')}
                disabled={true}
                type='number'
                onKeyDown={preventInvalidKeys}
              />
            </Box>
          </Grid>
          
          
          {showLcsFields && (
            <>
              <Grid item xs={12}>
                <Typography 
                  variant="subtitle1"
                  sx={{
                    color: '#1976D2',
                    marginTop: 3,
                  }}
                >
                  Approval Section By The Local Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by LCS</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Quantity Sent"
                    value={formData.lcsDropperQuantitySent}
                    onChange={handleInputChange('lcsDropperQuantitySent')}
                    disabled={!isLcsFieldsEditable}
                    type='number'
                    onKeyDown={preventInvalidKeys}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.lcsDropperMismatchAdjusted}
                      onChange={handleInputChange('lcsDropperMismatchAdjusted')}
                      disabled={true}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </>
          )}
          
          
          {showLcsDataForSlwg && (
            <>
              <Grid item xs={12}>
                <Typography 
                  variant="subtitle1"
                  sx={{
                    color: '#1976D2',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The Local Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by LCS</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsDropperQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsDropperMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
            </>
          )}
          
          
          {showLcsDataForSlwg && (
            <>
              <Grid item xs={12}>
                <Typography 
                  variant="subtitle1"
                  sx={{
                    color: '#FF9800',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Logistics Working Group
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by SLWG</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter quantity"
                    value={formData.slwgDropperQuantitySent || ''}
                    onChange={handleInputChange('slwgDropperQuantitySent')}
                    disabled={!isSlwgFieldsEditable}
                    type='number'
                    onKeyDown={preventInvalidKeys}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.slwgDropperMismatchAdjusted || ''}
                      onChange={handleInputChange('slwgDropperMismatchAdjusted')}
                      disabled={true}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </>
          )}
          
          
          {showSlwgDataForScs && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#1976D2',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The Local Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>LCS Quantity Sent</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsDropperQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>LCS Mismatch Status</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsDropperMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
            </>
          )}
          
          
          {showSlwgDataForScs && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#FF9800',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Logistics Working Group
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>SLWG Quantity Sent</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.slwgDropperQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>SLWG Mismatch Status</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.slwgDropperMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
            </>
          )}
          
          
          {showSlwgDataForScs && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#9C27B0',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by SCS</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter quantity"
                    value={formData.scsDropperQuantitySent || ''}
                    onChange={handleInputChange('scsDropperQuantitySent')}
                    disabled={!isScsFieldsEditable}
                    type='number'
                    onKeyDown={preventInvalidKeys}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.scsDropperMismatchAdjusted || ''}
                      onChange={handleInputChange('scsDropperMismatchAdjusted')}
                      disabled={true}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </>
          )}
          
          
          {showScsDataForThreePl && (
            <>
              <Grid item xs={12}>
                <Typography 
                  variant="subtitle1"
                  sx={{
                    color: '#1976D2',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The Local Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by LCS</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsDropperQuantitySent || ''}
                    disabled={true}
                    type='number'
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.lcsDropperMismatchAdjusted || ''}
                      disabled={true}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography 
                  variant="subtitle1"
                  sx={{
                    color: '#FF9800',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Logistics Working Group
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by SLWG</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.slwgDropperQuantitySent || ''}
                    disabled={true}
                    type='number'
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.slwgDropperMismatchAdjusted || ''}
                      disabled={true}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography 
                  variant="subtitle1"
                  sx={{
                    color: '#9C27B0',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by SCS</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.scsDropperQuantitySent || ''}
                    disabled={true}
                    type='number'
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.scsDropperMismatchAdjusted || ''}
                      disabled={true}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </>
          )}
          
          
          {isThreePlFieldsEditable && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#795548',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The Third Party Logistics
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by 3PL</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter quantity"
                    value={formData.threePlDropperQuantitySent || ''}
                    onChange={handleInputChange('threePlDropperQuantitySent')}
                    disabled={!isThreePlFieldsEditable}
                    type='number'
                    onKeyDown={preventInvalidKeys}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={formData.threePlDropperMismatchAdjusted || ''}
                      onChange={handleInputChange('threePlDropperMismatchAdjusted')}
                      disabled={true}
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                      <MenuItem value="excess">Excess</MenuItem>
                      <MenuItem value="deficient">Deficient</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </>
          )}
          
          
          {showThreePlDataForCompleted && isThreePlUser && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#795548',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The Third Party Logistics
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Sent by 3PL</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.threePlDropperQuantitySent || ''}
                    disabled={true}
                    type='number'
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.threePlDropperMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
            </>
          )}
          
          
          {showThreePlDataForEhf && (
            <>
              
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#1976D2',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The Local Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>LCS Quantity Sent</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsDropperQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>LCS Mismatch Status</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.lcsDropperMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>

              
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#FF9800',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Logistics Working Group
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>SLWG Quantity Sent</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.slwgDropperQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>SLWG Mismatch Status</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.slwgDropperMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>

              
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#9C27B0',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The State Cold Chain Store
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>SCS Quantity Sent</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.scsDropperQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>SCS Mismatch Status</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.scsDropperMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>

              
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#795548',
                    marginTop: 2,
                  }}
                >
                  Approval Section By The Third Party Logistics
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>3PL Quantity Sent</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.threePlDropperQuantitySent || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>3PL Mismatch Status</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.threePlDropperMismatchAdjusted || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
            </>
          )}
          
          
          {showEhfFields && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#FF5722',
                    marginTop: 2,
                  }}
                >
                  Vaccine Received by the Equipped Health Facility
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Quantity Received by EHF</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter quantity"
                    value={formData.ehfDropperQuantityReceived || ''}
                    onChange={handleInputChange('ehfDropperQuantityReceived')}
                    disabled={!isEhfFieldsEditable}
                    type='number'
                    onKeyDown={preventInvalidKeys}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <InputLabel>Mismatch Outcome</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={formData.ehfDropperMismatchOutcome || ''}
                    disabled={true}
                  />
                </Box>
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </Box>
  );
};