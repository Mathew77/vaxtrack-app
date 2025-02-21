import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { Typography, Box } from '@mui/material';

// Define the data type
type VaccineTransaction = {
  name: string;
  deliveredBy: string;
  date: string;
  status: string;
};

// Sample data
const data: VaccineTransaction[] = [
  { name: 'BCG Vaccine', deliveredBy: 'Mathew', date: '02-20-2025', status: 'Successful' },
  { name: 'Measles Vaccine', deliveredBy: 'Oyindamola', date: '02-20-2025', status: 'Successful' },
  { name: 'YF Vaccine', deliveredBy: 'Mr Samson', date: '02-20-2025', status: 'Successful' },
  { name: 'MenA Vaccine', deliveredBy: 'Precious', date: '02-20-2025', status: 'Successful' },
  { name: 'Rota Vaccine', deliveredBy: 'Mathew', date: '02-20-2025', status: 'Successful' },
];

const TransactionHistory = () => {
  // Memoize table columns
  const columns = useMemo<MRT_ColumnDef<VaccineTransaction>[]>(
    () => [
      { accessorKey: 'name', header: 'Vaccine Name', size: 200 },
      { accessorKey: 'deliveredBy', header: 'Delivered By', size: 150 },
      { accessorKey: 'date', header: 'Date', size: 150 },
      { accessorKey: 'status', header: 'Status', size: 150 },
    ],
    [],
  );

  // Initialize the table
  const table = useMaterialReactTable({
    columns,
    data,
  });

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
        Transaction History
      </Typography>
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default TransactionHistory;
