CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS app.blogs (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  excerpt TEXT,
  category TEXT,
  content_md TEXT,
  content_html TEXT,
  cover_image_url TEXT,
  cover_image_alt TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  reading_time_minutes INT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- SEO / AEO
  focus_phrase TEXT,
  keywords TEXT[],
  meta_title TEXT,
  meta_description TEXT,
  canonical_url TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image_url TEXT,
  twitter_title TEXT,
  twitter_description TEXT,
  twitter_image_url TEXT,
  faq_json JSONB,
  schema_json JSONB,
  search_vector tsvector GENERATED ALWAYS AS ( -- FULL TEXT SEARCH
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(excerpt, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(content_md, '')), 'C')
  ) STORED
);

CREATE INDEX IF NOT EXISTS blogs_status_published_idx
  ON app.blogs (status, published_at DESC);

CREATE INDEX IF NOT EXISTS blogs_slug_idx
  ON app.blogs (slug);

CREATE INDEX IF NOT EXISTS blogs_search_idx
  ON app.blogs USING GIN (search_vector);