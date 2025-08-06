import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import Filter from 'src/utils/Filter';
import AnalyticsAntigen from '../analytics-antigen';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import AddTaskIcon from '@mui/icons-material/AddTask';
import { useFetchAdminLogisticsStockSummary, useFetchAntigenMonthlyStock } from 'src/hooks/apis/dashboards/admin/admin-dashboard-hook';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {

  

  const { data: dashboardData } = useFetchAdminLogisticsStockSummary();
  const { data: monthlyStockData } = useFetchAntigenMonthlyStock();

   if (!dashboardData || !monthlyStockData) {
    return (
      <DashboardContent maxWidth="xl">
        <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
          No data available
        </Typography>
      </DashboardContent>
    );
  }

  const chartSeries = [
    {
      name: "EHF with stockout",
      data: monthlyStockData.map((item) => item.out_of_stock_count),
    },
    {
      name: "EHF with stock below minimum",
      data: monthlyStockData.map((item) => item.below_min_count),
    },
    {
      name: "EHF with stock above maximum",
      data: monthlyStockData.map((item) => item.above_max_count),
    },
  ];


  return (
    <DashboardContent maxWidth="xl">
      {/* <Filter showState={true} showLga={false} showWard={false} /> */}

      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }} />

      {/* Summary Cards Row 1 */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
          <AnalyticsWidgetSummary
            title="Percentage of EHF that have submitted LMD Orders"
            level="All State"
            total={`${dashboardData.percentage_ehf_lmd_orders}%`}
            icon={<img alt="icon" src="/assets/icons/glass/lmd4.png" />}
            
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
          <AnalyticsWidgetSummary
            title="Percentage of EHF LMD Orders Serviced"
            level="All State"
            total={`${dashboardData.percentage_ehf_lmd_orders_serviced}%`}
            color="secondary"
            icon={<img alt="icon" src="/assets/icons/glass/lmd.svg" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
          <AnalyticsWidgetSummary
            title="Percentage of UHF that have completed forward logistics"
            level="All State"
            total={`${dashboardData.percentage_uhf_forward_logistics}%`}
            color="primary"
            icon={<AddTaskIcon />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
          <AnalyticsWidgetSummary
            title="Percentage of UHF that have completed Reverse Logistics"
            level="All State"
            total={`${dashboardData.percentage_uhf_forward_logistics}%`}
            color="warning"
            icon={<SwapHorizontalCircleIcon fontSize="large" />}
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
            subheader="Monthly counts within the year"
            chart={{
              colors: ['#FF6B6B', '#4ECDC4', '#1A73E8'],
              categories: monthlyStockData.map((item) => item.month),
              series: chartSeries,
            }}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
