import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { loginAsync } from '../redux/actions/authActions';
import { TextField, Button, Box, Typography, CircularProgress, InputAdornment, IconButton } from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { AuthCard } from '../components/AuthCard';

const getLocalizedError = (err: string | null) => {
   if (!err) {
      return null;
   }

   switch (err) {
      case 'invalid_credentials':
         return "Неправильний email або пароль.";
      case 'email_empty':
         return "Будь ласка, введіть email адресу.";
      case 'email_invalid':
         return "Некоректний формат Email.";
      case 'password_empty':
         return "Будь ласка, введіть пароль.";
      case 'password_too_short':
         return "Пароль має містити щонайменше 8 символів.";
      case 'validation_error':
         return "Некоректні вхідні дані.";
      default:
         return err;
   }
};

export const LoginPage: React.FC = () => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
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

      if (!email.trim() || !password.trim()) {
         setFormError("Будь ласка, заповніть усі поля.");
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

      dispatch(loginAsync({ email, password }));
   };

   return (
      <AuthCard subtitle="Вхід до кабінету фермера" error={formError || getLocalizedError(error)}>
         <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
               margin="normal"
               required
               fullWidth
               id="email"
               label="Email адреса"
               name="email"
               autoComplete="email"
               autoFocus
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
               autoComplete="current-password"
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
                  "Увійти"
               )}
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
               <Typography variant="body2" color="text.secondary">
                  Немає акаунту?{' '}
                  <Link to="/register" style={{ color: '#2E7D32', fontWeight: 600, textDecoration: 'none' }}>
                     Зареєструватися
                  </Link>
               </Typography>
            </Box>
         </Box>
      </AuthCard>
   );
};
