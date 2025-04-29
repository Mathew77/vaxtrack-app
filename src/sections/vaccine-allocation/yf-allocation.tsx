import React, { useState, ChangeEvent, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  Grid,
  InputLabel,
  Select,
  MenuItem, FormControl
} from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { YfAllocationData } from 'src/types/allocations/yf';
import { YfVaccine } from '../vaccine/yf-vaccines';
import { YFVaccineData } from 'src/types/vaccines/yf';

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
    quantity_allocated_by_EHF: '',
    dispensed_by: '',
    quantity_received_by_conveyor: '',
    quantity_received_by_UHF: '',
    quantity_returned_unopened: '',
    quantity_returned_opened: '',
    returned_by: '',
    ...(initialData || {}),
  });

  const storedUsername = sessionStorage.getItem('username') || '';
      const allowedRoles = ['admin', 'ehf', 'uhf', 'lcs', 'scs', 'slwg', 'threepl', 'conveyor'];
      const userRole = allowedRoles.find((role) => storedUsername.toLowerCase().includes(role));
    
      const isEHF = userRole === 'ehf';
      const isUHF = userRole === 'uhf';
      const isConveyor = userRole === 'conveyor';
    
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
    
      const handleVaccineDataChange = (vaccineData: YFVaccineData) => {
        onDataChange({ ...formData, vaccineData });
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
        Yf Allocation
      </Typography>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
          aria-controls="bcg-vaccine-content"
          id="bcg-vaccine-header"
          sx={{
            backgroundColor: '#00838F',
            color: 'white',
            border: '1px solid #00838F',
            borderRadius: 1,
          }}
        >
          <Typography component="span" variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            YF Vaccine
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <YfVaccine
            initialData={initialData?.vaccineData}
            onDataChange={handleVaccineDataChange}
            hideTitle={true}
          />
        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
          aria-controls="forward-logistics-content"
          id="forward-logistics-header"
          sx={{
            backgroundColor: '#37474F',
            color: 'white',
            border: '1px solid #37474F',
            borderRadius: 1,
          }}
        >
          <Typography component="span" variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Forward Logistics
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <InputLabel htmlFor="min-stock">Session</InputLabel>
                <FormControl fullWidth>
                  <Select
                    id="min-stock"
                    inputProps={{ name: 'min-stock' }}
                  >
                    <MenuItem value="">Select</MenuItem>
                    <MenuItem value="yes">Fixed</MenuItem>
                    <MenuItem value="no">Outreach</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
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
                <InputLabel>Quantity Allocated by EHF</InputLabel>
                <TextField
                  required
                  fullWidth
                  name="quantity_allocated_by_EHF"
                  placeholder="Quantity Allocated by EHF"
                  value={formData.quantity_allocated_by_EHF}
                  onChange={handleChange}
                  variant="outlined"
                  disabled={!isEHF}
                />
              </Box>
            </Grid>
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
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
          aria-controls="reverse-logistics-content"
          id="reverse-logistics-header"
          sx={{
            backgroundColor: '#6B6B6B',
            color: 'white',
            border: '1px solid #6B6B6B',
            borderRadius: 1,
          }}
        >
          <Typography component="span" variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Reverse Logistics
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
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
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};