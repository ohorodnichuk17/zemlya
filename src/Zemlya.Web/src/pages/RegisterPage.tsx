import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { registerAsync } from '../redux/actions/authActions';
import {
   TextField,
   Button,
   Box,
   Typography,
   CircularProgress,
   InputAdornment,
   IconButton,
   MenuItem,
   Select,
   InputLabel,
   FormControl
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff, Business, PersonOutlined } from '@mui/icons-material';
import { AuthCard } from '../components/AuthCard';

const getLocalizedError = (err: string | null) => {
   if (!err) {
      return null;
   }

   switch (err) {
      case 'email_already_exists':
         return "Користувач з таким email вже зареєстрований.";
      case 'farm_already_exists':
         return "Господарство з такою назвою вже зареєстроване.";
      case 'farm_not_found':
         return "Господарство з такою назвою не знайдено. Перевірте назву або зверніться до власника.";
      case 'farm_name_empty':
         return "Будь ласка, введіть назву господарства.";
      case 'farm_name_too_long':
         return "Назва господарства не повинна перевищувати 100 символів.";
      case 'email_empty':
         return "Будь ласка, введіть email адресу.";
      case 'email_invalid':
         return "Некоректний формат Email.";
      case 'password_empty':
         return "Будь ласка, введіть пароль.";
      case 'password_too_short':
         return "Пароль має містити щонайменше 8 символів.";
      case 'password_no_uppercase':
         return "Пароль має містити принаймні одну велику літеру.";
      case 'password_no_digit':
         return "Пароль має містити принаймні одну цифру.";
      case 'password_no_special':
         return "Пароль має містити принаймні один спеціальний символ.";
      case 'role_invalid':
         return "Некоректна роль користувача.";
      case 'validation_error':
         return "Некоректні вхідні дані.";
      default:
         return err;
   }
};

export const RegisterPage: React.FC = () => {
   const [farmName, setFarmName] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [role, setRole] = useState('Owner');
   const [showPassword, setShowPassword] = useState(false);
   const [formError, setFormError] = useState<string | null>(null);

   const dispatch = useAppDispatch();
   const navigate = useNavigate();

   const { status, error, token } = useAppSelector((state) => state.authReducer);

   useEffect(() => {
      if (token) {
         navigate('/', { replace: true });
      }
   }, [token, navigate]);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setFormError(null);

      if (!farmName.trim() || !email.trim() || !password.trim()) {
         setFormError("Будь ласка, заповніть усі обов'язкові поля.");
         return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
         setFormError("Некоректний формат Email.");
         return;
      }

      if (password.length < 8) {
         setFormError("Пароль має містити щонайменше 8 символів.");
         return;
      }

      const passwordComplexityRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
      if (!passwordComplexityRegex.test(password)) {
         setFormError("Пароль має містити хоча б одну велику літеру, одну цифру та один спеціальний символ.");
         return;
      }

      dispatch(registerAsync({ farmName, email, password, role }));
   };

   return (
      <AuthCard subtitle="Реєстрація кабінету фермера" error={formError || getLocalizedError(error)}>
         <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
               margin="normal"
               required
               fullWidth
               id="farmName"
               label="Назва господарства"
               name="farmName"
               autoComplete="organization"
               autoFocus
               value={farmName}
               onChange={(e) => setFarmName(e.target.value)}
               slotProps={{
                  input: {
                     startAdornment: (
                        <InputAdornment position="start">
                           <Business color="action" />
                        </InputAdornment>
                     ),
                  }
               }}
               sx={{
                  '& .MuiOutlinedInput-root': {
                     borderRadius: 2,
                     '&.Mui-focused fieldset': {
                        borderColor: '#2E7D32',
                     }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                     color: '#2E7D32',
                  }
               }}
            />
            <TextField
               margin="normal"
               required
               fullWidth
               id="email"
               label="Email адреса"
               name="email"
               autoComplete="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               slotProps={{
                  input: {
                     startAdornment: (
                        <InputAdornment position="start">
                           <Email color="action" />
                        </InputAdornment>
                     ),
                  }
               }}
               sx={{
                  '& .MuiOutlinedInput-root': {
                     borderRadius: 2,
                     '&.Mui-focused fieldset': {
                        borderColor: '#2E7D32',
                     }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                     color: '#2E7D32',
                  }
               }}
            />
            <TextField
               margin="normal"
               required
               fullWidth
               name="password"
               label="Пароль"
               type={showPassword ? 'text' : 'password'}
               id="password"
               autoComplete="new-password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               slotProps={{
                  input: {
                     startAdornment: (
                        <InputAdornment position="start">
                           <Lock color="action" />
                        </InputAdornment>
                     ),
                     endAdornment: (
                        <InputAdornment position="end">
                           <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                           >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                           </IconButton>
                        </InputAdornment>
                     )
                  }
               }}
               sx={{
                  '& .MuiOutlinedInput-root': {
                     borderRadius: 2,
                     '&.Mui-focused fieldset': {
                        borderColor: '#2E7D32',
                     }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                     color: '#2E7D32',
                  }
               }}
            />

            <FormControl fullWidth margin="normal">
               <InputLabel id="role-select-label" sx={{ '&.Mui-focused': { color: '#2E7D32' } }}>Роль</InputLabel>
               <Select
                  labelId="role-select-label"
                  id="role"
                  value={role}
                  label="Роль"
                  onChange={(e) => setRole(e.target.value)}
                  startAdornment={
                     <InputAdornment position="start">
                        <PersonOutlined color="action" />
                     </InputAdornment>
                  }
                  sx={{
                     borderRadius: 2,
                     '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#2E7D32',
                     }
                  }}
               >
                  <MenuItem value="Owner">Власник</MenuItem>
                  <MenuItem value="Agronomist">Агроном</MenuItem>
                  <MenuItem value="Auditor">Аудитор</MenuItem>
               </Select>
            </FormControl>

            <Button
               type="submit"
               fullWidth
               variant="contained"
               disabled={status === 'loading'}
               sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  backgroundColor: '#2E7D32',
                  '&:hover': {
                     backgroundColor: '#1B5E20'
                  },
                  borderRadius: 2,
                  fontWeight: 700,
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(46, 125, 50, 0.2)'
               }}
            >
               {status === 'loading' ? (
                  <CircularProgress size={24} color="inherit" />
               ) : (
                  "Зареєструватися"
               )}
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
               <Typography variant="body2" color="text.secondary">
                  Вже маєте акаунт?{' '}
                  <Link to="/login" style={{ color: '#2E7D32', fontWeight: 600, textDecoration: 'none' }}>
                     Увійти
                  </Link>
               </Typography>
            </Box>
         </Box>
      </AuthCard>
   );
};
