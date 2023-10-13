#next.js app
FROM node:16-alpine as builder

WORKDIR /frontend

RUN npm install --global pm2

COPY ../frontend/package*.json .

RUN npm cache clean --force && \
    npm install --production

COPY ../frontend .

RUN npm run build

EXPOSE 3000

USER node

CMD [ "pm2-runtime", "npm", "--", "start" ]
