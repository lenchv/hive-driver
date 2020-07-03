#!/bin/bash

MASTER_KNOX=knox-password
GATEWAY_ALIAS=gateway-identity
HOSTNAME=$(hostname -f)

cd $GATEWAY_HOME/data/security/keystores

openssl pkcs12 -export -in /opt/ssl/cert.pem -inkey /opt/ssl/key.key -passout pass:$MASTER_KNOX > server.p12

# Important: 
# You must use the master-secret for the keystore password and keep track of the password that you use for the key passphrase.
# knox
keytool -importkeystore -srckeystore server.p12 -destkeystore gateway.jks -srcstoretype pkcs12 \
	-deststorepass $MASTER_KNOX \
	-srcstorepass $MASTER_KNOX

# Important:
# the alias MUST be “gateway-identity”
# the name of the expected identity keystore for the gateway MUST be gateway.jks
keytool -changealias -alias "1" -destalias "gateway-identity" -keystore gateway.jks -storepass $MASTER_KNOX

$GATEWAY_HOME/bin/knoxcli.sh create-alias gateway-identity-passphrase --value $MASTER_KNOX
