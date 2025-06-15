import React from 'react';
import { Paper, Typography, Box, Button, useTheme } from '@mui/material';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryDistribution = ({ data }) => {
  const theme = useTheme();

  const chartColors = [
    theme.palette.primary.main,
    theme.palette.warning.main,
    theme.palette.success.main,
    theme.palette.error.main,
    theme.palette.secondary.main,
  ];

  const chartData = {
    labels: data.map((item) => item.category),
    datasets: [
      {
        data: data.map((item) => item.percentage),
        backgroundColor: chartColors,
        borderColor: theme.palette.background.paper,
        borderWidth: 2,
        hoverOffset: 15,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 16,
          font: {
            family: theme.typography.fontFamily,
            size: 12,
          },
          color: theme.palette.text.primary,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
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
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ${value}%`;
          },
        },
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true,
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
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
            Category Distribution
          </Typography>

        </Box>
        <Box sx={{
          flexGrow: 1,
          height: 300,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Box sx={{
            position: 'absolute',
            textAlign: 'center',
            pointerEvents: 'none'
          }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {data.reduce((sum, item) => sum + item.percentage, 0)}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total
            </Typography>
          </Box>
          <Doughnut data={chartData} options={chartOptions} />
        </Box>
      </Paper>
  );
};

export default CategoryDistribution;