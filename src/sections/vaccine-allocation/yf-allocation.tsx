import React, { useState, ChangeEvent, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  Grid,
  InputLabel,
} from '@mui/material';
import { YfAllocationData } from 'src/types/allocations/yf';

interface ExtendedYfAllocationProps {
  initialData?: any;
  onDataChange: (data: any) => void;
}

export const YfAllocation = ({
  initialData,
  onDataChange,
}: ExtendedYfAllocationProps): JSX.Element => {
  const [formData, setFormData] = useState<YfAllocationData>({
    quantity_requested_by_UHF: '',
    quantity_dispense_by_EHF: '',
    quantity_returned: '',
    received_by: '',
    dispensed_by: '',
    returned_by: '',
    ...(initialData || {}),
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    onDataChange(formData);
  }, [formData, onDataChange]);

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
        Yf Allocation
      </Typography>

      <Box component="form" noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Quantity Requested by UHF</InputLabel>
              <TextField
                required
                fullWidth
                name="quantity_requested_by_UHF"
                placeholder="Quantity Requested by UHF"
                value={formData.quantity_requested_by_UHF}
                onChange={handleChange}
                variant="outlined"
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Quantity Dispense by EHF</InputLabel>
              <TextField
                required
                fullWidth
                name="quantity_dispense_by_EHF"
                placeholder="Quantity Dispense by EHF"
                value={formData.quantity_dispense_by_EHF}
                onChange={handleChange}
                variant="outlined"
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Quantity Returned</InputLabel>
              <TextField
                required
                fullWidth
                name="quantity_returned"
                placeholder="Quantity Returned"
                value={formData.quantity_returned}
                onChange={handleChange}
                variant="outlined"
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Received By</InputLabel>
              <TextField
                required
                fullWidth
                name="received_by"
                placeholder="Received By"
                value={formData.received_by}
                onChange={handleChange}
                variant="outlined"
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Dispensed By</InputLabel>
              <TextField
                required
                fullWidth
                name="dispensed_by"
                placeholder="Dispensed By"
                value={formData.dispensed_by}
                onChange={handleChange}
                variant="outlined"
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <InputLabel>Returned By</InputLabel>
              <TextField
                required
                fullWidth
                name="returned_by"
                placeholder="Returned By"
                value={formData.returned_by}
                onChange={handleChange}
                variant="outlined"
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};