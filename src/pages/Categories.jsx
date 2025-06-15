import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
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
  writeBatch,
} from 'firebase/firestore';
import { CategoryModel, RestaurantModel } from '../services/models';

const Categories = () => {
  const { currentUser } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ title: '', subtitle: '', imgSrc: '' });

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

  // Fetch categories for this restaurant
  useEffect(() => {
    const fetchCategories = async () => {
      if (!restaurant) return;
      setLoading(true);
      try {
        const querySnapshot = await CategoryModel.getByRestaurant(restaurant.id);
        setCategories(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        setCategories([]);
      }
      setLoading(false);
    };
    fetchCategories();
  }, [restaurant]);

  const handleOpenDialog = (category = null) => {
    setEditingCategory(category);
    setFormData(
      category
        ? { title: category.title, subtitle: category.subtitle, imgSrc: category.imgSrc }
        : { title: '', subtitle: '', imgSrc: '' }
    );
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
  };

  const handleSaveCategory = async () => {
    if (!formData.title.trim()) return;
    if (editingCategory) {
      await CategoryModel.update(editingCategory.id, {
        ...formData,
        restaurantId: restaurant.id,
        updatedAt: new Date().toISOString(),
      });
    } else {
      await CategoryModel.create({
        ...formData,
        restaurantId: restaurant.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    handleCloseDialog();
    // Refresh categories
    const querySnapshot = await CategoryModel.getByRestaurant(restaurant.id);
    setCategories(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleDeleteCategory = async (category) => {
    if (!window.confirm('Delete this category and all its products?')) return;
    // Delete all products in this category for this restaurant
    try {
      // You can implement a deleteByCategory method in ProductModel for this
      // For now, keep the batch logic or refactor later
      const productsQuery = await import('../services/models/ProductModel');
      const ProductModel = productsQuery.ProductModel;
      const querySnapshot = await ProductModel.getByRestaurant(restaurant.id);
      const batchDeletes = querySnapshot.docs.filter(doc => doc.data().categoryId === category.id);
      for (const docSnap of batchDeletes) {
        await ProductModel.delete(docSnap.id);
      }
    } catch (err) {
      console.error('Error deleting products in category:', err);
    }
    // Delete the category itself
    await CategoryModel.delete(category.id);
    setCategories(categories.filter(c => c.id !== category.id));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!restaurant) {
    return (
      <Box>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            No categories available. Please create your restaurant first.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Categories
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Category
        </Button>
      </Box>
      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.id}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="h6">{category.title}</Typography>
              <Typography variant="body2" color="text.secondary">{category.subtitle}</Typography>
              {category.imgSrc && (
                <Box
                  component="img"
                  src={category.imgSrc}
                  alt={category.title}
                  sx={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 1, my: 1 }}
                />
              )}
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Tooltip title="Edit">
                  <IconButton onClick={() => handleOpenDialog(category)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton onClick={() => handleDeleteCategory(category)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Subtitle"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Image URL"
            name="imgSrc"
            value={formData.imgSrc}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveCategory} variant="contained" disabled={!formData.title.trim()}>
            {editingCategory ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Categories;