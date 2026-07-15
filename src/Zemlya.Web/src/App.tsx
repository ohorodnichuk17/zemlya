import { Route, Routes } from 'react-router-dom'
import './App.css'
import NavigationLayout from './components/NavigationLayout'
import { FieldsPage } from './pages/FieldsPage'
import { FieldDashboardPage } from './pages/FieldDashboardPage'
import { AboutPage } from './pages/AboutPage'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'

function App() {
   return (
      <>
         <Routes>
      <Routes>
            <Route path="/" element={<NavigationLayout />}>
               <Route index element={<FieldsPage />} />
               <Route path="/fields/:id" element={<FieldDashboardPage />} />
               <Route path="/about" element={<AboutPage />} />
            </Route>
         </Routes>
         
      </>
         <Route path="/login" element={<LoginPage />} />
         <Route path="/register" element={<RegisterPage />} />
      </Routes>
   )
}

export default App
