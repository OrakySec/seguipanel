#!/bin/sh
echo "Aguardando banco de dados..."

until nc -z postgres 5432; do
  echo "Banco ainda não está pronto, aguardando 3s..."
  sleep 3
done

echo "Banco disponível!"
echo "Iniciando aplicação..."
exec node server.js
