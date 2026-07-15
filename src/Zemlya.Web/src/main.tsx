import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { storage } from './redux/storage.ts'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { injectStore } from './axios/api.ts'

injectStore(storage);

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <Provider store={storage}>
    <StrictMode>
      <App />
    </StrictMode>
  </Provider>
  </BrowserRouter>
)
