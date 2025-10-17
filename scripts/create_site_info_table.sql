-- SQL to create a simple site_info table for storing About and Quick Links
-- Run this in your Supabase SQL editor or Postgres client

CREATE TABLE IF NOT EXISTS site_info (
  id text PRIMARY KEY DEFAULT 'site',
  about text,
  quick_links jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Insert a default row if none exists
INSERT INTO site_info (id, about, quick_links)
SELECT 'site', 'Desinfo is a student information board that keeps students and staff informed about announcements, events and results.', '[]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM site_info WHERE id = 'site');
