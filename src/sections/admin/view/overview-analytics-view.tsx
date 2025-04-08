import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import Filter from 'src/utils/Filter';
import AnalyticsAntigen from '../analytics-antigen';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  return (
    <DashboardContent maxWidth="xl">
      <Filter showState={true} showLga={false} showWard={false} />

      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }} />

      {/* Summary Cards Row 1 */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Percentage of EHF that have submitted LMD Orders"
            level="All State"
            total="78%"
            icon={<img alt="icon" src="/assets/icons/glass/lmd.svg" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Percentage of EHF LMD Orders Serviced"
            level="All State"
            total="87%"
            color="secondary"
            icon={<img alt="icon" src="/assets/icons/glass/lmd4.png" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Percentage of UHF that have completed forward logistics"
            level="All State"
            total="85%"
            color="primary"
            icon={<img alt="icon" src="/assets/icons/glass/lmd5.png" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Percentage of UHF that have completed Reverse Logistics"
            level="All State"
            total="79%"
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/lmd4.png" />}
          />
        </Grid>
      </Grid>

      {/* Add spacing between rows */}


      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6} lg={4}>
          <AnalyticsAntigen />
        </Grid>

        <Grid item xs={12} md={6} lg={8}>
          <AnalyticsWebsiteVisits
            title="Vaccines Distribution"
            subheader="Monthly % within the year"
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
              series: [
                { name: 'Received', data: [43, 33, 22, 37, 67, 68, 37, 24, 55] },
                { name: 'Distributed', data: [51, 70, 47, 67, 40, 37, 24, 70, 24] },
              ],
            }}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
