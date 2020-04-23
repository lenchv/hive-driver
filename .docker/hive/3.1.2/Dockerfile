FROM lenchv/base-hive:3.1.2

ARG USER_UID=1000
ARG USER_GID=1000

RUN groupadd -f -r hive --gid=$USER_GID && \
    useradd -r -g hive --uid=$USER_UID -d ${HIVE_HOME} hive && \
    mkdir -p /tmp/hive && \
	chown hive:hive -R ${HIVE_HOME} && \
    chown hive:hive -R /tmp && \
	chmod 777 /tmp/hive

USER hive
