/**
 * Keycloak init — will be configured when Keycloak is set up.
 * For now, export a no-op init so the app runs without auth.
 */
export function initKeycloak() {
  return Promise.resolve(undefined)
}
