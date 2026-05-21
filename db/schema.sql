CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  display_name  TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE books (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  author        TEXT,
  markdown_uri  TEXT NOT NULL,          -- S3 path to source
  ast_cache     JSONB,                  -- parsed AST for fast re-render
  cover         JSONB NOT NULL,         -- {material, color, emboss}
  paper         TEXT NOT NULL,          -- ivory|vellum|coated
  illust_style  TEXT NOT NULL,
  shelf_order   INTEGER DEFAULT 0,
  total_pages   INTEGER,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_books_user_shelf ON books(user_id, shelf_order);

CREATE TABLE illustrations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id       UUID REFERENCES books(id) ON DELETE CASCADE,
  page_number   INTEGER,
  prompt        TEXT NOT NULL,
  style         TEXT NOT NULL,
  asset_uri     TEXT NOT NULL,          -- S3
  approved      BOOLEAN DEFAULT FALSE,
  generated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE pages (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id       UUID REFERENCES books(id) ON DELETE CASCADE,
  page_number   INTEGER NOT NULL,
  content_ast   JSONB NOT NULL,         -- blocks on this page
  illustration_id UUID REFERENCES illustrations(id),
  UNIQUE(book_id, page_number)
);

CREATE TABLE reading_progress (
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  book_id       UUID REFERENCES books(id) ON DELETE CASCADE,
  last_page     INTEGER DEFAULT 0,
  bookmarks     INTEGER[] DEFAULT '{}',
  total_minutes INTEGER DEFAULT 0,
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY(user_id, book_id)
);

CREATE TABLE annotations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id),
  book_id       UUID REFERENCES books(id) ON DELETE CASCADE,
  page_number   INTEGER NOT NULL,
  selection     TEXT,
  note          TEXT,
  color         TEXT DEFAULT 'amber',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
