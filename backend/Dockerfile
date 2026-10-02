FROM node:22-alpine AS builder
WORKDIR /app
RUN apk update && apk upgrade --no-cache
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
RUN apk update && apk upgrade --no-cache
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist

EXPOSE 5000
CMD ["node", "dist/index.js"]