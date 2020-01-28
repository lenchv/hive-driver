# tcp nosasl
!connect jdbc:hive2://127.0.0.1:10000/;auth=noSasl
# tcp nosasl ssl
!connect jdbc:hive2://volodymyr.local:10000/;auth=nosasl;ssl=true;sslTrustStore=/opt/ssl/truststore.jks;trustStorePassword=1a2b3c;
# http nosasl
!connect jdbc:hive2://localhost:10001/default;transportMode=http;httpPath=/hive;auth=nosasl