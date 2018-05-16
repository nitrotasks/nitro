FROM node:carbon

ADD . /client
WORKDIR /client

RUN npm install 
RUN npm run prepublishOnly

FROM nginx
COPY --from=0 /client/dist /usr/share/nginx/html

RUN rm -v /etc/nginx/conf.d/default.conf
COPY nginx-default.conf /etc/nginx/conf.d/

EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
