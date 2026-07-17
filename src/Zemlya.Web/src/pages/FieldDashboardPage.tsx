import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { api } from '../axios/api';
import { WeatherCard } from '../components/WeatherCard';
import { GrowthStageCard } from '../components/GrowthStageCard';
import { SafetyAdvisoryAlert } from '../components/SafetyAdvisoryAlert';
import { RecommendationsTimeline } from '../components/RecommendationsTimeline';
import { AnalyticsCharts } from '../components/AnalyticsCharts';
import confetti from 'canvas-confetti';
import jsPDF from "jspdf";
import '../assets/fonts/OpenSans-Regular-normal.js';
import { format } from 'date-fns';
import { autoTable } from 'jspdf-autotable'
import brand from '../assets/images/brand.png';
import { agroClimaticZones, crops, growthStages, shellingImpactLevels, soils, weatherDescriptions } from '../types/dataTypes.js';



interface Recommendation {
  id: string;
  actionType: string;
  scheduledFor: string;
  amount: number;
  isCompleted: boolean;
  description: string;
}

interface ForecastItem {
  dateText: string;
  temperature: number;
  humidity: number;
  rain: number;
  main: string;
  description: string;
}

interface DashboardData {
  fieldId: string;
  fieldName: string;
  crop: string;
  soil: string;
  sizeHectares: number;
  oblast: string;
  shellingImpactLevel: string;
  sowingDate: string;
  agroClimaticZone: string;
  growthStage: string;
  daysSinceSowing: number;
  currentTemperature: number;
  currentHumidity: number;
  rainAmount: number;
  weatherDescription: string;
  forecast: ForecastItem[];
  recommendations: Recommendation[];
}

export const FieldDashboardPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<DashboardData>(`/api/fields/${id}/dashboard`);
      setData(response.data);
    } catch (err) {
      console.error(err);
      setError('Не вдалося завантажити аналітику поля. Спробуйте оновити сторінку.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleCompleteRecommendation = async (recId: string) => {
    if (!data) return;

    try {
      // Оновити локальний стан перед запитом для кращого UX
      setData({
        ...data,
        recommendations: data.recommendations.map(r =>
          r.id === recId ? { ...r, isCompleted: true } : r
        )
      });

      // Надіслати POST запит на бекенд
      await api.post(`/api/recommendations/${recId}/complete`);

      // Запустити конфеті ефект
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#4CAF50', '#81C784', '#FBC02D', '#29B6F6']
      });
    } catch (err) {
      console.error(err);
      // При виникненні помилки оновити дані з сервера
      fetchDashboard();
    }
  };

  const handleDownloadReport = async () => {
    const doc = new jsPDF();

    doc.setFont('OpenSans-Regular', 'normal');


    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setLineWidth(1);
    doc.setDrawColor(46, 125, 50);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

    let yOffset = 0;


    doc.setFontSize(21);

    doc.text('Звіт врожайності та стану поля', pageWidth / 2, yOffset += 20, { align: 'center' });
    doc.setFontSize(15);

    doc.text(`Поле: ${data?.fieldName || 'Невідомо'}`, 10, yOffset += 20);
    doc.text(`Культура: ${crops[data!.crop].name || 'Невідомо'}`, 10, yOffset += 10);
    doc.text(`Тип грунту: ${soils[data!.soil].name || 'Невідомо'}`, 10, yOffset += 10);
    doc.text(`Площа (Га): ${data?.sizeHectares || 'Невідомо'}`, 10, yOffset += 10);
    doc.text(`Область: ${data?.oblast || 'Невідомо'}`, 10, yOffset += 10);
    doc.text(`Зона: ${agroClimaticZones[data!.agroClimaticZone] || 'Невідомо'}`, 10, yOffset += 10);
    doc.text(`Вплив війни: ${shellingImpactLevels[data!.shellingImpactLevel].name || 'Невідомо'}`, 10, yOffset += 10);
    doc.text(`Дата посіву: ${data?.sowingDate ? format(data!.sowingDate, 'dd.MM.yyyy') : 'Невідомо'}`, 10, yOffset += 10);
    doc.text(`Днів від посіву: ${data?.daysSinceSowing || 'Невідомо'}`, 10, yOffset += 10);
    doc.text(`Фаза росту: ${growthStages[data!.growthStage] || 'Невідомо'}`, 10, yOffset += 10);
    doc.text(`Поточна температура: ${data?.currentTemperature || 'Невідомо'} °C`, 10, yOffset += 10);
    doc.text(`Вологість повітря: ${data?.currentHumidity || 'Невідомо'} %`, 10, yOffset += 10);
    doc.text(`Опади (мм): ${data?.rainAmount || 'Невідомо'}`, 10, yOffset += 10);
    doc.text(`Опис погоди: ${weatherDescriptions[data!.weatherDescription] || 'Невідомо'}`, 10, yOffset += 10);

    if (data?.forecast && data.forecast.length > 0) {
      doc.text(`Прогноз :`, 10, yOffset += 10);
      const datesOfForecast = data?.forecast.map(forecastItem => format(new Date(forecastItem.dateText), 'dd-MM-yyyy'))
        .filter((value, index, self) => self.indexOf(value) === index);
      const averageTemperature = datesOfForecast?.map(date => {
        const items = data?.forecast.filter((value) => format(new Date(value.dateText), 'dd-MM-yyyy') === date);
        const sum = items?.reduce((acc, curr) => acc + curr.temperature, 0) || 0;
        return (items!.length == 0 ? 0 : sum / items!.length).toFixed(2);
      })
      const averageHumidity = datesOfForecast?.map(date => {
        const items = data?.forecast.filter((value) => format(new Date(value.dateText), 'dd-MM-yyyy') === date);
        const sum = items?.reduce((acc, curr) => acc + curr.humidity, 0) || 0;
        return (items!.length == 0 ? 0 : sum / items!.length).toFixed(2);
      })
      const averageRain = datesOfForecast?.map(date => {
        const items = data?.forecast.filter((value) => format(new Date(value.dateText), 'dd-MM-yyyy') === date);
        const sum = items?.reduce((acc, curr) => acc + curr.rain, 0) || 0;
        return (items!.length == 0 ? 0 : sum / items!.length).toFixed(2);
      })
      console.log(averageRain);
      autoTable(doc, {
        head: [["Дата", "Середня температура (°C)", "Середня вологість (%)", "Середні опади (мм)"]],
        body: datesOfForecast?.map((date, index) => [date, averageTemperature![index], averageHumidity![index], averageRain![index]]) || [],
        styles: {
          font: "OpenSans-Regular",
          fontStyle: "normal",
          halign: 'center',
        },
        headStyles: {
          font: "OpenSans-Regular",
          fontStyle: "normal",
          halign: 'center'
        },
        margin: { top: yOffset + 10 },
        theme: 'grid',
      });
    }

    doc.addImage(brand, 'PNG', pageWidth - 60, pageHeight - 30, 40, 15);

    doc.save(`Звіт_${format(new Date(),'yyyy-MM-dd-HH-mm-ss')}.pdf`);
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center', minHeight: '80vh', flexDirection: 'column', gap: 2 }}>
        <CircularProgress sx={{ color: '#2E7D32' }} />
        <Typography color="text.secondary">Отримання супутникових та метеорологічних даних...</Typography>
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Container sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, height:"100%" }}>
        <Typography color="error">{error || 'Ділянку не знайдено'}</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} variant="outlined" sx={{ color: '#2E7D32', borderColor: '#2E7D32' }}>
          Назад до списку
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4, display: 'flex', flexDirection: 'column', gap: 3, flexGrow: 1, backgroundColor: '#F1F8E9' }} maxWidth="lg">
      {/* Навігація та хлібні крихти */}
      <Box>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link underline="hover" color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer', fontWeight: 500 }}>
            Головна
          </Link>
          <Typography color="text.primary" sx={{ fontWeight: 600 }}>
            {data.fieldName}
          </Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', columnGap:"10px" }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{
              color: '#2E7D32',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { backgroundColor: 'rgba(46, 125, 50, 0.05)' }
            }}
          >
            Назад до списку полів
          </Button>
          {/*<Button
            onClick={() => {}}
            sx={{
              marginLeft: "auto",
              color: 'white',
              backgroundColor: '#2E7D32',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { backgroundColor: 'rgb(40, 106, 43)' }
            }}
          >
            Аналіз орфознімку
          </Button>*/}
          <Button
            onClick={() => handleDownloadReport()}
            sx={{
              color: 'white',
              backgroundColor: '#2E7D32',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { backgroundColor: 'rgb(40, 106, 43)' }
            }}
          >
            Завантажити звіт (PDF)
          </Button>
        </Box>

      </Box>

      {/* Заголовок та агрокліматична зона */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1B5E20' }}>
            {data.fieldName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {data.oblast} область • Площа: {data.sizeHectares} га • Зона: {data.agroClimaticZone}
          </Typography>
        </Box>
      </Box>

      {/* Безпекові попередження щодо обстрілів */}
      <SafetyAdvisoryAlert shellingImpactLevel={data.shellingImpactLevel} crop={data.crop} />

      {/* Головна сітка дашборду */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '7fr 4fr', lg: '8fr 4fr' },
        gap: 3,
        width: '100%'
      }}>
        {/* Ліва частина: погода, фаза росту, графіки */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 3
          }}>
            <WeatherCard
              temperature={data.currentTemperature}
              humidity={data.currentHumidity}
              rain={data.rainAmount}
              description={data.weatherDescription}
            />
            <GrowthStageCard
              sowingDate={data.sowingDate}
              daysSinceSowing={data.daysSinceSowing}
              growthStage={data.growthStage}
            />
          </Box>

          <AnalyticsCharts forecast={data.forecast} />
        </Box>

        {/* Права частина: Чекліст догляду (Timeline) */}
        <Box>
          <RecommendationsTimeline
            recommendations={data.recommendations}
            onComplete={handleCompleteRecommendation}
          />
        </Box>
      </Box>
    </Container>
  );
};
