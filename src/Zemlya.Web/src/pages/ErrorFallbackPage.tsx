import React from 'react';
import { Box, Button, Typography, Container, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface ErrorFallbackPageProps {
    error?: Error;
    resetErrorBoundary?: () => void;
}

export const ErrorFallbackPage: React.FC<ErrorFallbackPageProps> = ({ error, resetErrorBoundary }) => {
    const handleReload = () => {
        if (resetErrorBoundary) {
            resetErrorBoundary();
        } else {
            window.location.reload();
        }
    };

    return (
        <Box
            sx={{
                minHeight: '85vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
                padding: 3,
                textAlign: 'center'
            }}
        >
            <Container maxWidth="sm">
                <Box
                    sx={{
                        mb: 4,
                        display: 'inline-flex',
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        backgroundColor: '#FFCC80',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 24px rgba(230, 81, 0, 0.15)'
                    }}
                >
                    <ReportProblemIcon sx={{ fontSize: 50, color: '#E65100' }} />
                </Box>

                <Typography variant="h4" sx={{ fontWeight: 800, color: '#E65100', mb: 2 }}>
                    Щось пішло не так
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 450, mx: 'auto', fontSize: '1.1rem' }}>
                    Виникла непередбачувана помилка при завантаженні застосунку. Наша команда вже працює над її усуненням.
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<RefreshIcon />}
                    onClick={handleReload}
                    sx={{
                        backgroundColor: '#E65100',
                        '&:hover': {
                            backgroundColor: '#BF360C'
                        },
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
                        fontWeight: 700,
                        textTransform: 'none',
                        boxShadow: '0 4px 12px rgba(230, 81, 0, 0.25)',
                        mb: 4
                    }}
                >
                    Спробувати знову
                </Button>

                {error && (
                    <Accordion sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid rgba(0,0,0,0.06)', '&:before': { display: 'none' } }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>Деталі помилки для розробників</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ textAlign: 'left', backgroundColor: '#FFFDF9', overflowX: 'auto' }}>
                            <Typography variant="caption" component="pre" sx={{ fontFamily: 'monospace', color: '#BF360C' }}>
                                {error.message}
                                {error.stack && `\n\n${error.stack}`}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                )}
            </Container>
        </Box>
    );
};
