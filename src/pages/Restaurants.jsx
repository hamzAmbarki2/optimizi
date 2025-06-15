import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import RestaurantCard from '../components/restaurants/RestaurantCard';
import RestaurantDialog from '../components/restaurants/RestaurantDialog';
import { useAuth } from '../contexts/AuthContext';
import { RestaurantModel, ProductModel, CategoryModel } from '../services/models';

const Restaurants = () => {
  const { currentUser } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentRestaurant, setCurrentRestaurant] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Fetch the user's restaurant from Firestore
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

  useEffect(() => {
    fetchRestaurant();
    // eslint-disable-next-line
  }, [currentUser]);

  // Handle add/edit dialog open
  const handleAddRestaurant = () => {
    setCurrentRestaurant(null);
    setOpenDialog(true);
  };

  const handleEditRestaurant = (restaurant) => {
    setCurrentRestaurant(restaurant);
    setOpenDialog(true);
  };

  // Handle restaurant save/update
  const handleSaveRestaurant = async (data) => {
    if (restaurant) {
      // Always fetch the latest restaurant doc by ownerId
      const querySnapshot = await RestaurantModel.getByOwner(currentUser.uid);
      if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id;
        const currentData = querySnapshot.docs[0].data();
        const updatedFields = {};
        Object.keys(data).forEach((key) => {
          if (data[key] !== currentData[key]) {
            updatedFields[key] = data[key];
          }
        });
        updatedFields.updatedAt = new Date().toISOString();
        if (Object.keys(updatedFields).length > 0) {
          await RestaurantModel.update(docId, updatedFields);
        }
      }
    } else {
      await RestaurantModel.create({
        ...data,
        ownerId: currentUser.uid,
        restaurantOwner: currentUser.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    setOpenDialog(false);
    await fetchRestaurant(); // Refresh after save/update
  };

  // Open confirmation dialog instead of window.confirm
  const handleDeleteRestaurant = () => {
    setConfirmOpen(true);
  };

  // Actual delete logic
  const confirmDeleteRestaurant = async () => {
    setConfirmOpen(false);
    setDeleting(true);
    try {
      // Always fetch the latest restaurant doc by ownerId
      const querySnapshot = await RestaurantModel.getByOwner(currentUser.uid);
      if (querySnapshot.empty) {
        setSnackbar({ open: true, message: 'Restaurant does not exist or was already deleted.', severity: 'warning' });
        setDeleting(false);
        return;
      }
      const restaurantDoc = querySnapshot.docs[0];
      const restaurantId = restaurantDoc.id;
      // Use ProductModel and CategoryModel for related deletes
      await ProductModel.deleteByRestaurant(restaurantId);
      await CategoryModel.deleteByRestaurant(restaurantId);
      await RestaurantModel.delete(restaurantId);
      setRestaurant(null);
      await fetchRestaurant();
      setSnackbar({ open: true, message: 'Restaurant and all associated products and categories deleted successfully!', severity: 'success' });
    } catch (error) {
      console.error("Error deleting restaurant recursively:", error);
      setSnackbar({ open: true, message: `Failed to delete restaurant: ${error.message}`, severity: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          My Restaurant
        </Typography>
        {!restaurant && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddRestaurant}
          >
            Create Restaurant
          </Button>
        )}
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: 2,
        }}
      >
        <Typography>
          {restaurant
            ? 'You can edit your restaurant below.'
            : 'You have not created a restaurant yet.'}
        </Typography>
      </Paper>

      {loading || deleting ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        restaurant && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={8} md={6} lg={5}>
              <RestaurantCard
                restaurant={restaurant}
                onEdit={handleEditRestaurant}
                onDelete={handleDeleteRestaurant}
              />
            </Grid>
          </Grid>
        )
      )}

      {/* Add/Edit Restaurant Dialog */}
      <RestaurantDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveRestaurant}
        restaurant={currentRestaurant || restaurant}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this restaurant? All products and categories will also be deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteRestaurant} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Restaurants;