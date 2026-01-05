# Heliomark AI - Answer Sheet Evaluation

AI-powered answer sheet evaluation web app for teachers.

## Features

- 📝 Upload scanned answer sheets (PDF)
- 🤖 AI-powered evaluation with multiple strictness levels
- ✏️ Review and edit marks inline
- 📊 Detailed summary with marks breakdown
- 📱 Share results via WhatsApp or download

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Fonts**: DM Sans + Outfit

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Open this folder in VS Code:
   ```bash
   cd heliomark-app
   code .
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deploy to Vercel

1. Push this code to a GitHub repository

2. Go to [vercel.com](https://vercel.com) and import your repository

3. Vercel will auto-detect Next.js and deploy

4. Connect your `heliomark.ai` domain in Project Settings → Domains

## Project Structure

```
heliomark-app/
├── src/
│   ├── app/
│   │   ├── globals.css      # Global styles & Tailwind
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home (redirects to login)
│   │   ├── login/
│   │   │   └── page.tsx     # Login page
│   │   └── evaluate/
│   │       └── page.tsx     # Main evaluation dashboard
│   ├── components/          # Reusable components
│   └── lib/                 # Utilities & helpers
├── public/                  # Static assets (logo, etc.)
├── tailwind.config.js       # Tailwind configuration
└── package.json
```

## Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Helio 700 | `#334e68` | Primary buttons, headers |
| Helio 500 | `#627d98` | Secondary text |
| Cream 300 | `#f0e4c8` | Accents, highlights |
| Background | `#fafbfc` | Page background |

## Development Progress

- [x] Step 1: Project setup
- [x] Step 2: Login page
- [ ] Step 3: Main evaluation page
- [ ] Step 4: Review/Edit panel
- [ ] Step 5: Result page
- [ ] Step 6: Polish & navigation

---

Built with ❤️ by Heliomark AI
