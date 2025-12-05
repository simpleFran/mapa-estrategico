# Usa imagem oficial do Node.js
FROM node:20

# Instalar netcat
RUN apt-get update && apt-get install -y netcat-openbsd

# Diretório dentro do container
WORKDIR /usr/src/app

# Copia package.json e package-lock.json
COPY package.json package-lock.json* ./

# Instala as dependências
RUN npm install

# Copia o resto do projeto
COPY . .

#Atualiza sempre para última versão do Prisma Client
RUN npm install @prisma/client@latest
# Gera Prisma Client
RUN npx prisma generate

# Expondo porta da aplicação
EXPOSE 4000

# Copia o entrypoint que vamos criar
COPY docker-entrypoint.sh /usr/src/app/docker-entrypoint.sh
RUN chmod +x /usr/src/app/docker-entrypoint.sh

# Comando padrão
ENTRYPOINT ["./docker-entrypoint.sh"]
