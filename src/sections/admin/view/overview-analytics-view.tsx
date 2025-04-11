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
        <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
          <AnalyticsWidgetSummary
            title="Percentage of EHF that have submitted LMD Orders"
            level="All State"
            total="78%"
            icon={<img alt="icon" src="/assets/icons/glass/lmd.svg" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
          <AnalyticsWidgetSummary
            title="Percentage of EHF LMD Orders Serviced"
            level="All State"
            total="87%"
            color="secondary"
            icon={<img alt="icon" src="/assets/icons/glass/lmd4.png" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
          <AnalyticsWidgetSummary
            title="Percentage of UHF that have completed forward logistics"
            level="All State"
            total="85%"
            color="primary"
            icon={<img alt="icon" src="/assets/icons/glass/lmd5.png" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
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
              colors: ['#FF6B6B', '#4ECDC4', '#1A73E8'], // Add your custom colors here
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              series: [
                { name: 'EHF with stockout', data: [43, 33, 22, 37, 67, 68, 37, 24, 55, 55, 55, 55] },
                { name: 'EHF with stock below minimum ', data: [51, 70, 47, 67, 40, 37, 24, 70, 24, 55, 55, 55] },
                { name: 'Delivery in full and on Time', data: [51, 70, 47, 67, 40, 37, 24, 70, 24, 55, 55, 55] },
              ],
            }}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
