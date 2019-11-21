ARG builder
ARG base="node:lts"

FROM ${builder} as builder
FROM ${base}

ARG yarnrc="/usr/local/share/.yarnrc"

COPY --from=builder ${yarnrc} ${yarnrc}
COPY --from=builder /opt /opt
COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /opt/packages/web
