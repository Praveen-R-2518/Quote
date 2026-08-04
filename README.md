# Quotation Builder

**An internal quotation tool for [Pumpkin Tours & Travels](https://www.pumpkintours.com)** — built to turn trip details into polished, client-ready travel quotations in minutes instead of hours.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![SQLite](https://img.shields.io/badge/SQLite-Drizzle-green)

---

## What is this?

**Quotation Builder** is a private web application used by Pumpkin Tours & Travels staff to create professional travel quotations. It guides employees through a structured workflow — customer details, itinerary, passengers, pricing, rooms, transport, hotels, inclusions, and exclusions — then exports a **branded Word document and matching PDF** using the company's official quotation template.

It is not a public booking site. It is an **internal productivity tool** for sales consultants, travel executives, and office staff who prepare quotes every day.

---

## What problem does it solve?

Before this tool, preparing a quotation typically meant:

- Copy-pasting details across Word documents and spreadsheets
- Manually calculating room counts, transport capacity, and per-person pricing
- Reformatting the same template over and over for every client
- Risking inconsistent branding, missing inclusions/exclusions, or math errors
- Spending far too long on document layout instead of selling the trip

**Quotation Builder removes that friction.** Staff enter trip data once; the app handles calculations, suggestions, and document generation. The output matches Pumpkin Tours' official template — logo, layout, tour plan table, pricing summary, and inclusion lists included.

---

## Why I built this (motive)

Travel agencies live and die by how fast and professional their quotes look. Pumpkin Tours & Travels needed more than a generic form — they needed a tool that:

1. **Respects the existing business process** — same template, same fields, same brand identity employees already use.
2. **Reduces repetitive manual work** — room allocation, vehicle suggestions, and package descriptions should not be recalculated from scratch every time.
3. **Produces documents clients can trust** — a quotation that looks as premium as the trip itself builds confidence before the first phone call back.
4. **Works for the whole team** — configurable via an admin panel so places, hotels, vehicles, currencies, and templates stay up to date without touching code.
5. **Is practical on the job** — usable on desktop at the office and on mobile when consultants need to pick up a draft on the go.

This project is my answer to that: a focused internal product that makes quotation creation **faster, more accurate, and consistently on-brand**.

---

## Key features

### Guided quotation wizard
- **Trip basics** — customer, duration, passengers, currency & pricing
- **Places** — overnight stays across the tour
- **Rooms & transport** — side-by-side allocation with smart suggestions
- **Hotels** — per-location hotel selection with auto-suggest
- **Tour plan** — day-by-day itinerary with dates and meals
- **Inclusions & exclusions** — template-driven, with custom items
- **Preview & export** — review everything before sending

### Smart automation
- Automatic **room allocation** based on guest count and room types
- **Transport recommendations** from passenger count and vehicle rules
- **Hotel suggestions** matched to tour places
- **Package description** generated from nights, days, and meals
- **Tour plan auto-fill** from places and hotel selections
- **Draft auto-save** every 30 seconds to browser storage

### Branded document export
- Fills the official **`quotation-template-source.docx`** template
- Exports **Word (.docx)** and **PDF** with identical layout
- PDF is generated from the filled Word file via Microsoft Word (Windows) so output matches the template pixel-for-pixel
- Summary table shows passenger count as `10pax`, transport, rooms, pricing, and totals

### Admin panel (`/admin`)
PIN-protected configuration for:
- Places, hotels, room types, vehicles, transport rules, currencies
- Inclusion & exclusion templates
- Company details and quotation defaults

### Mobile-friendly UI
Responsive layout across landing page, wizard, preview, and admin — usable on phone, tablet, and desktop.

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS 4 |
| State | Zustand |
| Validation | Zod |
| Database | SQLite via [Drizzle ORM](https://orm.drizzle.team/) |
| Word export | docxtemplater + PizZip (official `.docx` template) |
| PDF export | Microsoft Word COM automation (Windows) |
| Auth | PIN-based admin session (httpOnly cookie) |

---

## Getting started

### Prerequisites

- **Node.js 20+**
- **npm**
- **Microsoft Word** (Windows only — required for PDF export that matches the Word template)

### Installation

```bash
git clone <repository-url>
cd Quote

npm install
npm run db:migrate
npm run db:seed
```

### Environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `file:./data/quote.db` | SQLite database path |
| `ADMIN_PIN` | `1234` | Admin panel PIN (change in production) |

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Usage

### Creating a quotation

1. Open the app and click **Create New Quotation** (or **Continue draft** if one exists).
2. Walk through the wizard steps — data auto-saves as you go.
3. Review on the **Preview** step.
4. Export as **Word** or **PDF** and send to the client.

### Managing configuration

1. Go to `/admin` and enter the admin PIN.
2. Use the sidebar to manage places, hotels, vehicles, templates, and company settings.
3. Changes apply immediately to new quotations.

---

## Project structure

```
src/
├── app/                  # Next.js pages & API routes
│   ├── admin/            # Admin panel
│   ├── preview/          # Quotation preview
│   └── api/              # Config, export, admin APIs
├── components/
│   ├── wizard/           # Quotation wizard steps
│   ├── admin/            # Admin shell, tables, forms
│   ├── landing/          # Landing page
│   └── ui/               # Shared UI primitives
├── lib/
│   ├── export/           # Word/PDF generation
│   ├── admin/            # Admin entity config & CRUD hooks
│   └── quotation-schema.ts
├── store/                # Zustand quotation store
└── db/                   # Drizzle schema & seed

templates/
└── quotation-template-source.docx   # Official Pumpkin quotation template

public/brand/
└── pumpkin-logo.png                 # Company logo
```

---

## Data & storage

| Data | Where it lives |
|------|----------------|
| Quotation drafts | Browser `localStorage` (per device, not on server) |
| Admin configuration | SQLite (`data/quote.db`) |
| Exported files | Generated on demand, downloaded by the user |

There is **no server-side quotation history** by design — drafts stay local until exported.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run db:migrate` | Push schema to SQLite |
| `npm run db:seed` | Seed default configuration |
| `npm run db:backup` | Backup config database to `data/backups/` |
| `npm run test` | Run unit tests |
| `npm run lint` | ESLint |

---

## Notes

- **PDF export on Windows**: PDFs are converted from the filled Word document using Microsoft Word. Ensure Word is installed on the machine running the app.
- **Template**: Place the official template at `templates/quotation-template-source.docx`. The filler only replaces data fields — it does not alter logo, branding, or layout.
- **Security**: Change the default `ADMIN_PIN` before deploying. The admin panel is protected by a PIN cookie, not user accounts.

---

## License

Private — internal use for Pumpkin Tours & Travels.

---

Built with care for the people who sell travel every day.
