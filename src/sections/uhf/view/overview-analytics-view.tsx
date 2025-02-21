import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { _tasks, _posts, _timeline } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import WelcomeCard  from '../welcome';
import VaccineCard  from '../statistics';
import TransactionHistory from '../transaction-history'


// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, UHF
      </Typography>
      <VaccineCard />
      <br/>
      <WelcomeCard />
      <br/>
      <b/>
      <br/>
      <TransactionHistory />
    </DashboardContent>
  );
}
