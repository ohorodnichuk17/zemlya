import { Route, Routes } from 'react-router'
import './App.css'
import NavigationLayout from './components/NavigationLayout'
import { FieldsPage } from './pages/FieldsPage'

function App() {

  return (
    <>

      <Routes>
        <Route path="/" element={<NavigationLayout />}>
          <Route index element={<FieldsPage/>} />
          <Route path="/page2" element={<div>Pricing</div>} />
          <Route path="/page3" element={<div>Blog</div>} />
        </Route>
      </Routes>

    </>
  )
}

export default App
