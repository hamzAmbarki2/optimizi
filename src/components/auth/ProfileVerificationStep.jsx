// ProfileVerificationStep.jsx
import React, { useState } from 'react';
import {
    Box,
    TextField,
    Typography,
    Grid,
    Tabs,
    Tab,
    Avatar,
    IconButton,
} from '@mui/material';
import { Camera, Link as LinkIcon } from 'lucide-react';

const ProfileVerificationStep = ({ formData, handleChange, avatar, setAvatar }) => {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
                Account Profile Verification
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
                Please verify your profile information
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Box sx={{ position: 'relative' }}>
                    <Avatar
                        sx={{ width: 100, height: 100 }}
                        src={
                            avatar instanceof File
                                ? URL.createObjectURL(avatar)
                                : typeof avatar === 'string'
                                    ? avatar
                                    : undefined
                        }
                    />
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        sx={{
                            mt: 1,
                            '& .MuiTabs-indicator': {
                                height: 0,
                            },
                        }}
                    >
                        <Tab
                            icon={<Camera size={20} />}
                            aria-label="upload"
                            sx={{ minWidth: 0, p: 1 }}
                        />
                        <Tab
                            icon={<LinkIcon size={20} />}
                            aria-label="url"
                            sx={{ minWidth: 0, p: 1 }}
                        />
                    </Tabs>
                </Box>
            </Box>

            {tabValue === 1 && (
                <TextField
                    margin="normal"
                    fullWidth
                    id="avatarUrl"
                    label="Image URL"
                    name="avatarUrl"
                    value={typeof avatar === 'string' ? avatar : ''}
                    onChange={(e) => setAvatar(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <LinkIcon size={20} style={{ marginRight: 8 }} />
                        ),
                    }}
                />
            )}

            {tabValue === 0 && (
                <input
                    type="file"
                    id="avatarUpload"
                    accept="image/*"
                    onChange={(e) => setAvatar(e.target.files[0])}
                    hidden
                />
            )}

            <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default ProfileVerificationStep;