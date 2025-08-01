import React from 'react';
import Chart from 'react-apexcharts';
import { useFetchForwardReverseLogisticsEhf } from 'src/hooks/apis/dashboards/ehf/ehf-dashboard-hook';

const ForwardReverseChart = () => {

  const { data } = useFetchForwardReverseLogisticsEhf();

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
