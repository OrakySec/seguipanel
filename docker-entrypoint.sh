#!/bin/sh
echo "Aguardando banco de dados..."
sleep 5
node_modules/.bin/prisma db push --schema prisma/schema.prisma --skip-generate || true

echo "Iniciando aplicação..."
exec node server.js
