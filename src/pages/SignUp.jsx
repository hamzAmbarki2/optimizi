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
        fullName: '',
        phone: '',
        cin: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password || !formData.confirmPassword || !formData.fullName || !formData.phone || !formData.cin) {
            setError('Veuillez remplir tous les champs obligatoires');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setError('Veuillez saisir une adresse e-mail valide');
            return;
        }

        if (formData.password.length < 6) {
            setError('Le mot de passe doit comporter au moins 6 caractères');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        setLoading(true);

        try {
            await signup(
                formData.email,
                formData.password,
                formData.imageUrl,
                formData.fullName,
                formData.phone,
                formData.cin
            );
            enqueueSnackbar('Compte créé avec succès !', { variant: 'success' });
            navigate('/');
        } catch (error) {
            console.error('Sign up error:', error);
            setError(error.message || 'Échec de la création du compte');
            enqueueSnackbar(error.message || 'Échec de la création du compte', { variant: 'error' });
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
                        Créer un compte
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
                        Rejoignez-nous pour commencer avec votre tableau de bord
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
                            label="URL de l'image de profil (optionnel)"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            placeholder="https://exemple.com/image.jpg"
                            sx={{ mb: 3 }}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="fullName"
                            label="Nom complet"
                            name="fullName"
                            autoComplete="name"
                            value={formData.fullName}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="phone"
                            label="Téléphone"
                            name="phone"
                            autoComplete="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="cin"
                            label="CIN"
                            name="cin"
                            value={formData.cin}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Adresse e-mail"
                            name="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Mot de passe"
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
                            label="Confirmer le mot de passe"
                            type="password"
                            id="confirmPassword"
                            autoComplete="new-password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            disabled={loading}
                            sx={{ mb: 3 }}
                        />

                        <Divider sx={{ my: 3 }} />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} /> : null}
                        >
                            {loading ? 'Création du compte...' : 'S\'inscrire'}
                        </Button>

                        <Typography variant="body2" align="center">
                            Vous avez déjà un compte ?{' '}
                            <Link component={RouterLink} to="/signin">
                                Se connecter
                            </Link>
                        </Typography>
                    </Box>
                </Card>
            </Box>
        </Box>
    );
}