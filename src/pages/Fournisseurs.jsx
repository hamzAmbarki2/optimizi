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
import FournisseurCard from '../components/Fournisseurs/FournisseurCard';
import FournisseurDialog from '../components/fournisseurs/FournisseurDialog';
import { useAuth } from '../contexts/AuthContext';
import { FournisseurModel, ProductModel, CategoryModel } from '../services/models';

const Fournisseurs = () => {
  const { currentUser } = useAuth();
  const [Fournisseur, setFournisseur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentFournisseur, setCurrentFournisseur] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Fetch the user's Fournisseur from Firestore
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

  useEffect(() => {
    fetchFournisseur();
    // eslint-disable-next-line
  }, [currentUser]);

  // Handle add/edit dialog open
  const handleAddFournisseur = () => {
    setCurrentFournisseur(null);
    setOpenDialog(true);
  };

  const handleEditFournisseur = (Fournisseur) => {
    setCurrentFournisseur(Fournisseur);
    setOpenDialog(true);
  };

  // Handle Fournisseur save/update
  const handleSaveFournisseur = async (data) => {
    if (Fournisseur) {
      // Always fetch the latest Fournisseur doc by ownerId
      const querySnapshot = await FournisseurModel.getByOwner(currentUser.uid);
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
          await FournisseurModel.update(docId, updatedFields);
        }
      }
    } else {
      await FournisseurModel.create({
        ...data,
        ownerId: currentUser.uid,
        FournisseurOwner: currentUser.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    setOpenDialog(false);
    await fetchFournisseur(); // Refresh after save/update
  };

  // Open confirmation dialog instead of window.confirm
  const handleDeleteFournisseur = () => {
    setConfirmOpen(true);
  };

  // Actual delete logic
  const confirmDeleteFournisseur = async () => {
    setConfirmOpen(false);
    setDeleting(true);
    try {
      // Always fetch the latest Fournisseur doc by ownerId
      const querySnapshot = await FournisseurModel.getByOwner(currentUser.uid);
      if (querySnapshot.empty) {
        setSnackbar({ open: true, message: 'Fournisseur does not exist or was already deleted.', severity: 'warning' });
        setDeleting(false);
        return;
      }
      const FournisseurDoc = querySnapshot.docs[0];
      const FournisseurId = FournisseurDoc.id;
      // Use ProductModel and CategoryModel for related deletes
      await ProductModel.deleteByFournisseur(FournisseurId);
      await CategoryModel.deleteByFournisseur(FournisseurId);
      await FournisseurModel.delete(FournisseurId);
      setFournisseur(null);
      await fetchFournisseur();
      setSnackbar({ open: true, message: 'Fournisseur and all associated products and categories deleted successfully!', severity: 'success' });
    } catch (error) {
      console.error("Error deleting Fournisseur recursively:", error);
      setSnackbar({ open: true, message: `Failed to delete Fournisseur: ${error.message}`, severity: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          My Fournisseur
        </Typography>
        {!Fournisseur && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddFournisseur}
          >
            Create Fournisseur
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
          {Fournisseur
            ? 'Vous pouvez modifier votre Fournisseur ci-dessous.'
            : "Vous n'avez pas encore créé de Fournisseur."}
        </Typography>
      </Paper>

      {loading || deleting ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        Fournisseur && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={8} md={6} lg={5}>
              <FournisseurCard
                Fournisseur={Fournisseur}
                onEdit={handleEditFournisseur}
                onDelete={handleDeleteFournisseur}
              />
            </Grid>
          </Grid>
        )
      )}

      {/* Add/Edit Fournisseur Dialog */}
      <FournisseurDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveFournisseur}
        Fournisseur={currentFournisseur || Fournisseur}
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
            Are you sure you want to delete this Fournisseur? All products and categories will also be deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteFournisseur} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Fournisseurs;