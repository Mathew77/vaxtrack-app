import Typography from '@mui/material/Typography';

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

      {/* <VaccineCard /> */}
      <br/>
      {/* <WelcomeCard /> */}
      <br/>
      <br/>
      <VaccineCard />
      <b/>
      <br/>
      {/* <TransactionHistory /> */}
    </DashboardContent>
  );
}
