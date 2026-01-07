FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 5001

ENV NODE_ENV=production

CMD [ "npm","start" ]