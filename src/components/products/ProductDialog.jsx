import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControlLabel,
  Switch,
  Grid,
  MenuItem,
  InputAdornment,
  Box,
  Typography,
  Divider,
  Chip,
  Stack,
  IconButton,
} from '@mui/material';
import categoriesData from '../../data/categoriesData';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

// Styled components for enhanced UI
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    boxShadow: theme.shadows[5],
    background: theme.palette.background.paper,
  },
}));

const SectionHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.secondary,
  fontSize: '1rem',
  letterSpacing: 0.5,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    '& fieldset': {
      borderColor: theme.palette.divider,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderWidth: 1,
    },
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: '8px 24px',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: 'none',
  '&:hover': {
    boxShadow: 'none',
  },
}));

const ProductDialog = ({ open, onClose, onSave, product }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    comparePrice: '',
    inventory: '',
    category: '',
    image: '',
    status: 'Active',
    featured: false,
    tags: [],
    // review: [] // <-- intentionally omitted for admin
  });

  const [newTag, setNewTag] = useState('');
  const [tagError, setTagError] = useState('');

  const isEditMode = Boolean(product);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        comparePrice: product.comparePrice || '',
        inventory: product.inventory || '',
        category: product.category || '',
        image: product.image || '',
        status: product.status || 'Active',
        featured: product.featured !== undefined ? product.featured : false,
        tags: product.tags || [],
        // review: product.review || [] // <-- intentionally omitted for admin
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        comparePrice: '',
        inventory: '',
        category: '',
        image: '',
        status: 'Active',
        featured: false,
        tags: [],
        // review: [] // <-- intentionally omitted for admin
      });
    }
    setNewTag('');
    setTagError('');
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleAddTag = () => {
    if (!newTag.trim()) {
      setTagError('Tag cannot be empty');
      return;
    }
    
    if (formData.tags.includes(newTag.trim())) {
      setTagError('Tag already exists');
      return;
    }
    
    if (formData.tags.length >= 10) {
      setTagError('Maximum 10 tags allowed');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, newTag.trim()]
    }));
    
    setNewTag('');
    setTagError('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = () => {
    // Find the category name
    const selectedCategory = categoriesData.categories.find(
      (cat) => cat.id === formData.category
    );
    // Remove review if present (admin can't set it)
    const { review, ...formDataWithoutReview } = formData;
    onSave({
      ...formDataWithoutReview,
      id: product?.id || `prod-${Date.now()}`,
      price: Number(formData.price),
      comparePrice: Number(formData.comparePrice) || Number(formData.price),
      inventory: Number(formData.inventory),
      categoryName: selectedCategory?.name || '',
      rating: product?.rating || 0,
      reviews: product?.reviews || 0,
      createdAt: product?.createdAt || new Date().toISOString().split('T')[0],
    });
    onClose();
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ 
        bgcolor: 'background.default', 
        borderBottom: 1, 
        borderColor: 'divider',
        py: 2,
        fontWeight: 700,
        fontSize: '1.5rem'
      }}>
        {isEditMode ? 'Edit Product' : 'Create New Product'}
      </DialogTitle>
      
      <DialogContent sx={{ py: 3, bgcolor: 'background.default' }}>
        <Grid container spacing={3}>
          {/* Basic Information Section */}
          <Grid item xs={12}>
            <SectionHeader variant="subtitle1">
              Basic Information
            </SectionHeader>
            <Divider sx={{ mt: 1 }} />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <StyledTextField
              name="name"
              label="Product Name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <StyledTextField
              select
              name="category"
              label="Category"
              value={formData.category}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            >
              {categoriesData.categories.map((category) => (
                <MenuItem key={category.id} value={category.id} sx={{ py: 1 }}>
                  {category.name}
                </MenuItem>
              ))}
            </StyledTextField>
          </Grid>
          
          <Grid item xs={12}>
            <StyledTextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              placeholder="Enter product details and specifications..."
            />
          </Grid>
          
          <Grid item xs={12}>
            <StyledTextField
              name="image"
              label="Image URL"
              value={formData.image}
              onChange={handleChange}
              fullWidth
              helperText="Enter a valid URL for the product image"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              placeholder="https://example.com/image.jpg"
            />
          </Grid>
          
          {/* Tags Section */}
          <Grid item xs={12}>
            <SectionHeader variant="subtitle1">
              Tags
            </SectionHeader>
            <Divider sx={{ mt: 1, mb: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Add descriptive tags to help customers find your product
              </Typography>
              
              {formData.tags.length > 0 && (
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {formData.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
                      deleteIcon={<CloseIcon fontSize="small" />}
                      sx={{
                        borderRadius: '6px',
                        backgroundColor: 'primary.light',
                        color: 'primary.contrastText',
                        fontWeight: 500,
                        '& .MuiChip-deleteIcon': {
                          color: 'primary.contrastText',
                          '&:hover': {
                            color: 'background.paper'
                          }
                        }
                      }}
                    />
                  ))}
                </Stack>
              )}
              
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={12} sm={8} md={9}>
                  <StyledTextField
                    fullWidth
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleKeyDown}
                    label="Add a tag"
                    variant="outlined"
                    error={Boolean(tagError)}
                    helperText={tagError}
                    InputLabelProps={{ shrink: true }}
                    placeholder="Type and press Enter to add"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleAddTag}
                            color="primary"
                            disabled={!newTag.trim()}
                            sx={{ borderRadius: '50%' }}
                          >
                            <AddIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                  <Button 
                    variant="outlined" 
                    onClick={handleAddTag}
                    disabled={!newTag.trim()}
                    fullWidth
                    startIcon={<AddIcon />}
                    sx={{ height: '56px', borderRadius: '12px' }}
                  >
                    Add Tag
                  </Button>
                </Grid>
              </Grid>
              
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Press Enter or click Add Tag to add a new tag (Max 10 tags)
              </Typography>
            </Box>
          </Grid>
          
          {/* Pricing & Inventory Section */}
          <Grid item xs={12}>
            <SectionHeader variant="subtitle1" sx={{ mt: 2 }}>
              Pricing & Inventory
            </SectionHeader>
            <Divider sx={{ mt: 1 }} />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StyledTextField
              name="price"
              label="Price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StyledTextField
              name="comparePrice"
              label="Compare at Price"
              type="number"
              value={formData.comparePrice}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              helperText="Original price before discount"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StyledTextField
              name="inventory"
              label="Inventory"
              type="number"
              value={formData.inventory}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StyledTextField
              select
              name="status"
              label="Status"
              value={formData.status}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Draft">Draft</MenuItem>
              <MenuItem value="Out of Stock">Out of Stock</MenuItem>
            </StyledTextField>
          </Grid>
          
          {/* Featured Product Section */}
          <Grid item xs={12} sx={{ mt: 1 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              bgcolor: 'action.hover',
              borderRadius: 2,
              p: 2,
              border: 1,
              borderColor: 'divider'
            }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.featured}
                    onChange={handleSwitchChange}
                    name="featured"
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body1" fontWeight={500}>
                    Mark as Featured Product
                  </Typography>
                }
                sx={{ m: 0 }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                Featured products appear in special sections
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ 
        px: 3, 
        py: 2,
        bgcolor: 'background.default',
        borderTop: 1,
        borderColor: 'divider'
      }}>
        <ActionButton 
          onClick={onClose}
          variant="outlined"
          sx={{ color: 'text.secondary' }}
        >
          Cancel
        </ActionButton>
        <ActionButton 
          onClick={handleSubmit} 
          variant="contained"
          disabled={!formData.name.trim() || !formData.price || !formData.category}
          color="primary"
        >
          {isEditMode ? 'Update Product' : 'Create Product'}
        </ActionButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default ProductDialog;