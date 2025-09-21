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
  isView?: boolean;
  isEdit?: boolean;
  declineComment?: string;
  setDeclineComment?: (comment: string) => void;
  showDeclineComment?: boolean;
}

export const ColdChainStatus = ({
  initialData = {},
  onDataChange,
  isView = false,
  declineComment = '',
  setDeclineComment,
  showDeclineComment = false
}: ExtendedColdChainProps): JSX.Element => {

  const currentDateTime = new Date();
  const localDateTime = new Date(currentDateTime.getTime() - currentDateTime.getTimezoneOffset() * 60000);
  const formattedDateTime = localDateTime.toISOString().slice(0, 16);

  const defaultFormData: ColdChainVaccineData = {
    dateCreated: formattedDateTime,
    equipStatus: '',
    requestType: '',
  };

  const [formData, setFormData] = useState<ColdChainVaccineData>(() => {
    const mergedData = {
      dateCreated: initialData.dateCreated || formattedDateTime,
      equipStatus: initialData.equipStatus || '',
      requestType: initialData.requestType || '',
    };
    return mergedData;
  });

  useEffect(() => {
    const newFormData = {
      dateCreated: initialData.dateCreated || formattedDateTime,
      equipStatus: initialData.equipStatus || '',
      requestType: initialData.requestType || '',
    };
    setFormData((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(newFormData)) {
        return newFormData;
      }
      return prev;
    });
    onDataChange(newFormData);
  }, [initialData, formattedDateTime, onDataChange]);

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

  const handleDeclineCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (setDeclineComment) {
      setDeclineComment(event.target.value);
    }
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
                type="datetime-local"
                value={formData.dateCreated}
                onChange={handleInputChange('dateCreated')}
                InputLabelProps={{ shrink: true }}
                disabled 
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
                  disabled={isView} 
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
                  disabled={isView} 
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="emergency">Emergency</MenuItem>
                  <MenuItem value="regular">Regular</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>

          {showDeclineComment && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <InputLabel htmlFor="declineComment">Decline Comment</InputLabel>
                <TextField
                  id="declineComment"
                  fullWidth
                  multiline
                  rows={4}
                  value={declineComment}
                  onChange={handleDeclineCommentChange}
                  placeholder="Enter reason for declining (required if declining)"
                />
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};