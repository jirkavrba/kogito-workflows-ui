FROM node:latest AS build

WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm install

COPY . /app

RUN npm run build


FROM nginx:alpine

WORKDIR /workspace
RUN apk add --no-cache bash

COPY --from=build /app/dist /var/www/html
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/entrypoint.sh /workspace/entrypoint.sh

EXPOSE 80

ENTRYPOINT [ "bash", "/workspace/entrypoint.sh" ]
