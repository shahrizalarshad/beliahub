# Belia Hub — Functional Specification

> Reference document. Read together with `ARCHITECTURE.md` and `DATABASE.md`.

## 0. Purpose & Key Decisions

Belia Hub is a platform for a youth organization:
membership management + services marketplace (digital or physical services, catalog fully managed by superadmin) that generates revenue for the organization. **Orders are open to the public** — external customers register as clients; organizational membership is a separate, admin-approved status.

Confirmed decisions (owner):
1. **Money flow:** client pays the **organization**; after order completion the organization pays the assigned **provider** (payout recorded in system).
2. **Open marketplace, guarded membership:** anyone can register (default role `client`, no membership ID) and place orders. Membership is applied for (at registration or later) and **approved by superadmin** — only then is the `BH-` membership ID generated. Events/attendance are members-only.
3. **UI language v1:** Bahasa Melayu. All UI copy centralized in Laravel lang files (`lang/ms/`) so English can be added later.

## 1. Roles & Permissions Matrix

Four roles: `superadmin`, `provider`, `member`, `client`.

| Capability | Superadmin | Provider | Member | Client |
|---|---|---|---|---|
| Manage users & roles / approve memberships | ✅ | ❌ | ❌ | ❌ |
| Manage service types & prices (CRUD) | ✅ | ❌ | ❌ | ❌ |
| View financial data / revenue / payouts | ✅ | ❌ | ❌ | ❌ |
| Record payments & payouts | ✅ | ❌ | ❌ | ❌ |
| Create/edit events + budget | ✅ | ❌ | ❌ | ❌ |
| Confirm orders & assign provider | ✅ | ❌ | ❌ | ❌ |
| Update status of assigned orders | ✅ | ✅ (assigned only) | ❌ | ❌ |
| Upload delivery files | ✅ | ✅ (assigned only) | ❌ | ❌ |
| View own payout history | ✅ | ✅ | ❌ | ❌ |
| Skill tags on profile | ✅ | ✅ | ✅ | ❌ |
| Scan attendance for events | ✅ | ✅ | ✅ | ❌ |
| Create service orders | ✅ | ✅ | ✅ | ✅ |
| Upload reference materials & payment proof (own order) | ✅ | ✅ | ✅ | ✅ |
| Comment on order thread (own/assigned order) | ✅ | ✅ | ✅ | ✅ |
| View own profile & orders | ✅ | ✅ | ✅ | ✅ |
| Apply for membership | — | — | — | ✅ |
| Admin analytics dashboard | ✅ | ❌ | ❌ | ❌ |

Notes:
- **Client** (BM UI: "Pelanggan") — external customer. Full ordering experience (order, files, payment proof, comments) but no membership ID, no events, not counted as a member. Can apply for membership anytime; approved client → upgraded to `member` (funnel for recruitment).
- **Provider** (BM UI: "Petugas") is a generic fulfilment role — youth members assigned to deliver ANY service type, digital or physical (website, resume, poster, apparel, ...). The role is intentionally not tied to "developer"/IT work since superadmin can add any kind of service to the catalog.
- Providers are also full members (keep membership ID, can order and attend events).
- When assigning an order, superadmin can filter members by **skill tag** to find a suitable provider (e.g. order "Buat Baju" → filter skill "Jahitan").
- Deactivated users (`is_active = false`) are blocked at login/middleware level.

## 2. Module A — Membership Management

### A1. Registration, Membership Application & Membership ID
- Registration via Laravel Breeze (name, email, password) + extra fields: phone, locality. **Default role: `client`** — no membership ID.
- Registration requires a **PDPA consent checkbox** (link to Terms & Privacy pages).
- Email verification required before placing orders.
- **Membership application:** during registration (checkbox "Mohon jadi ahli") or anytime later from the dashboard. Sets `membership_applied_at`.
- **Superadmin approves** the application (admin sees a pending-applications list). On approval:
  - Role upgraded `client` → `member`.
  - Unique membership ID auto-generated: format `BH-{YYYY}-{NNNN}`, e.g. `BH-2026-0001`.
    - `YYYY` = year of approval; `NNNN` = zero-padded sequence, resets each year.
    - Race-safe via generic `sequences` table (DB transaction + `lockForUpdate()`). Same mechanism used for order no. and invoice no.
  - Welcome email (BM) sent automatically (Brevo SMTP, synchronous).
- Superadmin may also reject an application (clears `membership_applied_at`, optional reason emailed).
- Unverified users cannot order services; clients (non-members) cannot record attendance.

### A2. Profile
- Fields (all on `users`): name, email, phone, locality (dropdown — predefined list in `config/beliahub.php`, not a DB table), avatar (R2), bio.
- **Skill tagging:** many-to-many user↔skills. Predefined skill list seeded (Web Design, Copywriting, Video Editing, App Development, Graphic Design, ...). Superadmin can manage the skill list.
- Members edit own profile; superadmin can edit anyone.

### A3. Member Directory (admin)
- Superadmin: searchable/filterable list of all users (by role — including clients, locality, skill, verified status, active status).
- Actions: approve/reject membership application, change role, deactivate/reactivate, view detail.
- Pending membership applications surfaced prominently (badge/count).

## 3. Module B — Services Marketplace

### B0. Public Pages (no auth)
- **Landing page:** organization intro + service catalog with prices + "Order Sekarang" CTA (→ register/login) + membership pitch.
- **Service catalog page:** all active services with name, price, description.
- **Terms & Privacy pages** (see section 8, PDPA).
- No order or member data is ever exposed publicly.

### B1. Service Catalog (managed by superadmin)

**Superadmin has full CRUD over service types and prices** via an admin "Manage Services" page:
- Create new service: name, slug (auto from name), price per unit (RM), description, **order instructions** (what the client must provide — e.g. for "Buat Baju": size, delivery address/pickup preference), active toggle.
- Edit name/price/description anytime. Price changes do NOT affect existing orders (order stores a price snapshot).
- Deactivate (hide from catalog) instead of delete if the service has existing orders; hard delete only allowed when no orders reference it.
- Orders support **quantity** (default 1, e.g. 30 baju): `total = unit price × quantity`. Deposit is always auto-calculated at 50% of the total at order time.

Initial services seeded as starting data (editable afterwards):

| Service | Price (RM) | Deposit 50% (RM) |
|---|---|---|
| Website | 300.00 | 150.00 |
| App / APK | 150.00 | 75.00 |
| Resume | 50.00 | 25.00 |

### B2. Order Lifecycle

```
pending ──confirm──▶ in_progress ──deliver──▶ completed ──▶ (payout to provider)
   │                     │
   └──────cancel─────────┴────────▶ cancelled
```

- **pending:** created by any verified user (member or client). Order form shows the service's **order instructions** and captures quantity + requirements (for physical services: size, delivery address / pickup preference — guided by the instructions text). Deposit auto = 50% of total (unit price snapshot × quantity). Client sees the organization's payment instructions (bank account / DuitNow QR — from config), uploads reference materials and **payment proof** (→ R2). Client may cancel.
- **in_progress:** superadmin verifies proof, records deposit payment, confirms order, and assigns a provider. Invoice PDF auto-generated → R2 → emailed to client.
- **completed:** provider uploads delivery files (→ R2) and marks complete — for digital services the actual deliverable; for physical services (e.g. apparel, printed poster) a photo proof of the completed item. Client notified with signed download links. Superadmin records balance payment (with proof).
- **cancelled:** by client (while pending) or superadmin (anytime before completed). If a deposit was already paid, see refund policy (B3).
- Status transitions enforced in `OrderService` — no illegal jumps.
- **Stale orders:** pending orders older than 14 days with no recorded payment are flagged "Tertunggak" in the admin order list; superadmin cancels manually (no auto-cancel in v1 — avoids cron dependency).

### B3. Payments (money in: client → organization)
- Manual recording (no gateway in v1): superadmin records deposit/balance payments with amount, method, reference no, date, and links the client's uploaded proof file.
- A **receipt PDF** (numbered `RCP-{YYYY}-{NNNN}` via `sequences`) is auto-generated for every recorded payment, stored in R2, and emailed to the client.
- Order page shows: total, deposit due, paid so far, balance outstanding.
- **Refunds:** superadmin records a `refund` payment entry (amount, method, reference, date) against the order — counted as money out in financial reports. Policy: order cancelled before work starts (never confirmed) = full deposit refund; cancelled after work starts = amount at superadmin's discretion. Refund entries appear in the activity log.

### B4. Payouts (money out: organization → provider)
- After an order is completed and fully paid, superadmin records a payout to the assigned provider: amount (manual, decided per order), method, reference no, date, notes.
- Provider sees own payout history ("Pendapatan Saya") with totals.
- Dashboard reports gross collection, total payouts, and net revenue.

### B5. Order Communication
- Each order has a simple comment thread visible to the client, assigned provider, and superadmin.
- Used for requirement clarification, feedback, and revision requests. Plain text, no attachments in v1 (files go through the order file uploads).

### B6. Files
- File categories per order: `reference` (client), `delivery` (provider), `payment_proof` (client).
- All stored in R2 under `orders/{order_id}/{category}/`. Max 10 MB/file, common types (jpg, png, pdf, zip, docx).
- Downloads via temporary signed URLs (`Storage::disk('s3')->temporaryUrl()`).

## 4. Module C — Events & Attendance

### C1. Event CRUD (superadmin)
- Fields: title, description, location, start/end datetime, budget (RM), poster image (R2), status (draft/published/done).
- Budget tracking: planned budget + actual spend field for post-event record.

### C2. QR Attendance (rotating token)
- Admin opens a "Display QR" page during the event; the page shows a QR encoding a **short-lived signed URL** (valid ~5 minutes) and auto-refreshes the QR before expiry. A screenshotted/shared QR quickly becomes useless.
- QR generated server-side (`simplesoftwareio/simple-qrcode`, SVG — no filesystem write).
- Member flow: logged in → scans QR → GET signed route → attendance recorded with timestamp. If not logged in, redirect to login then back.
- Rules: **members only** (clients rejected with a friendly "ahli sahaja" message), one attendance per user per event (DB unique constraint), only within event time window (configurable grace period), endpoint rate-limited (throttle).
- Superadmin sees live attendance list + export.

## 5. Module D — Admin Analytics Dashboard

Superadmin landing page shows:
- **KPI cards:**
  - Active Members (approved members, active count)
  - Registered Clients + pending membership applications count
  - Gross Collection (RM, sum of recorded payments minus refunds)
  - Total Payouts (RM) and Net Revenue (RM = collection − refunds − payouts)
  - Outstanding Balance (RM, unpaid balance across active orders)
  - Active Service Orders (pending + in_progress)
- **Charts (Chart.js via react-chartjs-2):**
  - Monthly registration trend (last 12 months, line chart)
  - Collection vs payout by month (bar chart)
  - Orders by service type (doughnut)
- Data endpoints return aggregates via Eloquent (no raw SQL) — `withCount`, `sum`, grouped by month.

## 6. Module E — Automations

| Trigger | Action | Channel |
|---|---|---|
| Membership application submitted | Notify superadmin | Brevo SMTP |
| Membership approved | Generate membership ID + send welcome email (BM) | Brevo SMTP |
| Membership rejected | Notify applicant (optional reason) | Brevo SMTP |
| Order confirmed (pending → in_progress) | Generate PDF invoice, save to R2, email to client with attachment | Brevo SMTP |
| Payment recorded | Generate PDF receipt, save to R2, email to client | Brevo SMTP |
| Order completed | Notify client with delivery file links (signed URLs) | Brevo SMTP |
| New comment on order | (v2) notify counterparty | — |

All mail sent synchronously (serverless constraint). PDF generation writes to memory/`/tmp` only, then streamed to R2.

## 7. Audit & Accountability

- Activity log (`spatie/laravel-activitylog`) records: payments recorded, payouts recorded, role changes, service price changes, order status changes, user deactivation.
- Log viewable by superadmin only. Important for organizational audit / AGM reporting.

## 8. Non-Functional Requirements

- **Cost:** all services on free tiers (Vercel, Aiven, R2, Brevo free plan).
- **Timezone:** `Asia/Kuala_Lumpur` (APP_TIMEZONE) — critical for event attendance windows and payment dates (Vercel defaults to UTC).
- **PDPA compliance:** Terms & Privacy pages (public), consent checkbox at registration, personal data only visible per RBAC rules.
- **Language:** UI in Bahasa Melayu; all copy in `lang/ms/` files (no hardcoded strings) for future EN support.
- **Validation:** every write endpoint has a FormRequest.
- **Authorization:** policies + role middleware on every route group; `is_active` checked in middleware.
- **Rate limiting:** login, registration, and attendance endpoints throttled.
- **Testing:** feature tests for auth, membership approval + ID generation, order transitions, payout recording, attendance uniqueness (incl. client blocked from attendance).

## 9. Out of Scope / Known Limitations (v1)

- Online payment gateway (manual payment recording only).
- Event pre-registration / RSVP (attendance scan only).
- Mobile app (responsive web only).
- Real-time notifications/websockets; in-app notification center.
- English UI (structure ready, translation later).
- Multi-organization/tenant support.
- Auto-cancel of stale pending orders (flagged for manual action instead — avoids cron).
- Multiple providers per order (single `provider_id`; large orders coordinated manually).
- Client acceptance step before `completed` (disputes handled via order comment thread + superadmin arbitration).
