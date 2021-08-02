FROM ubuntu:latest

RUN mkdir home/html-css-js

ENV NODE_ENV development

ENV SERVER_PORT 3005

RUN apt-get update \
  && apt-get install curl -y \
  && cd ~ \
  && curl -sL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh \
  && bash nodesource_setup.sh \
  && apt-get install nodejs -y

COPY . home/html-css-js

RUN npm install -g yarn

RUN cd ../home/html-css-js \ && yarn

WORKDIR /home/html-css-js

EXPOSE 3005

CMD ["yarn", "dev"]