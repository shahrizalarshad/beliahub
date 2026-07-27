# Belia Hub — Database Schema

> Reference document. Read together with `ARCHITECTURE.md` and `FUNCTIONAL_SPEC.md`.
> MySQL (Aiven). All tables use `id` BIGINT UNSIGNED PK, `created_at`/`updated_at` unless noted.

## 1. ERD Overview

```
users ──M:N── skills                 (skill_user)
users ──1:N── service_orders         (as client)
users ──1:N── service_orders         (as assigned provider)
services ──1:N── service_orders
service_orders ──1:N── order_files
service_orders ──1:N── order_comments
service_orders ──1:N── payments      (money in: client → org)
service_orders ──1:N── payouts       (money out: org → provider)
service_orders ──1:1── invoices
events ──1:N── attendances ──N:1── users
sequences (ID counters: membership / order / invoice, per year)
activity_log (spatie/laravel-activitylog)
```

## 2. Tables

### users
Profile fields live directly on `users` (no separate profile table).

| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| name | varchar(255) | |
| email | varchar(255) unique | |
| email_verified_at | timestamp nullable | required before ordering |
| password | varchar(255) | |
| role | enum('superadmin','provider','member','client') | default 'client', index |
| membership_id | varchar(20) unique nullable | e.g. `BH-2026-0001`; members/providers only, set on membership approval |
| membership_applied_at | timestamp nullable | set when client applies; cleared on rejection |
| phone | varchar(20) nullable | |
| locality | varchar(100) nullable | dropdown value |
| bio | text nullable | |
| avatar_path | varchar(255) nullable | R2 object key |
| is_active | boolean default true | checked in middleware; blocks login |
| remember_token, timestamps | | Breeze standard |

### skills
| Column | Type | Notes |
|---|---|---|
| name | varchar(100) unique | seeded: Web Design, Copywriting, ... |
| slug | varchar(100) unique | |

### skill_user (pivot)
| Column | Type | Notes |
|---|---|---|
| user_id | FK users | composite unique (user_id, skill_id) |
| skill_id | FK skills | |

### services
Fully managed by superadmin (CRUD) — rows are data, not fixed enum values.

| Column | Type | Notes |
|---|---|---|
| name | varchar(100) | e.g. Website, App/APK, Resume, Baju |
| slug | varchar(100) unique | auto-generated from name |
| price | decimal(10,2) | per unit; editable — orders keep their own snapshot |
| description | text nullable | |
| order_instructions | text nullable | shown on order form — what client must provide (e.g. size, delivery address) |
| is_active | boolean default true | deactivate instead of delete when orders exist |

### service_orders
| Column | Type | Notes |
|---|---|---|
| order_no | varchar(20) unique | e.g. `ORD-2026-0001` (via `sequences`) |
| user_id | FK users | client |
| service_id | FK services | |
| provider_id | FK users nullable | assigned provider |
| status | enum('pending','in_progress','completed','cancelled') | default 'pending', index |
| unit_price | decimal(10,2) | snapshot of service price at order time |
| quantity | int unsigned default 1 | e.g. 30 baju |
| total_amount | decimal(10,2) | unit_price × quantity |
| deposit_amount | decimal(10,2) | auto = total_amount * 0.50 |
| requirements | text nullable | client brief (incl. size / delivery address / pickup for physical services) |
| confirmed_at | timestamp nullable | |
| completed_at | timestamp nullable | |
| cancelled_at | timestamp nullable | |

### order_files
| Column | Type | Notes |
|---|---|---|
| service_order_id | FK service_orders | |
| uploaded_by | FK users | |
| category | enum('reference','delivery','payment_proof') | |
| path | varchar(255) | R2 key: `orders/{id}/{category}/...` |
| original_name | varchar(255) | |
| size | int unsigned | bytes |
| mime_type | varchar(100) | |

### order_comments
Simple thread per order (client ↔ provider ↔ superadmin).

| Column | Type | Notes |
|---|---|---|
| service_order_id | FK service_orders | |
| user_id | FK users | author |
| body | text | plain text, v1 |

### payments
Money in/out between client and organization. Recorded manually by superadmin.

| Column | Type | Notes |
|---|---|---|
| service_order_id | FK service_orders | |
| recorded_by | FK users | superadmin |
| type | enum('deposit','balance','refund') | refund = money out to client, subtracted in reports |
| amount | decimal(10,2) | |
| method | varchar(50) | cash / transfer / qr |
| reference_no | varchar(100) nullable | |
| order_file_id | FK order_files nullable | link to client's payment_proof file |
| receipt_no | varchar(20) unique nullable | `RCP-2026-0001` (via `sequences`); deposit/balance only |
| receipt_path | varchar(255) nullable | R2 key of auto-generated receipt PDF |
| paid_at | date | |

### payouts
Money out: organization → provider. Recorded after order completed & fully paid.

| Column | Type | Notes |
|---|---|---|
| service_order_id | FK service_orders | |
| provider_id | FK users | |
| recorded_by | FK users | superadmin |
| amount | decimal(10,2) | manual, decided per order |
| method | varchar(50) | cash / transfer |
| reference_no | varchar(100) nullable | |
| notes | text nullable | |
| paid_at | date | |

### invoices
| Column | Type | Notes |
|---|---|---|
| service_order_id | FK service_orders | |
| invoice_no | varchar(20) unique | `INV-2026-0001` (via `sequences`) |
| pdf_path | varchar(255) | R2 key |
| issued_at | timestamp | |

### events
| Column | Type | Notes |
|---|---|---|
| title | varchar(255) | |
| description | text nullable | |
| location | varchar(255) | |
| starts_at / ends_at | datetime | |
| budget | decimal(10,2) default 0 | planned |
| actual_spend | decimal(10,2) nullable | post-event |
| poster_path | varchar(255) nullable | R2 key |
| status | enum('draft','published','done') | default 'draft' |
| created_by | FK users | |

### attendances
Members/providers only — enforced by policy (clients blocked).

| Column | Type | Notes |
|---|---|---|
| event_id | FK events | composite unique (event_id, user_id) |
| user_id | FK users | |
| scanned_at | timestamp | |

### sequences
Generic yearly counters — used for membership ID, order no, and invoice no.

| Column | Type | Notes |
|---|---|---|
| type | enum('membership','order','invoice','receipt') | composite unique (type, year) |
| year | smallint | e.g. 2026 |
| last_number | int unsigned default 0 | incremented inside DB transaction with `lockForUpdate()` |

### activity_log
From `spatie/laravel-activitylog` package migration. Logs: payments, payouts, role changes, service price changes, order status changes, user deactivation.

## 3. Enums (PHP `app/Enums/`)

- `UserRole`: superadmin, provider, member, client
- `OrderStatus`: pending, in_progress, completed, cancelled — with `canTransitionTo()` helper
- `PaymentType`: deposit, balance, refund
- `FileCategory`: reference, delivery, payment_proof
- `EventStatus`: draft, published, done
- `SequenceType`: membership, order, invoice, receipt

## 4. Key Relationships (Eloquent)

```php
User:         belongsToMany(Skill),
              hasMany(ServiceOrder, 'user_id'),          // as client
              hasMany(ServiceOrder, 'provider_id'),      // as provider
              hasMany(Payout, 'provider_id'),            // earnings
              hasMany(Attendance)
ServiceOrder: belongsTo(User), belongsTo(User as provider),
              belongsTo(Service), hasMany(OrderFile),
              hasMany(OrderComment), hasMany(Payment),
              hasMany(Payout), hasOne(Invoice)
Payment:      belongsTo(ServiceOrder), belongsTo(OrderFile as proof)
Event:        hasMany(Attendance), belongsTo(User creator)
```

## 5. Seeders

1. `SkillSeeder` — predefined skill list.
2. `ServiceSeeder` — starting data only (Website RM300, App RM150, Resume RM50); superadmin manages via UI afterwards.
3. `SuperadminSeeder` — initial superadmin account (credentials from env).
4. `DemoSeeder` (local only) — fake members, orders, payments, payouts, events via factories.

## 6. Indexing Notes

- `users.role`, `users.membership_id`, `service_orders.status`, `service_orders.user_id`, `service_orders.provider_id`, `payouts.provider_id` indexed for dashboard/list queries.
- Dashboard aggregates (monthly trends) group on `created_at`/`paid_at` — acceptable at this scale, no extra index needed for v1.
