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
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VaccinesIcon from '@mui/icons-material/Vaccines'; 

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
import VaxTable, { type ActionMenuItem } from '../../../utils/VaxTablePage'; 
import { MRT_ColumnDef, MRT_Cell } from 'material-react-table';

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
  const [availableVaccines, setAvailableVaccines] = useState<VaccineOption[]>(vaccineOptions);
  const [vaccineLines, setVaccineLines] = useState<VaccineLine[]>([]);
  const [currentForm, setCurrentForm] = useState<VaccineLine | null>(null);

  const sortVaccinesByOriginalOrder = (vaccines: VaccineOption[]): VaccineOption[] => {
    return [...vaccines].sort((a, b) => {
      const indexA = vaccineOptions.findIndex(v => v.value === a.value);
      const indexB = vaccineOptions.findIndex(v => v.value === b.value);
      return indexA - indexB;
    });
  };

  const handleAddToLine = (data: any) => {
    setVaccineLines((prev) => [{
      type: selectedForm,
      data: data
    }, ...prev]);

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

  const handleDelete = (index: number) => {
    const deletedVaccine = vaccineLines[index];
    setVaccineLines((prev) => prev.filter((_, i) => i !== index));

    const vaccineOption = vaccineOptions.find(v => v.value === deletedVaccine.type);
    
    if (vaccineOption && !availableVaccines.some(v => v.value === deletedVaccine.type)) {
      setAvailableVaccines((prev) => sortVaccinesByOriginalOrder([...prev, vaccineOption]));
    }
  };

  const handleEdit = (index: number) => {
    const vaccineToEdit = vaccineLines[index];
    
    setVaccineLines((prev) => prev.filter((_, i) => i !== index));
    
    setSelectedForm(vaccineToEdit.type);
    setCurrentForm(vaccineToEdit);
    
    if (!availableVaccines.some(v => v.value === vaccineToEdit.type)) {
      const vaccineOption = vaccineOptions.find(v => v.value === vaccineToEdit.type);
      if (vaccineOption) {
        setAvailableVaccines((prev) => sortVaccinesByOriginalOrder([...prev, vaccineOption]));
      }
    }
  };

  const columns: MRT_ColumnDef<VaccineLine>[] = [
    {
      accessorKey: 'type',
      header: 'Vaccine Products',
      Cell: ({ cell }: { cell: MRT_Cell<VaccineLine> }) => (
        <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {vaccineOptions.find(v => v.value === cell.getValue<string>())?.label}
        </Typography>
      ),
    },
    {
      accessorKey: 'data.physicalStock',
      header: 'Physical Stock',
    },
    {
      accessorKey: 'data.avgDailyConsumption',
      header: 'Avg Daily Consumption',
    },
    {
      accessorKey: 'data.dateCreated',
      header: 'Date Created',
    },
  ];
  
  const actionMenuItems: ActionMenuItem<VaccineLine>[] = [
    {
      display: 'Edit',
      icon: <EditIcon sx={{ color: '#1976D2' }} />,
      handleClick: (row) => handleEdit(vaccineLines.indexOf(row)),
    },
    {
      display: 'Delete',
      icon: <DeleteIcon sx={{ color: '#d32f2f' }} />,
      handleClick: (row) => handleDelete(vaccineLines.indexOf(row)),
    },
  ];

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
              onAddToLine: handleAddToLine,
              initialData: currentForm.data
            })}
          </Box>
        )}

        {!currentForm && vaccineLines.length === 0 && (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: 'calc(100vh - 250px)', 
            flexGrow: 1 
          }}>
            <VaccinesIcon sx={{ fontSize: 60, color: '#1976D2', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#666' }}>
              Select a Vaccine to show data
            </Typography>
          </Box>
        )}

        {vaccineLines.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <VaxTable
              columns={columns}
              data={vaccineLines}
              tableHeader={''}
              actionMenuItems={actionMenuItems}
              headerStyles={{
                backgroundColor: '#1976D2',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem',
                py: 1,
                px: 2,
              }}
            />
          </Box>
        )}
        {vaccineLines.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
            >
              Submit
            </Button>
          </Box>
        )}
       
      </Container>
    </DashboardContent>
  );
}