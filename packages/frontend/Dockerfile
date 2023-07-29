# FROM node:lts
FROM node:18.10.0

WORKDIR /app

COPY package*.json ./

# Clear npm cache
RUN npm cache clean --force

# Install dependencies
# RUN npm install -g yarn

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]