import Box from '@mui/material/Box';

import { DashboardContent } from 'src/layouts/dashboard';
import AdminStatisticsCard from '../dashboard/statistics-card';
import AdminVaccineStockTable from '../dashboard/vaccine-stock-table';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: 2 }}>
        <AdminStatisticsCard />
        <AdminVaccineStockTable />
      </Box>
    </DashboardContent>
  );
}

/*
 * OLD DASHBOARD CODE - COMMENTED OUT FOR REFERENCE
 *
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
*/