FROM mhart/alpine-node:7.4

RUN apk add --update imagemagick bash \
    && rm -rf /var/cache/apk/*

RUN npm install -g pm2

RUN mkdir -p /mnt/data
VOLUME ["/mnt/data"]

ADD package.json /tmp/package.json
RUN cd /tmp \
    && npm install
RUN mkdir -p /apps \
    && cp -a /tmp/node_modules /apps

WORKDIR /apps
ADD . /apps
RUN npm run build

EXPOSE 3000
ADD start.sh /start.sh
RUN chmod 766 /start.sh
CMD ["/start.sh"]
