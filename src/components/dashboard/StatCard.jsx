import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { formatCurrency } from '../../utils/helpers';

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    borderRadius: '12px !important',
    color: theme.palette.common.white,
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
        transform: 'translateY(-15px)',
        boxShadow: theme.shadows[8],
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    }
}));

const StatCard = ({ title, value, icon, change, prefix = '', isMonetary = false, color = '#3f51b5' }) => {
    const isPositive = change >= 0;

    return (
        <StyledCard sx={{
            background: color,
            boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.12)',
        }}>
            <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                        <Typography
                            variant="subtitle2"
                            component="div"
                            sx={{
                                opacity: 4.9,
                                mb: 1,
                                fontWeight: 500,
                                letterSpacing: '0.5px'
                            }}
                        >
                            {title}
                        </Typography>
                        <Typography
                            variant="h3"
                            component="div"
                            sx={{
                                fontWeight: 'bold',
                                mb: 1.5,
                                fontSize: { xs: '1.75rem', sm: '2rem' }
                            }}
                        >
                            {isMonetary ? formatCurrency(value) : `${prefix}${value.toLocaleString()}`}
                        </Typography>
                        <Chip
                            icon={isPositive ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
                            label={`${isPositive ? '+' : ''}${change.toFixed(1)}%`}
                            color={isPositive ? 'success' : 'error'}
                            size="small"
                            sx={{
                                backgroundColor: isPositive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                                color: 'white',
                                fontWeight: 600,
                                backdropFilter: 'blur(4px)'
                            }}
                        />
                    </Box>
                    <Box
                        sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: '12px',
                            p: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backdropFilter: 'blur(4px)',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </StyledCard>
    );
};

export default StatCard;