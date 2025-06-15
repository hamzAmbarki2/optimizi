import React from 'react';
import { Grid, Box, Typography, useTheme } from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  AttachMoney as AttachMoneyIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon,
} from '@mui/icons-material';

import StatCard from '../components/dashboard/StatCard';
import SalesChart from '../components/dashboard/SalesChart';
import CategoryDistribution from '../components/dashboard/CategoryDistribution';
import RecentOrdersTable from '../components/dashboard/RecentOrdersTable';
import TopSellingProductsTable from '../components/dashboard/TopSellingProductsTable';
import dashboardData from '../data/dashboardData';

const Dashboard = () => {
  const theme = useTheme();
  const { metrics, salesData, categoryDistribution, recentOrders, topSellingProducts } = dashboardData;

  return (
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              mb: 4,
              color: theme.palette.text.primary,
              fontSize: { xs: '1.75rem', sm: '2rem' }
            }}
        >
          Dashboard Overview
        </Typography>

        {/* Stats Row */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
                title="Total Revenue"
                value={metrics.revenue.value}
                icon={<AttachMoneyIcon sx={{ color: 'white', fontSize: '1.5rem' }} />}
                change={metrics.revenue.change}
                isMonetary={true}
                color="linear-gradient(135deg, #3f51b5, #2196f3)"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
                title="Orders"
                value={metrics.orders.value}
                icon={<ShoppingCartIcon sx={{ color: 'white', fontSize: '1.5rem' }} />}
                change={metrics.orders.change}
                color="linear-gradient(135deg, #4caf50, #8bc34a)"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
                title="Products"
                value={metrics.products.value}
                icon={<InventoryIcon sx={{ color: 'white', fontSize: '1.5rem' }} />}
                change={metrics.products.change}
                color="linear-gradient(135deg, #ff9800, #ffc107)"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
                title="Customers"
                value={metrics.customers.value}
                icon={<PeopleIcon sx={{ color: 'white', fontSize: '1.5rem' }} />}
                change={metrics.customers.change}
                color="linear-gradient(135deg, #9c27b0, #e91e63)"
            />
          </Grid>
        </Grid>

        {/* Charts Row */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} lg={8}>
            <Box sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 2,
              p: 3,
              boxShadow: theme.shadows[1],
              height: '100%'
            }}>
              <SalesChart data={salesData} />
            </Box>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Box sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 2,
              p: 3,
              boxShadow: theme.shadows[1],
              height: '100%'
            }}>
              <CategoryDistribution data={categoryDistribution} />
            </Box>
          </Grid>
        </Grid>

        {/* Tables Row */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <Box sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 2,
              p: 3,
              boxShadow: theme.shadows[1]
            }}>
              <RecentOrdersTable orders={recentOrders} />
            </Box>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Box sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 2,
              p: 3,
              boxShadow: theme.shadows[1]
            }}>
              <TopSellingProductsTable products={topSellingProducts} />
            </Box>
          </Grid>
        </Grid>
      </Box>
  );
};

export default Dashboard;