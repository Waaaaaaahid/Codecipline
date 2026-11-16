# DevMarket — Developer Portfolio & Source Code Marketplace

A premium personal developer portfolio and source code marketplace built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, **MongoDB**, and **Razorpay**.

---

## ✨ Features

- **Dark premium UI** — accent orange on `#0B0B0D` background
- **Project showcase** — grid with category filters, search, and detail pages
- **Screenshot gallery** — lightbox viewer on project detail pages
- **Secure payments** — Razorpay checkout with **server-side signature verification**
- **Protected downloads** — expiring one-time tokens, ZIP never publicly accessible
- **Admin dashboard** — add/edit/delete projects, upload ZIPs, view sales & earnings
- **JWT auth** — httpOnly cookie, no localStorage tokens
- **Sample data fallback** — works without DB for development

---

## 🚀 Quick Start

### 1. Clone & install

```bash
git clone <your-repo>
cd devmarket
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

### 3. Create the admin account

Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env.local` to your chosen account credentials.

```bash
npx tsx scripts/seed-admin.ts
```

### 4. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Admin panel: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## 🗄️ MongoDB Setup

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a database user with read/write access
3. Whitelist `0.0.0.0/0` (or specific IPs) in Network Access
4. Copy the connection string to `MONGODB_URI` in `.env.local`

The app auto-creates collections on first use. No migrations needed.

---

## 💳 Razorpay Setup

1. Sign up at [razorpay.com](https://razorpay.com)
2. Go to **Settings → API Keys → Generate Key**
3. Copy `Key ID` → `RAZORPAY_KEY_ID`
4. Copy `Key Secret` → `RAZORPAY_KEY_SECRET`

> Use `rzp_test_*` keys in development, `rzp_live_*` in production.

**Payment flow (security):**
1. Browser → `POST /api/payments/create-order` — creates Razorpay order
2. Browser opens Razorpay checkout
3. Browser → `POST /api/payments/verify` — server verifies HMAC-SHA256 signature
4. Only after valid signature → generate expiring download token
5. Browser → `GET /api/download/[token]` — serves ZIP with token + expiry check

---

## 🔐 Security Notes

| Concern | Implementation |
|---|---|
| ZIP files never public | Stored in `private/zips/`, not `/public` |
| sourceFile never in API | Stripped in Mongoose `toJSON` transform |
| Payment not trusted from browser | Backend HMAC-SHA256 verification |
| Download links expire | 24-hour expiry, max 5 downloads |
| Admin routes protected | JWT httpOnly cookie on every request |
| Secrets in env vars | Zero hardcoded keys |

---

## 📁 Project Structure

```
├── app/
│   ├── page.tsx                  # Home
│   ├── projects/
│   │   ├── page.tsx              # All projects
│   │   └── [slug]/page.tsx       # Project detail + buy
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── admin/
│   │   ├── login/page.tsx
│   │   └── dashboard/
│   │       ├── page.tsx          # Stats overview
│   │       ├── projects/         # CRUD
│   │       └── purchases/        # Order history
│   └── api/
│       ├── projects/             # Public project API
│       ├── payments/             # create-order + verify
│       ├── download/[token]/     # Secure file delivery
│       ├── contact/              # Contact form
│       └── admin/                # Protected admin API
├── components/
│   ├── layout/   Navbar, Footer
│   ├── ui/       Button, Badge, Spinner, EmptyState, Skeleton
│   ├── home/     HeroSection, FeaturedProjects, AboutSnippet
│   ├── projects/ ProjectCard, ProjectGrid, BuyButton, Gallery
│   ├── contact/  ContactForm
│   └── admin/    Sidebar, Header, ProjectList, ProjectForm
├── lib/
│   ├── db.ts        MongoDB connection
│   ├── auth.ts      JWT helpers
│   ├── razorpay.ts  Razorpay + signature verification
│   └── sampleData.ts 6 sample projects (dev fallback)
├── models/
│   ├── Project.ts
│   ├── Purchase.ts
│   └── Admin.ts
├── private/zips/     ZIP files (gitignored, never public)
├── scripts/
│   └── seed-admin.ts
└── types/index.ts
```

---

## ☁️ Vercel Deployment

1. Push to GitHub
2. Import project in [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.example`
4. Deploy

> **Important:** Vercel is serverless — the `private/zips/` local folder is ephemeral. For production, integrate **Vercel Blob**, **AWS S3**, or **Cloudflare R2** for ZIP storage and update `app/api/admin/upload/zip/route.ts` and `app/api/download/[token]/route.ts` accordingly.

---

## 🛠️ Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npx tsx scripts/seed-admin.ts` | Create/reset admin account |

---

## 📄 License

MIT — Personal use and commercial use allowed.

---

Built with ❤️ using Next.js, TypeScript, Tailwind CSS, MongoDB & Razorpay.
