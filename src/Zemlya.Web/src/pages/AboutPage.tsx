import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import SpaIcon from '@mui/icons-material/Spa';
import ShieldIcon from '@mui/icons-material/Shield';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import InfoIcon from '@mui/icons-material/Info';

export const AboutPage = () => {
   return (
      <Container sx={{ py: 6, display: 'flex', flexDirection: 'column', gap: 4, flexGrow: 1, backgroundColor: '#F1F8E9' }} maxWidth="md">
         <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: '8px', mb: 1 }}>
               <SpaIcon sx={{ fontSize: '40px', color: '#2E7D32' }} />
               <Typography variant="h3" sx={{ fontWeight: 800, color: '#1B5E20', fontFamily: "'Outfit', sans-serif" }}>
                  Zemlya
               </Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#2E7D32', mb: 2 }}>
               Екологічна платформа розумного землеробства та рекультивації
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
               Проєкт розроблено в рамках хакатону <strong>Noosphere Engineering School - Future in Action</strong>.
               Наша мета — зберегти родючість української землі, мінімізувати хімічний слід та допомогти у відновленні ґрунтів після бойових дій.
            </Typography>
         </Box>

         <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
               <Typography variant="h5" sx={{ fontWeight: 800, color: '#1B5E20', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InfoIcon sx={{ color: '#FBC02D' }} /> Чому це важливо для України?
               </Typography>
               <Typography variant="body1" sx={{ lineHeight: 1.7, color: 'text.primary' }}>
                  Внаслідок повномасштабної війни мільйони гектарів українських чорноземів зазнали термічного та хімічного впливу від обстрілів.
                  Залишки боєприпасів забруднюють ґрунт важкими металами (свинцем, кадмієм, хромом) та залишками сірки й вибухових речовин.
               </Typography>
               <Typography variant="body1" sx={{ lineHeight: 1.7, color: 'text.primary' }}>
                  Платформа <strong>Zemlya</strong> поєднує метеорологічні дані в реальному часі з агрономічними алгоритмами, щоб розрахувати точні потреби в поливі та добривах. Це запобігає вимиванню зайвих хімікатів у підземні води та пропонує обґрунтовані рішення для рекультивації пошкоджених ділянок.
               </Typography>
            </CardContent>
         </Card>

         <Typography variant="h5" sx={{ fontWeight: 800, color: '#1B5E20', textAlign: 'center', mt: 2 }}>
            Основний функціонал MVP
         </Typography>

         <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
            <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.05)' }}>
               <CardContent sx={{ p: 3, display: 'flex', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#E0F7FA', color: '#00ACC1', flexShrink: 0 }}>
                     <WaterDropIcon />
                  </Box>
                  <Box>
                     <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#006064', mb: 0.5 }}>
                        Прогноз Вологості та Полив
                     </Typography>
                     <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                        Інтеграція з погодою скасовує заплановане зрошення, якщо прогнозуються дощі, економлячи водні ресурси та запобігаючи перезволоженню.
                     </Typography>
                  </Box>
               </CardContent>
            </Card>

            <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.05)' }}>
               <CardContent sx={{ p: 3, display: 'flex', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#E8F5E9', color: '#4CAF50', flexShrink: 0 }}>
                     <AgricultureIcon />
                  </Box>
                  <Box>
                     <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1B5E20', mb: 0.5 }}>
                        Контроль Хімічного Сліду
                     </Typography>
                     <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                        Алгоритм адаптує дозування N-P-K добрив залежно від типу ґрунту та фази росту культури. Запобігає опікам рослин та накопиченню нітратів.
                     </Typography>
                  </Box>
               </CardContent>
            </Card>

            <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.05)' }}>
               <CardContent sx={{ p: 3, display: 'flex', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#FFF3E0', color: '#FF9800', flexShrink: 0 }}>
                     <ShieldIcon />
                  </Box>
                  <Box>
                     <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#E65100', mb: 0.5 }}>
                        Відновлення після Обстрілів
                     </Typography>
                     <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                        Система автоматично оцінює ступінь пошкоджень та рекомендує дозування біочару чи цеоліту для адсорбції важких металів.
                     </Typography>
                  </Box>
               </CardContent>
            </Card>

            <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.05)' }}>
               <CardContent sx={{ p: 3, display: 'flex', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#EDE7F6', color: '#673AB7', flexShrink: 0 }}>
                     <SpaIcon />
                  </Box>
                  <Box>
                     <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#311B92', mb: 0.5 }}>
                        Фіторемедіація Соняшником
                     </Typography>
                     <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                        Попереджає фермерів, що соняшник на обстріляних землях накопичує свинець, тому його врожай слід пускати лише на технічні цілі (біодизель).
                     </Typography>
                  </Box>
               </CardContent>
            </Card>
         </Box>

         <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid rgba(0,0,0,0.06)', textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
               Розроблено командою проєкту <strong>Zemlya</strong> • 2026
            </Typography>
         </Box>
      </Container>
   );
};
