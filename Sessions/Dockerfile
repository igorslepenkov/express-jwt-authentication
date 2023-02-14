FROM node:19-alpine3.16
WORKDIR /app
COPY /dist/src /app/src
COPY /package.json /app/
RUN npm install --production
ENV NODE_ENV=production
CMD node ./src/app.js