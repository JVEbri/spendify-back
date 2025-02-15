# 1️⃣ Usa una imagen oficial de Node.js
FROM node:22

# 2️⃣ Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# 3️⃣ Copia los archivos del package.json y package-lock.json
COPY package*.json ./

# 4️⃣ Instala las dependencias
RUN npm install --only=production

RUN npm install -g @nestjs/cli

# 5️⃣ Copia el código fuente al contenedor
COPY . .

# 6️⃣ Construye la aplicación
RUN npm run build


# 7️⃣ Expone el puerto en el que corre NestJS (3000 por defecto)
EXPOSE 3000

# 8️⃣ Comando de inicio (igual que en local)
CMD ["npm", "run", "start"]
