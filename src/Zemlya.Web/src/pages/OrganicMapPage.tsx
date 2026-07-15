import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MapIcon from '@mui/icons-material/Map';

export const OrganicMapPage = () => {
   const mapProxyUrl = `${import.meta.env.VITE_BASE_URL || ""}/map-proxy/Home/Map`;

   return (
      <Container sx={{ py: 4, display: 'flex', flexDirection: 'column', gap: 3, flexGrow: 1, backgroundColor: '#F1F8E9' }} maxWidth="lg">
         <Box sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: 1 }}>
               <MapIcon sx={{ fontSize: '36px', color: '#2E7D32' }} />
               <Typography variant="h4" sx={{ fontWeight: 800, color: '#1B5E20' }}>
                  Карта Органічного Землеробства
               </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
               Інтегрована геоінформаційна система Organic Portal
            </Typography>
         </Box>

         <Box sx={{
            width: '100%',
            height: 'calc(100vh - 220px)',
            minHeight: '550px',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.06)',
            backgroundColor: '#FFFFFF'
         }}>
            <iframe
               src={mapProxyUrl}
               title="Organic Portal Map"
               width="100%"
               height="100%"
               style={{ border: 'none' }}
               sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
         </Box>
      </Container>
   );
};
