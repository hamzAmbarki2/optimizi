import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  TextField,
  FormControlLabel,
  Switch,
  Chip,
  Grid,
  MenuItem,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { formatCurrency } from '../../utils/helpers';

const MenuDialog = ({ open, onClose, restaurant, onSave }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [itemForm, setItemForm] = useState({
    name: '',
    price: '',
    category: '',
    featured: false,
  });

  useEffect(() => {
    if (restaurant && restaurant.menu) {
      setMenuItems([...restaurant.menu]);
    }
  }, [restaurant]);

  const handleAddItem = () => {
    setEditMode(true);
    setCurrentItem(null);
    setItemForm({
      name: '',
      price: '',
      category: '',
      featured: false,
    });
  };

  const handleEditItem = (item) => {
    setEditMode(true);
    setCurrentItem(item);
    setItemForm({
      name: item.name,
      price: item.price,
      category: item.category,
      featured: item.featured,
    });
  };

  const handleDeleteItem = (itemId) => {
    setMenuItems(menuItems.filter((item) => item.id !== itemId));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setItemForm({
      ...itemForm,
      [name]: name === 'price' ? parseFloat(value) || '' : value,
    });
  };

  const handleSwitchChange = (e) => {
    setItemForm({
      ...itemForm,
      featured: e.target.checked,
    });
  };

  const handleSaveItem = () => {
    if (currentItem) {
      // Update existing item
      setMenuItems(
        menuItems.map((item) =>
          item.id === currentItem.id ? { ...currentItem, ...itemForm } : item
        )
      );
    } else {
      // Add new item
      const newItem = {
        id: `item-${Date.now()}`,
        ...itemForm,
      };
      setMenuItems([...menuItems, newItem]);
    }
    setEditMode(false);
  };

  const handleSaveMenu = () => {
    onSave({ ...restaurant, menu: menuItems });
    onClose();
  };

  const categoryOptions = [
    'Appetizers', 'Main Course', 'Pizza', 'Pasta', 'Salads', 
    'Soups', 'Sandwiches', 'Beverages', 'Desserts', 'Sides',
    'Breakfast', 'Lunch', 'Dinner', 'Specials', 'Combos'
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {restaurant?.name} - Menu Management
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {!editMode ? (
          <>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1">Menu Items</Typography>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                color="primary"
                size="small"
                onClick={handleAddItem}
              >
                Add Item
              </Button>
            </Box>
            
            {menuItems.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="text.secondary">
                  No menu items have been added yet.
                </Typography>
                <Button
                  startIcon={<AddIcon />}
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={handleAddItem}
                >
                  Add Your First Menu Item
                </Button>
              </Box>
            ) : (
              <List>
                {menuItems.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <ListItem
                      sx={{
                        py: 2,
                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="subtitle2">{item.name}</Typography>
                              {item.featured && (
                                <Chip
                                  label="Featured"
                                  size="small"
                                  color="secondary"
                                  sx={{ ml: 1, height: 20 }}
                                />
                              )}
                            </Box>
                          }
                          secondary={item.category}
                        />
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 3 }}>
                          {formatCurrency(item.price)}
                        </Typography>
                        <ListItemSecondaryAction>
                          <IconButton edge="end" onClick={() => handleEditItem(item)} size="small">
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton edge="end" onClick={() => handleDeleteItem(item.id)} size="small" sx={{ ml: 1 }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </Box>
                    </ListItem>
                    {index < menuItems.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </>
        ) : (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {currentItem ? 'Edit Menu Item' : 'Add Menu Item'}
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="name"
                  label="Item Name"
                  value={itemForm.name}
                  onChange={handleFormChange}
                  fullWidth
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  name="price"
                  label="Price"
                  type="number"
                  value={itemForm.price}
                  onChange={handleFormChange}
                  fullWidth
                  required
                  inputProps={{ step: '0.01', min: '0' }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  select
                  name="category"
                  label="Category"
                  value={itemForm.category}
                  onChange={handleFormChange}
                  fullWidth
                  required
                >
                  {categoryOptions.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={itemForm.featured}
                      onChange={handleSwitchChange}
                      name="featured"
                    />
                  }
                  label="Featured Item"
                />
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button 
                onClick={() => setEditMode(false)} 
                sx={{ mr: 1 }}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleSaveItem}
                disabled={!itemForm.name || !itemForm.price || !itemForm.category}
              >
                Save Item
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
      
      {!editMode && (
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveMenu}>
            Save Menu
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default MenuDialog;