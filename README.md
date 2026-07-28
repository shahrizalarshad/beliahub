# Belia Hub

Platform digital untuk organisasi belia — keahlian, marketplace perkhidmatan, dan kehadiran program (QR).

**Production:** https://beliahub.vercel.app

## Stack

- Laravel 11 + Inertia.js + React 18 + Tailwind CSS
- MySQL (Aiven) · Cloudflare R2 · Brevo SMTP · Vercel (serverless PHP)

## Dokumentasi

| Fail | Kandungan |
|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Seni bina & had serverless |
| [docs/FUNCTIONAL_SPEC.md](docs/FUNCTIONAL_SPEC.md) | Spesifikasi fungsi v1 |
| [docs/DATABASE.md](docs/DATABASE.md) | Skema database |
| [docs/DEPLOY.md](docs/DEPLOY.md) | Panduan deploy production |
| [agent.md](agent.md) | Konteks untuk AI / pembangun |

## Local development (Docker)

```bash
cp .env.example .env
docker compose up -d
docker compose exec app composer setup
# Frontend (optional): docker compose --profile frontend up -d node
```

App: http://localhost:8080 · Mailpit: http://localhost:8025

## Tests

```bash
docker compose exec app composer test
```

## Deploy & smoke test

Lihat [docs/DEPLOY.md](docs/DEPLOY.md). Selepas deploy:

```bash
./scripts/smoke-production.sh https://beliahub.vercel.app
```
