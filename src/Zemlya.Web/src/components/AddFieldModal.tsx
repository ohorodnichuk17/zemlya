import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import { api } from '../axios/api';

interface AddFieldModalProps {
  open: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

const OBLASTS_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "Київська": { lat: 50.4501, lng: 30.5234 },
  "Житомирська": { lat: 50.2547, lng: 28.6587 },
  "Херсонська": { lat: 46.6354, lng: 32.6169 },
  "Запорізька": { lat: 47.8388, lng: 35.1396 },
  "Миколаївська": { lat: 46.9750, lng: 31.9946 },
  "Одеська": { lat: 46.4825, lng: 30.7233 },
  "Дніпропетровська": { lat: 48.4647, lng: 35.0462 },
  "Донецька": { lat: 48.0159, lng: 37.8028 },
  "Луганська": { lat: 48.5740, lng: 39.3078 },
  "Львівська": { lat: 49.8397, lng: 24.0297 },
  "Харківська": { lat: 49.9935, lng: 36.2304 },
  "Полтавська": { lat: 49.5883, lng: 34.5514 },
  "Чернігівська": { lat: 51.4982, lng: 31.2893 },
  "Рівненська": { lat: 50.6199, lng: 26.2516 },
  "Волинська": { lat: 50.7472, lng: 25.3254 },
  "Сумська": { lat: 50.9077, lng: 34.7981 },
  "Вінницька": { lat: 49.2331, lng: 28.4682 },
  "Черкаська": { lat: 49.4444, lng: 32.0597 },
  "Хмельницька": { lat: 49.4230, lng: 26.9871 },
  "Тернопільська": { lat: 49.5535, lng: 25.5948 },
  "Івано-Франківська": { lat: 48.9215, lng: 24.7097 },
  "Закарпатська": { lat: 48.6208, lng: 22.2879 },
  "Чернівецька": { lat: 48.2917, lng: 25.9352 },
  "Кіровоградська": { lat: 48.5079, lng: 32.2623 }
};

export const AddFieldModal = ({ open, onClose, onSubmitSuccess }: AddFieldModalProps) => {
  const [name, setName] = useState('');
  const [cropType, setCropType] = useState(1); // Wheat
  const [soilType, setSoilType] = useState(1); // Chernozem
  const [size, setSize] = useState('10');
  const [oblast, setOblast] = useState('Київська');
  const [shellingLevel, setShellingLevel] = useState(0); // None
  const [sowingDate, setSowingDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    const coords = OBLASTS_COORDINATES[oblast] || { lat: 48.3794, lng: 31.1656 };
    const randomOffset = (Math.random() - 0.5) * 0.05;

    const payload = {
      name,
      cropType: Number(cropType),
      soilType: Number(soilType),
      sizeHectares: parseFloat(size),
      latitude: coords.lat + randomOffset,
      longitude: coords.lng + randomOffset,
      oblast,
      shellingImpactLevel: Number(shellingLevel),
      sowingDate: new Date(sowingDate).toISOString()
    };

    try {
      await api.post('/api/fields', payload);
      setName('');
      setCropType(1);
      setSoilType(1);
      setSize('10');
      setShellingLevel(0);
      onSubmitSuccess();
    } catch (err) {
      console.error(err);
      alert('Помилка при створенні ділянки. Перевірте з\'єднання.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        Додати нову ділянку поля
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 3 }}>
          <TextField
            label="Назва поля"
            variant="outlined"
            fullWidth
            required
            placeholder="напр. Південне Плато"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
              select
              label="Вид культури"
              fullWidth
              value={cropType}
              onChange={e => setCropType(Number(e.target.value))}
            >
              <MenuItem value={1}>Пшениця</MenuItem>
              <MenuItem value={2}>Соняшник</MenuItem>
              <MenuItem value={3}>Кукурудза</MenuItem>
            </TextField>
            <TextField
              select
              label="Тип ґрунту"
              fullWidth
              value={soilType}
              onChange={e => setSoilType(Number(e.target.value))}
            >
              <MenuItem value={1}>Чорнозем</MenuItem>
              <MenuItem value={2}>Глина</MenuItem>
              <MenuItem value={3}>Підзолистий</MenuItem>
            </TextField>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
              label="Площа (га)"
              type="number"
              slotProps={{ htmlInput: { step: '0.01', min: '0.1' } }}
              fullWidth
              required
              value={size}
              onChange={e => setSize(e.target.value)}
            />
            <TextField
              select
              label="Область України"
              fullWidth
              value={oblast}
              onChange={e => setOblast(e.target.value)}
            >
              {Object.keys(OBLASTS_COORDINATES).map(o => (
                <MenuItem key={o} value={o}>{o}</MenuItem>
              ))}
            </TextField>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
              label="Дата посіву"
              type="date"
              fullWidth
              required
              slotProps={{ inputLabel: { shrink: true } }}
              value={sowingDate}
              onChange={e => setSowingDate(e.target.value)}
            />
            <TextField
              select
              label="Воєнний вплив / Обстріли"
              fullWidth
              value={shellingLevel}
              onChange={e => setShellingLevel(Number(e.target.value))}
            >
              <MenuItem value={0}>Відсутній (Безпечно)</MenuItem>
              <MenuItem value={1}>Низький (Поблизу)</MenuItem>
              <MenuItem value={2}>Середній (Воронки поруч)</MenuItem>
              <MenuItem value={3}>Високий (Прямі влучання)</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
          <Button onClick={onClose} color="inherit" disabled={loading}>
            Скасувати
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            sx={{ backgroundColor: '#2E7D32', '&:hover': { backgroundColor: '#1B5E20' }, textTransform: 'none', fontWeight: 600 }}
            disabled={loading}
          >
            Створити ділянку
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
