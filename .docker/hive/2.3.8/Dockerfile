FROM lenchv/base-hive:2.3.8

ARG USER_UID=1000
ARG USER_GID=1000

RUN groupadd -f -r hive --gid=$USER_GID && \
    useradd -r -g hive --uid=$USER_UID -d ${HIVE_HOME} hive && \
    chown hive:hive -R ${HIVE_HOME}

USER hive

