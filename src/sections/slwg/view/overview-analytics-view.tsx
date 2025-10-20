import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { _tasks, _posts, _timeline } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import CCE2 from '../vvm';
import cce from '../cce';
import TransactionHistory from '../transaction-history';
import Statistics from '../statisticd-card';
import Filter from 'src/utils/Filter';
import VaccineStockTable from '../vaccine-stock-table';

export function OverviewAnalyticsView() {
  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: 2 }}>
        <Statistics />
        <VaccineStockTable />
        <CCE2 />
        {/* <TransactionHistory /> */}
      </Box>
    </DashboardContent>
  );
}
