FROM node:18

WORKDIR /usr/src/app/server

COPY package*.json ./server

RUN npm i

COPY . ./server

EXPOSE 3030

CMD [ "npm", "run", "migration:run" && "npm", "start" ]

# CMD ["npm", "start"]
