import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { DashboardContent } from 'src/layouts/dashboard';
import { toast } from 'react-toastify';
import { useUpdateAllocationStatus } from 'src/hooks/apis/upload/upload-hook';

const VaccineAllocationConfirmView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data, userRole, isView, confirmToEHF } = location.state || {};

  const updateStatusMutation = useUpdateAllocationStatus();

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

  // Status workflow: 0 = Allocated by SLWG, 1 = Confirmed by SCS, 2 = Picked up by 3PL, 3 = Pending LCS Review, 4 = Completed
  const getStatusLabel = (status: number) => {
    if (status === 0) return 'Pending SCS Confirmation';
    if (status === 1) return 'Pending 3PL Pickup';
    if (status === 2) return 'Pending MCCO Confirmation';
    if (status === 3) return 'Pending LCS Review';
    if (status === 4) return 'Completed';
    return 'Unknown';
  };

  const getStatusColor = (status: number) => {
    if (status === 0) return 'warning';
    if (status === 1) return 'info';
    if (status === 2) return 'warning';
    if (status === 3) return 'warning';
    if (status === 4) return 'success';
    return 'default';
  };

  const canConfirm = () => {
    if (isView) return false;
    if (confirmToEHF && userRole === 'slwg' && data.status === 0) return true;
    if (userRole === 'scs' && data.status === 0) return true;
    if (userRole === 'threepl' && data.status === 1) return true;
    return false;
  };

  const getConfirmButtonText = () => {
    if (confirmToEHF && userRole === 'slwg') return 'Confirm Allocation to EHF';
    if (userRole === 'scs') return 'Confirm Dispatch to 3PL';
    if (userRole === 'threepl') return 'Confirm Pickup & Delivery';
    return 'Confirm';
  };

  const handleConfirm = () => {
    // Determine new status based on user role and confirmation type
    let newStatus = data.status; // Keep current status by default
    let successMessage = 'Confirmed successfully!';

    if (confirmToEHF && userRole === 'slwg') {
      // SLWG confirming allocation to EHF - keep status at 0
      newStatus = 0;
      successMessage = 'Allocation to EHF confirmed successfully!';
    } else if (userRole === 'scs') {
      newStatus = 1;
      successMessage = 'Dispatch confirmed successfully!';
    } else if (userRole === 'threepl') {
      newStatus = 2;
      successMessage = 'Pickup and delivery confirmed successfully!';
    }

    // Prepare the data for update - include all required fields
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
      // Mark as SLWG confirmed if applicable
      slwg_confirmed: confirmToEHF ? true : data.slwg_confirmed,
    };

    updateStatusMutation.mutate(
      { id: data.id, status: newStatus, data: updatePayload },
      {
        onSuccess: () => {
          toast.success(successMessage);
          navigate('/vaccine-allocation-stock-page');
        },
        onError: () => {
          toast.error('Failed to confirm. Please try again.');
        },
      }
    );
  };

  const vaccines = [
    { name: 'BCG', allocated: data.dose_bcg_allocated, actual: data.dose_bcg_actual, received: data.dose_bcg_received, returned: data.dose_bcg_return, vvmStage: data.bcg_vvm_stage, batchNumber: data.bcg_batch_number, expiryDate: data.bcg_expire_date },
    { name: 'HepB', allocated: data.dose_hepb_allocated, actual: data.dose_hepb_actual, received: data.dose_hepb_received, returned: data.dose_hepb_return, vvmStage: data.hepb_vvm_stage, batchNumber: data.hepb_batch_number, expiryDate: data.hepb_expire_date },
    { name: 'bOPV', allocated: data.dose_bopv_allocated, actual: data.dose_bopv_actual, received: data.dose_bopv_received, returned: data.dose_bopv_return, vvmStage: data.bopv_vvm_stage, batchNumber: data.bopv_batch_number, expiryDate: data.bopv_expire_date },
    { name: 'Penta', allocated: data.dose_penta_allocated, actual: data.dose_penta_actual, received: data.dose_penta_received, returned: data.dose_penta_return, vvmStage: data.penta_vvm_stage, batchNumber: data.penta_batch_number, expiryDate: data.penta_expire_date },
    { name: 'PCV', allocated: data.dose_pcv_allocated, actual: data.dose_pcv_actual, received: data.dose_pcv_received, returned: data.dose_pcv_return, vvmStage: data.pcv_vvm_stage, batchNumber: data.pcv_batch_number, expiryDate: data.pcv_expire_date },
    { name: 'IPV', allocated: data.dose_ipv_allocated, actual: data.dose_ipv_actual, received: data.dose_ipv_received, returned: data.dose_ipv_return, vvmStage: data.ipv_vvm_stage, batchNumber: data.ipv_batch_number, expiryDate: data.ipv_expire_date },
    { name: 'Measles', allocated: data.dose_mea_allocated, actual: data.dose_mea_actual, received: data.dose_mea_received, returned: data.dose_mea_return, vvmStage: data.mea_vvm_stage, batchNumber: data.mea_batch_number, expiryDate: data.mea_expire_date },
    { name: 'YF', allocated: data.dose_yf_allocated, actual: data.dose_yf_actual, received: data.dose_yf_received, returned: data.dose_yf_return, vvmStage: data.yf_vvm_stage, batchNumber: data.yf_batch_number, expiryDate: data.yf_expire_date },
    { name: 'TD', allocated: data.dose_td_allocated, actual: data.dose_td_actual, received: data.dose_td_received, returned: data.dose_td_return, vvmStage: data.td_vvm_stage, batchNumber: data.td_batch_number, expiryDate: data.td_expire_date },
    { name: 'MenA', allocated: data.dose_mena_allocated, actual: data.dose_mena_actual, received: data.dose_mena_received, returned: data.dose_mena_return, vvmStage: data.mena_vvm_stage, batchNumber: data.mena_batch_number, expiryDate: data.mena_expire_date },
    { name: 'Rota', allocated: data.dose_rota_allocated, actual: data.dose_rota_actual, received: data.dose_rota_received, returned: data.dose_rota_return, vvmStage: data.rota_vvm_stage, batchNumber: data.rota_batch_number, expiryDate: data.rota_expire_date },
    { name: 'HPV', allocated: data.dose_hpv_allocated, actual: data.dose_hpv_actual, received: data.dose_hpv_received, returned: data.dose_hpv_return, vvmStage: data.hpv_vvm_stage, batchNumber: data.hpv_batch_number, expiryDate: data.hpv_expire_date },
  ];

  // Check if MCCO has confirmed (status >= 2) to show received column and additional data
  const showReceivedColumn = data.status >= 2;
  // Check if LCS has confirmed (status >= 4) to show returned column
  const showReturnedColumn = data.status >= 4;

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
            <Typography variant="h5">Vaccine Allocation Details</Typography>
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

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Period
              </Typography>
              <Typography variant="body1" gutterBottom>
                {data.period}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Date Created
              </Typography>
              <Typography variant="body1" gutterBottom>
                {new Date(data.date_created).toLocaleString()}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Vaccine Allocation
          </Typography>

          <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell><strong>Vaccine</strong></TableCell>
                  <TableCell><strong>Stock Upload</strong></TableCell>
                  <TableCell><strong>Vaccine Allocated</strong></TableCell>
                  {showReceivedColumn && (
                    <>
                      <TableCell><strong>Received Doses</strong></TableCell>
                      <TableCell><strong>VVM Stage</strong></TableCell>
                      <TableCell><strong>Batch Number</strong></TableCell>
                      <TableCell><strong>Earliest Expiry Date</strong></TableCell>
                    </>
                  )}
                  {showReturnedColumn && (
                    <TableCell><strong>Returned Doses</strong></TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {vaccines.map((vaccine, index) => (
                  <TableRow
                    key={vaccine.name}
                    sx={{
                      bgcolor: index % 2 === 0 ? '#ffffff' : '#f9f9f9',
                      '&:hover': { bgcolor: 'rgba(12, 125, 64, 0.08)' },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>{vaccine.name}</TableCell>
                    <TableCell>{vaccine.actual || 0}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: vaccine.allocated > 0 ? 'bold' : 'normal' }}
                      >
                        {vaccine.allocated || 0}
                      </Typography>
                    </TableCell>
                    {showReceivedColumn && (
                      <>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: vaccine.received > 0 ? 'bold' : 'normal',
                              color: vaccine.received !== vaccine.allocated ? '#d32f2f' : '#4caf50'
                            }}
                          >
                            {vaccine.received || 0}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {vaccine.vvmStage ? `Stage ${vaccine.vvmStage}` : '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {vaccine.batchNumber || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {vaccine.expiryDate ? new Date(vaccine.expiryDate).toLocaleDateString() : '-'}
                          </Typography>
                        </TableCell>
                      </>
                    )}
                    {showReturnedColumn && (
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: vaccine.returned > 0 ? 'bold' : 'normal',
                            color: vaccine.returned > 0 ? '#ff9800' : 'text.primary'
                          }}
                        >
                          {vaccine.returned || 0}
                        </Typography>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {canConfirm() && (
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
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
                {updateStatusMutation.isPending ? 'Confirming...' : getConfirmButtonText()}
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </DashboardContent>
  );
};

export default VaccineAllocationConfirmView;
