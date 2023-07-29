# FROM node:lts
FROM node:18.10.0

WORKDIR /app

COPY package*.json ./

COPY .env.docker /app/.env

# Clear npm cache
RUN npm cache clean --force

# Install dependencies
# RUN npm install -g yarn

RUN yarn install

COPY . .

RUN yarn build

RUN chmod +x dist/main.js

EXPOSE 4000

CMD ["yarn", "start:prod"]