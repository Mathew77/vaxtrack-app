import React, { useEffect, useState } from "react";
import { TextField, Box, Typography, Grid, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { RotaVaccineData } from "src/types/vaccines/rota"; 
import { sectionBorderStyle } from "src/utils/constants";
import { preventInvalidKeys } from 'src/utils/preventInvalidkeys';

interface ExtendedRotaVaccineProps {
  initialData?:  Partial<RotaVaccineData>;
  onDataChange: (data: RotaVaccineData) => void;
  hideTitle?: boolean;
  isView: boolean;
}

export const RotaVaccine = ({
  initialData = {},
  onDataChange,
  hideTitle = false,
  isView = false
}: ExtendedRotaVaccineProps): JSX.Element => {
  const defaultFormData: RotaVaccineData = {
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
    halfMlSyringePhysicalStock: '',
    halfMlSyringeMismatchOutcome: '',
    halfMlSyringeMismatchAdjustedValue: '',
    dropperPhysicalStock: '', 
    dropperMismatchOutcome: '',
    dropperMismatchAdjustedValue: '', 
  };

 const [formData, setFormData] = useState<RotaVaccineData>(() => ({
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

  
    const handleInputChange = (field: keyof RotaVaccineData) => (
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
          Rota Vaccine
        </Typography>
      )}

      <Box sx={sectionBorderStyle}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>Rota Antigen</Typography>
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

       {/* <Box sx={sectionBorderStyle}>
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
                />
              </Box>
            </Grid>
          </Grid>
        </Box> */}

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
              <InputLabel>Mistmatch adjusted Value</InputLabel>
              <TextField 
                fullWidth 
                variant="outlined"
                value={formData.dropperMismatchAdjustedValue}
                onChange={handleInputChange('dropperMismatchAdjustedValue')}  
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