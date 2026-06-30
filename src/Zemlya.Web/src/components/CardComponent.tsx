import { Card, CardContent, Typography, CardActions, Button, Box } from "@mui/material"
import fieldBackground from "../assets/images/field-background.png"
import { format } from "date-fns";
import type { IFieldsResponse } from "../interfaces/fields/fields"

export const CardComponent = (props: { cardInfo: IFieldsResponse }) => {
   return (
      <Card sx={{ width: 255, height: 350 }}>
         <img src={fieldBackground} alt="Field" style={{ width: '100%', height: '100px', borderRadius: '4px 4px 0px 0px' }} />
         <CardContent>

            <Typography variant="h5" gutterBottom sx={{ color: 'text.secondary', fontSize: 20 }}>
               {props.cardInfo.name}
            </Typography>
            <Box>
               <Typography variant="body2">🌾 Вид культури: {props.cardInfo.cropType}</Typography>
               <Typography variant="body2">🟤 Тип ґрунту: {props.cardInfo.soilType}</Typography>
               <Typography variant="body2">📐 Площа: {props.cardInfo.sizeHectares} ha</Typography>
               <Typography variant="body2">📍 {props.cardInfo.latitude}, {props.cardInfo.longitude}</Typography>
               <Typography variant="caption" color="text.secondary">
                  Створено: {format(props.cardInfo.createdAt, 'dd/MM/yyyy')}
               </Typography>
               <br />
               <Typography variant="caption" color="text.secondary">
                  Оновлено: {format(props.cardInfo.updatedAt, 'dd/MM/yyyy')}
               </Typography>
            </Box>
         </CardContent>
         <CardActions>
            <Button size="small">Learn More</Button>
         </CardActions>
      </Card>)
}
