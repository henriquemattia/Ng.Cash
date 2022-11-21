FROM node:18

WORKDIR /usr/src/app/client

COPY package*.json ./client

RUN npm i

COPY . .

EXPOSE 5173

RUN npm run build