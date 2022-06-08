FROM node:16

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --immutable --immutable-cache --check-cache

COPY . .

RUN yarn build

ENV NODE_ENV=production

EXPOSE 8080

CMD [ "node", "dist/index.js" ]