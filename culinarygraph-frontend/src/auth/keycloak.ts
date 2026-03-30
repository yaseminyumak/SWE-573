import Keycloak from 'keycloak-js'

const keycloakInstance = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL ?? 'http://localhost:8180',
  realm: 'culinarygraph',
  clientId: 'culinarygraph-app',
})

/**
 * PKCE (S256) needs Web Crypto (`crypto.subtle`). Browsers only expose that in a **secure context**
 * (HTTPS, or `http://localhost` / `http://127.0.0.1`). Plain `http://<public-ip>` is not secure →
 * Keycloak JS throws "Web Crypto API is not available". We fall back to plain auth code flow there.
 * Prefer HTTPS in production; PKCE stays enabled on localhost and HTTPS.
 */
function pkceMethodForContext(): 'S256' | false {
  if (typeof window === 'undefined') return 'S256'
  return window.isSecureContext ? 'S256' : false
}

export function initKeycloak() {
  return keycloakInstance.init({
    onLoad: 'check-sso',
    pkceMethod: pkceMethodForContext(),
    checkLoginIframe: false,
  })
}

export { keycloakInstance as keycloak }
