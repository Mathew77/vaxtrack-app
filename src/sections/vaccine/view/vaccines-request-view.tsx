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
  TextField,
  Autocomplete,
} from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
// import { useFetchUsers } from 'src/hooks/apis/ehf/ehf-hooks'; // No longer needed for MFA verification
import { useCreateVaccine, useUpdateVaccineRequest } from 'src/hooks/apis/ehf/ehf-hooks';
import { VaccineFormType } from 'src/hooks/apis/ehf/ehf-type';
import { useFetchEHF } from 'src/hooks/apis/ehf-uhf/ehf-hooks';
import { toast } from 'react-toastify';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { validateMfaForSubmission } from 'src/utils/mfa-verification';

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
  
  // const { data: users = [] } = useFetchUsers();
  const createVaccine = useCreateVaccine();
  const updateVaccineRequest = useUpdateVaccineRequest();
  const { data: allEhfData = [] } = useFetchEHF();

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
  const [mfaCode, setMfaCode] = useState<string>('');
  const [showMfaInput, setShowMfaInput] = useState<boolean>(false);
  const [selectedEhfId, setSelectedEhfId] = useState<string>(''); 

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

  const userEhfOptions = useMemo(() => {
    // console.log('userEhfList:', userEhfList);
    // console.log('allEhfData:', allEhfData);

    if (userEhfList.length === 0 || allEhfData.length === 0) {
      // console.log('Returning empty - userEhfList length:', userEhfList.length, 'allEhfData length:', allEhfData.length);
      return [];
    }

    // Convert userEhfList to numbers for comparison
    const userEhfIds = userEhfList.map(id => typeof id === 'string' ? parseInt(id, 10) : id);
    // console.log('userEhfIds (converted):', userEhfIds);

    const filtered = allEhfData
      .filter((ehf) => {
        const ehfId = ehf.id ?? 0;
        const isIncluded = userEhfIds.includes(ehfId);
        // console.log(`Checking EHF ${ehfId} (${ehf.ehf_name}): included = ${isIncluded}`);
        return isIncluded;
      })
      .map((ehf) => ({
        id: (ehf.id ?? 0).toString(),
        label: ehf.ehf_name || `EHF ${ehf.id}`,
      }));

    // console.log('userEhfOptions:', filtered);
    return filtered;
  }, [userEhfList, allEhfData]);

  // Initialize selectedEhfId with the first EHF if not already set
  React.useEffect(() => {
    if (!selectedEhfId && userEhfOptions.length > 0) {
      setSelectedEhfId(userEhfOptions[0].id);
    }
  }, [userEhfOptions, selectedEhfId]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
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


  const handleLcsApprove = async () => {
    // Validate MFA code first using server-side verification
    const mfaValidation = await validateMfaForSubmission(mfaCode);
    if (!mfaValidation.isValid) {
      toast.error(mfaValidation.error);
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

    // Convert formDataCollection to product_detail_request format
    const productDetailRequests = Object.entries(formDataCollection).map(([type, data]) => ({
      type,
      ...data,
    }));

    const payload: Partial<VaccineFormType> = {
      vaccine_status: 1,
      product_detail_request: productDetailRequests,
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

    // Convert formDataCollection to product_detail_request format
    const productDetailRequests = Object.entries(formDataCollection).map(([type, data]) => ({
      type,
      ...data,
    }));

    const payload: Partial<VaccineFormType> = {
      vaccine_status: 2,
      decline_comment: declineComment,
      product_detail_request: productDetailRequests,
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

  const handleSlwgApprove = async () => {
    // Validate MFA code first using server-side verification
    const mfaValidation = await validateMfaForSubmission(mfaCode);
    if (!mfaValidation.isValid) {
      toast.error(mfaValidation.error);
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

    // Convert formDataCollection to product_detail_request format
    const productDetailRequests = Object.entries(formDataCollection).map(([type, data]) => ({
      type,
      ...data,
    }));

    const payload: Partial<VaccineFormType> = {
      vaccine_status: 3,
      product_detail_request: productDetailRequests,
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

    // Convert formDataCollection to product_detail_request format
    const productDetailRequests = Object.entries(formDataCollection).map(([type, data]) => ({
      type,
      ...data,
    }));

    const payload: Partial<VaccineFormType> = {
      vaccine_status: 4,
      decline_comment: declineComment,
      product_detail_request: productDetailRequests,
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

  const handleScsApprove = async () => {
    // Validate MFA code first using server-side verification
    const mfaValidation = await validateMfaForSubmission(mfaCode);
    if (!mfaValidation.isValid) {
      toast.error(mfaValidation.error);
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

    // Convert formDataCollection to product_detail_request format
    const productDetailRequests = Object.entries(formDataCollection).map(([type, data]) => ({
      type,
      ...data,
    }));

    const payload: Partial<VaccineFormType> = {
      vaccine_status: 5,
      product_detail_request: productDetailRequests,
      requested_by: initialData?.requested_by || username,
    };

    updateVaccineRequest.mutate(
      { id, data: payload },
      {
        onSuccess: () => {
          toast.success('Vaccine request approved by SCS successfully');
          setIsSubmitted(true);
          navigate('/vaccine-page');
        },
        onError: (error: any) => {
          toast.error('Failed to approve vaccine request');
          console.error('SCS Approval error:', error);
        },
      }
    );
  };

  const handleScsDecline = () => {
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

    // Convert formDataCollection to product_detail_request format
    const productDetailRequests = Object.entries(formDataCollection).map(([type, data]) => ({
      type,
      ...data,
    }));

    const payload: Partial<VaccineFormType> = {
      vaccine_status: 6,
      decline_comment: declineComment,
      product_detail_request: productDetailRequests,
      requested_by: initialData?.requested_by || username,
    };

    updateVaccineRequest.mutate(
      { id, data: payload },
      {
        onSuccess: () => {
          toast.success('Vaccine request declined by SCS successfully');
          setIsSubmitted(true);
          navigate('/vaccine-page');
        },
        onError: (error: any) => {
          toast.error('Failed to decline vaccine request');
          console.error('SCS Decline error:', error);
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

    // Convert formDataCollection to product_detail_request format
    const productDetailRequests = Object.entries(formDataCollection).map(([type, data]) => ({
      type,
      ...data,
    }));

    const payload: Partial<VaccineFormType> = {
      vaccine_status: 7,
      product_detail_request: productDetailRequests,
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

  const handleThreePlApprove = async () => {
    // Validate MFA code first using server-side verification
    const mfaValidation = await validateMfaForSubmission(mfaCode);
    if (!mfaValidation.isValid) {
      toast.error(mfaValidation.error);
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

    // Convert formDataCollection to product_detail_request format
    const productDetailRequests = Object.entries(formDataCollection).map(([type, data]) => ({
      type,
      ...data,
    }));

    const payload: Partial<VaccineFormType> = {
      vaccine_status: 7,
      product_detail_request: productDetailRequests,
      requested_by: initialData?.requested_by || username,
    };

    updateVaccineRequest.mutate(
      { id, data: payload },
      {
        onSuccess: () => {
          toast.success('Vaccine request approved by 3PL successfully');
          setIsSubmitted(true);
          navigate('/vaccine-page');
        },
        onError: (error: any) => {
          toast.error('Failed to approve vaccine request');
          console.error('3PL Approval error:', error);
        },
      }
    );
  };

  const handleThreePlDecline = () => {
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

    // Convert formDataCollection to product_detail_request format
    const productDetailRequests = Object.entries(formDataCollection).map(([type, data]) => ({
      type,
      ...data,
    }));

    const payload: Partial<VaccineFormType> = {
      vaccine_status: 9, 
      decline_comment: declineComment,
      product_detail_request: productDetailRequests,
      requested_by: initialData?.requested_by || username,
    };

    updateVaccineRequest.mutate(
      { id, data: payload },
      {
        onSuccess: () => {
          toast.success('Vaccine request declined by 3PL successfully');
          setIsSubmitted(true);
          navigate('/vaccine-page');
        },
        onError: (error: any) => {
          toast.error('Failed to decline vaccine request');
          console.error('3PL Decline error:', error);
        },
      }
    );
  };

  // EHF Approve 
  const handleEhfApprove = async () => {
    // Validate MFA code first using server-side verification
    const mfaValidation = await validateMfaForSubmission(mfaCode);
    if (!mfaValidation.isValid) {
      toast.error(mfaValidation.error);
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

    // Convert formDataCollection to product_detail_request format
    const productDetailRequests = Object.entries(formDataCollection).map(([type, data]) => ({
      type,
      ...data,
    }));

    const payload: Partial<VaccineFormType> = {
      vaccine_status: 8, 
      product_detail_request: productDetailRequests,
      requested_by: initialData?.requested_by || username,
    };

    updateVaccineRequest.mutate(
      { id, data: payload },
      {
        onSuccess: () => {
          toast.success('Vaccine request accepted by EHF successfully');
          setIsSubmitted(true);
          navigate('/vaccine-page');
        },
        onError: (error: any) => {
          toast.error('Failed to accept vaccine request');
          console.error('EHF Accept error:', error);
        },
      }
    );
  };

  // EHF Decline 
  const handleEhfDecline = () => {
    if (!showDeclineComment) {
      setShowDeclineComment(true);
      return;
    }

    if (!declineComment.trim()) {
      toast.error('Please provide a reason for declining');
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

    const payload: Partial<VaccineFormType> = {
      vaccine_status: 10,
      decline_comment: declineComment,
    };

    updateVaccineRequest.mutate(
      { id, data: payload },
      {
        onSuccess: () => {
          toast.success('Vaccine request declined by EHF successfully');
          setIsSubmitted(true);
          navigate('/vaccine-page');
        },
        onError: (error: any) => {
          toast.error('Failed to decline vaccine request');
          console.error('EHF Decline error:', error);
        },
      }
    );
  };

  const handleSubmit = async () => {
    // Validate MFA code first using server-side verification
    const mfaValidation = await validateMfaForSubmission(mfaCode);
    if (!mfaValidation.isValid) {
      toast.error(mfaValidation.error);
      return;
    }

    if (!selectedEhfId) {
      toast.error('Please select an EHF facility before submitting.');
      return;
    }

    const ehfId = selectedEhfId;
    const ehfName = userEhfOptions.find(opt => opt.id === selectedEhfId)?.label || '';

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
      ehf_name: ehfName,
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
  const isEhfUser = userRole === 'ehf';

  const vaccineStatusNumber = convertVaccineStatusToNumber(initialData?.vaccine_status);
  

  const isPending = vaccineStatusNumber === 0;
  const isLcsApproved = vaccineStatusNumber === 1;
  const isLcsDeclined = vaccineStatusNumber === 2;
  const isSlwgApproved = vaccineStatusNumber === 3;
  const isSlwgDeclined = vaccineStatusNumber === 4;
  const isScsApproved = vaccineStatusNumber === 5;
  const isScsDeclined = vaccineStatusNumber === 6;
  const isThreePlApproved = vaccineStatusNumber === 7;
  const isCompleted = vaccineStatusNumber === 8;
  const isThreePlDeclined = vaccineStatusNumber === 9;


  const getStatusMessage = () => {
    if (isLcsApproved) return { text: "✓ Request approved by LCS", color: "success.main" };
    if (isLcsDeclined) return { text: "✗ Request declined by LCS", color: "error.main" };
    if (isSlwgApproved) return { text: "✓ Request approved by SLWG", color: "success.main" };
    if (isSlwgDeclined) return { text: "✗ Request declined by SLWG", color: "error.main" };
    if (isScsApproved) return { text: "✓ Request approved by SCS", color: "success.main" };
    if (isScsDeclined) return { text: "✗ Request declined by SCS", color: "error.main" };
    if (isThreePlApproved) return { text: "✓ Vaccine picked by 3PL", color: "success.main" };
    if (isThreePlDeclined) return { text: "✗ Request declined by 3PL", color: "error.main" };
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
            {/* EHF Selection Dropdown - Show when creating or editing (not viewing) */}
            {!isView && userEhfOptions.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Autocomplete
                  fullWidth
                  options={userEhfOptions}
                  getOptionLabel={(option) => option.label}
                  value={userEhfOptions.find((opt) => opt.id === selectedEhfId) || null}
                  onChange={(_, newValue) => {
                    setSelectedEhfId(newValue?.id || '');
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select EHF Facility"
                      placeholder="Choose the facility you are submitting for"
                      required
                      helperText={
                        userEhfOptions.length === 1
                          ? 'This is the only facility assigned to you'
                          : 'Select the facility you are submitting this request for'
                      }
                    />
                  )}
                />
              </Box>
            )}

            {selectedTab && (
              <Box sx={{ mb: 4 }}>
                {vaccineOptions
                  .find((v) => v.value === selectedTab)
                  ?.component({
                    initialData: formDataCollection[selectedTab] || { dateCreated: new Date().toISOString().slice(0, 16), equipStatus: '', requestType: '' },
                    onDataChange: handleDataChange,
                    key: selectedTab,
                    isView,
                    userRole,
                    vaccineStatus: vaccineStatusNumber,
                    declineComment: selectedTab === 'cold-chain' && isView ? declineComment : undefined,
                    setDeclineComment: selectedTab === 'cold-chain' && isView ? setDeclineComment : undefined,
                    showDeclineComment: selectedTab === 'cold-chain' && showDeclineComment,
                  })}
              </Box>
            )}

            {/* MFA Code Input - Show when user needs to submit or approve */}
            {((!isView && isLastTab) || (isView && isLastTab && (
              (userRole === 'lcs' && isPending) ||
              (userRole === 'slwg' && isLcsApproved) ||
              (userRole === 'scs' && isSlwgApproved) ||
              (isThreePL && isScsApproved) ||
              (isEhfUser && isThreePlApproved)
            ))) && (
              <Box sx={{ mb: 3, width: "50%" }}>
                <TextField
                  label="MFA Code"
                  placeholder="Enter your 4-digit MFA code"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  variant="outlined"
                  size="medium"
                  inputProps={{ maxLength: 4 }}
                  helperText="Please enter your MFA code to proceed with submission/approval"
                />
              </Box>
            )}

           {selectedTab && (
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>

                {isView && isLastTab && (
                  <>
                    {isThreePL && isScsApproved && (
                      <>
                        <Button
                          variant="contained"
                          color="error"
                          size="large"
                          onClick={handleThreePlDecline}
                          disabled={updateVaccineRequest.isPending || isSubmitted}
                        >
                          {showDeclineComment ? 'Confirm Decline' : 'Decline'}
                        </Button>
                        <Button
                          variant="contained"
                          color="success"
                          size="large"
                          onClick={handleThreePlApprove}
                          disabled={updateVaccineRequest.isPending || isSubmitted}
                        >
                          Approve
                        </Button>
                      </>
                    )}

                    {userRole === 'lcs' && isPending && (
                      <>
                        <Button
                          variant="contained"
                          color="error"
                          size="large"
                          onClick={handleLcsDecline}
                          disabled={updateVaccineRequest.isPending || isSubmitted}
                        >
                          {showDeclineComment ? 'Confirm Decline' : 'Decline'}
                        </Button>
                        <Button
                          variant="contained"
                          color="success"
                          size="large"
                          onClick={handleLcsApprove}
                          disabled={updateVaccineRequest.isPending || isSubmitted}
                        >
                          Approve
                        </Button>
                      </>
                    )}

                    {userRole === 'slwg' && isLcsApproved && (
                      <>
                        <Button
                          variant="contained"
                          color="error"
                          size="large"
                          onClick={handleSlwgDecline}
                          disabled={updateVaccineRequest.isPending || isSubmitted}
                        >
                          {showDeclineComment ? 'Confirm Decline' : 'Decline'}
                        </Button>
                        <Button
                          variant="contained"
                          color="success"
                          size="large"
                          onClick={handleSlwgApprove}
                          disabled={updateVaccineRequest.isPending || isSubmitted}
                        >
                          Approve
                        </Button>
                      </>
                    )}

                    {userRole === 'scs' && isSlwgApproved && (
                      <>
                        <Button
                          variant="contained"
                          color="error"
                          size="large"
                          onClick={handleScsDecline}
                          disabled={updateVaccineRequest.isPending || isSubmitted}
                        >
                          {showDeclineComment ? 'Confirm Decline' : 'Decline'}
                        </Button>
                          <Button
                          variant="contained"
                          color="success"
                          size="large"
                          onClick={handleScsApprove}
                          disabled={updateVaccineRequest.isPending || isSubmitted}
                        >
                          Approve
                        </Button>
                      </>
                    )}

                    {isEhfUser && isThreePlApproved && (
                      <>
                        <Button
                          variant="contained"
                          color="error"
                          size="large"
                          onClick={handleEhfDecline}
                          disabled={updateVaccineRequest.isPending || isSubmitted}
                        >
                          {showDeclineComment ? 'Confirm Decline' : 'Decline'}
                        </Button>
                        <Button
                          variant="contained"
                          color="success"
                          size="large"
                          onClick={handleEhfApprove}
                          disabled={updateVaccineRequest.isPending || isSubmitted}
                        >
                          Accept
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