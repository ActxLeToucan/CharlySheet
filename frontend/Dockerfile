FROM node:lts-alpine as build-stage
ARG VITE_API_HOST
ARG VITE_SOCKETIO_HOST
ENV VITE_API_HOST=$VITE_API_HOST
ENV VITE_SOCKETIO_HOST=$VITE_SOCKETIO_HOST
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
