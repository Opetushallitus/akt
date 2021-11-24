FROM node:14.18.1-alpine
WORKDIR /app/reactjs

COPY package*.json ./
RUN npm ci --silent

COPY . ./

CMD ["npm", "start"]