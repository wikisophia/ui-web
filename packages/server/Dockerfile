FROM node:12.7.0 AS builder

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build

FROM node:12.7.0 AS prod
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/build ./build
COPY --from=builder /usr/src/app/views ./views
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/package-lock.json ./package-lock.json
RUN npm ci --only=production
EXPOSE 4040
CMD ["node", "build/server.js"]
