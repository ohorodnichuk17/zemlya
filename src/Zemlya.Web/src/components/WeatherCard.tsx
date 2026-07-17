import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import OpacityIcon from '@mui/icons-material/Opacity';
import UmbrellaIcon from '@mui/icons-material/Umbrella';

interface WeatherCardProps {
   temperature: number;
   humidity: number;
   rain: number;
   description: string;
}

export const WeatherCard = ({ temperature, humidity, rain, description }: WeatherCardProps) => {
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
               Погода Зараз
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
               <ThermostatIcon sx={{ fontSize: 40, color: '#f59e0b', mr: 1 }} />
               <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>
                     {Math.round(temperature)}°C
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                     {description}
                  </Typography>
               </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(0,0,0,0.06)', pt: 2 }}>
               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                     <OpacityIcon sx={{ fontSize: 16, color: '#0284c7' }} />
                     <Typography variant="body2" color="text.secondary">Вологість повітря:</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{Math.round(humidity)}%</Typography>
               </Box>

               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                     <UmbrellaIcon sx={{ fontSize: 16, color: '#38bdf8' }} />
                     <Typography variant="body2" color="text.secondary">Опади (1 год):</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{rain.toFixed(1)} мм</Typography>
               </Box>
            </Box>
         </CardContent>
      </Card>
   );
};
