import React, { useState } from 'react';
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
} from '@mui/material';
import { BcgVaccineData, BcgVaccinesProps } from '../../types/vaccines/bcg';
import { format } from 'date-fns';
import { sectionBorderStyle } from 'src/utils/constants';

export const BcgVaccines: React.FC<BcgVaccinesProps  > = ({ onAddToLine, initialData }) => {

  const [formData, setFormData] = useState<BcgVaccineData>({
    physicalStock: '',
    avgDailyConsumption: '',
    // dateCreated: format(new Date(), "yyyy-MM-dd'T'HH:mm"), 
    expiryDate: '',
    batchNo: '',
    vvm2: '',
    numberImmunized: '',
    daysOfStock: '',
    adjForAdd: '',
    belowMinStock: '',
    aboveMaxStock: '',
    qtyReceived: '',
    closingBalance: '',
    postLmdDos: '',
    ...(initialData || {}), 
  });

  const handleInputChange = (field: keyof BcgVaccineData) => (
    event: React.ChangeEvent<HTMLInputElement | { value: string }>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleAddToLine = () => {
    onAddToLine(formData);
    
    setFormData({
      physicalStock: '',
      avgDailyConsumption: '',
      // dateCreated: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      expiryDate: '',
      batchNo: '',
      vvm2: '',
      numberImmunized: '',
      daysOfStock: '',
      adjForAdd: '',
      belowMinStock: '',
      aboveMaxStock: '',
      qtyReceived: '',
      closingBalance: '',
      postLmdDos: '',
    });
  };

  // Created a global border styling
  // const sectionBorderStyle = {
  //   border: '1px solid #e0e0e0',
  //   borderRadius: '4px',
  //   padding: '16px',
  //   marginBottom: '24px',
  //   boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  // };

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
        BCG Vaccine
      </Typography>

      <Box sx={sectionBorderStyle}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>BCG Antigen</Typography>
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
                 defaultValue=""
                value={formData.avgDailyConsumption}
                onChange={handleInputChange('avgDailyConsumption')}
              />
            </Box>
          </Grid>

          {/* <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Date Created</InputLabel>
              <TextField
                fullWidth
                type="datetime-local"
                variant="outlined"
                value={formData.dateCreated}
                disabled
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Grid> */}

          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Earliest Expiry Dates</InputLabel>
              <TextField
                fullWidth
                type="date"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Batch No for Earliest Expiry Dates</InputLabel>
              <TextField
                fullWidth
                type="date"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel htmlFor="vvm2">VVM 2</InputLabel>
              <FormControl fullWidth>
                <Select
                  id="vvm2"
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
              <TextField fullWidth variant="outlined" />
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Days of Stock</InputLabel>
              <TextField fullWidth variant="outlined" />
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Adj for ADD</InputLabel>
              <TextField fullWidth variant="outlined" />
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel htmlFor="min-stock">Below Min Stock Level</InputLabel>
              <FormControl fullWidth>
                <Select
                  id="min-stock"
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
              <InputLabel>Qty Received</InputLabel>
              <TextField 
                fullWidth 
                variant="outlined"
                // defaultValue=""  
              />
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Closing Balance</InputLabel>
              <TextField 
                fullWidth 
                variant="outlined" 
                  // disabled value="" 
              />
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Post LMD DoS</InputLabel>
              <TextField 
                fullWidth 
                variant="outlined" 
                // disabled value="" 
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box sx={sectionBorderStyle}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>BCG Diluent</Typography>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Physical Stock Balance</InputLabel>
              <TextField fullWidth variant="outlined" placeholder="Physical Stock Balance" />
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel htmlFor="mis-match">Mismatch outcome</InputLabel>
              <FormControl fullWidth>
                <Select
                  id="mis-match"
                  // defaultValue="yes"
                  inputProps={{
                    name: 'mis-match',
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
              <InputLabel>Mistmatch adjusted Value	</InputLabel>
              <TextField fullWidth variant="outlined"   />
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel htmlFor="recommendation">Recommendation</InputLabel>
              <FormControl fullWidth>
                <Select
                  id="recommendation"
                  // defaultValue="yes"
                  inputProps={{
                    name: 'recommendation',
                  }}
                >
                  <MenuItem value="restock">Restock</MenuItem>
                  <MenuItem value="redistrubute">Redsitribute</MenuItem>
                </Select>
              </FormControl>
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
              <TextField fullWidth variant="outlined" placeholder="Physical Stock Balance" />
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel htmlFor="mis-match">Mismatch outcome</InputLabel>
              <FormControl fullWidth>
                <Select
                  id="mis-match"
                  // defaultValue="yes"
                  inputProps={{
                    name: 'mis-match',
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
              <InputLabel>Mistmatch adjusted Value	</InputLabel>
              <TextField fullWidth variant="outlined"   />
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel htmlFor="recommendation">Recommendation</InputLabel>
              <FormControl fullWidth>
                <Select
                  id="recommendation"
                  // defaultValue="yes"
                  inputProps={{
                    name: 'recommendation',
                  }}
                >
                  <MenuItem value="restock">Restock</MenuItem>
                  <MenuItem value="redistrubute">Redsitribute</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box sx={sectionBorderStyle}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>0.05ml Syringe per Vaccine Dose</Typography>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Physical Stock Balance</InputLabel>
              <TextField fullWidth variant="outlined" placeholder="Physical Stock Balance" />
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel htmlFor="mis-match">Mismatch outcome</InputLabel>
              <FormControl fullWidth>
                <Select
                  id="mis-match"
                  // defaultValue="yes"
                  inputProps={{
                    name: 'mis-match',
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
              <InputLabel>Mistmatch adjusted Value	</InputLabel>
              <TextField fullWidth variant="outlined"   />
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel htmlFor="recommendation">Recommendation</InputLabel>
              <FormControl fullWidth>
                <Select
                  id="recommendation"
                  // defaultValue="yes"
                  inputProps={{
                    name: 'recommendation',
                  }}
                >
                  <MenuItem value="restock">Restock</MenuItem>
                  <MenuItem value="redistrubute">Redsitribute</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
        <Button 
          variant="contained" 
          color="inherit" 
          size="medium"
          onClick={handleAddToLine}
        >
          Add to Line
        </Button>
      </Box>    
    </Box>
  );
};