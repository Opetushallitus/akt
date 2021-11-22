FROM node:14-slim

WORKDIR /app/reactjs

ADD package.json ./

RUN npm i --silent

ADD . ./

RUN npm run build

CMD ["npm", "start"]
