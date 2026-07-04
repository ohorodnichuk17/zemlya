import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { TeamContacts } from './TeamContacts';

export const TeamContactsCard = () => {
   return (
      <Card
         sx={{
            borderRadius: '16px',
            boxShadow: '0 6px 24px rgba(46, 125, 50, 0.1)',
            border: '1px solid rgba(46, 125, 50, 0.2)',
            backgroundColor: '#FFFFFF',
            overflow: 'hidden'
         }}
      >
         <Box
            sx={{
               backgroundColor: '#2E7D32',
               color: '#FFFFFF',
               padding: '16px 24px'
            }}
         >
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
               Команда розробки Zemlya
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
               Будемо раді вашим відгукам, пропозиціям та партнерству!
            </Typography>
         </Box>

         <CardContent sx={{ p: 4 }}>
            <Box
               sx={{
                  display: 'flex',
                  gap: 4,
                  flexWrap: 'wrap',
               }}
            >
               <Box sx={{ flex: '1 1 320px' }}>
                  <TeamContacts
                     name="Огороднічук Юлія"
                     role="Fullstack .NET & React Developer"
                     email="ogorodnicukulia@gmail.com"
                     githubUsername="ohorodnichuk17"
                     tgUsername="yuliiaohorodnichuk"
                  />
               </Box>

               <Box sx={{ flex: '1 1 320px' }}>
                  <TeamContacts
                     name="Зубар Назарій"
                     role="Fullstack .NET & React Developer"
                     email="nzubar4@gmail.com"
                     githubUsername="zubnaz"
                     tgUsername="ten3een"
                  />
               </Box>
            </Box>
         </CardContent>
      </Card>
   );
};