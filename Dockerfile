FROM node:18-alpine

RUN apk add --update --no-cache bash dos2unix libintl icu
RUN mkdir -p /caridea/app

COPY ./cliapp /caridea/app

WORKDIR /caridea/app

#RUN bash ./TwitchDownloaderCLI

RUN npm install

CMD ["node", "twitchdl.js"]

