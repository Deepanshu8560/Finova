# InsightAI

## Project Overview
InsightAI is a SaaS analytics dashboard for non-technical startup founders.
Users ask plain English questions about their data and get AI-powered answers.

## Tech Stack
- React 18 + Vite
- Tailwind CSS v3 (dark mode only)
- Recharts (all data visualizations)
- Firebase Auth + Firestore
- Groq API (OpenAI-compatible SDK) for AI query layer
- React Router v6
- Lucide React (icons)

## Code Style
- Functional components only — no class components
- Custom hooks for all Firebase and AI logic
- Every component gets a JSDoc comment documenting its props
- Use descriptive variable names — this is portfolio code
- Mobile-first responsive design on every component
- All API keys via environment variables only

## Folder Structure
- `/components/ui/` — reusable UI primitives (Button, Input, Card, etc.)
- `/components/dashboard/` — dashboard-specific components (StatCard, AIQueryBar, etc.)
- `/components/layout/` — structural components (Header, Sidebar, etc.)
- `/pages/` — route-level page components
- `/hooks/` — custom React hooks
- `/lib/` — utilities & service clients (firebase, groq, utils)
- `/context/` — React context providers
- `/data/` — mock data and constants

## AI Layer Rules
- Responses must be 2–4 sentences max
- Always reference actual numbers from the data
- If the question is unclear, ask one clarifying question
- Never say "As an AI" — respond as a data analyst would

## Build Commands
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview production build
