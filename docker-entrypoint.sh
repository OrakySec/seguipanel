#!/bin/sh
echo "Aguardando banco de dados..."

# Aguarda o banco ficar disponível (até 30s)
MAX=30
COUNT=0
until node_modules/.bin/prisma db execute --stdin --schema prisma/schema.prisma <<< "SELECT 1" > /dev/null 2>&1; do
  COUNT=$((COUNT+1))
  if [ "$COUNT" -ge "$MAX" ]; then
    echo "Banco não respondeu após ${MAX}s. Continuando mesmo assim..."
    break
  fi
  echo "Aguardando banco... (${COUNT}/${MAX})"
  sleep 1
done

echo "Aplicando schema no banco..."
node_modules/.bin/prisma db push --schema prisma/schema.prisma --skip-generate

echo "Iniciando aplicação..."
exec node server.js
