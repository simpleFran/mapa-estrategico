#!/bin/bash
set -e

# Espera o Postgres ficar disponível
echo "Aguardando o Postgres iniciar..."
until nc -z postgres 5432; do
  sleep 1
done

echo "Postgres está pronto!"

echo "Arquivos na pasta prisma:"
ls -l prisma

# Roda as migrations
echo "Executando Prisma Migrate..."
npx prisma migrate deploy

# Importa o data.json
echo "Importando dados iniciais..."
#npx ts-node prisma/import-data.ts
npx ts-node --project tsconfig.json prisma/import-data.ts

# Inicia o servidor
echo "Iniciando o backend..."
npm run dev
