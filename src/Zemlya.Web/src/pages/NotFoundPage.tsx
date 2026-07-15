import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Container } from '@mui/material';
import ExploreOffIcon from '@mui/icons-material/ExploreOff';
import HomeIcon from '@mui/icons-material/Home';

export const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: '85vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #F1F8E9 0%, #DCEDC8 100%)',
                padding: 3,
                textAlign: 'center'
            }}
        >
            <Container maxWidth="sm">
                <Box
                    sx={{
                        animation: 'pulse 2s infinite ease-in-out',
                        '@keyframes pulse': {
                            '0%': { transform: 'scale(1)' },
                            '50%': { transform: 'scale(1.05)' },
                            '100%': { transform: 'scale(1)' }
                        },
                        mb: 4,
                        display: 'inline-flex',
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        backgroundColor: '#C8E6C9',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 24px rgba(46, 125, 50, 0.15)'
                    }}
                >
                    <ExploreOffIcon sx={{ fontSize: 64, color: '#2E7D32' }} />
                </Box>
                
                <Typography variant="h1" sx={{ fontWeight: 900, color: '#1B5E20', fontSize: { xs: '6rem', sm: '8rem' }, lineHeight: 1, mb: 1 }}>
                    404
                </Typography>
                
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#2E7D32', mb: 2, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                    Ой! Ділянку не знайдено
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 450, mx: 'auto', fontSize: '1.1rem' }}>
                    Здається, ви вийшли за межі нашої карти полів. Цієї сторінки не існує або її було перенесено.
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<HomeIcon />}
                    onClick={() => navigate('/')}
                    sx={{
                        backgroundColor: '#2E7D32',
                        '&:hover': {
                            backgroundColor: '#1B5E20'
                        },
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
                        fontWeight: 700,
                        textTransform: 'none',
                        boxShadow: '0 4px 12px rgba(46, 125, 50, 0.25)',
                        transition: 'transform 0.2s',
                        '&:active': { transform: 'scale(0.98)' }
                    }}
                >
                    Повернутися на головну
                </Button>
            </Container>
        </Box>
    );
};
