FROM node:22-alpine AS builder
WORKDIR /app
RUN apk update && apk upgrade --no-cache
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:mainline-alpine
RUN apk update && apk upgrade --no-cache
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
