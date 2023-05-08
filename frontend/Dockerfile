FROM node:18-alpine AS node

WORKDIR /frontend
COPY . .
RUN npm install 
RUN npm run build --prod

FROM nginx:1.23.4-alpine
COPY --from=node /frontend/dist/io-project-app /usr/share/nginx/html

