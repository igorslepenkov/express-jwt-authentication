FROM node:19-alpine3.16
WORKDIR /app
COPY /dist/src /app/src
COPY /package.json /app/
ENV NODE_ENV=production
RUN npm install --production
CMD node ./src/app.js