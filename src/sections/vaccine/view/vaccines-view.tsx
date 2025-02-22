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
} from '@mui/material';

import { _products } from 'src/_mock';
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

const vaccineOptions = [
  { value: 'bcg', label: 'BCG Vaccine', component: <BcgVaccines /> },
  { value: 'measles', label: 'Measles Vaccine', component: <MeaslesVaccine /> },
  { value: 'yf', label: 'YF Vaccine', component: <YfVaccine /> },
  { value: 'menA', label: 'MenA Vaccine', component: <MenAVaccine /> },
  { value: 'rota', label: 'Rota Vaccine', component: <RotaVaccine /> },
  { value: 'hpv', label: 'HPV Vaccine', component: <HpvVaccine /> },
  { value: 'hepb', label: 'HepB Vaccine', component: <HepbVaccine /> },
  { value: 'bopv', label: 'BOPV Vaccine', component: <BopvVaccine /> },
  { value: 'penta', label: 'Penta Vaccine', component: <PentaVaccine /> },
  { value: 'pcv', label: 'PCV Vaccine', component: <PcvVaccine /> },
  { value: 'ipv', label: 'IPV Vaccine', component: <IpvVaccine /> },
  { value: 'td', label: 'Td Vaccine', component: <TdVaccine /> },
];

export function VaccinesView() {
  const [selectedForm, setSelectedForm] = useState('');

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
              onChange={(e) => setSelectedForm(e.target.value)}
              label="Vaccine"
            >
              {vaccineOptions.map((vaccine) => (
                <MenuItem key={vaccine.value} value={vaccine.value}>
                  {vaccine.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mt: 4 }}>{vaccineOptions.find((v) => v.value === selectedForm)?.component}</Box>
      </Container>
    </DashboardContent>
  );
}
