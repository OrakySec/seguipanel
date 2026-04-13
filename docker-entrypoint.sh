#!/bin/sh
echo "Aguardando banco de dados..."
sleep 5

echo "Aplicando schema no banco..."
node_modules/.bin/prisma db push --schema prisma/schema.prisma --skip-generate

echo "Iniciando aplicação..."
exec node server.js
