import { Card, CardContent, Typography, CardActions, Button, Box } from "@mui/material"
import fieldBackground from "../assets/images/field-background.png"
import wheatBackground from "../assets/images/wheat_field.png"
import sunflowerBackground from "../assets/images/sunflower_field.png"
import cornBackground from "../assets/images/corn_field.png"
import { format } from "date-fns";
import type { IFieldsResponse } from "../interfaces/fields/fields"
import { useNavigate } from "react-router-dom";

export const CardComponent = (props: { cardInfo: IFieldsResponse }) => {
   const navigate = useNavigate();

   const getCropImage = (crop: string) => {
      switch (crop.toLowerCase()) {
         case 'wheat':
            return wheatBackground;
         case 'sunflower':
            return sunflowerBackground;
         case 'corn':
            return cornBackground;
         default:
            return fieldBackground;
      }
   };

   return (
      <Card sx={{
         width: 280,
         height: 390,
         display: 'flex',
         flexDirection: 'column',
         boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
         borderRadius: '12px',
         transition: 'all 0.3s',
         '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 24px rgba(76, 175, 80, 0.15)',
            borderColor: '#4CAF50'
         },
         border: '1px solid rgba(0, 0, 0, 0.06)'
      }}>
         <img src={getCropImage(props.cardInfo.cropType)} alt="Field" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '12px 12px 0px 0px' }} />
         <CardContent sx={{ flexGrow: 1, padding: '16px' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#1B5E20' }}>
               {props.cardInfo.name}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
               <Typography variant="body2" sx={{ color: 'text.secondary' }}>🌾 Культура: {props.cardInfo.cropType === 'Wheat' ? 'Пшениця' : props.cardInfo.cropType === 'Sunflower' ? 'Соняшник' : props.cardInfo.cropType === 'Corn' ? 'Кукурудза' : props.cardInfo.cropType}</Typography>
               <Typography variant="body2" sx={{ color: 'text.secondary' }}>🟤 Ґрунт: {props.cardInfo.soilType === 'Chernozem' ? 'Чорнозем' : props.cardInfo.soilType === 'Clay' ? 'Глина' : props.cardInfo.soilType === 'Podzol' ? 'Підзолистий' : props.cardInfo.soilType}</Typography>
               <Typography variant="body2" sx={{ color: 'text.secondary' }}>📐 Площа: {props.cardInfo.sizeHectares} га</Typography>
               <Typography variant="body2" sx={{ color: 'text.secondary' }}>📍 {props.cardInfo.oblast} область</Typography>
               <Typography variant="caption" color="text.secondary" sx={{ marginTop: '8px' }}>
                  Створено: {format(new Date(props.cardInfo.createdAt), 'dd/MM/yyyy')}
               </Typography>
            </Box>
         </CardContent>
         <CardActions sx={{ padding: '12px 16px', borderTop: '1px solid rgba(0,0,0,0.04)' }}>
            <Button
               size="small"
               variant="contained"
               sx={{
                  backgroundColor: '#4CAF50',
                  '&:hover': { backgroundColor: '#388E3C' },
                  textTransform: 'none',
                  fontWeight: 600
               }}
               onClick={() => navigate(`/fields/${props.cardInfo.id}`)}
               fullWidth
            >
               Аналітика та догляд
            </Button>
         </CardActions>
      </Card>)
}
