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
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {(() => {
                  const SelectedComponent = availableVaccines.find((v) => v.value === selectedTab)?.component;
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
                      </Box>
                    </>
                  ) : null;
                })()}
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
          </Grid>
        </Grid>
      </Container>
    </DashboardContent>
  );
}