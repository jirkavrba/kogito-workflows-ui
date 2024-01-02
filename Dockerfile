FROM node:latest AS build

WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm install

COPY . /app

RUN npm run build


FROM nginx:alpine

COPY --from=build /app/dist /var/www/html
COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]