import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ShieldAlertIcon from '@mui/icons-material/Warning';

interface SafetyAdvisoryAlertProps {
  shellingImpactLevel: string;
  crop: string;
}

export const SafetyAdvisoryAlert = ({ shellingImpactLevel, crop }: SafetyAdvisoryAlertProps) => {
  if (shellingImpactLevel === 'None') {
    return null;
  }

  const isHigh = shellingImpactLevel === 'High';
  const severity = isHigh ? 'error' : 'warning';
  const title = isHigh 
    ? 'КРИТИЧНА ЕКОЛОГІЧНА НЕБЕЗПЕКА (Пряме влучання боєприпасів)' 
    : shellingImpactLevel === 'Medium'
    ? 'СЕРЕДНЯ ЗАГРОЗА (Виявлено воронки на сусідніх ділянках)'
    : 'ПОМІРНА ЗАГРОЗА (Задимлення та уламки поблизу)';

  const getDescription = () => {
    if (isHigh) {
      if (crop.toLowerCase() === 'sunflower' || crop.toLowerCase() === 'соняшник') {
        return 'Увага! Поле зазнало значного воєнного впливу. Соняшник є природним гіперакумулятором важких металів (свинцю, кадмію) та азотних детонаційних токсинів. Продовольче використання врожаю суворо заборонено! Рекомендується використовувати посіви виключно для технічних цілей (наприклад, біодизель) або як сидерати для фіторемедіації. Рекомендовано терміново внести 4.0 т/га цеоліту або активованого вугілля для адсорбції.';
      }
      return 'Увага! На ділянці зафіксовані прямі влучання боєприпасів. Високий ризик забруднення ґрунту важкими металами та вибуховими речовинами (TNT, RDX). Рекомендовано внести 4.0 т/га активованого вугілля або цеоліту для зв\'язування токсинів та провести обов\'язковий хімічний аналіз ґрунту перед збором врожаю.';
    }
    return 'Увага! Наявні хімічні залишки продуктів згоряння та детонацій у верхньому шарі ґрунту. Рекомендовано внести 2.5 т/га деревного вугілля (біочару) або вапна для нейтралізації кислотності та підвищення буферності ґрунту після ударних хвиль.';
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Alert 
        severity={severity} 
        icon={<ShieldAlertIcon sx={{ fontSize: '32px' }} />}
        sx={{ 
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 4px 16px rgba(239, 68, 68, 0.08)',
          border: '1px solid',
          borderColor: isHigh ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)',
          backgroundColor: isHigh ? 'rgba(239, 68, 68, 0.05)' : 'rgba(245, 158, 11, 0.05)'
        }}
      >
        <AlertTitle sx={{ fontWeight: 800, fontSize: '15px', mb: 1 }}>{title}</AlertTitle>
        <Typography variant="body2" sx={{ lineHeight: 1.6, color: 'text.primary' }}>
          {getDescription()}
        </Typography>
      </Alert>
    </Box>
  );
};
