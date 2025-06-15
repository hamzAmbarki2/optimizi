import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    TextField,
    Button,
    Typography,
    Link,
    Avatar,
    Alert,
    CircularProgress,
    Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import { useAuth } from '../contexts/AuthContext';
import MapComponent from '../components/map/MapComponent';

export default function SignUp() {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const { enqueueSnackbar } = useSnackbar();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        imageUrl: '',
        address: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const handleAddressSelected = (address) => {
        setFormData(prev => ({ ...prev, address }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password || !formData.confirmPassword || !formData.address) {
            setError('Please fill in all required fields');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setError('Please enter a valid email address');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password should be at least 6 characters long');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            // Pass the address to the signup function
            await signup(formData.email, formData.password, formData.imageUrl, formData.address);
            enqueueSnackbar('Account created successfully!', { variant: 'success' });
            navigate('/');
        } catch (error) {
            console.error('Sign up error:', error);
            setError(error.message || 'Failed to create account');
            enqueueSnackbar(error.message || 'Failed to create account', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <Box
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card
                    component={motion.div}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    sx={{
                        p: 4,
                        width: '100%',
                        maxWidth: 600,
                        backdropFilter: 'blur(10px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        position: 'relative',
                        zIndex: 1,
                    }}
                >
                    <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
                        Create Account
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
                        Join us to get started with your dashboard
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" noValidate onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                            <Avatar
                                src={formData.imageUrl || ''}
                                sx={{ width: 100, height: 100 }}
                            />
                        </Box>
                        <TextField
                            fullWidth
                            label="Profile Image URL (optional)"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                            sx={{ mb: 3 }}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            id="confirmPassword"
                            autoComplete="new-password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            disabled={loading}
                            sx={{ mb: 3 }}
                        />

                        <Divider sx={{ my: 3 }} />
                        
                        {/* Map Component for Address Selection */}
                        <MapComponent 
                          onAddressSelected={handleAddressSelected}
                          initialAddress={formData.address}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} /> : null}
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </Button>

                        <Typography variant="body2" align="center">
                            Already have an account?{' '}
                            <Link component={RouterLink} to="/signin">
                                Sign In
                            </Link>
                        </Typography>
                    </Box>
                </Card>
            </Box>
        </Box>
    );
}