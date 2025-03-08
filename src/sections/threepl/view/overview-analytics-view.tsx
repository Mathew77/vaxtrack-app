import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { _tasks, _posts, _timeline } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import LMDOrderCard  from '../lmdorder-card';
import VaccineCard  from '../statistics';
import TransactionHistory from '../transaction-history';
import LMDOrderPaymentStatus from '../payment-approval';
import Filter from 'src/utils/Filter';


// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  return (
    <DashboardContent maxWidth="xl">
      <Filter />
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        {/* Hi, 3PL & SCS */}
      </Typography>
      {/* <VaccineCard /> */}
      <br/>
      <LMDOrderCard />
      <br/>
      <b/>
      <LMDOrderPaymentStatus />
      <br/>
      <TransactionHistory />
    </DashboardContent>
  );
}
