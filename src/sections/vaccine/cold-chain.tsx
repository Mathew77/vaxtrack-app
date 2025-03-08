import React, { useState, useEffect } from "react"; 
import { TextField, Box, Typography, Grid, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { ColdChainVaccineData } from "src/types/vaccines/cold-chain";
import { format } from 'date-fns';
import { sectionBorderStyle } from "src/utils/constants";

interface ExtendedColdChainProps {
  initialData?: ColdChainVaccineData;
  vaccineOptions: { value: string; label: string; component: (props: any) => JSX.Element }[];
  currentIndex: number;
  onNext: (data: ColdChainVaccineData, currentIndex: number) => void;
  onBack?: (currentIndex: number) => void;
}

export const ColdChainStatus: React.FC<ExtendedColdChainProps> = ({ 
  initialData,
  vaccineOptions,
  currentIndex,
  onNext,
  onBack,
}) => {
  const currentDate = format(new Date(), "yyyy-MM-dd"); 

  const [formData, setFormData] = useState<ColdChainVaccineData>({
    dateCreated: initialData?.dateCreated || currentDate, 
    equipStatus: '',
    requestType: '',
    ...(initialData || {}),
  });

  useEffect(() => {
    if (!initialData?.dateCreated) {
      setFormData((prev) => ({
        ...prev,
        dateCreated: currentDate,
      }));
    }
  }, [currentDate, initialData]);

  const handleInputChange = (field: keyof ColdChainVaccineData) => (
    event: React.ChangeEvent<HTMLInputElement | { value: string | number }>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleNextClick = () => {
    onNext(formData, currentIndex);
    setFormData({
      dateCreated: currentDate, 
      equipStatus: '',
      requestType: '',
    });

  };

  const handleBackClick = () => {
    if (onBack && currentIndex > 0) {
      onBack(currentIndex); 
    }
  };
  
  const isLastVaccine = currentIndex === vaccineOptions.length - 1;
  const isFirstVaccine = currentIndex === 0;

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

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="contained"
          color="primary"
          size="medium"
          onClick={handleNextClick}
        >
          {isLastVaccine ? 'Save' : 'Next'}
        </Button>  
        <Button
          variant="contained"
          color="inherit"
          size="medium"
          onClick={handleBackClick}
          disabled={isFirstVaccine} 
        >
          Back
        </Button> 
      </Box>
    </Box>
  );
};