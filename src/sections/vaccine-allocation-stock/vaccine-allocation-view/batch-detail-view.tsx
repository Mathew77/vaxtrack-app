import React, { useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Card,
    CardContent,
    Grid,
    FormControl,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { toast } from 'react-toastify';
import { DashboardContent } from 'src/layouts/dashboard';
import {
    useFetchBatchAllocations,
    useFetchStockAtHand,
    useDeleteAllocationByFacility,
    useDeleteAllocationByPeriod,
    useBulkUpdateAllocationStatus,
} from 'src/hooks/apis/upload/upload-hook';
import { useFetchThreePl } from 'src/hooks/apis/threepl/threepl-hooks';
import VaxTable, { ActionMenuItem } from 'src/utils/VaxTablePage';
import { AllocatedVaccineData } from 'src/hooks/apis/upload/upload-type';

interface EnrichedAllocatedVaccineData extends AllocatedVaccineData {
    name_of_ehf: string;
    state: string;
    lga: string;
}

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
];

export const VaccineAllocationBatchDetailView: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { batch_no, openBulkConfirm } = location.state || {};

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [allocationToDelete, setAllocationToDelete] = useState<EnrichedAllocatedVaccineData | null>(null);
    const [deletePeriodDialogOpen, setDeletePeriodDialogOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState<EnrichedAllocatedVaccineData | null>(null);

    // Bulk confirm dialog state
    const [bulkConfirmDialogOpen, setBulkConfirmDialogOpen] = useState(false);
    const [bulkVvmStages, setBulkVvmStages] = useState<Record<string, number>>({
        bcg: 1,
        hepb: 1,
        bopv: 1,
        penta: 1,
        pcv: 1,
        ipv: 1,
        mea: 1,
        yf: 1,
        td: 1,
        mena: 1,
        rota: 1,
        hpv: 1,
    });

    const userRole = useMemo(() => sessionStorage.getItem('userRole') || '', []);
    const isSLWG = userRole === 'slwg';
    const isSCS = userRole === 'scs';
    const is3PL = userRole === 'threepl';
    const isMCCO = userRole === 'mcco' || userRole === 'conveyor';
    const isLCS = userRole === 'lcs';
    const isAdmin = userRole === 'admin';

    const userState = sessionStorage.getItem('userState') || null;
    const parsedUserState = useMemo(() => {
        if (!userState) return null;
        try {
            const parsed = JSON.parse(userState);
            return parsed?.state || userState;
        } catch {
            return userState;
        }
    }, [userState]);

    const { data: batchData = [], isLoading: isBatchLoading, refetch: refetchBatch } = useFetchBatchAllocations(batch_no);
    const { data: stockData = [], isLoading: isStockLoading } = useFetchStockAtHand(parsedUserState);
    const { data: allThreePl = [] } = useFetchThreePl();
    const deleteByFacilityMutation = useDeleteAllocationByFacility();
    const deleteByPeriodMutation = useDeleteAllocationByPeriod();
    const bulkUpdateMutation = useBulkUpdateAllocationStatus();

    const enrichedData = useMemo((): EnrichedAllocatedVaccineData[] => {
        return batchData.map((allocation) => {
            const stockInfo = stockData.find(
                (stock) => stock.assigned_unique_id === allocation.assigned_unique_id
            );
            return {
                ...allocation,
                name_of_ehf: stockInfo?.name_of_ehf || 'N/A',
                state: stockInfo?.state || 'N/A',
                lga: stockInfo?.lga || 'N/A',
            };
        });
    }, [batchData, stockData]);

    // Check if 3PL can bulk confirm - all allocations in batch must be status 1 (Pending 3PL Pickup)
    const pendingPickupAllocations = useMemo(() => {
        return enrichedData.filter(allocation => allocation.status === 1);
    }, [enrichedData]);

    const canBulkConfirm = is3PL && pendingPickupAllocations.length > 0;

    // Auto-open bulk confirm dialog if navigated with openBulkConfirm flag
    // Auto-open bulk confirm dialog if navigated with openBulkConfirm flag
    useEffect(() => {
        if (openBulkConfirm && canBulkConfirm && !isBatchLoading) {
            navigate('/vaccine-allocation-threepl-confirm', {
                state: {
                    batch_no: batch_no,
                    allocations: pendingPickupAllocations,
                },
            });
        }
    }, [openBulkConfirm, canBulkConfirm, isBatchLoading, navigate, batch_no, pendingPickupAllocations]);

    // Get aggregated vaccine totals for the batch (for display in bulk confirm dialog)
    const batchVaccineTotals = useMemo(() => {
        const totals: Record<string, number> = {};
        VACCINE_TYPES.forEach(vaccine => {
            totals[vaccine.key] = pendingPickupAllocations.reduce(
                (sum, allocation) => sum + ((allocation as any)[vaccine.doseKey] || 0),
                0
            );
        });
        return totals;
    }, [pendingPickupAllocations]);

    // Handle bulk confirm pickup
    const handleBulkConfirmPickup = () => {
        navigate('/vaccine-allocation-threepl-confirm', {
            state: {
                batch_no: batch_no,
                allocations: pendingPickupAllocations,
            },
        });
    };


    // Handlers for individual actions
    const handleViewDetails = (data: EnrichedAllocatedVaccineData) => {
        navigate('/vaccine-allocation-confirm-view', {
            state: {
                data: data,
                userRole: userRole,
                isView: true,
            },
        });
    };

    const handleConfirmDispatch = (data: any) => {
        navigate('/vaccine-allocation-confirm-view', {
            state: { data: data, userRole: userRole, isView: false },
        });
    };

    const handleConfirmPickup = (data: any) => {
        navigate('/vaccine-allocation-confirm-view', {
            state: { data: data, userRole: userRole, isView: false },
        });
    };

    const handleMccoConfirm = (data: any) => {
        navigate('/vaccine-allocation-mcco-confirm', {
            state: { data: data, userRole: userRole },
        });
    };

    const handleLcsReview = (data: any) => {
        navigate('/vaccine-allocation-lcs-return', {
            state: { data: data, userRole: userRole },
        });
    };

    const handleReturnDeficit = (data: any) => {
        navigate('/vaccine-allocation-confirm-view', {
            state: { data: data, userRole: userRole, isView: false, showTransferDeficit: true },
        });
    };

    const handleDeleteClick = (data: EnrichedAllocatedVaccineData) => {
        setAllocationToDelete(data);
        setDeleteDialogOpen(true);
    };

    const handleDeleteRecordClick = (data: EnrichedAllocatedVaccineData) => {
        setRecordToDelete(data);
        setDeletePeriodDialogOpen(true);
    };

    const confirmDeleteRecord = () => {
        if (!recordToDelete?.assigned_unique_id || !recordToDelete?.period) return;
        deleteByPeriodMutation.mutate(
            { assigned_unique_id: recordToDelete.assigned_unique_id, period: recordToDelete.period },
            {
                onSuccess: () => {
                    toast.success('Record deleted successfully!');
                    setDeletePeriodDialogOpen(false);
                    setRecordToDelete(null);
                    refetchBatch();
                },
                onError: (error: any) => {
                    toast.error(error?.message || 'Failed to delete record');
                },
            }
        );
    };

    const confirmDelete = () => {
        if (!allocationToDelete?.assigned_unique_id) return;
        deleteByFacilityMutation.mutate(allocationToDelete.assigned_unique_id, {
            onSuccess: () => {
                toast.success('Facility allocation deleted successfully!');
                setDeleteDialogOpen(false);
                setAllocationToDelete(null);
                refetchBatch();
            },
            onError: (error: any) => {
                toast.error(error?.message || 'Failed to delete facility allocation');
            },
        });
    };

    const getActionItems = (row: EnrichedAllocatedVaccineData): ActionMenuItem<EnrichedAllocatedVaccineData>[] => {
        const baseActions: ActionMenuItem<EnrichedAllocatedVaccineData>[] = [
            {
                display: "View Details",
                handleClick: handleViewDetails,
                icon: <VisibilityOutlinedIcon sx={{ color: "#1976D2" }} />,
            },
        ];

        if (isSCS && row.status === 0) {
            baseActions.push({
                display: "Confirm Dispatch to 3PL",
                handleClick: handleConfirmDispatch,
                icon: <CheckCircleOutlineIcon sx={{ color: "#0C7D40" }} />,
            });
        }

        // if (is3PL && row.status === 1) {
        //     baseActions.push({
        //         display: "Confirm Pickup & Delivery",
        //         handleClick: handleConfirmPickup,
        //         icon: <CheckCircleOutlineIcon sx={{ color: "#0C7D40" }} />,
        //     });
        // }

        if (isMCCO) {
            if (row.status === 2) {
                baseActions.push({
                    display: "Confirm Receipt",
                    handleClick: handleMccoConfirm,
                    icon: <CheckCircleOutlineIcon sx={{ color: "#0C7D40" }} />,
                });
            }
            if (row.status === 3) {
                baseActions.push({
                    display: "Return Deficit",
                    handleClick: handleReturnDeficit,
                    icon: <CheckCircleOutlineIcon sx={{ color: "#0C7D40" }} />,
                });
            }
        }

        if (isLCS && row.status === 5 && (row as any).deficit_transfer_to === 'lcs') {
            baseActions.push({
                display: "Confirm Return",
                handleClick: handleLcsReview,
                icon: <CheckCircleOutlineIcon sx={{ color: "#0C7D40" }} />,
            });
        }

        if (isSCS && row.status === 5 && (row as any).deficit_transfer_to === 'scs') {
            baseActions.push({
                display: "Confirm Return",
                handleClick: handleLcsReview,
                icon: <CheckCircleOutlineIcon sx={{ color: "#0C7D40" }} />,
            });
        }


        if (isAdmin) {
            baseActions.push({
                display: "Delete Facility",
                handleClick: handleDeleteClick,
                icon: <DeleteForeverOutlinedIcon sx={{ color: "red" }} />,
            });
            baseActions.push({
                display: "Delete Record",
                handleClick: handleDeleteRecordClick,
                icon: <DeleteForeverOutlinedIcon sx={{ color: "orange" }} />,
            });
        }

        return baseActions;
    };

    // Helper component for stacked Max/Allocated display
    const StackedVaccineCell = ({ max, allocated }: { max: number; allocated: number }) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, py: 0.5 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                Max: {max || 0}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'rgb(12, 125, 64)', fontSize: '0.8rem' }}>
                Allocated: {allocated || 0}
            </Typography>
        </Box>
    );

    const columns = useMemo(
        () => [
            {
                accessorKey: 'serial_no',
                header: 'S/N',
                size: 60,
                enableSorting: false,
                Cell: ({ row }: any) => row.index + 1,
            },
            {
                accessorKey: 'name_of_ehf',
                header: 'EHF Name',
                size: 180,
            },
            {
                accessorKey: 'state',
                header: 'State',
                size: 90,
            },
            {
                accessorKey: 'lga',
                header: 'LGA',
                size: 100,
            },
            {
                accessorKey: 'batch_no',
                header: 'Batch No',
                size: 110,
            },
            {
                accessorKey: 'threepl',
                header: '3PL',
                size: 100,
                Cell: ({ cell }: any) => {
                    const val = cell.getValue();
                    const pl = allThreePl?.find((p: any) => p?.id == val);
                    return pl ? pl.threepl_name : val || '-';
                },
            },
            {
                accessorKey: 'dose_bcg',
                header: 'BCG',
                size: 95,
                Cell: ({ row }: any) => (
                    <StackedVaccineCell
                        max={row.original.dose_bcg_actual}
                        allocated={row.original.dose_bcg_allocated}
                    />
                ),
            },
            {
                accessorKey: 'dose_hepb',
                header: 'HepB',
                size: 95,
                Cell: ({ row }: any) => (
                    <StackedVaccineCell
                        max={row.original.dose_hepb_actual}
                        allocated={row.original.dose_hepb_allocated}
                    />
                ),
            },
            {
                accessorKey: 'dose_bopv',
                header: 'bOPV',
                size: 95,
                Cell: ({ row }: any) => (
                    <StackedVaccineCell
                        max={row.original.dose_bopv_actual}
                        allocated={row.original.dose_bopv_allocated}
                    />
                ),
            },
            {
                accessorKey: 'dose_penta',
                header: 'Penta',
                size: 95,
                Cell: ({ row }: any) => (
                    <StackedVaccineCell
                        max={row.original.dose_penta_actual}
                        allocated={row.original.dose_penta_allocated}
                    />
                ),
            },
            {
                accessorKey: 'dose_pcv',
                header: 'PCV',
                size: 95,
                Cell: ({ row }: any) => (
                    <StackedVaccineCell
                        max={row.original.dose_pcv_actual}
                        allocated={row.original.dose_pcv_allocated}
                    />
                ),
            },
            {
                accessorKey: 'dose_ipv',
                header: 'IPV',
                size: 95,
                Cell: ({ row }: any) => (
                    <StackedVaccineCell
                        max={row.original.dose_ipv_actual}
                        allocated={row.original.dose_ipv_allocated}
                    />
                ),
            },
            {
                accessorKey: 'dose_mea',
                header: 'Measles',
                size: 95,
                Cell: ({ row }: any) => (
                    <StackedVaccineCell
                        max={row.original.dose_mea_actual}
                        allocated={row.original.dose_mea_allocated}
                    />
                ),
            },
            {
                accessorKey: 'dose_yf',
                header: 'YF',
                size: 95,
                Cell: ({ row }: any) => (
                    <StackedVaccineCell
                        max={row.original.dose_yf_actual}
                        allocated={row.original.dose_yf_allocated}
                    />
                ),
            },
            {
                accessorKey: 'dose_td',
                header: 'TD',
                size: 95,
                Cell: ({ row }: any) => (
                    <StackedVaccineCell
                        max={row.original.dose_td_actual}
                        allocated={row.original.dose_td_allocated}
                    />
                ),
            },
            {
                accessorKey: 'dose_mena',
                header: 'MenA',
                size: 95,
                Cell: ({ row }: any) => (
                    <StackedVaccineCell
                        max={row.original.dose_mena_actual}
                        allocated={row.original.dose_mena_allocated}
                    />
                ),
            },
            {
                accessorKey: 'dose_rota',
                header: 'Rota',
                size: 95,
                Cell: ({ row }: any) => (
                    <StackedVaccineCell
                        max={row.original.dose_rota_actual}
                        allocated={row.original.dose_rota_allocated}
                    />
                ),
            },
            {
                accessorKey: 'dose_hpv',
                header: 'HPV',
                size: 95,
                Cell: ({ row }: any) => (
                    <StackedVaccineCell
                        max={row.original.dose_hpv_actual}
                        allocated={row.original.dose_hpv_allocated}
                    />
                ),
            },
            {
                accessorKey: 'dose_mr',
                header: 'MR',
                size: 95,
                Cell: ({ row }: any) => (
                    <StackedVaccineCell
                        max={row.original.dose_mr_actual}
                        allocated={row.original.dose_mr_allocated}
                    />
                ),
            },
            {
                accessorKey: 'status',
                header: 'Status',
                size: 200,
                Cell: ({ cell, row }: any) => {
                    const status = cell.getValue();
                    const rowData = row.original;
                    let label = 'Unknown';
                    let color: 'warning' | 'success' | 'info' | 'default' = 'default';

                    if (status === 0) {
                        label = 'Pending SCS Confirmation';
                        color = 'warning';
                    } else if (status === 1) {
                        label = 'Pending 3PL Pickup';
                        color = 'warning';
                    } else if (status === 2) {
                        label = 'Pending MCCO Confirmation';
                        color = 'warning';
                    } else if (status === 3) {
                        label = 'Deficit Pending for Return';
                        color = 'warning';
                    } else if (status === 4) {
                        label = 'Completed';
                        color = 'success';
                    } else if (status === 5) {
                        const transferTo = rowData?.deficit_transfer_to;
                        label = transferTo === 'lcs' ? 'Pending LCS Confirmation' : transferTo === 'ehf' ? 'Pending EHF Confirmation' : transferTo === 'scs' ? 'Pending SCS Confirmation' : 'Pending Confirmation';
                        color = 'warning';
                    } else if (status === 6) {
                        label = 'Deficit & Pending MCCO Confirmation';
                        color = 'warning';
                    }

                    return <Chip label={label} color={color} size="small" />;
                },
            }
        ],
        [allThreePl]
    );

    return (
        <DashboardContent maxWidth="xl">
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">Batch Details: {batch_no}</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/vaccine-allocation-stock-page')}
                        variant="outlined"
                    >
                        Back to Summary
                    </Button>
                </Box>
            </Box>

            <VaxTable
                tableHeader={`Allocations for Batch ${batch_no}`}
                columns={columns}
                data={enrichedData}
                loading={isBatchLoading || isStockLoading}
                getActionMenuItems={getActionItems}
            />

            {canBulkConfirm && (
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        startIcon={<CheckCircleOutlineIcon />}
                        onClick={handleBulkConfirmPickup}
                        variant="contained"
                        disabled={bulkUpdateMutation.isPending}
                        sx={{
                            background: 'linear-gradient(135deg, rgb(12, 125, 64) 0%, rgb(10, 105, 54) 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, rgb(10, 105, 54) 0%, rgb(12, 125, 64) 100%)',
                            },
                        }}
                    >
                        {bulkUpdateMutation.isPending ? 'Confirming...' : `Bulk Confirm Pickup (${pendingPickupAllocations.length})`}
                    </Button>
                </Box>
            )}

            {/* Delete Facility Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Delete Facility</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete <strong>all allocations</strong> for{' '}
                        <strong>{allocationToDelete?.name_of_ehf}</strong> across all periods? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">Cancel</Button>
                    <Button onClick={confirmDelete} color="error" variant="contained">
                        {deleteByFacilityMutation.isPending ? 'Deleting...' : 'Delete Facility'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Record (by period) Confirmation Dialog */}
            <Dialog open={deletePeriodDialogOpen} onClose={() => setDeletePeriodDialogOpen(false)}>
                <DialogTitle>Confirm Delete Record</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the record for{' '}
                        <strong>{recordToDelete?.name_of_ehf}</strong> for period{' '}
                        <strong>{recordToDelete?.period}</strong>? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeletePeriodDialogOpen(false)} color="inherit">Cancel</Button>
                    <Button onClick={confirmDeleteRecord} color="error" variant="contained">
                        {deleteByPeriodMutation.isPending ? 'Deleting...' : 'Delete Record'}
                    </Button>
                </DialogActions>
            </Dialog>

        </DashboardContent>
    );
};

export default VaccineAllocationBatchDetailView;
