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
  Button,
  Avatar,
  useTheme, Chip,
} from '@mui/material';
import { formatCurrency } from '../../utils/helpers';

const TopSellingProductsTable = ({ products }) => {
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
            Top Selling Products
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
                }}>Product</TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  backgroundColor: theme.palette.background.paper,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}>Category</TableCell>
                <TableCell align="right" sx={{
                  fontWeight: 600,
                  backgroundColor: theme.palette.background.paper,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}>Units Sold</TableCell>
                <TableCell align="right" sx={{
                  fontWeight: 600,
                  backgroundColor: theme.palette.background.paper,
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}>Revenue</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                  <TableRow
                      key={product.id}
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
                    <TableCell sx={{ py: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                            alt={product.name}
                            src={product.image || "https://images.pexels.com/photos/4226805/pexels-photo-4226805.jpeg"}
                            sx={{
                              width: 40,
                              height: 40,
                              mr: 2,
                              border: `1px solid ${theme.palette.divider}`
                            }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {product.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                          label={product.category}
                          size="small"
                          sx={{
                            borderRadius: '6px',
                            backgroundColor: theme.palette.action.selected,
                            color: theme.palette.text.primary
                          }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 500 }}>
                      {product.sold.toLocaleString()}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      {formatCurrency(product.revenue)}
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
  );
};

export default TopSellingProductsTable;