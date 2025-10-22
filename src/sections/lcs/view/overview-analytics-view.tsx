
import Box from '@mui/material/Box';
import { DashboardContent } from 'src/layouts/dashboard';

import Statistics from '../statisticd-card';
import VaccineStockTable from '../vaccine-stock-table';

export function OverviewAnalyticsView() {
  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: 2 }}>
        <Statistics />
        <VaccineStockTable />
      </Box>
    </DashboardContent>
  );
}
