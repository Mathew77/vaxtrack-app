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
import { preventInvalidKeys } from 'src/utils/preventInvalidkeys';

interface VaccineData {
  name: string;
  allocated: number;
  received: number;
  vvmStage: string;
  batchNumber: string;
  expiryDate: string;
  emptyVials: number;
  unusedVials: number;
}

const VaccineAllocationMccoConfirmView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data, userRole } = location.state || {};

  const updateStatusMutation = useUpdateAllocationStatus();

  const [mfaCode, setMfaCode] = useState('');
  const [safetyBoxesFilled, setSafetyBoxesFilled] = useState('');
  const [safetyBoxesEmpty, setSafetyBoxesEmpty] = useState(data?.safty_box_empty?.toString() || '');
  const [cceFunctionalStatus, setCceFunctionalStatus] = useState('');

  // Helper function to convert VVM stage number to "Stage X" format
  const formatVvmStage = (stage: any) => {
    if (!stage || stage === 0 || stage === '0') return '';
    return `Stage ${stage}`;
  };

  // Helper function to format date from datetime string to YYYY-MM-DD
  const formatDate = (dateStr: any) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().split('T')[0];
    } catch (e) {
      return '';
    }
  };

  // Store original SCS values for comparison
  const originalScsValues = {
    bcg: { vvmStage: formatVvmStage(data?.bcg_vvm_stage_scs), batchNumber: data?.bcg_batch_number_scs || '', expiryDate: formatDate(data?.bcg_expire_date_scs) },
    hepb: { vvmStage: formatVvmStage(data?.hepb_vvm_stage_scs), batchNumber: data?.hepb_batch_number_scs || '', expiryDate: formatDate(data?.hepb_expire_date_scs) },
    bopv: { vvmStage: formatVvmStage(data?.bopv_vvm_stage_scs), batchNumber: data?.bopv_batch_number_scs || '', expiryDate: formatDate(data?.bopv_expire_date_scs) },
    penta: { vvmStage: formatVvmStage(data?.penta_vvm_stage_scs), batchNumber: data?.penta_batch_number_scs || '', expiryDate: formatDate(data?.penta_expire_date_scs) },
    pcv: { vvmStage: formatVvmStage(data?.pcv_vvm_stage_scs), batchNumber: data?.pcv_batch_number_scs || '', expiryDate: formatDate(data?.pcv_expire_date_scs) },
    ipv: { vvmStage: formatVvmStage(data?.ipv_vvm_stage_scs), batchNumber: data?.ipv_batch_number_scs || '', expiryDate: formatDate(data?.ipv_expire_date_scs) },
    mea: { vvmStage: formatVvmStage(data?.mea_vvm_stage_scs), batchNumber: data?.mea_batch_number_scs || '', expiryDate: formatDate(data?.mea_expire_date_scs) },
    yf: { vvmStage: formatVvmStage(data?.yf_vvm_stage_scs), batchNumber: data?.yf_batch_number_scs || '', expiryDate: formatDate(data?.yf_expire_date_scs) },
    td: { vvmStage: formatVvmStage(data?.td_vvm_stage_scs), batchNumber: data?.td_batch_number_scs || '', expiryDate: formatDate(data?.td_expire_date_scs) },
    mena: { vvmStage: formatVvmStage(data?.mena_vvm_stage_scs), batchNumber: data?.mena_batch_number_scs || '', expiryDate: formatDate(data?.mena_expire_date_scs) },
    rota: { vvmStage: formatVvmStage(data?.rota_vvm_stage_scs), batchNumber: data?.rota_batch_number_scs || '', expiryDate: formatDate(data?.rota_expire_date_scs) },
    hpv: { vvmStage: formatVvmStage(data?.hpv_vvm_stage_scs), batchNumber: data?.hpv_batch_number_scs || '', expiryDate: formatDate(data?.hpv_expire_date_scs) },
  };

  const [vaccines, setVaccines] = useState<VaccineData[]>([
    { name: 'BCG', allocated: data?.dose_bcg_allocated || 0, received: 0, vvmStage: originalScsValues.bcg.vvmStage, batchNumber: originalScsValues.bcg.batchNumber, expiryDate: originalScsValues.bcg.expiryDate, emptyVials: 0, unusedVials: 0 },
    { name: 'HepB', allocated: data?.dose_hepb_allocated || 0, received: 0, vvmStage: originalScsValues.hepb.vvmStage, batchNumber: originalScsValues.hepb.batchNumber, expiryDate: originalScsValues.hepb.expiryDate, emptyVials: 0, unusedVials: 0 },
    { name: 'bOPV', allocated: data?.dose_bopv_allocated || 0, received: 0, vvmStage: originalScsValues.bopv.vvmStage, batchNumber: originalScsValues.bopv.batchNumber, expiryDate: originalScsValues.bopv.expiryDate, emptyVials: 0, unusedVials: 0 },
    { name: 'Penta', allocated: data?.dose_penta_allocated || 0, received: 0, vvmStage: originalScsValues.penta.vvmStage, batchNumber: originalScsValues.penta.batchNumber, expiryDate: originalScsValues.penta.expiryDate, emptyVials: 0, unusedVials: 0 },
    { name: 'PCV', allocated: data?.dose_pcv_allocated || 0, received: 0, vvmStage: originalScsValues.pcv.vvmStage, batchNumber: originalScsValues.pcv.batchNumber, expiryDate: originalScsValues.pcv.expiryDate, emptyVials: 0, unusedVials: 0 },
    { name: 'IPV', allocated: data?.dose_ipv_allocated || 0, received: 0, vvmStage: originalScsValues.ipv.vvmStage, batchNumber: originalScsValues.ipv.batchNumber, expiryDate: originalScsValues.ipv.expiryDate, emptyVials: 0, unusedVials: 0 },
    { name: 'Measles', allocated: data?.dose_mea_allocated || 0, received: 0, vvmStage: originalScsValues.mea.vvmStage, batchNumber: originalScsValues.mea.batchNumber, expiryDate: originalScsValues.mea.expiryDate, emptyVials: 0, unusedVials: 0 },
    { name: 'YF', allocated: data?.dose_yf_allocated || 0, received: 0, vvmStage: originalScsValues.yf.vvmStage, batchNumber: originalScsValues.yf.batchNumber, expiryDate: originalScsValues.yf.expiryDate, emptyVials: 0, unusedVials: 0 },
    { name: 'TD', allocated: data?.dose_td_allocated || 0, received: 0, vvmStage: originalScsValues.td.vvmStage, batchNumber: originalScsValues.td.batchNumber, expiryDate: originalScsValues.td.expiryDate, emptyVials: 0, unusedVials: 0 },
    { name: 'MenA', allocated: data?.dose_mena_allocated || 0, received: 0, vvmStage: originalScsValues.mena.vvmStage, batchNumber: originalScsValues.mena.batchNumber, expiryDate: originalScsValues.mena.expiryDate, emptyVials: 0, unusedVials: 0 },
    { name: 'Rota', allocated: data?.dose_rota_allocated || 0, received: 0, vvmStage: originalScsValues.rota.vvmStage, batchNumber: originalScsValues.rota.batchNumber, expiryDate: originalScsValues.rota.expiryDate, emptyVials: 0, unusedVials: 0 },
    { name: 'HPV', allocated: data?.dose_hpv_allocated || 0, received: 0, vvmStage: originalScsValues.hpv.vvmStage, batchNumber: originalScsValues.hpv.batchNumber, expiryDate: originalScsValues.hpv.expiryDate, emptyVials: 0, unusedVials: 0 },
  ]);

  if (!data) {
    return (
      <DashboardContent>
        <Typography variant="h6" color="error">
          No allocation data found
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/vaccine-allocation-batch-detail')}
          sx={{ mt: 2 }}
        >
          Back to List
        </Button>
      </DashboardContent>
    );
  }

  const handleVaccineChange = (index: number, field: string, value: string) => {
    const updatedVaccines = [...vaccines];
    // Convert numeric fields to number for proper comparison
    const numericFields = ['received', 'emptyVials', 'unusedVials'];
    const updatedValue = numericFields.includes(field) ? Number(value) || 0 : value;
    updatedVaccines[index] = { ...updatedVaccines[index], [field]: updatedValue };
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
    if (!validateForm()) {
      return;
    }

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
    // Logic: Only save fields to EHF that MCCO actually changed from SCS values
    const vaccineData: any = {};
    const scsKeys = ['bcg', 'hepb', 'bopv', 'penta', 'pcv', 'ipv', 'mea', 'yf', 'td', 'mena', 'rota', 'hpv'];

    vaccines.forEach((v, idx) => {
      const fieldName = vaccineFieldMap[v.name];
      const scsKey = scsKeys[idx];

      if (fieldName && scsKey) {
        // CRITICAL: Ensure received is ALWAYS a number by parsing it
        const receivedNumber = typeof v.received === 'string' ? parseInt(v.received, 10) : v.received;
        vaccineData[`dose_${fieldName}_received`] = receivedNumber || 0;

        // Add new fields: empty_vials, unused_vials
        const emptyVialsNumber = typeof v.emptyVials === 'string' ? parseInt(v.emptyVials, 10) : v.emptyVials;
        const unusedVialsNumber = typeof v.unusedVials === 'string' ? parseInt(v.unusedVials, 10) : v.unusedVials;

        vaccineData[`${fieldName}_empty_vials`] = emptyVialsNumber || 0;
        vaccineData[`${fieldName}_unused_vials`] = unusedVialsNumber || 0;

        const originalValues = originalScsValues[scsKey as keyof typeof originalScsValues];

        // Check if each field changed individually
        const vvmChanged = v.vvmStage !== originalValues.vvmStage;
        const batchChanged = v.batchNumber !== originalValues.batchNumber;
        const expiryChanged = v.expiryDate !== originalValues.expiryDate;

        // Only save fields that actually changed to EHF fields
        if (vvmChanged) {
          const vvmStageNumber = v.vvmStage ? (
            v.vvmStage.includes('Stage') ? parseInt(v.vvmStage.replace('Stage ', '')) : parseInt(v.vvmStage)
          ) : 0;
          vaccineData[`${fieldName}_vvm_stage_ehf`] = vvmStageNumber;
        }

        if (batchChanged) {
          vaccineData[`${fieldName}_batch_number`] = v.batchNumber || '';
        }

        if (expiryChanged) {
          vaccineData[`${fieldName}_expire_date`] = v.expiryDate || null;
        }

        // If nothing changed, values stay in SCS fields only (already set during allocation)
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
      safty_box_filled: parseInt(safetyBoxesFilled) || 0,
      safty_box_empty: parseInt(safetyBoxesEmpty) || 0,
      cc_functional_status: cceFunctionalStatus || '',
    };

    // Check if all received quantities match allocated quantities
    // If ALL match → Status 4 (Completed)
    // If ANY don't match → Status 3 (Pending LCS Review)
    const hasDiscrepancies = vaccines.some(v => {
      // Only check vaccines that have allocations
      if (v.allocated > 0) {
        // CRITICAL: Convert both to numbers for comparison
        const allocatedNum = Number(v.allocated);
        const receivedNum = typeof v.received === 'string' ? parseInt(v.received, 10) : Number(v.received);
        const mismatch = receivedNum !== allocatedNum;
        return mismatch;
      }
      return false;
    });

    const newStatus = hasDiscrepancies ? 3 : 4;
    const successMessage = hasDiscrepancies
      ? 'Deficit detected. Please transfer the deficit.'
      : 'All vaccines received match allocation! Status: Completed.';


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

  // Show all vaccines (not just allocated ones)
  const allocatedVaccines = vaccines;

  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/vaccine-allocation-batch-detail', {
            state: { batch_no: data.batch_no }
          })}
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
            {allocatedVaccines.map((vaccine) => {
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
                          onKeyDown={preventInvalidKeys}
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
                            min: new Date().toISOString().split('T')[0]
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Empty Vials"
                          type="number"
                          value={vaccine.emptyVials || ''}
                          onChange={(e) => handleVaccineChange(actualIndex, 'emptyVials', e.target.value)}
                          onKeyDown={preventInvalidKeys}
                          inputProps={{ min: 0 }}
                        />
                      </Grid>
                      {/* <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Safety Boxes"
                          type="number"
                          value={vaccine.safetyBoxes || ''}
                          onChange={(e) => handleVaccineChange(actualIndex, 'safetyBoxes', e.target.value)}
                          onKeyDown={preventInvalidKeys}
                          inputProps={{ min: 0 }}
                        />
                      </Grid> */}
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Unused Vials"
                          type="number"
                          value={vaccine.unusedVials || ''}
                          onChange={(e) => handleVaccineChange(actualIndex, 'unusedVials', e.target.value)}
                          onKeyDown={preventInvalidKeys}
                          inputProps={{ min: 0 }}
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
            Additional Information
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>CCE Functional Status</InputLabel>
                <Select
                  value={cceFunctionalStatus}
                  onChange={(e) => setCceFunctionalStatus(e.target.value)}
                  label="CCE Functional Status"
                >
                  <MenuItem value="">
                    <em>Select Status</em>
                  </MenuItem>
                  <MenuItem value="Functional">Functional</MenuItem>
                  <MenuItem value="Non-functional">Non-functional</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Safety Boxes - Filled"
                type="number"
                value={safetyBoxesFilled}
                onChange={(e) => setSafetyBoxesFilled(e.target.value)}
                onKeyDown={preventInvalidKeys}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Safety Boxes - Empty"
                type="number"
                value={safetyBoxesEmpty}
                onChange={(e) => setSafetyBoxesEmpty(e.target.value)}
                onKeyDown={preventInvalidKeys}
                inputProps={{ min: 0 }}
                disabled
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            MFA Verification
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Enter EHF User's 4-digit MFA Code"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                inputProps={{ maxLength: 4 }}
                helperText={`Enter the MFA code for the EHF user at ${data.name_of_ehf || 'this facility'}`}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/vaccine-allocation-batch-detail', {
                state: { batch_no: data.batch_no }
              })}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<CheckCircleOutlineIcon />}
              onClick={() => {
                handleConfirm();
              }}
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
