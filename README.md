# Fanvue Feedback

A feedback platform where creators and fans submit feature requests, vote on ideas, and track progress through to completion.

## Prerequisites

- Node.js 18+
- PostgreSQL (Neon serverless)
- OpenAI API key (optional, for duplicate detection)

## Setup

```bash
cp .env.example .env.local   # configure DATABASE_URL
npm install
npm run db:push              # apply schema to database
npm run db:seed              # populate seed data
npm run dev                  # http://localhost:3000
```

## Useful Commands

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run test` | Run tests |
| `npm run typecheck` | Type check |
| `npm run lint` | Biome check |
| `npm run format` | Auto-format |
| `npm run db:push` | Sync schema to database |
| `npm run db:seed` | Seed database |
| `npm run db:generate` | Generate migrations |
| `npm run knip` | Find unused code |
