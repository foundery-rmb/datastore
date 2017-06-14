FROM node:8.1.0-alpine

EXPOSE 8080

WORKDIR /app

COPY package.json ./package.json

RUN npm --unsafe-perm install

COPY server.js ./server.js

CMD node server.js
