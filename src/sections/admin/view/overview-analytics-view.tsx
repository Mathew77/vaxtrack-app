import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Skeleton from '@mui/material/Skeleton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { DashboardContent } from 'src/layouts/dashboard';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import Filter from 'src/utils/Filter';
import AnalyticsAntigen from '../analytics-antigen';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import AddTaskIcon from '@mui/icons-material/AddTask';
import { useFetchAdminLogisticsStockSummary, useFetchAntigenMonthlyStock } from 'src/hooks/apis/dashboards/admin/admin-dashboard-hook';
import { useFetchStates } from 'src/hooks/apis/user/user-hooks';
import { useFetchLgas } from 'src/hooks/apis/ehf-uhf/ehf-hooks';

// ----------------------------------------------------------------------

const SkeletonLoader = () => (
  <DashboardContent maxWidth="xl">
    <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }} />
    
    <Grid container spacing={3}>
      {[1, 2, 3, 4].map((item) => (
        <Grid item xs={12} sm={6} md={3} key={item}>
          <Card sx={{ p: 3 }}>
            <Skeleton variant="rectangular" width={40} height={40} sx={{ mb: 2 }} />
            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
            <Skeleton variant="text" sx={{ fontSize: '2rem', width: '60%' }} />
          </Card>
        </Grid>
      ))}
    </Grid>

    <Grid container spacing={3} sx={{ mt: 1 }}>
      <Grid item xs={12} md={6} lg={4}>
        <Skeleton variant="rectangular" height={300} />
      </Grid>
      <Grid item xs={12} md={6} lg={8}>
        <Skeleton variant="rectangular" height={300} />
      </Grid>
    </Grid>
  </DashboardContent>
);

type NoDataMessageProps = {
  message: string;
  icon?: React.ReactNode;
  height?: string | number;
};

const NoDataMessage = ({ message, icon = '📊', height = 'auto' }: NoDataMessageProps) => (
  <Card sx={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <CardContent sx={{ textAlign: 'center' }}>
      <Typography variant="h5" color="text.secondary" gutterBottom>
        {icon}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </CardContent>
  </Card>
);

export function OverviewAnalyticsView() {
  const [selectedState, setSelectedState] = useState('');
  const [selectedLga, setSelectedLga] = useState('');

  const { data: states = [] } = useFetchStates();
  const { data: lgas = [] } = useFetchLgas(selectedState);

  const { data: dashboardData, isLoading: isDashboardLoading } = useFetchAdminLogisticsStockSummary(selectedState, selectedLga);
  const { data: monthlyStockData, isLoading: isMonthlyStockLoading } = useFetchAntigenMonthlyStock(selectedState, selectedLga);

  const isLoading = isDashboardLoading || isMonthlyStockLoading;

  const handleStateChange = (event: any) => {
    setSelectedState(event.target.value);
    setSelectedLga(''); // Reset LGA when state changes
  };

  const handleLgaChange = (event: any) => {
    setSelectedLga(event.target.value);
  };

  const displayLevel = selectedState || 'All State';

  if (isLoading) {
    return <SkeletonLoader />;
  }

  const chartSeries =
    monthlyStockData && monthlyStockData.length > 0
      ? [
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
        ]
      : [];

  return (
    <DashboardContent maxWidth="xl">
      {/* Filters */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>State</InputLabel>
              <Select value={selectedState} onChange={handleStateChange} label="State">
                <MenuItem value="">All States</MenuItem>
                {states.map((state) => (
                  <MenuItem key={state.id} value={state.name}>
                    {state.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth disabled={!selectedState}>
              <InputLabel>LGA</InputLabel>
              <Select value={selectedLga} onChange={handleLgaChange} label="LGA">
                <MenuItem value="">All LGAs</MenuItem>
                {lgas.map((lga, index) => (
                  <MenuItem key={index} value={lga.lga}>
                    {lga.lga}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
          {dashboardData ? (
            <AnalyticsWidgetSummary
              title="Percentage of EHF that have submitted LMD Orders"
              level={displayLevel}
              total={`${dashboardData.percentage_ehf_lmd_orders}%`}
              icon={<img alt="icon" src="/assets/icons/glass/lmd4.png" />}
            />
          ) : (
            <NoDataMessage message="LMD data not available" icon="📝" />
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
          {dashboardData ? (
            <AnalyticsWidgetSummary
              title="Percentage of EHF LMD Orders Serviced"
              level={displayLevel}
              total={`${dashboardData.percentage_ehf_lmd_orders_serviced}%`}
              color="secondary"
              icon={<img alt="icon" src="/assets/icons/glass/lmd.svg" />}
            />
          ) : (
            <NoDataMessage message="Serviced data not available" icon="✅" />
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
          {dashboardData ? (
            <AnalyticsWidgetSummary
              title="Percentage of UHF Forward Logistics"
              level={displayLevel}
              total={`${dashboardData.percentage_uhf_forward_logistics}%`}
              color="primary"
              icon={<AddTaskIcon />}
            />
          ) : (
            <NoDataMessage message="Forward logistics data missing" 
             />
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
          {dashboardData ? (
            <AnalyticsWidgetSummary
              title="Percentage of UHF Reverse Logistics"
              level={displayLevel}
              total={`${dashboardData.percentage_uhf_reverse_logistics}%`}
              color="warning"
              icon={<SwapHorizontalCircleIcon fontSize="large" />}
            />
          ) : (
            <NoDataMessage message="Reverse logistics data missing" icon="🔄" />
          )}
        </Grid>
      </Grid>

   
      <Grid container spacing={3} sx={{ mt: 1 }}>
 
        <Grid item xs={12} md={6} lg={4}>
          {monthlyStockData ? (
            <AnalyticsAntigen />
          ) : (
            <NoDataMessage
              message="Antigen stock data not available"
              icon="🧫"
              height="300"
            />
          )}
        </Grid>

        <Grid item xs={12} md={6} lg={8}>
          {monthlyStockData && monthlyStockData.length > 0 ? (
            <AnalyticsWebsiteVisits
              title="Vaccines Distribution"
              subheader="Monthly counts within the year"
              chart={{
                colors: ['#FF6B6B', '#4ECDC4', '#1A73E8'],
                categories: monthlyStockData.map((item) => item.month),
                series: chartSeries,
              }}
            />
          ) : (
            <NoDataMessage
              message="No monthly vaccine distribution data"
              icon="📈"
              height="300"
            />
          )}
        </Grid>
      </Grid>
    </DashboardContent>
  );
}