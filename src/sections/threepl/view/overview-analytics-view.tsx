import Box from '@mui/material/Box';
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

      <Box mt={3}>
        <LMDOrderCard />
      </Box>
      <Box mt={3}>
        <LMDOrderPaymentStatus />
      </Box>
      <Box mt={3}>
        {/* <TransactionHistory /> */}
      </Box>
    </DashboardContent>
  );
}
