import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { storage } from './redux/storage.ts'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')!).render(
  <Provider store={storage}>
    <StrictMode>
      <App />
    </StrictMode>,
  </Provider>
)
