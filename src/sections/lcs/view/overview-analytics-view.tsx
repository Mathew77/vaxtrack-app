
import Box from '@mui/material/Box';
import { DashboardContent } from 'src/layouts/dashboard';

import WelcomeCard from '../welcome';
import VaccineCard from '../statistics';
import TransactionHistory from '../transaction-history';
import DashboardCards from '../statistics2';
import Filter from 'src/utils/Filter';

export function OverviewAnalyticsView() {
  return (
    <DashboardContent maxWidth="xl">
      <Filter showState={false} showLga={false} showWard={true} />

      <Box mt={3}>
        <VaccineCard />
      </Box>
      <Box mt={3}>
        <WelcomeCard />
      </Box>

      <Box mt={3}>
        <DashboardCards />
      </Box>

      <Box mt={3}>
        <TransactionHistory />
      </Box>
    </DashboardContent>
  );
}
