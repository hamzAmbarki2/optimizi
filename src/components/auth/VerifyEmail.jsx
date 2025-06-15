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
} from '@mui/material';
import { motion } from 'framer-motion';
import { CheckCircle, RefreshCw } from 'lucide-react';

export default function VerifyEmail() {
  const [code, setCode] = useState('');
  const [verified, setVerified] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setVerified(true);
  };

  const handleResend = () => {
    // Handle resend verification code
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
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
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
          Verify Your Email
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
          We've sent a verification code to your email address. Please enter it below.
        </Typography>

        {verified ? (
          <Box sx={{ textAlign: 'center' }}>
            <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
            <Typography variant="h6" gutterBottom>
              Email Verified Successfully!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Your email has been verified. You can now proceed to sign in.
            </Typography>
            <Button
              component={RouterLink}
              to="/signin"
              variant="contained"
              fullWidth
            >
              Continue to Sign In
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="code"
              label="Verification Code"
              name="code"
              autoComplete="off"
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            <Button
              component={motion.button}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!code}
            >
              Verify Email
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                startIcon={<RefreshCw size={16} />}
                onClick={handleResend}
                sx={{ textTransform: 'none' }}
              >
                Resend Code
              </Button>
            </Box>
          </Box>
        )}

        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          Wrong email?{' '}
          <Link
            component={RouterLink}
            to="/signup"
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Change Email
          </Link>
        </Typography>
      </Card>
    </Box>
  );
}