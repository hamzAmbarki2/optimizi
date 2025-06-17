import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Grid,
  Dialog,
  Chip,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  Skeleton,
  useTheme,
  Divider,
  Snackbar,
  Alert,
  DialogContentText,
  ToggleButtonGroup,
  ToggleButton,
  InputAdornment,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Category as CategoryIcon,
  Image as ImageIcon,
  Visibility as VisibilityIcon,
  GridView as GridViewIcon,
  ViewList as ViewListIcon,
  Search as SearchIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { CategoryModel, FournisseurModel } from '../services/models';
import CategoryCard from '../components/categories/CategoryCard';
import CategoryDetailsDialog from '../components/categories/CategoryDetailsDialog';

const Categories = () => {
  const theme = useTheme();
  const { currentUser } = useAuth();
  const [fournisseur, setFournisseur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ title: '', subtitle: '', imgSrc: '' });
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [imageError, setImageError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');

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
        console.error('Error fetching fournisseur:', err);
        setFournisseur(null);
        showSnackbar('Failed to load supplier data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchFournisseur();
  }, [currentUser]);

  // Fetch categories for this Fournisseur
  useEffect(() => {
    const fetchCategories = async () => {
      if (!fournisseur) return;
      setLoading(true);
      try {
        const querySnapshot = await CategoryModel.getByFournisseur(fournisseur.id);
        const categoriesData = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          createdAt: doc.data().createdAt || new Date().toISOString()
        }));
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategories([]);
        showSnackbar('Failed to load categories', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [fournisseur]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenDialog = (category = null) => {
    setEditingCategory(category);
    setFormData(
      category
        ? { title: category.title, subtitle: category.subtitle, imgSrc: category.imgSrc }
        : { title: '', subtitle: '', imgSrc: '' }
    );
    setImageError(false);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCategory(null);
    setFormData({ title: '', subtitle: '', imgSrc: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'imgSrc') setImageError(false);
  };

  const handleSaveCategory = async () => {
    if (!formData.title.trim()) {
      showSnackbar('Category title is required', 'error');
      return;
    }
    
    try {
      if (editingCategory) {
        await CategoryModel.update(editingCategory.id, {
          ...formData,
          FournisseurId: fournisseur.id, // FIX: Use correct field name
          updatedAt: new Date().toISOString(),
        });
        showSnackbar('Category updated successfully!', 'success');
      } else {
        await CategoryModel.create({
          ...formData,
          FournisseurId: fournisseur.id, // FIX: Use correct field name
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        showSnackbar('Category created successfully!', 'success');
      }
      
      // Refresh categories
      const querySnapshot = await CategoryModel.getByFournisseur(fournisseur.id);
      setCategories(querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt || new Date().toISOString()
      })));
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving category:', err);
      showSnackbar('Failed to save category', 'error');
    }
  };

  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;
    
    try {
      await CategoryModel.delete(selectedCategory.id);
      setCategories(categories.filter(c => c.id !== selectedCategory.id));
      showSnackbar('Category deleted successfully!', 'success');
    } catch (err) {
      console.error('Error deleting category:', err);
      showSnackbar('Failed to delete category', 'error');
    } finally {
      setDeleteDialogOpen(false);
      setSelectedCategory(null);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleViewDetails = (category) => {
    setSelectedCategory(category);
    setDetailsOpen(true);
  };

  // Handle view mode change
  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  // Filter categories based on search term
  const filteredCategories = useMemo(() => {
    return categories.filter(
      (category) => 
        category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.subtitle && category.subtitle.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [categories, searchTerm]);

  if (loading && !fournisseur) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (!fournisseur) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4, boxShadow: theme.shadows[10] }}>
          <CategoryIcon sx={{ fontSize: 80, color: theme.palette.text.secondary, mb: 2 }} />
          <Typography variant="h5" color="textSecondary" gutterBottom>
            Aucun profil de fournisseur trouvé
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Veuillez créer votre profil fournisseur avant de gérer les catégories.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            sx={{ borderRadius: 3, px: 4, py: 1.5 }}
            onClick={() => window.location.href = '/Fournisseurs'}
          >
            Créer un profil de fournisseur
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: theme.palette.primary.dark }}>
            Catégories
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Gérez vos catégories de produits
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
          Ajouter une catégorie
        </Button>
      </Box>
      
      <Divider sx={{ mb: 4 }} />
      
      {/* Search and View Toggle */}
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
          <Grid item xs={12} sm={8}>
            <TextField
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
          <Grid item xs={12} sm={4} sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end',
            gap: 1,
            flexWrap: 'wrap'
          }}>
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
      
      {/* Categories Count */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Chip 
          label={`${filteredCategories.length} catégorie${filteredCategories.length > 1 ? 's' : ''}`} 
          size="small" 
          color="info"
          variant="outlined"
        />
        {searchTerm && (
          <Chip 
            label={`Recherche : "${searchTerm}"`} 
            size="small"
            onDelete={() => setSearchTerm('')}
            deleteIcon={<CloseIcon fontSize="small" />}
          />
        )}
      </Box>

      {/* Categories Display */}
      {filteredCategories.length === 0 && !loading ? (
        <Paper sx={{ 
          p: 6, 
          textAlign: 'center', 
          borderRadius: 4,
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[2]
        }}>
          <CategoryIcon sx={{ fontSize: 80, color: theme.palette.text.disabled, mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Aucune catégorie trouvée
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Commencez par créer votre première catégorie de produit
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ borderRadius: 3, px: 4 }}
          >
            Créer une catégorie
          </Button>
        </Paper>
      ) : viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {loading ? (
            Array.from(new Array(6)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3 }} />
                <Box sx={{ pt: 2 }}>
                  <Skeleton width="60%" height={32} />
                  <Skeleton width="80%" height={24} />
                </Box>
              </Grid>
            ))
          ) : (
            filteredCategories.map((category) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
                <CategoryCard
                  category={{
                    id: category.id,
                    name: category.title,
                    description: category.subtitle,
                    image: category.imgSrc,
                    createdAt: category.createdAt
                  }}
                  onEdit={() => handleOpenDialog(category)}
                  onDelete={() => handleDeleteClick(category)}
                  onViewDetails={() => handleViewDetails(category)}
                />
              </Grid>
            ))
          )}
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
                  <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Image</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Titre</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Description</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow
                      key={category.id}
                      sx={{
                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                      }}
                    >
                      <TableCell>
                        <Box
                          component="img"
                          src={category.imgSrc}
                          alt={category.title}
                          sx={{ 
                            width: 60, 
                            height: 60, 
                            objectFit: 'cover', 
                            borderRadius: 1,
                            border: `1px solid ${theme.palette.divider}`
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{category.title}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {category.subtitle || 'No description'}
                        </Typography>
                      </TableCell>
         
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          <Tooltip title="View Details">
                            <IconButton size="small" onClick={() => handleViewDetails(category)}>
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => handleOpenDialog(category)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => handleDeleteClick(category)}>
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
      
      {/* Add/Edit Category Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <DialogTitle sx={{ 
          bgcolor: theme.palette.primary.main, 
          color: 'white', 
          fontWeight: 700,
          fontSize: '1.25rem'
        }}>
          {editingCategory ? 'Modifier la catégorie' : 'Créer une nouvelle catégorie'}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              {formData.imgSrc && !imageError ? (
                <Box
                  component="img"
                  src={formData.imgSrc}
                  alt="Category preview"
                  onError={handleImageError}
                  sx={{ 
                    width: 200, 
                    height: 140, 
                    objectFit: 'cover', 
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`
                  }}
                />
              ) : (
                <Box sx={{ 
                  width: 200, 
                  height: 140, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: theme.palette.grey[100],
                  borderRadius: 2,
                  border: `1px dashed ${theme.palette.divider}`
                }}>
                  <ImageIcon sx={{ fontSize: 48, color: theme.palette.text.disabled }} />
                  <Typography variant="caption" color="text.secondary">
                    Image preview
                  </Typography>
                </Box>
              )}
            </Box>
            
            <TextField
              label="Titre de la catégorie"
              name="title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              InputProps={{ sx: { borderRadius: 3 } }}
            />
            
            <TextField
              label="Description"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              InputProps={{ sx: { borderRadius: 3 } }}
            />
            
            <TextField
              label="URL de l'image"
              name="imgSrc"
              value={formData.imgSrc}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              placeholder="https://exemple.com/image.jpg"
              InputProps={{ sx: { borderRadius: 3 } }}
              helperText="Fournissez un lien direct vers l'image"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={handleCloseDialog} 
            variant="outlined"
            sx={{ borderRadius: 3, px: 3 }}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSaveCategory} 
            variant="contained"
            disabled={!formData.title.trim()}
            sx={{ borderRadius: 3, px: 4 }}
          >
            {editingCategory ? 'Mettre à jour' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer la catégorie <strong>"{selectedCategory?.title}"</strong> ?
            Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 3 }}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error"
            variant="contained"
            sx={{ borderRadius: 3 }}
            autoFocus
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ borderRadius: 2, boxShadow: theme.shadows[6] }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Category Details Dialog */}
      <CategoryDetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        category={selectedCategory}
      />
    </Box>
  );
};

export default Categories;