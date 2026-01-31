import React, { useMemo, useState, useEffect } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Chip, CircularProgress, Paper, Card, CardContent, LinearProgress, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import VaxTable, { ActionMenuItem } from '../../../utils/VaxTablePage';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { useNavigate, useLocation } from 'react-router-dom';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useFetchStockAtHand, useFetchAllocatedVaccines, useDeleteAllocation, useSubmitAllocation } from 'src/hooks/apis/upload/upload-hook';
import { StockAtHandData, AllocatedVaccineData } from 'src/hooks/apis/upload/upload-type';
import { useFetchUsers } from 'src/hooks/apis/user/user-hooks';
import { useFetchScs } from 'src/hooks/apis/lcs-scs/scs-hooks';
import { useFetchLcs } from 'src/hooks/apis/lcs-scs/lcs-hooks';
import { useFetchThreePl } from 'src/hooks/apis/threepl/threepl-hooks';
import { toast } from 'react-toastify';
import { keyframes } from '@mui/system';

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && <Box paddingY={1}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index: number) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  };
}

// Blinking animation for pending statuses
const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

const VaccineAllocationStockList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get user role and related lists
  const userRole = useMemo(() => sessionStorage.getItem('userRole') || '', []);
  const isSLWG = userRole === 'slwg';
  const isSCS = userRole === 'scs';
  const is3PL = userRole === 'threepl';
  const isMCCO = userRole === 'mcco' || userRole === 'conveyor'; // Support both role names
  const isLCS = userRole === 'lcs';

  // SCS can see Maximum Stock tab to allocate, SLWG can see to view only
  const showStockAtHandTab = isSLWG || isSCS;

  const userScsList = useMemo(() => {
    try {
      const scsListData = sessionStorage.getItem('scs_list');
      if (scsListData) {
        const parsed = JSON.parse(scsListData);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (error) {
      console.error('Error parsing scs_list from session storage:', error);
      return [];
    }
  }, []);

  const userScsId = userScsList[0]; // Get the first SCS ID

  const userState = sessionStorage.getItem('userState') || null;

  // Parse userState if it's a JSON object
  const parsedUserState = useMemo(() => {
    if (!userState) return null;
    try {
      const parsed = JSON.parse(userState);
      // If it's an object with a state property, return that, otherwise return the string
      return parsed?.state || userState;
    } catch {
      // If it's not JSON, return as is
      return userState;
    }
  }, [userState]);

  const { data: stockData = [], isLoading: isStockLoading } = useFetchStockAtHand(parsedUserState);
  const { data: allocatedData = [], isLoading: isAllocatedLoading } = useFetchAllocatedVaccines();
  const { data: allUsers = [] } = useFetchUsers();
  const { data: allScs = [] } = useFetchScs();
  const { data: allLcs = [] } = useFetchLcs();
  const { data: allThreePl = [] } = useFetchThreePl();

  // Get user's state for LCS filtering
  const userStateList = useMemo(() => {
    try {
      if (isLCS) {
        // Get LCS state from lcs_list
        const lcsListString = sessionStorage.getItem('lcs_list');
        if (lcsListString) {
          const lcsList = JSON.parse(lcsListString);
          if (Array.isArray(lcsList) && lcsList.length > 0) {
            const lcsId = parseInt(lcsList[0], 10);
            const lcsFacility = allLcs?.find(lcs => lcs.id === lcsId);
            // LCS only has one state (stat_id), return as array
            return lcsFacility?.stat_id ? [lcsFacility.stat_id] : [];
          }
        }
      }
      return [];
    } catch (error) {
      console.error('Error getting userStateList from session storage:', error);
      return [];
    }
  }, [isLCS, allLcs]);
  const deleteAllocationMutation = useDeleteAllocation();
  const submitAllocation = useSubmitAllocation();
  const [value, setValue] = useState<number>(0);
  const [selectedLGA, setSelectedLGA] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('');
  const [selectedEHF, setSelectedEHF] = useState<string>('');
  const [selectedThreePl, setSelectedThreePl] = useState<string>('');
  const [allocationPeriod, setAllocationPeriod] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [allocationToDelete, setAllocationToDelete] = useState<any>(null);
  // Batch number will be generated automatically, no state needed for input

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
  });

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

  // State for allocation list (table below)
  interface AllocationEntry {
    id: string;
    stockId: number;
    ehfId: string;
    ehfName: string;
    state: string;
    lga: string;
    ward: string;
    threePlId: string;
    threePlName: string;
    batchNo?: string;
    stockData: any;
    allocations: typeof allocationData;
    metadata: typeof metadataMap;
  }
  const [allocationList, setAllocationList] = useState<AllocationEntry[]>([]);

  // Add current allocation to the list
  const handleAddToList = () => {
    if (!selectedEHFData) return;

    // Check if at least one vaccine has allocation
    const hasAllocation = Object.values(allocationData).some(val => parseInt(val) > 0);
    if (!hasAllocation) {
      toast.warning('Please enter at least one vaccine quantity to allocate');
      return;
    }

    // Check if 3PL is selected
    if (!selectedThreePl) {
      toast.warning('Please select a 3PL for delivery');
      return;
    }

    // Check if this EHF is already in the list
    const existingIndex = allocationList.findIndex(item => item.ehfId === selectedEHF);
    if (existingIndex !== -1) {
      toast.warning('This facility is already in the allocation list. Remove it first to add again.');
      return;
    }

    // Get the selected 3PL details
    const selected3PL = allThreePl.find(pl => pl.id?.toString() === selectedThreePl);

    const newEntry: AllocationEntry = {
      id: Date.now().toString(),
      stockId: selectedEHFData.id,
      ehfId: selectedEHF,
      ehfName: selectedEHFData.name_of_ehf || '',
      state: selectedEHFData.state || '',
      lga: selectedEHFData.lga || '',
      ward: selectedEHFData.ward || '',
      threePlId: selectedThreePl,
      threePlName: selected3PL?.threepl_name || '',
      batchNo: `BN-${Date.now()}`,
      stockData: { ...selectedEHFData },
      allocations: { ...allocationData },
      metadata: { ...metadataMap },
    };

    setAllocationList(prev => [...prev, newEntry]);
    toast.success(`Added ${selectedEHFData.name_of_ehf} to allocation list`);

    // Reset form for next entry
    resetAllocationData();
    setSelectedEHF('');
  };

  // Remove allocation from the list
  const handleRemoveFromList = (id: string) => {
    setAllocationList(prev => prev.filter(item => item.id !== id));
    toast.info('Removed from allocation list');
  };

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

  // Submit all allocations
  const handleSubmitAllocations = async () => {
    if (allocationList.length === 0) {
      toast.warning('Please add at least one allocation to the list');
      return;
    }

    if (!allocationPeriod) {
      toast.warning('Please select an allocation period');
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate a single batch number for all vaccines in this submission
      const singleBatchNumber = `BN-${Date.now()}`;

      // Get the threepl value (assuming all entries have the same 3PL, use the first one)
      const threePlValue = allocationList[0]?.threePlId || undefined;

      // Prepare items array for the nested payload structure
      const items = allocationList.map(entry => ({
        assigned_unique_id: entry.ehfId,
        ehf_id: entry.stockId,
        period: allocationPeriod,

        // BCG
        dose_bcg_actual: entry.stockData.dose_bcg || 0,
        dose_bcg_allocated: parseInt(entry.allocations.dose_bcg) || 0,
        bcg_vvm_stage_scs: parseInt(entry.metadata.dose_bcg.vvm_stage) || 0,
        bcg_batch_number_scs: entry.metadata.dose_bcg.batch_number || '',
        bcg_expire_date_scs: entry.metadata.dose_bcg.expire_date || null,

        // HepB
        dose_hepb_actual: entry.stockData.dose_hepb || 0,
        dose_hepb_allocated: parseInt(entry.allocations.dose_hepb) || 0,
        hepb_vvm_stage_scs: parseInt(entry.metadata.dose_hepb.vvm_stage) || 0,
        hepb_batch_number_scs: entry.metadata.dose_hepb.batch_number || '',
        hepb_expire_date_scs: entry.metadata.dose_hepb.expire_date || null,

        // bOPV
        dose_bopv_actual: entry.stockData.dose_bopv || 0,
        dose_bopv_allocated: parseInt(entry.allocations.dose_bopv) || 0,
        bopv_vvm_stage_scs: parseInt(entry.metadata.dose_bopv.vvm_stage) || 0,
        bopv_batch_number_scs: entry.metadata.dose_bopv.batch_number || '',
        bopv_expire_date_scs: entry.metadata.dose_bopv.expire_date || null,

        // Penta
        dose_penta_actual: entry.stockData.dose_penta || 0,
        dose_penta_allocated: parseInt(entry.allocations.dose_penta) || 0,
        penta_vvm_stage_scs: parseInt(entry.metadata.dose_penta.vvm_stage) || 0,
        penta_batch_number_scs: entry.metadata.dose_penta.batch_number || '',
        penta_expire_date_scs: entry.metadata.dose_penta.expire_date || null,

        // PCV
        dose_pcv_actual: entry.stockData.dose_pcv || 0,
        dose_pcv_allocated: parseInt(entry.allocations.dose_pcv) || 0,
        pcv_vvm_stage_scs: parseInt(entry.metadata.dose_pcv.vvm_stage) || 0,
        pcv_batch_number_scs: entry.metadata.dose_pcv.batch_number || '',
        pcv_expire_date_scs: entry.metadata.dose_pcv.expire_date || null,

        // IPV
        dose_ipv_actual: entry.stockData.dose_ipv || 0,
        dose_ipv_allocated: parseInt(entry.allocations.dose_ipv) || 0,
        ipv_vvm_stage_scs: parseInt(entry.metadata.dose_ipv.vvm_stage) || 0,
        ipv_batch_number_scs: entry.metadata.dose_ipv.batch_number || '',
        ipv_expire_date_scs: entry.metadata.dose_ipv.expire_date || null,

        // Measles
        dose_mea_actual: entry.stockData.dose_mea || 0,
        dose_mea_allocated: parseInt(entry.allocations.dose_mea) || 0,
        mea_vvm_stage_scs: parseInt(entry.metadata.dose_mea.vvm_stage) || 0,
        mea_batch_number_scs: entry.metadata.dose_mea.batch_number || '',
        mea_expire_date_scs: entry.metadata.dose_mea.expire_date || null,

        // YF
        dose_yf_actual: entry.stockData.dose_yf || 0,
        dose_yf_allocated: parseInt(entry.allocations.dose_yf) || 0,
        yf_vvm_stage_scs: parseInt(entry.metadata.dose_yf.vvm_stage) || 0,
        yf_batch_number_scs: entry.metadata.dose_yf.batch_number || '',
        yf_expire_date_scs: entry.metadata.dose_yf.expire_date || null,

        // TD
        dose_td_actual: entry.stockData.dose_td || 0,
        dose_td_allocated: parseInt(entry.allocations.dose_td) || 0,
        td_vvm_stage_scs: parseInt(entry.metadata.dose_td.vvm_stage) || 0,
        td_batch_number_scs: entry.metadata.dose_td.batch_number || '',
        td_expire_date_scs: entry.metadata.dose_td.expire_date || null,

        // MenA
        dose_mena_actual: entry.stockData.dose_mena || 0,
        dose_mena_allocated: parseInt(entry.allocations.dose_mena) || 0,
        mena_vvm_stage_scs: parseInt(entry.metadata.dose_mena.vvm_stage) || 0,
        mena_batch_number_scs: entry.metadata.dose_mena.batch_number || '',
        mena_expire_date_scs: entry.metadata.dose_mena.expire_date || null,

        // Rota
        dose_rota_actual: entry.stockData.dose_rota || 0,
        dose_rota_allocated: parseInt(entry.allocations.dose_rota) || 0,
        rota_vvm_stage_scs: parseInt(entry.metadata.dose_rota.vvm_stage) || 0,
        rota_batch_number_scs: entry.metadata.dose_rota.batch_number || '',
        rota_expire_date_scs: entry.metadata.dose_rota.expire_date || null,

        // HPV
        dose_hpv_actual: entry.stockData.dose_hpv || 0,
        dose_hpv_allocated: parseInt(entry.allocations.dose_hpv) || 0,
        hpv_vvm_stage_scs: parseInt(entry.metadata.dose_hpv.vvm_stage) || 0,
        hpv_batch_number_scs: entry.metadata.dose_hpv.batch_number || '',
        hpv_expire_date_scs: entry.metadata.dose_hpv.expire_date || null,

        slwg_user: userData?.id || null,
      }));

      // Create the nested payload structure
      const nestedPayload = {
        batch_no: singleBatchNumber,
        period: allocationPeriod,
        threepl: threePlValue,
        status: userRole === 'scs' ? 1 : 0, // 0 = Pending SCS, 1 = Pending 3PL (SCS allocated)
        created_by: userData?.username || 'system',
        items: items,
      };

      await submitAllocation.mutateAsync(nestedPayload);

      toast.success(`Successfully allocated vaccines for ${allocationList.length} facilities!`);

      // Clear the allocation list and reset form
      setAllocationList([]);
      setAllocationPeriod('');
      setSelectedLGA('');
      setSelectedWard('');
      setSelectedEHF('');
      setSelectedThreePl('');
      resetAllocationData();

      // Switch to Vaccine Allocated tab
      setValue(1);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to submit allocations');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle allocation input change
  const handleAllocationChange = (vaccine: string, value: string) => {
    const numValue = parseInt(value) || 0;
    const maxValue = selectedEHFData ? (selectedEHFData as any)[vaccine] || 0 : 0;

    // Don't allow negative or values greater than available
    if (numValue < 0) return;
    if (numValue > maxValue) {
      setAllocationData(prev => ({ ...prev, [vaccine]: maxValue.toString() }));
      return;
    }

    setAllocationData(prev => ({ ...prev, [vaccine]: value }));
  };

  // Reset allocation data when EHF changes
  const resetAllocationData = () => {
    setAllocationData({
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
    setMetadataMap({
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
  };

  // Check if we should switch to a specific tab from navigation state
  useEffect(() => {
    const state = location.state as { activeTab?: number };
    if (state?.activeTab !== undefined) {
      setValue(state.activeTab);
      // Clear the state after using it
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  // Get SLWG users that are mapped to this SCS
  const mappedSlwgUserIds = useMemo(() => {
    if (!isSCS || !userScsId || !allUsers.length) return [];

    // Find all SLWG users who have this SCS in their scs_list
    const scsIdString = userScsId.toString();
    return allUsers
      .filter(user => {
        if (!user.scs_list || !Array.isArray(user.scs_list)) return false;
        // Check if the SCS ID exists in the user's scs_list 
        return user.scs_list.includes(scsIdString);
      })
      .map(user => user.id?.toString());
  }, [isSCS, userScsId, allUsers]);

  // Get the state managed by this SCS facility (for both SCS and SLWG users)
  const scsState = useMemo(() => {
    if ((!isSCS && !isSLWG) || !userScsId || !allScs.length) return null;

    // Find the SCS facility with this ID
    const scsFacility = allScs.find(scs => scs.id?.toString() === userScsId.toString());

    return scsFacility?.stat_id || null;
  }, [isSCS, isSLWG, userScsId, allScs]);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const availableLGAs = useMemo(() => {
    let filteredStock = stockData;

    // Filter stock data based on user role before building LGA list
    if (isSCS && scsState) {
      // SCS users should only see LGAs from their state
      filteredStock = stockData.filter(item => item.state?.toUpperCase() === scsState.toUpperCase());
    } else if (isSLWG && scsState) {
      // SLWG users should only see LGAs from their state
      filteredStock = stockData.filter(item => item.state?.toUpperCase() === scsState.toUpperCase());
    } else if (isLCS && userStateList.length > 0) {
      // LCS users should only see LGAs from their assigned state
      filteredStock = stockData.filter(item =>
        userStateList.some((state: string) => state.toUpperCase() === item.state?.toUpperCase())
      );
    }

    const lgas = filteredStock.map((item) => item.lga).filter(Boolean);
    return Array.from(new Set(lgas)).sort();
  }, [stockData, isSCS, isSLWG, isLCS, scsState, userStateList]);

  // Get available wards based on selected LGA
  const availableWards = useMemo(() => {
    if (!selectedLGA) return [];

    let filteredStock = stockData;

    // Filter by state first based on user role
    if ((isSCS || isSLWG) && scsState) {
      filteredStock = stockData.filter(item => item.state?.toUpperCase() === scsState.toUpperCase());
    } else if (isLCS && userStateList.length > 0) {
      filteredStock = stockData.filter(item =>
        userStateList.some((state: string) => state.toUpperCase() === item.state?.toUpperCase())
      );
    }

    // Filter by selected LGA
    filteredStock = filteredStock.filter(item => item.lga === selectedLGA);

    const wards = filteredStock.map((item) => item.ward).filter(Boolean);
    return Array.from(new Set(wards)).sort();
  }, [stockData, selectedLGA, isSCS, isSLWG, isLCS, scsState, userStateList]);

  // Get available EHFs based on selected LGA and Ward
  const availableEHFs = useMemo(() => {
    if (!selectedLGA || !selectedWard) return [];

    let filteredStock = stockData;

    // Filter by state first based on user role
    if ((isSCS || isSLWG) && scsState) {
      filteredStock = stockData.filter(item => item.state?.toUpperCase() === scsState.toUpperCase());
    } else if (isLCS && userStateList.length > 0) {
      filteredStock = stockData.filter(item =>
        userStateList.some((state: string) => state.toUpperCase() === item.state?.toUpperCase())
      );
    }

    // Filter by selected LGA and Ward
    filteredStock = filteredStock.filter(item => item.lga === selectedLGA && item.ward === selectedWard);

    return filteredStock.map((item) => ({
      id: item.assigned_unique_id,
      name: item.name_of_ehf,
    })).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [stockData, selectedLGA, selectedWard, isSCS, isSLWG, isLCS, scsState, userStateList]);

  // Get the selected EHF's stock data
  const selectedEHFData = useMemo(() => {
    if (!selectedEHF) return null;
    return stockData.find(item => item.assigned_unique_id === selectedEHF) || null;
  }, [stockData, selectedEHF]);

  // Get available 3PLs based on selected LGA
  const available3PLs = useMemo(() => {
    if (!selectedLGA) return [];
    return allThreePl.filter(pl => pl.lga?.toUpperCase() === selectedLGA.toUpperCase());
  }, [allThreePl, selectedLGA]);

  // Filter stock data based on state (for SCS/SLWG users), selected LGA, Ward, and EHF
  const filteredStockData = useMemo(() => {
    let data = stockData;

    // If user is SCS or SLWG, filter by state first
    if ((isSCS || isSLWG) && scsState) {
      data = stockData.filter((item) => item.state?.toUpperCase() === scsState.toUpperCase());
    }

    // Then filter by LGA if selected
    if (selectedLGA) {
      data = data.filter((item) => item.lga === selectedLGA);
    }

    // Then filter by Ward if selected
    if (selectedWard) {
      data = data.filter((item) => item.ward === selectedWard);
    }

    // Then filter by EHF if selected
    if (selectedEHF) {
      data = data.filter((item) => item.assigned_unique_id === selectedEHF);
    }

    return [...data].sort((a, b) => (a.id || 0) - (b.id || 0));
  }, [stockData, selectedLGA, selectedWard, selectedEHF, isSCS, isSLWG, scsState]);


  // SCS and SLWG users will only see allocations for EHFs in their state
  const enrichedAllocatedData = useMemo(() => {
    // Wait for stock data to load before enriching allocated data
    if (isStockLoading || stockData.length === 0) {
      return [];
    }

    // For batch summary view, the data is already aggregated.
    // batch_status comes directly from the API
    return allocatedData;
  }, [allocatedData, isStockLoading, stockData.length]);

  // Sort by batch_no descending (most recent first)
  const filteredAllocatedData = useMemo(() => {
    return [...enrichedAllocatedData].sort((a, b) => {
      const batchA = a.batch_no || '';
      const batchB = b.batch_no || '';
      return batchB.localeCompare(batchA);
    });
  }, [enrichedAllocatedData]);


  const handleLGAChange = (event: any) => {
    setSelectedLGA(event.target.value);
    // Reset dependent selections
    setSelectedWard('');
    setSelectedEHF('');
    setSelectedThreePl('');
  };

  const handleWardChange = (event: any) => {
    setSelectedWard(event.target.value);
    // Reset EHF selection when ward changes
    setSelectedEHF('');
  };

  const handleEHFChange = (event: any) => {
    setSelectedEHF(event.target.value);
    resetAllocationData();
  };

  const handleThreePlChange = (event: any) => {
    setSelectedThreePl(event.target.value);
  };

  const stockColumns = useMemo(
    () => [
      {
        accessorKey: 'serial_no',
        header: 'S/N',
        size: 80,
      },
      {
        accessorKey: 'assigned_unique_id',
        header: 'Unique ID',
        size: 120,
      },
      {
        accessorKey: 'name_of_ehf',
        header: 'EHF Name',
        size: 200,
      },
      {
        accessorKey: 'state',
        header: 'State',
        size: 100,
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
      // {
      //   accessorKey: 'phone_number',
      //   header: 'Phone Number',
      //   size: 130,
      // },
      // {
      //   accessorKey: 'cce_count',
      //   header: 'CCE Count',
      //   size: 80,
      // },
      {
        accessorKey: 'dose_bcg',
        header: 'BCG',
        size: 80,
      },
      {
        accessorKey: 'dose_hepb',
        header: 'HepB',
        size: 80,
      },
      {
        accessorKey: 'dose_bopv',
        header: 'bOPV',
        size: 80,
      },
      {
        accessorKey: 'dose_penta',
        header: 'Penta',
        size: 80,
      },
      {
        accessorKey: 'dose_pcv',
        header: 'PCV',
        size: 80,
      },
      {
        accessorKey: 'dose_ipv',
        header: 'IPV',
        size: 80,
      },
      {
        accessorKey: 'dose_mea',
        header: 'Measles',
        size: 80,
      },
      {
        accessorKey: 'dose_yf',
        header: 'YF',
        size: 80,
      },
      {
        accessorKey: 'dose_td',
        header: 'TD',
        size: 80,
      },
      {
        accessorKey: 'dose_mena',
        header: 'MenA',
        size: 80,
      },
      {
        accessorKey: 'dose_rota',
        header: 'Rota',
        size: 80,
      },
      {
        accessorKey: 'dose_hpv',
        header: 'HPV',
        size: 80,
      },
      {
        accessorKey: 'cce_functionality_status',
        header: 'CCE Status',
        size: 120,
      },
      {
        accessorKey: 'cce_model',
        header: 'CCE Model',
        size: 120,
      },
      {
        accessorKey: 'total_vaccine_storage_volume_utilized',
        header: 'Storage Used (L)',
        size: 130,
      },
      {
        accessorKey: 'remaining_cce_storage_capacity',
        header: 'Remaining Capacity (L)',
        size: 250,
      },
    ],
    []
  );

  const handleEdit = (data: StockAtHandData) => {
    navigate('/vaccine-allocation-stock-view', {
      state: {
        data: data,
        isUpdate: true,
        isView: false,
      },
    });
  };

  const handleDelete = (data: StockAtHandData) => {
    console.log('Delete stock:', data);
  };

  const handleAddNew = () => {
    navigate('/upload-view');
  };

  // SCS can allocate vaccines, SLWG can only view
  const handleViewStock = (data: StockAtHandData) => {
    navigate('/vaccine-allocation-stock-view', {
      state: {
        data: data,
        isUpdate: false,
        isView: true,
      },
    });
  };

  const stockActionItems: ActionMenuItem<StockAtHandData>[] = isSCS ? [
    {
      display: "Allocate Vaccine",
      handleClick: handleEdit,
      icon: <EditOutlinedIcon sx={{ color: "#1976D2" }} />,
    },
    {
      display: "Delete",
      handleClick: handleDelete,
      icon: <DeleteForeverOutlinedIcon sx={{ color: "red" }} />,
    },
  ] : isSLWG ? [
    {
      display: "View Details",
      handleClick: handleViewStock,
      icon: <VisibilityOutlinedIcon sx={{ color: "#1976D2" }} />,
    },
  ] : [];

  const handleViewAllocation = (data: any) => {
    navigate('/vaccine-allocation-batch-detail', {
      state: {
        batch_no: data.batch_no,
      },
    });
  };

  const handleConfirmDispatch = (data: any) => {
    // Navigate to confirmation page
    navigate('/vaccine-allocation-confirm-view', {
      state: {
        data: data,
        userRole: userRole,
        isView: false,
      },
    });
  };

  const handleConfirmPickup = (data: any) => {
    // Navigate to batch detail page for 3PL to confirm individual allocations
    navigate('/vaccine-allocation-batch-detail', {
      state: {
        batch_no: data.batch_no,
      },
    });
  };

  const handleMccoConfirm = (data: any) => {
    // Navigate to MCCO confirmation page with VVM, batch, expiry inputs
    navigate('/vaccine-allocation-mcco-confirm', {
      state: {
        data: data,
        userRole: userRole,
      },
    });
  };

  const handleLcsReview = (data: any) => {
    // Navigate to LCS return processing page
    navigate('/vaccine-allocation-lcs-return', {
      state: {
        data: data,
        userRole: userRole,
      },
    });
  };

  const handleReturnDeficit = (data: any) => {
    // Navigate to confirm view with Transfer Deficit section enabled
    navigate('/vaccine-allocation-confirm-view', {
      state: {
        data: data,
        userRole: userRole,
        isView: false,
        showTransferDeficit: true,
      },
    });
  };

  const handleDeleteAllocation = (data: any) => {
    setAllocationToDelete(data);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!allocationToDelete) return;

    deleteAllocationMutation.mutate(allocationToDelete.id, {
      onSuccess: () => {
        toast.success('Allocation deleted successfully!');
        setDeleteDialogOpen(false);
        setAllocationToDelete(null);
      },
      onError: (error: any) => {
        toast.error(error?.message || 'Failed to delete allocation');
        setDeleteDialogOpen(false);
      },
    });
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setAllocationToDelete(null);
  };

  // Action items for SCS users - only show confirm if status = 0
  const getScsActionItems = (row: any): ActionMenuItem<any>[] => {
    return [
      {
        display: "View Details",
        handleClick: handleViewAllocation,
        icon: <VisibilityOutlinedIcon sx={{ color: "#1976D2" }} />,
      },
    ];
  };

  // Action items for 3PL users - show bulk confirm if batch_status = 1
  const get3PlActionItems = (row: any): ActionMenuItem<any>[] => {
    const actions: ActionMenuItem<any>[] = [
      {
        display: "View Details",
        handleClick: handleViewAllocation,
        icon: <VisibilityOutlinedIcon sx={{ color: "#1976D2" }} />,
      },
    ];

    // Add bulk confirm pickup option if batch_status is 1 (Pending 3PL Pickup)
    if (Number(row.batch_status) === 1) {
      actions.push({
        display: "Bulk Confirm Pickup",
        handleClick: handleConfirmPickup,
        icon: <CheckCircleOutlineIcon sx={{ color: "#0C7D40" }} />,
      });
    }

    return actions;
  };

  // Action items for MCCO users - show confirm receipt if batch_status = 2
  // Routes to batch detail page first, then MCCO can confirm individual allocations
  const getMccoActionItems = (row: any): ActionMenuItem<any>[] => {
    const actions: ActionMenuItem<any>[] = [
      {
        display: "View Details",
        handleClick: handleViewAllocation,
        icon: <VisibilityOutlinedIcon sx={{ color: "#1976D2" }} />,
      },
    ];

    // Add confirm receipt option if batch_status is 2 (Pending MCCO Confirmation)
    if (Number(row.batch_status) === 2) {
      actions.push({
        display: "Confirm Receipt",
        handleClick: handleViewAllocation,  // Goes to batch detail, then MCCO confirms individual allocations
        icon: <CheckCircleOutlineIcon sx={{ color: "#0C7D40" }} />,
      });
    }

    // Add return deficit option if batch_status is 5 (Deficit Pending for Return)
    if (Number(row.batch_status) === 5) {
      actions.push({
        display: "Return Deficit",
        handleClick: handleViewAllocation,  // Goes to batch detail, then MCCO can return deficit for each allocation
        icon: <CheckCircleOutlineIcon sx={{ color: "#FF9800" }} />,
      });
    }

    // Add actions for batch_status 6 (mix of status 2 and 3)
    if (Number(row.batch_status) === 6) {
      actions.push({
        display: "Confirm & Return Deficit",
        handleClick: handleViewAllocation,  // Goes to batch detail to handle both
        icon: <CheckCircleOutlineIcon sx={{ color: "#FF9800" }} />,
      });
    }

    return actions;
  };

  // Action items for LCS users - show process returns for status 3 or 5
  const getLcsActionItems = (row: any): ActionMenuItem<any>[] => {
    return [
      {
        display: "View Details",
        handleClick: handleViewAllocation,
        icon: <VisibilityOutlinedIcon sx={{ color: "#1976D2" }} />,
      },
    ];
  };

  //   const handleConfirmAllocationToEHF = (data: any) => {
  //     // Navigate to confirmation page for SLWG to confirm allocation to EHF
  //     navigate('/vaccine-allocation-confirm-view', {
  //       state: {
  //         data: data,
  //         userRole: userRole,
  //         isView: false,
  //         confirmToEHF: true,
  //       },
  //     });
  //   };

  // Action items for SLWG - can only delete if status = 0 (not yet confirmed by SCS)
  const getSlwgActionItems = (row: any): ActionMenuItem<any>[] => {
    return [
      {
        display: "View Details",
        handleClick: handleViewAllocation,
        icon: <VisibilityOutlinedIcon sx={{ color: "#1976D2" }} />,
      },
    ];
  };

  // Choose action items based on user role
  // All roles now use dynamic functions that check status
  const getActionItems = isSCS
    ? getScsActionItems
    : is3PL
      ? get3PlActionItems
      : isMCCO
        ? getMccoActionItems
        : isLCS
          ? getLcsActionItems
          : isSLWG
            ? getSlwgActionItems
            : undefined;

  const allocatedColumns = useMemo(
    () => [
      {
        accessorKey: 'serial_no',
        header: 'S/N',
        size: 80,
        enableSorting: false,
        Cell: ({ row }: any) => row.index + 1,
      },
      {
        accessorKey: 'batch_no',
        header: 'Batch No',
        size: 150,
        Cell: ({ cell }: any) => cell.getValue() || '-',
      },
      {
        accessorKey: 'facility_count',
        header: 'No of Facility',
        size: 100,
        Cell: ({ cell }: any) => cell.getValue() || 0,
      },
      {
        accessorKey: 'threepl',
        header: '3PL',
        size: 120,
        Cell: ({ cell }: any) => {
          const val = cell.getValue();
          const pl = allThreePl?.find((p: any) => p?.id == val);
          return pl ? pl.threepl_name : val || '-';
        },
      },
      {
        accessorKey: 'vaccines.bcg.dose_allocated',
        header: 'BCG',
        size: 80,
      },
      {
        accessorKey: 'vaccines.hepb.dose_allocated',
        header: 'HepB',
        size: 80,
      },
      {
        accessorKey: 'vaccines.bopv.dose_allocated',
        header: 'bOPV',
        size: 80,
      },
      {
        accessorKey: 'vaccines.penta.dose_allocated',
        header: 'Penta',
        size: 80,
      },
      {
        accessorKey: 'vaccines.pcv.dose_allocated',
        header: 'PCV',
        size: 80,
      },
      {
        accessorKey: 'vaccines.ipv.dose_allocated',
        header: 'IPV',
        size: 80,
      },
      {
        accessorKey: 'vaccines.mea.dose_allocated',
        header: 'Measles',
        size: 80,
      },
      {
        accessorKey: 'vaccines.yf.dose_allocated',
        header: 'YF',
        size: 80,
      },
      {
        accessorKey: 'vaccines.td.dose_allocated',
        header: 'TD',
        size: 80,
      },
      {
        accessorKey: 'vaccines.mena.dose_allocated',
        header: 'MenA',
        size: 80,
      },
      {
        accessorKey: 'vaccines.rota.dose_allocated',
        header: 'Rota',
        size: 80,
      },
      {
        accessorKey: 'vaccines.hpv.dose_allocated',
        header: 'HPV',
        size: 80,
      },
      {
        accessorKey: 'batch_status',
        header: 'Status',
        size: 200,
        Cell: ({ cell, row }: any) => {
          const statusValue = cell.getValue();
          const status = Number(statusValue);
          const rowData = row.original;
          // Status workflow: 0 = Allocated by SLWG, 1 = Confirmed by SCS, 2 = Picked up by 3PL, 3 = Deficit Pending for Return, 4 = Completed, 5 = Pending Confirmation
          let label = 'Unknown';
          let color: 'warning' | 'success' | 'info' | 'default' = 'default';
          let shouldBlink = false;

          if (status === 0) {
            label = 'Pending SCS Confirmation';
            color = 'warning';
            shouldBlink = true;
          } else if (status === 1) {
            label = 'Pending 3PL Pickup';
            color = 'warning';
            shouldBlink = true;
          } else if (status === 2) {
            label = 'Pending MCCO Confirmation';
            color = 'warning';
            shouldBlink = true;
          } else if (status === 3) {
            label = 'Deficit Pending for Return';
            color = 'warning';
            shouldBlink = true;
          } else if (status === 4) {
            label = 'Completed';
            color = 'success';
            shouldBlink = false;
          } else if (status === 5) {
            // Batch status 5 = all individual allocations are status 3 (Deficit Pending for Return)
            label = 'Deficit Pending for Return';
            color = 'warning';
            shouldBlink = true;
          } else if (status === 6) {
            // Batch status 6 = mix of status 2 and status 3 in individual allocations
            label = 'Deficit & Pending MCCO Confirmation';
            color = 'warning';
            shouldBlink = true;
          }

          return (
            <Chip
              label={label}
              color={color}
              size="small"
              sx={shouldBlink ? {
                animation: `${blink} 2s ease-in-out infinite`,
              } : {}}
            />
          );
        },
      }
    ],
    [allThreePl]
  );

  // Draft Allocation Columns (for the list before submission)
  const draftAllocationColumns = useMemo(
    () => [
      {
        accessorKey: 'serial_no',
        header: 'S/N',
        size: 50,
        enableSorting: false,
        Cell: ({ row }: any) => row.index + 1,
      },
      {
        accessorKey: 'ehfName',
        header: 'EHF Name',
        size: 180,
      },
      {
        accessorKey: 'lga',
        header: 'LGA',
        size: 100,
      },
      {
        accessorKey: 'ward',
        header: 'Ward',
        size: 100,
      },
      {
        accessorKey: 'batchNo',
        header: 'Batch No',
        size: 100,
        Cell: ({ cell }: any) => cell.getValue() || '-',
      },
      {
        accessorKey: 'threePlName',
        header: '3PL',
        size: 100,
      },
      {
        accessorKey: 'allocations.dose_bcg',
        header: 'BCG',
        size: 70,
        Cell: ({ cell }: any) => cell.getValue() || '-',
      },
      {
        accessorKey: 'allocations.dose_hepb',
        header: 'HepB',
        size: 70,
        Cell: ({ cell }: any) => cell.getValue() || '-',
      },
      {
        accessorKey: 'allocations.dose_bopv',
        header: 'bOPV',
        size: 70,
        Cell: ({ cell }: any) => cell.getValue() || '-',
      },
      {
        accessorKey: 'allocations.dose_penta',
        header: 'Penta',
        size: 70,
        Cell: ({ cell }: any) => cell.getValue() || '-',
      },
      {
        accessorKey: 'allocations.dose_pcv',
        header: 'PCV',
        size: 70,
        Cell: ({ cell }: any) => cell.getValue() || '-',
      },
      {
        accessorKey: 'allocations.dose_ipv',
        header: 'IPV',
        size: 70,
        Cell: ({ cell }: any) => cell.getValue() || '-',
      },
      {
        accessorKey: 'allocations.dose_mea',
        header: 'Measles',
        size: 70,
        Cell: ({ cell }: any) => cell.getValue() || '-',
      },
      {
        accessorKey: 'allocations.dose_yf',
        header: 'YF',
        size: 70,
        Cell: ({ cell }: any) => cell.getValue() || '-',
      },
      {
        accessorKey: 'allocations.dose_td',
        header: 'TD',
        size: 70,
        Cell: ({ cell }: any) => cell.getValue() || '-',
      },
      {
        accessorKey: 'allocations.dose_mena',
        header: 'MenA',
        size: 70,
        Cell: ({ cell }: any) => cell.getValue() || '-',
      },
      {
        accessorKey: 'allocations.dose_rota',
        header: 'Rota',
        size: 70,
        Cell: ({ cell }: any) => cell.getValue() || '-',
      },
      {
        accessorKey: 'allocations.dose_hpv',
        header: 'HPV',
        size: 70,
        Cell: ({ cell }: any) => cell.getValue() || '-',
      },
    ],
    []
  );

  const getDraftActionItems = (row: AllocationEntry): ActionMenuItem<AllocationEntry>[] => {
    return [
      {
        display: "View",
        handleClick: (data) => toast.info(`Viewing allocation for ${data.ehfName}`), // Placeholder for view functionality
        icon: <VisibilityOutlinedIcon sx={{ color: "#1976D2" }} />,
      },
      {
        display: "Delete",
        handleClick: (data) => handleRemoveFromList(data.id),
        icon: <DeleteOutlineIcon sx={{ color: "red" }} />,
      },
    ];
  };

  return (
    <>
      {/* Only show tabs if SLWG, otherwise show allocated data directly */}
      {showStockAtHandTab && (
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          aria-label="scrollable force tabs"
        >
          <Tab style={{ textTransform: 'none' }} label="Maximum Stock" {...a11yProps(0)} />
          <Tab style={{ textTransform: 'none' }} label="Vaccine Allocated" {...a11yProps(1)} />
        </Tabs>
      )}

      {/* Show Maximum Stock tab only for SCS/SLWG - with filter dropdowns */}
      {showStockAtHandTab && (
        <TabPanel value={value} index={0}>
          <Box>
            {/* Filter Section - Only on Maximum Stock tab */}
            <Box sx={{ mt: 2, mb: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Filter by LGA</InputLabel>
                    <Select
                      value={selectedLGA}
                      onChange={handleLGAChange}
                      label="Filter by LGA"
                    >
                      <MenuItem value="">
                        <em>Select LGA</em>
                      </MenuItem>
                      {availableLGAs.map((lga) => (
                        <MenuItem key={lga} value={lga}>
                          {lga}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth disabled={!selectedLGA}>
                    <InputLabel>Filter by Ward</InputLabel>
                    <Select
                      value={selectedWard}
                      onChange={handleWardChange}
                      label="Filter by Ward"
                    >
                      <MenuItem value="">
                        <em>Select Ward</em>
                      </MenuItem>
                      {availableWards.map((ward) => (
                        <MenuItem key={ward} value={ward}>
                          {ward}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth disabled={!selectedWard}>
                    <InputLabel>Select EHF</InputLabel>
                    <Select
                      value={selectedEHF}
                      onChange={handleEHFChange}
                      label="Select EHF"
                    >
                      <MenuItem value="">
                        <em>Select EHF</em>
                      </MenuItem>
                      {availableEHFs.map((ehf) => (
                        <MenuItem key={ehf.id} value={ehf.id}>
                          {ehf.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth disabled={!selectedLGA || available3PLs.length === 0}>
                    <InputLabel>Select 3PL</InputLabel>
                    <Select
                      value={selectedThreePl}
                      onChange={handleThreePlChange}
                      label="Select 3PL"
                    >
                      <MenuItem value="">
                        <em>Select 3PL for Delivery</em>
                      </MenuItem>
                      {available3PLs.map((pl) => (
                        <MenuItem key={pl.id} value={pl.id?.toString()}>
                          {pl.threepl_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            {/* Show EHF Details and Vaccine Boxes when EHF is selected */}
            {selectedEHFData && (
              <>
                {/* EHF Details Card */}
                <Card sx={{ mb: 3 }}>
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
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{selectedEHFData.name_of_ehf}</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 1.5, bgcolor: 'background.default' }}>
                          <Typography variant="caption" color="text.secondary">
                            Unique ID
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{selectedEHFData.assigned_unique_id}</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 1.5, bgcolor: 'background.default' }}>
                          <Typography variant="caption" color="text.secondary">
                            State
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{selectedEHFData.state}</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 1.5, bgcolor: 'background.default' }}>
                          <Typography variant="caption" color="text.secondary">
                            LGA
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{selectedEHFData.lga}</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 1.5, bgcolor: 'background.default' }}>
                          <Typography variant="caption" color="text.secondary">
                            Ward
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{selectedEHFData.ward}</Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Vaccine Allocation Boxes */}
                <Card sx={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <LocalHospitalIcon sx={{ fontSize: 32, color: 'rgb(12, 125, 64)', mr: 1 }} />
                      <Typography variant="h5" sx={{ fontWeight: 600, color: 'rgb(12, 125, 64)' }}>
                        Allocate Vaccines
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      {/* BCG */}
                      <Grid item xs={12} sm={6} md={4}>
                        <Paper
                          elevation={3}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            border: '2px solid',
                            borderColor: (selectedEHFData.dose_bcg || 0) > 100 ? '#4caf50' : (selectedEHFData.dose_bcg || 0) > 0 ? '#ff9800' : '#f44336',
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>BCG</Typography>
                            <Chip
                              label={`Available: ${selectedEHFData.dose_bcg || 0}`}
                              color={(selectedEHFData.dose_bcg || 0) > 100 ? "success" : (selectedEHFData.dose_bcg || 0) > 0 ? "warning" : "error"}
                              size="small"
                            />
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(((selectedEHFData.dose_bcg || 0) / 1000) * 100, 100)}
                            sx={{ height: 8, borderRadius: 4, bgcolor: 'grey.200', mb: 2 }}
                          />
                          <TextField
                            type="number"
                            fullWidth
                            size="small"
                            label="Quantity to Allocate"
                            value={allocationData.dose_bcg}
                            onChange={(e) => handleAllocationChange('dose_bcg', e.target.value)}
                            inputProps={{ min: 0, max: selectedEHFData.dose_bcg || 0 }}
                          />
                          {allocationData.dose_bcg && (
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                              Remaining: {(selectedEHFData.dose_bcg || 0) - (parseInt(allocationData.dose_bcg) || 0)}
                            </Typography>
                          )}
                          {parseInt(allocationData.dose_bcg) > 0 && (
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
                                  />
                                </Grid>
                              </Grid>
                            </Box>
                          )}
                        </Paper>
                      </Grid>

                      {/* HepB */}
                      <Grid item xs={12} sm={6} md={4}>
                        <Paper
                          elevation={3}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            border: '2px solid',
                            borderColor: (selectedEHFData.dose_hepb || 0) > 100 ? '#4caf50' : (selectedEHFData.dose_hepb || 0) > 0 ? '#ff9800' : '#f44336',
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>HepB</Typography>
                            <Chip
                              label={`Available: ${selectedEHFData.dose_hepb || 0}`}
                              color={(selectedEHFData.dose_hepb || 0) > 100 ? "success" : (selectedEHFData.dose_hepb || 0) > 0 ? "warning" : "error"}
                              size="small"
                            />
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(((selectedEHFData.dose_hepb || 0) / 1000) * 100, 100)}
                            sx={{ height: 8, borderRadius: 4, bgcolor: 'grey.200', mb: 2 }}
                          />
                          <TextField
                            type="number"
                            fullWidth
                            size="small"
                            label="Quantity to Allocate"
                            value={allocationData.dose_hepb}
                            onChange={(e) => handleAllocationChange('dose_hepb', e.target.value)}
                            inputProps={{ min: 0, max: selectedEHFData.dose_hepb || 0 }}
                          />
                          {allocationData.dose_hepb && (
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                              Remaining: {(selectedEHFData.dose_hepb || 0) - (parseInt(allocationData.dose_hepb) || 0)}
                            </Typography>
                          )}
                          {parseInt(allocationData.dose_hepb) > 0 && (
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
                                  <TextField
                                    fullWidth
                                    size="small"
                                    label="Batch Number"
                                    value={metadataMap.dose_hepb.batch_number}
                                    onChange={(e) => handleMetadataChange('dose_hepb', 'batch_number', e.target.value)}
                                    placeholder="Enter batch number"
                                  />
                                </Grid>
                                <Grid item xs={12}>
                                  <TextField
                                    fullWidth
                                    size="small"
                                    type="date"
                                    label="Earliest Expiry Date"
                                    value={metadataMap.dose_hepb.expire_date}
                                    onChange={(e) => handleMetadataChange('dose_hepb', 'expire_date', e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                  />
                                </Grid>
                              </Grid>
                            </Box>
                          )}
                        </Paper>
                      </Grid>

                      {/* bOPV */}
                      <Grid item xs={12} sm={6} md={4}>
                        <Paper
                          elevation={3}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            border: '2px solid',
                            borderColor: (selectedEHFData.dose_bopv || 0) > 100 ? '#4caf50' : (selectedEHFData.dose_bopv || 0) > 0 ? '#ff9800' : '#f44336',
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>bOPV</Typography>
                            <Chip
                              label={`Available: ${selectedEHFData.dose_bopv || 0}`}
                              color={(selectedEHFData.dose_bopv || 0) > 100 ? "success" : (selectedEHFData.dose_bopv || 0) > 0 ? "warning" : "error"}
                              size="small"
                            />
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(((selectedEHFData.dose_bopv || 0) / 1000) * 100, 100)}
                            sx={{ height: 8, borderRadius: 4, bgcolor: 'grey.200', mb: 2 }}
                          />
                          <TextField
                            type="number"
                            fullWidth
                            size="small"
                            label="Quantity to Allocate"
                            value={allocationData.dose_bopv}
                            onChange={(e) => handleAllocationChange('dose_bopv', e.target.value)}
                            inputProps={{ min: 0, max: selectedEHFData.dose_bopv || 0 }}
                          />
                          {allocationData.dose_bopv && (
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                              Remaining: {(selectedEHFData.dose_bopv || 0) - (parseInt(allocationData.dose_bopv) || 0)}
                            </Typography>
                          )}
                          {parseInt(allocationData.dose_bopv) > 0 && (
                            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#666' }}>Vaccine Details</Typography>
                              <Grid container spacing={1.5}>
                                <Grid item xs={12}>
                                  <FormControl fullWidth size="small">
                                    <InputLabel>VVM Stage</InputLabel>
                                    <Select value={metadataMap.dose_bopv.vvm_stage} onChange={(e) => handleMetadataChange('dose_bopv', 'vvm_stage', e.target.value)} label="VVM Stage">
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
                                  <TextField fullWidth size="small" type="date" label="Earliest Expiry Date" value={metadataMap.dose_bopv.expire_date} onChange={(e) => handleMetadataChange('dose_bopv', 'expire_date', e.target.value)} InputLabelProps={{ shrink: true }} />
                                </Grid>
                              </Grid>
                            </Box>
                          )}
                        </Paper>
                      </Grid>

                      {/* Penta */}
                      <Grid item xs={12} sm={6} md={4}>
                        <Paper
                          elevation={3}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            border: '2px solid',
                            borderColor: (selectedEHFData.dose_penta || 0) > 100 ? '#4caf50' : (selectedEHFData.dose_penta || 0) > 0 ? '#ff9800' : '#f44336',
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>Penta</Typography>
                            <Chip
                              label={`Available: ${selectedEHFData.dose_penta || 0}`}
                              color={(selectedEHFData.dose_penta || 0) > 100 ? "success" : (selectedEHFData.dose_penta || 0) > 0 ? "warning" : "error"}
                              size="small"
                            />
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(((selectedEHFData.dose_penta || 0) / 1000) * 100, 100)}
                            sx={{ height: 8, borderRadius: 4, bgcolor: 'grey.200', mb: 2 }}
                          />
                          <TextField
                            type="number"
                            fullWidth
                            size="small"
                            label="Quantity to Allocate"
                            value={allocationData.dose_penta}
                            onChange={(e) => handleAllocationChange('dose_penta', e.target.value)}
                            inputProps={{ min: 0, max: selectedEHFData.dose_penta || 0 }}
                          />
                          {allocationData.dose_penta && (
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                              Remaining: {(selectedEHFData.dose_penta || 0) - (parseInt(allocationData.dose_penta) || 0)}
                            </Typography>
                          )}
                          {parseInt(allocationData.dose_penta) > 0 && (
                            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#666' }}>Vaccine Details</Typography>
                              <Grid container spacing={1.5}>
                                <Grid item xs={12}>
                                  <FormControl fullWidth size="small">
                                    <InputLabel>VVM Stage</InputLabel>
                                    <Select value={metadataMap.dose_penta.vvm_stage} onChange={(e) => handleMetadataChange('dose_penta', 'vvm_stage', e.target.value)} label="VVM Stage">
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
                                  <TextField fullWidth size="small" type="date" label="Earliest Expiry Date" value={metadataMap.dose_penta.expire_date} onChange={(e) => handleMetadataChange('dose_penta', 'expire_date', e.target.value)} InputLabelProps={{ shrink: true }} />
                                </Grid>
                              </Grid>
                            </Box>
                          )}
                        </Paper>
                      </Grid>

                      {/* PCV */}
                      <Grid item xs={12} sm={6} md={4}>
                        <Paper
                          elevation={3}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            border: '2px solid',
                            borderColor: (selectedEHFData.dose_pcv || 0) > 100 ? '#4caf50' : (selectedEHFData.dose_pcv || 0) > 0 ? '#ff9800' : '#f44336',
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>PCV</Typography>
                            <Chip
                              label={`Available: ${selectedEHFData.dose_pcv || 0}`}
                              color={(selectedEHFData.dose_pcv || 0) > 100 ? "success" : (selectedEHFData.dose_pcv || 0) > 0 ? "warning" : "error"}
                              size="small"
                            />
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(((selectedEHFData.dose_pcv || 0) / 1000) * 100, 100)}
                            sx={{ height: 8, borderRadius: 4, bgcolor: 'grey.200', mb: 2 }}
                          />
                          <TextField
                            type="number"
                            fullWidth
                            size="small"
                            label="Quantity to Allocate"
                            value={allocationData.dose_pcv}
                            onChange={(e) => handleAllocationChange('dose_pcv', e.target.value)}
                            inputProps={{ min: 0, max: selectedEHFData.dose_pcv || 0 }}
                          />
                          {allocationData.dose_pcv && (
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                              Remaining: {(selectedEHFData.dose_pcv || 0) - (parseInt(allocationData.dose_pcv) || 0)}
                            </Typography>
                          )}
                          {parseInt(allocationData.dose_pcv) > 0 && (
                            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#666' }}>Vaccine Details</Typography>
                              <Grid container spacing={1.5}>
                                <Grid item xs={12}>
                                  <FormControl fullWidth size="small">
                                    <InputLabel>VVM Stage</InputLabel>
                                    <Select value={metadataMap.dose_pcv.vvm_stage} onChange={(e) => handleMetadataChange('dose_pcv', 'vvm_stage', e.target.value)} label="VVM Stage">
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
                                  <TextField fullWidth size="small" type="date" label="Earliest Expiry Date" value={metadataMap.dose_pcv.expire_date} onChange={(e) => handleMetadataChange('dose_pcv', 'expire_date', e.target.value)} InputLabelProps={{ shrink: true }} />
                                </Grid>
                              </Grid>
                            </Box>
                          )}
                        </Paper>
                      </Grid>

                      {/* IPV */}
                      <Grid item xs={12} sm={6} md={4}>
                        <Paper
                          elevation={3}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            border: '2px solid',
                            borderColor: (selectedEHFData.dose_ipv || 0) > 100 ? '#4caf50' : (selectedEHFData.dose_ipv || 0) > 0 ? '#ff9800' : '#f44336',
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>IPV</Typography>
                            <Chip
                              label={`Available: ${selectedEHFData.dose_ipv || 0}`}
                              color={(selectedEHFData.dose_ipv || 0) > 100 ? "success" : (selectedEHFData.dose_ipv || 0) > 0 ? "warning" : "error"}
                              size="small"
                            />
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(((selectedEHFData.dose_ipv || 0) / 1000) * 100, 100)}
                            sx={{ height: 8, borderRadius: 4, bgcolor: 'grey.200', mb: 2 }}
                          />
                          <TextField
                            type="number"
                            fullWidth
                            size="small"
                            label="Quantity to Allocate"
                            value={allocationData.dose_ipv}
                            onChange={(e) => handleAllocationChange('dose_ipv', e.target.value)}
                            inputProps={{ min: 0, max: selectedEHFData.dose_ipv || 0 }}
                          />
                          {allocationData.dose_ipv && (
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                              Remaining: {(selectedEHFData.dose_ipv || 0) - (parseInt(allocationData.dose_ipv) || 0)}
                            </Typography>
                          )}
                          {parseInt(allocationData.dose_ipv) > 0 && (
                            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#666' }}>Vaccine Details</Typography>
                              <Grid container spacing={1.5}>
                                <Grid item xs={12}>
                                  <FormControl fullWidth size="small">
                                    <InputLabel>VVM Stage</InputLabel>
                                    <Select value={metadataMap.dose_ipv.vvm_stage} onChange={(e) => handleMetadataChange('dose_ipv', 'vvm_stage', e.target.value)} label="VVM Stage">
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
                                  <TextField fullWidth size="small" type="date" label="Earliest Expiry Date" value={metadataMap.dose_ipv.expire_date} onChange={(e) => handleMetadataChange('dose_ipv', 'expire_date', e.target.value)} InputLabelProps={{ shrink: true }} />
                                </Grid>
                              </Grid>
                            </Box>
                          )}
                        </Paper>
                      </Grid>

                      {/* Measles */}
                      <Grid item xs={12} sm={6} md={4}>
                        <Paper elevation={3} sx={{ p: 2, borderRadius: 2, border: '2px solid', borderColor: (selectedEHFData.dose_mea || 0) > 100 ? '#4caf50' : (selectedEHFData.dose_mea || 0) > 0 ? '#ff9800' : '#f44336' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>Measles</Typography>
                            <Chip label={`Available: ${selectedEHFData.dose_mea || 0}`} color={(selectedEHFData.dose_mea || 0) > 100 ? "success" : (selectedEHFData.dose_mea || 0) > 0 ? "warning" : "error"} size="small" />
                          </Box>
                          <LinearProgress variant="determinate" value={Math.min(((selectedEHFData.dose_mea || 0) / 1000) * 100, 100)} sx={{ height: 8, borderRadius: 4, bgcolor: 'grey.200', mb: 2 }} />
                          <TextField type="number" fullWidth size="small" label="Quantity to Allocate" value={allocationData.dose_mea} onChange={(e) => handleAllocationChange('dose_mea', e.target.value)} inputProps={{ min: 0, max: selectedEHFData.dose_mea || 0 }} />
                          {allocationData.dose_mea && <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>Remaining: {(selectedEHFData.dose_mea || 0) - (parseInt(allocationData.dose_mea) || 0)}</Typography>}
                          {parseInt(allocationData.dose_mea) > 0 && (
                            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#666' }}>Vaccine Details</Typography>
                              <Grid container spacing={1.5}>
                                <Grid item xs={12}><FormControl fullWidth size="small"><InputLabel>VVM Stage</InputLabel><Select value={metadataMap.dose_mea.vvm_stage} onChange={(e) => handleMetadataChange('dose_mea', 'vvm_stage', e.target.value)} label="VVM Stage"><MenuItem value="">Select Stage</MenuItem><MenuItem value="1">Stage 1</MenuItem><MenuItem value="2">Stage 2</MenuItem><MenuItem value="3">Stage 3</MenuItem><MenuItem value="4">Stage 4</MenuItem></Select></FormControl></Grid>
                                <Grid item xs={12}><TextField fullWidth size="small" label="Batch Number" value={metadataMap.dose_mea.batch_number} onChange={(e) => handleMetadataChange('dose_mea', 'batch_number', e.target.value)} placeholder="Enter batch number" /></Grid>
                                <Grid item xs={12}><TextField fullWidth size="small" type="date" label="Earliest Expiry Date" value={metadataMap.dose_mea.expire_date} onChange={(e) => handleMetadataChange('dose_mea', 'expire_date', e.target.value)} InputLabelProps={{ shrink: true }} /></Grid>
                              </Grid>
                            </Box>
                          )}
                        </Paper>
                      </Grid>

                      {/* YF */}
                      <Grid item xs={12} sm={6} md={4}>
                        <Paper elevation={3} sx={{ p: 2, borderRadius: 2, border: '2px solid', borderColor: (selectedEHFData.dose_yf || 0) > 100 ? '#4caf50' : (selectedEHFData.dose_yf || 0) > 0 ? '#ff9800' : '#f44336' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>YF</Typography>
                            <Chip label={`Available: ${selectedEHFData.dose_yf || 0}`} color={(selectedEHFData.dose_yf || 0) > 100 ? "success" : (selectedEHFData.dose_yf || 0) > 0 ? "warning" : "error"} size="small" />
                          </Box>
                          <LinearProgress variant="determinate" value={Math.min(((selectedEHFData.dose_yf || 0) / 1000) * 100, 100)} sx={{ height: 8, borderRadius: 4, bgcolor: 'grey.200', mb: 2 }} />
                          <TextField type="number" fullWidth size="small" label="Quantity to Allocate" value={allocationData.dose_yf} onChange={(e) => handleAllocationChange('dose_yf', e.target.value)} inputProps={{ min: 0, max: selectedEHFData.dose_yf || 0 }} />
                          {allocationData.dose_yf && <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>Remaining: {(selectedEHFData.dose_yf || 0) - (parseInt(allocationData.dose_yf) || 0)}</Typography>}
                          {parseInt(allocationData.dose_yf) > 0 && (
                            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#666' }}>Vaccine Details</Typography>
                              <Grid container spacing={1.5}>
                                <Grid item xs={12}><FormControl fullWidth size="small"><InputLabel>VVM Stage</InputLabel><Select value={metadataMap.dose_yf.vvm_stage} onChange={(e) => handleMetadataChange('dose_yf', 'vvm_stage', e.target.value)} label="VVM Stage"><MenuItem value="">Select Stage</MenuItem><MenuItem value="1">Stage 1</MenuItem><MenuItem value="2">Stage 2</MenuItem><MenuItem value="3">Stage 3</MenuItem><MenuItem value="4">Stage 4</MenuItem></Select></FormControl></Grid>
                                <Grid item xs={12}><TextField fullWidth size="small" label="Batch Number" value={metadataMap.dose_yf.batch_number} onChange={(e) => handleMetadataChange('dose_yf', 'batch_number', e.target.value)} placeholder="Enter batch number" /></Grid>
                                <Grid item xs={12}><TextField fullWidth size="small" type="date" label="Earliest Expiry Date" value={metadataMap.dose_yf.expire_date} onChange={(e) => handleMetadataChange('dose_yf', 'expire_date', e.target.value)} InputLabelProps={{ shrink: true }} /></Grid>
                              </Grid>
                            </Box>
                          )}
                        </Paper>
                      </Grid>

                      {/* TD */}
                      <Grid item xs={12} sm={6} md={4}>
                        <Paper elevation={3} sx={{ p: 2, borderRadius: 2, border: '2px solid', borderColor: (selectedEHFData.dose_td || 0) > 100 ? '#4caf50' : (selectedEHFData.dose_td || 0) > 0 ? '#ff9800' : '#f44336' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>TD</Typography>
                            <Chip label={`Available: ${selectedEHFData.dose_td || 0}`} color={(selectedEHFData.dose_td || 0) > 100 ? "success" : (selectedEHFData.dose_td || 0) > 0 ? "warning" : "error"} size="small" />
                          </Box>
                          <LinearProgress variant="determinate" value={Math.min(((selectedEHFData.dose_td || 0) / 1000) * 100, 100)} sx={{ height: 8, borderRadius: 4, bgcolor: 'grey.200', mb: 2 }} />
                          <TextField type="number" fullWidth size="small" label="Quantity to Allocate" value={allocationData.dose_td} onChange={(e) => handleAllocationChange('dose_td', e.target.value)} inputProps={{ min: 0, max: selectedEHFData.dose_td || 0 }} />
                          {allocationData.dose_td && <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>Remaining: {(selectedEHFData.dose_td || 0) - (parseInt(allocationData.dose_td) || 0)}</Typography>}
                          {parseInt(allocationData.dose_td) > 0 && (
                            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#666' }}>Vaccine Details</Typography>
                              <Grid container spacing={1.5}>
                                <Grid item xs={12}><FormControl fullWidth size="small"><InputLabel>VVM Stage</InputLabel><Select value={metadataMap.dose_td.vvm_stage} onChange={(e) => handleMetadataChange('dose_td', 'vvm_stage', e.target.value)} label="VVM Stage"><MenuItem value="">Select Stage</MenuItem><MenuItem value="1">Stage 1</MenuItem><MenuItem value="2">Stage 2</MenuItem><MenuItem value="3">Stage 3</MenuItem><MenuItem value="4">Stage 4</MenuItem></Select></FormControl></Grid>
                                <Grid item xs={12}><TextField fullWidth size="small" label="Batch Number" value={metadataMap.dose_td.batch_number} onChange={(e) => handleMetadataChange('dose_td', 'batch_number', e.target.value)} placeholder="Enter batch number" /></Grid>
                                <Grid item xs={12}><TextField fullWidth size="small" type="date" label="Earliest Expiry Date" value={metadataMap.dose_td.expire_date} onChange={(e) => handleMetadataChange('dose_td', 'expire_date', e.target.value)} InputLabelProps={{ shrink: true }} /></Grid>
                              </Grid>
                            </Box>
                          )}
                        </Paper>
                      </Grid>

                      {/* MenA */}
                      <Grid item xs={12} sm={6} md={4}>
                        <Paper elevation={3} sx={{ p: 2, borderRadius: 2, border: '2px solid', borderColor: (selectedEHFData.dose_mena || 0) > 100 ? '#4caf50' : (selectedEHFData.dose_mena || 0) > 0 ? '#ff9800' : '#f44336' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>MenA</Typography>
                            <Chip label={`Available: ${selectedEHFData.dose_mena || 0}`} color={(selectedEHFData.dose_mena || 0) > 100 ? "success" : (selectedEHFData.dose_mena || 0) > 0 ? "warning" : "error"} size="small" />
                          </Box>
                          <LinearProgress variant="determinate" value={Math.min(((selectedEHFData.dose_mena || 0) / 1000) * 100, 100)} sx={{ height: 8, borderRadius: 4, bgcolor: 'grey.200', mb: 2 }} />
                          <TextField type="number" fullWidth size="small" label="Quantity to Allocate" value={allocationData.dose_mena} onChange={(e) => handleAllocationChange('dose_mena', e.target.value)} inputProps={{ min: 0, max: selectedEHFData.dose_mena || 0 }} />
                          {allocationData.dose_mena && <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>Remaining: {(selectedEHFData.dose_mena || 0) - (parseInt(allocationData.dose_mena) || 0)}</Typography>}
                          {parseInt(allocationData.dose_mena) > 0 && (
                            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#666' }}>Vaccine Details</Typography>
                              <Grid container spacing={1.5}>
                                <Grid item xs={12}><FormControl fullWidth size="small"><InputLabel>VVM Stage</InputLabel><Select value={metadataMap.dose_mena.vvm_stage} onChange={(e) => handleMetadataChange('dose_mena', 'vvm_stage', e.target.value)} label="VVM Stage"><MenuItem value="">Select Stage</MenuItem><MenuItem value="1">Stage 1</MenuItem><MenuItem value="2">Stage 2</MenuItem><MenuItem value="3">Stage 3</MenuItem><MenuItem value="4">Stage 4</MenuItem></Select></FormControl></Grid>
                                <Grid item xs={12}><TextField fullWidth size="small" label="Batch Number" value={metadataMap.dose_mena.batch_number} onChange={(e) => handleMetadataChange('dose_mena', 'batch_number', e.target.value)} placeholder="Enter batch number" /></Grid>
                                <Grid item xs={12}><TextField fullWidth size="small" type="date" label="Earliest Expiry Date" value={metadataMap.dose_mena.expire_date} onChange={(e) => handleMetadataChange('dose_mena', 'expire_date', e.target.value)} InputLabelProps={{ shrink: true }} /></Grid>
                              </Grid>
                            </Box>
                          )}
                        </Paper>
                      </Grid>

                      {/* Rota */}
                      <Grid item xs={12} sm={6} md={4}>
                        <Paper elevation={3} sx={{ p: 2, borderRadius: 2, border: '2px solid', borderColor: (selectedEHFData.dose_rota || 0) > 100 ? '#4caf50' : (selectedEHFData.dose_rota || 0) > 0 ? '#ff9800' : '#f44336' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>Rota</Typography>
                            <Chip label={`Available: ${selectedEHFData.dose_rota || 0}`} color={(selectedEHFData.dose_rota || 0) > 100 ? "success" : (selectedEHFData.dose_rota || 0) > 0 ? "warning" : "error"} size="small" />
                          </Box>
                          <LinearProgress variant="determinate" value={Math.min(((selectedEHFData.dose_rota || 0) / 1000) * 100, 100)} sx={{ height: 8, borderRadius: 4, bgcolor: 'grey.200', mb: 2 }} />
                          <TextField type="number" fullWidth size="small" label="Quantity to Allocate" value={allocationData.dose_rota} onChange={(e) => handleAllocationChange('dose_rota', e.target.value)} inputProps={{ min: 0, max: selectedEHFData.dose_rota || 0 }} />
                          {allocationData.dose_rota && <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>Remaining: {(selectedEHFData.dose_rota || 0) - (parseInt(allocationData.dose_rota) || 0)}</Typography>}
                          {parseInt(allocationData.dose_rota) > 0 && (
                            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#666' }}>Vaccine Details</Typography>
                              <Grid container spacing={1.5}>
                                <Grid item xs={12}><FormControl fullWidth size="small"><InputLabel>VVM Stage</InputLabel><Select value={metadataMap.dose_rota.vvm_stage} onChange={(e) => handleMetadataChange('dose_rota', 'vvm_stage', e.target.value)} label="VVM Stage"><MenuItem value="">Select Stage</MenuItem><MenuItem value="1">Stage 1</MenuItem><MenuItem value="2">Stage 2</MenuItem><MenuItem value="3">Stage 3</MenuItem><MenuItem value="4">Stage 4</MenuItem></Select></FormControl></Grid>
                                <Grid item xs={12}><TextField fullWidth size="small" label="Batch Number" value={metadataMap.dose_rota.batch_number} onChange={(e) => handleMetadataChange('dose_rota', 'batch_number', e.target.value)} placeholder="Enter batch number" /></Grid>
                                <Grid item xs={12}><TextField fullWidth size="small" type="date" label="Earliest Expiry Date" value={metadataMap.dose_rota.expire_date} onChange={(e) => handleMetadataChange('dose_rota', 'expire_date', e.target.value)} InputLabelProps={{ shrink: true }} /></Grid>
                              </Grid>
                            </Box>
                          )}
                        </Paper>
                      </Grid>

                      {/* HPV */}
                      <Grid item xs={12} sm={6} md={4}>
                        <Paper elevation={3} sx={{ p: 2, borderRadius: 2, border: '2px solid', borderColor: (selectedEHFData.dose_hpv || 0) > 100 ? '#4caf50' : (selectedEHFData.dose_hpv || 0) > 0 ? '#ff9800' : '#f44336' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>HPV</Typography>
                            <Chip label={`Available: ${selectedEHFData.dose_hpv || 0}`} color={(selectedEHFData.dose_hpv || 0) > 100 ? "success" : (selectedEHFData.dose_hpv || 0) > 0 ? "warning" : "error"} size="small" />
                          </Box>
                          <LinearProgress variant="determinate" value={Math.min(((selectedEHFData.dose_hpv || 0) / 1000) * 100, 100)} sx={{ height: 8, borderRadius: 4, bgcolor: 'grey.200', mb: 2 }} />
                          <TextField type="number" fullWidth size="small" label="Quantity to Allocate" value={allocationData.dose_hpv} onChange={(e) => handleAllocationChange('dose_hpv', e.target.value)} inputProps={{ min: 0, max: selectedEHFData.dose_hpv || 0 }} />
                          {allocationData.dose_hpv && <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>Remaining: {(selectedEHFData.dose_hpv || 0) - (parseInt(allocationData.dose_hpv) || 0)}</Typography>}
                          {parseInt(allocationData.dose_hpv) > 0 && (
                            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#666' }}>Vaccine Details</Typography>
                              <Grid container spacing={1.5}>
                                <Grid item xs={12}><FormControl fullWidth size="small"><InputLabel>VVM Stage</InputLabel><Select value={metadataMap.dose_hpv.vvm_stage} onChange={(e) => handleMetadataChange('dose_hpv', 'vvm_stage', e.target.value)} label="VVM Stage"><MenuItem value="">Select Stage</MenuItem><MenuItem value="1">Stage 1</MenuItem><MenuItem value="2">Stage 2</MenuItem><MenuItem value="3">Stage 3</MenuItem><MenuItem value="4">Stage 4</MenuItem></Select></FormControl></Grid>
                                <Grid item xs={12}><TextField fullWidth size="small" label="Batch Number" value={metadataMap.dose_hpv.batch_number} onChange={(e) => handleMetadataChange('dose_hpv', 'batch_number', e.target.value)} placeholder="Enter batch number" /></Grid>
                                <Grid item xs={12}><TextField fullWidth size="small" type="date" label="Earliest Expiry Date" value={metadataMap.dose_hpv.expire_date} onChange={(e) => handleMetadataChange('dose_hpv', 'expire_date', e.target.value)} InputLabelProps={{ shrink: true }} /></Grid>
                              </Grid>
                            </Box>
                          )}
                        </Paper>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Add to List Button */}
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={handleAddToList}
                    sx={{
                      bgcolor: 'rgb(12, 125, 64)',
                      '&:hover': { bgcolor: 'rgb(10, 100, 50)' },
                      px: 4,
                      py: 1.5,
                    }}
                  >
                    Add to Allocation List
                  </Button>
                </Box>
              </>
            )}

            {/* Allocation List Table */}
            {allocationList.length > 0 && (
              <>
                <Box sx={{ mt: 3 }}>
                  <VaxTable
                    columns={draftAllocationColumns}
                    data={allocationList}
                    tableHeader={`Allocation List (${allocationList.length} ${allocationList.length === 1 ? 'facility' : 'facilities'})`}
                    getActionMenuItems={getDraftActionItems}
                    showDownloadButton={false}
                  />
                </Box>

                {/* Period and Submit Section */}
                <Box sx={{ mt: 3, p: 3, bgcolor: '#f9f9f9', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Allocation Period"
                        value={allocationPeriod}
                        onChange={(e) => setAllocationPeriod(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        helperText="Select the allocation period date"
                      />
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                          variant="outlined"
                          size="large"
                          onClick={() => {
                            setAllocationList([]);
                            setAllocationPeriod('');
                          }}
                          sx={{
                            borderColor: '#d32f2f',
                            color: '#d32f2f',
                            '&:hover': { borderColor: '#b71c1c', bgcolor: '#ffebee' },
                            px: 3,
                          }}
                        >
                          Clear All
                        </Button>
                        <Button
                          variant="contained"
                          size="large"
                          onClick={handleSubmitAllocations}
                          disabled={isSubmitting || allocationList.length === 0 || !allocationPeriod}
                          sx={{
                            bgcolor: 'rgb(12, 125, 64)',
                            '&:hover': { bgcolor: 'rgb(10, 100, 50)' },
                            '&:disabled': { bgcolor: '#ccc' },
                            px: 4,
                          }}
                        >
                          {isSubmitting ? 'Submitting...' : 'Allocate Vaccines'}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </>
            )}
          </Box>
        </TabPanel>
      )}

      {/* Show Vaccine Allocated - for SLWG it's tab index 1, for others it's always visible */}
      {showStockAtHandTab ? (
        <TabPanel value={value} index={1}>
          <Box>
            <VaxTable
              columns={allocatedColumns}
              data={filteredAllocatedData}
              tableHeader="Vaccine Allocated"
              customRightButtonText=""
              customRightButtonCallBackFunction={handleAddNew}
              getActionMenuItems={getActionItems}
              showDownloadButton={true}
              loading={isAllocatedLoading}
              getRowStyles={(row: any) => {
                // Highlight rows with deficit (status 3 or 5)
                if (row.status === 3 || row.status === 5) {
                  return {
                    bgcolor: '#fff3e0', // Light orange background
                    '&:hover': {
                      bgcolor: '#ffe0b2 !important', // Slightly darker on hover
                    },
                  };
                }
                return {};
              }}
            />
          </Box>
        </TabPanel>
      ) : (
        <Box>
          <VaxTable
            columns={allocatedColumns}
            data={filteredAllocatedData}
            tableHeader="Vaccine Allocated"
            getActionMenuItems={getActionItems}
            showDownloadButton={true}
            loading={isAllocatedLoading}
            getRowStyles={(row: any) => {
              // Highlight rows with deficit (status 3 or 5)
              if (row.status === 3 || row.status === 5) {
                return {
                  bgcolor: '#fff3e0', // Light orange background
                  '&:hover': {
                    bgcolor: '#ffe0b2 !important', // Slightly darker on hover
                  },
                };
              }
              return {};
            }}
          />
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this vaccine allocation for{' '}
            <strong>{allocationToDelete?.name_of_ehf}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={deleteAllocationMutation.isPending}
          >
            {deleteAllocationMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VaccineAllocationStockList;