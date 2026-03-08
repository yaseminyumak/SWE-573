import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initKeycloak } from './auth/keycloak'
import App from './App.tsx'
import './index.css'

initKeycloak().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
