FROM node:26-alpine

WORKDIR /app
COPY src/server.js .

USER node
EXPOSE 3005
CMD ["node", "server.js"]
