import express from 'express';
import { query } from '../config/db.js';

const router = express.Router();

const outlineFields = `
  id,
  slug,
  title,
  subtitle,
  excerpt,
  category,
  cover_image_url,
  cover_image_alt,
  reading_time_minutes,
  status,
  published_at,
  created_at,
  updated_at,
  focus_phrase,
  meta_description
`;

router.get('/', async (req, res) => {
  try {
    const {
      status = 'published',
      limit = '20',
      offset = '0',
      search = '',
    } = req.query;

    const limitNum = Math.min(Number(limit) || 20, 100);
    const offsetNum = Number(offset) || 0;

    const where = [];
    const params = [];

    if (status) {
      params.push(status);
      where.push(`status = $${params.length}`);
    }

    if (search) {
      params.push(`%${search}%`);
      where.push(`(title ILIKE $${params.length} OR excerpt ILIKE $${params.length})`);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    params.push(limitNum, offsetNum);

    const sql = `
      SELECT ${outlineFields}
      FROM app.blogs
      ${whereSql}
      ORDER BY published_at DESC NULLS LAST, created_at DESC
      LIMIT $${params.length - 1}
      OFFSET $${params.length}
    `;

    const result = await query(sql, params);
    res.json({ items: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch blog outlines' });
  }
});

// when you know the slug e.g. /blogs/my-post-slug
// used when fetching a particular blog post
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const result = await query(
      `SELECT * FROM app.blogs WHERE slug = $1 LIMIT 1`,
      [slug],
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json({ item: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
});

const toJsonb = (value) => {
  if (value === null || value === undefined || value === '') return null
  if (typeof value === 'string') return JSON.stringify(JSON.parse(value))
  return JSON.stringify(value)
}

router.post('/', async (req, res) => {
  try {
    const expectedPassword = process.env.UPLOAD_PASSWORD || '';
    const providedPassword = req.body.upload_password || '';
    if (!expectedPassword || providedPassword !== expectedPassword) {
      return res.status(401).json({ error: 'Invalid upload password' });
    }

    const {
      slug,
      title,
      subtitle,
      excerpt,
      content_md,
      content_html,
      cover_image_url,
      cover_image_alt,
      status,
      reading_time_minutes,
      published_at,
      focus_phrase,
      keywords,
      meta_title,
      meta_description,
      canonical_url,
      og_title,
      og_description,
      og_image_url,
      twitter_title,
      twitter_description,
      twitter_image_url,
      faq_json,
      schema_json,
    } = req.body;
    

    const result = await query(
      `
        INSERT INTO app.blogs (
          slug, title, subtitle, excerpt, content_md, content_html, cover_image_url,
          cover_image_alt, status, reading_time_minutes, published_at,
          focus_phrase, keywords, meta_title, meta_description, canonical_url,
          og_title, og_description, og_image_url, twitter_title, twitter_description,
          twitter_image_url, faq_json, schema_json
        )
        VALUES (
          $1,$2,$3,$4,$5,$6,$7,
          $8,$9,$10,$11,$12,$13,
          $14,$15,$16,$17,$18,
          $19,$20,$21,$22,$23,
          $24
        )
        RETURNING *
      `,
      [
        slug,
        title,
        subtitle,
        excerpt,
        content_md,
        content_html,
        cover_image_url,
        cover_image_alt,
        status || 'draft',
        reading_time_minutes,
        published_at,
        focus_phrase,
        keywords,
        meta_title,
        meta_description,
        canonical_url,
        og_title,
        og_description,
        og_image_url,
        twitter_title,
        twitter_description,
        twitter_image_url,
        toJsonb(faq_json),
        toJsonb(schema_json),
      ],
    );

    res.status(201).json({ item: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create blog' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const fields = {
      slug: req.body.slug,
      title: req.body.title,
      subtitle: req.body.subtitle,
      excerpt: req.body.excerpt,
      content_md: req.body.content_md,
      content_html: req.body.content_html,
      cover_image_url: req.body.cover_image_url,
      cover_image_alt: req.body.cover_image_alt,
      status: req.body.status,
      reading_time_minutes: req.body.reading_time_minutes,
      published_at: req.body.published_at,
      focus_phrase: req.body.focus_phrase,
      keywords: req.body.keywords,
      meta_title: req.body.meta_title,
      meta_description: req.body.meta_description,
      canonical_url: req.body.canonical_url,
      og_title: req.body.og_title,
      og_description: req.body.og_description,
      og_image_url: req.body.og_image_url,
      twitter_title: req.body.twitter_title,
      twitter_description: req.body.twitter_description,
      twitter_image_url: req.body.twitter_image_url,
      faq_json: req.body.faq_json,
      schema_json: req.body.schema_json,
    };

    const setClauses = [];
    const values = [];
    Object.entries(fields).forEach(([key, value]) => {
      if (value !== undefined) {
        values.push(value);
        setClauses.push(`${key} = $${values.length}`);
      }
    });

    if (!setClauses.length) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    const sql = `
      UPDATE app.blogs
      SET ${setClauses.join(', ')}, updated_at = NOW()
      WHERE id = $${values.length}
      RETURNING *
    `;

    const result = await query(sql, values);

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json({ item: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update blog' });
  }
});

export default router;
