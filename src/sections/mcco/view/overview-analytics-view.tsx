import Box from '@mui/material/Box';

import { DashboardContent } from 'src/layouts/dashboard';
import MccoStatisticsCard from '../dashboard/statistics-card';
import MccoVaccineStockTable from '../dashboard/vaccine-stock-table';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: 2 }}>
        <MccoStatisticsCard />
        <MccoVaccineStockTable />
      </Box>
    </DashboardContent>
  );
}
