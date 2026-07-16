import type { IFieldEdit, IPatchOperation } from "../interfaces/fields/fields";
import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import { Icon, type LatLngTuple } from 'leaflet';
import { IconButton } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import point from '../assets/images/point.png';
import { createFieldAsync, editFieldAsync, getOblastAsync } from '../redux/actions/fieldsActions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { Token } from "@mui/icons-material";

interface FieldFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
  mode: "create" | "edit";
  field?: IFieldEdit
}
function ClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function CreatePatchBody(newData: IFieldEdit, oldData: IFieldEdit) {
  let patchOpearations: IPatchOperation[] = [];

  if (newData.name !== oldData.name) {
    patchOpearations = [...patchOpearations, {
      op: "replace",
      path: "/name",
      value: newData.name
    }]
  }

  if (newData.cropType !== oldData.cropType) {
    patchOpearations = [...patchOpearations, {
      op: "replace",
      path: "/cropType",
      value: newData.cropType
    }]
  }

  if (newData.soilType !== oldData.soilType) {
    patchOpearations = [...patchOpearations, {
      op: "replace",
      path: "/soilType",
      value: newData.soilType
    }]
  }

  if (newData.sizeHectares !== oldData.sizeHectares) {
    patchOpearations = [...patchOpearations, {
      op: "replace",
      path: "/sizeHectares",
      value: newData.sizeHectares.toString()
    }]
  }

  if (newData.latitude !== oldData.latitude) {
    patchOpearations = [...patchOpearations, {
      op: "replace",
      path: "/latitude",
      value: newData.latitude.toString()
    }]
  }

  if (newData.longitude !== oldData.longitude) {
    patchOpearations = [...patchOpearations, {
      op: "replace",
      path: "/longitude",
      value: newData.longitude.toString()
    }]
  }

  if (newData.oblast !== oldData.oblast) {
    patchOpearations = [...patchOpearations, {
      op: "replace",
      path: "/longitude",
      value: newData.oblast
    }]
  }

  if (newData.shellingImpactLevel !== oldData.shellingImpactLevel) {
    patchOpearations = [...patchOpearations, {
      op: "replace",
      path: "/shellingImpactLevel",
      value: newData.shellingImpactLevel
    }]
  }
  if (newData.sowingDate !== oldData.sowingDate) {
    patchOpearations = [...patchOpearations, {
      op: "replace",
      path: "/sowingDate",
      value: new Date(newData.sowingDate).toISOString()
    }]
  }
  return patchOpearations;
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


export const FieldFormModal = (props: FieldFormModalProps) => {
  const [name, setName] = useState('');
  const [cropType, setCropType] = useState(0); // Wheat
  const [soilType, setSoilType] = useState(0); // Chernozem
  const [size, setSize] = useState('10');
  const [oblast, setOblast] = useState('Київська');
  const [coords, setCoords] = useState<LatLngTuple>([50.4501, 30.5234]); // Default to Ukraine center
  const [shellingLevel, setShellingLevel] = useState(0); // None
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [sowingDate, setSowingDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState(false);

  const token = useAppSelector(state => state.authReducer.token);
  const dispatch = useAppDispatch();

  const clearForms = () => {
    setName("");
    setCropType(0);
    setSoilType(0);
    setSize('10');
    setOblast('Київська');
    setCoords([50.4501, 30.5234]);
    setShellingLevel(0);
    setIsMapVisible(false);
    setSowingDate(
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    );
  }
  useEffect(() => {
    clearForms();
    if (props.mode == "edit" && props.field != undefined) {
      setName(props.field.name);
      setCropType(Number(props.field.cropType));
      setSoilType(Number(props.field.soilType));
      setSize(String(props.field.sizeHectares));
      setCoords([props.field.latitude, props.field.longitude]);
      setOblast(props.field.oblast);
      setShellingLevel(Number(props.field.shellingImpactLevel));
      setSowingDate(new Date(props.field.sowingDate).toISOString().split('T')[0]);

      /*console.log(name);
      console.log(cropType);
      console.log(soilType);
      console.log(size);
      console.log(coords);
      console.log(oblast);
      console.log(shellingImpactLevels);
      console.log(sowingDate);*/
    }
    setIsMapVisible(false);
  }, [props.open]);


  const handleMapClick = async (lat: number, lng: number) => {
    const result = await dispatch(getOblastAsync({ lat: lat, lng: lng }));

    if (getOblastAsync.fulfilled.match(result)) {
      if (result.payload === null) {
        setCoords([OBLASTS_COORDINATES["Київська"].lat, OBLASTS_COORDINATES["Київська"].lng])
        setOblast("Київська");
      }
      else {
        const oblastFromApi = result.payload.split(" ")[0];
        if (oblastFromApi in OBLASTS_COORDINATES) {
          setCoords([lat, lng])
          setOblast(oblastFromApi);
        }
      }


    }
  }
  const handleSubmit = async (e: React.FormEvent) => {
    if (token) {
      e.preventDefault();
      if (!name.trim()) return;

      setLoading(true);

      if (props.mode == "create") {
        //const coords = OBLASTS_COORDINATES[oblast] || { lat: 48.3794, lng: 31.1656 };
        //const randomOffset = (Math.random() - 0.5) * 0.05;

        const payload = {
          name,
          cropType: Number(cropType),
          soilType: Number(soilType),
          sizeHectares: parseFloat(size),
          latitude: coords[0],
          longitude: coords[1],
          oblast,
          shellingImpactLevel: Number(shellingLevel),
          sowingDate: new Date(sowingDate).toISOString()
        };

        const result = await dispatch(createFieldAsync({fieldData:payload,token}));
        if (createFieldAsync.fulfilled.match(result)) {
          setLoading(false);
          props.onSubmitSuccess();
        }
      }
      else if (props.field) {
        const patchBody = CreatePatchBody({
          id: props.field.id,
          name: name,
          cropType: cropType.toString(),
          soilType: soilType.toString(),
          sizeHectares: Number(size),
          shellingImpactLevel: shellingLevel.toString(),
          latitude: coords[0],
          longitude: coords[1],
          oblast: oblast,
          sowingDate: sowingDate
        },
          props.field!);
        if (patchBody.length == 0) {
          props.onClose();
          return;
        }



        const result = await dispatch(editFieldAsync({patchData : {
          id: props.field.id,
          patchOperations: patchBody
        },token}));
        if (editFieldAsync.fulfilled.match(result)) {
          setLoading(false);
          props.onSubmitSuccess();
        }
      }


    }


  };

  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        {props.mode == "create" ? "Додати нову ділянку поля" : "Оновлення ділянки"}
      </DialogTitle>
      {isMapVisible == true ? (
        <>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '328px', padding: '16px', boxSizing: 'border-box', overflow: 'hidden' }}>
            <MapContainer
              center={coords}
              zoom={13}
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%" }}

            >
              <TileLayer
                attribution="Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
              <Marker icon={new Icon({ iconUrl: point, iconSize: [32, 32] })} position={coords} draggable={true} eventHandlers={{
                dragend: (e) => {
                  const marker = e.target;
                  const position = marker.getLatLng();
                  //setCoords([position.lat, position.lng]);
                  handleMapClick(position.lat, position.lng);
                }
              }}>
              </Marker>
              <ClickHandler onClick={(lat, lng) => {
                //setCoords([lat, lng])
                handleMapClick(lat, lng);
              }} />
            </MapContainer>

          </DialogContent>
          <DialogActions sx={{ padding: '16px 24px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <Button onClick={() => setIsMapVisible(false)} color="inherit" disabled={loading}>
              Вийти
            </Button>

          </DialogActions>
        </>

      ) : <form onSubmit={handleSubmit}>
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
              <MenuItem value={0}>Пшениця</MenuItem>
              <MenuItem value={1}>Соняшник</MenuItem>
              <MenuItem value={2}>Кукурудза</MenuItem>
            </TextField>
            <TextField
              select
              label="Тип ґрунту"
              fullWidth
              value={soilType}
              onChange={e => setSoilType(Number(e.target.value))}
            >
              <MenuItem value={0}>Чорнозем</MenuItem>
              <MenuItem value={1}>Глина</MenuItem>
              <MenuItem value={2}>Підзолистий</MenuItem>
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
            <Box sx={{ display: 'flex', width: '100%', columnGap: 1, alignItems: 'center' }}>
              <TextField
                select
                label="Область України"
                fullWidth
                value={oblast}
                onChange={e => {
                  setOblast(e.target.value)
                  setCoords([OBLASTS_COORDINATES[e.target.value].lat, OBLASTS_COORDINATES[e.target.value].lng]);
                }}
              >
                {Object.keys(OBLASTS_COORDINATES).map(o => (
                  <MenuItem key={o} value={o}>{o}</MenuItem>
                ))}
              </TextField>
              <IconButton onClick={() => setIsMapVisible(true)} color="primary" >
                📍
              </IconButton>
            </Box>

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
          <Button onClick={props.onClose} color="inherit" disabled={loading}>
            Скасувати
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{ backgroundColor: '#2E7D32', '&:hover': { backgroundColor: '#1B5E20' }, textTransform: 'none', fontWeight: 600 }}
            disabled={loading}
          >
            {props.mode == "create" ? "Створити ділянку" : "Оновити ділянку"}
          </Button>
        </DialogActions>
      </form>}

    </Dialog>
  );
};
