FROM node:alpine
WORKDIR /home/www
COPY . .
RUN npm install
EXPOSE 80
VOLUME [ "/home/www/config.js" ]
CMD ["npm","start"]