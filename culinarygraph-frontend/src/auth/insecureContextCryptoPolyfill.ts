/**
 * keycloak-js uses crypto.randomUUID() for OAuth state/nonce. Browsers only expose
 * randomUUID in secure contexts (HTTPS, localhost). On http://<public-ip>, randomUUID
 * is missing while getRandomValues usually still works — polyfill so login/init work
 * for dev/Droplet without TLS. Prefer HTTPS in production.
 */
;(function installRandomUuidPolyfill() {
  const c = globalThis.crypto
  if (!c || typeof c.randomUUID === 'function') return
  if (typeof c.getRandomValues !== 'function') return

  const impl = (): string => {
    const buf = new Uint8Array(16)
    c.getRandomValues(buf)
    buf[6] = (buf[6]! & 0x0f) | 0x40
    buf[8] = (buf[8]! & 0x3f) | 0x80
    const hex = Array.from(buf, (b) => b.toString(16).padStart(2, '0')).join('')
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
  }

  try {
    Object.defineProperty(c, 'randomUUID', {
      value: impl as Crypto['randomUUID'],
      configurable: true,
      writable: true,
    })
  } catch {
    ;(c as Crypto & { randomUUID: Crypto['randomUUID'] }).randomUUID = impl as Crypto['randomUUID']
  }
})()

export {}
