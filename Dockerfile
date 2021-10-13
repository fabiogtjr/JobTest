FROM node:14

WORKDIR /node-app

COPY package*.json ./

RUN yarn install --silent

RUN yarn global add nodemon

COPY . . 

EXPOSE 8080

CMD yarn dev