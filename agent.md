# Context: Belia Hub Digital System

## 1. Project Overview
Belia Hub is a digital platform for a youth organization. It serves as a membership management system and a **services marketplace** (digital or physical — website, resume, poster, apparel, etc.) to generate revenue for the organization. **Orders are open to the public** (external clients welcome); organizational membership is a separate, superadmin-approved status.
- **Architecture Focus:** Zero-Cost Cloud Deployment (PaaS & Serverless).
- **Primary Language:** PHP (Laravel) & JavaScript (React).
- **UI Language (v1):** Bahasa Melayu (all copy in `lang/ms/`, no hardcoded strings).
- **Timezone:** Asia/Kuala_Lumpur. **PDPA:** Terms & Privacy pages + consent checkbox at registration.
- **Detailed specs:** see `docs/ARCHITECTURE.md`, `docs/FUNCTIONAL_SPEC.md`, `docs/DATABASE.md` (source of truth).

## 2. Tech Stack & Infrastructure
- **Backend:** Laravel 11.x (PHP 8.2+).
- **Frontend:** React.js 18+ with Inertia.js.
- **Styling:** Tailwind CSS.
- **Authentication:** Laravel Breeze (React stack).
- **Database:** MySQL (Hosted on Aiven - DBaaS).
- **Hosting / Application Runtime:** Vercel (Serverless PHP via vercel-php or Bref).
- **File Storage:** Cloudflare R2 (S3-compatible API).
- **Email/SMTP:** Brevo / Mailtrap.
- **CI/CD:** GitHub Actions.

## 3. Important System Constraints (Vercel Serverless)
Since the app is deployed on Vercel, the filesystem is **ephemeral** and read-only.
- **RULE 1:** NEVER use `storage_path()` or `public_path()` to save user uploads (images, PDFs, documents).
- **RULE 2:** ALWAYS use Laravel's Storage facade configured for S3 (`Storage::disk('s3')`) which points to Cloudflare R2.
- **RULE 3:** Avoid long-running queue workers (`php artisan queue:work`) in the background. Use synchronous processing or serverless-friendly queue drivers (like Amazon SQS or Vercel cron jobs) if background tasks are strictly needed.

## 4. Role-Based Access Control (RBAC)
The system has four user roles:
1. **Superadmin:** Full access to all modules, financial data (payments, payouts), user management, and membership approvals.
2. **Provider (BM: "Petugas"):** Youth members assigned to fulfil service orders of ANY type (digital or physical). Can update order statuses, upload delivery files, and view own payout history. Superadmin uses skill tags to match providers to orders.
3. **Member:** Approved organization members. Have a `BH-` membership ID, can order services, attend events (QR attendance), and use skill tags.
4. **Client (BM: "Pelanggan"):** External customers — default role for new registrations. Can order services and track orders (full ordering experience: files, payment proof, comments) but have NO membership ID and NO event access. Can apply for membership; superadmin approval upgrades them to Member (ID generated on approval).

## 5. Core Modules & Features
### A. Membership Management
- Open registration (default role: client). Membership is applied for (at registration or later) and **approved by superadmin**.
- Auto-generate dynamic unique IDs (e.g., `BH-2026-0001`) upon membership approval (race-safe via generic `sequences` table — also used for order & invoice numbers).
- User profiles include locality and a "Skill Tagging" system (e.g., Web Design, Copywriting, Jahitan).

### B. Services Marketplace
- **Public landing + catalog pages** (no auth) so external customers can browse services & prices before registering.
- **Superadmin has full CRUD over service types & prices** (catalog is data, not hardcoded), including per-service order instructions (e.g. size/delivery address for physical goods). Starting seed: Website (RM300), App/APK (RM150), Resume (RM50).
- Orders support **quantity** (e.g. 30 baju): total = unit price snapshot × quantity; price changes never affect existing orders.
- Automatically calculate 50% deposit (of total).
- Orders open to both members and external clients (verified email required).
- **Refunds** recorded as payment type `refund` (policy: full deposit refund if cancelled before confirmation; discretionary after). Stale pending orders (>14 days unpaid) flagged for manual admin action.
- Order tracking states: `Pending` -> `In Progress` -> `Completed` -> `Cancelled` (transitions enforced).
- Client uploads reference materials AND **payment proof** (bank transfer receipt) — all to Cloudflare R2. Org bank details shown from config.
- Simple **comment thread per order** for client ↔ provider ↔ admin communication.
- **Money flow:** client pays organization (payments + auto receipt PDF); after completion, organization pays provider (**payouts** recorded per order, manual amount).

### C. Event & Attendance
- Event CRUD with budget tracking (planned budget + actual spend).
- **Rotating QR** for attendance: short-lived signed URL (~5 min validity), auto-refreshing display page — prevents shared-screenshot abuse.
- Members/providers only (clients blocked). One attendance per user per event (DB unique constraint), within event time window, throttled endpoint.

### D. Admin Analytics Dashboard
- Real-time key metrics: Active Members, Registered Clients + pending membership applications, Gross Collection (RM), Total Payouts (RM), Net Revenue (RM), Outstanding Balance (RM), Active Service Orders.
- Visual charts (Chart.js) for monthly registration trends, collection vs payout, orders by service type.

### E. Automations
- Notify superadmin on new membership applications; send welcome email (BM) with new `BH-` ID upon approval via Brevo SMTP.
- Generate PDF invoices upon order confirmation and email them to clients.
- Generate numbered PDF receipts (`RCP-2026-0001`) for every recorded payment and email them to clients.
- Activity log (spatie/laravel-activitylog) for financial actions, role changes, and price changes — audit/AGM ready.

## 6. Coding Guidelines & Conventions
- **PHP/Laravel:** Use Strict Typing (`declare(strict_types=1);`). Use FormRequests for all validations. Use Eloquent ORM strictly (avoid raw SQL). Keep controllers thin; move complex logic to Service classes.
- **React/Inertia:** Use functional components and hooks. Use `@inertiajs/react` for routing (`<Link>`) and form handling (`useForm`).
- **Database:** Always use database migrations and seeders. Define relationships correctly in Eloquent Models.
