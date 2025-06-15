import React from 'react';
import {Paper, Typography, Box, useTheme, Button} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const SalesChart = ({ data }) => {
  const theme = useTheme();

  const chartData = {
    labels: data.map((item) => item.month),
    datasets: [
      {
        label: 'Sales',
        data: data.map((item) => item.sales),
        borderColor: theme.palette.primary.main,
        backgroundColor: `${theme.palette.primary.main}20`,
        pointBackgroundColor: theme.palette.primary.main,
        pointBorderColor: theme.palette.background.paper,
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 3,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        boxShadow: theme.shadows[2],
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
        }
      },
      y: {
        grid: {
          color: theme.palette.divider,
          drawBorder: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
          callback: function (value) {
            return '$' + value.toLocaleString();
          },
        },
        beginAtZero: true,
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
  };

  return (
      <Paper
          elevation={0}
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            borderRadius: '12px',
            boxShadow: theme.shadows[1],
            border: `1px solid ${theme.palette.divider}`,
          }}
      >
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
        }}>
          <Typography variant="h6" component="h2" sx={{fontWeight: 700}}>
            Sales Overview
          </Typography>
          <Box sx={{display: 'flex', gap: 1}}>
            <Button
                variant="outlined"
                size="small"
                sx={{
                  textTransform: 'none',
                  borderRadius: '8px',
                  px: 2,
                  py: 0.5
                }}
            >
              Monthly
            </Button>
            <Button
                variant="text"
                size="small"
                sx={{
                  textTransform: 'none',
                  borderRadius: '8px',
                  px: 2,
                  py: 0.5
                }}
            >
              Weekly
            </Button>
          </Box>
        </Box>
        <Box sx={{flexGrow: 1, height: 300}}>
          <Line data={chartData} options={chartOptions}/>
        </Box>
      </Paper>
  );
};

export default SalesChart;