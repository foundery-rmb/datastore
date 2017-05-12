FROM node:7.10-alpine

EXPOSE 8080

#mkdir /app

WORKDIR /app

COPY package.json ./package.json

RUN npm --unsafe-perm install

COPY server.js ./server.js

CMD node server.js
