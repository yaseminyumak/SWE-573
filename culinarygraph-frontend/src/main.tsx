import './auth/insecureContextCryptoPolyfill'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initKeycloak } from './auth/keycloak'
import App from './App.tsx'
import './index.css'

const rootEl = document.getElementById('root')
if (!rootEl) {
  throw new Error('Missing #root')
}
// Narrow for TS (closure passed to .then/.catch loses control-flow narrowing on rootEl).
const container: HTMLElement = rootEl

function renderApp() {
  createRoot(container).render(
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
