import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Card,
    TextField,
    Button,
    Typography,
    Link,
    Alert,
    CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase/config.js';

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

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        if (!email) {
            setError('Please enter your email address');
            setLoading(false);
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            setEmailSent(true);
            setMessage('Check your email for password reset instructions');
        } catch (error) {
            console.error('Password reset error:', error);
            setError(getErrorMessage(error.code));
        } finally {
            setLoading(false);
        }
    };

    const getErrorMessage = (errorCode) => {
        switch (errorCode) {
            case 'auth/user-not-found':
                return 'No account found with this email address.';
            case 'auth/invalid-email':
                return 'Invalid email address.';
            case 'auth/too-many-requests':
                return 'Too many requests. Please try again later.';
            case 'auth/network-request-failed':
                return 'Network error. Please check your connection.';
            default:
                return 'An error occurred. Please try again.';
        }
    };

    const handleResendEmail = async () => {
        setError('');
        setLoading(true);

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset email sent again');
        } catch (error) {
            setError(getErrorMessage(error.code));
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
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Link
                            component={RouterLink}
                            to="/signin"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                color: 'primary.main',
                                textDecoration: 'none',
                                '&:hover': { textDecoration: 'underline' },
                                mr: 2
                            }}
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <Typography variant="h4" component="h1" fontWeight="bold">
                            Reset Password
                        </Typography>
                    </Box>

                    {!emailSent ? (
                        <>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                                Enter your email address and we'll send you a link to reset your password.
                            </Typography>

                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            {message && (
                                <Alert severity="success" sx={{ mb: 2 }}>
                                    {message}
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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                    sx={{ mb: 3 }}
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={loading}
                                    component={motion.button}
                                    whileHover={{ scale: loading ? 1 : 1.02 }}
                                    whileTap={{ scale: loading ? 1 : 0.98 }}
                                    sx={{ mb: 3 }}
                                >
                                    {loading ? (
                                        <>
                                            <CircularProgress size={20} sx={{ mr: 1 }} />
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Reset Email'
                                    )}
                                </Button>

                                <Typography variant="body2" align="center">
                                    Remember your password?{' '}
                                    <Link
                                        component={RouterLink}
                                        to="/signin"
                                        sx={{
                                            color: 'primary.main',
                                            textDecoration: 'none',
                                            '&:hover': { textDecoration: 'underline' },
                                        }}
                                    >
                                        Sign In
                                    </Link>
                                </Typography>
                            </Box>
                        </>
                    ) : (
                        <Box sx={{ textAlign: 'center' }}>
                            <Box sx={{ mb: 3 }}>
                                <Mail size={48} color="green" />
                            </Box>

                            <Typography variant="h6" gutterBottom>
                                Check Your Email
                            </Typography>

                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                We've sent a password reset link to <strong>{email}</strong>
                            </Typography>

                            {message && (
                                <Alert severity="success" sx={{ mb: 2 }}>
                                    {message}
                                </Alert>
                            )}

                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            <Button
                                variant="outlined"
                                onClick={handleResendEmail}
                                disabled={loading}
                                sx={{ mb: 2 }}
                                component={motion.button}
                                whileHover={{ scale: loading ? 1 : 1.02 }}
                                whileTap={{ scale: loading ? 1 : 0.98 }}
                            >
                                {loading ? (
                                    <>
                                        <CircularProgress size={16} sx={{ mr: 1 }} />
                                        Resending...
                                    </>
                                ) : (
                                    'Resend Email'
                                )}
                            </Button>

                            <Typography variant="body2">
                                <Link
                                    component={RouterLink}
                                    to="/signin"
                                    sx={{
                                        color: 'primary.main',
                                        textDecoration: 'none',
                                        '&:hover': { textDecoration: 'underline' },
                                    }}
                                >
                                    Back to Sign In
                                </Link>
                            </Typography>
                        </Box>
                    )}
                </Card>
            </Box>
        </Box>
    );
}