import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import TelegramIcon from '@mui/icons-material/Telegram';

interface TeamContactsProps {
   name: string;
   role: string;
   email: string;
   githubUsername: string;
   tgUsername: string;
}

export const TeamContacts = ({ name, role, email, githubUsername, tgUsername }: TeamContactsProps) => {
   return (
      <Grid container spacing={4}>
         <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1B5E20' }}>
               {name}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
               {role}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon sx={{ fontSize: 18, color: '#2E7D32' }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                     {email}
                  </Typography>
               </Box>
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GitHubIcon sx={{ fontSize: 18, color: '#2E7D32' }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                     {githubUsername}
                  </Typography>
               </Box>
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TelegramIcon sx={{ fontSize: 18, color: '#2E7D32' }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                     @{tgUsername}
                  </Typography>
               </Box>
            </Box>
         </Grid>
      </Grid>
   );
}