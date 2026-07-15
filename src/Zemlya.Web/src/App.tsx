import { Route, Routes } from 'react-router-dom'
import './App.css'
import NavigationLayout from './components/NavigationLayout'
import { FieldsPage } from './pages/FieldsPage'
import { FieldDashboardPage } from './pages/FieldDashboardPage'
import { AboutPage } from './pages/AboutPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { NotFoundPage } from './pages/NotFoundPage'

function App() {
   return (
      <Routes>
         <Route element={<ProtectedRoute />}>
            <Route path="/" element={<NavigationLayout />}>
               <Route index element={<FieldsPage />} />
               <Route path="/fields/:id" element={<FieldDashboardPage />} />
               <Route path="/about" element={<AboutPage />} />
            </Route>
         </Route>
         <Route path="/login" element={<LoginPage />} />
         <Route path="/register" element={<RegisterPage />} />
         <Route path="*" element={<NotFoundPage />} />
      </Routes>
   )
}

export default App
