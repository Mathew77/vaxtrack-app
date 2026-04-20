import React, { useState, useMemo } from 'react';
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
import { useUpdateAllocationStatus, useBulkUpdateAllocationStatus } from 'src/hooks/apis/upload/upload-hook';
import { preventInvalidKeys } from 'src/utils/preventInvalidkeys';
import { useFetchEHFDetailRoutes } from 'src/hooks/apis/ehf-uhf/ehf-hooks';

interface VaccineData {
  name: string;
  allocated: number;
  received: number | null | string;
  vvmStage: string;
  batchNumber: string;
  expiryDate: string;
  emptyVials: number | null;
  unusedVials: number | null;
}

const VaccineAllocationMccoConfirmView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data, userRole, batchFacilities = [] } = location.state || {};

  const updateStatusMutation = useUpdateAllocationStatus();
  const bulkUpdateMutation = useBulkUpdateAllocationStatus();

  const [mfaCode, setMfaCode] = useState('');
  const [safetyBoxesFilled, setSafetyBoxesFilled] = useState('');
  const [safetyBoxesEmpty, setSafetyBoxesEmpty] = useState(data?.safty_box_empty?.toString() || '');
  const [cceFunctionalStatus, setCceFunctionalStatus] = useState('');
  const [contingencyEhfName, setContingencyEhfName] = useState('');

  const { data: ehfsInLga = [] } = useFetchEHFDetailRoutes(data?.state || '', data?.lga || '');

  const contingencyEhfs = useMemo(
    () => ehfsInLga.filter((ehf: any) => ehf.id !== data?.ehf_id),
    [ehfsInLga, data?.ehf_id]
  );

  const [sumZerofiveSyringe, setSumZerofiveSyringe] = useState<number | string>(data?.sum_zerofive_syringe ?? '');
  const [sumBopvDropper, setSumBopvDropper] = useState<number | string>(data?.sum_bopv_dropper ?? '');
  const [sumRotaDropper, setSumRotaDropper] = useState<number | string>(data?.sum_rota_dropper ?? '');
  const [sumDiluent, setSumDiluent] = useState<number | string>(data?.sum_diluent ?? '');
  const [sumTwomlSyringe, setSumTwomlSyringe] = useState<number | string>(data?.sum_twoml_syringe ?? '');
  const [sumZerofivemlSyringe, setSumZerofivemlSyringe] = useState<number | string>(data?.sum_zerofiveml_syringe ?? '');
  const [sumFivemlSyringe, setSumFivemlSyringe] = useState<number | string>(data?.sum_fiveml_syringe ?? '');

  // Helper function to format VVM stage
  const formatVvmStage = (stage: any) => {
    if (!stage || stage === 0 || stage === '0') return '';
    // If it's already a descriptive string, return it
    if (stage === 'Usable' || stage === 'Unusable') return stage;
    // Handle legacy numeric values if they exist
    if (stage === 1 || stage === '1') return 'Usable';
    if (stage === 2 || stage === '2') return 'Unusable';
    return stage;
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
    mr: { vvmStage: formatVvmStage(data?.mr_vvm_stage_scs), batchNumber: data?.mr_batch_number_scs || '', expiryDate: formatDate(data?.mr_expire_date_scs) },
  };

  const [vaccines, setVaccines] = useState<VaccineData[]>([
    { name: 'BCG', allocated: data?.dose_bcg_allocated || 0, received: null, vvmStage: originalScsValues.bcg.vvmStage, batchNumber: originalScsValues.bcg.batchNumber, expiryDate: originalScsValues.bcg.expiryDate, emptyVials: null, unusedVials: null },
    { name: 'HepB', allocated: data?.dose_hepb_allocated || 0, received: null, vvmStage: originalScsValues.hepb.vvmStage, batchNumber: originalScsValues.hepb.batchNumber, expiryDate: originalScsValues.hepb.expiryDate, emptyVials: null, unusedVials: null },
    { name: 'bOPV', allocated: data?.dose_bopv_allocated || 0, received: null, vvmStage: originalScsValues.bopv.vvmStage, batchNumber: originalScsValues.bopv.batchNumber, expiryDate: originalScsValues.bopv.expiryDate, emptyVials: null, unusedVials: null },
    { name: 'Penta', allocated: data?.dose_penta_allocated || 0, received: null, vvmStage: originalScsValues.penta.vvmStage, batchNumber: originalScsValues.penta.batchNumber, expiryDate: originalScsValues.penta.expiryDate, emptyVials: null, unusedVials: null },
    { name: 'PCV', allocated: data?.dose_pcv_allocated || 0, received: null, vvmStage: originalScsValues.pcv.vvmStage, batchNumber: originalScsValues.pcv.batchNumber, expiryDate: originalScsValues.pcv.expiryDate, emptyVials: null, unusedVials: null },
    { name: 'IPV', allocated: data?.dose_ipv_allocated || 0, received: null, vvmStage: originalScsValues.ipv.vvmStage, batchNumber: originalScsValues.ipv.batchNumber, expiryDate: originalScsValues.ipv.expiryDate, emptyVials: null, unusedVials: null },
    { name: 'Measles', allocated: data?.dose_mea_allocated || 0, received: null, vvmStage: originalScsValues.mea.vvmStage, batchNumber: originalScsValues.mea.batchNumber, expiryDate: originalScsValues.mea.expiryDate, emptyVials: null, unusedVials: null },
    { name: 'YF', allocated: data?.dose_yf_allocated || 0, received: null, vvmStage: originalScsValues.yf.vvmStage, batchNumber: originalScsValues.yf.batchNumber, expiryDate: originalScsValues.yf.expiryDate, emptyVials: null, unusedVials: null },
    { name: 'TD', allocated: data?.dose_td_allocated || 0, received: null, vvmStage: originalScsValues.td.vvmStage, batchNumber: originalScsValues.td.batchNumber, expiryDate: originalScsValues.td.expiryDate, emptyVials: null, unusedVials: null },
    { name: 'MenA', allocated: data?.dose_mena_allocated || 0, received: null, vvmStage: originalScsValues.mena.vvmStage, batchNumber: originalScsValues.mena.batchNumber, expiryDate: originalScsValues.mena.expiryDate, emptyVials: null, unusedVials: null },
    { name: 'Rota', allocated: data?.dose_rota_allocated || 0, received: null, vvmStage: originalScsValues.rota.vvmStage, batchNumber: originalScsValues.rota.batchNumber, expiryDate: originalScsValues.rota.expiryDate, emptyVials: null, unusedVials: null },
    { name: 'HPV', allocated: data?.dose_hpv_allocated || 0, received: null, vvmStage: originalScsValues.hpv.vvmStage, batchNumber: originalScsValues.hpv.batchNumber, expiryDate: originalScsValues.hpv.expiryDate, emptyVials: null, unusedVials: null },
    { name: 'MR', allocated: data?.dose_mr_allocated || 0, received: null, vvmStage: originalScsValues.mr.vvmStage, batchNumber: originalScsValues.mr.batchNumber, expiryDate: originalScsValues.mr.expiryDate, emptyVials: null, unusedVials: null },
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
    const updatedValue = numericFields.includes(field) ? (value === '' ? '' : Number(value)) : value;
    updatedVaccines[index] = { ...updatedVaccines[index], [field]: updatedValue };
    setVaccines(updatedVaccines);
  };

  // Define vaccine multiples for validation
  const vaccineMultiples: Record<string, number> = {
    'BCG': 20,
    'Measles': 10,
    'bOPV': 20,
    'HepB': 10,
    'Penta': 10,
    'PCV': 5,
    'IPV': 10,
    'YF': 10,
    'TD': 10,
    'MenA': 10,
    'Rota': 10,
    'HPV': 1,
    'MR': 10,
  };

  const validateForm = () => {
    // Only validate vaccines that have allocations > 0 or received > 0
    const activeVaccines = vaccines.filter(v => v.allocated > 0 || Number(v.received) > 0);

    for (const vaccine of activeVaccines) {
      if (vaccine.allocated > 0 && (vaccine.received === null || vaccine.received === undefined)) {
        toast.error(`Please enter received amount for ${vaccine.name} (Allocated: ${vaccine.allocated})`);
        return false;
      }

      if (Number(vaccine.received) > 0) {
        // Validate multiples
        const multiple = vaccineMultiples[vaccine.name] || 1;
        if (Number(vaccine.received) % multiple !== 0) {
          toast.error(`${vaccine.name} received quantity must be divisible by ${multiple}`);
          return false;
        }

        // Validate physical stock at hand multiples
        if (Number(vaccine.unusedVials) > 0 && Number(vaccine.unusedVials) % multiple !== 0) {
          toast.error(`${vaccine.name} physical stock at hand must be divisible by ${multiple}`);
          return false;
        }

        // Validate metadata
        if (!vaccine.vvmStage) {
          toast.error(`Please select VVM Stage for ${vaccine.name}`);
          return false;
        }
        if (!vaccine.batchNumber) {
          toast.error(`Please enter Batch Number for ${vaccine.name}`);
          return false;
        }
        if (!vaccine.expiryDate) {
          toast.error(`Please select Expiry Date for ${vaccine.name}`);
          return false;
        }
      }
    }

    if (!cceFunctionalStatus) {
      toast.error('Please select CCE Functional Status');
      return false;
    }

    if (cceFunctionalStatus === 'Non-functional' && !contingencyEhfName) {
      toast.error('Please select a Contingency Equipped Health Facility');
      return false;
    }

    if (safetyBoxesFilled === '') {
      toast.error('Please enter Safety Boxes - Filled');
      return false;
    }

    if (safetyBoxesEmpty === '') {
      toast.error('Please enter Safety Boxes - Empty');
      return false;
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
      'MR': 'mr',
    };

    // Build vaccine data with received amounts, VVM stages, batch numbers, and expiry dates
    // Logic: Only save fields to EHF that MCCO actually changed from SCS values
    const vaccineData: any = {};
    const scsKeys = ['bcg', 'hepb', 'bopv', 'penta', 'pcv', 'ipv', 'mea', 'yf', 'td', 'mena', 'rota', 'hpv', 'mr'];

    vaccines.forEach((v, idx) => {
      const fieldName = vaccineFieldMap[v.name];
      const scsKey = scsKeys[idx];

      if (fieldName && scsKey) {
        // CRITICAL: Ensure received is ALWAYS a number by parsing it
        const receivedNumber = v.received === null || v.received === undefined ? 0 : typeof v.received === 'string' ? parseInt(v.received, 10) : v.received;
        vaccineData[`dose_${fieldName}_received`] = receivedNumber || 0;

        // Add new fields: empty_vials, unused_vials
        const emptyVialsNumber = typeof v.emptyVials === 'string' ? parseInt(v.emptyVials, 10) : v.emptyVials;
        const unusedVialsNumber = typeof v.unusedVials === 'string' ? parseInt(v.unusedVials, 10) : v.unusedVials;

        vaccineData[`${fieldName}_empty_vials`] = emptyVialsNumber || 0;
        vaccineData[`${fieldName}_physical_stock_balance`] = unusedVialsNumber || 0;

        const originalValues = originalScsValues[scsKey as keyof typeof originalScsValues];

        // Check if each field changed individually
        const vvmChanged = v.vvmStage !== originalValues.vvmStage;
        const batchChanged = v.batchNumber !== originalValues.batchNumber;
        const expiryChanged = v.expiryDate !== originalValues.expiryDate;

        // Only save fields that actually changed to EHF fields
        if (vvmChanged) {
          vaccineData[`${fieldName}_vvm_stage_ehf`] = v.vvmStage || '';
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
      dose_mr_actual: data.dose_mr_actual,
      dose_mr_allocated: data.dose_mr_allocated,
      // Add vaccine data (received, vvm_stage, batch_number, expire_date)
      ...vaccineData,
      mcco_mfa_code: mfaCode,
      safty_box_filled: parseInt(safetyBoxesFilled) || 0,
      safty_box_empty: parseInt(safetyBoxesEmpty) || 0,
      cc_functional_status: cceFunctionalStatus || '',
      contingency_ehf_id: cceFunctionalStatus === 'Non-functional' ? contingencyEhfName : null,
      sum_zerofive_syringe: Number(sumZerofiveSyringe) || 0,
      sum_bopv_dropper: Number(sumBopvDropper) || 0,
      sum_rota_dropper: Number(sumRotaDropper) || 0,
      sum_diluent: Number(sumDiluent) || 0,
      sum_twoml_syringe: Number(sumTwomlSyringe) || 0,
      sum_zerofiveml_syringe: Number(sumZerofivemlSyringe) || 0,
      sum_fiveml_syringe: Number(sumFivemlSyringe) || 0,
    };

    // Build a map of current facility's received values by vaccine key
    const currentReceivedMap: Record<string, number> = {};
    vaccines.forEach((v) => {
      const key = vaccineFieldMap[v.name];
      if (key) {
        currentReceivedMap[key] = typeof v.received === 'string' ? parseInt(v.received, 10) || 0 : Number(v.received) || 0;
      }
    });

    const vaccineKeys = ['bcg', 'hepb', 'bopv', 'penta', 'pcv', 'ipv', 'mea', 'yf', 'td', 'mena', 'rota', 'hpv', 'mr'];

    // Other facilities in the same batch (excluding current)
    const otherFacilities = batchFacilities.filter((f: any) => f.id !== data.id);

    // This is the last confirmation if no other facility is still at status 2
    const isLastConfirmation = otherFacilities.length === 0 || otherFacilities.every((f: any) => f.status !== 2);

    let newStatus: number;
    let successMessage: string;

    // Per-facility check (used as fallback and for non-last confirmations)
    const perFacilityHasDiscrepancy = vaccines.some((v) => {
      if (v.allocated > 0) {
        const receivedNum = typeof v.received === 'string' ? parseInt(v.received, 10) : Number(v.received);
        return receivedNum !== Number(v.allocated);
      }
      return false;
    });

    if (isLastConfirmation) {
      // Check batch totals across all facilities
      let batchHasDiscrepancy = false;

      for (const key of vaccineKeys) {
        const batchTotalAllocated = batchFacilities.length > 0
          ? batchFacilities.reduce((sum: number, f: any) => sum + (Number(f[`dose_${key}_allocated`]) || 0), 0)
          : Number(data[`dose_${key}_allocated`]) || 0;

        if (batchTotalAllocated === 0) continue;

        const batchTotalReceived = batchFacilities.length > 0
          ? batchFacilities.reduce((sum: number, f: any) => {
              if (f.id === data.id) return sum + (currentReceivedMap[key] || 0);
              return sum + (Number(f[`dose_${key}_received`]) || 0);
            }, 0)
          : (currentReceivedMap[key] || 0);

        if (batchTotalReceived !== batchTotalAllocated) {
          batchHasDiscrepancy = true;
          break;
        }
      }

      if (!batchHasDiscrepancy) {
        newStatus = 4;
        successMessage = 'Batch total received matches allocation! Status: Completed.';
      } else {
        newStatus = perFacilityHasDiscrepancy ? 3 : 4;
        successMessage = perFacilityHasDiscrepancy
          ? 'Deficit detected. Please transfer the deficit.'
          : 'All vaccines received match allocation! Status: Completed.';
      }
    } else {
      // Not the last facility — use per-facility check
      newStatus = perFacilityHasDiscrepancy ? 3 : 4;
      successMessage = perFacilityHasDiscrepancy
        ? 'Deficit detected. Please transfer the deficit.'
        : 'All vaccines received match allocation! Status: Completed.';
    }

    // If this is the last confirmation and batch balances, upgrade any status-3 facilities to completed
    const facilitiesToComplete = (newStatus === 4 && isLastConfirmation)
      ? otherFacilities.filter((f: any) => f.status === 3)
      : [];

    updateStatusMutation.mutate(
      { id: data.id, status: newStatus, data: updatePayload },
      {
        onSuccess: () => {
          if (facilitiesToComplete.length > 0) {
            bulkUpdateMutation.mutate(
              { allocations: facilitiesToComplete, status: 4 },
              {
                onSuccess: () => {
                  toast.success(successMessage);
                  navigate('/vaccine-allocation-batch-detail', { state: { batch_no: data.batch_no } });
                },
                onError: () => {
                  toast.success(successMessage);
                  navigate('/vaccine-allocation-batch-detail', { state: { batch_no: data.batch_no } });
                },
              }
            );
          } else {
            toast.success(successMessage);
            navigate('/vaccine-allocation-batch-detail', { state: { batch_no: data.batch_no } });
          }
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

            {data.contingency_ehf_id && (
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Contingency EHF
                </Typography>
                <Typography variant="body1" gutterBottom sx={{ color: '#d32f2f', fontWeight: 600 }}>
                  {data.contingency_ehf_id}
                </Typography>
              </Grid>
            )}

            {data.cc_functional_status && (
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  CCE Functional Status
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{ color: data.cc_functional_status === 'Non-functional' ? '#d32f2f' : '#2e7d32', fontWeight: 600 }}
                >
                  {data.cc_functional_status}
                </Typography>
              </Grid>
            )}
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
                          value={vaccine.received ?? ''}
                          onChange={(e) => handleVaccineChange(actualIndex, 'received', e.target.value)}
                          onKeyDown={preventInvalidKeys}
                          inputProps={{ min: 0 }}
                          error={Number(vaccine.received) > 0 && Number(vaccine.received) % (vaccineMultiples[vaccine.name] || 1) !== 0}
                          helperText={
                            Number(vaccine.received) > 0 && Number(vaccine.received) % (vaccineMultiples[vaccine.name] || 1) !== 0
                              ? `Must be divisible by ${vaccineMultiples[vaccine.name] || 1}`
                              : ''
                          }
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                          <InputLabel required={Number(vaccine.received) > 0}>VVM Stage</InputLabel>
                          <Select
                            value={vaccine.vvmStage}
                            onChange={(e) => handleVaccineChange(actualIndex, 'vvmStage', e.target.value)}
                            label="VVM Stage"
                            required={Number(vaccine.received) > 0}
                          >
                            <MenuItem value="Usable">Usable</MenuItem>
                            <MenuItem value="Unusable">Unusable</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField
                          fullWidth
                          label="Batch Number"
                          value={vaccine.batchNumber}
                          onChange={(e) => handleVaccineChange(actualIndex, 'batchNumber', e.target.value)}
                          required={Number(vaccine.received) > 0}
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
                          required={Number(vaccine.received) > 0}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Empty Vials"
                          type="number"
                          value={vaccine.emptyVials ?? ''}
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
                          label="Physical Stock at Hand"
                          type="number"
                          value={vaccine.unusedVials ?? ''}
                          onChange={(e) => handleVaccineChange(actualIndex, 'unusedVials', e.target.value)}
                          onKeyDown={preventInvalidKeys}
                          inputProps={{ min: 0 }}
                          error={Number(vaccine.unusedVials) > 0 && Number(vaccine.unusedVials) % (vaccineMultiples[vaccine.name] || 1) !== 0}
                          helperText={
                            Number(vaccine.unusedVials) > 0 && Number(vaccine.unusedVials) % (vaccineMultiples[vaccine.name] || 1) !== 0
                              ? `Must be divisible by ${vaccineMultiples[vaccine.name] || 1}`
                              : ''
                          }
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
            <Grid item xs={12} md={4}>
              <TextField fullWidth type="number" label="Sum of all 0.5ml syringes" value={sumZerofiveSyringe} onChange={(e) => setSumZerofiveSyringe(e.target.value === '' ? '' : Number(e.target.value))} onKeyDown={preventInvalidKeys} inputProps={{ min: 0 }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth type="number" label="Sum of bOPV droppers" value={sumBopvDropper} onChange={(e) => setSumBopvDropper(e.target.value === '' ? '' : Number(e.target.value))} onKeyDown={preventInvalidKeys} inputProps={{ min: 0 }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth type="number" label="Sum of Rota droppers" value={sumRotaDropper} onChange={(e) => setSumRotaDropper(e.target.value === '' ? '' : Number(e.target.value))} onKeyDown={preventInvalidKeys} inputProps={{ min: 0 }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth type="number" label="Sum of all diluents" value={sumDiluent} onChange={(e) => setSumDiluent(e.target.value === '' ? '' : Number(e.target.value))} onKeyDown={preventInvalidKeys} inputProps={{ min: 0 }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth type="number" label="Sum of all 2ml syringes" value={sumTwomlSyringe} onChange={(e) => setSumTwomlSyringe(e.target.value === '' ? '' : Number(e.target.value))} onKeyDown={preventInvalidKeys} inputProps={{ min: 0 }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth type="number" label="Sum of all 0.05ml syringes" value={sumZerofivemlSyringe} onChange={(e) => setSumZerofivemlSyringe(e.target.value === '' ? '' : Number(e.target.value))} onKeyDown={preventInvalidKeys} inputProps={{ min: 0 }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth type="number" label="Sum of all 5ml syringes" value={sumFivemlSyringe} onChange={(e) => setSumFivemlSyringe(e.target.value === '' ? '' : Number(e.target.value))} onKeyDown={preventInvalidKeys} inputProps={{ min: 0 }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>CCE Functional Status</InputLabel>
                <Select
                  value={cceFunctionalStatus}
                  onChange={(e) => setCceFunctionalStatus(e.target.value)}
                  label="CCE Functional Status"
                  required
                >
                  <MenuItem value="">
                    <em>Select Status</em>
                  </MenuItem>
                  <MenuItem value="Functional">Functional</MenuItem>
                  <MenuItem value="Non-functional">Non-functional</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {cceFunctionalStatus === 'Non-functional' && (
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Contingency Equipped Health Facility</InputLabel>
                  <Select
                    value={contingencyEhfName}
                    onChange={(e) => setContingencyEhfName(e.target.value)}
                    label="Contingency Equipped Health Facility"
                  >
                    <MenuItem value="">
                      <em>Select facility</em>
                    </MenuItem>
                    {contingencyEhfs.map((ehf: any) => (
                      <MenuItem key={ehf.id} value={ehf.name_of_ehf || ehf.ehf_name}>
                        {ehf.name_of_ehf || ehf.ehf_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Safety Boxes - Filled"
                type="number"
                value={safetyBoxesFilled}
                onChange={(e) => setSafetyBoxesFilled(e.target.value)}
                onKeyDown={preventInvalidKeys}
                inputProps={{ min: 0 }}
                required
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
                required
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
