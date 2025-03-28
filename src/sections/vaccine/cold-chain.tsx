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
import { ColdChainVaccineData } from "src/types/vaccines/cold-chain";
import { sectionBorderStyle } from "src/utils/constants";

interface ExtendedColdChainProps {
  initialData?: Partial<ColdChainVaccineData>;
  onDataChange: (data: ColdChainVaccineData) => void;
}

export const ColdChainStatus = ({
  initialData = {},
  onDataChange,
}: ExtendedColdChainProps): JSX.Element => {
  const defaultFormData: ColdChainVaccineData = {
    dateCreated: new Date().toISOString().split('T')[0], 
    equipStatus: '',
    requestType: '',
  };

  const [formData, setFormData] = useState<ColdChainVaccineData>(() => ({
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

  const handleInputChange = (field: keyof ColdChainVaccineData) => (
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
                  onChange={handleInputChange('equipStatus')}
                  inputProps={{ name: 'equipStatus' }}
                >
                  <MenuItem value="">Select</MenuItem>
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
                  onChange={handleInputChange('requestType')}
                  inputProps={{ name: 'requestType' }}
                >
                  <MenuItem value="">Select</MenuItem>
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
