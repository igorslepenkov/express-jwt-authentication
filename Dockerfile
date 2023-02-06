FROM node:19-alpine3.16
WORKDIR /app
COPY /build /app/src
COPY /package.json /app/
COPY /src/docs /app/src/docs
RUN npm install --production
CMD node ./src/index.js