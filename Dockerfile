FROM node:10

ADD . /client
WORKDIR /client

RUN npm ci 
RUN npm run prepublishOnly

FROM nginx
COPY --from=0 /client/dist /usr/share/nginx/html

RUN rm -v /etc/nginx/conf.d/default.conf
COPY nginx-default.conf /etc/nginx/conf.d/

EXPOSE 80
CMD sed -i -e 's/\/generated\//'"$DOMAIN"'\/generated\//g' /usr/share/nginx/html/index.html && sed -i -e 's/\/generated\//'"$DOMAIN"'\/generated\//g' /usr/share/nginx/html/sw.js && nginx -g 'daemon off;'
