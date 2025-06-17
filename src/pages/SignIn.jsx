import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    TextField,
    Button,
    Typography,
    Link,
    IconButton,
    InputAdornment,
    Divider,
    Alert,
    CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Github, Twitter } from 'lucide-react';
import { useSnackbar } from 'notistack';
import { useAuth } from '../contexts/AuthContext';

const AnimatedCircle = ({ size, initialX, initialY, duration, delay }) => {
    return (
        <motion.div
            style={{
                position: 'absolute',
                width: size,
                height: size,
                borderRadius: '50%',
                backgroundColor: 'rgba(98, 0, 238, 0.1)',
                zIndex: -1,
            }}
            initial={{
                x: initialX,
                y: initialY,
            }}
            animate={{
                x: [initialX, initialX + 100, initialX],
                y: [initialY, initialY + 50, initialY],
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
                delay: delay,
            }}
        />
    );
};

export default function SignIn() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { signin } = useAuth();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);

        try {
            await signin(formData.email, formData.password);
            enqueueSnackbar('Successfully signed in!', { variant: 'success' });
            navigate('/');
        } catch (error) {
            console.error('Sign in error:', error);
            let errorMessage = 'Failed to sign in';

            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'No account found with this email';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Incorrect password';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email address';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'This account has been disabled';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Too many failed attempts. Please try again later';
                    break;
                default:
                    errorMessage = error.message || 'Failed to sign in';
            }

            setError(errorMessage);
            enqueueSnackbar(errorMessage, { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError('');
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
            {/* Animated Circles */}
            <AnimatedCircle size={300} initialX={-150} initialY={-50} duration={8} delay={0} />
            <AnimatedCircle size={400} initialX={-200} initialY={200} duration={10} delay={0.5} />
            <AnimatedCircle size={250} initialX={window.innerWidth - 100} initialY={100} duration={7} delay={0.2} />
            <AnimatedCircle size={350} initialX={window.innerWidth - 200} initialY={300} duration={9} delay={0.7} />

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
                        maxWidth: 400,
                        backdropFilter: 'blur(10px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        position: 'relative',
                        zIndex: 1,
                    }}
                >
                    <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
Content de te revoir
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
                       Connectez-vous pour continuer vers votre tableau de bord
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" noValidate onSubmit={handleSubmit}>
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
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                            disabled={loading}
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, mb: 2 }}>
                            <Link
                                component={RouterLink}
                                to="/forgot-password"
                                variant="body2"
                                sx={{
                                    color: 'primary.main',
                                    textDecoration: 'none',
                                    '&:hover': { textDecoration: 'underline' },
                                }}
                            >
                                Forgot password?
                            </Link>
                        </Box>

                        <Button
                            type="submit"
                            component={motion.button}
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{ mb: 3, position: 'relative' }}
                        >
                            {loading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                'Sign In'
                            )}
                        </Button>

                        <Divider sx={{ my: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                                OR
                            </Typography>
                        </Divider>

                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                            <IconButton
                                component={motion.button}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                disabled={loading}
                                sx={{
                                    backgroundColor: 'grey.100',
                                    '&:hover': { backgroundColor: 'grey.200' }
                                }}
                            >
                                <Github size={20} />
                            </IconButton>
                            <IconButton
                                component={motion.button}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                disabled={loading}
                                sx={{
                                    backgroundColor: 'grey.100',
                                    '&:hover': { backgroundColor: 'grey.200' }
                                }}
                            >
                                <Twitter size={20} />
                            </IconButton>
                        </Box>

                        <Typography variant="body2" align="center">
                            Vous n'avez pas de compte ?{' '}
                            <Link
                                component={RouterLink}
                                to="/signup"
                                sx={{
                                    color: 'primary.main',
                                    textDecoration: 'none',
                                    '&:hover': { textDecoration: 'underline' },
                                }}
                            >
                                Sign Up
                            </Link>
                        </Typography>
                    </Box>
                </Card>
            </Box>
        </Box>
    );
}