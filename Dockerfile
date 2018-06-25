FROM node:10.0.0

EXPOSE 3000 9229

WORKDIR /usr/src/app

RUN npm install nodemon --global; \
	npm install mocha --global; \
	npm install jest --global; \
	npm install express-generator --global; \
	npm install eslint --global