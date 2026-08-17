FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3001

EXPOSE 50051

CMD ["npm","run","start:prod"]