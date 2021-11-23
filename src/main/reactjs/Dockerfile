FROM node:14.18.1
ARG npmversion=npm@8.1.3
WORKDIR /app/reactjs

# Pin npm version globally so that it won't get overwritten 
# by the package.json copied in later steps. 
RUN npm i -g --silent ${npmversion}

COPY package*.json ./
RUN npm ci --silent

COPY . ./

RUN npm run build

CMD ["npm", "start"]
