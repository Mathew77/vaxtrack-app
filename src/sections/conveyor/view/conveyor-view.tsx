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
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import { DashboardContent } from 'src/layouts/dashboard';
import { format } from 'date-fns';
import { BcgVaccines } from 'src/sections/vaccine/bcg-vaccines';
import { BopvVaccine } from 'src/sections/vaccine/bopv-vaccines';
import { ColdChainStatus } from 'src/sections/vaccine/cold-chain';
import { HepbVaccine } from 'src/sections/vaccine/hepb-vaccines';
import { HpvVaccine } from 'src/sections/vaccine/hpv-vaccines';
import { IpvVaccine } from 'src/sections/vaccine/ipv-vaccines';
import { MeaslesVaccine } from 'src/sections/vaccine/measles-vaccines';
import { MenAVaccine } from 'src/sections/vaccine/menA-vaccines';
import { PcvVaccine } from 'src/sections/vaccine/pcv-vaccines';
import { PentaVaccine } from 'src/sections/vaccine/penta-vaccines';
import { RotaVaccine } from 'src/sections/vaccine/rota-vaccines';
import { TdVaccine } from 'src/sections/vaccine/td-vaccines';
import { YfVaccine } from 'src/sections/vaccine/yf-vaccines';

// import { BcgVaccines } from '../bcg-vaccines';
// import { MeaslesVaccine } from '../measles-vaccines';
// import { YfVaccine } from '../yf-vaccines';
// import { MenAVaccine } from '../menA-vaccines';
// import { RotaVaccine } from '../rota-vaccines';
// import { HpvVaccine } from '../hpv-vaccines';
// import { HepbVaccine } from '../hepb-vaccines';
// import { BopvVaccine } from '../bopv-vaccines';
// import { PentaVaccine } from '../penta-vaccines';
// import { TdVaccine } from '../td-vaccines';
// import { IpvVaccine } from '../ipv-vaccines';
// import { PcvVaccine } from '../pcv-vaccines';
// import { ColdChainStatus } from '../cold-chain';

interface ConveyorLine {
  type: string;
  data: any;
}

interface ConveyorOption {
  value: string;
  label: string;
  component: (props: any) => JSX.Element;
}

const vaccineOptions: ConveyorOption[] = [
  { value: 'bcg', label: 'BCG Vaccine', component: (props: any) => <BcgVaccines {...props} /> },
  { value: 'measles', label: 'Measles Vaccine', component: (props: any) => <MeaslesVaccine {...props} /> },
  { value: 'yf', label: 'YF Vaccine', component: (props: any) => <YfVaccine {...props} /> },
  { value: 'menA', label: 'MenA Vaccine', component: (props: any) => <MenAVaccine {...props} /> },
  { value: 'rotaa', label: 'Rota Vaccine', component: (props: any) => <RotaVaccine {...props} /> },
  { value: 'hpv', label: 'HPV Vaccine', component: (props: any) => <HpvVaccine {...props} /> },
  { value: 'hepB', label: 'HepB Vaccine', component: (props: any) => <HepbVaccine {...props} /> },
  { value: 'bopv', label: 'BOPV Vaccine', component: (props: any) => <BopvVaccine {...props} /> },
  { value: 'penta', label: 'Penta Vaccine', component: (props: any) => <PentaVaccine {...props} /> },
  { value: 'ipv', label: 'IPV Vaccine', component: (props: any) => <IpvVaccine {...props} /> },
  { value: 'pcv', label: 'PCV Vaccine', component: (props: any) => <PcvVaccine {...props} /> },
  { value: 'td', label: 'Td Vaccine', component: (props: any) => <TdVaccine {...props} /> },
  { value: 'cold-chain', label: 'Cold Chain Status', component: (props: any) => <ColdChainStatus {...props} /> },
];

export function VaccinesView() {
  const [selectedTab, setSelectedTab] = useState<string>(vaccineOptions[0].value);
  const [availableVaccines, setAvailableVaccines] = useState<ConveyorOption[]>(vaccineOptions);
  const [vaccineLines, setVaccineLines] = useState<ConveyorLine[]>([]);
  const [formDataCollection, setFormDataCollection] = useState<Record<string, any>>({});

  const sortVaccinesByOriginalOrder = (vaccines: ConveyorOption[]): ConveyorOption[] => {
    return [...vaccines].sort((a, b) => {
      const indexA = vaccineOptions.findIndex((v) => v.value === a.value);
      const indexB = vaccineOptions.findIndex((v) => v.value === b.value);
      return indexA - indexB;
    });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
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

  const handleNext = (data: any, currentIndex: number) => {
    setFormDataCollection((prev) => ({
      ...prev,
      [vaccineOptions[currentIndex].value]: data,
    }));
    const nextIndex = currentIndex + 1;
    if (nextIndex < vaccineOptions.length) {
      setSelectedTab(vaccineOptions[nextIndex].value);
    }
  };

  const handleBack = (currentIndex: number) => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setSelectedTab(vaccineOptions[prevIndex].value);
    }
  };

  const handleSubmit = () => {
    const currentDate = format(new Date(), "dd/MM/yyyy");
    const newVaccineLines = Object.entries(formDataCollection).map(([type, data]) => ({
      type,
      data: { ...data, dateCreated: currentDate },
    }));
    setVaccineLines((prev) => [...newVaccineLines, ...prev]);
    setFormDataCollection({});
    setAvailableVaccines([]);
  };

  const isLastTab = selectedTab === availableVaccines[availableVaccines.length - 1]?.value;

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
                sx={{
                  '& .MuiTabs-indicator': { backgroundColor: '#1976D2' },
                }}
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
                      '&:hover': {
                        backgroundColor: '#1565C0',
                      },
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
                    vaccineOptions,
                    currentIndex: vaccineOptions.findIndex((v) => v.value === selectedTab),
                    onNext: handleNext,
                    onBack: handleBack,
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

            {isLastTab && Object.keys(formDataCollection).length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" color="primary" size="large" onClick={handleSubmit}>
                  Submit
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </DashboardContent>
  );
}