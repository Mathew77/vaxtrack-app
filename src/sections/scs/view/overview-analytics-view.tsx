import Box from '@mui/material/Box';

import { _tasks, _posts, _timeline } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import WelcomeCard  from '../welcome';
// import VaccineCard  from '../statistics';
// import TransactionHistory from '../transaction-history'
import VaccineCard from '../statisticd-card';
import Filter from 'src/utils/Filter';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  return (
    <DashboardContent maxWidth="xl">
       <Filter
        showState={false}
        showLga={true}
        showWard={true}
         />

      <Box mt={3}>
        <VaccineCard />
      </Box>
      <b/>
      <br/>
      {/* <TransactionHistory /> */}
    </DashboardContent>
  );
}
