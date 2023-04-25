FROM node:18-alpine

WORKDIR /frontend
COPY . /frontend

RUN npm install 

EXPOSE 4200

CMD [ "npm", "run","dockerStart"]