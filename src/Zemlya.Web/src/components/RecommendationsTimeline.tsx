import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WaterIcon from '@mui/icons-material/Opacity';
import SoilIcon from '@mui/icons-material/Spa';
import WarningIcon from '@mui/icons-material/Warning';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

interface Recommendation {
  id: string;
  actionType: string;
  scheduledFor: string;
  amount: number;
  isCompleted: boolean;
  description: string;
}

interface RecommendationsTimelineProps {
  recommendations: Recommendation[];
  onComplete: (id: string) => void;
}

export const RecommendationsTimeline = ({ recommendations, onComplete }: RecommendationsTimelineProps) => {
  const getBadgeStyle = (type: string) => {
    switch (type.toLowerCase()) {
      case 'irrigation':
        return {
          label: 'Полив',
          color: 'info' as const,
          icon: <WaterIcon sx={{ fontSize: '14px' }} />
        };
      case 'fertilization':
        return {
          label: 'Підживлення',
          color: 'success' as const,
          icon: <SoilIcon sx={{ fontSize: '14px' }} />
        };
      case 'reclamation':
        return {
          label: 'Рекультивація',
          color: 'warning' as const,
          icon: <WarningIcon sx={{ fontSize: '14px' }} />
        };
      default:
        return {
          label: type,
          color: 'default' as const,
          icon: undefined
        };
    }
  };

  const getAmountText = (type: string, amount: number) => {
    if (amount === 0) return 'Операцію призупинено';
    switch (type.toLowerCase()) {
      case 'irrigation':
        return `Об'єм: ${amount.toLocaleString('uk-UA')} л/га`;
      case 'fertilization':
        return `Добрива: ${amount.toLocaleString('uk-UA')} кг/га`;
      case 'reclamation':
        return `Біочар / Цеоліт: ${amount.toLocaleString('uk-UA')} т/га`;
      default:
        return `Кількість: ${amount}`;
    }
  };

  return (
    <Card sx={{ 
      borderRadius: '12px', 
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      border: '1px solid rgba(0,0,0,0.06)',
      backgroundColor: '#FFFFFF',
      height: '100%'
    }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1B5E20' }}>
            Календар догляду за посівами
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Графік скориговано екологічними правилами Zemlya та прогнозом опадів
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '520px', overflowY: 'auto', pr: 1 }}>
          {recommendations.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              Немає рекомендацій для цієї ділянки.
            </Typography>
          ) : (
            recommendations.map(rec => {
              const badge = getBadgeStyle(rec.actionType);
              return (
                <Box 
                  key={rec.id}
                  sx={{
                    display: 'flex',
                    gap: '12px',
                    padding: '14px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: rec.isCompleted ? 'rgba(76, 175, 80, 0.2)' : 'rgba(0,0,0,0.05)',
                    backgroundColor: rec.isCompleted ? 'rgba(76, 175, 80, 0.02)' : 'rgba(255,255,255,0.8)',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: 'rgba(76, 175, 80, 0.3)',
                      backgroundColor: 'rgba(76, 175, 80, 0.01)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                      checked={rec.isCompleted}
                      onChange={() => onComplete(rec.id)}
                      disabled={rec.isCompleted}
                      icon={<CheckCircleOutlineIcon sx={{ color: 'text.secondary' }} />}
                      checkedIcon={<CheckCircleIcon sx={{ color: '#4CAF50' }} />}
                      sx={{ padding: 0 }}
                    />
                  </Box>

                  <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                      <Chip 
                        label={badge.label} 
                        color={badge.color} 
                        size="small"
                        icon={badge.icon}
                        sx={{ fontWeight: 700, fontSize: '11px', height: '20px' }} 
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {format(new Date(rec.scheduledFor), 'd MMM, HH:mm', { locale: uk })}
                      </Typography>
                    </Box>

                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 700, 
                        color: rec.isCompleted ? 'text.disabled' : 'text.primary',
                        textDecoration: rec.isCompleted ? 'line-through' : 'none'
                      }}
                    >
                      {getAmountText(rec.actionType, rec.amount)}
                    </Typography>

                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        fontSize: '12px',
                        lineHeight: 1.4,
                        textDecoration: rec.isCompleted ? 'line-through' : 'none',
                        color: rec.isCompleted ? 'text.disabled' : 'text.secondary'
                      }}
                    >
                      {rec.description}
                    </Typography>
                  </Box>
                </Box>
              );
            })
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
