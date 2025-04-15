import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { _tasks, _posts, _timeline } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import ForwardReverseChart from '../forward-reversed';
import VaccineCard from '../statistics';
import TransactionHistory from '../transaction-history';
import DashboardCards from '../statistics2';
import Filter from 'src/utils/Filter';

export function OverviewAnalyticsView() {
  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: 2 }}>
        <VaccineCard />
        <ForwardReverseChart />
        <TransactionHistory />
      </Box>
    </DashboardContent>
  );
}
