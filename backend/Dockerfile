ARG NODE_VERSION

FROM node:$NODE_VERSION-alpine

ENV NODE_ENV="production"

RUN mkdir -p /usr/app

COPY . /usr/app/

RUN chown -R node:node /usr/app
USER node

WORKDIR /usr/app
CMD ["node", "src/server.js"]
