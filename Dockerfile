FROM node:carbon

ADD . ./client
WORKDIR /client

RUN npm install 
RUN npm run prepublishOnly

FROM nginx
COPY dist /usr/share/nginx/html

EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]