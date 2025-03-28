import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { useCreateVaccine } from 'src/hooks/apis/ehf/ehf-hooks';
import { VaccineFormType } from 'src/hooks/apis/ehf/ehf-type';
import { toast } from 'react-toastify';

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

interface VaccineOption {
  value: string;
  label: string;
  component: (props: any) => JSX.Element;
}

const vaccineOptions: VaccineOption[] = [
  { value: 'bcg', label: 'BCG Vaccine', component: BcgVaccines },
  { value: 'measles', label: 'Measles Vaccine', component: MeaslesVaccine },
  { value: 'yf', label: 'YF Vaccine', component: YfVaccine },
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

export function VaccineRequestList() {
  const { data: users = [] } = useFetchUsers();
  const createVaccine = useCreateVaccine();

  const [selectedTab, setSelectedTab] = useState<string>(vaccineOptions[0].value);
  const [formDataCollection, setFormDataCollection] = useState<Record<string, any>>({});
  const componentRef = useRef<HTMLDivElement>(null);


  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };

  const handleDataChange = useCallback((data: any) => {
    setFormDataCollection((prev) => {
      const newData = { ...prev, [selectedTab]: data };
      return newData;
    });
  }, [selectedTab]);

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

  const handleSubmit = () => {
    const currentUser = users[0];
    if (!currentUser) {
      toast.error('No user found. Please log in and try again.');
      return;
    }
  
    const ehfId = currentUser.ehf_list?.[0];
    if (!ehfId) {
      toast.error('No EHF Id found for this user.');
      return;
    }

    if (Object.keys(formDataCollection).length === 0) {
      toast.error('Please fill out at least one vaccine form before submitting.');
      return;
    }

    const productDetailRequests = Object.entries(formDataCollection).map(([type, data]) => ({
      type,
      ...data
    }));

    const payload: VaccineFormType = {
      ehf_id: parseInt(ehfId, 10),
      product_detail_request: productDetailRequests,
      requested_by: currentUser.username
    };

    createVaccine.mutate(payload, {
      onSuccess: (response) => {
        setFormDataCollection({});
        setSelectedTab(vaccineOptions[0].value);
  
        toast.success(
          response?.status === 'success' 
            ? 'Vaccine Request Submitted Successfully' 
            : response?.status || 'Vaccine Request Submitted'
        );
      },
    });
  };

  const currentIndex = vaccineOptions.findIndex((v) => v.value === selectedTab);
  const isLastTab = currentIndex === vaccineOptions.length - 1;
  const isFirstTab = currentIndex === 0;

  const currentInitialData = formDataCollection[selectedTab] || {};

  return (
    <DashboardContent>
      <Container maxWidth="lg" sx={{ textAlign: 'left' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: '1.25rem', mb: 2 }}>
          Vaccine Products
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Paper sx={{ p: 2, border: '2px solid #1976D2', borderRadius: 1, height: 'fit-content', maxHeight: 'calc(100vh - 150px)', overflow: 'auto', backgroundColor: '#1976D2' }}>
              <Tabs orientation="vertical" variant="scrollable" value={selectedTab} onChange={handleTabChange} sx={{ '& .MuiTabs-indicator': { backgroundColor: '#1976D2' } }}>
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
                    initialData: currentInitialData,
                    onDataChange: handleDataChange,
                    key: selectedTab,
                  })}
              </Box>
            )}

            {selectedTab && (
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button variant="contained" color="primary" size="large" onClick={isLastTab ? handleSubmit : handleNext}>
                  {isLastTab ? 'Submit' : 'Next'}
                </Button>
                <Button variant="contained" color="inherit" size="large" onClick={handleBack} disabled={isFirstTab}>
                  Back
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </DashboardContent>
  );
}