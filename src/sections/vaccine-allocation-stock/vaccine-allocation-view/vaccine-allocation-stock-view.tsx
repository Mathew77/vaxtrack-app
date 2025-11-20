import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Grid, Paper, TextField, Button, LinearProgress, Chip, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { StockAtHandData } from 'src/hooks/apis/upload/upload-type';
import { useSubmitAllocation } from 'src/hooks/apis/upload/upload-hook';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from 'react-toastify';
import { preventInvalidKeys } from 'src/utils/preventInvalidkeys';

interface AllocationData {
    dose_bcg: number;
    dose_hepb: number;
    dose_bopv: number;
    dose_penta: number;
    dose_pcv: number;
    dose_ipv: number;
    dose_mea: number;
    dose_yf: number;
    dose_td: number;
    dose_mena: number;
    dose_rota: number;
    dose_hpv: number;
}

interface VaccineMetadata {
    vvm_stage: string;
    batch_number: string;
    expire_date: string;
}

export default function VaccineAllocationStock() {
    const location = useLocation();
    const navigate = useNavigate();
    const { data, isView } = location.state || {};
    const stockData = data as StockAtHandData;
    const submitAllocation = useSubmitAllocation();

    // Get user information from sessionStorage
    const userState = sessionStorage.getItem('userState') || null;
    const userData = userState ? JSON.parse(userState) : null;
    const userRole = sessionStorage.getItem('userRole') || '';
    const isViewMode = isView === true; // View-only mode for SLWG

    const [allocationData, setAllocationData] = useState<Record<keyof AllocationData, string>>({
        dose_bcg: '',
        dose_hepb: '',
        dose_bopv: '',
        dose_penta: '',
        dose_pcv: '',
        dose_ipv: '',
        dose_mea: '',
        dose_yf: '',
        dose_td: '',
        dose_mena: '',
        dose_rota: '',
        dose_hpv: '',
    });

    // Metadata for each vaccine type (VVM, batch number, expiry date)
    const [metadataMap, setMetadataMap] = useState<Record<keyof AllocationData, VaccineMetadata>>({
        dose_bcg: { vvm_stage: '', batch_number: '', expire_date: '' },
        dose_hepb: { vvm_stage: '', batch_number: '', expire_date: '' },
        dose_bopv: { vvm_stage: '', batch_number: '', expire_date: '' },
        dose_penta: { vvm_stage: '', batch_number: '', expire_date: '' },
        dose_pcv: { vvm_stage: '', batch_number: '', expire_date: '' },
        dose_ipv: { vvm_stage: '', batch_number: '', expire_date: '' },
        dose_mea: { vvm_stage: '', batch_number: '', expire_date: '' },
        dose_yf: { vvm_stage: '', batch_number: '', expire_date: '' },
        dose_td: { vvm_stage: '', batch_number: '', expire_date: '' },
        dose_mena: { vvm_stage: '', batch_number: '', expire_date: '' },
        dose_rota: { vvm_stage: '', batch_number: '', expire_date: '' },
        dose_hpv: { vvm_stage: '', batch_number: '', expire_date: '' },
    });

    const [period, setPeriod] = useState<string>('');

    const handleInputChange = (vaccine: keyof AllocationData, value: string) => {
        // Allow empty string or valid numbers
        if (value === '' || /^\d+$/.test(value)) {
            setAllocationData((prev) => ({
                ...prev,
                [vaccine]: value,
            }));
        }
    };

    const handleMetadataChange = (
        vaccine: keyof AllocationData,
        field: keyof VaccineMetadata,
        value: string
    ) => {
        setMetadataMap((prev) => ({
            ...prev,
            [vaccine]: {
                ...prev[vaccine],
                [field]: value,
            },
        }));
    };

    // Helper function to get progress bar color based on allocation
    const getProgressColor = (vaccine: keyof AllocationData) => {
        const allocated = parseInt(allocationData[vaccine]) || 0;
        const actual = stockData[vaccine] as number;

        if (allocated === 0 || actual === 0) {
            return 'grey.400';
        }

        if (allocated > actual) {
            return 'error.main'; 
        }

        const percentage = (allocated / actual) * 100;

        if (percentage >= 40 && percentage <= 60) {
            return 'warning.main'; 
        } else {
            return 'success.main'; 
        }
    };

    // Helper function to get border color based on allocation
    const getBorderColor = (vaccine: keyof AllocationData) => {
        const allocated = parseInt(allocationData[vaccine]) || 0;
        const actual = stockData[vaccine] as number;

        if (allocated === 0) {
            return stockData[vaccine] > 0 ? 'success.light' : 'error.light';
        }

        if (allocated > actual) {
            return 'error.main'; 
        }

        const percentage = (allocated / actual) * 100;

        if (percentage >= 40 && percentage <= 60) {
            return 'warning.main'; 
        } else {
            return 'success.light';
        }
    };

    const handleSubmit = async () => {
        // Check if period is provided
        if (!period.trim()) {
            toast.error('Please enter a period');
            return;
        }

        // Check if at least one vaccine is allocated
        const hasAllocation = Object.values(allocationData).some((value) => Number(value) > 0);

        if (!hasAllocation) {
            toast.error('Please allocate at least one vaccine');
            return;
        }

        try {
            const submissionData = {
                ehf_id: stockData.id,
                assigned_unique_id: stockData.assigned_unique_id,
                period: period,
                dose_bcg_actual: stockData.dose_bcg || 0,
                dose_bcg_allocated: parseInt(allocationData.dose_bcg) || 0,
                bcg_vvm_stage_scs: parseInt(metadataMap.dose_bcg.vvm_stage) || 0,
                bcg_batch_number_scs: metadataMap.dose_bcg.batch_number || '',
                bcg_expire_date_scs: metadataMap.dose_bcg.expire_date || null,

                dose_hepb_actual: stockData.dose_hepb || 0,
                dose_hepb_allocated: parseInt(allocationData.dose_hepb) || 0,
                hepb_vvm_stage_scs: parseInt(metadataMap.dose_hepb.vvm_stage) || 0,
                hepb_batch_number_scs: metadataMap.dose_hepb.batch_number || '',
                hepb_expire_date_scs: metadataMap.dose_hepb.expire_date || null,

                dose_bopv_actual: stockData.dose_bopv || 0,
                dose_bopv_allocated: parseInt(allocationData.dose_bopv) || 0,
                bopv_vvm_stage_scs: parseInt(metadataMap.dose_bopv.vvm_stage) || 0,
                bopv_batch_number_scs: metadataMap.dose_bopv.batch_number || '',
                bopv_expire_date_scs: metadataMap.dose_bopv.expire_date || null,

                dose_penta_actual: stockData.dose_penta || 0,
                dose_penta_allocated: parseInt(allocationData.dose_penta) || 0,
                penta_vvm_stage_scs: parseInt(metadataMap.dose_penta.vvm_stage) || 0,
                penta_batch_number_scs: metadataMap.dose_penta.batch_number || '',
                penta_expire_date_scs: metadataMap.dose_penta.expire_date || null,

                dose_pcv_actual: stockData.dose_pcv || 0,
                dose_pcv_allocated: parseInt(allocationData.dose_pcv) || 0,
                pcv_vvm_stage_scs: parseInt(metadataMap.dose_pcv.vvm_stage) || 0,
                pcv_batch_number_scs: metadataMap.dose_pcv.batch_number || '',
                pcv_expire_date_scs: metadataMap.dose_pcv.expire_date || null,

                dose_ipv_actual: stockData.dose_ipv || 0,
                dose_ipv_allocated: parseInt(allocationData.dose_ipv) || 0,
                ipv_vvm_stage_scs: parseInt(metadataMap.dose_ipv.vvm_stage) || 0,
                ipv_batch_number_scs: metadataMap.dose_ipv.batch_number || '',
                ipv_expire_date_scs: metadataMap.dose_ipv.expire_date || null,

                dose_mea_actual: stockData.dose_mea || 0,
                dose_mea_allocated: parseInt(allocationData.dose_mea) || 0,
                mea_vvm_stage_scs: parseInt(metadataMap.dose_mea.vvm_stage) || 0,
                mea_batch_number_scs: metadataMap.dose_mea.batch_number || '',
                mea_expire_date_scs: metadataMap.dose_mea.expire_date || null,

                dose_yf_actual: stockData.dose_yf || 0,
                dose_yf_allocated: parseInt(allocationData.dose_yf) || 0,
                yf_vvm_stage_scs: parseInt(metadataMap.dose_yf.vvm_stage) || 0,
                yf_batch_number_scs: metadataMap.dose_yf.batch_number || '',
                yf_expire_date_scs: metadataMap.dose_yf.expire_date || null,

                dose_td_actual: stockData.dose_td || 0,
                dose_td_allocated: parseInt(allocationData.dose_td) || 0,
                td_vvm_stage_scs: parseInt(metadataMap.dose_td.vvm_stage) || 0,
                td_batch_number_scs: metadataMap.dose_td.batch_number || '',
                td_expire_date_scs: metadataMap.dose_td.expire_date || null,

                dose_mena_actual: stockData.dose_mena || 0,
                dose_mena_allocated: parseInt(allocationData.dose_mena) || 0,
                mena_vvm_stage_scs: parseInt(metadataMap.dose_mena.vvm_stage) || 0,
                mena_batch_number_scs: metadataMap.dose_mena.batch_number || '',
                mena_expire_date_scs: metadataMap.dose_mena.expire_date || null,

                dose_rota_actual: stockData.dose_rota || 0,
                dose_rota_allocated: parseInt(allocationData.dose_rota) || 0,
                rota_vvm_stage_scs: parseInt(metadataMap.dose_rota.vvm_stage) || 0,
                rota_batch_number_scs: metadataMap.dose_rota.batch_number || '',
                rota_expire_date_scs: metadataMap.dose_rota.expire_date || null,

                dose_hpv_actual: stockData.dose_hpv || 0,
                dose_hpv_allocated: parseInt(allocationData.dose_hpv) || 0,
                hpv_vvm_stage_scs: parseInt(metadataMap.dose_hpv.vvm_stage) || 0,
                hpv_batch_number_scs: metadataMap.dose_hpv.batch_number || '',
                hpv_expire_date_scs: metadataMap.dose_hpv.expire_date || null,

                slwg_user: userData?.id || null,
                // Status: 0 = Pending SCS (SLWG allocated), 1 = Pending 3PL (SCS allocated/confirmed)
                status: userRole === 'scs' ? 1 : 0,
            };

            await submitAllocation.mutateAsync(submissionData);
            toast.success('Vaccine allocation submitted successfully!');

            // Navigate back to Vaccine Allocated tab immediately
            navigate('/vaccine-allocation-stock-page', { state: { activeTab: 1 } });
        } catch (err: any) {
            toast.error(err.message || 'Failed to submit allocation');
        }
    };

    if (!stockData) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography variant="h5">No data available</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
                <Typography variant="h5">
                    {isViewMode ? 'View Stock Details' : 'Allocate Vaccine'} - {stockData.name_of_ehf}
                </Typography>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/vaccine-allocation-stock-page')}>
                    Back
                </Button>
            </Box>

            <Card>
                <CardContent sx={{ py: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 600 }}>
                        EHF Details
                    </Typography>
                    <Grid container spacing={1.5}>
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 1.5, bgcolor: 'background.default' }}>
                                <Typography variant="caption" color="text.secondary">
                                    EHF Name
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>{stockData.name_of_ehf}</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 1.5, bgcolor: 'background.default' }}>
                                <Typography variant="caption" color="text.secondary">
                                    Unique ID
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>{stockData.assigned_unique_id}</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 1.5, bgcolor: 'background.default' }}>
                                <Typography variant="caption" color="text.secondary">
                                    State
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>{stockData.state}</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 1.5, bgcolor: 'background.default' }}>
                                <Typography variant="caption" color="text.secondary">
                                    LGA
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>{stockData.lga}</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 1.5, bgcolor: 'background.default' }}>
                                <Typography variant="caption" color="text.secondary">
                                    Ward
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>{stockData.ward}</Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {!isViewMode && (
                <Card sx={{ mt: 3 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Allocation Period
                        </Typography>
                        <TextField
                            fullWidth
                            type="date"
                            label="Period"
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            required
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                max: new Date().toISOString().split('T')[0]
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': { borderColor: 'rgb(12, 125, 64)' },
                                    '&.Mui-focused fieldset': { borderColor: 'rgb(12, 125, 64)' }
                                }
                            }}
                        />
                    </CardContent>
                </Card>
            )}

            {!isViewMode && (
                <Card sx={{ mt: 3, background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <VaccinesIcon sx={{ fontSize: 32, color: 'rgb(12, 125, 64)', mr: 1 }} />
                        <Typography variant="h5" sx={{ fontWeight: 600, color: 'rgb(12, 125, 64)' }}>
                            Allocate Vaccines
                        </Typography>
                    </Box>
                    <Grid container spacing={1.5}>
                        {/* BCG */}
                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2.5,
                                    borderRadius: 1,
                                    border: '2px solid',
                                    borderColor: getBorderColor('dose_bcg'),
                                    transition: 'all 0.3s ease',
                                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LocalHospitalIcon sx={{ color: 'rgb(12, 125, 64)' }} />
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>BCG</Typography>
                                    </Box>
                                    <Chip
                                        label={`Available: ${stockData.dose_bcg}`}
                                        color={stockData.dose_bcg > 100 ? "success" : stockData.dose_bcg > 0 ? "warning" : "error"}
                                        size="small"
                                    />
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={stockData.dose_bcg > 0 ? Math.min((stockData.dose_bcg / 1000) * 100, 100) : 0}
                                    sx={{
                                        mb: 2,
                                        height: 8,
                                        borderRadius: 4,
                                        bgcolor: 'grey.200',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: getProgressColor('dose_bcg')
                                        }
                                    }}
                                />
                                <TextField
                                    type="number"
                                    fullWidth
                                    label="Quantity to Allocate"
                                    value={allocationData.dose_bcg}
                                    onChange={(e) => handleInputChange('dose_bcg', e.target.value)}
                                    onKeyDown={preventInvalidKeys}
                                    inputProps={{ min: 0, max: stockData.dose_bcg }}
                                    placeholder="Enter quantity to allocate"
                                    sx={{
                                        mb: 2,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            '&:hover fieldset': { borderColor: 'rgb(12, 125, 64)' },
                                            '&.Mui-focused fieldset': { borderColor: 'rgb(12, 125, 64)' }
                                        }
                                    }}
                                />
                                {allocationData.dose_bcg && (
                                    <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                                        Remaining: {stockData.dose_bcg - (parseInt(allocationData.dose_bcg) || 0)}
                                    </Typography>
                                )}
                                {userRole === 'scs' && parseInt(allocationData.dose_bcg) > 0 && (
                                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                                        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#666' }}>
                                            Vaccine Details
                                        </Typography>
                                        <Grid container spacing={1.5}>
                                            <Grid item xs={12}>
                                                <FormControl fullWidth size="small">
                                                    <InputLabel>VVM Stage</InputLabel>
                                                    <Select
                                                        value={metadataMap.dose_bcg.vvm_stage}
                                                        onChange={(e) => handleMetadataChange('dose_bcg', 'vvm_stage', e.target.value)}
                                                        label="VVM Stage"
                                                    >
                                                        <MenuItem value="">Select Stage</MenuItem>
                                                        <MenuItem value="1">Stage 1</MenuItem>
                                                        <MenuItem value="2">Stage 2</MenuItem>
                                                        <MenuItem value="3">Stage 3</MenuItem>
                                                        <MenuItem value="4">Stage 4</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Batch Number"
                                                    value={metadataMap.dose_bcg.batch_number}
                                                    onChange={(e) => handleMetadataChange('dose_bcg', 'batch_number', e.target.value)}
                                                    placeholder="Enter batch number"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    type="date"
                                                    label="Earliest Expiry Date"
                                                    value={metadataMap.dose_bcg.expire_date}
                                                    onChange={(e) => handleMetadataChange('dose_bcg', 'expire_date', e.target.value)}
                                                    InputLabelProps={{ shrink: true }}
                                                    inputProps={{ min: new Date().toISOString().split('T')[0] }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )}
                            </Paper>
                        </Grid>

                        {/* HepB */}
                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2.5,
                                    borderRadius: 1,
                                    border: '2px solid',
                                    borderColor: getBorderColor('dose_hepb'),
                                    transition: 'all 0.3s ease',
                                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LocalHospitalIcon sx={{ color: 'rgb(12, 125, 64)' }} />
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>HepB</Typography>
                                    </Box>
                                    <Chip
                                        label={`Available: ${stockData.dose_hepb}`}
                                        color={stockData.dose_hepb > 100 ? "success" : stockData.dose_hepb > 0 ? "warning" : "error"}
                                        size="small"
                                    />
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={stockData.dose_hepb > 0 ? Math.min((stockData.dose_hepb / 1000) * 100, 100) : 0}
                                    sx={{
                                        mb: 2,
                                        height: 8,
                                        borderRadius: 4,
                                        bgcolor: 'grey.200',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: getProgressColor('dose_hepb')
                                        }
                                    }}
                                />
                                <TextField
                                    type="number"
                                    fullWidth
                                    label="Quantity to Allocate"
                                    value={allocationData.dose_hepb}
                                    onChange={(e) => handleInputChange('dose_hepb', e.target.value)}
                                    onKeyDown={preventInvalidKeys}
                                    inputProps={{ min: 0, max: stockData.dose_hepb }}
                                    placeholder="Enter quantity to allocate"
                                    sx={{
                                        mb: 2,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            '&:hover fieldset': { borderColor: 'rgb(12, 125, 64)' },
                                            '&.Mui-focused fieldset': { borderColor: 'rgb(12, 125, 64)' }
                                        }
                                    }}
                                />
                                {allocationData.dose_hepb && (
                                    <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                                        Remaining: {stockData.dose_hepb - (parseInt(allocationData.dose_hepb) || 0)}
                                    </Typography>
                                )}
                                {userRole === 'scs' && parseInt(allocationData.dose_hepb) > 0 && (
                                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                                        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#666' }}>
                                            Vaccine Details
                                        </Typography>
                                        <Grid container spacing={1.5}>
                                            <Grid item xs={12}>
                                                <FormControl fullWidth size="small">
                                                    <InputLabel>VVM Stage</InputLabel>
                                                    <Select
                                                        value={metadataMap.dose_hepb.vvm_stage}
                                                        onChange={(e) => handleMetadataChange('dose_hepb', 'vvm_stage', e.target.value)}
                                                        label="VVM Stage"
                                                    >
                                                        <MenuItem value="">Select Stage</MenuItem>
                                                        <MenuItem value="1">Stage 1</MenuItem>
                                                        <MenuItem value="2">Stage 2</MenuItem>
                                                        <MenuItem value="3">Stage 3</MenuItem>
                                                        <MenuItem value="4">Stage 4</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField fullWidth size="small" label="Batch Number" value={metadataMap.dose_hepb.batch_number} onChange={(e) => handleMetadataChange('dose_hepb', 'batch_number', e.target.value)} placeholder="Enter batch number" />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField fullWidth size="small" type="date" label="Earliest Expiry Date" value={metadataMap.dose_hepb.expire_date} onChange={(e) => handleMetadataChange('dose_hepb', 'expire_date', e.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ min: new Date().toISOString().split('T')[0] }} />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )}
                            </Paper>
                        </Grid>

                        {/* bOPV */}
                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2.5,
                                    borderRadius: 1,
                                    border: '2px solid',
                                    borderColor: getBorderColor('dose_bopv'),
                                    transition: 'all 0.3s ease',
                                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LocalHospitalIcon sx={{ color: 'rgb(12, 125, 64)' }} />
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>bOPV</Typography>
                                    </Box>
                                    <Chip
                                        label={`Available: ${stockData.dose_bopv}`}
                                        color={stockData.dose_bopv > 100 ? "success" : stockData.dose_bopv > 0 ? "warning" : "error"}
                                        size="small"
                                    />
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={stockData.dose_bopv > 0 ? Math.min((stockData.dose_bopv / 1000) * 100, 100) : 0}
                                    sx={{
                                        mb: 2,
                                        height: 8,
                                        borderRadius: 4,
                                        bgcolor: 'grey.200',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: getProgressColor('dose_bopv')
                                        }
                                    }}
                                />
                                <TextField
                                    type="number"
                                    fullWidth
                                    label="Quantity to Allocate"
                                    value={allocationData.dose_bopv}
                                    onChange={(e) => handleInputChange('dose_bopv', e.target.value)}
                                    onKeyDown={preventInvalidKeys}
                                    inputProps={{ min: 0, max: stockData.dose_bopv }}
                                    placeholder="Enter quantity to allocate"
                                    sx={{
                                        mb: 2,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            '&:hover fieldset': { borderColor: 'rgb(12, 125, 64)' },
                                            '&.Mui-focused fieldset': { borderColor: 'rgb(12, 125, 64)' }
                                        }
                                    }}
                                />
                                {allocationData.dose_bopv && (
                                    <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                                        Remaining: {stockData.dose_bopv - (parseInt(allocationData.dose_bopv) || 0)}
                                    </Typography>
                                )}
                                {userRole === 'scs' && parseInt(allocationData.dose_bopv) > 0 && (
                                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                                        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#666' }}>
                                            Vaccine Details
                                        </Typography>
                                        <Grid container spacing={1.5}>
                                            <Grid item xs={12}>
                                                <FormControl fullWidth size="small">
                                                    <InputLabel>VVM Stage</InputLabel>
                                                    <Select
                                                        value={metadataMap.dose_bopv.vvm_stage}
                                                        onChange={(e) => handleMetadataChange('dose_bopv', 'vvm_stage', e.target.value)}
                                                        label="VVM Stage"
                                                    >
                                                        <MenuItem value="">Select Stage</MenuItem>
                                                        <MenuItem value="1">Stage 1</MenuItem>
                                                        <MenuItem value="2">Stage 2</MenuItem>
                                                        <MenuItem value="3">Stage 3</MenuItem>
                                                        <MenuItem value="4">Stage 4</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField fullWidth size="small" label="Batch Number" value={metadataMap.dose_bopv.batch_number} onChange={(e) => handleMetadataChange('dose_bopv', 'batch_number', e.target.value)} placeholder="Enter batch number" />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField fullWidth size="small" type="date" label="Earliest Expiry Date" value={metadataMap.dose_bopv.expire_date} onChange={(e) => handleMetadataChange('dose_bopv', 'expire_date', e.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ min: new Date().toISOString().split('T')[0] }} />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )}
                            </Paper>
                        </Grid>

                        {/* Penta */}
                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2.5,
                                    borderRadius: 1,
                                    border: '2px solid',
                                    borderColor: getBorderColor('dose_penta'),
                                    transition: 'all 0.3s ease',
                                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LocalHospitalIcon sx={{ color: 'rgb(12, 125, 64)' }} />
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>Penta</Typography>
                                    </Box>
                                    <Chip
                                        label={`Available: ${stockData.dose_penta}`}
                                        color={stockData.dose_penta > 100 ? "success" : stockData.dose_penta > 0 ? "warning" : "error"}
                                        size="small"
                                    />
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={stockData.dose_penta > 0 ? Math.min((stockData.dose_penta / 1000) * 100, 100) : 0}
                                    sx={{
                                        mb: 2,
                                        height: 8,
                                        borderRadius: 4,
                                        bgcolor: 'grey.200',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: getProgressColor('dose_penta')
                                        }
                                    }}
                                />
                                <TextField
                                    type="number"
                                    fullWidth
                                    label="Quantity to Allocate"
                                    value={allocationData.dose_penta}
                                    onChange={(e) => handleInputChange('dose_penta', e.target.value)}
                                    onKeyDown={preventInvalidKeys}
                                    inputProps={{ min: 0, max: stockData.dose_penta }}
                                    placeholder="Enter quantity to allocate"
                                    sx={{
                                        mb: 2,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            '&:hover fieldset': { borderColor: 'rgb(12, 125, 64)' },
                                            '&.Mui-focused fieldset': { borderColor: 'rgb(12, 125, 64)' }
                                        }
                                    }}
                                />
                                {allocationData.dose_penta && (
                                    <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                                        Remaining: {stockData.dose_penta - (parseInt(allocationData.dose_penta) || 0)}
                                    </Typography>
                                )}
                                {userRole === 'scs' && parseInt(allocationData.dose_penta) > 0 && (
                                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                                        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#666' }}>
                                            Vaccine Details
                                        </Typography>
                                        <Grid container spacing={1.5}>
                                            <Grid item xs={12}>
                                                <FormControl fullWidth size="small">
                                                    <InputLabel>VVM Stage</InputLabel>
                                                    <Select
                                                        value={metadataMap.dose_penta.vvm_stage}
                                                        onChange={(e) => handleMetadataChange('dose_penta', 'vvm_stage', e.target.value)}
                                                        label="VVM Stage"
                                                    >
                                                        <MenuItem value="">Select Stage</MenuItem>
                                                        <MenuItem value="1">Stage 1</MenuItem>
                                                        <MenuItem value="2">Stage 2</MenuItem>
                                                        <MenuItem value="3">Stage 3</MenuItem>
                                                        <MenuItem value="4">Stage 4</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField fullWidth size="small" label="Batch Number" value={metadataMap.dose_penta.batch_number} onChange={(e) => handleMetadataChange('dose_penta', 'batch_number', e.target.value)} placeholder="Enter batch number" />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField fullWidth size="small" type="date" label="Earliest Expiry Date" value={metadataMap.dose_penta.expire_date} onChange={(e) => handleMetadataChange('dose_penta', 'expire_date', e.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ min: new Date().toISOString().split('T')[0] }} />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )}
                            </Paper>
                        </Grid>

                        {/* PCV */}
                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2.5,
                                    borderRadius: 1,
                                    border: '2px solid',
                                    borderColor: getBorderColor('dose_pcv'),
                                    transition: 'all 0.3s ease',
                                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LocalHospitalIcon sx={{ color: 'rgb(12, 125, 64)' }} />
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>PCV</Typography>
                                    </Box>
                                    <Chip
                                        label={`Available: ${stockData.dose_pcv}`}
                                        color={stockData.dose_pcv > 100 ? "success" : stockData.dose_pcv > 0 ? "warning" : "error"}
                                        size="small"
                                    />
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={stockData.dose_pcv > 0 ? Math.min((stockData.dose_pcv / 1000) * 100, 100) : 0}
                                    sx={{
                                        mb: 2,
                                        height: 8,
                                        borderRadius: 4,
                                        bgcolor: 'grey.200',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: getProgressColor('dose_pcv')
                                        }
                                    }}
                                />
                                <TextField
                                    type="number"
                                    fullWidth
                                    label="Quantity to Allocate"
                                    value={allocationData.dose_pcv}
                                    onChange={(e) => handleInputChange('dose_pcv', e.target.value)}
                                    onKeyDown={preventInvalidKeys}
                                    inputProps={{ min: 0, max: stockData.dose_pcv }}
                                    placeholder="Enter quantity to allocate"
                                    sx={{
                                        mb: 2,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            '&:hover fieldset': { borderColor: 'rgb(12, 125, 64)' },
                                            '&.Mui-focused fieldset': { borderColor: 'rgb(12, 125, 64)' }
                                        }
                                    }}
                                />
                                {allocationData.dose_pcv && (
                                    <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                                        Remaining: {stockData.dose_pcv - (parseInt(allocationData.dose_pcv) || 0)}
                                    </Typography>
                                )}
                                {userRole === 'scs' && parseInt(allocationData.dose_pcv) > 0 && (
                                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                                        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#666' }}>
                                            Vaccine Details
                                        </Typography>
                                        <Grid container spacing={1.5}>
                                            <Grid item xs={12}>
                                                <FormControl fullWidth size="small">
                                                    <InputLabel>VVM Stage</InputLabel>
                                                    <Select
                                                        value={metadataMap.dose_pcv.vvm_stage}
                                                        onChange={(e) => handleMetadataChange('dose_pcv', 'vvm_stage', e.target.value)}
                                                        label="VVM Stage"
                                                    >
                                                        <MenuItem value="">Select Stage</MenuItem>
                                                        <MenuItem value="1">Stage 1</MenuItem>
                                                        <MenuItem value="2">Stage 2</MenuItem>
                                                        <MenuItem value="3">Stage 3</MenuItem>
                                                        <MenuItem value="4">Stage 4</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField fullWidth size="small" label="Batch Number" value={metadataMap.dose_pcv.batch_number} onChange={(e) => handleMetadataChange('dose_pcv', 'batch_number', e.target.value)} placeholder="Enter batch number" />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField fullWidth size="small" type="date" label="Earliest Expiry Date" value={metadataMap.dose_pcv.expire_date} onChange={(e) => handleMetadataChange('dose_pcv', 'expire_date', e.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ min: new Date().toISOString().split('T')[0] }} />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )}
                            </Paper>
                        </Grid>

                        {/* IPV */}
                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2.5,
                                    borderRadius: 1,
                                    border: '2px solid',
                                    borderColor: getBorderColor('dose_ipv'),
                                    transition: 'all 0.3s ease',
                                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LocalHospitalIcon sx={{ color: 'rgb(12, 125, 64)' }} />
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>IPV</Typography>
                                    </Box>
                                    <Chip
                                        label={`Available: ${stockData.dose_ipv}`}
                                        color={stockData.dose_ipv > 100 ? "success" : stockData.dose_ipv > 0 ? "warning" : "error"}
                                        size="small"
                                    />
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={stockData.dose_ipv > 0 ? Math.min((stockData.dose_ipv / 1000) * 100, 100) : 0}
                                    sx={{
                                        mb: 2,
                                        height: 8,
                                        borderRadius: 4,
                                        bgcolor: 'grey.200',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: getProgressColor('dose_ipv')
                                        }
                                    }}
                                />
                                <TextField
                                    type="number"
                                    fullWidth
                                    label="Quantity to Allocate"
                                    value={allocationData.dose_ipv}
                                    onChange={(e) => handleInputChange('dose_ipv', e.target.value)}
                                    onKeyDown={preventInvalidKeys}
                                    inputProps={{ min: 0, max: stockData.dose_ipv }}
                                    placeholder="Enter quantity to allocate"
                                    sx={{
                                        mb: 2,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            '&:hover fieldset': { borderColor: 'rgb(12, 125, 64)' },
                                            '&.Mui-focused fieldset': { borderColor: 'rgb(12, 125, 64)' }
                                        }
                                    }}
                                />
                                {allocationData.dose_ipv && (
                                    <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                                        Remaining: {stockData.dose_ipv - (parseInt(allocationData.dose_ipv) || 0)}
                                    </Typography>
                                )}
                                {userRole === 'scs' && parseInt(allocationData.dose_ipv) > 0 && (
                                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                                        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#666' }}>
                                            Vaccine Details
                                        </Typography>
                                        <Grid container spacing={1.5}>
                                            <Grid item xs={12}>
                                                <FormControl fullWidth size="small">
                                                    <InputLabel>VVM Stage</InputLabel>
                                                    <Select
                                                        value={metadataMap.dose_ipv.vvm_stage}
                                                        onChange={(e) => handleMetadataChange('dose_ipv', 'vvm_stage', e.target.value)}
                                                        label="VVM Stage"
                                                    >
                                                        <MenuItem value="">Select Stage</MenuItem>
                                                        <MenuItem value="1">Stage 1</MenuItem>
                                                        <MenuItem value="2">Stage 2</MenuItem>
                                                        <MenuItem value="3">Stage 3</MenuItem>
                                                        <MenuItem value="4">Stage 4</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField fullWidth size="small" label="Batch Number" value={metadataMap.dose_ipv.batch_number} onChange={(e) => handleMetadataChange('dose_ipv', 'batch_number', e.target.value)} placeholder="Enter batch number" />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField fullWidth size="small" type="date" label="Earliest Expiry Date" value={metadataMap.dose_ipv.expire_date} onChange={(e) => handleMetadataChange('dose_ipv', 'expire_date', e.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ min: new Date().toISOString().split('T')[0] }} />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )}
                            </Paper>
                        </Grid>

                        {/* Measles */}
                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2.5,
                                    borderRadius: 1,
                                    border: '2px solid',
                                    borderColor: getBorderColor('dose_mea'),
                                    transition: 'all 0.3s ease',
                                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LocalHospitalIcon sx={{ color: 'rgb(12, 125, 64)' }} />
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>Measles</Typography>
                                    </Box>
                                    <Chip
                                        label={`Available: ${stockData.dose_mea}`}
                                        color={stockData.dose_mea > 100 ? "success" : stockData.dose_mea > 0 ? "warning" : "error"}
                                        size="small"
                                    />
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={stockData.dose_mea > 0 ? Math.min((stockData.dose_mea / 1000) * 100, 100) : 0}
                                    sx={{
                                        mb: 2,
                                        height: 8,
                                        borderRadius: 4,
                                        bgcolor: 'grey.200',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: getProgressColor('dose_mea')
                                        }
                                    }}
                                />
                                <TextField
                                    type="number"
                                    fullWidth
                                    label="Quantity to Allocate"
                                    value={allocationData.dose_mea}
                                    onChange={(e) => handleInputChange('dose_mea', e.target.value)}
                                    onKeyDown={preventInvalidKeys}
                                    inputProps={{ min: 0, max: stockData.dose_mea }}
                                    placeholder="Enter quantity to allocate"
                                    sx={{
                                        mb: 2,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            '&:hover fieldset': { borderColor: 'rgb(12, 125, 64)' },
                                            '&.Mui-focused fieldset': { borderColor: 'rgb(12, 125, 64)' }
                                        }
                                    }}
                                />
                                {allocationData.dose_mea && (
                                    <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                                        Remaining: {stockData.dose_mea - (parseInt(allocationData.dose_mea) || 0)}
                                    </Typography>
                                )}
                                {userRole === 'scs' && parseInt(allocationData.dose_mea) > 0 && (
                                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                                        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#666' }}>
                                            Vaccine Details
                                        </Typography>
                                        <Grid container spacing={1.5}>
                                            <Grid item xs={12}>
                                                <FormControl fullWidth size="small">
                                                    <InputLabel>VVM Stage</InputLabel>
                                                    <Select
                                                        value={metadataMap.dose_mea.vvm_stage}
                                                        onChange={(e) => handleMetadataChange('dose_mea', 'vvm_stage', e.target.value)}
                                                        label="VVM Stage"
                                                    >
                                                        <MenuItem value="">Select Stage</MenuItem>
                                                        <MenuItem value="1">Stage 1</MenuItem>
                                                        <MenuItem value="2">Stage 2</MenuItem>
                                                        <MenuItem value="3">Stage 3</MenuItem>
                                                        <MenuItem value="4">Stage 4</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField fullWidth size="small" label="Batch Number" value={metadataMap.dose_mea.batch_number} onChange={(e) => handleMetadataChange('dose_mea', 'batch_number', e.target.value)} placeholder="Enter batch number" />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField fullWidth size="small" type="date" label="Earliest Expiry Date" value={metadataMap.dose_mea.expire_date} onChange={(e) => handleMetadataChange('dose_mea', 'expire_date', e.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ min: new Date().toISOString().split('T')[0] }} />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )}
                            </Paper>
                        </Grid>

                        {/* YF */}
                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2.5,
                                    borderRadius: 1,
                                    border: '2px solid',
                                    borderColor: getBorderColor('dose_yf'),
                                    transition: 'all 0.3s ease',
                                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LocalHospitalIcon sx={{ color: 'rgb(12, 125, 64)' }} />
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>YF</Typography>
                                    </Box>
                                    <Chip
                                        label={`Available: ${stockData.dose_yf}`}
                                        color={stockData.dose_yf > 100 ? "success" : stockData.dose_yf > 0 ? "warning" : "error"}
                                        size="small"
                                    />
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={stockData.dose_yf > 0 ? Math.min((stockData.dose_yf / 1000) * 100, 100) : 0}
                                    sx={{
                                        mb: 2,
                                        height: 8,
                                        borderRadius: 4,
                                        bgcolor: 'grey.200',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: getProgressColor('dose_yf')
                                        }
                                    }}
                                />
                                <TextField
                                    type="number"
                                    fullWidth
                                    label="Quantity to Allocate"
                                    value={allocationData.dose_yf}
                                    onChange={(e) => handleInputChange('dose_yf', e.target.value)}
                                    onKeyDown={preventInvalidKeys}
                                    inputProps={{ min: 0, max: stockData.dose_yf }}
                                    placeholder="Enter quantity to allocate"
                                    sx={{
                                        mb: 2,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            '&:hover fieldset': { borderColor: 'rgb(12, 125, 64)' },
                                            '&.Mui-focused fieldset': { borderColor: 'rgb(12, 125, 64)' }
                                        }
                                    }}
                                />
                                {allocationData.dose_yf && (
                                    <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                                        Remaining: {stockData.dose_yf - (parseInt(allocationData.dose_yf) || 0)}
                                    </Typography>
                                )}
                                {userRole === 'scs' && parseInt(allocationData.dose_yf) > 0 && (
                                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                                        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#666' }}>
                                            Vaccine Details
                                        </Typography>
                                        <Grid container spacing={1.5}>
                                            <Grid item xs={12}>
                                                <FormControl fullWidth size="small">
                                                    <InputLabel>VVM Stage</InputLabel>
                                                    <Select
                                                        value={metadataMap.dose_yf.vvm_stage}
                                                        onChange={(e) => handleMetadataChange('dose_yf', 'vvm_stage', e.target.value)}
                                                        label="VVM Stage"
                                                    >
                                                        <MenuItem value="">Select Stage</MenuItem>
                                                        <MenuItem value="1">Stage 1</MenuItem>
                                                        <MenuItem value="2">Stage 2</MenuItem>
                                                        <MenuItem value="3">Stage 3</MenuItem>
                                                        <MenuItem value="4">Stage 4</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField fullWidth size="small" label="Batch Number" value={metadataMap.dose_yf.batch_number} onChange={(e) => handleMetadataChange('dose_yf', 'batch_number', e.target.value)} placeholder="Enter batch number" />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField fullWidth size="small" type="date" label="Earliest Expiry Date" value={metadataMap.dose_yf.expire_date} onChange={(e) => handleMetadataChange('dose_yf', 'expire_date', e.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ min: new Date().toISOString().split('T')[0] }} />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )}
                            </Paper>
                        </Grid>

                        {/* TD */}
                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2.5,
                                    borderRadius: 1,
                                    border: '2px solid',
                                    borderColor: getBorderColor('dose_td'),
                                    transition: 'all 0.3s ease',
                                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LocalHospitalIcon sx={{ color: 'rgb(12, 125, 64)' }} />
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>TD</Typography>
                                    </Box>
                                    <Chip
                                        label={`Available: ${stockData.dose_td}`}
                                        color={stockData.dose_td > 100 ? "success" : stockData.dose_td > 0 ? "warning" : "error"}
                                        size="small"
                                    />
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={stockData.dose_td > 0 ? Math.min((stockData.dose_td / 1000) * 100, 100) : 0}
                                    sx={{
                                        mb: 2,
                                        height: 8,
                                        borderRadius: 4,
                                        bgcolor: 'grey.200',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: getProgressColor('dose_td')
                                        }
                                    }}
                                />
                                <TextField
                                    type="number"
                                    fullWidth
                                    label="Quantity to Allocate"
                                    value={allocationData.dose_td}
                                    onChange={(e) => handleInputChange('dose_td', e.target.value)}
                                    onKeyDown={preventInvalidKeys}
                                    inputProps={{ min: 0, max: stockData.dose_td }}
                                    placeholder="Enter quantity to allocate"
                                    sx={{
                                        mb: 2,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            '&:hover fieldset': { borderColor: 'rgb(12, 125, 64)' },
                                            '&.Mui-focused fieldset': { borderColor: 'rgb(12, 125, 64)' }
                                        }
                                    }}
                                />
                                {allocationData.dose_td && (
                                    <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                                        Remaining: {stockData.dose_td - (parseInt(allocationData.dose_td) || 0)}
                                    </Typography>
                                )}
                                {userRole === 'scs' && parseInt(allocationData.dose_td) > 0 && (
                                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                                        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#666' }}>
                                            Vaccine Details
                                        </Typography>
                                        <Grid container spacing={1.5}>
                                            <Grid item xs={12}>
                                                <FormControl fullWidth size="small">
                                                    <InputLabel>VVM Stage</InputLabel>
                                                    <Select
                                                        value={metadataMap.dose_td.vvm_stage}
                                                        onChange={(e) => handleMetadataChange('dose_td', 'vvm_stage', e.target.value)}
                                                        label="VVM Stage"
                                                    >
                                                        <MenuItem value="">Select Stage</MenuItem>
                                                        <MenuItem value="1">Stage 1</MenuItem>
                                                        <MenuItem value="2">Stage 2</MenuItem>
                                                        <MenuItem value="3">Stage 3</MenuItem>
                                                        <MenuItem value="4">Stage 4</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField fullWidth size="small" label="Batch Number" value={metadataMap.dose_td.batch_number} onChange={(e) => handleMetadataChange('dose_td', 'batch_number', e.target.value)} placeholder="Enter batch number" />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField fullWidth size="small" type="date" label="Earliest Expiry Date" value={metadataMap.dose_td.expire_date} onChange={(e) => handleMetadataChange('dose_td', 'expire_date', e.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ min: new Date().toISOString().split('T')[0] }} />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )}
                            </Paper>
                        </Grid>

                        {/* MenA */}
                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2.5,
                                    borderRadius: 1,
                                    border: '2px solid',
                                    borderColor: getBorderColor('dose_mena'),
                                    transition: 'all 0.3s ease',
                                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LocalHospitalIcon sx={{ color: 'rgb(12, 125, 64)' }} />
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>MenA</Typography>
                                    </Box>
                                    <Chip
                                        label={`Available: ${stockData.dose_mena}`}
                                        color={stockData.dose_mena > 100 ? "success" : stockData.dose_mena > 0 ? "warning" : "error"}
                                        size="small"
                                    />
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={stockData.dose_mena > 0 ? Math.min((stockData.dose_mena / 1000) * 100, 100) : 0}
                                    sx={{
                                        mb: 2,
                                        height: 8,
                                        borderRadius: 4,
                                        bgcolor: 'grey.200',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: getProgressColor('dose_mena')
                                        }
                                    }}
                                />
                                <TextField
                                    type="number"
                                    fullWidth
                                    label="Quantity to Allocate"
                                    value={allocationData.dose_mena}
                                    onChange={(e) => handleInputChange('dose_mena', e.target.value)}
                                    onKeyDown={preventInvalidKeys}
                                    inputProps={{ min: 0, max: stockData.dose_mena }}
                                    placeholder="Enter quantity to allocate"
                                    sx={{
                                        mb: 2,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            '&:hover fieldset': { borderColor: 'rgb(12, 125, 64)' },
                                            '&.Mui-focused fieldset': { borderColor: 'rgb(12, 125, 64)' }
                                        }
                                    }}
                                />
                                {allocationData.dose_mena && (
                                    <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                                        Remaining: {stockData.dose_mena - (parseInt(allocationData.dose_mena) || 0)}
                                    </Typography>
                                )}
                                {userRole === 'scs' && parseInt(allocationData.dose_mena) > 0 && (
                                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                                        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#666' }}>
                                            Vaccine Details
                                        </Typography>
                                        <Grid container spacing={1.5}>
                                            <Grid item xs={12}>
                                                <FormControl fullWidth size="small">
                                                    <InputLabel>VVM Stage</InputLabel>
                                                    <Select
                                                        value={metadataMap.dose_mena.vvm_stage}
                                                        onChange={(e) => handleMetadataChange('dose_mena', 'vvm_stage', e.target.value)}
                                                        label="VVM Stage"
                                                    >
                                                        <MenuItem value="">Select Stage</MenuItem>
                                                        <MenuItem value="1">Stage 1</MenuItem>
                                                        <MenuItem value="2">Stage 2</MenuItem>
                                                        <MenuItem value="3">Stage 3</MenuItem>
                                                        <MenuItem value="4">Stage 4</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField fullWidth size="small" label="Batch Number" value={metadataMap.dose_mena.batch_number} onChange={(e) => handleMetadataChange('dose_mena', 'batch_number', e.target.value)} placeholder="Enter batch number" />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField fullWidth size="small" type="date" label="Earliest Expiry Date" value={metadataMap.dose_mena.expire_date} onChange={(e) => handleMetadataChange('dose_mena', 'expire_date', e.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ min: new Date().toISOString().split('T')[0] }} />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )}
                            </Paper>
                        </Grid>

                        {/* Rota */}
                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2.5,
                                    borderRadius: 1,
                                    border: '2px solid',
                                    borderColor: getBorderColor('dose_rota'),
                                    transition: 'all 0.3s ease',
                                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LocalHospitalIcon sx={{ color: 'rgb(12, 125, 64)' }} />
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>Rota</Typography>
                                    </Box>
                                    <Chip
                                        label={`Available: ${stockData.dose_rota}`}
                                        color={stockData.dose_rota > 100 ? "success" : stockData.dose_rota > 0 ? "warning" : "error"}
                                        size="small"
                                    />
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={stockData.dose_rota > 0 ? Math.min((stockData.dose_rota / 1000) * 100, 100) : 0}
                                    sx={{
                                        mb: 2,
                                        height: 8,
                                        borderRadius: 4,
                                        bgcolor: 'grey.200',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: getProgressColor('dose_rota')
                                        }
                                    }}
                                />
                                <TextField
                                    type="number"
                                    fullWidth
                                    label="Quantity to Allocate"
                                    value={allocationData.dose_rota}
                                    onChange={(e) => handleInputChange('dose_rota', e.target.value)}
                                    onKeyDown={preventInvalidKeys}
                                    inputProps={{ min: 0, max: stockData.dose_rota }}
                                    placeholder="Enter quantity to allocate"
                                    sx={{
                                        mb: 2,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            '&:hover fieldset': { borderColor: 'rgb(12, 125, 64)' },
                                            '&.Mui-focused fieldset': { borderColor: 'rgb(12, 125, 64)' }
                                        }
                                    }}
                                />
                                {allocationData.dose_rota && (
                                    <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                                        Remaining: {stockData.dose_rota - (parseInt(allocationData.dose_rota) || 0)}
                                    </Typography>
                                )}
                                {userRole === 'scs' && parseInt(allocationData.dose_rota) > 0 && (
                                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                                        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#666' }}>
                                            Vaccine Details
                                        </Typography>
                                        <Grid container spacing={1.5}>
                                            <Grid item xs={12}>
                                                <FormControl fullWidth size="small">
                                                    <InputLabel>VVM Stage</InputLabel>
                                                    <Select
                                                        value={metadataMap.dose_rota.vvm_stage}
                                                        onChange={(e) => handleMetadataChange('dose_rota', 'vvm_stage', e.target.value)}
                                                        label="VVM Stage"
                                                    >
                                                        <MenuItem value="">Select Stage</MenuItem>
                                                        <MenuItem value="1">Stage 1</MenuItem>
                                                        <MenuItem value="2">Stage 2</MenuItem>
                                                        <MenuItem value="3">Stage 3</MenuItem>
                                                        <MenuItem value="4">Stage 4</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField fullWidth size="small" label="Batch Number" value={metadataMap.dose_rota.batch_number} onChange={(e) => handleMetadataChange('dose_rota', 'batch_number', e.target.value)} placeholder="Enter batch number" />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField fullWidth size="small" type="date" label="Earliest Expiry Date" value={metadataMap.dose_rota.expire_date} onChange={(e) => handleMetadataChange('dose_rota', 'expire_date', e.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ min: new Date().toISOString().split('T')[0] }} />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )}
                            </Paper>
                        </Grid>

                        {/* HPV */}
                        <Grid item xs={12} md={6}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 2.5,
                                    borderRadius: 1,
                                    border: '2px solid',
                                    borderColor: getBorderColor('dose_hpv'),
                                    transition: 'all 0.3s ease',
                                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 }
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LocalHospitalIcon sx={{ color: 'rgb(12, 125, 64)' }} />
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>HPV</Typography>
                                    </Box>
                                    <Chip
                                        label={`Available: ${stockData.dose_hpv}`}
                                        color={stockData.dose_hpv > 100 ? "success" : stockData.dose_hpv > 0 ? "warning" : "error"}
                                        size="small"
                                    />
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={stockData.dose_hpv > 0 ? Math.min((stockData.dose_hpv / 1000) * 100, 100) : 0}
                                    sx={{
                                        mb: 2,
                                        height: 8,
                                        borderRadius: 4,
                                        bgcolor: 'grey.200',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: getProgressColor('dose_hpv')
                                        }
                                    }}
                                />
                                <TextField
                                    type="number"
                                    fullWidth
                                    label="Quantity to Allocate"
                                    value={allocationData.dose_hpv}
                                    onChange={(e) => handleInputChange('dose_hpv', e.target.value)}
                                    onKeyDown={preventInvalidKeys}
                                    inputProps={{ min: 0, max: stockData.dose_hpv }}
                                    placeholder="Enter quantity to allocate"
                                    sx={{
                                        mb: 2,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            '&:hover fieldset': { borderColor: 'rgb(12, 125, 64)' },
                                            '&.Mui-focused fieldset': { borderColor: 'rgb(12, 125, 64)' }
                                        }
                                    }}
                                />
                                {allocationData.dose_hpv && (
                                    <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                                        Remaining: {stockData.dose_hpv - (parseInt(allocationData.dose_hpv) || 0)}
                                    </Typography>
                                )}
                                {userRole === 'scs' && parseInt(allocationData.dose_hpv) > 0 && (
                                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                                        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#666' }}>
                                            Vaccine Details
                                        </Typography>
                                        <Grid container spacing={1.5}>
                                            <Grid item xs={12}>
                                                <FormControl fullWidth size="small">
                                                    <InputLabel>VVM Stage</InputLabel>
                                                    <Select
                                                        value={metadataMap.dose_hpv.vvm_stage}
                                                        onChange={(e) => handleMetadataChange('dose_hpv', 'vvm_stage', e.target.value)}
                                                        label="VVM Stage"
                                                    >
                                                        <MenuItem value="">Select Stage</MenuItem>
                                                        <MenuItem value="1">Stage 1</MenuItem>
                                                        <MenuItem value="2">Stage 2</MenuItem>
                                                        <MenuItem value="3">Stage 3</MenuItem>
                                                        <MenuItem value="4">Stage 4</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField fullWidth size="small" label="Batch Number" value={metadataMap.dose_hpv.batch_number} onChange={(e) => handleMetadataChange('dose_hpv', 'batch_number', e.target.value)} placeholder="Enter batch number" />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField fullWidth size="small" type="date" label="Earliest Expiry Date" value={metadataMap.dose_hpv.expire_date} onChange={(e) => handleMetadataChange('dose_hpv', 'expire_date', e.target.value)} InputLabelProps={{ shrink: true }} inputProps={{ min: new Date().toISOString().split('T')[0] }} />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )}
                            </Paper>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            )}

            <Card sx={{ mt: 3 }}>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Storage Information
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                                <Typography variant="body2" color="text.secondary">
                                    CCE Count
                                </Typography>
                                <Typography variant="h6">{stockData.cce_count}</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                                <Typography variant="body2" color="text.secondary">
                                    Storage Used (L)
                                </Typography>
                                <Typography variant="h6">{stockData.total_vaccine_storage_volume_utilized}</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                                <Typography variant="body2" color="text.secondary">
                                    Remaining Capacity (L)
                                </Typography>
                                <Typography variant="h6">{stockData.remaining_cce_storage_capacity}</Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Submit Button - Only show in allocation mode */}
            {!isViewMode && (
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
                        onClick={handleSubmit}
                        disabled={submitAllocation.isPending}
                    >
                        {submitAllocation.isPending ? 'Submitting...' : 'Submit Allocation'}
                    </Button>
                </Box>
            )}
        </Box>
    );
}