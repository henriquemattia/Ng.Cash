FROM node:18

RUN npm install -g http-server

WORKDIR /usr/src/app

COPY package*.json .
COPY *.json .
COPY index.html .
COPY *.config.ts .

RUN npm i

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]