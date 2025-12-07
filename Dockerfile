# Usa la imagen base con dependencias y navegadores de Playwright
FROM mcr.microsoft.com/playwright:v1.57.0-noble

# Variable para que Playwright use los navegadores preinstalados en la imagen
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

# Establece directorio de trabajo
WORKDIR /usr/src/app

# Copia package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias (incluye playwright)
RUN npm install

# Copia el resto del código
COPY . .

# Compila TypeScript a JavaScript
RUN npm run build

# Expone el puerto que usará tu aplicación
EXPOSE 3000

# Define el comando de inicio. Azure leerá el puerto desde process.env.PORT
CMD ["npm", "start"]
