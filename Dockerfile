FROM node:16-alpine
ARG PROFILE
WORKDIR  /usr/src/app
COPY  package.json ./
RUN npm install
COPY . .
EXPOSE 31701
ENV NODE_ENV=$PROFILE
RUN echo "$NODE_ENV"
CMD ["node" , "server.js"]