import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  TextField,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  Rating,
  Paper,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  GridView as GridViewIcon,
  ViewList as ViewListIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  LocalOffer as DiscountIcon,
  Inventory as StockIcon,
  Category as CategoryIcon,
  CheckCircle as AvailableIcon,
  Cancel as UnavailableIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  
} from 'firebase/firestore';
import ProductCard from '../components/products/ProductCard';
import { formatCurrency } from '../utils/helpers';
import { useTheme, } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { ProductModel, CategoryModel, RestaurantModel } from '../services/models';

const Products = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { currentUser } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    imageURL: '',
    categoryId: '',
    stockQuantity: '',
    isAvailable: true,
    tags: [],
    discount: '',
    unit: '',
  });

  // Fetch the user's restaurant
  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!currentUser) return;
      setLoading(true);
      try {
        const querySnapshot = await RestaurantModel.getByOwner(currentUser.uid);
        if (!querySnapshot.empty) {
          setRestaurant({ id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() });
        } else {
          setRestaurant(null);
        }
      } catch (err) {
        setRestaurant(null);
      }
      setLoading(false);
    };
    fetchRestaurant();
  }, [currentUser]);

  // Fetch products for this restaurant
  useEffect(() => {
    const fetchProducts = async () => {
      if (!restaurant) return;
      setLoading(true);
      try {
        const querySnapshot = await ProductModel.getByRestaurant(restaurant.id);
        setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        setProducts([]);
      }
      setLoading(false);
    };
    fetchProducts();
  }, [restaurant]);

  // Fetch categories for the restaurant
  useEffect(() => {
    const fetchCategories = async () => {
      if (!restaurant) return;
      try {
        const querySnapshot = await CategoryModel.getByRestaurant(restaurant.id);
        const categoriesData = [];
        querySnapshot.forEach((doc) => {
          categoriesData.push({ id: doc.id, ...doc.data() });
        });
        setCategories(categoriesData);
      } catch (err) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, [restaurant]);

  const handleOpenDialog = (product = null) => {
    setEditingProduct(product);
    setFormData(
      product
        ? {
            title: product.title,
            description: product.description,
            price: product.price,
            imageURL: product.imageURL,
            categoryId: product.categoryId,
            stockQuantity: product.stockQuantity,
            isAvailable: product.isAvailable,
            tags: product.tags || [],
            discount: product.discount,
            unit: product.unit,
          }
        : {
            title: '',
            description: '',
            price: '',
            imageURL: '',
            categoryId: '',
            stockQuantity: '',
            isAvailable: true,
            tags: [],
            discount: '',
            unit: '',
          }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      imageURL: '',
      categoryId: '',
      stockQuantity: '',
      isAvailable: true,
      tags: [],
      discount: '',
      unit: '',
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSaveProduct = async () => {
    if (!formData.title.trim() || !formData.categoryId) return;
    if (editingProduct) {
      // Update
      await ProductModel.update(editingProduct.id, {
        ...formData,
        restaurantId: restaurant.id,
        updatedAt: new Date().toISOString(),
      });
    } else {
      // Add
      await ProductModel.create({
        ...formData,
        restaurantId: restaurant.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    handleCloseDialog();
    // Refresh products
    const querySnapshot = await ProductModel.getByRestaurant(restaurant.id);
    setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleDeleteProduct = async (product) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    await ProductModel.delete(product.id);
    setProducts(products.filter(p => p.id !== product.id));
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle view mode change
  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  // Handle category filter change
  const handleCategoryFilterChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // Filter products based on search term and filters
  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) => {
        const matchesSearch = 
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.tags && product.tags.some(tag => 
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          ));
        
        const matchesCategory = !categoryFilter || product.categoryId === categoryFilter;
        const matchesStatus = !statusFilter || 
          (statusFilter === 'Available' && product.isAvailable) ||
          (statusFilter === 'Out of Stock' && !product.isAvailable);
        
        return matchesSearch && matchesCategory && matchesStatus;
      }
    );
  }, [products, searchTerm, categoryFilter, statusFilter]);

  // Loading state
  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {[...Array(8)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card sx={{ height: '100%', borderRadius: 2 }}>
                <Skeleton variant="rectangular" height={180} />
                <CardContent>
                  <Skeleton variant="text" height={24} width="60%" />
                  <Skeleton variant="text" height={20} width="40%" sx={{ mb: 1 }} />
                  <Skeleton variant="text" height={40} width="100%" sx={{ mb: 1 }} />
                  <Skeleton variant="text" height={24} width="30%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  // No restaurant state
  if (!restaurant) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
          You need to create a restaurant before adding any products.
        </Alert>
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" color="textSecondary" sx={{ mb: 2 }}>
            No restaurant found
          </Typography>
          <Button variant="contained" color="primary" startIcon={<AddIcon />}>
            Create Restaurant
          </Button>
        </Paper>
      </Box>
    );
  }

  // View details handler
  const handleViewDetails = (product) => {
    setViewProduct(product);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setStatusFilter('');
  };

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box>
          <Typography variant={isMobile ? "h5" : "h4"} component="h1" sx={{ fontWeight: 800 }}>
            Products
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your restaurant's products
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ 
            minWidth: isMobile ? '100%' : 'auto',
            mt: isMobile ? 1 : 0
          }}
        >
          Add Product
        </Button>
      </Box>

      {/* Search and Filters */}
      <Paper 
        elevation={1}
        sx={{ 
          p: 2, 
          mb: 3, 
          borderRadius: 3,
          background: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={isMobile ? 12 : 5}>
            <TextField
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm('')}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 20,
                  background: theme.palette.background.default
                }
              }}
            />
          </Grid>
          <Grid item xs={6} sm={isMobile ? 6 : 2}>
            <FormControl fullWidth size="small">
              <InputLabel id="category-filter-label">Category</InputLabel>
              <Select
                labelId="category-filter-label"
                id="category-filter"
                value={categoryFilter}
                label="Category"
                onChange={handleCategoryFilterChange}
                sx={{
                  borderRadius: 20,
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center'
                  }
                }}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    <Chip 
                      label={category.title} 
                      size="small" 
                      sx={{ 
                        mr: 1,
                        backgroundColor: theme.palette.action.selected,
                      }} 
                    />
                    {category.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={isMobile ? 6 : 2}>
            <FormControl fullWidth size="small">
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                id="status-filter"
                value={statusFilter}
                label="Status"
                onChange={handleStatusFilterChange}
                sx={{ borderRadius: 20 }}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="Available">Available</MenuItem>
                <MenuItem value="Out of Stock">Out of Stock</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={isMobile ? 12 : 3} sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end',
            gap: 1,
            flexWrap: 'wrap'
          }}>
            <Button 
              variant="outlined" 
              color="inherit" 
              onClick={clearFilters}
              disabled={!searchTerm && !categoryFilter && !statusFilter}
              size="small"
              sx={{ borderRadius: 20 }}
            >
              Clear Filters
            </Button>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              aria-label="view mode"
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  borderRadius: '50% !important',
                  border: 'none'
                }
              }}
            >
              <ToggleButton value="grid" aria-label="grid view">
                <GridViewIcon />
              </ToggleButton>
              <ToggleButton value="list" aria-label="list view">
                <ViewListIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
      </Paper>

      {/* Products Count and Filter Summary */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Chip 
          label={`${filteredProducts.length} products`} 
          size="small" 
          color="info"
          variant="outlined"
        />
        {categoryFilter && (
          <Chip 
            label={`Category: ${categories.find(c => c.id === categoryFilter)?.title}`} 
            size="small"
            onDelete={() => setCategoryFilter('')}
            deleteIcon={<CloseIcon fontSize="small" />}
          />
        )}
        {statusFilter && (
          <Chip 
            label={`Status: ${statusFilter}`} 
            size="small"
            onDelete={() => setStatusFilter('')}
            deleteIcon={<CloseIcon fontSize="small" />}
          />
        )}
        {searchTerm && (
          <Chip 
            label={`Search: "${searchTerm}"`} 
            size="small"
            onDelete={() => setSearchTerm('')}
            deleteIcon={<CloseIcon fontSize="small" />}
          />
        )}
      </Box>

      {/* Products Display */}
      {filteredProducts.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Box sx={{ maxWidth: 400, margin: '0 auto' }}>
     
            <Typography variant="h6" sx={{ mb: 1 }}>
              No products found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Try adjusting your search or filter criteria
            </Typography>
            <Button variant="outlined" onClick={clearFilters}>
              Clear all filters
            </Button>
          </Box>
        </Paper>
      ) : viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              {/* Pass categories to ProductCard if needed */}
              <ProductCard
                product={product}
                onEdit={handleOpenDialog}
                onDelete={handleDeleteProduct}
                onView={setViewProduct}
                categories={categories}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Card 
          elevation={0} 
          sx={{ 
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)', 
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <TableContainer>
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Stock</TableCell>
                    <TableCell align="center">Discount</TableCell>
                    <TableCell align="center">Unit</TableCell>
                    <TableCell align="center">Tags</TableCell>
                    <TableCell align="center">Available</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow
                      key={product.id}
                      sx={{
                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            component="img"
                            src={product.imageURL}
                            alt={product.title}
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 1,
                              mr: 2,
                              objectFit: 'cover',
                            }}
                          />
                          <Typography variant="body2">{product.title}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {categories.find(c => c.id === product.categoryId)?.title || ''}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{product.description}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="bold" color="primary.main">
                          {formatCurrency(product.price)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={product.stockQuantity}
                          size="small"
                          color={product.stockQuantity > 10 ? 'success' : product.stockQuantity > 0 ? 'warning' : 'error'}
                        />
                      </TableCell>
                      <TableCell align="center">
                        {product.discount}
                      </TableCell>
                      <TableCell align="center">
                        {product.unit}
                      </TableCell>
                      <TableCell align="center">
                        {product.tags && product.tags.length > 0 ? product.tags.join(', ') : ''}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={product.isAvailable ? 'Yes' : 'No'}
                          size="small"
                          color={product.isAvailable ? 'success' : 'error'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Tooltip title="View">
                            <IconButton size="small" onClick={() => setViewProduct(product)}>
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => handleOpenDialog(product)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => handleDeleteProduct(product)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Product Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                fullWidth
                required
                type="number"
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Image URL"
                name="imageURL"
                value={formData.imageURL}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  label="Category"
                  required
                >
                  <MenuItem value="">Select Category</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>{cat.title}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Stock Quantity"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                fullWidth
                type="number"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Discount"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Tags (comma separated)"
                name="tags"
                value={formData.tags.join(', ')}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean),
                }))}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                p: 1,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                mt: 1
              }}>
                <Typography sx={{ flex: 1 }}>Available for sale</Typography>
                <Box
                  component="input"
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                  style={{ 
                    width: 20, 
                    height: 20,
                    accentColor: theme.palette.primary.main
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveProduct} variant="contained" disabled={!formData.title.trim() || !formData.categoryId}>
            {editingProduct ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Product Details Dialog */}
      <Dialog open={!!viewProduct} onClose={() => setViewProduct(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Product Details</DialogTitle>
        <DialogContent>
          {viewProduct && (
            <Box>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 3,
                flexDirection: isMobile ? 'column' : 'row',
                textAlign: isMobile ? 'center' : 'left'
              }}>
                <Box
                  component="img"
                  src={viewProduct.imageURL || '/placeholder.jpg'}
                  alt={viewProduct.title}
                  sx={{ 
                    width: isMobile ? 120 : 160, 
                    height: isMobile ? 120 : 160, 
                    borderRadius: 2, 
                    mr: isMobile ? 0 : 3,
                    mb: isMobile ? 2 : 0,
                    objectFit: 'cover',
                    border: `1px solid ${theme.palette.divider}`
                  }}
                />
                <Box>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                    {viewProduct.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {viewProduct.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="h5" color="primary" fontWeight={800}>
                      {formatCurrency(viewProduct.price)}
                    </Typography>
                    {viewProduct.discount && (
                      <Chip 
                        label={`${viewProduct.discount}% off`} 
                        size="small" 
                        color="error"
                        icon={<DiscountIcon fontSize="small" />}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Category
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                      <CategoryIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      {categories.find(c => c.id === viewProduct.categoryId)?.title || 'Uncategorized'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Stock Quantity
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                      <StockIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      {viewProduct.stockQuantity}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Unit
                    </Typography>
                    <Typography variant="body2">
                      {viewProduct.unit || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Availability
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        color: viewProduct.isAvailable ? 'success.main' : 'error.main'
                      }}
                    >
                      {viewProduct.isAvailable ? (
                        <>
                          <AvailableIcon fontSize="small" sx={{ mr: 1 }} />
                          Available
                        </>
                      ) : (
                        <>
                          <UnavailableIcon fontSize="small" sx={{ mr: 1 }} />
                          Out of Stock
                        </>
                      )}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Tags
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                      {viewProduct.tags && viewProduct.tags.length > 0 ? (
                        viewProduct.tags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            sx={{
                              borderRadius: 1,
                              backgroundColor: theme.palette.action.selected,
                            }}
                          />
                        ))
                      ) : (
                        <Typography variant="body2">No tags</Typography>
                      )}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewProduct(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products;