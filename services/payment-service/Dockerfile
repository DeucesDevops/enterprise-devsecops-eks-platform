FROM node:26-alpine

WORKDIR /app
COPY src/server.js .

USER node
EXPOSE 3004
CMD ["node", "server.js"]
