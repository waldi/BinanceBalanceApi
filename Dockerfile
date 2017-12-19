FROM mhart/alpine-node:8

WORKDIR /app
COPY . .

RUN npm install --production

EXPOSE 8030
CMD ["node", "run.js"]
