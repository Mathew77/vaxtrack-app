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
    Select,
    MenuItem,
    FormControl,
    Divider,
    TextField,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { DashboardContent } from 'src/layouts/dashboard';
import { toast } from 'react-toastify';
import { useBulkUpdateAllocationStatus } from 'src/hooks/apis/upload/upload-hook';

// Vaccine types for VVM stage inputs
const VACCINE_TYPES = [
    { key: 'bcg', label: 'BCG', doseKey: 'dose_bcg_allocated' },
    { key: 'hepb', label: 'HepB', doseKey: 'dose_hepb_allocated' },
    { key: 'bopv', label: 'bOPV', doseKey: 'dose_bopv_allocated' },
    { key: 'penta', label: 'Penta', doseKey: 'dose_penta_allocated' },
    { key: 'pcv', label: 'PCV', doseKey: 'dose_pcv_allocated' },
    { key: 'ipv', label: 'IPV', doseKey: 'dose_ipv_allocated' },
    { key: 'mea', label: 'Measles', doseKey: 'dose_mea_allocated' },
    { key: 'yf', label: 'YF', doseKey: 'dose_yf_allocated' },
    { key: 'td', label: 'TD', doseKey: 'dose_td_allocated' },
    { key: 'mena', label: 'MenA', doseKey: 'dose_mena_allocated' },
    { key: 'rota', label: 'Rota', doseKey: 'dose_rota_allocated' },
    { key: 'hpv', label: 'HPV', doseKey: 'dose_hpv_allocated' },
    { key: 'mr', label: 'MR', doseKey: 'dose_mr_allocated' },
    { key: 'malaria', label: 'Malaria', doseKey: 'dose_malaria_allocated' },
];

const VaccineAllocationThreeplConfirmView: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { batch_no, allocations = [] } = location.state || {};

    const bulkUpdateMutation = useBulkUpdateAllocationStatus();

    const [vvmStages, setVvmStages] = useState<Record<string, string>>({
        bcg: 'Usable',
        hepb: 'Usable',
        bopv: 'Usable',
        penta: 'Usable',
        pcv: 'Usable',
        ipv: 'Usable',
        mea: 'Usable',
        yf: 'Usable',
        td: 'Usable',
        mena: 'Usable',
        rota: 'Usable',
        hpv: 'Usable',
        mr: 'Usable',
        malaria: 'Usable',
    });

    // Read pre-computed sum fields from the first allocation (batch-level totals saved on each item)
    const consumableSums = useMemo(() => {
        const first = allocations[0] || {};
        return {
            zerofive: parseInt(first.sum_zerofive_syringe) || 0,
            bopv_dropper: parseInt(first.sum_bopv_dropper) || 0,
            rota_dropper: parseInt(first.sum_rota_dropper) || 0,
            diluent: parseInt(first.sum_diluent) || 0,
            twoml: parseInt(first.sum_twoml_syringe) || 0,
            zerofiveml: parseInt(first.sum_zerofiveml_syringe) || 0,
            fiveml: parseInt(first.sum_fiveml_syringe) || 0,
        };
    }, [allocations]);

    // Get aggregated vaccine totals for the batch
    const batchVaccineTotals = useMemo(() => {
        const totals: Record<string, number> = {};
        VACCINE_TYPES.forEach(vaccine => {
            totals[vaccine.key] = allocations.reduce(
                (sum: number, allocation: any) => sum + (allocation[vaccine.doseKey] || 0),
                0
            );
        });
        return totals;
    }, [allocations]);

    const handleVvmChange = (vaccineKey: string, value: string) => {
        setVvmStages(prev => ({ ...prev, [vaccineKey]: value }));
    };

    const handleConfirm = () => {
        // Create VVM stages map for all allocations (same VVM stages for all)
        const vvmStagesMap: Record<string, Record<string, string>> = {};
        allocations.forEach((allocation: any) => {
            vvmStagesMap[allocation.id.toString()] = { ...vvmStages };
        });

        bulkUpdateMutation.mutate(
            {
                allocations: allocations,
                status: 2, // Pending MCCO Confirmation
                vvmStages: vvmStagesMap,
            },
            {
                onSuccess: () => {
                    toast.success(`Bulk pickup confirmed for ${allocations.length} facilities!`);
                    navigate('/vaccine-allocation-stock-page');
                },
                onError: (error: any) => {
                    toast.error(error?.message || 'Failed to confirm bulk pickup');
                },
            }
        );
    };

    if (!allocations.length) {
        return (
            <DashboardContent>
                <Typography variant="h6">No allocations selected.</Typography>
                <Button onClick={() => navigate(-1)}>Back</Button>
            </DashboardContent>
        );
    }

    return (
        <DashboardContent maxWidth="xl">
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">
                    Confirm Pickup & Delivery (3PL)
                </Typography>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    variant="text"
                >
                    Back
                </Button>
            </Box>

            <Typography variant="body1" sx={{ mb: 3 }}>
                You are about to confirm pickup for <strong>{allocations.length}</strong> facilities
                in batch <strong>{batch_no}</strong>.
            </Typography>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'rgb(12, 125, 64)' }}>
                        Consumables Summary
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <TextField fullWidth type="number" label="Sum of all 0.5ml syringes" value={consumableSums.zerofive} InputProps={{ readOnly: true }} inputProps={{ min: 0 }} />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField fullWidth type="number" label="Sum of bOPV droppers" value={consumableSums.bopv_dropper} InputProps={{ readOnly: true }} inputProps={{ min: 0 }} />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField fullWidth type="number" label="Sum of Rota droppers" value={consumableSums.rota_dropper} InputProps={{ readOnly: true }} inputProps={{ min: 0 }} />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField fullWidth type="number" label="Sum of all diluents" value={consumableSums.diluent} InputProps={{ readOnly: true }} inputProps={{ min: 0 }} />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField fullWidth type="number" label="Sum of all 2ml syringes" value={consumableSums.twoml} InputProps={{ readOnly: true }} inputProps={{ min: 0 }} />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField fullWidth type="number" label="Sum of all 0.05ml syringes" value={consumableSums.zerofiveml} InputProps={{ readOnly: true }} inputProps={{ min: 0 }} />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField fullWidth type="number" label="Sum of all 5ml syringes" value={consumableSums.fiveml} InputProps={{ readOnly: true }} inputProps={{ min: 0 }} />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Enter VVM Stages
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                        Select the VVM stage for each vaccine type. This will be applied to all allocations in this batch.
                    </Typography>

                    <TableContainer component={Paper} variant="outlined">
                        <Table size="medium">
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#f0f0f0' }}>
                                    <TableCell><strong>Vaccine</strong></TableCell>
                                    <TableCell><strong>Total Doses</strong></TableCell>
                                    <TableCell><strong>VVM Stage</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {VACCINE_TYPES.filter(vaccine => batchVaccineTotals[vaccine.key] > 0).map(vaccine => (
                                    <TableRow key={vaccine.key}>
                                        <TableCell>{vaccine.label}</TableCell>
                                        <TableCell>
                                            <Typography fontWeight="bold">
                                                {batchVaccineTotals[vaccine.key]}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <FormControl size="small" sx={{ minWidth: 150 }}>
                                                <Select
                                                    value={vvmStages[vaccine.key]}
                                                    onChange={(e) => handleVvmChange(vaccine.key, e.target.value)}
                                                >
                                                    <MenuItem value="Usable">Usable</MenuItem>
                                                    <MenuItem value="Unusable">Unusable</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => navigate(-1)}
                            disabled={bulkUpdateMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<CheckCircleOutlineIcon />}
                            onClick={handleConfirm}
                            disabled={bulkUpdateMutation.isPending}
                            sx={{
                                background: 'linear-gradient(135deg, rgb(12, 125, 64) 0%, rgb(10, 105, 54) 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, rgb(10, 105, 54) 0%, rgb(12, 125, 64) 100%)',
                                },
                            }}
                        >
                            {bulkUpdateMutation.isPending ? 'Confirming...' : 'Confirm Pickup & Delivery'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </DashboardContent>
    );
};

export default VaccineAllocationThreeplConfirmView;
