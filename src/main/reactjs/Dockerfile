FROM node:16.13.1-alpine
WORKDIR /app/reactjs

COPY package*.json ./
RUN npm ci --silent --ignore-scripts

COPY . ./

CMD ["npm", "run", "start:docker-compose"]