import React from 'react';
import { Container, Box, Card, CardContent, Typography, Alert } from '@mui/material';
import { Agriculture } from '@mui/icons-material';

interface AuthCardProps {
    subtitle: string;
    error: string | null;
    children: React.ReactNode;
}

export const AuthCard: React.FC<AuthCardProps> = ({ subtitle, error, children }) => {
    return (
        <Box
            sx={{
                minHeight: '90vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
                padding: 2
            }}
        >
            <Container maxWidth="xs">
                <Card
                    sx={{
                        borderRadius: 4,
                        boxShadow: '0 8px 32px 0 rgba(27, 94, 32, 0.15)',
                        backdropFilter: 'blur(4px)',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        overflow: 'visible',
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-4px)'
                        }
                    }}
                >
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                            <Box
                                sx={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: '50%',
                                    backgroundColor: '#2E7D32',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
                                    mb: 2
                                }}
                            >
                                <Agriculture sx={{ fontSize: 32, color: '#FFF' }} />
                            </Box>
                            <Typography variant="h5" component="h1" sx={{ fontWeight: 800, color: '#1B5E20' }}>
                                Zemlya
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                                {subtitle}
                            </Typography>
                        </Box>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                                {error}
                            </Alert>
                        )}

                        {children}
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};
