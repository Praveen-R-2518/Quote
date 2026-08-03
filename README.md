# Sri Lanka Travel Quotation Generator

Internal MVP for generating travel quotations for Sri Lanka tours. Drafts are saved to localStorage only — no quotation history in the database.

## Features

- **Wizard workflow**: customer, duration, tour places, staying locations, passengers, pricing, room allocation, transport, hotels, inclusions/exclusions, preview
- **Smart suggestions**: room allocation, transport (multi-vehicle), and hotel recommendations
- **Export**: PDF and Word (DOCX) document generation
- **Admin panel** (`/admin`): PIN-protected configuration management (default PIN: `1234`)
- **SQLite config DB**: places, currencies, room types, vehicles, hotels, templates

## Setup

```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Copy `.env.example` to `.env.local`:

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `file:./data/quote.db` | SQLite database path |
| `ADMIN_PIN` | `1234` | Admin panel PIN |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run db:migrate` | Push schema to SQLite |
| `npm run db:seed` | Seed configuration data |
| `npm run db:backup` | Backup config database |
| `npm run test` | Run unit tests |

## Architecture

- **Draft storage**: Browser localStorage (no server-side quotation persistence)
- **Config storage**: SQLite via Drizzle ORM
- **State management**: Zustand store with auto-save every 30 seconds
- **Export**: Server-side PDF (`@react-pdf/renderer`) and DOCX (`docx`) generation

## Admin

Navigate to `/admin` and enter the PIN to manage:
- Places, currencies, room types, vehicles, hotels
- Inclusion/exclusion templates

## Backup

Run `npm run db:backup` to copy the config database to `data/backups/`.
