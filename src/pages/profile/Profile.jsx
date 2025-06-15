import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  TextField,
  Button,
  Avatar,
  Divider,
  Alert,
  Tab,
  Tabs,
  InputAdornment
} from '@mui/material';
import { motion } from 'framer-motion';
import { Save, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { updateEmail, updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase/config';
import MapComponent from '../../components/map/MapComponent';

export default function Profile() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    photoURL: '',
    imageUrlFromWeb: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.displayName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        photoURL: currentUser.photoURL || '',
        imageUrlFromWeb: '',
        address: currentUser.address || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [currentUser]);

  const handleTabChange = (e, newValue) => {
    setActiveTab(newValue);
    setSaved(false);
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleAddressSelected = (address) => {
    setFormData(prev => ({
      ...prev,
      address
    }));
    if (error) setError('');
  };

  const handleGeneralSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const newPhotoURL = formData.imageUrlFromWeb.startsWith('http') ? formData.imageUrlFromWeb : currentUser.photoURL;

      if (auth.currentUser.email !== formData.email) {
        await updateEmail(auth.currentUser, formData.email);
      }

      await updateProfile(auth.currentUser, {
        displayName: formData.name,
        photoURL: newPhotoURL,
      });

      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        await updateDoc(userRef, {
          email: formData.email,
          imageUrl: newPhotoURL,
          phone: formData.phone,
          address: formData.address,
          updatedAt: new Date().toISOString(),
        });
      } else {
        await setDoc(userRef, {
          email: formData.email,
          imageUrl: newPhotoURL,
          phone: formData.phone,
          address: formData.address,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile');
    }
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaved(false);

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('Please fill in all password fields.');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }
    if (formData.newPassword.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        formData.currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, formData.newPassword);

      setSaved(true);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update password');
    }
  };

  return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Profile Settings
        </Typography>

        <Card sx={{ mt: 4 }}>
          <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="General" />
            <Tab label="Security" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {saved && <Alert severity="success" sx={{ mb: 3 }}>Changes saved successfully!</Alert>}
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {activeTab === 0 && (
                <Box component="form" onSubmit={handleGeneralSubmit}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                    <Avatar
                        src={formData.imageUrlFromWeb || formData.photoURL || ''}
                        sx={{ width: 100, height: 100 }}
                    />
                  </Box>

                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Enter a URL to update your profile picture
                  </Typography>
                  <TextField
                      fullWidth
                      label="Image URL"
                      name="imageUrlFromWeb"
                      value={formData.imageUrlFromWeb}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                      InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                              <LinkIcon size={16} />
                            </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 3 }}
                  />

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                          fullWidth
                          label="Full Name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                          fullWidth
                          label="Email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          type="email"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                          fullWidth
                          label="Phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                      />
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 4 }} />
                  
                  {/* Map Component for Address Selection */}
                  <Typography variant="subtitle1" gutterBottom>
                    Your Address
                  </Typography>
                  <MapComponent 
                    onAddressSelected={handleAddressSelected} 
                    initialAddress={formData.address}
                  />

                  <Button
                      type="submit"
                      variant="contained"
                      startIcon={<Save size={20} />}
                      sx={{ mt: 4 }}
                  >
                    Save Changes
                  </Button>
                </Box>
            )}

            {activeTab === 1 && (
              <Box component="form" onSubmit={handleSecuritySubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      name="currentPassword"
                      type="password"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      autoComplete="current-password"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="New Password"
                      name="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save size={20} />}
                  sx={{ mt: 4 }}
                >
                  Update Password
                </Button>
              </Box>
            )}
          </Box>
        </Card>
      </Box>
  );
}