import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  MenuItem,
  Box,
  Typography,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const UserDialog = ({ open, onClose, onSave, user }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '', // Add password field
    imageUrl: '',
    phone: '',
    address: null,
    cin: '',
    status: 'active',
    fullName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        password: '', // Reset password on edit
        imageUrl: user.imageUrl || '',
        phone: user.phone || '',
        address: user.address || null,
        cin: user.cin || '',
        status: user.status || 'active',
        fullName: user.fullName || '',
      });
    } else {
      setFormData({
        email: '',
        password: '',
        imageUrl: '',
        phone: '',
        address: null,
        cin: '',
        status: 'active',
        fullName: '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isEditMode = Boolean(user);

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Phone is required');
      return false;
    }
    if (!formData.cin.trim()) {
      setError('CIN is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Invalid email format');
      return false;
    }
    if (!isEditMode && !formData.password.trim()) {
      setError('Password is required');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    setLoading(true);
    onSave(formData);
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{user ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Basic Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              name="fullName"
              label="Full Name *"
              value={formData.fullName}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              name="email"
              label="Email Address *"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          {!isEditMode && (
            <Grid item xs={12} md={6}>
              <TextField
                name="password"
                label="Password *"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
          )}
          
          <Grid item xs={12} md={6}>
            <TextField
              name="phone"
              label="Phone *"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              name="cin"
              label="CIN *"
              value={formData.cin}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="imageUrl"
              label="Image URL"
              value={formData.imageUrl}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              select
              name="status"
              label="Status *"
              value={formData.status}
              onChange={handleChange}
              fullWidth
              required
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="suspended">Suspended</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={!formData.fullName || !formData.email || !formData.cin || !formData.phone}
        >
          {user ? 'Mettre à jour' : 'Ajouter'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDialog;