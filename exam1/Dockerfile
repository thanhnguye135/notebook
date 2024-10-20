FROM node:23-slim AS build

WORKDIR /usr/src/app

COPY package*.json yarn*.lock ./
RUN yarn install --production

COPY . .

FROM node:23-slim AS product

WORKDIR /usr/src/app

COPY --from=build /usr/src/app .

EXPOSE 8386

CMD ["yarn", "start:dev"]
