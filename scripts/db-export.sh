#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# Exporta o banco local e importa no VPS de produção
# Uso: bash scripts/db-export.sh <IP_DO_VPS> <USUARIO_SSH>
# Exemplo: bash scripts/db-export.sh 123.45.67.89 root
# ─────────────────────────────────────────────────────────────────────────────

VPS_IP="${1:?Informe o IP do VPS: bash scripts/db-export.sh <IP> <USER>}"
VPS_USER="${2:-root}"
BACKUP_FILE="smm_backup_$(date +%Y%m%d_%H%M%S).sql"

echo "━━━ [1/4] Exportando banco local (container smm_postgres)..."
docker exec smm_postgres pg_dump -U postgres --no-owner --no-acl smm_app > "$BACKUP_FILE"

if [ ! -s "$BACKUP_FILE" ]; then
  echo "❌ Falha ao exportar. Verifique se o container smm_postgres está rodando."
  exit 1
fi

echo "✅ Backup criado: $BACKUP_FILE ($(du -sh "$BACKUP_FILE" | cut -f1))"

echo "━━━ [2/4] Enviando para o VPS ($VPS_USER@$VPS_IP)..."
scp "$BACKUP_FILE" "$VPS_USER@$VPS_IP:/tmp/$BACKUP_FILE"

echo "━━━ [3/4] Importando no banco de produção..."
ssh "$VPS_USER@$VPS_IP" bash << EOF
  echo "  Aguardando PostgreSQL ficar pronto..."
  until docker exec seguifacil_postgres pg_isready -U postgres; do sleep 2; done

  echo "  Importando backup..."
  docker exec -i seguifacil_postgres psql -U postgres smm_app < /tmp/$BACKUP_FILE

  rm /tmp/$BACKUP_FILE
  echo "  Limpeza feita."
EOF

echo "━━━ [4/4] Rodando migrations do Prisma no VPS..."
ssh "$VPS_USER@$VPS_IP" \
  "docker exec seguifacil_app npx prisma db push --skip-generate"

rm "$BACKUP_FILE"
echo ""
echo "✅ Banco migrado com sucesso para produção!"
