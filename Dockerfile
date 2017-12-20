FROM node:8.9.3-alpine

WORKDIR /app
COPY . .

RUN npm install --production

EXPOSE 8030
CMD ["node", "run.js"]
