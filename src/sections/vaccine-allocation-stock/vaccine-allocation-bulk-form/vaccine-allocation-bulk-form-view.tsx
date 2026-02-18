import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    Paper,
    TextField,
    LinearProgress,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { toast } from 'react-toastify';
import { DashboardContent } from 'src/layouts/dashboard';
import { useSubmitAllocation } from 'src/hooks/apis/upload/upload-hook';
import { useFetchThreePl } from 'src/hooks/apis/threepl/threepl-hooks';
import { StockAtHandData } from 'src/hooks/apis/upload/upload-type';
import VaxTable from 'src/utils/VaxTablePage';

interface SelectedFacility {
    id: string;
    stockId: number;
    ehfId: string;
    ehfName: string;
    lga: string;
    ward: string;
    stockData: StockAtHandData;
}

const VaccineAllocationBulkFormView: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedFacilities = [], selectedThreePl = '' } = location.state || {};

    const submitAllocation = useSubmitAllocation();
    const { data: allThreePl = [] } = useFetchThreePl();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Get user data for submission
    const userData = useMemo(() => {
        const userStateData = sessionStorage.getItem('userState');
        if (userStateData) {
            try {
                return JSON.parse(userStateData);
            } catch {
                return null;
            }
        }
        return null;
    }, []);

    const userRole = useMemo(() => sessionStorage.getItem('userRole') || '', []);

    // Get the 3PL name
    const threePlName = useMemo(() => {
        const pl = allThreePl?.find((p: any) => p?.id?.toString() === selectedThreePl);
        return pl?.threepl_name || selectedThreePl;
    }, [allThreePl, selectedThreePl]);

    // Calculate total max stock across all facilities
    const totalMaxStock = useMemo(() => {
        return selectedFacilities.reduce((acc: any, facility: SelectedFacility) => {
            return {
                bcg: (acc.bcg || 0) + (facility.stockData?.dose_bcg || 0),
                hepb: (acc.hepb || 0) + (facility.stockData?.dose_hepb || 0),
                bopv: (acc.bopv || 0) + (facility.stockData?.dose_bopv || 0),
                penta: (acc.penta || 0) + (facility.stockData?.dose_penta || 0),
                pcv: (acc.pcv || 0) + (facility.stockData?.dose_pcv || 0),
                ipv: (acc.ipv || 0) + (facility.stockData?.dose_ipv || 0),
                mea: (acc.mea || 0) + (facility.stockData?.dose_mea || 0),
                yf: (acc.yf || 0) + (facility.stockData?.dose_yf || 0),
                td: (acc.td || 0) + (facility.stockData?.dose_td || 0),
                mena: (acc.mena || 0) + (facility.stockData?.dose_mena || 0),
                rota: (acc.rota || 0) + (facility.stockData?.dose_rota || 0),
                hpv: (acc.hpv || 0) + (facility.stockData?.dose_hpv || 0),
                malaria: (acc.malaria || 0) + (facility.stockData?.dose_malaria || 0),
                mr: (acc.mr || 0) + (facility.stockData?.dose_mr || 0),
            };
        }, {});
    }, [selectedFacilities]);

    // Allocation input state
    const [allocationData, setAllocationData] = useState({
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
        dose_malaria: '',
        dose_mr: ''
    });

    // Validation errors state
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    // Global fields for date and safety box
    const [allocationDate, setAllocationDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // Auto-populate with today's date in YYYY-MM-DD format
    });

    // Metadata state for each vaccine (VVM stage, batch number, expiry date)
    const [metadataMap, setMetadataMap] = useState<Record<string, { vvm_stage: string; batch_number: string; expire_date: string }>>({
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
        dose_malaria: { vvm_stage: '', batch_number: '', expire_date: '' },
        dose_mr: { vvm_stage: '', batch_number: '', expire_date: '' },
    });

    // Consumables state for each vaccine (diluents, syringes, droppers)
    const [consumablesData, setConsumablesData] = useState({
        // BCG consumables
        bcg_diluent: '',
        bcg_syringe_005ml: '',
        bcg_syringe_2ml: '',
        // HepB consumables
        hepb_syringe_05ml: '',
        // bOPV consumables
        bopv_dropper: '',
        // Penta consumables
        penta_syringe_05ml: '',
        // PCV consumables
        pcv_syringe_05ml: '',
        // IPV consumables
        ipv_syringe_05ml: '',
        // Measles consumables
        mea_diluent: '',
        mea_syringe_05ml: '',
        mea_syringe_5ml: '',
        // YF consumables
        yf_diluent: '',
        yf_syringe_05ml: '',
        yf_syringe_5ml: '',
        // TD consumables
        td_syringe_05ml: '',
        // MenA consumables
        mena_diluent: '',
        mena_syringe_05ml: '',
        mena_syringe_5ml: '',
        // Rota consumables
        rota_dropper: '',
        // HPV consumables
        hpv_syringe_05ml: '',

        // Malaria consumables
        malaria_diluent: '',
        malaria_syringe_05ml: '',
        malaria_syringe_5ml: '',

        // MR consumables
        mr_diluent: '',
        mr_syringe_05ml: '',
        mr_syringe_5ml: '',
    });

    // Handle consumables input change
    const handleConsumablesChange = (field: string, value: string) => {
        const numValue = parseInt(value) || 0;
        if (numValue < 0) return;
        setConsumablesData(prev => ({ ...prev, [field]: value }));
    };

    // Handle allocation input change - allow typing freely
    const handleAllocationChange = (vaccine: string, value: string) => {
        const numValue = parseInt(value) || 0;
        if (numValue < 0) return;

        // Update allocation data immediately to allow typing
        setAllocationData(prev => ({ ...prev, [vaccine]: value }));

        // Clear error when user starts typing again
        if (validationErrors[vaccine]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[vaccine];
                return newErrors;
            });
        }
    };

    const [globalSafetyBoxOverride, setGlobalSafetyBoxOverride] = useState<string | null>(null);

    // Calculate safety boxes based on total syringes (administration + reconstitution)
    // Safety box can contain 100 syringes, so divide by 100 and round up
    const calculatedSafetyBox = useMemo(() => {
        let totalSyringes = 0;

        // Add all administration syringes (0.5ml, 0.05ml)
        totalSyringes += parseInt(consumablesData.bcg_syringe_005ml) || 0;
        totalSyringes += parseInt(consumablesData.hepb_syringe_05ml) || 0;
        totalSyringes += parseInt(consumablesData.penta_syringe_05ml) || 0;
        totalSyringes += parseInt(consumablesData.pcv_syringe_05ml) || 0;
        totalSyringes += parseInt(consumablesData.ipv_syringe_05ml) || 0;
        totalSyringes += parseInt(consumablesData.mea_syringe_05ml) || 0;
        totalSyringes += parseInt(consumablesData.yf_syringe_05ml) || 0;
        totalSyringes += parseInt(consumablesData.td_syringe_05ml) || 0;
        totalSyringes += parseInt(consumablesData.mena_syringe_05ml) || 0;
        totalSyringes += parseInt(consumablesData.hpv_syringe_05ml) || 0;

        // Add all reconstitution syringes (2ml, 5ml)
        totalSyringes += parseInt(consumablesData.bcg_syringe_2ml) || 0;
        totalSyringes += parseInt(consumablesData.mea_syringe_5ml) || 0;
        totalSyringes += parseInt(consumablesData.yf_syringe_5ml) || 0;
        totalSyringes += parseInt(consumablesData.mena_syringe_5ml) || 0;

        // Calculate safety boxes: divide by 100 and round up
        const safetyBoxes = Math.ceil(totalSyringes / 100);
        return safetyBoxes.toString();
    }, [consumablesData]);

    // Use manual override if set, otherwise use auto-calculated value
    const globalSafetyBox = globalSafetyBoxOverride !== null ? globalSafetyBoxOverride : calculatedSafetyBox;

    // Handle validation and auto-populate consumables when user finishes typing
    const handleAllocationBlur = (vaccine: string) => {
        const value = allocationData[vaccine as keyof typeof allocationData];
        const numValue = parseInt(value) || 0;

        // Skip validation if empty
        if (!value || numValue === 0) {
            return;
        }

        // Get the vaccine's multiple
        const multiple = getVaccineMultiple(vaccine);

        // Get the max stock for this vaccine
        const vaccineConfig = vaccines.find(v => v.key === vaccine);
        const maxStock = vaccineConfig ? totalMaxStock[vaccineConfig.maxKey] || 0 : 0;

        // Special validation for PCV: must be divisible by 4 OR 5
        if (vaccine === 'dose_pcv') {
            if (numValue % 4 !== 0 && numValue % 5 !== 0) {
                const errorMsg = `Must be divisible by 4 or 5`;
                setValidationErrors(prev => ({ ...prev, [vaccine]: errorMsg }));
                toast.warning(`PCV allocation must be divisible by 4 or 5.`);
                return;
            }
        } else {
            // Validate: only allow numbers divisible by the vaccine's multiple
            if (numValue % multiple !== 0) {
                const errorMsg = `Must be divisible by ${multiple}`;
                setValidationErrors(prev => ({ ...prev, [vaccine]: errorMsg }));
                toast.warning(`${vaccine.replace('dose_', '').toUpperCase()} allocation must be divisible by ${multiple}.`);
                return;
            }
        }

        // Validate: cannot allocate more than max total stock
        if (numValue > maxStock) {
            const errorMsg = `Cannot exceed max stock (${maxStock})`;
            setValidationErrors(prev => ({ ...prev, [vaccine]: errorMsg }));
            toast.error(`${vaccine.replace('dose_', '').toUpperCase()} allocation (${numValue}) cannot exceed total max stock (${maxStock}).`);
            return;
        }

        // Clear any existing errors if validation passes
        if (validationErrors[vaccine]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[vaccine];
                return newErrors;
            });
        }

        // Auto-populate consumables if allocation is valid
        if (numValue > 0) {
            const vials = numValue / multiple; // Number of vials needed

            // Auto-populate consumables based on vaccine type
            switch (vaccine) {
                case 'dose_bcg':
                    setConsumablesData(prev => ({
                        ...prev,
                        bcg_diluent: vials.toString(),
                        bcg_syringe_2ml: vials.toString(), // Reconstitution syringe = diluent
                        bcg_syringe_005ml: numValue.toString(), // Administration syringe = allocation
                    }));
                    break;

                case 'dose_hepb':
                    setConsumablesData(prev => ({
                        ...prev,
                        hepb_syringe_05ml: numValue.toString(), // Administration syringe = allocation
                    }));
                    break;

                case 'dose_bopv':
                    setConsumablesData(prev => ({
                        ...prev,
                        bopv_dropper: vials.toString(), // Dropper = vials (per user request)
                    }));
                    break;

                case 'dose_penta':
                    setConsumablesData(prev => ({
                        ...prev,
                        penta_syringe_05ml: numValue.toString(), // Administration syringe = allocation
                    }));
                    break;

                case 'dose_pcv':
                    setConsumablesData(prev => ({
                        ...prev,
                        pcv_syringe_05ml: numValue.toString(), // Administration syringe = allocation
                    }));
                    break;

                case 'dose_ipv':
                    setConsumablesData(prev => ({
                        ...prev,
                        ipv_syringe_05ml: numValue.toString(), // Administration syringe = allocation
                    }));
                    break;

                case 'dose_mea':
                    setConsumablesData(prev => ({
                        ...prev,
                        mea_diluent: vials.toString(),
                        mea_syringe_5ml: vials.toString(), // Reconstitution syringe = diluent
                        mea_syringe_05ml: numValue.toString(), // Administration syringe = allocation
                    }));
                    break;

                case 'dose_yf':
                    setConsumablesData(prev => ({
                        ...prev,
                        yf_diluent: vials.toString(),
                        yf_syringe_5ml: vials.toString(), // Reconstitution syringe = diluent
                        yf_syringe_05ml: numValue.toString(), // Administration syringe = allocation
                    }));
                    break;

                case 'dose_td':
                    setConsumablesData(prev => ({
                        ...prev,
                        td_syringe_05ml: numValue.toString(), // Administration syringe = allocation
                    }));
                    break;

                case 'dose_mena':
                    setConsumablesData(prev => ({
                        ...prev,
                        mena_diluent: vials.toString(),
                        mena_syringe_5ml: vials.toString(), // Reconstitution syringe = diluent
                        mena_syringe_05ml: numValue.toString(), // Administration syringe = allocation
                    }));
                    break;

                case 'dose_rota':
                    setConsumablesData(prev => ({
                        ...prev,
                        rota_dropper: vials.toString(), // Dropper = vials (per user request)
                    }));
                    break;

                case 'dose_hpv':
                    setConsumablesData(prev => ({
                        ...prev,
                        hpv_syringe_05ml: numValue.toString(), // Administration syringe = allocation
                    }));
                    break;

                case 'dose_malaria':
                    setConsumablesData(prev => ({
                        ...prev,
                        malaria_diluent: vials.toString(),
                        malaria_syringe_5ml: vials.toString(), // Reconstitution syringe = diluent
                        malaria_syringe_05ml: numValue.toString(), // Administration syringe = allocation
                    }));
                    break;

                case 'dose_mr':
                    setConsumablesData(prev => ({
                        ...prev,
                        mr_diluent: vials.toString(),
                        mr_syringe_5ml: vials.toString(), // Reconstitution syringe = diluent
                        mr_syringe_05ml: numValue.toString(), // Administration syringe = allocation
                    }));
                    break;
            }
        } else {
            // Clear consumables if allocation is cleared
            switch (vaccine) {
                case 'dose_bcg':
                    setConsumablesData(prev => ({
                        ...prev,
                        bcg_diluent: '',
                        bcg_syringe_2ml: '',
                        bcg_syringe_005ml: '',
                    }));
                    break;

                case 'dose_hepb':
                    setConsumablesData(prev => ({
                        ...prev,
                        hepb_syringe_05ml: '',
                    }));
                    break;

                case 'dose_bopv':
                    setConsumablesData(prev => ({
                        ...prev,
                        bopv_dropper: '',
                    }));
                    break;

                case 'dose_penta':
                    setConsumablesData(prev => ({
                        ...prev,
                        penta_syringe_05ml: '',
                    }));
                    break;

                case 'dose_pcv':
                    setConsumablesData(prev => ({
                        ...prev,
                        pcv_syringe_05ml: '',
                    }));
                    break;

                case 'dose_ipv':
                    setConsumablesData(prev => ({
                        ...prev,
                        ipv_syringe_05ml: '',
                    }));
                    break;

                case 'dose_mea':
                    setConsumablesData(prev => ({
                        ...prev,
                        mea_diluent: '',
                        mea_syringe_5ml: '',
                        mea_syringe_05ml: '',
                    }));
                    break;

                case 'dose_yf':
                    setConsumablesData(prev => ({
                        ...prev,
                        yf_diluent: '',
                        yf_syringe_5ml: '',
                        yf_syringe_05ml: '',
                    }));
                    break;

                case 'dose_td':
                    setConsumablesData(prev => ({
                        ...prev,
                        td_syringe_05ml: '',
                    }));
                    break;

                case 'dose_mena':
                    setConsumablesData(prev => ({
                        ...prev,
                        mena_diluent: '',
                        mena_syringe_5ml: '',
                        mena_syringe_05ml: '',
                    }));
                    break;

                case 'dose_rota':
                    setConsumablesData(prev => ({
                        ...prev,
                        rota_dropper: '',
                    }));
                    break;

                case 'dose_hpv':
                    setConsumablesData(prev => ({
                        ...prev,
                        hpv_syringe_05ml: '',
                    }));
                    break;

                case 'dose_malaria':
                    setConsumablesData(prev => ({
                        ...prev,
                        malaria_diluent: '',
                        malaria_syringe_5ml: '',
                        malaria_syringe_05ml: '',
                    }));
                    break;

                case 'dose_mr':
                    setConsumablesData(prev => ({
                        ...prev,
                        mr_diluent: '',
                        mr_syringe_5ml: '',
                        mr_syringe_05ml: '',
                    }));
                    break;
            }
        }
    };

    // Handle metadata change
    const handleMetadataChange = (vaccine: string, field: string, value: string) => {
        setMetadataMap(prev => ({
            ...prev,
            [vaccine]: {
                ...prev[vaccine],
                [field]: value,
            },
        }));
    };

    // Columns for the facilities summary table
    const facilitiesColumns = useMemo(
        () => [
            {
                accessorKey: 'serial_no',
                header: 'S/N',
                size: 60,
                enableSorting: false,
                Cell: ({ row }: any) => row.index + 1,
            },
            {
                accessorKey: 'lga',
                header: 'LGA',
                size: 120,
            },
            {
                accessorKey: 'ward',
                header: 'Ward',
                size: 120,
            },
            {
                accessorKey: 'ehfName',
                header: 'Facility Name',
                size: 200,
            },
        ],
        []
    );

    // Get the rounding multiple for each vaccine type
    const getVaccineMultiple = (vaccineKey: string): number => {
        const multiples: Record<string, number> = {
            dose_bcg: 20,
            dose_bopv: 20,
            dose_mea: 10,
            dose_yf: 10,
            dose_td: 10,
            dose_penta: 10,
            dose_hepb: 10,
            dose_pcv: 5, // Using 5 as the multiple
            dose_ipv: 10,
            dose_mena: 10,
            dose_rota: 10,
            dose_hpv: 1,
            dose_malaria: 10,
            dose_mr: 5,
        };
        return multiples[vaccineKey] || 1;
    };

    // Helper function to round to nearest multiple
    const roundToNearestMultiple = (value: number, multiple: number): number => {
        return Math.round(value / multiple) * multiple;
    };

    // Helper function to calculate proportional allocation for each facility
    // Formula:
    // 1. Calculate percentage: (Facility max / Total max) * 100
    // 2. Apply percentage to user input: (percentage / 100) * userInput
    // 3. Round the final allocation to vaccine-specific multiple (e.g., BCG rounds to multiples of 20)
    // Example: Facility A max=150, Total=700, Input=420
    //   → (150/700)*100 = 21.43% → (21.43/100)*420 = 90 → Round to 90 (divisible by 10)
    const calcAllocation = (facilityMax: number, totalMax: number, userInput: number, vaccineKey: string): number => {
        if (totalMax === 0 || userInput === 0) return 0;

        // Calculate the raw percentage
        const percentage = (facilityMax / totalMax) * 100;

        // Apply percentage to get raw allocation
        const rawAllocation = (percentage / 100) * userInput;

        // Special rounding for PCV: round to nearest multiple of 4 or 5 (whichever is closer)
        if (vaccineKey === 'dose_pcv') {
            const roundedTo4 = roundToNearestMultiple(rawAllocation, 4);
            const roundedTo5 = roundToNearestMultiple(rawAllocation, 5);
            const diff4 = Math.abs(rawAllocation - roundedTo4);
            const diff5 = Math.abs(rawAllocation - roundedTo5);
            return diff4 <= diff5 ? roundedTo4 : roundedTo5;
        }

        // Round the final allocation to the vaccine-specific multiple
        const multiple = getVaccineMultiple(vaccineKey);
        return roundToNearestMultiple(rawAllocation, multiple);
    };

    // Handle submit
    const handleSubmit = async () => {
        // Check for validation errors
        if (Object.keys(validationErrors).length > 0) {
            toast.error('Please fix all validation errors before submitting');
            return;
        }

        // Check if at least one vaccine has allocation
        const hasAllocation = Object.values(allocationData).some(val => parseInt(val) > 0);
        if (!hasAllocation) {
            toast.warning('Please enter at least one vaccine quantity to allocate');
            return;
        }

        // Validate metadata for allocated vaccines
        for (const [key, value] of Object.entries(allocationData)) {
            const numValue = parseInt(value) || 0;
            if (numValue > 0) {
                const metadata = metadataMap[key];
                const vaccineLabel = vaccines.find(v => v.key === key)?.label || key;

                if (!metadata.vvm_stage) {
                    toast.error(`Please select VVM Stage for ${vaccineLabel}`);
                    return;
                }
                if (!metadata.batch_number) {
                    toast.error(`Please enter Batch Number for ${vaccineLabel}`);
                    return;
                }
                if (!metadata.expire_date) {
                    toast.error(`Please select Expiry Date for ${vaccineLabel}`);
                    return;
                }
            }
        }

        setIsSubmitting(true);

        try {
            // Generate a single batch number for all vaccines in this submission
            const singleBatchNumber = `BN-${Date.now()}`;

            // Prepare items array for the nested payload structure
            // Each facility gets proportional allocation based on: (facility max / total max) * user input
            // Consumables (syringes, diluents) are calculated based on the allocated amount for that facility
            const items = selectedFacilities.map((facility: SelectedFacility) => {
                // detailed allocation calculations
                const bcgAllocated = calcAllocation(facility.stockData?.dose_bcg || 0, totalMaxStock.bcg || 0, parseInt(allocationData.dose_bcg) || 0, 'dose_bcg');
                const hepbAllocated = calcAllocation(facility.stockData?.dose_hepb || 0, totalMaxStock.hepb || 0, parseInt(allocationData.dose_hepb) || 0, 'dose_hepb');
                const bopvAllocated = calcAllocation(facility.stockData?.dose_bopv || 0, totalMaxStock.bopv || 0, parseInt(allocationData.dose_bopv) || 0, 'dose_bopv');
                const pentaAllocated = calcAllocation(facility.stockData?.dose_penta || 0, totalMaxStock.penta || 0, parseInt(allocationData.dose_penta) || 0, 'dose_penta');
                const pcvAllocated = calcAllocation(facility.stockData?.dose_pcv || 0, totalMaxStock.pcv || 0, parseInt(allocationData.dose_pcv) || 0, 'dose_pcv');
                const ipvAllocated = calcAllocation(facility.stockData?.dose_ipv || 0, totalMaxStock.ipv || 0, parseInt(allocationData.dose_ipv) || 0, 'dose_ipv');
                const meaAllocated = calcAllocation(facility.stockData?.dose_mea || 0, totalMaxStock.mea || 0, parseInt(allocationData.dose_mea) || 0, 'dose_mea');
                const yfAllocated = calcAllocation(facility.stockData?.dose_yf || 0, totalMaxStock.yf || 0, parseInt(allocationData.dose_yf) || 0, 'dose_yf');
                const tdAllocated = calcAllocation(facility.stockData?.dose_td || 0, totalMaxStock.td || 0, parseInt(allocationData.dose_td) || 0, 'dose_td');
                const menaAllocated = calcAllocation(facility.stockData?.dose_mena || 0, totalMaxStock.mena || 0, parseInt(allocationData.dose_mena) || 0, 'dose_mena');
                const rotaAllocated = calcAllocation(facility.stockData?.dose_rota || 0, totalMaxStock.rota || 0, parseInt(allocationData.dose_rota) || 0, 'dose_rota');
                const hpvAllocated = calcAllocation(facility.stockData?.dose_hpv || 0, totalMaxStock.hpv || 0, parseInt(allocationData.dose_hpv) || 0, 'dose_hpv');

                return {
                    uuid: uuidv4(),
                    assigned_unique_id: facility.ehfId,
                    ehf_id: facility.stockId,
                    period: allocationDate,

                    // BCG - proportional allocation
                    dose_bcg_actual: facility.stockData?.dose_bcg || 0,
                    dose_bcg_allocated: bcgAllocated,
                    bcg_vvm_stage_scs: metadataMap.dose_bcg.vvm_stage || '',
                    bcg_batch_number_scs: metadataMap.dose_bcg.batch_number || '',
                    bcg_expire_date_scs: metadataMap.dose_bcg.expire_date || null,
                    bcg_diluent: Math.ceil(bcgAllocated / 20),
                    bcg_fiveml_syringe: 0, // Not used in UI, set to 0
                    bcg_twoml_syringe: Math.ceil(bcgAllocated / 20),
                    bcg_zerofiveml_syringe: bcgAllocated,

                    // HepB - proportional allocation
                    dose_hepb_actual: facility.stockData?.dose_hepb || 0,
                    dose_hepb_allocated: hepbAllocated,
                    hepb_vvm_stage_scs: metadataMap.dose_hepb.vvm_stage || '',
                    hepb_batch_number_scs: metadataMap.dose_hepb.batch_number || '',
                    hepb_expire_date_scs: metadataMap.dose_hepb.expire_date || null,
                    hepb_zerofiveml_syringe: hepbAllocated,

                    // bOPV - proportional allocation
                    dose_bopv_actual: facility.stockData?.dose_bopv || 0,
                    dose_bopv_allocated: bopvAllocated,
                    bopv_vvm_stage_scs: metadataMap.dose_bopv.vvm_stage || '',
                    bopv_batch_number_scs: metadataMap.dose_bopv.batch_number || '',
                    bopv_expire_date_scs: metadataMap.dose_bopv.expire_date || null,
                    bopv_dropper: Math.ceil(bopvAllocated / 20),

                    // Penta - proportional allocation
                    dose_penta_actual: facility.stockData?.dose_penta || 0,
                    dose_penta_allocated: pentaAllocated,
                    penta_vvm_stage_scs: metadataMap.dose_penta.vvm_stage || '',
                    penta_batch_number_scs: metadataMap.dose_penta.batch_number || '',
                    penta_expire_date_scs: metadataMap.dose_penta.expire_date || null,
                    penta_zerofive_syringe: pentaAllocated,

                    // PCV - proportional allocation
                    dose_pcv_actual: facility.stockData?.dose_pcv || 0,
                    dose_pcv_allocated: pcvAllocated,
                    pcv_vvm_stage_scs: metadataMap.dose_pcv.vvm_stage || '',
                    pcv_batch_number_scs: metadataMap.dose_pcv.batch_number || '',
                    pcv_expire_date_scs: metadataMap.dose_pcv.expire_date || null,
                    pcv_zerofive_syringe: pcvAllocated,

                    // IPV - proportional allocation
                    dose_ipv_actual: facility.stockData?.dose_ipv || 0,
                    dose_ipv_allocated: ipvAllocated,
                    ipv_vvm_stage_scs: metadataMap.dose_ipv.vvm_stage || '',
                    ipv_batch_number_scs: metadataMap.dose_ipv.batch_number || '',
                    ipv_expire_date_scs: metadataMap.dose_ipv.expire_date || null,
                    ipv_zerofive_syringe: ipvAllocated,

                    // Measles - proportional allocation
                    dose_mea_actual: facility.stockData?.dose_mea || 0,
                    dose_mea_allocated: meaAllocated,
                    mea_vvm_stage_scs: metadataMap.dose_mea.vvm_stage || '',
                    mea_batch_number_scs: metadataMap.dose_mea.batch_number || '',
                    mea_expire_date_scs: metadataMap.dose_mea.expire_date || null,
                    mea_diluent: Math.ceil(meaAllocated / 10),
                    mea_fiveml_syringe: Math.ceil(meaAllocated / 10),
                    mea_zerofiveml_syringe: meaAllocated,

                    // YF - proportional allocation
                    dose_yf_actual: facility.stockData?.dose_yf || 0,
                    dose_yf_allocated: yfAllocated,
                    yf_vvm_stage_scs: metadataMap.dose_yf.vvm_stage || '',
                    yf_batch_number_scs: metadataMap.dose_yf.batch_number || '',
                    yf_expire_date_scs: metadataMap.dose_yf.expire_date || null,
                    yf_diluent: Math.ceil(yfAllocated / 10),
                    yf_fiveml_syringe: Math.ceil(yfAllocated / 10),
                    yf_zerofiveml_syringe: yfAllocated,

                    // TD - proportional allocation
                    dose_td_actual: facility.stockData?.dose_td || 0,
                    dose_td_allocated: tdAllocated,
                    td_vvm_stage_scs: metadataMap.dose_td.vvm_stage || '',
                    td_batch_number_scs: metadataMap.dose_td.batch_number || '',
                    td_expire_date_scs: metadataMap.dose_td.expire_date || null,
                    td_zerofiveml_syringe: tdAllocated,

                    // MenA - proportional allocation
                    dose_mena_actual: facility.stockData?.dose_mena || 0,
                    dose_mena_allocated: menaAllocated,
                    mena_vvm_stage_scs: metadataMap.dose_mena.vvm_stage || '',
                    mena_batch_number_scs: metadataMap.dose_mena.batch_number || '',
                    mena_expire_date_scs: metadataMap.dose_mena.expire_date || null,
                    mena_diluent: Math.ceil(menaAllocated / 10),
                    mena_fiveml_syringe: Math.ceil(menaAllocated / 10),
                    mena_zerofiveml_syringe: menaAllocated,

                    // Rota - proportional allocation
                    dose_rota_actual: facility.stockData?.dose_rota || 0,
                    dose_rota_allocated: rotaAllocated,
                    rota_vvm_stage_scs: metadataMap.dose_rota.vvm_stage || '',
                    rota_batch_number_scs: metadataMap.dose_rota.batch_number || '',
                    rota_expire_date_scs: metadataMap.dose_rota.expire_date || null,
                    rota_dropper: Math.ceil(rotaAllocated / 10),

                    // HPV - proportional allocation
                    dose_hpv_actual: facility.stockData?.dose_hpv || 0,
                    dose_hpv_allocated: hpvAllocated,
                    hpv_vvm_stage_scs: metadataMap.dose_hpv.vvm_stage || '',
                    hpv_batch_number_scs: metadataMap.dose_hpv.batch_number || '',
                    hpv_expire_date_scs: metadataMap.dose_hpv.expire_date || null,
                    hpv_fiveml_syringe: hpvAllocated,

                    // Malaria - set to 0 (not in use currently)
                    dose_mal_actual: 0,
                    dose_mal_allocated: 0,
                    dose_mal_received: 0,
                    dose_mal_return: 0,
                    mal_vvm_stage_scs: '',
                    mal_vvm_stage_ehf: '',
                    mal_vvm_stage_threepl: '',
                    mal_batch_number_scs: '',
                    mal_batch_number: '',
                    mal_expire_date_scs: null,
                    mal_expire_date: null,
                    mal_diluent: 0,
                    mal_fiveml_syringe: 0,
                    mal_zerofiveml_syringe: 0,
                    mal_empty_vials: 0,
                    mal_unused_vials: 0,
                    mal_safety_boxes: 0,

                    // MR - set to 0 (not in use currently)
                    dose_mr_actual: 0,
                    dose_mr_allocated: 0,
                    dose_mr_received: 0,
                    dose_mr_return: 0,
                    mr_vvm_stage_scs: '',
                    mr_vvm_stage_ehf: '',
                    mr_vvm_stage_threepl: '',
                    mr_batch_number_scs: '',
                    mr_batch_number: '',
                    mr_expire_date_scs: null,
                    mr_expire_date: null,
                    mr_diluent: 0,
                    mr_fiveml_syringe: 0,
                    mr_zerofiveml_syringe: 0,
                    mr_empty_vials: 0,
                    mr_unused_vials: 0,
                    mr_safety_boxes: 0,

                    slwg_user: userData?.id || null,
                    // Calculate safety boxes per facility (100 syringes per box)
                    safty_box_empty: Math.ceil((
                        (bcgAllocated + Math.ceil(bcgAllocated / 20)) + // BCG: admin + recon
                        hepbAllocated + // HepB: admin
                        // bOPV: droppers not included in safety box calc usually
                        pentaAllocated + // Penta: admin
                        pcvAllocated + // PCV: admin
                        ipvAllocated + // IPV: admin
                        (meaAllocated + Math.ceil(meaAllocated / 10)) + // Measles: admin + recon
                        (yfAllocated + Math.ceil(yfAllocated / 10)) + // YF: admin + recon
                        tdAllocated + // TD: admin
                        (menaAllocated + Math.ceil(menaAllocated / 10)) + // MenA: admin + recon
                        hpvAllocated // HPV: admin
                    ) / 100) || 0,
                };
            });

            // Create the nested payload structure
            const nestedPayload = {
                batch_no: singleBatchNumber,
                period: allocationDate,
                threepl: selectedThreePl,
                status: userRole === 'scs' ? 1 : 0,
                created_by: userData?.username || 'system',
                items: items,
            };

            await submitAllocation.mutateAsync(nestedPayload);

            toast.success(`Successfully allocated vaccines for ${selectedFacilities.length} facilities!`);

            // Navigate back to the allocation list page
            navigate('/vaccine-allocation-stock-page', { state: { activeTab: 1 } });
        } catch (err: any) {
            toast.error(err?.message || 'Failed to submit allocations');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Vaccine configuration for rendering with consumables
    const vaccines = [
        {
            key: 'dose_bcg',
            label: 'BCG',
            maxKey: 'bcg',
            consumables: [
                { key: 'bcg_diluent', label: 'BCG Diluent' },
                { key: 'bcg_syringe_005ml', label: 'BCG 0.05ml Syringe' },
                { key: 'bcg_syringe_2ml', label: 'BCG 2ml Syringe' },
            ]
        },
        {
            key: 'dose_hepb',
            label: 'HepB',
            maxKey: 'hepb',
            consumables: [
                { key: 'hepb_syringe_05ml', label: 'HepB 0.5ml Syringe' },
            ]
        },
        {
            key: 'dose_bopv',
            label: 'bOPV',
            maxKey: 'bopv',
            consumables: [
                { key: 'bopv_dropper', label: 'bOPV Dropper' },
            ]
        },
        {
            key: 'dose_penta',
            label: 'Penta',
            maxKey: 'penta',
            consumables: [
                { key: 'penta_syringe_05ml', label: 'Penta 0.5ml Syringe' },
            ]
        },
        {
            key: 'dose_pcv',
            label: 'PCV',
            maxKey: 'pcv',
            consumables: [
                { key: 'pcv_syringe_05ml', label: 'PCV 0.5ml Syringe' },
            ]
        },
        {
            key: 'dose_ipv',
            label: 'IPV',
            maxKey: 'ipv',
            consumables: [
                { key: 'ipv_syringe_05ml', label: 'IPV 0.5ml Syringe' },
            ]
        },
        {
            key: 'dose_mea',
            label: 'Measles',
            maxKey: 'mea',
            consumables: [
                { key: 'mea_diluent', label: 'Measles Diluent' },
                { key: 'mea_syringe_05ml', label: 'Measles 0.5ml Syringe' },
                { key: 'mea_syringe_5ml', label: 'Measles 5ml Syringe' },
            ]
        },
        {
            key: 'dose_yf',
            label: 'YF',
            maxKey: 'yf',
            consumables: [
                { key: 'yf_diluent', label: 'Yellow Fever Diluent' },
                { key: 'yf_syringe_05ml', label: 'Yellow Fever 0.5ml Syringe' },
                { key: 'yf_syringe_5ml', label: 'Yellow Fever 5ml Syringe' },
            ]
        },
        {
            key: 'dose_td',
            label: 'TD',
            maxKey: 'td',
            consumables: [
                { key: 'td_syringe_05ml', label: 'TD 0.5ml Syringe' },
            ]
        },
        {
            key: 'dose_mena',
            label: 'MenA',
            maxKey: 'mena',
            consumables: [
                { key: 'mena_diluent', label: 'MenA Diluent' },
                { key: 'mena_syringe_05ml', label: 'MenA 0.5ml Syringe' },
                { key: 'mena_syringe_5ml', label: 'MenA 5ml Syringe' },
            ]
        },
        {
            key: 'dose_rota',
            label: 'Rota',
            maxKey: 'rota',
            consumables: [
                { key: 'rota_dropper', label: 'Rota Dropper' },
            ]
        },
        {
            key: 'dose_hpv',
            label: 'HPV',
            maxKey: 'hpv',
            consumables: [
                { key: 'hpv_syringe_05ml', label: 'HPV 0.5ml Syringe' },
            ]
        },

        {
            key: 'dose_mr',
            label: 'MR',
            maxKey: 'mr',
            consumables: [
                { key: 'mr_diluent', label: 'MR Diluent' },
                { key: 'mr_syringe_05ml', label: 'MR 0.5ml Syringe' },
                { key: 'mr_syringe_5ml', label: 'MR 5ml Syringe' },
            ]
        },
        {
            key: 'dose_malaria',
            label: 'Malaria',
            maxKey: 'malaria',
            consumables: [
                { key: 'malaria_diluent', label: 'Malaria Diluent' },
                { key: 'malaria_syringe_05ml', label: 'Malaria 0.5ml Syringe' },
                { key: 'malaria_syringe_5ml', label: 'Malaria 5ml Syringe' },
            ]
        },
    ];

    if (selectedFacilities.length === 0) {
        return (
            <DashboardContent maxWidth="xl">
                <Box sx={{ textAlign: 'center', py: 5 }}>
                    <Typography variant="h5" color="text.secondary">
                        No facilities selected
                    </Typography>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/vaccine-allocation-stock-page')}
                        variant="outlined"
                        sx={{ mt: 2 }}
                    >
                        Go Back
                    </Button>
                </Box>
            </DashboardContent>
        );
    }

    return (
        <DashboardContent maxWidth="xl">
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">Bulk Vaccine Allocation</Typography>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/vaccine-allocation-stock-page')}
                    variant="outlined"
                >
                    Back
                </Button>
            </Box>

            {/* Summary Card */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'rgb(12, 125, 64)' }}>
                        Allocation Details
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                                <Typography variant="caption" color="text.secondary">Facilities Selected</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 600, color: 'rgb(12, 125, 64)' }}>
                                    {selectedFacilities.length}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                                <Typography variant="caption" color="text.secondary">3PL</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                                    {threePlName}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Allocation Date"
                                value={allocationDate}
                                onChange={(e) => setAllocationDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Safety Box"
                                value={globalSafetyBox}
                                onChange={(e) => setGlobalSafetyBoxOverride(e.target.value)}
                                inputProps={{ min: 0 }}
                                helperText="Auto-calculated from syringes ÷ 100, editable"
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Facilities Table */}
            <Box sx={{ mb: 3 }}>
                <VaxTable
                    tableHeader="Selected Facilities"
                    columns={facilitiesColumns}
                    data={selectedFacilities}
                    loading={false}
                />
            </Box>

            {/* Vaccine Allocation Form */}
            <Card sx={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <LocalHospitalIcon sx={{ fontSize: 32, color: 'rgb(12, 125, 64)', mr: 1 }} />
                        <Typography variant="h5" sx={{ fontWeight: 600, color: 'rgb(12, 125, 64)' }}>
                            Allocate Vaccines
                        </Typography>
                    </Box>

                    <Grid container spacing={2}>
                        {vaccines.map((vaccine) => {
                            const maxStock = totalMaxStock[vaccine.maxKey] || 0;
                            const allocated = parseInt(allocationData[vaccine.key as keyof typeof allocationData]) || 0;

                            return (
                                <Grid item xs={12} sm={6} md={4} key={vaccine.key}>
                                    <Paper
                                        elevation={3}
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            border: '2px solid',
                                            borderColor: maxStock > 100 ? '#4caf50' : maxStock > 0 ? '#ff9800' : '#f44336',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>{vaccine.label}</Typography>
                                            <Chip
                                                label={`Total Max: ${maxStock}`}
                                                color={maxStock > 100 ? "success" : maxStock > 0 ? "warning" : "error"}
                                                size="small"
                                            />
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={Math.min((maxStock / 1000) * 100, 100)}
                                            sx={{ height: 8, borderRadius: 4, bgcolor: 'grey.200', mb: 2 }}
                                        />
                                        <TextField
                                            type="number"
                                            fullWidth
                                            size="small"
                                            label="Quantity to Allocate"
                                            value={allocationData[vaccine.key as keyof typeof allocationData]}
                                            onChange={(e) => handleAllocationChange(vaccine.key, e.target.value)}
                                            onBlur={() => handleAllocationBlur(vaccine.key)}
                                            inputProps={{ min: 0 }}
                                            error={!!validationErrors[vaccine.key]}
                                            helperText={validationErrors[vaccine.key] || (vaccine.key === 'dose_pcv' ? 'Must be divisible by 4 or 5' : `Must be divisible by ${getVaccineMultiple(vaccine.key)}`)}
                                        />
                                        {allocated > 0 && (
                                            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                                                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#666' }}>
                                                    Vaccine Details
                                                </Typography>
                                                <Grid container spacing={1.5}>
                                                    <Grid item xs={12}>
                                                        <FormControl fullWidth size="small">
                                                            <InputLabel required={allocated > 0}>VVM Stage</InputLabel>
                                                            <Select
                                                                value={metadataMap[vaccine.key].vvm_stage}
                                                                onChange={(e) => handleMetadataChange(vaccine.key, 'vvm_stage', e.target.value)}
                                                                label="VVM Stage"
                                                                required={allocated > 0}
                                                            >
                                                                <MenuItem value="">Select Stage</MenuItem>
                                                                <MenuItem value="Usable">Usable</MenuItem>
                                                                <MenuItem value="Unusable">Unusable</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            label="Batch Number"
                                                            value={metadataMap[vaccine.key].batch_number}
                                                            onChange={(e) => handleMetadataChange(vaccine.key, 'batch_number', e.target.value)}
                                                            placeholder="Enter batch number"
                                                            required={allocated > 0}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            type="date"
                                                            label="Earliest Expiry Date"
                                                            value={metadataMap[vaccine.key].expire_date}
                                                            onChange={(e) => handleMetadataChange(vaccine.key, 'expire_date', e.target.value)}
                                                            InputLabelProps={{ shrink: true }}
                                                            required={allocated > 0}
                                                        />
                                                    </Grid>
                                                </Grid>

                                                {/* Consumables Section */}
                                                {vaccine.consumables && vaccine.consumables.length > 0 && (
                                                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                                                        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#666' }}>
                                                            Consumables
                                                        </Typography>
                                                        <Grid container spacing={1.5}>
                                                            {vaccine.consumables.map((consumable) => (
                                                                <Grid item xs={12} key={consumable.key}>
                                                                    <TextField
                                                                        fullWidth
                                                                        size="small"
                                                                        type="number"
                                                                        label={consumable.label}
                                                                        value={consumablesData[consumable.key as keyof typeof consumablesData] || ''}
                                                                        onChange={(e) => handleConsumablesChange(consumable.key, e.target.value)}
                                                                        inputProps={{ min: 0 }}
                                                                    />
                                                                </Grid>
                                                            ))}
                                                        </Grid>
                                                    </Box>
                                                )}
                                            </Box>
                                        )}
                                    </Paper>
                                </Grid>
                            );
                        })}
                    </Grid>

                    {/* Submit Button */}
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleSubmit}
                            disabled={isSubmitting || Object.keys(validationErrors).length > 0}
                            sx={{
                                px: 4,
                                background: 'linear-gradient(135deg, rgb(12, 125, 64) 0%, rgb(10, 105, 54) 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, rgb(10, 105, 54) 0%, rgb(12, 125, 64) 100%)',
                                },
                            }}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Allocation'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </DashboardContent>
    );
};

export default VaccineAllocationBulkFormView;
