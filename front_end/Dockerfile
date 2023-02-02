FROM node:18-alpine3.15 as build
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./

RUN npm install -g serve
RUN npm install --omit=dev

COPY . ./
RUN npm run build

EXPOSE 3000
CMD ["serve", "-s", "build", "-p", "3000"]