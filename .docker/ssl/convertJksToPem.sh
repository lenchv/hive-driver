#!/bin/bash

# keystore.jks
KEYSTORE_FILE="$1"
# truststore.jks
TRUSTTORE_FILE="$2"
ALIASNAME="$3"

keytool -importkeystore \
	-srckeystore $KEYSTORE_FILE \
	-destkeystore ${ALIASNAME}.p12 \
	-srcalias $ALIASNAME \
	-srcstoretype jks \
	-deststoretype pkcs12

keytool -importkeystore \
	-srckeystore $TRUSTTORE_FILE \
	-destkeystore ${ALIASNAME}_trust.p12 \
	-srcalias $ALIASNAME \
	-srcstoretype jks \
	-deststoretype pkcs12

openssl pkcs12 -in ${ALIASNAME}.p12 -nokeys -out ${ALIASNAME}.pem
openssl pkcs12 -in ${ALIASNAME}_trust.p12 -nokeys -out ${ALIASNAME}_ca.pem
openssl pkcs12 -in ${ALIASNAME}.p12 -nodes -nocerts -out ${ALIASNAME}.key