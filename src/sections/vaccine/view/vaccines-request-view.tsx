import React, { useState, useCallback, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Tabs,
  Tab,
} from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { useFetchUsers } from 'src/hooks/apis/ehf/ehf-hooks';
import { useCreateVaccine, useUpdateVaccineRequest } from 'src/hooks/apis/ehf/ehf-hooks';
import { VaccineFormType } from 'src/hooks/apis/ehf/ehf-type';
import { toast } from 'react-toastify';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

import { BcgVaccines } from '../bcg-vaccines';
import { MeaslesVaccine } from '../measles-vaccines';
import { YfVaccine } from '../yf-vaccines';
import { MenAVaccine } from '../menA-vaccines';
import { RotaVaccine } from '../rota-vaccines';
import { HpvVaccine } from '../hpv-vaccines';
import { HepbVaccine } from '../hepb-vaccines';
import { BopvVaccine } from '../bopv-vaccines';
import { PentaVaccine } from '../penta-vaccines';
import { IpvVaccine } from '../ipv-vaccines';
import { PcvVaccine } from '../pcv-vaccines';
import { TdVaccine } from '../td-vaccines';
import { ColdChainStatus } from '../cold-chain';
import { MalariaVaccine } from '../malaria-vaccines';

interface VaccineOption {
  value: string;
  label: string;
  component: (props: any) => JSX.Element;
}

interface VaccineRequestFormProps {
  initialData?: VaccineFormType;
}

const convertVaccineStatusToNumber = (status: string | number | undefined): number => {
  if (typeof status === 'string') {
    const parsed = parseInt(status, 10);
    return isNaN(parsed) ? 0 : parsed;
  }
  return typeof status === 'number' ? status : 0;
};

const convertVaccineStatusToString = (status: string | number | undefined): string => {
  return String(status || 0);
};

const vaccineOptions: VaccineOption[] = [
  { value: 'bcg', label: 'BCG Vaccine', component: BcgVaccines },
  { value: 'measles', label: 'Measles & Rubella Vaccine', component: MeaslesVaccine },
  { value: 'yf', label: 'YF Vaccine', component: YfVaccine },
  { value: 'malaria', label: 'Malaria Vaccine', component: MalariaVaccine},
  { value: 'menA', label: 'MenA Vaccine', component: MenAVaccine },
  { value: 'rota', label: 'Rota Vaccine', component: RotaVaccine },
  { value: 'bopv', label: 'BOPV Vaccine', component: BopvVaccine },
  { value: 'hpv', label: 'HPV Vaccine', component: HpvVaccine },
  { value: 'hepB', label: 'HepB Vaccine', component: HepbVaccine },
  { value: 'penta', label: 'Penta Vaccine', component: PentaVaccine },
  { value: 'ipv', label: 'IPV Vaccine', component: IpvVaccine },
  { value: 'pcv', label: 'PCV Vaccine', component: PcvVaccine },
  { value: 'td', label: 'Td Vaccine', component: TdVaccine },
  { value: 'cold-chain', label: 'Cold Chain Status', component: ColdChainStatus },
];

export default function VaccineRequestForm({ initialData: propInitialData }: VaccineRequestFormProps) {
  const navigate = useNavigate();
  const { editId } = useParams<{ editId?: string }>();
  const location = useLocation();

  const initialData = propInitialData || (location.state as any)?.initialData;
  const isView = (location.state as any)?.isView || (!!initialData && !editId);
  const isEdit = (location.state as any)?.isEdit || !!editId;
  
  const { data: users = [] } = useFetchUsers();
  const createVaccine = useCreateVaccine();
  const updateVaccineRequest = useUpdateVaccineRequest();

  const [selectedTab, setSelectedTab] = useState<string>(vaccineOptions[0].value);
  const [formDataCollection, setFormDataCollection] = useState<Record<string, any>>(
    initialData?.product_detail_request?.reduce((acc: any, item: any) => {
      if (item.type === 'cold-chain') {
        acc[item.type] = {
          dateCreated: item.dateCreated || new Date().toISOString().slice(0, 16),
          equipStatus: item.equipStatus || '',
          requestType: item.requestType || '',
        };
      } else {
        acc[item.type] = item;
      }
      return acc;
    }, {}) || { 'cold-chain': { dateCreated: new Date().toISOString().slice(0, 16), equipStatus: '', requestType: '' } }
  );

  const [declineComment, setDeclineComment] = useState<string>('');
  const [showDeclineComment, setShowDeclineComment] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false); 

  const userEhfList = useMemo(() => {
    try {
      const ehfListData = sessionStorage.getItem('ehf_list');
      if (ehfListData) {
        const parsed = JSON.parse(ehfListData);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (error) {
      console.error('Error parsing ehf_list from session storage:', error);
      return [];
    }
  }, []);

  const username = useMemo(() => {
    return sessionStorage.getItem('username') || 'Unknown User';
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };

  const handleDataChange = useCallback(
    (data: any) => {
      setFormDataCollection((prev) => ({
        ...prev,
        [selectedTab]: { ...data, decline_comment: selectedTab === 'cold-chain' ? declineComment : data.decline_comment },
      }));
    },
    [selectedTab, declineComment]
  );

  const handleNext = () => {
    const currentIndex = vaccineOptions.findIndex((v) => v.value === selectedTab);
    const nextIndex = currentIndex + 1;
    if (nextIndex < vaccineOptions.length) {
      setSelectedTab(vaccineOptions[nextIndex].value);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    const currentIndex = vaccineOptions.findIndex((v) => v.value === selectedTab);
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setSelectedTab(vaccineOptions[prevIndex].value);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };


  const handleLcsApprove = () => {
    const requestId = editId || (location.state as any)?.editId || initialData?.id;
    if (!requestId) {
      toast.error('No request ID found.');
      return;
    }

    const id = parseInt(requestId, 10);
    if (isNaN(id)) {
      toast.error('Invalid request ID.');
      return;
    }

    const payload: Partial<VaccineFormType> = {
      vaccine_status: 1,
      product_detail_request: initialData?.product_detail_request || [],
      requested_by: initialData?.requested_by || username,
    };

    updateVaccineRequest.mutate(
      { id, data: payload },
      {
        onSuccess: () => {
          toast.success('Vaccine request approved by LCS successfully');
          setIsSubmitted(true);
          navigate('/vaccine-page');
        },
        onError: (error: any) => {
          toast.error('Failed to approve vaccine request');
          console.error('LCS Approval error:', error);
        },
      }
    );
  };

  const handleLcsDecline = () => {
    if (!showDeclineComment) {
      setShowDeclineComment(true);
      setSelectedTab('cold-chain');
      return;
    }

    const requestId = editId || (location.state as any)?.editId || initialData?.id;
    if (!requestId) {
      toast.error('No request ID found.');
      return;
    }

    const id = parseInt(requestId, 10);
    if (isNaN(id)) {
      toast.error('Invalid request ID.');
      return;
    }

    if (!declineComment.trim()) {
      toast.error('Please provide a comment for declining the request.');
      return;
    }

    const payload: Partial<VaccineFormType> = {
      vaccine_status: 2, 
      decline_comment: declineComment,
      product_detail_request: initialData?.product_detail_request || [],
      requested_by: initialData?.requested_by || username,
    };

    updateVaccineRequest.mutate(
      { id, data: payload },
      {
        onSuccess: () => {
          toast.success('Vaccine request declined by LCS successfully');
          setIsSubmitted(true);
          navigate('/vaccine-page');
        },
        onError: (error: any) => {
          toast.error('Failed to decline vaccine request');
          console.error('LCS Decline error:', error);
        },
      }
    );
  };

  const handleSlwgApprove = () => {
    const requestId = editId || (location.state as any)?.editId || initialData?.id;
    if (!requestId) {
      toast.error('No request ID found.');
      return;
    }

    const id = parseInt(requestId, 10);
    if (isNaN(id)) {
      toast.error('Invalid request ID.');
      return;
    }

    const payload: Partial<VaccineFormType> = {
      vaccine_status: 3, 
      product_detail_request: initialData?.product_detail_request || [],
      requested_by: initialData?.requested_by || username,
    };

    updateVaccineRequest.mutate(
      { id, data: payload },
      {
        onSuccess: () => {
          toast.success('Vaccine request approved by SLWG successfully');
          setIsSubmitted(true);
          navigate('/vaccine-page');
        },
        onError: (error: any) => {
          toast.error('Failed to approve vaccine request');
          console.error('SLWG Approval error:', error);
        },
      }
    );
  };

  const handleSlwgDecline = () => {
    if (!showDeclineComment) {
      setShowDeclineComment(true);
      setSelectedTab('cold-chain');
      return;
    }

    const requestId = editId || (location.state as any)?.editId || initialData?.id;
    if (!requestId) {
      toast.error('No request ID found.');
      return;
    }

    const id = parseInt(requestId, 10);
    if (isNaN(id)) {
      toast.error('Invalid request ID.');
      return;
    }

    if (!declineComment.trim()) {
      toast.error('Please provide a comment for declining the request.');
      return;
    }

    const payload: Partial<VaccineFormType> = {
      vaccine_status: 4, 
      decline_comment: declineComment,
      product_detail_request: initialData?.product_detail_request || [],
      requested_by: initialData?.requested_by || username,
    };

    updateVaccineRequest.mutate(
      { id, data: payload },
      {
        onSuccess: () => {
          toast.success('Vaccine request declined by SLWG successfully');
          setIsSubmitted(true);
          navigate('/vaccine-page');
        },
        onError: (error: any) => {
          toast.error('Failed to decline vaccine request');
          console.error('SLWG Decline error:', error);
        },
      }
    );
  };

  const handlePickOrder = () => {
    const requestId = editId || (location.state as any)?.editId || initialData?.id;
    if (!requestId) {
      toast.error('No request ID found.');
      return;
    }

    const id = parseInt(requestId, 10);
    if (isNaN(id)) {
      toast.error('Invalid request ID.');
      return;
    }

    const payload: Partial<VaccineFormType> = {
      vaccine_status: 5, 
      product_detail_request: initialData?.product_detail_request || [],
      requested_by: initialData?.requested_by || username,
    };

    updateVaccineRequest.mutate(
      { id, data: payload },
      {
        onSuccess: () => {
          toast.success('Order picked successfully');
          setIsSubmitted(true); 
          navigate('/vaccine-page');
        },
        onError: (error: any) => {
          toast.error('Failed to pick order');
          console.error('Pick order error:', error);
        },
      }
    );
  };

  const handleSubmit = () => {
    if (userEhfList.length === 0) {
      toast.error('No user found. Please log in and try again.');
      return;
    }

    const ehfId = userEhfList[0]?.toString();
    if (!ehfId) {
      toast.error('No EHF ID found for this user. Please contact support.');
      return;
    }

    if (Object.keys(formDataCollection).length === 0) {
      toast.error('Please fill out at least one vaccine form before submitting.');
      return;
    }

    const productDetailRequests = Object.entries(formDataCollection).map(([type, data]) => ({
      type,
      ...data,
    }));

    const payload: VaccineFormType = {
      ehf_id: ehfId,
      vaccine_status: 0, 
      product_detail_request: productDetailRequests,
      requested_by: username,
    };

    createVaccine.mutate(payload, {
      onSuccess: (response) => {
        toast.success(
          response?.status === 'success'
            ? 'Vaccine Request Submitted Successfully'
            : response?.status || 'Vaccine Request Submitted'
        );
        setIsSubmitted(true); 
        navigate('/vaccine-page');
      },
      onError: (error: any) => {
        toast.error('Failed to submit vaccine request');
        console.error('Submission error:', error);
      },
    });
  };

  const currentIndex = vaccineOptions.findIndex((v) => v.value === selectedTab);
  const isLastTab = currentIndex === vaccineOptions.length - 1;
  const isFirstTab = currentIndex === 0;

  const userRole = useMemo(() => sessionStorage.getItem('userRole') || '', []);
  const isThreePL = userRole === 'threepl';
  const isSSC = userRole === 'scs';

  const vaccineStatusNumber = convertVaccineStatusToNumber(initialData?.vaccine_status);
  

  const isPending = vaccineStatusNumber === 0;
  const isLcsApproved = vaccineStatusNumber === 1;
  const isLcsDeclined = vaccineStatusNumber === 2;
  const isSlwgApproved = vaccineStatusNumber === 3;
  const isSlwgDeclined = vaccineStatusNumber === 4;
  const isPicked = vaccineStatusNumber === 5;
  const isCompleted = vaccineStatusNumber === 6;

  const isApproved = isSlwgApproved;
  const isDeclined = isLcsDeclined || isSlwgDeclined;
  const isFinalState = isDeclined || isPicked || isCompleted;

  const getStatusMessage = () => {
    if (isLcsApproved) return { text: "✓ Request approved by LCS", color: "success.main" };
    if (isLcsDeclined) return { text: "✗ Request declined by LCS", color: "error.main" };
    if (isSlwgApproved) return { text: "✓ Request approved by SLWG", color: "success.main" };
    if (isSlwgDeclined) return { text: "✗ Request declined by SLWG", color: "error.main" };
    if (isPicked) return { text: "Order has been picked by 3PL", color: "primary.main" };
    if (isCompleted) return { text: "✓ Order completed", color: "success.main" };
    return null;
  };

  const statusMessage = getStatusMessage();
  

  return (
    <DashboardContent>
      <Container maxWidth="xl" sx={{ textAlign: 'left' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: '1.25rem', mb: 2 }}>
          {isView ? 'View Vaccine Request' : isEdit ? 'Edit Vaccine Request' : 'Vaccine Products'}
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
                      '&.Mui-selected': { backgroundColor: '#1565C0', color: 'white', borderRadius: 1 },
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
            {selectedTab && (
              <Box sx={{ mb: 4 }}>
                {vaccineOptions
                  .find((v) => v.value === selectedTab)
                  ?.component({
                    initialData: formDataCollection[selectedTab] || { dateCreated: new Date().toISOString().slice(0, 16), equipStatus: '', requestType: '' },
                    onDataChange: handleDataChange,
                    key: selectedTab,
                    isView,
                    declineComment: selectedTab === 'cold-chain' && isView ? declineComment : undefined,
                    setDeclineComment: selectedTab === 'cold-chain' && isView ? setDeclineComment : undefined,
                    showDeclineComment: selectedTab === 'cold-chain' && showDeclineComment,
                  })}
              </Box>
            )}

           {selectedTab && (
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>

                {isView && isLastTab && (
                  <>
                    {isThreePL && isSlwgApproved && (
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handlePickOrder}
                        disabled={updateVaccineRequest.isPending || isSubmitted}
                      >
                        Pick Order
                      </Button>
                    )}

                    {userRole === 'lcs' && isPending && (
                      <>
                        <Button
                          variant="contained"
                          color="success"
                          size="large"
                          onClick={handleLcsApprove}
                          disabled={updateVaccineRequest.isPending || isSubmitted}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="large"
                          onClick={handleLcsDecline}
                          disabled={updateVaccineRequest.isPending || isSubmitted}
                        >
                          {showDeclineComment ? 'Confirm Decline' : 'Decline'}
                        </Button>
                      </>
                    )}

                    {userRole === 'slwg' && isLcsApproved && (
                      <>
                        <Button
                          variant="contained"
                          color="success"
                          size="large"
                          onClick={handleSlwgApprove}
                          disabled={updateVaccineRequest.isPending || isSubmitted}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="large"
                          onClick={handleSlwgDecline}
                          disabled={updateVaccineRequest.isPending || isSubmitted}
                        >
                          {showDeclineComment ? 'Confirm Decline' : 'Decline'}
                        </Button>
                      </>
                    )}


                    {statusMessage && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color={statusMessage.color}>
                          {statusMessage.text}
                        </Typography>
                      </Box>
                    )}
                  </>
                )}

                {(!isView || (isView && !isLastTab)) && (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      onClick={isEdit ? handleSubmit : isLastTab ? handleSubmit : handleNext}
                      disabled={createVaccine.isPending || updateVaccineRequest.isPending || isSubmitted}
                    >
                      {createVaccine.isPending || updateVaccineRequest.isPending
                        ? 'Submitting...'
                        : isEdit
                        ? 'Update'
                        : isLastTab
                        ? 'Submit'
                        : 'Next'}
                    </Button>

                    {!isFirstTab && (
                      <Button
                        variant="contained"
                        color="inherit"
                        size="large"
                        onClick={handleBack}
                      >
                        Back
                      </Button>
                    )}
                  </>
                )}
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </DashboardContent>
  );
}