FROM node:14-alpine as builder

COPY . /app

WORKDIR /app

RUN npm install

FROM node:14-alpine

COPY --from=builder /app /app

WORKDIR /app

USER node
EXPOSE 9998

CMD ["npm", "run", "start"]
