#!/bin/sh
set -e

echo "Aplicando schema no banco (com retry até o banco estar pronto)..."
until node_modules/.bin/prisma db push --schema prisma/schema.prisma --skip-generate; do
  echo "Banco ainda não disponível, tentando novamente em 3s..."
  sleep 3
done

echo "Iniciando aplicação..."
exec node server.js
