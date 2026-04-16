# Personal Shopper — Frontend (TCC)

Interface do e-commerce Personal Shopper, desenvolvida como Trabalho de Conclusão de Curso (TCC) do curso de Análise e Desenvolvimento de Sistemas (ADS).

[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-purple)](https://vitejs.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-cyan)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## Sobre

Frontend da plataforma Personal Shopper — e-commerce onde clientes podem navegar por produtos, realizar pedidos e acompanhar solicitações de busca personalizadas. Desenvolvido com React 19 + Vite 5, Tailwind CSS e Zustand para gerenciamento de estado.

O repositório do backend está em: [personal-shopper-backend](https://github.com/Matdev96/personal-shopper-backend)

---

## Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| React | 19 | Framework de UI |
| Vite | 5 | Bundler e dev server |
| TypeScript | 5 | Tipagem estática nos services e stores |
| Tailwind CSS | v4 | Estilização |
| Zustand | 5 | Estado global |
| Axios | — | Requisições HTTP (interceptor JWT automático) |
| react-router-dom | 7 | Roteamento |
| react-hook-form | — | Gerenciamento de formulários |
| react-toastify | — | Notificações |

---

## Funcionalidades

**Autenticação**
- Registro e login com JWT
- Persistência de sessão via localStorage
- Rotas protegidas por autenticação e nível de acesso (admin)

**Catálogo e Compras**
- Listagem de produtos com filtros por categoria, preço e busca por texto
- Detalhe do produto com imagem, tamanho e cor
- Carrinho de compras persistente
- Checkout com endereço de entrega ou retirada na loja
- Busca automática de endereço por CEP (ViaCEP)
- Histórico de pedidos

**Perfil do Usuário**
- Edição de nome, email e senha
- Cadastro de endereço de entrega (CEP, logradouro, número, complemento, bairro, cidade, estado)
- Opção de preferência: Retirar na Loja ou Entregar no Endereço

**Solicitações de Busca**
- Criar solicitação com produto, referência, loja, orçamento e tamanho
- Acompanhar ciclo de status em tempo real
- Confirmar preço cotado pela admin
- Registrar pagamento (sinal 50% + final 50%) com comprovante

**Painel Admin**
- Dashboard com estatísticas
- Gerenciar produtos (CRUD com upload de imagem)
- Gerenciar usuários
- Gerenciar solicitações: avançar status, cotar preço, revisar pagamentos

---

## Estrutura do Projeto

```
personal-shopper-frontend/
  src/
    App.jsx              # Rotas (públicas, usuário, admin)
    components/
      Header.jsx         # Navegação principal
      AdminLayout.jsx    # Sidebar do painel admin
      ProtectedRoute.jsx # Guard de autenticação
    pages/               # Uma página por rota
    services/            # Chamadas HTTP via Axios
      api.ts             # Instância Axios com interceptor JWT
      authService.ts
      productService.ts
      cartService.ts
      orderService.ts
      requestService.ts
      paymentService.ts
    store/               # Estado global Zustand
      authStore.ts
      productStore.ts
      cartStore.ts
      orderStore.ts
      categoryStore.ts
    utils/
      requestStatus.js   # Labels e cores para status de solicitações
```

---

## Páginas

| Rota | Página | Acesso |
|---|---|---|
| `/` | Home | Público |
| `/products` | Catálogo com filtros e busca | Público |
| `/products/:id` | Detalhe do produto | Público |
| `/login` / `/register` | Autenticação | Público |
| `/profile` | Perfil e endereço de entrega | Usuário |
| `/cart` | Carrinho de compras | Usuário |
| `/checkout` | Finalização de pedido | Usuário |
| `/orders` | Histórico de pedidos | Usuário |
| `/orders/:id` | Detalhe do pedido | Usuário |
| `/requests` | Minhas solicitações | Usuário |
| `/requests/new` | Nova solicitação | Usuário |
| `/requests/:id` | Detalhe: confirmar preço e pagar | Usuário |
| `/admin/dashboard` | Painel admin — estatísticas | Admin |
| `/admin/products` | Gerenciar produtos | Admin |
| `/admin/users` | Gerenciar usuários | Admin |
| `/admin/requests` | Gerenciar solicitações | Admin |
| `/admin/requests/:id` | Detalhe: status, cotação, pagamentos | Admin |

---

## Como Executar

### Pré-requisitos
- Node.js 18+
- Backend em execução em `http://localhost:8000`

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/Matdev96/personal-shopper-frontend.git
cd personal-shopper-frontend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env se necessário (padrão: VITE_API_URL=http://127.0.0.1:8000)

# Iniciar o servidor de desenvolvimento
npm run dev
```

A aplicação ficará disponível em `http://localhost:5173`.

### Build para produção

```bash
npm run build
```

---

## Variáveis de Ambiente

| Variável | Padrão | Descrição |
|---|---|---|
| `VITE_API_URL` | `http://127.0.0.1:8000` | URL base do backend |

---

## Backend

O backend (FastAPI + PostgreSQL) está em: [personal-shopper-backend](https://github.com/Matdev96/personal-shopper-backend)

---

## Licença

MIT
