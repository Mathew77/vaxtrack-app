import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { DashboardContent } from 'src/layouts/dashboard';
import { toast } from 'react-toastify';
import { useUpdateAllocationStatus } from 'src/hooks/apis/upload/upload-hook';

interface VaccineData {
  name: string;
  allocated: number;
  received: number;
  vvmStage: string;
  batchNumber: string;
  expiryDate: string;
}

const VaccineAllocationMccoConfirmView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data, userRole } = location.state || {};

  const updateStatusMutation = useUpdateAllocationStatus();

  const [mfaCode, setMfaCode] = useState('');
  const [vaccines, setVaccines] = useState<VaccineData[]>([
    { name: 'BCG', allocated: data?.dose_bcg_allocated || 0, received: 0, vvmStage: '', batchNumber: '', expiryDate: '' },
    { name: 'HepB', allocated: data?.dose_hepb_allocated || 0, received: 0, vvmStage: '', batchNumber: '', expiryDate: '' },
    { name: 'bOPV', allocated: data?.dose_bopv_allocated || 0, received: 0, vvmStage: '', batchNumber: '', expiryDate: '' },
    { name: 'Penta', allocated: data?.dose_penta_allocated || 0, received: 0, vvmStage: '', batchNumber: '', expiryDate: '' },
    { name: 'PCV', allocated: data?.dose_pcv_allocated || 0, received: 0, vvmStage: '', batchNumber: '', expiryDate: '' },
    { name: 'IPV', allocated: data?.dose_ipv_allocated || 0, received: 0, vvmStage: '', batchNumber: '', expiryDate: '' },
    { name: 'Measles', allocated: data?.dose_mea_allocated || 0, received: 0, vvmStage: '', batchNumber: '', expiryDate: '' },
    { name: 'YF', allocated: data?.dose_yf_allocated || 0, received: 0, vvmStage: '', batchNumber: '', expiryDate: '' },
    { name: 'TD', allocated: data?.dose_td_allocated || 0, received: 0, vvmStage: '', batchNumber: '', expiryDate: '' },
    { name: 'MenA', allocated: data?.dose_mena_allocated || 0, received: 0, vvmStage: '', batchNumber: '', expiryDate: '' },
    { name: 'Rota', allocated: data?.dose_rota_allocated || 0, received: 0, vvmStage: '', batchNumber: '', expiryDate: '' },
    { name: 'HPV', allocated: data?.dose_hpv_allocated || 0, received: 0, vvmStage: '', batchNumber: '', expiryDate: '' },
  ]);

  if (!data) {
    return (
      <DashboardContent>
        <Typography variant="h6" color="error">
          No allocation data found
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/vaccine-allocation-stock-page')}
          sx={{ mt: 2 }}
        >
          Back to List
        </Button>
      </DashboardContent>
    );
  }

  const handleVaccineChange = (index: number, field: string, value: string) => {
    const updatedVaccines = [...vaccines];
    updatedVaccines[index] = { ...updatedVaccines[index], [field]: value };
    setVaccines(updatedVaccines);
  };

  const validateForm = () => {
    // Only validate vaccines that have allocations > 0
    const allocatedVaccines = vaccines.filter(v => v.allocated > 0);

    for (const vaccine of allocatedVaccines) {
      if (!vaccine.received || vaccine.received <= 0) {
        toast.error(`Please enter received amount for ${vaccine.name} (Allocated: ${vaccine.allocated})`);
        return false;
      }
    }

    if (!mfaCode || mfaCode.length !== 4) {
      toast.error('Please enter your 4-digit MFA code');
      return false;
    }

    return true;
  };

  const handleConfirm = () => {
    if (!validateForm()) return;

    // Map vaccine names to field names
    const vaccineFieldMap: { [key: string]: string } = {
      'BCG': 'bcg',
      'HepB': 'hepb',
      'bOPV': 'bopv',
      'Penta': 'penta',
      'PCV': 'pcv',
      'IPV': 'ipv',
      'Measles': 'mea',
      'YF': 'yf',
      'TD': 'td',
      'MenA': 'mena',
      'Rota': 'rota',
      'HPV': 'hpv',
    };

    // Build vaccine data with received amounts, VVM stages, batch numbers, and expiry dates
    const vaccineData: any = {};
    vaccines.forEach(v => {
      const fieldName = vaccineFieldMap[v.name];
      if (fieldName) {
        vaccineData[`dose_${fieldName}_received`] = v.received;
        // Extract the stage number from "Stage 1" -> 1
        const vvmStageNumber = v.vvmStage ? parseInt(v.vvmStage.replace('Stage ', '')) : 0;
        vaccineData[`${fieldName}_vvm_stage`] = vvmStageNumber;
        vaccineData[`${fieldName}_batch_number`] = v.batchNumber || '';
        vaccineData[`${fieldName}_expire_date`] = v.expiryDate || null;
      }
    });

    // Prepare the data for update - include all required fields plus vaccine data
    const updatePayload = {
      ehf_id: data.ehf_id,
      assigned_unique_id: data.assigned_unique_id,
      period: data.period,
      dose_bcg_actual: data.dose_bcg_actual,
      dose_bcg_allocated: data.dose_bcg_allocated,
      dose_hepb_actual: data.dose_hepb_actual,
      dose_hepb_allocated: data.dose_hepb_allocated,
      dose_bopv_actual: data.dose_bopv_actual,
      dose_bopv_allocated: data.dose_bopv_allocated,
      dose_penta_actual: data.dose_penta_actual,
      dose_penta_allocated: data.dose_penta_allocated,
      dose_pcv_actual: data.dose_pcv_actual,
      dose_pcv_allocated: data.dose_pcv_allocated,
      dose_ipv_actual: data.dose_ipv_actual,
      dose_ipv_allocated: data.dose_ipv_allocated,
      dose_mea_actual: data.dose_mea_actual,
      dose_mea_allocated: data.dose_mea_allocated,
      dose_yf_actual: data.dose_yf_actual,
      dose_yf_allocated: data.dose_yf_allocated,
      dose_td_actual: data.dose_td_actual,
      dose_td_allocated: data.dose_td_allocated,
      dose_mena_actual: data.dose_mena_actual,
      dose_mena_allocated: data.dose_mena_allocated,
      dose_rota_actual: data.dose_rota_actual,
      dose_rota_allocated: data.dose_rota_allocated,
      dose_hpv_actual: data.dose_hpv_actual,
      dose_hpv_allocated: data.dose_hpv_allocated,
      // Add vaccine data (received, vvm_stage, batch_number, expire_date)
      ...vaccineData,
      mcco_mfa_code: mfaCode,
    };

    updateStatusMutation.mutate(
      { id: data.id, status: 3, data: updatePayload },
      {
        onSuccess: () => {
          toast.success('Vaccine receipt confirmed successfully!');
          navigate('/vaccine-allocation-stock-page');
        },
        onError: () => {
          toast.error('Failed to confirm. Please try again.');
        },
      }
    );
  };

  const getStatusLabel = (status: number) => {
    if (status === 0) return 'Pending SCS Confirmation';
    if (status === 1) return 'Pending 3PL Pickup';
    if (status === 2) return 'Pending MCCO Confirmation';
    if (status === 3) return 'Completed';
    return 'Unknown';
  };

  const getStatusColor = (status: number) => {
    if (status === 0) return 'warning';
    if (status === 1) return 'info';
    if (status === 2) return 'warning';
    if (status === 3) return 'success';
    return 'default';
  };

  // Show all vaccines (not just allocated ones)
  const allocatedVaccines = vaccines;

  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/vaccine-allocation-stock-page')}
        >
          Back
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">MCCO Vaccine Confirmation</Typography>
            <Chip
              label={getStatusLabel(data.status)}
              color={getStatusColor(data.status)}
              size="medium"
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                EHF Name
              </Typography>
              <Typography variant="body1" gutterBottom>
                {data.name_of_ehf || 'N/A'}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Unique ID
              </Typography>
              <Typography variant="body1" gutterBottom>
                {data.assigned_unique_id}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                State
              </Typography>
              <Typography variant="body1" gutterBottom>
                {data.state || 'N/A'}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                LGA
              </Typography>
              <Typography variant="body1" gutterBottom>
                {data.lga || 'N/A'}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Vaccine Details 
          </Typography>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            {allocatedVaccines.map((vaccine, index) => {
              const actualIndex = vaccines.findIndex(v => v.name === vaccine.name);
              return (
                <Grid item xs={12} key={vaccine.name}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      {vaccine.name} - Allocated: {vaccine.allocated} doses
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={3}>
                        <TextField
                          fullWidth
                          label="Received Doses"
                          type="number"
                          value={vaccine.received || ''}
                          onChange={(e) => handleVaccineChange(actualIndex, 'received', e.target.value)}
                          inputProps={{ min: 0 }}
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                          <InputLabel>VVM Stage</InputLabel>
                          <Select
                            value={vaccine.vvmStage}
                            onChange={(e) => handleVaccineChange(actualIndex, 'vvmStage', e.target.value)}
                            label="VVM Stage"
                          >
                            <MenuItem value="Stage 1">Stage 1</MenuItem>
                            <MenuItem value="Stage 2">Stage 2</MenuItem>
                            <MenuItem value="Stage 3">Stage 3</MenuItem>
                            <MenuItem value="Stage 4">Stage 4</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField
                          fullWidth
                          label="Batch Number"
                          value={vaccine.batchNumber}
                          onChange={(e) => handleVaccineChange(actualIndex, 'batchNumber', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField
                          fullWidth
                          label="Earliest Expiry Date"
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          value={vaccine.expiryDate}
                          onChange={(e) => handleVaccineChange(actualIndex, 'expiryDate', e.target.value)}
                          inputProps={{
                            max: new Date().toISOString().split('T')[0]
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            MFA Verification
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Enter your 4-digit MFA Code"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                inputProps={{ maxLength: 4 }}
                helperText="Enter the 4-digit code from your authenticator"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/vaccine-allocation-stock-page')}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<CheckCircleOutlineIcon />}
              onClick={handleConfirm}
              disabled={updateStatusMutation.isPending}
              sx={{
                background: 'linear-gradient(135deg, rgb(12, 125, 64) 0%, rgb(10, 105, 54) 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, rgb(10, 105, 54) 0%, rgb(12, 125, 64) 100%)',
                },
              }}
            >
              {updateStatusMutation.isPending ? 'Confirming...' : 'Confirm Receipt'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </DashboardContent>
  );
};

export default VaccineAllocationMccoConfirmView;
