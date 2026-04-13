# SeguiFacil SMM App — Documentação do Sistema

> Última atualização: 2026-04-11
> Stack: Next.js 16.2.1 · React 19 · TypeScript · Prisma 6 · PostgreSQL · Docker

---

## Visão Geral

Plataforma de e-commerce para serviços de SMM (Social Media Marketing). Clientes compram seguidores, curtidas e outros engajamentos para redes sociais. Pagamento exclusivo via PIX (PushinPay). Entrega automatizada via APIs de provedores SMM externos. Administração completa via painel restrito.

---

## Estrutura de Diretórios

```
smm-app/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── page.tsx                # Home pública
│   │   ├── layout.tsx              # Layout raiz
│   │   ├── globals.css             # Estilos globais
│   │   ├── comprar-servico/[id]/   # Página de detalhe/compra do serviço
│   │   ├── checkout/               # Página de pagamento PIX
│   │   ├── meus-pedidos/           # Histórico de pedidos do cliente
│   │   ├── [slug]/                 # Páginas dinâmicas (blog, políticas, termos)
│   │   ├── auth/login/             # Login do admin
│   │   ├── admin/                  # Painel administrativo (protegido)
│   │   │   ├── page.tsx            # Dashboard (stats, pedidos pendentes)
│   │   │   ├── pedidos/            # Gestão de pedidos
│   │   │   ├── categorias/         # Redes sociais e categorias
│   │   │   ├── servicos/           # CRUD de serviços
│   │   │   ├── usuarios/           # Gestão de usuários
│   │   │   ├── financeiro/         # Dashboard financeiro
│   │   │   └── configuracoes/      # Configurações do sistema
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── login/          # POST — autenticação JWT
│   │       │   ├── logout/         # POST — encerra sessão
│   │       │   └── me/             # GET — sessão atual
│   │       ├── checkout/
│   │       │   ├── process/        # POST — inicia pagamento PIX
│   │       │   └── status/[id]/    # GET — polling status pagamento
│   │       ├── webhooks/
│   │       │   └── pushinpay/      # POST — confirmação de pagamento
│   │       ├── cron/
│   │       │   ├── process-orders/ # POST — despacha pedidos para SMM API
│   │       │   └── check-status/   # POST — atualiza status de entrega
│   │       ├── coupons/validate/   # POST — valida cupom de desconto
│   │       ├── services/           # GET — catálogo público de serviços
│   │       └── admin/
│   │           ├── settings/       # POST — atualiza configurações
│   │           ├── sync-quantities/
│   │           ├── recalculate-prices/
│   │           └── order-api-status/[id]/
│   ├── components/                 # Componentes React reutilizáveis
│   └── lib/                        # Utilitários e lógica central
│       ├── auth.ts                 # JWT sign/verify + session helpers
│       ├── payment-processor.ts    # Lógica central de confirmação de pagamento
│       ├── evolution.ts            # WhatsApp via Evolution API
│       ├── email.ts                # Envio de email via Nodemailer
│       └── prisma.ts               # Instância singleton do Prisma Client
├── prisma/
│   ├── schema.prisma               # Schema completo do banco
│   └── migrations/                 # Migrations geradas pelo Prisma
├── scripts/                        # Scripts utilitários
├── public/                         # Assets estáticos
├── Dockerfile
├── docker-compose.yml
├── next.config.ts
├── tsconfig.json
└── .env.example
```

---

## Rotas Públicas

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/` | `src/app/page.tsx` | Home: hero, plataformas, serviços populares, FAQ, depoimentos |
| `/comprar-servico/[id]` | `src/app/comprar-servico/[id]/page.tsx` | Detalhe do serviço + formulário de compra |
| `/checkout` | `src/app/checkout/page.tsx` | Exibe QR Code PIX + polling de status |
| `/meus-pedidos` | `src/app/meus-pedidos/page.tsx` | Histórico de pedidos do cliente (por email) |
| `/[slug]` | `src/app/[slug]/page.tsx` | Páginas de conteúdo dinâmicas (blog, termos, políticas) |
| `/auth/login` | `src/app/auth/login/page.tsx` | Login do administrador |

## Rotas Admin (protegidas — ADMIN ou SUPPORTER)

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/admin` | `src/app/admin/page.tsx` | Dashboard: faturamento, pedidos pendentes, stats |
| `/admin/pedidos` | `src/app/admin/pedidos/` | Listagem e busca de pedidos |
| `/admin/categorias` | `src/app/admin/categorias/` | Redes sociais + categorias CRUD |
| `/admin/servicos` | `src/app/admin/servicos/` | Serviços CRUD + operações em bulk |
| `/admin/usuarios` | `src/app/admin/usuarios/` | Gestão de usuários |
| `/admin/financeiro` | `src/app/admin/financeiro/` | Transações, extrato, refunds |
| `/admin/configuracoes` | `src/app/admin/configuracoes/` | Configurações gerais do sistema |

---

## API Routes

### Autenticação

#### `POST /api/auth/login`
- Valida email/senha com bcrypt contra model `User`
- Role obrigatória: `ADMIN` ou `SUPPORTER`
- Emite JWT (HS256, 7 dias) em cookie httpOnly `smm_token`

#### `POST /api/auth/logout`
- Remove o cookie `smm_token`

#### `GET /api/auth/me`
- Retorna payload JWT do cookie atual (verificação de sessão)

---

### Checkout e Pagamento

#### `POST /api/checkout/process`
**Arquivo:** `src/app/api/checkout/process/route.ts`

Fluxo:
1. Valida corpo com Zod (`serviceId`, `link`, `email`, `whatsapp`, quantidade)
2. Busca serviço no banco, valida status
3. Cria/encontra `User` (role=CUSTOMER) pelo email
4. Valida cupom e calcula desconto
5. Chama PushinPay `POST /api/pix/cashIn` com valor final
6. Cria `TransactionLog` com `status=0` (pendente), `orderDetails` em JSON
7. Retorna `{ transactionId, pixCode, qrCodeUrl, amount }`

#### `GET /api/checkout/status/[id]`
**Arquivo:** `src/app/api/checkout/status/[id]/route.ts`

- Recebe `transactionId` (UUID PushinPay)
- Consulta `TransactionLog` local primeiro
- Se `status=1`: retorna `{ paid: true }`
- Caso contrário: consulta PushinPay API
- Se `paid`: chama `processConfirmedPayment()` (idempotente)

---

### Webhook

#### `POST /api/webhooks/pushinpay`
**Arquivo:** `src/app/api/webhooks/pushinpay/route.ts`

- Aceita JSON ou `application/x-www-form-urlencoded`
- Verifica token opcional `PUSHINPAY_WEBHOOK_SECRET`
- Detecta status `paid/PAID/approved/completed`
- Chama `processConfirmedPayment()` (idempotente via `transactionId`)
- Dispara eventos GA4 e Facebook CAPI (fire-and-forget)
- Retorna 200 imediatamente

---

### Cron Jobs (requerem `Authorization: Bearer CRON_SECRET`)

#### `POST /api/cron/process-orders`
**Arquivo:** `src/app/api/cron/process-orders/route.ts`

- Busca Orders com `type=api`, `status=pending`, `apiOrderId=0`
- Agrupa por `apiProviderId`
- Chama SMM API `action=add` por provedor
- Atualiza `apiOrderId` e `status=processing`

#### `POST /api/cron/check-status`
**Arquivo:** `src/app/api/cron/check-status/route.ts`

- Busca Orders com `status IN (pending, processing, inprogress)`
- Cooldown de 3 minutos entre verificações por pedido
- Consulta SMM API `action=status` em batch (máx 100 por request)
- Normaliza status: `inprogress/active → inprogress`, `cancelled → canceled`
- Atualiza `remains`, `startCounter`
- `completed`: envia email de confirmação
- `canceled`: dispara reembolso automático via PushinPay
- `partial`: envia email de entrega parcial

---

### Outros

#### `POST /api/coupons/validate`
- Valida `code`, retorna `discountPercentage` ou erro

#### `GET /api/services`
- Retorna todas redes sociais ativas com categorias e serviços
- Ordenado por `sortOrder`

#### `POST /api/admin/settings` (ADMIN only)
- Upsert de settings no model `Setting`
- Bloqueia chaves protegidas: `JWT_SECRET`, `DATABASE_URL`, `CRON_SECRET`, etc.

---

## Schema do Banco (Prisma + PostgreSQL)

### User
```
id            Int       @id @autoincrement
role          ADMIN | SUPPORTER | CUSTOMER
email         String    @unique
password      String    (bcrypt)
firstName     String?
lastName      String?
whatsapp      String?
timezone      String?
totalOrders   Int
totalSpent    Decimal
apiKey        String?   @unique
customRate    Float?
status        Int       (1=ativo, 0=inativo)
```

### Order
```
id            Int       @id @autoincrement
userId        Int       → User
serviceId     Int       → Service
type          direct | api
status        pending | processing | inprogress | completed | canceled | partial
charge        Decimal   (valor pago em BRL)
link          String    (URL do perfil/conteúdo)
quantity      Int
apiProviderId Int?      → ApiProvider
apiServiceId  Int?      (ID do serviço no provedor externo)
apiOrderId    Int       (ID do pedido na SMM API, 0=não enviado)
startCounter  Int?      (contador inicial de seguidores)
remains       Int?      (faltando entregar)
createdAt     DateTime
updatedAt     DateTime
```

**Índices:** `(userId, status)`, `(status, type)`, `(apiOrderId, status)`

### TransactionLog
```
id              Int       @id @autoincrement
userId          Int       → User
transactionId   String    @unique  (UUID PushinPay)
paymentType     String    (pushinpay)
orderId         Int?      → Order  (setado após confirmação)
orderDetails    Json      (serviceId, link, email, whatsapp, couponCode, qty, etc.)
amount          Float     (em BRL)
status          Int       (0=pendente, 1=confirmado)
refundStatus    String?
refundId        String?
refundAmount    Float?
refundDate      DateTime?
createdAt       DateTime
```

### Service
```
id              Int       @id @autoincrement
categoryId      Int       → Category
name            String
description     String?
price           Decimal(15,4)   (preço de venda)
originalPrice   Decimal(15,4)   (preço riscado = price * (1 + discount/100))
discount        Float?    (% de desconto exibido)
quantity        Int       (quantidade padrão por pedido)
minOrder        Int
maxOrder        Int
addType         MANUAL | API
apiProviderId   Int?      → ApiProvider
apiServiceId    Int?
isBestSeller    Boolean
status          Int       (1=ativo, 0=inativo)
sortOrder       Int
```

### Category
```
id              Int       → SocialNetwork
socialNetworkId Int
name            String
description     String?
requiredField   String?   (ex: "username" para TikTok)
videoTutorial   String?
sortOrder       Int
status          Int
```

### SocialNetwork
```
id              Int       @id @autoincrement
name            String
urlSlug         String    @unique
description     String?
image           String?
pageTitle       String?
metaKeywords    String?
metaDescription String?
sortOrder       Int
status          Int
```

### ApiProvider
```
id              Int       @id @autoincrement
name            String
url             String    (endpoint da API SMM)
apiKey          String
type            standard | custom
balance         Float?
currencyCode    String?
```

### Coupon
```
id              Int       @id @autoincrement
code            String    @unique
name            String
type            percentage | fixed
value           Float
usageLimit      Int?
usedCount       Int
isActive        Boolean
expiresAt       DateTime?
```

### Setting (chave-valor)
```
id      Int     @id
key     String  @unique
value   String
```

### Outros models
- `ExclusiveOffer` — Ofertas bundle (produto principal + serviço extra)
- `Blog` / `CustomPage` — CMS de conteúdo
- `Faq` — Perguntas frequentes
- `UserLog` — Histórico de login/acesso
- `BlockedIp` — Lista de IPs banidos

---

## Autenticação

**Arquivo:** `src/lib/auth.ts`

- JWT com `jose` (HS256, secret=`JWT_SECRET`)
- Cookie httpOnly `smm_token` (7 dias, Secure em produção, SameSite=Lax)
- Payload: `{ userId, email, role }`
- Funções: `signToken()`, `verifyToken()`, `getSessionFromCookies()`, `getSessionFromRequest()`

**Middleware:** `src/middleware.ts`

- Protege `/admin/*` e `/api/admin/*`
- Roles permitidas: `ADMIN`, `SUPPORTER`
- `CUSTOMER` é bloqueado com redirect para `/`
- Usuário autenticado acessando `/auth/login` é redirecionado para `/admin`

---

## Fluxo de Negócio Principal

### Compra do Cliente

```
1. Cliente acessa / → vê serviços
2. Clica em serviço → /comprar-servico/[id]
3. Preenche link + email + whatsapp
4. POST /api/checkout/process
   ├── Cria/encontra User (CUSTOMER)
   ├── Valida cupom (se houver)
   ├── Chama PushinPay → gera PIX
   └── Cria TransactionLog (status=0)
5. Redirect → /checkout com QR Code
6. Cliente paga no banco
7. PushinPay dispara webhook → /api/webhooks/pushinpay
   ├── processConfirmedPayment()
   │   ├── Marca TransactionLog status=1
   │   ├── Cria Order (type=api ou direct)
   │   ├── Atualiza User.totalOrders, totalSpent
   │   └── Incrementa Coupon.usedCount
   ├── Envia email de confirmação
   ├── Envia WhatsApp (Evolution API)
   └── Dispara GA4 + Facebook CAPI
```

### Entrega Automatizada (Cron)

```
Cron 1: POST /api/cron/process-orders (ex: a cada 5min)
├── Pega Orders (type=api, status=pending, apiOrderId=0)
├── Agrupa por ApiProvider
├── Chama SMM API: action=add
└── Salva apiOrderId, status=processing

Cron 2: POST /api/cron/check-status (ex: a cada 5min)
├── Pega Orders (status=processing/inprogress)
├── Cooldown 3min por pedido
├── Chama SMM API: action=status (batch 100)
├── completed  → email + status=completed
├── canceled   → reembolso PushinPay + status=canceled
└── partial    → email parcial + status=partial
```

---

## Integrações Externas

### PushinPay (Pagamento PIX)
- `POST /api/pix/cashIn` — Gera cobrança PIX
- `GET /api/pix/cashIn/{id}` — Consulta status
- `POST /api/transactions/{id}/refund` — Reembolso automático
- Env: `api_token_pushinpay`, `pushinpay_base_url`, `PUSHINPAY_WEBHOOK_SECRET`

### SMM API Providers
- Protocolo: POST `application/x-www-form-urlencoded`
- `action=add`: `{ key, service, link, quantity }` → `{ order: <id> }`
- `action=status`: `{ key, orders: "1,2,3" }` → `{ "1": { status, remains, start_count } }`
- Configurados no model `ApiProvider` via admin

### Evolution API (WhatsApp)
- **Arquivo:** `src/lib/evolution.ts`
- Envia mensagens JSON com variáveis `{{nome}}`, `{{orderId}}`, `{{valor}}`, `{{servico}}`
- Configurado via Settings no admin

### Google Analytics 4
- `POST https://www.google-analytics.com/mp/collect`
- Evento: `purchase` com `transaction_id`, `value`, `currency`
- Env: `google_analytics_id`, `ga4_api_secret`

### Facebook Conversion API
- `POST https://graph.facebook.com/v19.0/{pixelId}/events`
- Evento: `Purchase` com email hasheado, valor, moeda
- Env: `facebook_pixel_id`, `facebook_access_token`

### Nodemailer (Email)
- **Arquivo:** `src/lib/email.ts`
- Templates configuráveis via Settings (subject + HTML com variáveis)
- Env: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`

---

## Variáveis de Ambiente

```env
# Banco de dados
POSTGRES_PASSWORD=
DATABASE_URL=postgresql://user:pass@host:5432/db

# Autenticação
JWT_SECRET=                     # openssl rand -hex 32
JWT_EXPIRES_IN=7d               # opcional
CRON_SECRET=                    # openssl rand -hex 16

# Pagamento
api_token_pushinpay=
pushinpay_base_url=https://api.pushinpay.com.br
PUSHINPAY_WEBHOOK_SECRET=       # opcional

# Email (SMTP)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=

# Analytics (opcionais)
google_analytics_id=
ga4_api_secret=
facebook_pixel_id=
facebook_access_token=

# Storage (opcional)
MINIO_ACCESS_KEY=
MINIO_SECRET_KEY=
```

**Settings salvas no banco** (model `Setting`):
- `site_name`, `site_title`, `site_description`, `site_keywords`
- `currency` (default: BRL)
- `email_template_*` (subject + HTML com variáveis)
- `evolution_*` (configuração WhatsApp)
- `social_*` (links redes sociais)
- `overdelivery_percentage` (% extra entregue nos pedidos)

---

## Componentes Principais

### Páginas Públicas
| Componente | Localização | Função |
|------------|-------------|--------|
| `AestheticHero` | `src/components/` | Seção hero da home com CTA |
| `AnimatedPlatformCards` | `src/components/` | Cards das redes sociais com animações |
| `AnimatedPopularServices` | `src/components/` | Carrossel de serviços populares |
| `LiveActivityFeedClient` | `src/components/` | Ticker de pedidos recentes em tempo real |
| `FaqAccordion` | `src/components/` | Seção de perguntas frequentes |

### Admin
| Componente | Localização | Função |
|------------|-------------|--------|
| `CategoriesClient` | `src/components/` | CRUD de redes sociais e categorias |
| `ServiceForm` / `ServicesList` | `src/components/` | CRUD de serviços |
| `UserForm` / `UsersList` | `src/components/` | Gestão de usuários |
| `FinanceStats` / `TransactionList` | `src/components/` | Dashboard financeiro |
| `SettingsClient` | `src/components/` | Formulário de configurações |

### UI Base
| Componente | Função |
|------------|--------|
| `Button`, `Input` | Elementos de formulário base |
| `CustomSelect` | Dropdown multi-select |
| `Toast` | Notificações (Radix UI) |
| `WhatsAppButton` | CTA flutuante de WhatsApp |
| `NavigationProgress` | Barra de progresso entre páginas |

---

## Stack de Dependências

```
next            16.2.1   — Framework full-stack
react           19.2.4   — UI
@prisma/client  6.19.2   — ORM
jose            6.2.2    — JWT (HS256)
bcryptjs        3.0.3    — Hash de senhas
tailwindcss     4        — Estilos utilitários
framer-motion   12.38.0  — Animações
@radix-ui/*     variados — Componentes acessíveis (dialog, menu, toast)
lucide-react    0.471.1  — Ícones
nodemailer      8.0.4    — Email SMTP
zod             4.3.6    — Validação de schemas
```

---

## Configuração Next.js (`next.config.ts`)

- **Output:** `standalone` (para Docker)
- **Imagens remotas permitidas:** `dicebear.com`, `icons8.com`, `qrserver.com`, `unsplash.com`
- **Headers de segurança:**
  - `X-Frame-Options: SAMEORIGIN`
  - `X-Content-Type-Options: nosniff`
  - `Strict-Transport-Security: max-age=63072000`
  - CSP restritivo (bloqueia scripts inline)
  - `Permissions-Policy`: desativa câmera, microfone, geolocalização
- **Cache:** assets estáticos com `Cache-Control: immutable, 1 ano` em produção

---

## Segurança

| Mecanismo | Detalhes |
|-----------|----------|
| JWT httpOnly | Protege contra XSS, cookie não acessível via JS |
| SameSite=Lax | Proteção básica contra CSRF |
| Bcrypt senhas | Hash com salt automático |
| Prisma ORM | Previne SQL injection via queries parametrizadas |
| CRON_SECRET | Bearer token obrigatório para cron jobs |
| Chaves protegidas | `JWT_SECRET`, `DATABASE_URL`, `CRON_SECRET` não podem ser sobrescritas via API admin |
| CSP headers | Restringe origens de scripts |
| Middleware | Bloqueia acesso admin para role CUSTOMER |
| Zod validation | Validação de entrada em todos endpoints |

---

## Implantação (Docker)

```yaml
# docker-compose.yml
services:
  db: postgres:16
  app: next.js standalone na porta 3000
```

- Postgres na porta 5432
- App na porta 3000
- Volumes para persistência do banco

---

## Cálculos Importantes

```
# Preço final com cupom (percentual)
finalPrice = price - (price * couponValue / 100)

# Quantidade com over-delivery
finalQty = baseQty * (1 + overdelivery_percentage / 100)

# Preço original exibido (riscado)
originalPrice = price * (1 + discount / 100)
```

---

## Arquivos Críticos

| Arquivo | Por que é crítico |
|---------|-------------------|
| `src/lib/payment-processor.ts` | Núcleo do processamento pós-pagamento (idempotente) |
| `src/app/api/webhooks/pushinpay/route.ts` | Gateway de entrada para confirmações de pagamento |
| `src/app/api/cron/check-status/route.ts` | Lógica de atualização de status + reembolso |
| `src/app/api/checkout/process/route.ts` | Início do fluxo de compra |
| `prisma/schema.prisma` | Fonte de verdade do banco |
| `src/middleware.ts` | Controle de acesso de todas as rotas |
| `src/lib/auth.ts` | Sistema de autenticação |
| `next.config.ts` | Configurações críticas de build e segurança |
