#!/bin/bash

HIVE_HOSTNAME="$(hostname -f)"
SSL_PASSWORD="1a2b3c"

keytool -genkey -noprompt \
	-alias $HIVE_HOSTNAME \
	-dname "CN=$HIVE_HOSTNAME, OU=, O=lenchv, L=, S=, C=" \
	-keyalg RSA \
	-keystore keystore.jks \
	-keysize 2048 \
	-storepass $SSL_PASSWORD \
 	-keypass $SSL_PASSWORD
keytool -export -alias $HIVE_HOSTNAME -file hive_ssl.crt -keystore keystore.jks
keytool -import -trustcacerts -alias $HIVE_HOSTNAME -file hive_ssl.crt -keystore truststore.jks
