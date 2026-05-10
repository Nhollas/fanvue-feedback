# Fanvue Feedback

A feedback platform where creators and fans submit feature requests, vote on ideas, and track progress through to completion.

> Personal portfolio project, not affiliated with or endorsed by Fanvue. Built as an exercise using the public [`@fanvue/ui`](https://www.npmjs.com/package/@fanvue/ui) design system.

## Prerequisites

- Node.js 18+
- [Neon](https://neon.tech) PostgreSQL database
- [OpenAI API key](https://platform.openai.com/api-keys)
- [Vercel Flags](https://vercel.com/docs/flags) connection string

## Setup

Create a `.env.local` with the following:

```
DATABASE_URL="your_database_url"
FLAGS="your_flags_connection_string"
OPENAI_API_KEY="your_openai_api_key"
```

Then:

```bash
pnpm install
pnpm db:push              # apply schema to database
pnpm db:seed              # populate seed data
pnpm dev                  # http://localhost:3000
```

## Useful Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm test` | Run tests |
| `pnpm typecheck` | Type check |
| `pnpm lint` | Biome check |
| `pnpm format` | Auto-format |
| `pnpm db:push` | Sync schema to database |
| `pnpm db:seed` | Seed database |
| `pnpm db:generate` | Generate migrations |
| `pnpm knip` | Find unused code |
