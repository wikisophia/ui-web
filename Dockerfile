FROM node:12.8.1 AS builder

WORKDIR /usr/src/app
COPY package.json ./
COPY package-lock.json ./
RUN npm ci
COPY . ./
RUN npm run build

FROM node:12.8.1 AS prod
WORKDIR /usr/src/app
ENV NODE_ENV production
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/server.js ./server.js
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/package-lock.json ./package-lock.json
RUN npm ci --only=production
EXPOSE 4040
CMD ["node", "./server.js"]
