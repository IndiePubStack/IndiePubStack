# IndiePubStack

[![Next.js](https://img.shields.io/badge/Next.js-15.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

Open-source, self-hosted publishing platform for technical creators. Own your content, audience, and infrastructure without vendor lock-in.

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
    - [Local Development](#local-development)
    - [Production Deployment with Coolify](#production-deployment-with-coolify)
- [Configuration](#configuration)
    - [Required Services](#required-services)
    - [Environment Variables](#environment-variables)
    - [Service Setup](#service-setup)
- [Tech Stack](#tech-stack)
- [License](#license)

![Dashboard Demo](img/dashboard_demo.png)

## Features

- **Markdown-first blogging** with syntax highlighting
- **Newsletter delivery** via Resend
- **Subscription monetization** (coming soon)
- **Secure authentication** via Kinde
- **Custom domain support**
- **Docker deployment** ready
- **Modern stack**: Next.js 15, React 19, TypeScript, PostgreSQL

## Quick Start

### Local Development

```bash
# Clone and install
git clone https://github.com/yourusername/IndiePubStack.git
cd IndiePubStack
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your config

# Start Postgres (Docker)
docker run --name indiepubstack-db \
  -e POSTGRES_USER=indie_pub_stack \
  -e POSTGRES_PASSWORD=indie_pub_stack \
  -e POSTGRES_DB=indie_pub_stack_db \
  -p 5432:5432 -d postgres:17-alpine
  
# Run migrations and start
npm run db:migrate
npm run dev
```

### Production Deployment with Coolify

1. **Setup VPS** - Get a server from [Hetzner](https://hetzner.com) or similar
2. **Install Coolify**:
   ```bash
   curl -sSL https://get.coollabs.io/coolify/install.sh | bash
   ```
3. **Create PostgreSQL database** in Coolify dashboard
4. **Deploy app** using Docker image: `indiepubstack/indiepubstack:<short_git_sha>`
5. **Configure environment variables** (see below)
6. **Setup custom domain** with automatic HTTPS

## Configuration

### Required Services

- **[Kinde](https://kinde.com)** - Authentication (10,500 free monthly users)
- **[Resend](https://resend.com)** - Email delivery (1,000 free contacts/month)

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Kinde Auth
KINDE_CLIENT_ID=***
KINDE_CLIENT_SECRET=***
KINDE_ISSUER_URL=***
KINDE_SITE_URL=https://yourdomain.com
KINDE_POST_LOGOUT_REDIRECT_URL=https://yourdomain.com
KINDE_POST_LOGIN_REDIRECT_URL=https://yourdomain.com

# Resend Email
RESEND_API_KEY=***
RESEND_AUDIENCE_ID=***
RESEND_WEBHOOK_SECRET=***
RESEND_DOMAIN=yourdomain.com

# Site Config
DOMAIN=yourdomain.com
PUBLICATION_NAME=Your Publication
CODE_THEME=github-dark
```

### Service Setup

**Kinde:**
1. Create Backend app with Next.js framework
2. Set callback URL: `https://yourdomain.com/api/auth/kinde_callback`
3. Create webhook: `https://yourdomain.com/api/webhooks/kinde`
4. Subscribe to: `user.created`, `user.updated`

**Resend:**
1. Generate API token
2. Setup webhook: `https://yourdomain.com/api/webhooks/resend`
3. Subscribe to: `contact.created`, `contact.updated`
4. Verify your sending domain

## Tech Stack

- **Framework**: Next.js 15 + React 19
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: Kinde
- **Email**: Resend
- **UI**: Tailwind CSS + shadcn/ui
- **Content**: Markdown-it + Shiki

## License

MIT License - see [LICENSE](./LICENSE)

---

**Ready to own your publishing platform?** Star the repo and deploy your instance today!