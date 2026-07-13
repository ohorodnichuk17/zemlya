import { Route, Routes } from 'react-router'
import './App.css'
import NavigationLayout from './components/NavigationLayout'
import { FieldsPage } from './pages/FieldsPage'
import { FieldDashboardPage } from './pages/FieldDashboardPage'
import { AboutPage } from './pages/AboutPage'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

function App() {

   return (
      <>
         <Routes>
            <Route path="/" element={<NavigationLayout />}>
               <Route index element={<FieldsPage />} />
               <Route path="/fields/:id" element={<FieldDashboardPage />} />
               <Route path="/about" element={<AboutPage />} />
            </Route>
         </Routes>
         <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
               Zemlya • 2026
            </Typography>
         </Box>
      </>
   )
}

export default App
