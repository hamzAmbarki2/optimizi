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
            setError('Veuillez saisir votre adresse e-mail');
            setLoading(false);
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            setEmailSent(true);
            setMessage('Consultez votre boîte mail pour les instructions de réinitialisation');
        } catch (error) {
            console.error('Erreur lors de la réinitialisation :', error);
            setError(getErrorMessage(error.code));
        } finally {
            setLoading(false);
        }
    };

    const getErrorMessage = (errorCode) => {
        switch (errorCode) {
            case 'auth/user-not-found':
                return 'Aucun compte trouvé avec cette adresse e-mail.';
            case 'auth/invalid-email':
                return 'Adresse e-mail invalide.';
            case 'auth/too-many-requests':
                return 'Trop de tentatives. Veuillez réessayer plus tard.';
            case 'auth/network-request-failed':
                return 'Erreur réseau. Vérifiez votre connexion.';
            default:
                return 'Une erreur est survenue. Veuillez réessayer.';
        }
    };

    const handleResendEmail = async () => {
        setError('');
        setLoading(true);

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage("L'e-mail de réinitialisation a été renvoyé");
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
                            Réinitialiser le mot de passe
                        </Typography>
                    </Box>

                    {!emailSent ? (
                        <>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                                Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.
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
                                    label="Adresse e-mail"
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
                                            Envoi en cours...
                                        </>
                                    ) : (
                                        'Envoyer le lien de réinitialisation'
                                    )}
                                </Button>

                                <Typography variant="body2" align="center">
                                    Vous vous souvenez de votre mot de passe ?{' '}
                                    <Link
                                        component={RouterLink}
                                        to="/signin"
                                        sx={{
                                            color: 'primary.main',
                                            textDecoration: 'none',
                                            '&:hover': { textDecoration: 'underline' },
                                        }}
                                    >
                                        Se connecter
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
                                Vérifiez votre boîte mail
                            </Typography>

                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Nous avons envoyé un lien de réinitialisation à <strong>{email}</strong>
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
                                        Nouvel envoi...
                                    </>
                                ) : (
                                    "Renvoyer l’e-mail"
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
                                    Retour à la connexion
                                </Link>
                            </Typography>
                        </Box>
                    )}
                </Card>
            </Box>
        </Box>
    );
}
