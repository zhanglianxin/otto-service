FROM node:12-alpine
LABEL maintainer="coolman@coolman.site"

COPY . /app

WORKDIR /app

RUN npm install

USER node
EXPOSE 9998

CMD ["npm", "run", "start"]
