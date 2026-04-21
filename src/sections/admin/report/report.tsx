import React, { useState } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import PeriodReport from './period-reports/period-report';

const REPORTS = [
  { value: 'empty-vials-retrieved', label: 'Empty Vials Retrieved Report' },
  { value: 'syringes-by-lga', label: 'Syringes Received Report' },
  { value: 'empty-vials-by-lga', label: 'Empty Vials Report' },
  { value: 'zero-stock-percentage', label: 'Zero Stock Percentage Report' },
  { value: 'vaccine-antigen-by-lga', label: 'Vaccine Antigen Quantity Report' },
  { value: 'vaccine-antigen-received', label: 'Vaccine Antigen Quantity Received Report' },
  { value: 'safety-boxes-retrieved', label: 'Safety Boxes Retrieved Report' },
  { value: 'non-functional-ehf', label: 'Non-Functional EHF During Delivery Report' },
  { value: 'functional-ehf-vaccine-received', label: 'Functional EHF Vaccine Received Report' },
  { value: 'delivery-completed', label: 'Total Vaccine Delivery Completed Report' },
  { value: 'vaccine-deficit', label: 'Total Vaccine Deficit Report' },
];

const ReportsSections: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<string>('empty-vials-retrieved');

  return (
    <Box sx={{ px: 2 }}>
      <FormControl sx={{ mb: 3, width: 350 }}>
        <InputLabel id="report-select-label">Select Report</InputLabel>
        <Select
          labelId="report-select-label"
          value={selectedReport}
          label="Select Report"
          onChange={(e) => setSelectedReport(e.target.value)}
        >
          {REPORTS.map((r) => (
            <MenuItem key={r.value} value={r.value}>
              {r.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <PeriodReport reportType={selectedReport} />
    </Box>
  );
};

export default ReportsSections;
