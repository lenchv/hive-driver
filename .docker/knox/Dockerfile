FROM lenchv/knox:0.13.0

ARG USER_UID=1000
ARG USER_GID=1000

RUN env DEBIAN_FRONTEND=noninteractive apt-get install -y expect

COPY run.sh /run-knox.sh
COPY ssl/generate.sh /generateSsl.sh
COPY create-master /create-master

RUN chmod +x /run-knox.sh && \
	chmod +x /generateSsl.sh && \
	chmod +x /create-master && \
	/create-master

RUN groupadd -f -r knox --gid=$USER_GID && \
    useradd -r -g knox --uid=$USER_UID -d ${GATEWAY_HOME} knox && \
    chown knox:knox -R ${GATEWAY_HOME}

USER knox

# Expose the port
EXPOSE 8080
EXPOSE 8443

# Start knox
CMD ["/run-knox.sh"]

# !connect jdbc:hive2://volodymyr.local:8443/;ssl=true;sslTrustStore=/opt/knox-0.13.0/data/security/keystores/gateway.jks;trustStorePassword=knox-password;transportMode=http;httpPath=gateway/sandbox/hive guest