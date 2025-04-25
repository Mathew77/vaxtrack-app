import React, { useState } from 'react';
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
import VaccinesIcon from '@mui/icons-material/Vaccines';
import { DashboardContent } from 'src/layouts/dashboard';

import { BcgAllocation } from '../bcg-allocation';
import { MeaslesAllocation } from '../measles-allocation';
import { YfAllocation } from '../yf-allocation';
import { MenAAllocation } from '../menA-allocation';
import { RotaAllocation } from '../rota-allocation';
import { HpvAllocation } from '../hpv-allocation';
import { HepbAllocation } from '../hepb-allocation';
import { BopvAllocation } from '../bopv-allocation';
import { PentaAllocation } from '../penta-allocation';
import { IpvAllocation } from '../ipv-allocation';
import { PcvAllocation } from '../pcv-allocation';
import { TdAllocation } from '../td-allocation';

interface VaccineOption {
  value: string;
  label: string;
  component: (props: any) => JSX.Element;
}

const vaccineOptions: VaccineOption[] = [
  { value: 'bcg', label: 'BCG Allocation', component: BcgAllocation },
  { value: 'measles', label: 'Measles Allocation', component: MeaslesAllocation },
  { value: 'yf', label: 'YF Allocation', component: YfAllocation },
  { value: 'menA', label: 'MenA Allocation', component: MenAAllocation },
  { value: 'rota', label: 'Rota Allocation', component: RotaAllocation },
  { value: 'hpv', label: 'HPV Allocation', component: HpvAllocation },
  { value: 'hepB', label: 'HepB Allocation', component: HepbAllocation },
  { value: 'bopv', label: 'BOPV Allocation', component: BopvAllocation },
  { value: 'penta', label: 'Penta Allocation', component: PentaAllocation },
  { value: 'ipv', label: 'IPV Allocation', component: IpvAllocation },
  { value: 'pcv', label: 'PCV Allocation', component: PcvAllocation },
  { value: 'td', label: 'Td Allocation', component: TdAllocation },
];

export function VaccineAllocationList() {
  const [selectedTab, setSelectedTab] = useState<string>(vaccineOptions[0].value);
  const [formDataCollection, setFormDataCollection] = useState<Record<string, any>>({});

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };

  const handleDataChange = (data: any) => {
    setFormDataCollection((prev) => ({
      ...prev,
      [selectedTab]: data,
    }));
  };

  const handleNext = () => {
    const currentIndex = vaccineOptions.findIndex((v) => v.value === selectedTab);
    const nextIndex = currentIndex + 1;
    if (nextIndex < vaccineOptions.length) {
      setSelectedTab(vaccineOptions[nextIndex].value);
    }
  };

  const handleBack = () => {
    const currentIndex = vaccineOptions.findIndex((v) => v.value === selectedTab);
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setSelectedTab(vaccineOptions[prevIndex].value);
    }
  };

  const currentIndex = vaccineOptions.findIndex((v) => v.value === selectedTab);
  const isLastTab = currentIndex === vaccineOptions.length - 1;
  const isFirstTab = currentIndex === 0;

  return (
    <DashboardContent>
      <Container maxWidth="lg" sx={{ textAlign: 'left' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: '1.25rem', mb: 2 }}>
          Vaccine Products
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
            {selectedTab && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {(() => {
                  const SelectedComponent = vaccineOptions.find((v) => v.value === selectedTab)?.component;
                  return SelectedComponent ? (
                    <>
                      <SelectedComponent
                        initialData={formDataCollection[selectedTab] || {}}
                        onDataChange={handleDataChange}
                      />
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-start',
                          gap: 2,
                          mt: 3,
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          onClick={isLastTab ? () => {} : handleNext}
                        >
                          {isLastTab ? 'Submit' : 'Next'}
                        </Button>
                        <Button
                          variant="contained"
                          color="inherit"
                          size="large"
                          onClick={handleBack}
                          disabled={isFirstTab}
                        >
                          Back
                        </Button>
                      </Box>
                    </>
                  ) : null;
                })()}
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </DashboardContent>
  );
}