# ---------- STAGE 1: BUILD ----------
FROM mcr.microsoft.com/playwright:v1.57.0-jammy AS build
WORKDIR /app

# Copiamos manifest antes para aprovechar cache
COPY package*.json ./

# Instalar dependencias completas (dev incluidas)
RUN npm ci

# Copiar resto del código
COPY . .

# Compilar TypeScript
RUN npm run build

# ---------- STAGE 2: RUN ----------
FROM mcr.microsoft.com/playwright:v1.57.0-jammy AS runner
WORKDIR /app

# Copiar solo production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copiar solo el build, no node_modules entero
COPY --from=build /app/dist ./dist

# Los navegadores YA están instalados en esta imagen base
# NO necesitas instalar chromium otra vez
# RUN npx playwright install --with-deps chromium   ❌ QUITAMOS

EXPOSE 3000
CMD ["node", "dist/server.js"]
