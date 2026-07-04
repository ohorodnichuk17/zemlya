import { Route, Routes } from 'react-router'
import './App.css'
import NavigationLayout from './components/NavigationLayout'
import { FieldsPage } from './pages/FieldsPage'
import { FieldDashboardPage } from './pages/FieldDashboardPage'
import { AboutPage } from './pages/AboutPage'

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
      </>
   )
}

export default App
