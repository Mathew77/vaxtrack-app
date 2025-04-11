import React from 'react';
import Chart from 'react-apexcharts';

const ForwardReverseChart = () => {
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
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    yaxis: {
      title: {
        text: 'Facilities (%)',
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
  };

  const series = [
    {
      name: 'Forward Logistics',
      data: [65, 70, 78, 80, 72, 68, 65, 70, 78, 80, 72, 68],
    },
    {
      name: 'Reverse Logistics',
      data: [55, 60, 65, 70, 58, 62, 65, 70, 78, 80, 72, 68],
    },
  ];

  return <Chart options={options} series={series} type="bar" height={350} />;
};

export default ForwardReverseChart;
