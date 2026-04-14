import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Tabs,
  Tab,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Autocomplete,
  TextField,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DashboardContent } from 'src/layouts/dashboard';
import { useCreateAllocation } from 'src/hooks/apis/ehf/ehf-hooks';
import { VaccineAllocationType } from 'src/hooks/apis/ehf/ehf-type';
import { useFetchEHFDetailRoutes, useFetchEHFsByIds } from 'src/hooks/apis/ehf-uhf/ehf-hooks';
import { useFetchUHFByEHF } from 'src/hooks/apis/ehf-uhf/uhf-hooks';
import { UHFType } from 'src/hooks/apis/ehf-uhf/uhf-type';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { validateMfaForSubmission } from 'src/utils/mfa-verification';

import { BcgAllocation } from '../bcg-allocation';
import { MeaslesAllocation } from '../measles-allocation';
import { YfAllocation } from '../yf-allocation';
import { MenAAllocation } from '../menA-allocation';
import { RotaAllocation } from '../rota-allocation';
import { HpvAllocation } from '../hpv-allocation';
import { HepBAllocation } from '../hepb-allocation';
import { BopvAllocation } from '../bopv-allocation';
import { PentaAllocation } from '../penta-allocation';
import { IpvAllocation } from '../ipv-allocation';
import { PcvAllocation } from '../pcv-allocation';
import { TdAllocation } from '../td-allocation';
import { useLocation, useNavigate } from 'react-router-dom';
import { MalariaAllocation } from '../malaria-allocation';

interface VaccineOption {
  value: string;
  label: string;
  component: React.ComponentType<any>;
}

const vaccineOptions: VaccineOption[] = [
  { value: 'bcg', label: 'BCG Allocation', component: BcgAllocation },
  { value: 'measles', label: 'Measles & Rubella Allocation', component: MeaslesAllocation },
  { value: 'yf', label: 'YF Allocation', component: YfAllocation },
  { value: 'malaria', label: 'Malaria Allocation', component: MalariaAllocation },
  { value: 'menA', label: 'MenA Allocation', component: MenAAllocation },
  { value: 'rota', label: 'Rota Allocation', component: RotaAllocation },
  { value: 'hpv', label: 'HPV Allocation', component: HpvAllocation },
  { value: 'hepB', label: 'HepB Allocation', component: HepBAllocation },
  { value: 'bopv', label: 'BOPV Allocation', component: BopvAllocation },
  { value: 'penta', label: 'Penta Allocation', component: PentaAllocation },
  { value: 'ipv', label: 'IPV Allocation', component: IpvAllocation },
  { value: 'pcv', label: 'PCV Allocation', component: PcvAllocation },
  { value: 'td', label: 'TD Allocation', component: TdAllocation },
];

export default function VaccineView() {
  const location = useLocation();
  const navigate = useNavigate();

  const { data: allocationData, isView = false, isUpdate = false } = location.state || {};

  const createAllocation = useCreateAllocation();
  const [selectedEhf, setSelectedEhf] = useState<number | null>(null);
  const [selectedEhfUniqueId, setSelectedEhfUniqueId] = useState<string | null>(null);

  // Track if initial setup has been done to prevent resetting tab on subsequent allEhf updates
  const initialSetupDoneRef = useRef(false);

  // Fetch UHF based on selected EHF's assigned_unique_id
  const { data: allUhf = [], isLoading: isUhfLoading } = useFetchUHFByEHF(selectedEhfUniqueId);
  const [selectedUhf, setSelectedUhf] = useState<number | null>(null);
  const [selectedLGA, setSelectedLGA] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<string>(vaccineOptions[0].value);
  const [formDataCollection, setFormDataCollection] = useState<Record<string, any>>({});
  const [status, setStatus] = useState<number>(1);
  const [mfaCode, setMfaCode] = useState<string>('');

  const userRole = sessionStorage.getItem('userRole') || '';

  // Get user's assigned EHF list from sessionStorage
  const userAssignedEhfs = useMemo(() => {
    try {
      const ehfListData = sessionStorage.getItem('ehf_list');
      if (ehfListData) {
        const parsed = JSON.parse(ehfListData);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (error) {
      console.error('Error parsing ehf_list:', error);
      return [];
    }
  }, []);

  // For Conveyor/EHF/3PL roles, get the state from the assigned_unique_id prefix
  const userStateFromAssignedId = useMemo(() => {
    if ((userRole === 'conveyor' || userRole === 'ehf') && userAssignedEhfs.length > 0) {
      const assignedId = userAssignedEhfs[0];
      if (typeof assignedId === 'string' && assignedId.includes('-')) {
        return assignedId.split('-')[0];
      }
    }
    return null;
  }, [userRole, userAssignedEhfs]);

  // For SCS/SLWG/LCS roles, get state from their role list
  const userStateFromRoleList = useMemo(() => {
    const roleListMap: { [key: string]: string } = {
      'scs': 'scs_list',
      'slwg': 'slwg_list',
      'lcs': 'lcs_list',
    };

    const listKey = roleListMap[userRole];
    if (listKey) {
      try {
        const listData = sessionStorage.getItem(listKey);
        if (listData) {
          const parsed = JSON.parse(listData);
          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].state) {
            return parsed[0].state;
          }
        }
      } catch (error) {
        console.error('Error parsing role list:', error);
      }
    }
    return null;
  }, [userRole]);

  const userState = userStateFromAssignedId || userStateFromRoleList;

  // For conveyor: first fetch their assigned EHFs by ID to reliably determine their state
  const isConveyor = userRole === 'conveyor';
  const { data: ehfsByIds = [], isLoading: isEhfByIdsLoading } = useFetchEHFsByIds(
    isConveyor ? userAssignedEhfs : []
  );

  // Derive the real state from the fetched EHF data (ID prefix like "xxx" is unreliable)
  const conveyorState = useMemo(() => {
    if (!isConveyor || ehfsByIds.length === 0) return '';
    return ehfsByIds[0]?.state || '';
  }, [isConveyor, ehfsByIds]);

  // Fetch ALL EHFs in the state — used for LGA dropdown
  const effectiveState = isConveyor ? conveyorState : (userState || '');
  const { data: allEhfByState = [], isLoading: isEhfByStateLoading } = useFetchEHFDetailRoutes(
    effectiveState,
    ''
  );

  // Fetch EHFs filtered by selected LGA from the API
  const { data: ehfByLga = [], isLoading: isEhfByLgaLoading } = useFetchEHFDetailRoutes(
    effectiveState,
    selectedLGA
  );

  const allEhf = allEhfByState;
  const isEhfLoading = isConveyor ? (isEhfByIdsLoading || isEhfByStateLoading) : isEhfByStateLoading;
  const isAnyEhfLoading = isEhfLoading || (!!selectedLGA && isEhfByLgaLoading);

  // Filter EHF based on user role — use LGA-filtered API data when LGA is selected
  const filteredEhf = useMemo(() => {
    const baseEhfs = selectedLGA ? ehfByLga : allEhf;

    // For Conveyor/EHF/3PL: only show their assigned EHF
    if ((userRole === 'conveyor' || userRole === 'ehf' || userRole === 'threepl') && userAssignedEhfs.length > 0) {
      return baseEhfs.filter((ehf: any) => userAssignedEhfs.includes(ehf.assigned_unique_id));
    }

    // API already filters by state — return data as-is
    return baseEhfs;
  }, [allEhf, ehfByLga, selectedLGA, userRole, userAssignedEhfs]);

  useEffect(() => {
    if (allocationData && allocationData.vaccines_allocation_detail?.length > 0) {
      const firstDetail = allocationData.vaccines_allocation_detail[0];

      // Find the EHF's assigned_unique_id to fetch UHF (this can update when allEhf changes)
      const ehfData = allEhf.find((ehf: any) => ehf.id === firstDetail.ehf_id);
      if (ehfData && ehfData.assigned_unique_id) {
        setSelectedEhfUniqueId(ehfData.assigned_unique_id);
      }

      // Only do initial setup once to prevent resetting tab when allEhf updates
      if (!initialSetupDoneRef.current) {
        setSelectedEhf(firstDetail.ehf_id);
        setSelectedUhf(firstDetail.uhf_id);

        // Auto-populate LGA and Ward from the EHF data
        if (ehfData) {
          if (ehfData.lga) setSelectedLGA(ehfData.lga);
        }
        setStatus(Number(firstDetail.status) || 1);

        const populatedFormData: Record<string, any> = {};
        allocationData.vaccines_allocation_detail.forEach((detail: any) => {
          if (detail.type) {
            populatedFormData[detail.type] = {
              ...detail,
              ehf_id: detail.ehf_id,
              uhf_id: detail.uhf_id,
            };
          }
        });
        setFormDataCollection(populatedFormData);

        const availableVaccineTypes = allocationData.vaccines_allocation_detail.map((detail: any) => detail.type);
        const firstAvailableType = vaccineOptions.find(option =>
          availableVaccineTypes.includes(option.value)
        );

        if (firstAvailableType) {
          setSelectedTab(firstAvailableType.value);
        }

        initialSetupDoneRef.current = true;
      }
    }
  }, [allocationData, allEhf]);

  const validationRules: Record<string, number> = {
    bcg: 20,
    measles: 10,
    yf: 10,
    malaria: 10,
    menA: 10,
    rota: 10,
    hpv: 1,
    hepB: 10,
    bopv: 20,
    penta: 10,
    ipv: 10,
    pcv: 5,
    td: 10
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const handleNext = () => {
    // Validate current tab before moving to next
    const rule = validationRules[selectedTab];
    if (rule) {
      const data = formDataCollection[selectedTab];
      if (data) {
        const allocatedVal = data[`${selectedTab}VaccineAllocated`] || '';
        const receivedVal = data[`${selectedTab}VaccineReceived`] || '';

        const allocated = parseInt(allocatedVal, 10) || 0;
        const received = parseInt(receivedVal, 10) || 0;

        if ((allocatedVal !== '' && allocated % rule !== 0) ||
          (receivedVal !== '' && received % rule !== 0)) {
          toast.error(`Quantity must be divisible by ${rule} for ${selectedTab.toUpperCase()}`);
          return;
        }
      }
    }

    const currentIndex = vaccineOptions.findIndex((v) => v.value === selectedTab);
    const nextIndex = currentIndex + 1;
    if (nextIndex < vaccineOptions.length) {
      setSelectedTab(vaccineOptions[nextIndex].value);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const availableLGAs = useMemo(() => {
    const lgas = allEhf.map((ehf: any) => ehf.lga).filter(Boolean);
    return Array.from(new Set(lgas)).sort() as string[];
  }, [allEhf]);

  // API already filters by LGA — filteredEhf is the final list
  const lgaWardFilteredEhf = filteredEhf;

  const handleLGAChange = (event: any) => {
    setSelectedLGA(event.target.value);
    setSelectedEhf(null);
    setSelectedEhfUniqueId(null);
    setSelectedUhf(null);
  };

  const handleEhfChange = (event: any, newValue: any) => {
    setSelectedEhf(newValue?.id || null);
    setSelectedEhfUniqueId(newValue?.assigned_unique_id || null);
    setSelectedUhf(null);
  };

  const handleUhfChange = (event: any) => {
    setSelectedUhf(event.target.value as number);
  };

  const handleDataChange = useCallback(
    (data: any) => {
      setFormDataCollection((prev) => ({
        ...prev,
        [selectedTab]: { ...data, ehf_id: selectedEhf, uhf_id: selectedUhf },
      }));
    },
    [selectedTab, selectedEhf, selectedUhf]
  );

  const handleBack = () => {
    const currentIndex = vaccineOptions.findIndex((v) => v.value === selectedTab);
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setSelectedTab(vaccineOptions[prevIndex].value);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };


  const handleSubmit = async () => {
    const mfaValidation = await validateMfaForSubmission(mfaCode);
    if (!mfaValidation.isValid) {
      toast.error(mfaValidation.error);
      return;
    }

    if (!selectedEhf) {
      toast.error('Please select EHF.');
      return;
    }

    if (!selectedUhf) {
      toast.error('Please select a UHF before proceeding.');
      return;
    }

    if (Object.keys(formDataCollection).length === 0) {
      toast.error('Please fill out at least one vaccine form before submitting.');
      return;
    }

    // Final validation of all filled forms
    const invalidVaccine = Object.entries(formDataCollection).find(([type, data]) => {
      const rule = validationRules[type];
      if (!rule) return false;

      const allocatedVal = data[`${type}VaccineAllocated`] || '';
      const receivedVal = data[`${type}VaccineReceived`] || '';

      const allocated = parseInt(allocatedVal, 10) || 0;
      const received = parseInt(receivedVal, 10) || 0;

      return (allocatedVal !== '' && allocated % rule !== 0) ||
        (receivedVal !== '' && received % rule !== 0);
    });

    if (invalidVaccine) {
      const [type] = invalidVaccine;
      const rule = validationRules[type];
      toast.error(`Validation failed for ${type.toUpperCase()}. Quantity must be divisible by ${rule}.`);
      setSelectedTab(type); // Switch to the invalid tab
      return;
    }

    if (isUpdate && !allocationData?.id) {
      toast.error('Allocation ID is missing. Cannot update.');
      return;
    }

    const selectedUhfData = allUhf.find((uhf: UHFType) => uhf.id === selectedUhf);
    if (!selectedUhfData) {
      toast.error('Selected UHF not found. Please select a valid UHF.');
      return;
    }

    let newStatus = status;
    // Conveyor enters data on behalf of EHF for both forward and reverse logistics
    if (userRole === 'conveyor' && status === 1) {
      newStatus = 6; // Forward: Conveyor allocates on behalf of EHF → jump to reverse logistics step
    } else if (userRole === 'conveyor' && status === 6) {
      newStatus = 7; // Reverse: Conveyor receives on behalf of EHF → completed
    }

    const request_id = isUpdate ? allocationData.vaccines_allocation_detail[0].request_id : uuidv4();
    const username = sessionStorage.getItem('username') || '';

    // Get selected EHF data for Conveyor to extract state/lga
    const selectedEhfData = filteredEhf.find((ehf: any) => ehf.id === selectedEhf);

    const vaccines_allocation_detail = Object.entries(formDataCollection)
      .filter(([_, data]) => data && Object.keys(data).length > 0 && data.ehf_id && data.uhf_id)
      .map(([type, data]) => {
        const { status, ...allData } = data;

        // For Conveyor, use EHF state/lga. For others, use UHF state/lga
        const state = userRole === 'conveyor' ? (selectedEhfData?.state || '') : (selectedUhfData?.state || '');
        const lga = userRole === 'conveyor' ? (selectedEhfData?.lga || '') : (selectedUhfData?.lga || '');

        return {
          type,
          request_id,
          status: newStatus,
          username,
          ehf_id: data.ehf_id,
          uhf_id: data.uhf_id || null,
          state,
          lga,
          ...allData,
        };
      });


    const payload: VaccineAllocationType = { vaccines_allocation_detail };

    setStatus(newStatus);

    createAllocation.mutate(
      { id: isUpdate ? allocationData.id : undefined, data: payload },
      {
        onSuccess: (response) => {
          setFormDataCollection({});
          setSelectedTab(vaccineOptions[0].value);
          setSelectedEhf(null);
          setSelectedUhf(null);

          // Show different success message based on the new status
          let successMessage = 'Vaccine Allocation Updated';
          if (response?.status === 'success') {
            if (newStatus === 6) {
              successMessage = 'Vaccine Allocated Successfully';
            } else if (newStatus === 7) {
              successMessage = 'Vaccine Receipt Confirmed Successfully';
            } else {
              successMessage = 'Vaccine Allocation Updated Successfully';
            }
          }

          toast.success(successMessage);
          navigate('/vaccine-allocation-page');
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Failed to create vaccine allocation');
        },
      }
    );
  };

  const { currentIndex, isLastTab, isFirstTab, CurrentVaccineComponent } = useMemo(() => {
    const index = vaccineOptions.findIndex((v) => v.value === selectedTab);
    return {
      currentIndex: index,
      isLastTab: index === vaccineOptions.length - 1,
      isFirstTab: index === 0,
      CurrentVaccineComponent: vaccineOptions.find((v) => v.value === selectedTab)?.component
    };
  }, [selectedTab]);

  return (
    <DashboardContent>
      <Container maxWidth="xl" sx={{ textAlign: 'left' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
            Vaccine Products
            {/* (Status: {status}) */}
          </Typography>
          <Button
            variant="text"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ color: 'rgb(12, 125, 64)' }}
          >
            Back
          </Button>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Paper
              sx={{
                p: 2,
                border: '2px solid rgb(12, 125, 64)',
                borderRadius: 1,
                height: 'fit-content',
                maxHeight: 'calc(100vh - 150px)',
                overflow: 'auto',
                backgroundColor: 'rgb(12, 125, 64)',
              }}
            >
              <Tabs
                orientation="vertical"
                variant="scrollable"
                value={selectedTab}
                onChange={handleTabChange}
                sx={{ '& .MuiTabs-indicator': { backgroundColor: 'rgb(12, 125, 64)' } }}
              >
                {vaccineOptions.map((vaccine) => (
                  <Tab
                    key={vaccine.value}
                    label={vaccine.label}
                    value={vaccine.value}
                    sx={{
                      alignItems: 'flex-start',
                      textAlign: 'left',
                      color: 'white',
                      mb: 0.5,
                      borderRadius: 1,
                      minHeight: 36,
                      '&:hover': {
                        bgcolor: 'var(--layout-nav-item-hover-bg, rgba(255, 255, 255, 0.08))',
                        color: 'white',
                      },
                      '&.Mui-selected': {
                        fontWeight: 'fontWeightSemiBold',
                        bgcolor: 'var(--layout-nav-item-active-bg, rgba(255, 255, 255, 0.16))',
                        color: 'var(--layout-nav-item-active-color, white)',
                        '&:hover': {
                          bgcolor: 'var(--layout-nav-item-hover-bg, rgba(255, 255, 255, 0.12))',
                        },
                      },
                    }}
                  />
                ))}
              </Tabs>
            </Paper>
          </Grid>

          <Grid item xs={9}>
            <Box sx={{ mb: 2 }}>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12}>
                  <FormControl fullWidth disabled={isAnyEhfLoading || isView || status > 1}>
                    <InputLabel>Select LGA</InputLabel>
                    <Select
                      value={selectedLGA}
                      label="Select LGA"
                      onChange={handleLGAChange}
                    >
                      {availableLGAs.map((lga) => (
                        <MenuItem key={lga} value={lga}>{lga}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Autocomplete
                fullWidth
                sx={{ mb: 2 }}
                options={lgaWardFilteredEhf}
                getOptionLabel={(option: any) => option.name_of_ehf || option.ehf_name || ''}
                value={lgaWardFilteredEhf.find((ehf: any) => ehf.id === selectedEhf) || null}
                onChange={handleEhfChange}
                disabled={!selectedLGA || isAnyEhfLoading || isView || createAllocation.isPending || status > 1}
                loading={isAnyEhfLoading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search and Select EHF"
                    placeholder="Type to search EHF..."
                    variant="outlined"
                  />
                )}
                renderOption={(props, option: any) => (
                  <Box component="li" {...props} key={option.id}>
                    <Box>
                      <Typography variant="body1">{option.name_of_ehf || option.ehf_name}</Typography>
                      {option.state && (
                        <Typography variant="caption" color="text.secondary">
                          State: {option.state} {option.assigned_unique_id ? `(${option.assigned_unique_id})` : ''}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
                filterOptions={(options, { inputValue }) =>
                  options.filter((option: any) =>
                    option.name_of_ehf?.toLowerCase().includes(inputValue.toLowerCase()) ||
                    option.ehf_name?.toLowerCase().includes(inputValue.toLowerCase()) ||
                    option.state?.toLowerCase().includes(inputValue.toLowerCase()) ||
                    option.assigned_unique_id?.toLowerCase().includes(inputValue.toLowerCase())
                  )
                }
                noOptionsText="No EHF found"
              />
              {selectedEhf && (
                <>
                  {Array.isArray(allUhf) && allUhf.length > 0 && !isUhfLoading ? (
                    <FormControl fullWidth>
                      <InputLabel id="uhf-select-label">Select UHF</InputLabel>
                      <Select
                        labelId="uhf-select-label"
                        value={selectedUhf ?? ''}
                        label="Select UHF"
                        onChange={handleUhfChange}
                        disabled={isUhfLoading || isView || createAllocation.isPending || status > 1}
                      >
                        {allUhf.map((uhf: UHFType) => (
                          <MenuItem key={uhf.id} value={uhf.id}>
                            {uhf.uhf_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    !isUhfLoading && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        No UHF available for this EHF.
                      </Typography>
                    )
                  )}
                </>
              )}
            </Box>

            {CurrentVaccineComponent && (
              <Box sx={{ mb: 4 }}>
                <CurrentVaccineComponent
                  initialData={useMemo(() => formDataCollection[selectedTab] || {}, [formDataCollection, selectedTab])}
                  onDataChange={handleDataChange}
                  status={status}
                  key={selectedTab}
                  isView={isView}
                  isUpdate={isUpdate}
                  isHealthFacilitySelected={
                    isView || isUpdate ||
                    (!!selectedEhf && !isUhfLoading && !!selectedUhf)
                  }
                />
              </Box>
            )}

            {/* MFA Code Input - Show when user needs to submit or update */}
            {!isView && isLastTab && selectedEhf && !isUhfLoading && !!selectedUhf && (
              <Box sx={{ mb: 3, width: "50%" }}>
                <TextField
                  label="MFA Code"
                  placeholder="Enter your 4-digit MFA code"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  variant="outlined"
                  size="medium"
                  inputProps={{ maxLength: 4 }}
                  helperText="Please enter your MFA code to proceed with submission"
                />
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                color="inherit"
                size="large"
                onClick={handleBack}
                disabled={isFirstTab}
              >
                Back
              </Button>
              {!isView && (
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={isLastTab ? handleSubmit : handleNext}
                  disabled={isView || createAllocation.isPending}
                >
                  {isLastTab ?
                    createAllocation.isPending ?
                      (isUpdate ? 'Updating...' : 'Submitting...') :
                      (isUpdate ? 'Update' : 'Submit')
                    : 'Next'}
                </Button>
              )}

            </Box>
          </Grid>
        </Grid>
      </Container>
    </DashboardContent>
  );
}