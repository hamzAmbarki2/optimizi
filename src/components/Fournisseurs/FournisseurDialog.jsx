import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import MapComponent from '../map/MapComponent';

const FournisseurDialog = ({ open, onClose, onSave, Fournisseur }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    matriculeFiscale: '',
    image: '',
    name: '',
    address: '',
    openingHours: '',
  });

  const isEditMode = Boolean(Fournisseur);

  useEffect(() => {
    if (Fournisseur) {
      setFormData({
        matriculeFiscale: Fournisseur.matriculeFiscale || '',
        image: Fournisseur.image || '',
        name: Fournisseur.name || '',
        address: Fournisseur.address || '',
        openingHours: Fournisseur.openingHours || '',
      });
    } else {
      setFormData({
        matriculeFiscale: '',
        image: '',
        name: '',
        address: '',
        openingHours: '',
      });
    }
  }, [Fournisseur]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressSelected = (address) => {
    setFormData((prev) => ({
      ...prev,
      address,
    }));
  };

  const handleSubmit = () => {
    const now = new Date().toISOString();
    onSave({
      ...formData,
      id: Fournisseur?.id || `rest-${Date.now()}`,
      createdAt: Fournisseur?.createdAt || now,
      updatedAt: now,
      FournisseurOwner: currentUser?.uid || '',
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ elevation: 3 }}
    >
      <DialogTitle>{isEditMode ? 'Edit Fournisseur' : 'Create Your Fournisseur'}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Fournisseur Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Box>
        <Box component="form" noValidate autoComplete="off">
          <TextField
            name="matriculeFiscale"
            label="Matricule Fiscale"
            value={formData.matriculeFiscale}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 3 }}
          />
          <TextField
            name="image"
            label="Image URL"
            value={formData.image}
            onChange={handleChange}
            fullWidth
            required
            helperText="Enter a valid URL for the Fournisseur image"
            sx={{ mb: 3 }}
          />
          <TextField
            name="name"
            label="Fournisseur Name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 3 }}
          />
          <TextField
            name="openingHours"
            label="Opening Hours"
            value={formData.openingHours}
            onChange={handleChange}
            fullWidth
            required
            placeholder="e.g., 11:00 AM - 10:00 PM"
            sx={{ mb: 3 }}
          />
       

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle1" gutterBottom>
            Fournisseur Address
          </Typography>
          <MapComponent
            onAddressSelected={handleAddressSelected}
            initialAddress={formData.address}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={
            !formData.matriculeFiscale.trim() ||
            !formData.image.trim() ||
            !formData.name.trim() ||
            !formData.address.trim() ||
            !formData.openingHours.trim()
          }
        >
          {isEditMode ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FournisseurDialog;