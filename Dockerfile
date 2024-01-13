FROM node:18-alpine

RUN mkdir -p /app

WORKDIR /app

COPY package.json .
COPY yarn* .

RUN yarn install

COPY . .

CMD [ "yarn", "start" ]