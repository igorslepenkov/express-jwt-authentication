FROM node:19-alpine3.16
WORKDIR /app
COPY /dist/src /app/src
COPY /package.json /app/
COPY /src/docs /app/src/docs
COPY /src/views /app/src/views
RUN npm install --production
ENV NODE_ENV=production
CMD node ./src/app.js