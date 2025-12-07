FROM mcr.microsoft.com/playwright:v1.57.0-noble

ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
