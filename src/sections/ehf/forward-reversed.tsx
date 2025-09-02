import React from 'react';
import Chart from 'react-apexcharts';
import { useFetchForwardReverseLogisticsEhf } from 'src/hooks/apis/dashboards/ehf/ehf-dashboard-hook';
import Skeleton from '@mui/material/Skeleton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { DashboardContent } from 'src/layouts/dashboard';


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

const ForwardReverseChart = () => {

  const { data, isLoading: forwardReverseLogistic } = useFetchForwardReverseLogisticsEhf();

  const isLoading = forwardReverseLogistic;

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (!data || !data.monthly_logistics) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <p>No forward and reverse logistics data available</p>
      </div>
    );
  }

  const monthlyData = data.monthly_logistics;
  const months = Object.keys(monthlyData);

  const forwardLogisticsData = months.map(month => monthlyData[month].forward_logistics);
  const reverseLogisticsData = months.map(month => monthlyData[month].reverse_logistics);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: months,
    },
    yaxis: {
      title: {
        text: 'Logistics Count',
      },
    },
    colors: ['#1976D2', '#FF9800'], // blue and orange
    legend: {
      position: 'top',
    },
    title: {
      text: 'Forward vs Reverse Logistics',
      align: 'left',
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val.toString();
        }
      }
    }
  };

  const series = [
    {
      name: 'Forward Logistics',
      data: forwardLogisticsData,
    },
    {
      name: 'Reverse Logistics', 
      data: reverseLogisticsData,
    },
  ];

  return <Chart options={options} series={series} type="bar" height={350} />;
};

export default ForwardReverseChart;
