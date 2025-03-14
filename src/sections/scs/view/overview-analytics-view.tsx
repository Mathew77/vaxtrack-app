import Typography from '@mui/material/Typography';

import { _tasks, _posts, _timeline } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import WelcomeCard  from '../welcome';
// import VaccineCard  from '../statistics';
// import TransactionHistory from '../transaction-history'
import DashboardCards from '../statistics2';
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
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        {/* Hi, SCS */}
      </Typography>
      {/* <VaccineCard /> */}
      <br/>
      <WelcomeCard />
      <br/>
      <br/>
      <DashboardCards />
      <b/>
      <br/>
      {/* <TransactionHistory /> */}
    </DashboardContent>
  );
}
