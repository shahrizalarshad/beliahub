# Belia Hub — Panduan Deploy Production

Deploy target: **Vercel** (serverless PHP) + **Aiven MySQL** + **Cloudflare R2** + **Brevo SMTP**.

## 1. Prasyarat

| Perkhidmatan | Tujuan |
|---|---|
| [Vercel](https://vercel.com) | Hosting aplikasi |
| [Aiven](https://aiven.io) | MySQL database |
| [Cloudflare R2](https://developers.cloudflare.com/r2/) | Fail upload (S3-compatible) |
| [Brevo](https://www.brevo.com) | E-mel SMTP |
| GitHub repo | CI/CD |

## 2. Sediakan Database (Aiven)

1. Cipta perkhidmatan **MySQL 8** di Aiven.
2. Catat: `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`.
3. Muat turun sijil SSL CA Aiven → simpan sebagai secret `MYSQL_ATTR_SSL_CA`.
4. Jalankan migrasi pertama kali (lihat §6).

## 3. Sediakan Cloudflare R2

1. Cipta bucket (cth. `beliahub-uploads`).
2. Cipta API token dengan akses read/write.
3. Catat untuk env Vercel:

```
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=<r2_access_key>
AWS_SECRET_ACCESS_KEY=<r2_secret>
AWS_DEFAULT_REGION=auto
AWS_BUCKET=beliahub-uploads
AWS_ENDPOINT=https://<account_id>.r2.cloudflarestorage.com
AWS_USE_PATH_STYLE_ENDPOINT=true
```

## 4. Sediakan Brevo SMTP

```
MAIL_MAILER=smtp
MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=587
MAIL_USERNAME=<brevo_login>
MAIL_PASSWORD=<brevo_smtp_key>
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@domain-anda.com
MAIL_FROM_NAME=Belia Hub
```

## 5. Import Projek ke Vercel

1. Log masuk Vercel → **Add New Project** → import repo GitHub.
2. Framework Preset: **Other** (bukan Next.js).
3. Root Directory: `/` (default).
4. Build & Output Settings — biarkan Vercel baca dari `vercel.json`:
   - Install: `composer install --no-dev --optimize-autoloader --no-interaction`
   - Build: `npm ci && npm run build`
5. Region: **Singapore (sin1)** — sudah ditetapkan dalam `vercel.json`.

### Environment Variables (Vercel Dashboard)

Tetapkan untuk **Production** (dan Preview jika perlu):

```env
APP_NAME="Belia Hub"
APP_ENV=production
APP_KEY=base64:...                    # php artisan key:generate --show
APP_DEBUG=false
APP_URL=https://domain-anda.vercel.app
APP_TIMEZONE=Asia/Kuala_Lumpur

LOG_CHANNEL=stderr
LOG_LEVEL=warning

DB_CONNECTION=mysql
DB_HOST=<aiven_host>
DB_PORT=3306
DB_DATABASE=<db_name>
DB_USERNAME=<db_user>
DB_PASSWORD=<db_password>
MYSQL_ATTR_SSL_CA=<ca_cert_content>

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_SECURE_COOKIE=true
CACHE_STORE=database
QUEUE_CONNECTION=sync

FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_DEFAULT_REGION=auto
AWS_BUCKET=...
AWS_ENDPOINT=https://....r2.cloudflarestorage.com
AWS_USE_PATH_STYLE_ENDPOINT=true

MAIL_MAILER=smtp
MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=587
MAIL_USERNAME=...
MAIL_PASSWORD=...
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@domain-anda.com
MAIL_FROM_NAME="Belia Hub"

ORG_BANK_NAME=...
ORG_BANK_ACCOUNT_NO=...
ORG_BANK_ACCOUNT_NAME=...

VITE_APP_NAME="Belia Hub"
```

> **Penting:** `APP_TIMEZONE=Asia/Kuala_Lumpur` — Vercel default UTC; tanpa ini, tetingkap kehadiran QR akan salah.

> **Penting:** `FILESYSTEM_DISK=s3` — filesystem Vercel read-only; upload tempatan akan gagal.

6. Klik **Deploy**.

## 6. Migrasi Database

### Pilihan A — GitHub Actions (disyorkan)

Workflow `.github/workflows/ci.yml` ada job `migrate` yang jalan selepas test lulus pada branch `main`.

Sediakan GitHub **Environment** bernama `production` dengan secrets:

| Secret | Nilai |
|---|---|
| `APP_KEY` | Sama seperti Vercel |
| `DB_HOST` | Host Aiven |
| `DB_PORT` | 3306 |
| `DB_DATABASE` | Nama DB |
| `DB_USERNAME` | User DB |
| `DB_PASSWORD` | Password DB |
| `MYSQL_ATTR_SSL_CA` | Sijil SSL Aiven |

### Pilihan B — Manual (local)

```bash
# Tarik env production dari Vercel
vercel env pull .env.production.local

# Jalankan migrasi
php artisan migrate --force
```

## 7. CI/CD Pipeline

```
PR / push → GitHub Actions:
  ├── composer install
  ├── npm ci && npm run build
  ├── composer test (46 tests)
  └── pint --test (lint)

push main → tambahan:
  ├── migrate production DB
  └── Vercel auto-deploy (Git integration)
```

## 8. Semak Selepas Deploy

- [ ] `/` — landing page
- [ ] `/login` — log masuk
- [ ] `/servis` — katalog perkhidmatan
- [ ] Daftar akaun → e-mel pengesahan (Brevo)
- [ ] Upload fail tempahan → R2
- [ ] Admin dashboard `/admin`
- [ ] `/up` — health check Laravel

## 9. Had Serverless (Vercel)

| Peraturan | Sebab |
|---|---|
| Jangan guna `storage_path()` untuk upload | Filesystem read-only |
| Guna `Storage::disk('s3')` | R2 via S3 API |
| `QUEUE_CONNECTION=sync` | Tiada queue worker daemon |
| `SESSION_DRIVER=database` | Cookie session OK, DB lebih selamat |
| `LOG_CHANNEL=stderr` | Vercel tangkap log automatik |
| Cache/view ke `/tmp` | Sudah ditetapkan dalam `vercel.json` |

## 10. Troubleshooting

**Deploy gagal — composer error**
→ Tambah env `VERCEL_FORCE_NO_BUILD_CACHE=1` dalam Vercel settings.

**500 error — APP_KEY missing**
→ Jana `php artisan key:generate --show` dan set dalam Vercel env.

**Upload gagal**
→ Pastikan `FILESYSTEM_DISK=s3` dan credential R2 betul.

**Masa kehadiran salah**
→ Pastikan `APP_TIMEZONE=Asia/Kuala_Lumpur`.

**Asset CSS/JS tidak load**
→ Pastikan `npm run build` berjaya; semak `/build/assets/` accessible.
