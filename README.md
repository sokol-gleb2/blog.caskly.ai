# Database Schema Structure

Recommended PostgreSQL schemas (logical namespaces):

```
database
├── app        -- application tables (blogs, tags, assets, etc.)
├── internal   -- jobs, logs, system-ish tables
└── public     -- extensions only
```

Notes:
- This project currently uses a single `blogs` table. It can live in `app.blogs`.
- Keep `public` empty of app tables; reserve it for extensions (for example `pg_trgm`).
- You can set `search_path` to `app, public` to avoid schema prefixes in queries.

`vercel --prod`