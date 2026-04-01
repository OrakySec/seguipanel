# Plano de Migração: SeguiFacil (PHP → Next.js 15)

Este documento detalha o status atual e o planejamento do projeto de migração completa da plataforma SeguiFacil, substituindo o legado CodeIgniter 3 + MySQL por uma stack moderna e de alta performance.

## 📌 Arquitetura e Stack
- **Frontend / Framework:** Next.js 15 (App Router, Server Components)
- **Estilização:** Tailwind CSS + Framer Motion + Componentes Radix UI
- **Backend (APIs):** Next.js Route Handlers (`/api/...`)
- **Banco de Dados:** PostgreSQL (ORM Prisma)
- **Cache/Filas:** Redis
- **Storage:** MinIO (S3 Compatible)
- **Infraestrutura:** Docker Compose

---

## ✅ Tarefas Concluídas (Feito)

### 1. Ambiente e Infraestrutura
- [x] Inicialização do projeto Next.js 15 (`smm-app`) com TypeScript e Tailwind CSS.
- [x] Configuração do `docker-compose.yml` contemplando PostgreSQL, Redis e MinIO.
- [x] Instalação de dependências principais: Prisma v6, Zod, bcryptjs, jsonwebtoken, famer-motion.
- [x] Configuração centralizada de variáveis de ambiente (`.env.example`).
- [x] Instalação e configuração do **sistema de e-mail (Nodemailer)** com templates profissionais (Layout, Pedido Confirmado, Concluído, Falha).

### 2. Banco de Dados e Modelagem (Prisma)
- [x] Mapeamento 100% fiel do schema real do dump `SeguiFacilBR.sql`.
- [x] Criação do arquivo `schema.prisma`.
- [x] Criação de modelos (`User`, `Setting`, `Order`, `Service`, `Coupon`, `TransactionLog`, `SocialNetwork`, etc).
- [x] Setup do script robusto de `seed.ts`, populando banco de dados com:
  - 1 Conta Admin padrão (`admin@admin.com`);
  - 111 Chaves de Configurações Dinâmicas (`general_options`);
  - 1 Serviço Exemplo e Categoria "Instagram".
- [x] Ajustes e scripts no `package.json` para facilitar migrações (`db:migrate`, `db:seed`, `db:reset`).

### 3. Core e Utilitários
- [x] Configuração do Prisma Client Singleton (evita exaustão de conexões no modo dev).
- [x] Helper functions robustas no `lib/utils.ts` (Formatações, Random ID e Respostas padronizadas de API).
- [x] `lib/auth.ts`: Utilitários customizados do JWT suportados pela Edge (via `jose`), gestão de Cookies HttpOnly.
- [x] Gerenciador Dinâmico `lib/settings.ts` (GET/SET das opções do painel Admin).
- [x] Middleware Global interceptando `/admin`, blindando rotas internas e redirecionando não logados.

### 4. Endpoints Essenciais (APIs Backend)
- [x] **Auth:** `/api/auth/login` (Zod + Bcrypt), `/api/auth/logout` e `/api/auth/me`.
- [x] **Configurações:** `/api/admin/settings` (GET/PUT) bloqueando sobrescritas de tokens sensíveis do .env.
- [x] **Cupons:** `/api/coupons/validate` (valida regras, limites e estado de atividade).
- [x] **Catálogo:** `/api/services` (listagem aninhada para exibir as ofertas organizadas pro cliente).
- [x] **Checkout:** `/api/checkout/process` validando carrinho, descontos, cadastrando "Customer" temporário e ativando o **pagamento da API PushinPay Pix**.
- [x] **PushinPay Webhook:** `POST /api/webhooks/pushinpay` preparado para escutar confirmação, alterar saldo, disparar e-mail de confirmação e rodar CRON/conversões GA4/Facebook Pixel assincronamente.
- [x] **Status Polling:** `/api/checkout/status/[id]` para interrogação AJAX pelo frontend a cada 3s.

---

## ⏳ Tarefas Pendentes (A Fazer)

### Fase 5 — Frontend Público (Loja / Loja Boutique)
- [ ] Construir Layout Base (Header animado, Footer e Float Widget WhatsApp).
- [ ] Landing Page principal exibindo Redes Sociais → Categorias → Serviços em Modal ou Cards limpos.
- [ ] Interface rica do **Fluxo de Checkout**: Visualizar resumo do pedido, campo Link+Email e inserir Cupom.
- [ ] Tela/Modal de Pagamento PIX e animação real-time confirmando a compra.
- [ ] Tela de Sucesso.
- [ ] Portal "Meus Pedidos" para consulta do cliente sem necessidade de senha de login.

### Fase 6 — Novo Painel Administrativo do SeguiFacil
- [ ] Tela de Login Admin UI limpa e profissional.
- [ ] Estruturação do Dashboard (Sidebar estática).
- [ ] Dashboard View: Gráficos de Faturamento e Orders Pendentes.
- [ ] Gerenciamento: Tabela CRUD "Pedidos" (trocar status, visualizar transações e log PIX).
- [ ] Gerenciamento: Tabela CRUD "Serviços/Categorias/Social Networks".
- [ ] Integração Visual SMM: Página de "Sincronização" API Provider x Catalogo Local.
- [ ] Gerenciamento: "Cupons" (criar voucher, expiracao).
- [ ] Tela Geral de "Configurações Globais" com Formulário alimentando a API `settings`. (A tela de venda no CodeCanyon exige 0 hardcode).

### Fase 7 — CRON, Provedores SMM (Backend Final)
- [ ] Rota CRON Authentificada: `POST /api/cron/process-orders` para automatizar o despacho do pedido pendente ao servidor SMM estrangeiro.
- [ ] Rota CRON Authentificada: `POST /api/cron/check-status` sincroniza estatus de Completed/Remains.
- [x] Lógica: `send-email` Notificações via Nodemailer baseadas na chave `smtp_*`. (Concluído por você em `lib/email.ts`)

### Fase 8 — Finalização & Produto CodeCanyon
- [ ] Conectar upload do MinIO para imagens/logos do sistema.
- [ ] Logs estruturados para facilitar suporte em hospedagens simples.
- [ ] Refinar documentação README para deploy Docker vs Deploy Vercel (Público leigo focado em ganhar grana).
