import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import SpaIcon from '@mui/icons-material/Spa';
import ShieldIcon from '@mui/icons-material/Shield';
import InfoIcon from '@mui/icons-material/Info';
import CodeIcon from '@mui/icons-material/Code';
import MapIcon from '@mui/icons-material/Map';
import SettingsIcon from '@mui/icons-material/Settings';
import { TeamContactsCard } from '../components/TeamContactsCard';

export const AboutPage = () => {
   return (
      <Container sx={{ py: 6, display: 'flex', flexDirection: 'column', gap: 4, flexGrow: 1, backgroundColor: '#F1F8E9' }} maxWidth="md">
         <Box sx={{ textAlign: 'center', mb: 2, mt: 1 }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: '8px', mb: 1 }}>
               <SpaIcon sx={{ fontSize: '40px', color: '#2E7D32' }} />
               <Typography variant="h3" sx={{ fontWeight: 800, color: '#1B5E20', fontFamily: "'Outfit', sans-serif" }}>
                  Zemlya
               </Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#2E7D32', mb: 2 }}>
               Екологічна платформа розумного землеробства та рекультивації
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
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
                  Платформа <strong>Zemlya</strong> поєднує метеорологічні дані в реальному часі з агрономічними алгоритмами, щоб розрахувати
                  точні потреби в поливі та добривах. Це запобігає вимиванню зайвих хімікатів у підземні води та пропонує науково обґрунтовані
                  рішення для рекультивації пошкоджених ділянок за допомогою природних сорбентів (цеоліту та біочару).
               </Typography>
            </CardContent>
         </Card>

         <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 4 }}>
               <Typography variant="h5" sx={{ fontWeight: 800, color: '#1B5E20', display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <CodeIcon sx={{ color: '#2E7D32' }} /> Технологічний стек MVP
               </Typography>

               <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                     <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1B5E20', mb: 1.5 }}>
                        Backend
                     </Typography>
                     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        <Chip label=".NET 10" color="success" variant="outlined" />
                        <Chip label="Minimal APIs" color="success" variant="outlined" />
                        <Chip label="MediatR" color="success" variant="outlined" />
                        <Chip label="Carter" color="success" variant="outlined" />
                        <Chip label="EF Core" color="success" variant="outlined" />
                        <Chip label="PostgreSQL" color="success" variant="outlined" />
                        <Chip label="Vertical Slice Architecture" color="success" variant="outlined" />
                     </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                     <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1B5E20', mb: 1.5 }}>
                        Frontend
                     </Typography>
                     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        <Chip label="React 19" color="primary" variant="outlined" />
                        <Chip label="TypeScript" color="primary" variant="outlined" />
                        <Chip label="Material UI" color="primary" variant="outlined" />
                        <Chip label="Redux Toolkit" color="primary" variant="outlined" />
                        <Chip label="React Leaflet" color="primary" variant="outlined" />
                        <Chip label="Recharts" color="primary" variant="outlined" />
                        <Chip label="Axios" color="primary" variant="outlined" />
                     </Box>
                  </Grid>
               </Grid>
            </CardContent>
         </Card>

         <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 4 }}>
               <Typography variant="h5" sx={{ fontWeight: 800, color: '#1B5E20', display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <SettingsIcon sx={{ color: '#2E7D32' }} /> Дорожня карта та плани розвитку
               </Typography>

               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                     <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#E8F5E9', color: '#2E7D32', flexShrink: 0 }}>
                        <ShieldIcon sx={{ fontSize: '20px' }} />
                     </Box>
                     <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                           Захищений Кабінет Фермера
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                           Сьогодні наш MVP демонструє відкриту архітектуру даних для наочності. Проте наш наступний крок у розвитку Zemlya — це впровадження Захищеного Кабінету Фермера. Це дозволить вирішити три ключові бізнес-задачі:
                        </Typography>
                        <Typography variant="body2" color="text.secondary" component="div" sx={{ pl: 2, borderLeft: '2px solid #2E7D32', display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1 }}>
                           <div>• <strong>Комерційна таємниця:</strong> Фермери отримають закритий контур для своїх агроділянок, доступ до яких матиме лише їхня команда.</div>
                           <div>• <strong>Рольова модель (RBAC):</strong> Власник господарства зможе надавати різні рівні доступу — наприклад, повний доступ для Головного агронома (внесення добрив, зміна планів) та доступ "тільки для читання" для інвесторів або банківських аудиторів.</div>
                           <div>• <strong>Персоналізований AI-супровід:</strong> Кабінет дозволить ШІ накопичувати історичні дані конкретного господарства, роблячи прогнози врожайності та мінімізації хімічного сліду ще точнішими з кожним роком.</div>
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', color: '#1B5E20', fontWeight: 600 }}>
                           «Ми закладаємо архітектуру з розрахунком на Multi-tenancy, щоб кожне агропідприємство працювало в ізольованому безпечному середовищі, але на єдиній хмарній платформі».
                        </Typography>
                     </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                     <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#E8F5E9', color: '#2E7D32', flexShrink: 0 }}>
                        <MapIcon sx={{ fontSize: '20px' }} />
                     </Box>

                     <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                           Гнучке управління ділянками
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                           Впровадження функцій редагування, архівування та видалення полів для підтримки актуальності карти посівів.
                        </Typography>
                     </Box>
                  </Box>
               </Box>
            </CardContent>
         </Card>

         <TeamContactsCard />

         <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
               Zemlya • 2026
            </Typography>
         </Box>
      </Container>
   );
};
