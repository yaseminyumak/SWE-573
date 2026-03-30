#!/bin/sh
# Keycloak marks non–RFC1918 / public client addresses as "external" for sslRequired=EXTERNAL
# (master realm default), which blocks the admin UI over http://PUBLIC_IP:8180.
# Localhost kcadm calls are loopback → allowed; we set sslRequired=NONE on master + culinarygraph.
set -eu

/opt/keycloak/bin/kc.sh start-dev --import-realm &
kc_pid=$!

echo "keycloak-http-bootstrap: waiting for admin API..."
i=0
while [ "$i" -lt 90 ]; do
	if /opt/keycloak/bin/kcadm.sh config credentials \
		--server http://127.0.0.1:8080 \
		--realm master \
		--user "${KEYCLOAK_ADMIN}" \
		--password "${KEYCLOAK_ADMIN_PASSWORD}" >/dev/null 2>&1; then
		echo "keycloak-http-bootstrap: Keycloak is up, relaxing SSL for HTTP (dev / IP access)"
		/opt/keycloak/bin/kcadm.sh update realms/master -s sslRequired=NONE
		j=0
		while [ "$j" -lt 24 ]; do
			if /opt/keycloak/bin/kcadm.sh get realms/culinarygraph >/dev/null 2>&1; then
				/opt/keycloak/bin/kcadm.sh update realms/culinarygraph -s sslRequired=NONE
				break
			fi
			j=$((j + 1))
			sleep 5
		done
		wait "$kc_pid"
		exit $?
	fi
	i=$((i + 1))
	sleep 2
done

echo "keycloak-http-bootstrap: timeout waiting for Keycloak"
kill "$kc_pid" 2>/dev/null || true
wait "$kc_pid" 2>/dev/null || true
exit 1
