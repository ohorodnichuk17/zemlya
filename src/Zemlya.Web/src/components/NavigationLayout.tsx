import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import EcoIcon from '@mui/icons-material/Spa';
import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { logoutAsync } from '../redux/actions/authActions';

const pages = [['Поля', "/"], ['Про проєкт', "/about"]];

const getRoleText = (role: string) => {
   switch (role) {
      case 'Owner': return 'Власник';
      case 'Agronomist': return 'Агроном';
      case 'Auditor': return 'Аудитор';
      default: return role;
   }
};

function NavigationLayout() {
   const navigate = useNavigate();
   const dispatch = useAppDispatch();
   const user = useAppSelector((state) => state.authReducer.user);
   const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

   const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElNav(event.currentTarget);
   };

   const handleCloseNavMenu = () => {
      setAnchorElNav(null);
   };

   const handleLogout = () => {
      dispatch(logoutAsync());
      navigate('/login');
   };

   return (
      <Container maxWidth={false}
         disableGutters sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', backgroundColor: '#F1F8E9', minWidth: '400px' }}>
         <AppBar position="static" sx={{ backgroundColor: '#2E7D32', borderBottom: '3px solid #FBC02D', zIndex: 5 }}>
            <Container>
               <Toolbar disableGutters>
                  <img src="/logo.svg" alt="Zemlya Logo" style={{ width: '35px', height: '35px', marginRight: '8px' }} />
                  <Typography
                     variant="h6"
                     noWrap
                     onClick={() => navigate('/')}
                     sx={{
                        mr: 2,
                        display: { xs: 'none', md: 'flex' },
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 800,
                        letterSpacing: '.1rem',
                        color: 'inherit',
                        textDecoration: 'none',
                        cursor: 'pointer'
                     }}
                  >
                     Zemlya
                  </Typography>

                  <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                     <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleOpenNavMenu}
                        color="inherit"
                     >
                        <MenuIcon />
                     </IconButton>
                     <Menu
                        id="menu-appbar"
                        anchorEl={anchorElNav}
                        anchorOrigin={{
                           vertical: 'bottom',
                           horizontal: 'left',
                        }}
                        keepMounted
                        transformOrigin={{
                           vertical: 'top',
                           horizontal: 'left',
                        }}
                        open={Boolean(anchorElNav)}
                        onClose={handleCloseNavMenu}
                        sx={{ display: { xs: 'block', md: 'none' } }}
                     >
                        {pages.map((page) => (
                           <MenuItem key={page[0]} onClick={() => { handleCloseNavMenu(); navigate(page[1]); }}>
                              <Typography sx={{ textAlign: 'center' }}>{page[0]}</Typography>
                           </MenuItem>
                        ))}
                     </Menu>
                  </Box>
                  <EcoIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: '#FBC02D' }} />
                  <Typography
                     variant="h5"
                     noWrap
                     onClick={() => navigate('/')}
                     sx={{
                        mr: 2,
                        display: { xs: 'flex', md: 'none' },
                        flexGrow: 1,
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 800,
                        letterSpacing: '.1rem',
                        color: 'inherit',
                        textDecoration: 'none',
                        cursor: 'pointer'
                     }}
                  >
                     Zemlya
                  </Typography>
                  <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                     {pages.map((page) => (
                        <Button
                           key={page[0]}
                           onClick={() => navigate(page[1])}
                           sx={{ my: 2, color: 'white', display: 'block', textTransform: 'none', fontWeight: 600 }}
                        >
                           {page[0]}
                        </Button>
                     ))}
                  </Box>

                  {user && (
                     <Box sx={{ display: 'flex', alignItems: 'center', mr: 2, gap: 1.5 }}>
                        <Typography variant="body2" sx={{ color: 'white', display: { xs: 'none', sm: 'block' }, fontWeight: 500 }}>
                           {user.email} ({getRoleText(user.role)})
                        </Typography>
                        <Button
                           onClick={handleLogout}
                           sx={{
                              color: 'white',
                              borderColor: 'rgba(255,255,255,0.4)',
                              textTransform: 'none',
                              fontWeight: 600,
                              px: 2,
                              borderRadius: '6px',
                              '&:hover': {
                                 borderColor: 'white',
                                 backgroundColor: 'rgba(255,255,255,0.1)'
                              }
                           }}
                           variant="outlined"
                           size="small"
                        >
                           Вийти
                        </Button>
                     </Box>
                  )}

                  <Box sx={{ display: 'flex', flexDirection: 'column', width: '24px', height: '16px', borderRadius: '2px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)' }}>
                     <Box sx={{ flex: 1, backgroundColor: '#0057B7' }} />
                     <Box sx={{ flex: 1, backgroundColor: '#FFD700' }} />
                  </Box>
               </Toolbar>
            </Container>
         </AppBar>
         <Outlet />
      </Container>
   );
}
export default NavigationLayout;
