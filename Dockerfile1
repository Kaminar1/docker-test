FROM node:13-alpine

ENV MONGO_DB_USERNAME=mongoadmin \
    MONGO_DB_PWD=coco

RUN mkdir -p /home/app

COPY ./app /home/app

# set default dir so that next commands executes in /home/app dir
WORKDIR /home/app

RUN npm install

CMD ["node", "server.js"]

