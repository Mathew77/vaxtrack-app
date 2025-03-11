import React, { useState, useEffect } from "react"; 
import { TextField, Box, Typography, Grid, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { ColdChainVaccineData } from "src/types/vaccines/cold-chain";
import { format } from 'date-fns';
import { sectionBorderStyle } from "src/utils/constants";

interface ExtendedColdChainProps {
  initialData?: any;
  onDataChange: (data: any) => void;
}

export const ColdChainStatus = ({ 
  initialData,
  onDataChange,
}: ExtendedColdChainProps): JSX.Element => {
  // const currentDate = format(new Date(), "yyyy-MM-dd"); 

  const [formData, setFormData] = useState<ColdChainVaccineData>({
    dateCreated: format(new Date(), "yyyy-MM-dd"), 
    equipStatus: '',
    requestType: '',
    ...(initialData || {}),
  });

  const handleInputChange = (field: keyof ColdChainVaccineData) => (
    event: React.ChangeEvent<HTMLInputElement | { value: string | number }>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  useEffect(() => {
      onDataChange(formData);
    }, [formData, onDataChange])


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
        Cold Chain Status
      </Typography>

      <Box sx={sectionBorderStyle}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Date Created</InputLabel>
              <TextField 
                fullWidth 
                variant="outlined" 
                type="date" 
                value={formData.dateCreated}
                onChange={handleInputChange('dateCreated')} 
                InputLabelProps={{ shrink: true }} 
              />
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel htmlFor="equipStatus">Cold Chain Status</InputLabel>
              <FormControl fullWidth>
                <Select
                  id="equipStatus"
                  value={formData.equipStatus} 
                //   onChange={handleInputChange('equipStatus')} 
                  inputProps={{ name: 'equipStatus' }}
                >
                  <MenuItem value="functional">Functional</MenuItem>
                  <MenuItem value="not-functional">Not Functional</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel htmlFor="requestType">Request Type</InputLabel>
              <FormControl fullWidth>
                <Select
                  id="requestType"
                  value={formData.requestType} 
                //   onChange={handleInputChange('requestType')} 
                  inputProps={{ name: 'requestType' }}
                >
                  <MenuItem value="emergency">Emergency</MenuItem>
                  <MenuItem value="regular">Regular</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};