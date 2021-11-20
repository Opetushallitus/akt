FROM node:14-slim

RUN mkdir -p /app/reactjs

WORKDIR /app/reactjs

COPY .babelrc ./
COPY .eslintrc.json ./
COPY .prettierrc.json ./
COPY cypress.json ./
COPY jest-setup.ts ./
COPY jest.config.json ./
COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json ./
COPY webpack.config.js ./

RUN npm install

CMD ["npm", "start"]
