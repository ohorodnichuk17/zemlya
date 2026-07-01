import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SproutIcon from '@mui/icons-material/Spa';
import { format } from 'date-fns';

interface GrowthStageCardProps {
   sowingDate: string;
   daysSinceSowing: number;
   growthStage: string;
}

export const GrowthStageCard = ({ sowingDate, daysSinceSowing, growthStage }: GrowthStageCardProps) => {
   const progress = Math.min(100, Math.max(0, (daysSinceSowing / 115) * 100));

   return (
      <Card sx={{
         borderRadius: '12px',
         boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
         border: '1px solid rgba(0,0,0,0.06)',
         height: '100%',
         backgroundColor: '#FFFFFF'
      }}>
         <CardContent>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', mb: 2 }}>
               Фаза Росту
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
               <SproutIcon sx={{ fontSize: 40, color: '#4CAF50', mr: 1 }} />
               <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1B5E20', fontSize: '16px' }}>
                     {growthStage}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                     День вегетації: {daysSinceSowing}
                  </Typography>
               </Box>
            </Box>

            <Box sx={{ width: '100%', mb: 2 }}>
               <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">Посів</Typography>
                  <Typography variant="caption" color="text.secondary">{Math.round(progress)}% завершено</Typography>
                  <Typography variant="caption" color="text.secondary">Збір</Typography>
               </Box>
               <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                     height: 8,
                     borderRadius: 4,
                     backgroundColor: '#E8F5E9',
                     '& .MuiLinearProgress-bar': {
                        backgroundColor: '#4CAF50'
                     }
                  }}
               />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', borderTop: '1px solid rgba(0,0,0,0.06)', pt: 2 }}>
               <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
               <Typography variant="body2" color="text.secondary">
                  Дата посіву: {format(new Date(sowingDate), 'dd/MM/yyyy')}
               </Typography>
            </Box>
         </CardContent>
      </Card>
   );
};
