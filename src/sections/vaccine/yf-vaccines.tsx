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

interface ExtendedYFVaccineProps {
  initialData?: Partial<YFVaccineData>;
  onDataChange: (data: YFVaccineData) => void;
}

export const YfVaccine = ({
  initialData = {},
  onDataChange,
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
    twoMlSyringePhysicalStock: '',
    twoMlSyringeMismatchOutcome: '',
    twoMlSyringeMismatchAdjustedValue: '',
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
  
    const handleInputChange = (field: keyof YFVaccineData) => (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
    ) => {
      const value = event.target.value as string;
      setFormData((prev) => {
        const newFormData = { ...prev, [field]: value };
        onDataChange(newFormData);
        return newFormData;
      });
    };


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
        YF Vaccine
      </Typography>

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
              />
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>

              <InputLabel htmlFor="vvm2">Is the Antigen in VVM2</InputLabel>

              <FormControl fullWidth>
                <Select
                  id="vvm2"
                  value={formData.vvm2}
                  onChange={handleInputChange('vvm2')}
                  inputProps={{
                    name: 'vvm2',
                  }}
                >
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
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
                value={formData.diluentMismatchAdjustedValue}
                onChange={handleInputChange('diluentMismatchAdjustedValue')} 
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box sx={sectionBorderStyle}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>2ml Syringe</Typography>
        <Grid container spacing={3}>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <InputLabel>Physical Stock Balance</InputLabel>
                <TextField 
                  fullWidth 
                  variant="outlined" 
                  placeholder="Physical Stock Balance"
                  value={formData.twoMlSyringePhysicalStock}
                  onChange={handleInputChange('twoMlSyringePhysicalStock')} 
                    />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <InputLabel htmlFor="2ml-mis-match">Mismatch outcome</InputLabel>
                <FormControl fullWidth>
                  <Select
                    id="2ml-mis-match"
                    value={formData.twoMlSyringeMismatchOutcome}
                    onChange={handleInputChange('twoMlSyringeMismatchOutcome')}
                    inputProps={{ name: '2ml-mis-match' }}
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
                  value={formData.twoMlSyringeMismatchAdjustedValue}
                  onChange={handleInputChange('twoMlSyringeMismatchAdjustedValue')} 
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
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};