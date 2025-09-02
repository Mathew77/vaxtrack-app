import React, { useEffect, useState } from 'react';
import {
  TextField,
  FormControl,
  Grid,
  Button,
  Typography,
  Box,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { YFVaccineData } from 'src/types/vaccines/yf';
import { sectionBorderStyle } from 'src/utils/constants';
import { preventInvalidKeys } from 'src/utils/preventInvalidkeys';

interface ExtendedYFVaccineProps {
  initialData?: Partial<YFVaccineData>;
  onDataChange: (data: YFVaccineData) => void;
  hideTitle?: boolean;
  isView: boolean;
}

export const YfVaccine = ({
  initialData = {},
  onDataChange,
  hideTitle,
  isView = false
}: ExtendedYFVaccineProps): JSX.Element => {
  const defaultFormData: YFVaccineData = {
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
    // closingBalance: '',
    // postLmdDos: '',
    diluentPhysicalStock: '',
    diluentMismatchOutcome: '',
    diluentMismatchAdjustedValue: '',
    fiveMlSyringePhysicalStock: '',
    fiveMlSyringeMismatchOutcome: '',
    fiveMlSyringeMismatchAdjustedValue: '',
    halfMlSyringePhysicalStock: '',
    halfMlSyringeMismatchOutcome: '',
    halfMlSyringeMismatchAdjustedValue: '',
  };

   const [formData, setFormData] = useState<YFVaccineData>(() => ({
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

    const calculateMismatchOutcome = (antigenStock: string, diluentStock: string): string => {
  
    if (!antigenStock.trim() || !diluentStock.trim()) {
        return '';
      }

      const antigenValue = parseFloat(antigenStock) || 0;
      const diluentValue = parseFloat(diluentStock) || 0;

      if (antigenValue === 0 && diluentValue === 0) {
        return '';
      }

      if (diluentValue === antigenValue) {
        return 'none'; 
      } else if (diluentValue > antigenValue) {
        return 'excess'; 
      } else {
        return 'deficit'; 
      }
    };

    const calculateDiluentMismatchAdjustedValue = (antigenStock: string, diluentStock: string): string => {
    if (!antigenStock.trim() || !diluentStock.trim()) {
      return '';
    }

    const antigenValue = parseFloat(antigenStock) || 0;
    const diluentValue = parseFloat(diluentStock) || 0;

    if (antigenValue === 0 && diluentValue === 0) {
      return '';
    }

    const adjustedValue = antigenValue - diluentValue;
    return adjustedValue.toString();
  };
  
    const handleInputChange = (field: keyof YFVaccineData) => (
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

        if (field === 'physicalStock' || field === 'diluentPhysicalStock') {
          const antigenStock = field === 'physicalStock' ? value : newFormData.physicalStock;
          const diluentStock = field === 'diluentPhysicalStock' ? value : newFormData.diluentPhysicalStock;
          
          newFormData.diluentMismatchOutcome = calculateMismatchOutcome(antigenStock, diluentStock);
          newFormData.diluentMismatchAdjustedValue = calculateDiluentMismatchAdjustedValue(antigenStock, diluentStock);
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
          YF Vaccine
        </Typography>
      )}

      <Box sx={sectionBorderStyle}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>YF Antigen</Typography>
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
                  inputProps={{
                    name: 'vvm2',
                  }}
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
                  inputProps={{
                    name: 'min-stock',
                  }}
                  disabled={true}
                >
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
                  inputProps={{
                    name: 'max-stock',
                  }}
                  disabled={true}
                >
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

          {/* <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Closing Balance</InputLabel>
              <TextField
                fullWidth
                variant="outlined"
                value={formData.closingBalance}
                onChange={handleInputChange('closingBalance')}
              />
            </Box>
          </Grid> */}

          {/* <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Post LMD DoS</InputLabel>
              <TextField
                fullWidth
                variant="outlined"
                value={formData.postLmdDos}
                onChange={handleInputChange('postLmdDos')}
              />
            </Box>
          </Grid> */}
        </Grid>
      </Box>

      <Box sx={sectionBorderStyle}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>YF Diluent</Typography>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Physical Stock Balance</InputLabel>
              <TextField 
                fullWidth 
                variant="outlined" 
                placeholder="Physical Stock Balance"
                value={formData.diluentPhysicalStock}
                onChange={handleInputChange('diluentPhysicalStock')} 
                disabled={isView}
                type='number'
                onKeyDown={preventInvalidKeys}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel htmlFor="diluent-mis-match">Mismatch outcome</InputLabel>
              <FormControl fullWidth>
                <Select
                  id="diluent-mis-match"
                  value={formData.diluentMismatchOutcome}
                  onChange={handleInputChange('diluentMismatchOutcome')}
                  inputProps={{ name: 'diluent-mis-match' }}
                  disabled={true}
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="deficit">Deficit Diluent</MenuItem>
                  <MenuItem value="excess">Excess Diluent</MenuItem>
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
                value={formData.diluentMismatchAdjustedValue}
                onChange={handleInputChange('diluentMismatchAdjustedValue')} 
                disabled={true}
                type='number'
                onKeyDown={preventInvalidKeys}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box sx={sectionBorderStyle}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>5ml Syringe</Typography>
        <Grid container spacing={3}>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <InputLabel>Physical Stock Balance</InputLabel>
                <TextField 
                  fullWidth 
                  variant="outlined" 
                  placeholder="Physical Stock Balance"
                  value={formData.fiveMlSyringePhysicalStock}
                  onChange={handleInputChange('fiveMlSyringePhysicalStock')} 
                  disabled={isView}
                  type='number'
                  onKeyDown={preventInvalidKeys}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <InputLabel htmlFor="5ml-mis-match">Mismatch outcome</InputLabel>
                <FormControl fullWidth>
                  <Select
                    id="5ml-mis-match"
                    value={formData.fiveMlSyringeMismatchOutcome}
                    onChange={handleInputChange('fiveMlSyringeMismatchOutcome')}
                    inputProps={{ name: '5ml-mis-match' }}
                    disabled={isView}
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
                <InputLabel>Mismatch adjusted Value</InputLabel>
                <TextField 
                  fullWidth 
                  variant="outlined" 
                  value={formData.fiveMlSyringeMismatchAdjustedValue}
                  onChange={handleInputChange('fiveMlSyringeMismatchAdjustedValue')} 
                  disabled={isView}
                  type='number'
                  onKeyDown={preventInvalidKeys}
                  />
              </Box>
            </Grid>
          </Grid>
      </Box>

      <Box sx={sectionBorderStyle}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>0.5ml Syringe</Typography>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Physical Stock Balance</InputLabel>
              <TextField 
                fullWidth 
                variant="outlined" 
                placeholder="Physical Stock Balance"
                value={formData.halfMlSyringePhysicalStock}
                onChange={handleInputChange('halfMlSyringePhysicalStock')} 
                disabled={isView}
                type='number'
                onKeyDown={preventInvalidKeys}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel htmlFor="0.5ml-mis-match">Mismatch outcome</InputLabel>
              <FormControl fullWidth>
                <Select
                  id="0.5ml-mis-match"
                  value={formData.halfMlSyringeMismatchOutcome}
                  onChange={handleInputChange('halfMlSyringeMismatchOutcome')}
                  inputProps={{ name: '0.5ml-mis-match' }}
                  disabled={isView}
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
              <InputLabel>Mismatch adjusted Value</InputLabel>
              <TextField 
                fullWidth 
                variant="outlined"
                value={formData.halfMlSyringeMismatchAdjustedValue}
                onChange={handleInputChange('halfMlSyringeMismatchAdjustedValue')}
                disabled={isView}
                type='number'
                onKeyDown={preventInvalidKeys}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};