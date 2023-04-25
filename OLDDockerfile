FROM node:18-alpine

WORKDIR /app

COPY ./frontend /app/frontend
COPY ./backend /app/backend
COPY start.sh /app

RUN npm install --prefix backend/ backend/
RUN npm install --prefix frontend/ frontend/

EXPOSE 3000

CMD [ "sh", "start.sh"]