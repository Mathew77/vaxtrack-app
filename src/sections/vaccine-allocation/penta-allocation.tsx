import React, { useState, ChangeEvent, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  Grid,
  InputLabel,
} from '@mui/material';
import { BcgAllocationData } from 'src/types/allocations/bcg';

interface ExtendedBcgAllocationProps {
  initialData?: any;
  onDataChange: (data: any) => void;
}

export const PentaAllocation = ({
  initialData,
  onDataChange,
}: ExtendedBcgAllocationProps): JSX.Element => {
  const [formData, setFormData] = useState<BcgAllocationData>({
    quantity_requested_by_UHF: '',
    quantity_dispense_by_EHF: '',
    dispensed_by: '',
    quantity_received_by_conveyor: '',
    quantity_received_by_UHF: '',
    quantity_returned_unopened: '',
    quantity_returned_opened: '',
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

  const storedUsername = sessionStorage.getItem('username') || '';
  const allowedRoles = ['admin', 'ehf', 'uhf', 'lcs', 'scs', 'slwg', 'threepl', 'conveyor'];
  const userRole = allowedRoles.find((role) => storedUsername.toLowerCase().includes(role));

  const isEHF = userRole === 'ehf';
  const isUHF = userRole === 'uhf';
  const isConveyor = userRole === 'conveyor';

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
                Penta Allocation
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'black', mb: 1 }}>
                Forward Logistics
              </Typography>
        
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
                      disabled={!isEHF}
                    />
                  </Box>
                </Grid>
        
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <InputLabel>Quantity Dispensed by EHF</InputLabel>
                    <TextField
                      required
                      fullWidth
                      name="quantity_dispense_by_EHF"
                      placeholder="Quantity Dispensed by EHF"
                      value={formData.quantity_dispense_by_EHF}
                      onChange={handleChange}
                      variant="outlined"
                      disabled={!isEHF}
                    />
                  </Box>
                </Grid>
        
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <InputLabel>Quantity Dispensed By</InputLabel>
                    <TextField
                      required
                      fullWidth
                      name="dispensed_by"
                      placeholder="Dispensed By"
                      value={formData.dispensed_by}
                      onChange={handleChange}
                      variant="outlined"
                      disabled={!isEHF}
                    />
                  </Box>
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <InputLabel>Quantity Received by Conveyor</InputLabel>
                    <TextField
                      required
                      fullWidth
                      name="quantity_received_by_conveyor"
                      placeholder="Quantity Received by Conveyor"
                      value={formData.quantity_received_by_conveyor}
                      onChange={handleChange}
                      variant="outlined"
                      disabled={!isConveyor}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <InputLabel>Quantity Received by UHF</InputLabel>
                    <TextField
                      required
                      fullWidth
                      name="quantity_received_by_UHF"
                      placeholder="Quantity Received by UHF"
                      value={formData.quantity_received_by_UHF}
                      onChange={handleChange}
                      variant="outlined"
                      disabled={!isUHF}
                    />
                  </Box>
                </Grid>
              </Grid>
        
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'black', mt: 2, mb: 1 }}>
                Reverse Logistics
              </Typography>
        
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <InputLabel>Quantity Returned by UHF (Unopened vial)</InputLabel>
                    <TextField
                      required
                      fullWidth
                      name="quantity_returned_unopened"
                      placeholder="Quantity Returned by UHF (Unopened vial)"
                      value={formData.quantity_returned_unopened}
                      onChange={handleChange}
                      variant="outlined"
                      disabled={!isUHF} 
                    />
                  </Box>
                </Grid>
        
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <InputLabel>Quantity Returned by UHF (Open vial)</InputLabel>
                    <TextField
                      required
                      fullWidth
                      name="quantity_returned_opened"
                      placeholder="Quantity Returned by UHF (Open vial)"
                      value={formData.quantity_returned_opened}
                      onChange={handleChange}
                      variant="outlined"
                      disabled={!isUHF} 
                    />
                  </Box>
                </Grid>
        
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <InputLabel>Quantity Returned By</InputLabel>
                    <TextField
                      required
                      fullWidth
                      name="returned_by"
                      placeholder="Returned By"
                      value={formData.returned_by}
                      onChange={handleChange}
                      variant="outlined"
                      disabled={!isUHF} 
                    />
                  </Box>
                </Grid>
              </Grid>
        </Box>
  );
};