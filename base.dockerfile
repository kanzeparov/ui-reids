ARG NODE_ENV="development"

FROM node:lts as builder

WORKDIR /opt

COPY . .

ARG OFFLINE_CACHE="/opt/yarn-offline-cache"

RUN yarn config set yarn-offline-mirror ${OFFLINE_CACHE} && \
    yarn config set yarn-offline-mirror-pruning true

RUN yarn bootstrap

ENV NODE_ENV ${NODE_ENV}
