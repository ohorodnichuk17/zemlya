import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {
   ResponsiveContainer,
   AreaChart,
   Area,
   XAxis,
   YAxis,
   Tooltip,
   CartesianGrid
} from 'recharts';

interface ForecastItem {
   dateText: string;
   temperature: number;
   humidity: number;
   rain: number;
   main: string;
   description: string;
}

interface AnalyticsChartsProps {
   forecast: ForecastItem[];
}

export const AnalyticsCharts = ({ forecast }: AnalyticsChartsProps) => {
   // Симуляція вологості ґрунту
   const getChartData = () => {
      let baselineMoisture = 60;

      return forecast.map((f, idx) => {
         const tempFactor = f.temperature > 25 ? (f.temperature - 25) * 0.8 : 0;
         const rainFactor = f.rain * 15;

         baselineMoisture = Math.max(15, Math.min(95, baselineMoisture - 1.5 - tempFactor + rainFactor));
         const zMoisture = Math.max(65, Math.min(82, 70 + (f.rain * 8) + Math.sin(idx * 0.5) * 5));

         const dateParts = f.dateText.split(' ');
         const time = dateParts[1] === '12:00' ? dateParts[0].substring(5) : dateParts[1];

         return {
            time,
            temp: f.temperature,
            humidity: f.humidity,
            moistureNoCare: Math.round(baselineMoisture),
            moistureWithCare: Math.round(zMoisture),
            rain: f.rain
         };
      });
   };

   const chartData = getChartData();

   return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
         <Box>
            <Card sx={{
               borderRadius: '12px',
               boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
               border: '1px solid rgba(0,0,0,0.06)',
               backgroundColor: '#FFFFFF'
            }}>
               <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                     Прогноз вологості ґрунту (%)
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3 }}>
                     Зелена область показує стабільність рівня вологи при розумному поливі Zemlya в порівнянні з природним висиханням.
                  </Typography>
                  <Box sx={{ width: '100%', height: 200 }}>
                     <ResponsiveContainer>
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                           <defs>
                              <linearGradient id="colorWithCare" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.3} />
                                 <stop offset="95%" stopColor="#2E7D32" stopOpacity={0.01} />
                              </linearGradient>
                              <linearGradient id="colorNoCare" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#d32f2f" stopOpacity={0.15} />
                                 <stop offset="95%" stopColor="#d32f2f" stopOpacity={0.01} />
                              </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                           <XAxis dataKey="time" stroke="rgba(0,0,0,0.4)" fontSize={10} />
                           <YAxis domain={[0, 100]} stroke="rgba(0,0,0,0.4)" fontSize={10} />
                           <Tooltip
                              contentStyle={{ backgroundColor: '#FFF', borderColor: 'rgba(0,0,0,0.06)', borderRadius: '8px' }}
                              labelStyle={{ fontWeight: 'bold' }}
                           />
                           <Area name="Автоматизований полив" type="monotone" dataKey="moistureWithCare" stroke="#2E7D32" strokeWidth={2} fillOpacity={1} fill="url(#colorWithCare)" />
                           <Area name="Без поливу" type="monotone" dataKey="moistureNoCare" stroke="#d32f2f" strokeWidth={1.5} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorNoCare)" />
                        </AreaChart>
                     </ResponsiveContainer>
                  </Box>
               </CardContent>
            </Card>
         </Box>

         <Box>
            <Card sx={{
               borderRadius: '12px',
               boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
               border: '1px solid rgba(0,0,0,0.06)',
               backgroundColor: '#FFFFFF'
            }}>
               <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                     Температура (°C) та опади (мм)
                  </Typography>
                  <Box sx={{ width: '100%', height: 200 }}>
                     <ResponsiveContainer>
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                           <defs>
                              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#ed6c02" stopOpacity={0.25} />
                                 <stop offset="95%" stopColor="#ed6c02" stopOpacity={0.01} />
                              </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                           <XAxis dataKey="time" stroke="rgba(0,0,0,0.4)" fontSize={10} />
                           <YAxis stroke="rgba(0,0,0,0.4)" fontSize={10} />
                           <Tooltip
                              contentStyle={{ backgroundColor: '#FFF', borderColor: 'rgba(0,0,0,0.06)', borderRadius: '8px' }}
                              labelStyle={{ fontWeight: 'bold' }}
                           />
                           <Area name="Температура (°C)" type="monotone" dataKey="temp" stroke="#ed6c02" strokeWidth={2} fillOpacity={1} fill="url(#colorTemp)" />
                           <Area name="Опади (мм)" type="monotone" dataKey="rain" stroke="#0284c7" strokeWidth={2} fill="transparent" />
                        </AreaChart>
                     </ResponsiveContainer>
                  </Box>
               </CardContent>
            </Card>
         </Box>
      </Box>
   );
};
