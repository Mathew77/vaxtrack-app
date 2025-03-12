import React, { useState, useEffect } from 'react';
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
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import { DashboardContent } from 'src/layouts/dashboard';
import { format } from 'date-fns';

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

interface VaccineLine {
  type: string;
  data: any;
}

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
  { value: 'hpv', label: 'HPV Vaccine', component: HpvVaccine },
  { value: 'hepB', label: 'HepB Vaccine', component: HepbVaccine },
  { value: 'bopv', label: 'BOPV Vaccine', component: BopvVaccine },
  { value: 'penta', label: 'Penta Vaccine', component: PentaVaccine },
  { value: 'ipv', label: 'IPV Vaccine', component: IpvVaccine },
  { value: 'pcv', label: 'PCV Vaccine', component: PcvVaccine },
  { value: 'td', label: 'Td Vaccine', component: TdVaccine  },
  { value: 'cold-chain', label: 'Cold Chain Status', component: ColdChainStatus },
];

export function VaccineRequestList() {
  const [selectedTab, setSelectedTab] = useState<string>(vaccineOptions[0].value);
  const [availableVaccines, setAvailableVaccines] = useState<VaccineOption[]>(vaccineOptions);
  const [vaccineLines, setVaccineLines] = useState<VaccineLine[]>([]);
  const [formDataCollection, setFormDataCollection] = useState<Record<string, any>>({});

  useEffect(() => {
    console.log('Selected Tab:', selectedTab);
  }, [selectedTab]);

  const sortVaccinesByOriginalOrder = (vaccines: VaccineOption[]): VaccineOption[] => {
    return [...vaccines].sort((a, b) => {
      const indexA = vaccineOptions.findIndex((v) => v.value === a.value);
      const indexB = vaccineOptions.findIndex((v) => v.value === b.value);
      return indexA - indexB;
    });
  };

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

  const handleDone = () => {
    const newVaccineLines = Object.entries(formDataCollection).map(([type, data]) => ({
      type,
      data,
    }));
    setVaccineLines((prev) => [...newVaccineLines, ...prev]);
    setFormDataCollection({});
    setAvailableVaccines(vaccineOptions);
    setSelectedTab(vaccineOptions[0].value);
  };

  const handleDelete = (index: number) => {
    const deletedVaccine = vaccineLines[index];
    setVaccineLines((prev) => prev.filter((_, i) => i !== index));
    const vaccineOption = vaccineOptions.find((v) => v.value === deletedVaccine.type);
    if (vaccineOption && !availableVaccines.some((v) => v.value === deletedVaccine.type)) {
      setAvailableVaccines((prev) => sortVaccinesByOriginalOrder([...prev, vaccineOption]));
    }
  };

  const handleEdit = (index: number) => {
    const vaccineToEdit = vaccineLines[index];
    setVaccineLines((prev) => prev.filter((_, i) => i !== index));
    setSelectedTab(vaccineToEdit.type);
    setFormDataCollection((prev) => ({
      ...prev,
      [vaccineToEdit.type]: vaccineToEdit.data,
    }));
    if (!availableVaccines.some((v) => v.value === vaccineToEdit.type)) {
      const vaccineOption = vaccineOptions.find((v) => v.value === vaccineToEdit.type);
      if (vaccineOption) {
        setAvailableVaccines((prev) => sortVaccinesByOriginalOrder([...prev, vaccineOption]));
      }
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
                {availableVaccines.map((vaccine) => (
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
              <Box sx={{ mb: 4 }}>
                {availableVaccines
                  .find((v) => v.value === selectedTab)
                  ?.component({
                    initialData: formDataCollection[selectedTab] || {},
                    onDataChange: handleDataChange, 
                  })}
              </Box>
            )}

            {availableVaccines.length === 0 && vaccineLines.length === 0 && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: 'calc(100vh - 250px)',
                }}
              >
                <VaccinesIcon sx={{ fontSize: 60, color: '#1976D2', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#666' }}>
                  Select a Vaccine to show data
                </Typography>
              </Box>
            )}

            {vaccineLines.length > 0 && (
              <Box>
                <Paper sx={{ p: 2, borderRadius: 1, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
                  <Box sx={{ backgroundColor: '#1976D2', color: 'white', py: 1, px: 2, borderRadius: 1, mb: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={3}>
                        <Typography sx={{ fontWeight: 'bold' }}>Vaccine Products</Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography sx={{ fontWeight: 'bold' }}>Physical Stock</Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography sx={{ fontWeight: 'bold' }}>Avg Daily Consumption</Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography sx={{ fontWeight: 'bold' }}>Actions</Typography>
                      </Grid>
                    </Grid>
                  </Box>

                  {vaccineLines.map((lines, index) => (
                    <Box
                      key={index}
                      sx={{
                        borderBottom: index < vaccineLines.length - 1 ? '1px solid #e0e0e0' : 'none',
                        py: 1,
                        px: 2,
                      }}
                    >
                      <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                        <Grid item xs={3}>
                          <Typography>{vaccineOptions.find((v) => v.value === lines.type)?.label}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Typography>{lines.data.physicalStock}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Typography>{lines.data.avgDailyConsumption}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <EditIcon sx={{ color: '#1976D2', cursor: 'pointer' }} onClick={() => handleEdit(index)} />
                            <DeleteIcon sx={{ color: '#d32f2f', cursor: 'pointer' }} onClick={() => handleDelete(index)} />
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </Paper>
              </Box>
            )}

            {selectedTab && (
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={isLastTab ? handleDone : handleNext}
                >
                  {isLastTab ? 'Save' : 'Next'}
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
                {/* {isLastTab && (
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    onClick={handleDone}
                  >
                    Save All
                  </Button>
                )} */}
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </DashboardContent>
  );
}