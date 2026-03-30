import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initKeycloak } from './auth/keycloak'
import App from './App.tsx'
import './index.css'

const rootEl = document.getElementById('root')
if (!rootEl) {
  throw new Error('Missing #root')
}

function renderApp() {
  createRoot(rootEl).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

initKeycloak()
  .then(renderApp)
  .catch((err) => {
    // Without this, a failed init (wrong VITE_KEYCLOAK_URL, CORS, Keycloak down) leaves a blank page.
    console.error('Keycloak init failed — UI will load without SSO. Check VITE_KEYCLOAK_URL and Keycloak client redirect URIs.', err)
    renderApp()
  })
