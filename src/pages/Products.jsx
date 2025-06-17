import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  TextField,
  Divider ,
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
import { ProductModel, CategoryModel, FournisseurModel } from '../services/models';
import { useNavigate } from 'react-router-dom';
import FournisseurDialog from '../components/fournisseurs/FournisseurDialog'; // Assure this import is correct

const Products = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { currentUser } = useAuth();
  const [Fournisseur, setFournisseur] = useState(null);
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
    imageURL: '',
    categoryId: '',
    stockQuantity: '',
    isAvailable: true,
    tags: [],
    discount: '',
    unit: '',
    tva: 19,
    prixHTVA: '',
    prixTTC: '',
    // review: [] // <-- intentionally omitted for admin
  });
  const [openFournisseurDialog, setOpenFournisseurDialog] = React.useState(false);
  const navigate = useNavigate();

  // Fetch the user's Fournisseur
  useEffect(() => {
    const fetchFournisseur = async () => {
      if (!currentUser) return;
      setLoading(true);
      try {
        const querySnapshot = await FournisseurModel.getByOwner(currentUser.uid);
        if (!querySnapshot.empty) {
          setFournisseur({ id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() });
        } else {
          setFournisseur(null);
        }
      } catch (err) {
        setFournisseur(null);
      }
      setLoading(false);
    };
    fetchFournisseur();
  }, [currentUser]);

  // Fetch products for this Fournisseur
  useEffect(() => {
    const fetchProducts = async () => {
      if (!Fournisseur) return;
      setLoading(true);
      try {
        const querySnapshot = await ProductModel.getByFournisseur(Fournisseur.id);
        setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        setProducts([]);
      }
      setLoading(false);
    };
    fetchProducts();
  }, [Fournisseur]);

  // Fetch categories for the Fournisseur
  useEffect(() => {
    const fetchCategories = async () => {
      if (!Fournisseur) return;
      try {
        const querySnapshot = await CategoryModel.getByFournisseur(Fournisseur.id);
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
  }, [Fournisseur]);

  const handleOpenDialog = (product = null) => {
    setEditingProduct(product);
    setFormData(
      product
        ? {
            title: product.title,
            description: product.description,
            imageURL: product.imageURL,
            categoryId: product.categoryId,
            stockQuantity: product.stockQuantity,
            isAvailable: product.isAvailable,
            tags: product.tags || [],
            discount: product.discount,
            unit: product.unit,
            tva: product.tva || 19,
            prixHTVA: product.prixHTVA || '',
            prixTTC: product.prixTTC || '',
          }
        : {
            title: '',
            description: '',
            imageURL: '',
            categoryId: '',
            stockQuantity: '',
            isAvailable: true,
            tags: [],
            discount: '',
            unit: '',
            tva: 19,
            prixHTVA: '',
            prixTTC: '',
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
      imageURL: '',
      categoryId: '',
      stockQuantity: '',
      isAvailable: true,
      tags: [],
      discount: '',
      unit: '',
      tva: 19,
      prixHTVA: '',
      prixTTC: '',
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newFormData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    };

    if (name === 'prixHTVA' || name === 'tva') {
      const prixHTVA = parseFloat(name === 'prixHTVA' ? value : newFormData.prixHTVA) || 0;
      const tva = parseFloat(name === 'tva' ? value : newFormData.tva) || 0;
      newFormData.prixTTC = (prixHTVA * (1 + tva / 100)).toFixed(3);
    }
    if (name === 'prixTTC') {
      const prixTTC = parseFloat(value) || 0;
      const tva = parseFloat(newFormData.tva) || 0;
      newFormData.prixHTVA = tva !== 0 ? (prixTTC / (1 + tva / 100)).toFixed(3) : prixTTC.toFixed(3);
    }

    setFormData(newFormData);
  };

  const handleSaveProduct = async () => {
    if (!formData.title.trim() || !formData.categoryId) return;
    const prixHTVA = parseFloat(formData.prixHTVA) || 0;
    const tva = parseFloat(formData.tva) || 0;
    const prixTTC = (prixHTVA * (1 + tva / 100)).toFixed(3);

    const productData = {
      ...formData,
      prixHTVA: prixHTVA.toFixed(3),
      tva: tva,
      prixTTC: prixTTC,
      FournisseurId: Fournisseur.id,
      updatedAt: new Date().toISOString(),
      ...(editingProduct ? {} : { createdAt: new Date().toISOString() }),
    };

    // Supprime le champ price
    delete productData.price;

    if (editingProduct) {
      await ProductModel.update(editingProduct.id, productData);
    } else {
      await ProductModel.create(productData);
    }
    handleCloseDialog();
    // Refresh products
    const querySnapshot = await ProductModel.getByFournisseur(Fournisseur.id);
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

  // No Fournisseur state
  if (!Fournisseur) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
          Vous devez créer un fournisseur avant d'ajouter des produits.
        </Alert>
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" color="textSecondary" sx={{ mb: 2 }}>
            Aucun fournisseur trouvé
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenFournisseurDialog(true)}
          >
            Créer un fournisseur
          </Button>
        </Paper>
        <FournisseurDialog
          open={openFournisseurDialog}
          onClose={() => setOpenFournisseurDialog(false)}
        />
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
            Produits
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gérez les produits de votre fournisseur
          </Typography>
        </Box>
        <Button
           variant="contained"
           color="primary"
           startIcon={<AddIcon />}
           onClick={() => handleOpenDialog()}
           sx={{ 
             borderRadius: 3, 
             px: 3, 
             py: 1.5,
             boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
             '&:hover': {
               boxShadow: '0 6px 14px rgba(25, 118, 210, 0.4)',
             }
           }}
         >
           Ajouter un produit
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
              placeholder="Rechercher des produits..."
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
              <InputLabel id="category-filter-label">Catégorie</InputLabel>
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
                <MenuItem value="">Toutes les catégories</MenuItem>
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
              <InputLabel id="status-filter-label">Statut</InputLabel>
              <Select
                labelId="status-filter-label"
                id="status-filter"
                value={statusFilter}
                label="Status"
                onChange={handleStatusFilterChange}
                sx={{ borderRadius: 20 }}
              >
                <MenuItem value="">Tous les statuts</MenuItem>
                <MenuItem value="Available">Disponible</MenuItem>
                <MenuItem value="Out of Stock">Rupture</MenuItem>
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
              Réinitialiser les filtres
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
          label={`${filteredProducts.length} produit${filteredProducts.length > 1 ? 's' : ''}`} 
          size="small" 
          color="info"
          variant="outlined"
        />
        {categoryFilter && (
          <Chip 
            label={`Catégorie : ${categories.find(c => c.id === categoryFilter)?.title}`} 
            size="small"
            onDelete={() => setCategoryFilter('')}
            deleteIcon={<CloseIcon fontSize="small" />}
          />
        )}
        {statusFilter && (
          <Chip 
            label={`Statut : ${statusFilter === 'Available' ? 'Disponible' : 'Rupture'}`} 
            size="small"
            onDelete={() => setStatusFilter('')}
            deleteIcon={<CloseIcon fontSize="small" />}
          />
        )}
        {searchTerm && (
          <Chip 
            label={`Recherche : "${searchTerm}"`} 
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
              Aucun produit trouvé
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Essayez de modifier vos critères de recherche ou de filtre
            </Typography>
            <Button variant="outlined" onClick={clearFilters}>
              Réinitialiser tous les filtres
            </Button>
          </Box>
        </Paper>
      ) : viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
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
                    <TableCell>Produit</TableCell>
                    <TableCell>Catégorie</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Prix</TableCell>
                    <TableCell align="right">Stock</TableCell>
                    <TableCell align="center">Remise</TableCell>
                    <TableCell align="center">Unité</TableCell>
                    <TableCell align="center">Tags</TableCell>
                    <TableCell align="center">Disponible</TableCell>
                    <TableCell align="center">Avis</TableCell>
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
                          {Number(product.prixHTVA).toFixed(3)} DT HT
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          TVA: {product.tva}%
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" color="success.main">
                          {Number(product.prixTTC).toFixed(3)} DT TTC
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
                          label={product.isAvailable ? 'Oui' : 'Non'}
                          size="small"
                          color={product.isAvailable ? 'success' : 'error'}
                        />
                      </TableCell>
                      <TableCell align="center">
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Avis
                        </Typography>
                        {product.review && product.review.length > 0 ? (
                          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                            {product.review.length} avis
                          </Typography>
                        ) : (
                          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                            Aucun avis
                          </Typography>
                        )}
                      </Box>
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
        <DialogTitle>{editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Titre"
                name="title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
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
                label="URL de l'image"
                name="imageURL"
                value={formData.imageURL}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Catégorie</InputLabel>
                <Select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  label="Category"
                  required
                >
                  <MenuItem value="">Sélectionner une catégorie</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>{cat.title}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Quantité en stock"
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
                label="Remise"
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
                label="Unité"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Tags (séparés par des virgules)"
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
                <Typography sx={{ flex: 1 }}>Disponible à la vente</Typography>
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
            <Grid item xs={12} md={6}>
              <TextField
                label="TVA (%)"
                name="tva"
                value={formData.tva}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                helperText="Taux de TVA en Tunisie (exemple : 19)"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Prix HTVA (hors taxe)"
                name="prixHTVA"
                value={formData.prixHTVA}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                helperText="Saisissez le prix hors taxe. Le prix TTC sera calculé automatiquement."
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Prix TTC"
                name="prixTTC"
                value={formData.prixTTC}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                helperText="Le prix TTC est calculé automatiquement selon la TVA."
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2, color: 'info.main', fontSize: '0.95rem' }}>
            Le prix TTC (Toutes Taxes Comprises) est calculé selon la formule tunisienne : <br />
            <b>Prix TTC = Prix HTVA × (1 + TVA/100)</b>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSaveProduct} variant="contained" disabled={!formData.title.trim() || !formData.categoryId}>
            {editingProduct ? 'Mettre à jour' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Product Details Dialog */}
      <Dialog open={!!viewProduct} onClose={() => setViewProduct(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Détails du produit</DialogTitle>
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
                    <Typography variant="body2" color="primary.main" sx={{ fontWeight: 700 }}>
                      HTVA : {viewProduct.prixHTVA !== undefined && viewProduct.prixHTVA !== null && viewProduct.prixHTVA !== '' ? Number(viewProduct.prixHTVA).toFixed(3) : '0.000'} DT
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      TVA : {viewProduct.tva !== undefined && viewProduct.tva !== null && viewProduct.tva !== '' ? viewProduct.tva : '0'} %
                    </Typography>
                    <Typography variant="h6" color="success.main" sx={{ fontWeight: 800 }}>
                      TTC : {viewProduct.prixTTC !== undefined && viewProduct.prixTTC !== null && viewProduct.prixTTC !== '' ? Number(viewProduct.prixTTC).toFixed(3) : '0.000'} DT
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
                      Catégorie
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
                      Quantité en stock
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
                      Unité
                    </Typography>
                    <Typography variant="body2">
                      {viewProduct.unit || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Disponibilité
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
                          Disponible
                        </>
                      ) : (
                        <>
                          <UnavailableIcon fontSize="small" sx={{ mr: 1 }} />
                          Rupture
                        </>
                      )}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Avis des clients
                    </Typography>
                    {viewProduct.review && viewProduct.review.length > 0 ? (
                      <Box sx={{ mt: 0.5 }}>
                        {viewProduct.review.slice(0, 3).map((r, idx) => (
                          <Typography key={idx} variant="caption" sx={{ fontStyle: 'italic', mb: 0.5, display: 'block' }}>
                            {typeof r === 'string' ? r : r?.comment || JSON.stringify(r)}
                          </Typography>
                        ))}
                        {viewProduct.review.length > 3 && (
                          <Typography variant="caption" color="primary.main">
                            ...et {viewProduct.review.length - 3} autres avis
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                        Aucun avis pour ce produit.
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewProduct(null)}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products;