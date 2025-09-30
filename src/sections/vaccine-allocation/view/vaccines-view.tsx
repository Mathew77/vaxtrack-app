import React, { useState, useCallback, useEffect, useMemo } from 'react';
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
import { DashboardContent } from 'src/layouts/dashboard';
import { useCreateAllocation, useFetchEHF, useFetchUHF } from 'src/hooks/apis/ehf/ehf-hooks';
import { UHFType, VaccineAllocationType } from 'src/hooks/apis/ehf/ehf-type';
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
    const { data: allEhf = [], isLoading: isEhfLoading } = useFetchEHF();
    const [selectedEhf, setSelectedEhf] = useState<number | null>(null);
    const { data: allUhf = [], isLoading: isUhfLoading } = useFetchUHF(selectedEhf);
    const [selectedUhf, setSelectedUhf] = useState<number | null>(null);
    const [selectedTab, setSelectedTab] = useState<string>(vaccineOptions[0].value);
    const [formDataCollection, setFormDataCollection] = useState<Record<string, any>>({});
    const [status, setStatus] = useState<number>(1);
    const [mfaCode, setMfaCode] = useState<string>('');

  const userRole = sessionStorage.getItem('userRole') || '';

  useEffect(() => {
    if (allocationData && allocationData.vaccines_allocation_detail?.length > 0) {
      const firstDetail = allocationData.vaccines_allocation_detail[0];
      setSelectedEhf(firstDetail.ehf_id);
      setSelectedUhf(firstDetail.uhf_id);
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
    }
  }, [allocationData]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const handleNext = () => {
    const currentIndex = vaccineOptions.findIndex((v) => v.value === selectedTab);
    const nextIndex = currentIndex + 1;
    if (nextIndex < vaccineOptions.length) {
      setSelectedTab(vaccineOptions[nextIndex].value);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleEhfChange = (event: any, newValue: any) => {
        setSelectedEhf(newValue?.id || null);
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

      if (!selectedEhf || !selectedUhf) {
        toast.error('Please select both EHF and UHF.');
        return;
      }

      if (Object.keys(formDataCollection).length === 0) {
        toast.error('Please fill out at least one vaccine form before submitting.');
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
      if ((userRole === 'uhf' || userRole === 'threepl') && status === 1) {
        newStatus = 2;
      } else if (userRole === 'ehf' && status === 2) {
        newStatus = 3;
      } else if ((userRole === 'threepl' || userRole === 'conveyor') && status === 3) {
        newStatus = 4;
      } else if ((userRole === 'uhf' || userRole === 'threepl') && status === 4) {
        newStatus = 5;
      } else if ((userRole === 'conveyor' || userRole === 'threepl') && status === 5) {
        newStatus = 6;
      } else if (userRole === 'ehf' && status === 6) {
        newStatus = 7;
      }

      const request_id = isUpdate ? allocationData.vaccines_allocation_detail[0].request_id : uuidv4();
      const username = sessionStorage.getItem('username') || '';

      const vaccines_allocation_detail = Object.entries(formDataCollection)
      .filter(([_, data]) => data && Object.keys(data).length > 0 && data.ehf_id && data.uhf_id)
      .map(([type, data]) => {
        const { status, ...allData } = data; 
        return {
          type,
          request_id,
          status: newStatus,
          username,
          ehf_id: data.ehf_id,
          uhf_id: data.uhf_id,
          state: selectedUhfData.state || '',
          lga: selectedUhfData.lga || '',
          ...allData,
        };
      });


      const payload: VaccineAllocationType = { vaccines_allocation_detail };

      console.log('Payload being sent:', JSON.stringify(payload, null, 2));

      setStatus(newStatus);

      createAllocation.mutate(
        { id: isUpdate ? allocationData.id : undefined, data: payload },
        {
          onSuccess: (response) => {
            setFormDataCollection({});
            setSelectedTab(vaccineOptions[0].value);
            setSelectedEhf(null);
            setSelectedUhf(null);
            toast.success(
              response?.status === 'success'
                ? 'Vaccine Allocation Updated Successfully'
                : response?.status || 'Vaccine Allocation Updated'
            );
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
            <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: '1.25rem', mb: 2 }}>
                Vaccine Products 
                {/* (Status: {status}) */}
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <Paper
                        sx={{
                            p: 2,
                            border: '2px solid #1976D2',
                            borderRadius: 1,
                            height: 'fit-content',
                            maxHeight: 'calc(100vh - 150px)',
                            overflow: 'auto',
                            backgroundColor: '#1976D2',
                        }}
                    >
                        <Tabs
                            orientation="vertical"
                            variant="scrollable"
                            value={selectedTab}
                            onChange={handleTabChange}
                            sx={{ '& .MuiTabs-indicator': { backgroundColor: '#1976D2' } }}
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
                                        '&.Mui-selected': {
                                            backgroundColor: '#1565C0',
                                            color: 'white',
                                            borderRadius: 1,
                                        },
                                        '&:hover': { backgroundColor: '#1565C0' },
                                        borderRadius: 0,
                                        minHeight: 36,
                                    }}
                                />
                            ))}
                        </Tabs>
                    </Paper>
                </Grid>

                <Grid item xs={9}>
                  <Box sx={{ mb: 2 }}>
                      <Autocomplete
                          fullWidth
                          sx={{ mb: 2 }}
                          options={allEhf}
                          getOptionLabel={(option: any) => option.ehf_name || ''}
                          value={allEhf.find((ehf: any) => ehf.id === selectedEhf) || null}
                          onChange={handleEhfChange}
                          disabled={isEhfLoading || isView || createAllocation.isPending || status > 1}
                          loading={isEhfLoading}
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
                                      <Typography variant="body1">{option.ehf_name}</Typography>
                                      {option.state && (
                                          <Typography variant="caption" color="text.secondary">
                                              State: {option.state}
                                          </Typography>
                                      )}
                                  </Box>
                              </Box>
                          )}
                          filterOptions={(options, { inputValue }) =>
                              options.filter((option: any) =>
                                  option.ehf_name?.toLowerCase().includes(inputValue.toLowerCase()) ||
                                  option.state?.toLowerCase().includes(inputValue.toLowerCase())
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
                              <Typography variant="body1" color="error" sx={{ mt: 2 }}>
                                No UHF found for the selected EHF.
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
                          />
                      </Box>
                  )}

                  {/* MFA Code Input - Show when user needs to submit or update */}
                  {!isView && isLastTab && selectedEhf && selectedUhf && (
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