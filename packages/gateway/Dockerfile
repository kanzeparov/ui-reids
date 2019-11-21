ARG builder

FROM ${builder} as builder
FROM node:lts

ARG yarnrc="/usr/local/share/.yarnrc"

COPY ./ext ./ext

RUN apt-get update && \
    apt-get install -y alien && \
    alien --scripts -i ext/oracle-instantclient19.3-basic-19.3.0.0.0-1.x86_64.rpm && \
    alien --scripts -i ext/oracle-instantclient19.3-devel-19.3.0.0.0-1.x86_64.rpm && \
    alien --scripts -i ext/oracle-instantclient19.3-sqlplus-19.3.0.0.0-1.x86_64.rpm && \
    apt-get install -y libaio1

COPY --from=builder ${yarnrc} ${yarnrc}
COPY --from=builder /opt /opt

WORKDIR /opt/packages/gateway

EXPOSE 9001

CMD ["/usr/local/bin/node", "lib/server.js"]
