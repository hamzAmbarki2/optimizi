import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Button,
  useTheme,
} from '@mui/material';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/helpers';

const RecentOrdersTable = ({ orders }) => {
  const theme = useTheme();

  return (
      <Paper
          elevation={0}
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '12px',
            boxShadow: theme.shadows[1],
            border: `1px solid ${theme.palette.divider}`,
            height: '100%',
          }}
      >
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          px: 0.5
        }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
            Recent Orders
          </Typography>
          <Button
              variant="outlined"
              color="primary"
              size="small"
              sx={{
                textTransform: 'none',
                borderRadius: '8px',
                px: 2,
                py: 0.5
              }}
          >
            View All
          </Button>
        </Box>
        <TableContainer component={Box} sx={{
          maxHeight: 360,
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.action.hover,
            borderRadius: '4px'
          }
        }}>
          <Table size="medium" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{
                  fontWeight: 600,
                  backgroundColor: theme.palette.background.paper,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}>Order ID</TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  backgroundColor: theme.palette.background.paper,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}>Customer</TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  backgroundColor: theme.palette.background.paper,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}>Date</TableCell>
                <TableCell align="right" sx={{
                  fontWeight: 600,
                  backgroundColor: theme.palette.background.paper,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}>Amount</TableCell>
                <TableCell align="center" sx={{
                  fontWeight: 600,
                  backgroundColor: theme.palette.background.paper,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                  <TableRow
                      key={order.id}
                      sx={{
                        '&:last-child td': { border: 0 },
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover,
                          transform: 'scale(1.01)',
                          boxShadow: theme.shadows[1]
                        },
                      }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>
                      #{order.id}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {order.customer}
                    </TableCell>
                    <TableCell>
                      {formatDate(order.date)}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      {formatCurrency(order.amount)}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                          label={order.status}
                          color={getStatusColor(order.status)}
                          size="small"
                          sx={{
                            minWidth: 90,
                            fontWeight: 500,
                            borderRadius: '6px',
                            textTransform: 'capitalize'
                          }}
                      />
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
  );
};

export default RecentOrdersTable;