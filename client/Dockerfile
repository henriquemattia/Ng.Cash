FROM node:18

RUN npm install -g http-server

WORKDIR /usr/src/app/client

COPY package*.json ./client

RUN npm i

COPY . ./client

RUN npm run build

EXPOSE 5173

CMD ["http-server", "dist"]