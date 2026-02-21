import React, { useState, useMemo } from 'react';
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { DashboardContent } from 'src/layouts/dashboard';
import { toast } from 'react-toastify';
import { useUpdateAllocationStatus } from 'src/hooks/apis/upload/upload-hook';
import { useFetchLcs } from 'src/hooks/apis/lcs-scs/lcs-hooks';
import { useFetchScs } from 'src/hooks/apis/lcs-scs/scs-hooks';

const VaccineAllocationConfirmView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data, userRole, isView, confirmToEHF, showTransferDeficit: showTransferDeficitProp } = location.state || {};

  const updateStatusMutation = useUpdateAllocationStatus();

  // Fetch LCS and SCS data
  const { data: allLcs = [] } = useFetchLcs();
  const { data: allScs = [] } = useFetchScs();

  // Transfer Deficit state - Initialize from saved data if available
  const [transferType, setTransferType] = useState<'lcs' | 'scs' | ''>(data?.deficit_transfer_to || '');
  const [selectedFacility, setSelectedFacility] = useState<string>(
    data?.deficit_vaccine_location_id ? data.deficit_vaccine_location_id.toString() : ''
  );

  const [vvmStages, setVvmStages] = useState({
    bcg: data?.bcg_vvm_stage_threepl || '',
    hepb: data?.hepb_vvm_stage_threepl || '',
    bopv: data?.bopv_vvm_stage_threepl || '',
    penta: data?.penta_vvm_stage_threepl || '',
    pcv: data?.pcv_vvm_stage_threepl || '',
    ipv: data?.ipv_vvm_stage_threepl || '',
    mea: data?.mea_vvm_stage_threepl || '',
    yf: data?.yf_vvm_stage_threepl || '',
    td: data?.td_vvm_stage_threepl || '',
    mena: data?.mena_vvm_stage_threepl || '',
    rota: data?.rota_vvm_stage_threepl || '',
    hpv: data?.hpv_vvm_stage_threepl || '',
  });

  const handleVvmChange = (vaccineKey: string, value: string) => {
    setVvmStages(prev => ({ ...prev, [vaccineKey]: value }));
  };

  // Filter LCS by state
  const lcsInState = useMemo(() => {
    if (!data?.state) return [];
    return allLcs.filter(lcs => lcs.stat_id?.toUpperCase() === data.state.toUpperCase());
  }, [allLcs, data?.state]);

  // Filter SCS by state
  const scsInState = useMemo(() => {
    if (!data?.state) return [];
    return allScs.filter((scs: any) => scs.stat_id?.toUpperCase() === data.state.toUpperCase());
  }, [allScs, data?.state]);

  // Get facilities based on transfer type
  const facilitiesList = useMemo(() => {
    if (transferType === 'lcs') return lcsInState;
    if (transferType === 'scs') return scsInState;
    return [];
  }, [transferType, lcsInState, scsInState]);

  // Show Transfer Deficit section when explicitly passed via navigation state
  const showTransferDeficit = showTransferDeficitProp === true;

  // Check if transfer has already been confirmed (status = 5)
  const isTransferConfirmed = data?.status === 5;

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

  // Status workflow: 0 = Allocated by SLWG, 1 = Confirmed by SCS, 2 = Picked up by 3PL, 3 = Deficit Pending for Return, 4 = Completed, 5 = Pending Confirmation (LCS/EHF)
  const getStatusLabel = (status: number) => {
    if (status === 0) return 'Pending SCS Confirmation';
    if (status === 1) return 'Pending 3PL Pickup';
    if (status === 2) return 'Pending MCCO Confirmation';
    if (status === 3) return 'Deficit Pending for Return';
    if (status === 4) return 'Completed';
    if (status === 5) {
      // Dynamic label based on transfer type
      const transferTo = data?.deficit_transfer_to;
      if (transferTo === 'lcs') return 'Pending LCS Confirmation';
      if (transferTo === 'ehf') return 'Pending EHF Confirmation';
      if (transferTo === 'scs') return 'Pending SCS Confirmation';
      return 'Pending Confirmation';
    }
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
      uuid: data.uuid,
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
      // Include VVM stages if 3PL is confirming - only for vaccines with allocations > 0
      ...(userRole === 'threepl' && {
        ...(data.dose_bcg_allocated > 0 && { bcg_vvm_stage_threepl: vvmStages.bcg || '' }),
        ...(data.dose_hepb_allocated > 0 && { hepb_vvm_stage_threepl: vvmStages.hepb || '' }),
        ...(data.dose_bopv_allocated > 0 && { bopv_vvm_stage_threepl: vvmStages.bopv || '' }),
        ...(data.dose_penta_allocated > 0 && { penta_vvm_stage_threepl: vvmStages.penta || '' }),
        ...(data.dose_pcv_allocated > 0 && { pcv_vvm_stage_threepl: vvmStages.pcv || '' }),
        ...(data.dose_ipv_allocated > 0 && { ipv_vvm_stage_threepl: vvmStages.ipv || '' }),
        ...(data.dose_mea_allocated > 0 && { mea_vvm_stage_threepl: vvmStages.mea || '' }),
        ...(data.dose_yf_allocated > 0 && { yf_vvm_stage_threepl: vvmStages.yf || '' }),
        ...(data.dose_td_allocated > 0 && { td_vvm_stage_threepl: vvmStages.td || '' }),
        ...(data.dose_mena_allocated > 0 && { mena_vvm_stage_threepl: vvmStages.mena || '' }),
        ...(data.dose_rota_allocated > 0 && { rota_vvm_stage_threepl: vvmStages.rota || '' }),
        ...(data.dose_hpv_allocated > 0 && { hpv_vvm_stage_threepl: vvmStages.hpv || '' }),
      }),
    };

    updateStatusMutation.mutate(
      { id: data.id, status: newStatus, data: updatePayload },
      {
        onSuccess: () => {
          toast.success(successMessage);
          navigate('/vaccine-allocation-batch-detail', {
            state: { batch_no: data.batch_no }
          });
        },
        onError: () => {
          toast.error('Failed to confirm. Please try again.');
        },
      }
    );
  };

  // Helper: Show EHF value if changed, otherwise fallback to SCS value
  const getVvmStage = (ehf: any, scs: any) => (ehf && ehf !== '0' && ehf !== 0) ? ehf : (scs || '');
  const getBatchNumber = (ehf: string | null, scs: string | null) => ehf || scs || null;
  const getExpiryDate = (ehf: string | null, scs: string | null) => ehf || scs || null;

  const vaccines = [
    { name: 'BCG', key: 'bcg', allocated: data.dose_bcg_allocated, actual: data.dose_bcg_actual, received: data.dose_bcg_received, returned: data.dose_bcg_return, vvmStage: getVvmStage(data.bcg_vvm_stage_ehf, data.bcg_vvm_stage_scs), vvmStage3PL: data.bcg_vvm_stage_threepl, batchNumber: getBatchNumber(data.bcg_batch_number, data.bcg_batch_number_scs), expiryDate: getExpiryDate(data.bcg_expire_date, data.bcg_expire_date_scs) },
    { name: 'HepB', key: 'hepb', allocated: data.dose_hepb_allocated, actual: data.dose_hepb_actual, received: data.dose_hepb_received, returned: data.dose_hepb_return, vvmStage: getVvmStage(data.hepb_vvm_stage_ehf, data.hepb_vvm_stage_scs), vvmStage3PL: data.hepb_vvm_stage_threepl, batchNumber: getBatchNumber(data.hepb_batch_number, data.hepb_batch_number_scs), expiryDate: getExpiryDate(data.hepb_expire_date, data.hepb_expire_date_scs) },
    { name: 'bOPV', key: 'bopv', allocated: data.dose_bopv_allocated, actual: data.dose_bopv_actual, received: data.dose_bopv_received, returned: data.dose_bopv_return, vvmStage: getVvmStage(data.bopv_vvm_stage_ehf, data.bopv_vvm_stage_scs), vvmStage3PL: data.bopv_vvm_stage_threepl, batchNumber: getBatchNumber(data.bopv_batch_number, data.bopv_batch_number_scs), expiryDate: getExpiryDate(data.bopv_expire_date, data.bopv_expire_date_scs) },
    { name: 'Penta', key: 'penta', allocated: data.dose_penta_allocated, actual: data.dose_penta_actual, received: data.dose_penta_received, returned: data.dose_penta_return, vvmStage: getVvmStage(data.penta_vvm_stage_ehf, data.penta_vvm_stage_scs), vvmStage3PL: data.penta_vvm_stage_threepl, batchNumber: getBatchNumber(data.penta_batch_number, data.penta_batch_number_scs), expiryDate: getExpiryDate(data.penta_expire_date, data.penta_expire_date_scs) },
    { name: 'PCV', key: 'pcv', allocated: data.dose_pcv_allocated, actual: data.dose_pcv_actual, received: data.dose_pcv_received, returned: data.dose_pcv_return, vvmStage: getVvmStage(data.pcv_vvm_stage_ehf, data.pcv_vvm_stage_scs), vvmStage3PL: data.pcv_vvm_stage_threepl, batchNumber: getBatchNumber(data.pcv_batch_number, data.pcv_batch_number_scs), expiryDate: getExpiryDate(data.pcv_expire_date, data.pcv_expire_date_scs) },
    { name: 'IPV', key: 'ipv', allocated: data.dose_ipv_allocated, actual: data.dose_ipv_actual, received: data.dose_ipv_received, returned: data.dose_ipv_return, vvmStage: getVvmStage(data.ipv_vvm_stage_ehf, data.ipv_vvm_stage_scs), vvmStage3PL: data.ipv_vvm_stage_threepl, batchNumber: getBatchNumber(data.ipv_batch_number, data.ipv_batch_number_scs), expiryDate: getExpiryDate(data.ipv_expire_date, data.ipv_expire_date_scs) },
    { name: 'Measles', key: 'mea', allocated: data.dose_mea_allocated, actual: data.dose_mea_actual, received: data.dose_mea_received, returned: data.dose_mea_return, vvmStage: getVvmStage(data.mea_vvm_stage_ehf, data.mea_vvm_stage_scs), vvmStage3PL: data.mea_vvm_stage_threepl, batchNumber: getBatchNumber(data.mea_batch_number, data.mea_batch_number_scs), expiryDate: getExpiryDate(data.mea_expire_date, data.mea_expire_date_scs) },
    { name: 'YF', key: 'yf', allocated: data.dose_yf_allocated, actual: data.dose_yf_actual, received: data.dose_yf_received, returned: data.dose_yf_return, vvmStage: getVvmStage(data.yf_vvm_stage_ehf, data.yf_vvm_stage_scs), vvmStage3PL: data.yf_vvm_stage_threepl, batchNumber: getBatchNumber(data.yf_batch_number, data.yf_batch_number_scs), expiryDate: getExpiryDate(data.yf_expire_date, data.yf_expire_date_scs) },
    { name: 'TD', key: 'td', allocated: data.dose_td_allocated, actual: data.dose_td_actual, received: data.dose_td_received, returned: data.dose_td_return, vvmStage: getVvmStage(data.td_vvm_stage_ehf, data.td_vvm_stage_scs), vvmStage3PL: data.td_vvm_stage_threepl, batchNumber: getBatchNumber(data.td_batch_number, data.td_batch_number_scs), expiryDate: getExpiryDate(data.td_expire_date, data.td_expire_date_scs) },
    { name: 'MenA', key: 'mena', allocated: data.dose_mena_allocated, actual: data.dose_mena_actual, received: data.dose_mena_received, returned: data.dose_mena_return, vvmStage: getVvmStage(data.mena_vvm_stage_ehf, data.mena_vvm_stage_scs), vvmStage3PL: data.mena_vvm_stage_threepl, batchNumber: getBatchNumber(data.mena_batch_number, data.mena_batch_number_scs), expiryDate: getExpiryDate(data.mena_expire_date, data.mena_expire_date_scs) },
    { name: 'Rota', key: 'rota', allocated: data.dose_rota_allocated, actual: data.dose_rota_actual, received: data.dose_rota_received, returned: data.dose_rota_return, vvmStage: getVvmStage(data.rota_vvm_stage_ehf, data.rota_vvm_stage_scs), vvmStage3PL: data.rota_vvm_stage_threepl, batchNumber: getBatchNumber(data.rota_batch_number, data.rota_batch_number_scs), expiryDate: getExpiryDate(data.rota_expire_date, data.rota_expire_date_scs) },
    { name: 'HPV', key: 'hpv', allocated: data.dose_hpv_allocated, actual: data.dose_hpv_actual, received: data.dose_hpv_received, returned: data.dose_hpv_return, vvmStage: getVvmStage(data.hpv_vvm_stage_ehf, data.hpv_vvm_stage_scs), vvmStage3PL: data.hpv_vvm_stage_threepl, batchNumber: getBatchNumber(data.hpv_batch_number, data.hpv_batch_number_scs), expiryDate: getExpiryDate(data.hpv_expire_date, data.hpv_expire_date_scs) },
  ];

  // Check if 3PL is confirming to show VVM input fields
  const show3PLInputs = userRole === 'threepl' && data.status === 1 && !isView;

  // Check if 3PL should see VVM stages they entered (when viewing after confirmation)
  const show3PLVvmView = userRole === 'threepl' && data.status >= 2 && isView;

  // Role-based visibility for columns
  // SLWG, SCS should NOT see batch number, expiry date, VVM stage
  // 3PL can see VVM stages they entered
  // MCCO and LCS can see all details (batch number, expiry date, VVM stage from MCCO)
  const showReceivedColumn = data.status >= 2 && (userRole === 'mcco' || userRole === 'lcs');

  // Only LCS should see returned column
  const showReturnedColumn = data.status >= 4 && userRole === 'lcs';

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

          {/* Transfer Deficit Section - Only for MCCO when viewing */}
          {showTransferDeficit && (
            <>
              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom sx={{ color: 'rgb(12, 125, 64)', fontWeight: 600 }}>
                Transfer Deficit
              </Typography>

              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Transfer To</InputLabel>
                    <Select
                      value={transferType}
                      onChange={(e) => {
                        setTransferType(e.target.value as 'lcs' | 'scs' | '');
                        setSelectedFacility(''); // Reset facility selection when type changes
                      }}
                      label="Transfer To"
                      disabled={isTransferConfirmed}
                    >
                      <MenuItem value="">
                        <em>Select type</em>
                      </MenuItem>
                      <MenuItem value="lcs">LCS</MenuItem>
                      <MenuItem value="scs">SCS</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {transferType && (
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>
                        {transferType === 'lcs' ? 'Select LCS' : 'Select SCS'}
                      </InputLabel>
                      <Select
                        value={selectedFacility}
                        onChange={(e) => setSelectedFacility(e.target.value)}
                        label={transferType === 'lcs' ? 'Select LCS' : 'Select SCS'}
                        disabled={isTransferConfirmed}
                      >
                        <MenuItem value="">
                          <em>Select facility</em>
                        </MenuItem>
                        {facilitiesList.map((facility: any) => (
                          <MenuItem
                            key={facility.id}
                            value={facility.id}
                          >
                            {transferType === 'lcs'
                              ? `${facility.lcs_name || 'N/A'} - ${facility.lga_id || 'N/A'}`
                              : `${facility.scs_name || 'N/A'} - ${facility.stat_id || 'N/A'}`
                            }
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}

                {/* Show confirmation message if already confirmed */}
                {isTransferConfirmed && (
                  <Grid item xs={12}>
                    <Box sx={{ p: 2, bgcolor: '#e8f5e9', borderRadius: 1, border: '1px solid #4caf50' }}>
                      <Typography variant="body1" sx={{ color: '#2e7d32', fontWeight: 500 }}>
                        ✓ Transfer confirmed to {transferType?.toUpperCase()}. Awaiting confirmation.
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {/* Confirm Transfer Button - Only show if not yet confirmed */}
                {transferType && selectedFacility && !isTransferConfirmed && (
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      onClick={() => {
                        // Handle transfer confirmation
                        const transferData = {
                          ...data,
                          deficit_transfer_to: transferType,
                          deficit_vaccine_location_id: selectedFacility,
                        };

                        // Update status to show "Pending LCS Confirmation"
                        updateStatusMutation.mutate(
                          { id: data.id, status: 5, data: transferData },
                          {
                            onSuccess: () => {
                              toast.success(`Transfer to ${transferType.toUpperCase()} confirmed successfully!`);
                              navigate('/vaccine-allocation-stock-page');
                            },
                            onError: () => {
                              toast.error('Failed to confirm transfer. Please try again.');
                            },
                          }
                        );
                      }}
                      disabled={updateStatusMutation.isPending}
                      sx={{
                        background: 'linear-gradient(135deg, rgb(12, 125, 64) 0%, rgb(10, 105, 54) 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, rgb(10, 105, 54) 0%, rgb(12, 125, 64) 100%)',
                        },
                      }}
                    >
                      {updateStatusMutation.isPending ? 'Confirming Transfer...' : 'Confirm Transfer'}
                    </Button>
                  </Grid>
                )}
              </Grid>
            </>
          )}

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Vaccine Allocation
          </Typography>

          {show3PLInputs ? (
            // Card view for 3PL VVM input
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {vaccines.filter(v => v.allocated > 0).map((vaccine) => (
                <Grid item xs={12} md={6} key={vaccine.name}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      {vaccine.name}
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">
                          Allocated Doses
                        </Typography>
                        <Typography variant="h6" color="primary">
                          {vaccine.allocated || 0}
                        </Typography>
                      </Grid>
                      {/* Commented out VVM Stage for 3PL */}
                      {/* <Grid item xs={6}>
                        <FormControl fullWidth size="small">
                          <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                            VVM Stage
                          </Typography>
                          <Select
                            value={vvmStages[vaccine.key as keyof typeof vvmStages]}
                            onChange={(e) => handleVvmChange(vaccine.key, e.target.value)}
                            displayEmpty
                          >
                            <MenuItem value="">Select Stage</MenuItem>
                            <MenuItem value="Usable">Usable</MenuItem>
                            <MenuItem value="Unusable">Unusable</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid> */}
                    </Grid>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            // Table view for other roles
            <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell><strong>Vaccine</strong></TableCell>
                    <TableCell><strong>Maximum Stock</strong></TableCell>
                    <TableCell><strong>Vaccine Allocated</strong></TableCell>
                    {/* Commented out VVM Stage (3PL) column */}
                    {/* {show3PLVvmView && (
                      <TableCell><strong>VVM Stage (3PL)</strong></TableCell>
                    )} */}
                    {showReceivedColumn && (
                      <>
                        <TableCell><strong>Received Doses</strong></TableCell>
                        <TableCell><strong>Deficit</strong></TableCell>
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
                      {/* Commented out VVM Stage (3PL) cell */}
                      {/* {show3PLVvmView && (
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {vaccine.vvmStage3PL ? `Stage ${vaccine.vvmStage3PL}` : '-'}
                          </Typography>
                        </TableCell>
                      )} */}
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
                            {(() => {
                              const deficit = (vaccine.allocated || 0) - (vaccine.received || 0);
                              if (deficit > 0) {
                                return (
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: 'bold',
                                      color: '#d32f2f'
                                    }}
                                  >
                                    {deficit}
                                  </Typography>
                                );
                              }
                              return <Typography variant="body2">-</Typography>;
                            })()}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {vaccine.vvmStage === 'Usable' || vaccine.vvmStage === '1' || vaccine.vvmStage === 1 ? 'Usable' :
                                (vaccine.vvmStage === 'Unusable' || vaccine.vvmStage === '2' || vaccine.vvmStage === 2) ? 'Unusable' : '-'}
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
          )}

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
