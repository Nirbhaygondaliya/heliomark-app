## Project: Heliomark Frontend
- Framework: Next.js (App Router) + Tailwind CSS + TypeScript
- Deployed: Vercel at heliomark.ai
- Auth: AWS Cognito
- Backend API: https://api.heliomark.ai

## Folder Structure
- src/app/ — all pages (App Router)
- src/components/ — reusable UI components
- src/lib/ — API calls, utilities
- public/ — static assets (logo, images)

## Brand Colors
- Primary buttons/headers: #334e68
- Secondary text: #627d98
- Accents/highlights: #f0e4c8
- Page background: #fafbfc

## Pages
- src/app/page.tsx — redirects to login
- src/app/login/page.tsx — login page
- src/app/evaluate/page.tsx — main dashboard

## Rules for Claude
- Use functional components only
- Use Tailwind utility classes only (no custom CSS unless necessary)
- Do NOT touch any AWS/Cognito config
- Keep changes small and file-specific
- Ask before modifying layout.tsx or globals.css