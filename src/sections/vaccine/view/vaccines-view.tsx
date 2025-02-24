import React, { useState } from 'react';
import {
  Container,
  MenuItem,
  Select,
  TextField,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Paper,
  Grid,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { BcgVaccines } from '../bcg-vaccines';
import { MeaslesVaccine } from '../measles-vaccines';
import { YfVaccine } from '../yf-vaccines';
import { MenAVaccine } from '../menA-vaccines';
import { RotaVaccine } from '../rota-vaccines';
import { HpvVaccine } from '../hpv-vaccines';
import { HepbVaccine } from '../hepb-vaccines';
import { BopvVaccine } from '../bopv-vaccines';
import { PentaVaccine } from '../penta-vaccines';
import { TdVaccine } from '../td-vaccines';
import { IpvVaccine } from '../ipv-vaccines';
import { PcvVaccine } from '../pcv-vaccines';

interface VaccineLine {
  type: string;
  data: any;
}

const vaccineOptions = [
  { value: 'bcg', label: 'BCG Vaccine', component: (props: any) => <BcgVaccines {...props} /> },
  { value: 'measles', label: 'Measles Vaccine', component: (props: any) => <MeaslesVaccine {...props} /> },
  { value: 'yf', label: 'YF Vaccine', component: (props: any) => <YfVaccine {...props} /> },
  { value: 'menA', label: 'MenA Vaccine', component: (props: any) => <MenAVaccine {...props} /> },
  { value: 'rotaa', label: 'Rota Vaccine', component: (props: any) => <RotaVaccine {...props} /> },
  { value: 'hpv', label: 'HPV Vaccine', component: (props: any) => <HpvVaccine {...props} /> },
  { value: 'hepB', label: 'HepB Vaccine', component: (props: any) => <HepbVaccine {...props} /> },
  { value: 'bopv', label: 'BOPV Vaccine', component: (props: any) => <BopvVaccine {...props} /> },
  { value: 'penta', label: 'Penta Vaccine', component: (props: any) => <PentaVaccine {...props} /> },
  { value: 'pcv', label: 'PCV Vaccine', component: (props: any) => <PcvVaccine {...props} /> },
  { value: 'ipv', label: 'IPV Vaccine', component: (props: any) => <IpvVaccine {...props} /> },
  { value: 'td', label: 'Td Vaccine', component: (props: any) => <TdVaccine {...props} /> },
];

export function VaccinesView() {
  const [selectedForm, setSelectedForm] = useState('');
  const [availableVaccines, setAvailableVaccines] = useState(vaccineOptions);
  const [vaccineLines, setVaccineLines] = useState<VaccineLine[]>([]);
  const [currentForm, setCurrentForm] = useState<VaccineLine | null>(null);

  const handleAddToLine = (data: any) => {
    setVaccineLines([{
      type: selectedForm,
      data: data
    }, ...vaccineLines]);

    setCurrentForm(null);

    setAvailableVaccines(availableVaccines.filter(v => v.value !== selectedForm));

    setSelectedForm('');
  };

  const handleFormChange = (value: string) => {
    setSelectedForm(value);
    setCurrentForm({
      type: value,
      data: {} 
    });
  };

  return (
    <DashboardContent>
      <Container maxWidth="lg" sx={{ textAlign: 'left' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
            Select Vaccine Product
          </Typography>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Vaccine</InputLabel>
            <Select
              value={selectedForm}
              onChange={(e) => handleFormChange(e.target.value as string)}
              label="Vaccine"
            >
              {availableVaccines.map((vaccine) => (
                <MenuItem key={vaccine.value} value={vaccine.value}>
                  {vaccine.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {currentForm && (
          <Box sx={{ mt: 4 }}>
            {availableVaccines.find((v) => v.value === currentForm.type)?.component({
              onAddToLine: handleAddToLine
            })}
          </Box>
        )}

        {vaccineLines.length > 0 && (
          <Box sx={{ mt: 4 }}>
          
            {vaccineLines.map((lines, index) => (
              <Paper 
                key={index} 
                sx={{ 
                  p: 2, 
                  mb: 2,
                  borderRadius: 1
                }}
              >
                <Box 
                  sx={{ 
                    p: 1,
                    mb: 2,
                  }}
                >
                  <Typography variant="subtitle1">
                    {vaccineOptions.find(v => v.value === lines.type)?.label}
                  </Typography>
                </Box>

                <Grid container>
                  <Grid container item spacing={1}>
                    <Box 
                      sx={{ 
                        border: '1px solid #1976D2',
                        borderRadius: 1, 
                        backgroundColor: '#1976D2', 
                        color: 'white', 
                        display: 'flex',
                        width: '100%', 
                        py: 1, 
                        px: 2,
                      }}
                    >
                      {lines.data.physicalStock !== "" && (
                        <Grid item xs={3}>
                          <Typography sx={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>
                            Physical Stock
                          </Typography>
                        </Grid>
                      )}
                      {lines.data.avgDailyConsumption !== "" && (
                        <Grid item xs={3}>
                          <Typography sx={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>
                            Average Daily Consumption
                          </Typography>
                        </Grid>
                      )}
                      {lines.data.dateCreated !== "" && (
                        <Grid item xs={3}>
                          <Typography sx={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>
                            Date Created
                          </Typography>
                        </Grid>
                      )}
                      {/* {lines.data.daysOfStock !== "" && (
                        <Grid item xs={3}>
                          <Typography sx={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>
                            Days of Stock
                          </Typography>
                        </Grid>
                      )} */}
                    </Box>
                  </Grid>

                  <Grid container item spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={3}>
                      <Typography variant="body1">{lines.data.physicalStock}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="body1">{lines.data.avgDailyConsumption}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="body1">{lines.data.dateCreated}</Typography>
                    </Grid>
                    {/* <Grid item xs={3}>
                      <Typography variant="body1">{lines.data.daysOfStock}</Typography>
                    </Grid> */}
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Box>
        )}
      </Container>
    </DashboardContent>
  );
}