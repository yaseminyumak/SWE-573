import Keycloak from 'keycloak-js'

const keycloakInstance = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL ?? 'http://localhost:8180',
  realm: 'culinarygraph',
  clientId: 'culinarygraph-app',
})

export function initKeycloak() {
  return keycloakInstance.init({
    onLoad: 'check-sso',
    pkceMethod: 'S256',
    checkLoginIframe: false,
  })
}

export { keycloakInstance as keycloak }
