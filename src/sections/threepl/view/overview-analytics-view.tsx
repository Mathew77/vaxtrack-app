import Box from '@mui/material/Box';

import { DashboardContent } from 'src/layouts/dashboard';
import ThreePlStatisticsCard from '../dashboard/statistics-card';
import ThreePlVaccineStockTable from '../dashboard/vaccine-stock-table';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: 2 }}>
        <ThreePlStatisticsCard />
        <ThreePlVaccineStockTable />
      </Box>
    </DashboardContent>
  );
}
