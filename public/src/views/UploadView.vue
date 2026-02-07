<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

const form = reactive({
  slug: '',
  title: '',
  subtitle: '',
  excerpt: '',
  content_md: '',
  cover_image_url: '',
  cover_image_alt: '',
  focus_phrase: '',
  keywords: '',
  meta_title: '',
  meta_description: '',
  canonical_url: '',
  og_title: '',
  og_description: '',
  og_image_url: '',
  twitter_title: '',
  twitter_description: '',
  twitter_image_url: '',
  faq_json: '',
  schema_json: '',
  status: 'draft',
  reading_time_minutes: '',
  published_at: '',
  upload_password: '',
})

const isSubmitting = ref(false)
const submitMessage = ref('')
const submitError = ref('')

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

const applySlug = () => {
  form.slug = slugify(form.title || form.slug)
}

const parseMarkdown = (input: string) => {
  let html = input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  html = html.replace(/\[(.+?)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')

  const blocks = html
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => (block.startsWith('<h') ? block : `<p>${block.replace(/\n/g, '<br/>')}</p>`))

  return blocks.join('\n')
}

const previewHtml = computed(() => parseMarkdown(form.content_md || ''))

const metaPreviewTitle = computed(() => form.meta_title || form.title || 'Meta title preview')
const metaPreviewDesc = computed(
  () => form.meta_description || form.excerpt || 'Meta description preview that summarizes the post.',
)

const buildPayload = () => {
  const keywords = form.keywords
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean)

  const parseJson = (value: string) => {
    if (!value.trim()) return null
    return JSON.parse(value)
  }

  return {
    slug: form.slug,
    title: form.title,
    subtitle: form.subtitle || null,
    excerpt: form.excerpt || null,
    content_md: form.content_md || null,
    content_html: previewHtml.value || null,
    cover_image_url: form.cover_image_url || null,
    cover_image_alt: form.cover_image_alt || null,
    status: form.status || 'draft',
    reading_time_minutes: form.reading_time_minutes ? Number(form.reading_time_minutes) : null,
    published_at: form.published_at || null,
    focus_phrase: form.focus_phrase || null,
    keywords: keywords.length ? keywords : null,
    meta_title: form.meta_title || null,
    meta_description: form.meta_description || null,
    canonical_url: form.canonical_url || null,
    og_title: form.og_title || null,
    og_description: form.og_description || null,
    og_image_url: form.og_image_url || null,
    twitter_title: form.twitter_title || null,
    twitter_description: form.twitter_description || null,
    twitter_image_url: form.twitter_image_url || null,
    faq_json: parseJson(form.faq_json),
    schema_json: parseJson(form.schema_json),
    upload_password: form.upload_password,
  }
}

const submit = async () => {
  submitMessage.value = ''
  submitError.value = ''

  if (!form.title || !form.slug || !form.content_md || !form.upload_password) {
    submitError.value = 'Please fill title, slug, content, and password.'
    return
  }

  isSubmitting.value = true
  try {
    let payload
    try {
      payload = buildPayload()
    } catch (err) {
      submitError.value = 'Invalid JSON in FAQ or Schema fields.'
      return
    }
    const res = await fetch(`${apiBase}/blogs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || 'Upload failed')
    }

    submitMessage.value = 'Saved. Your blog post is now in the database.'
  } catch (err) {
    submitError.value = err instanceof Error ? err.message : 'Upload failed'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="upload">
    <header class="top">
      <div class="brand">
        <span class="brand-mark">C</span>
        <div>
          <p class="brand-name">Caskly Blog Admin</p>
          <p class="brand-tagline">Upload SEO + AEO ready posts</p>
        </div>
      </div>
      <div class="top-actions">
        <button class="ghost" type="button" @click="applySlug">Generate slug</button>
        <div class="status-pill">{{ form.status }}</div>
      </div>
    </header>

    <div class="grid">
      <section class="panel">
        <h2>Core</h2>
        <div class="field-row">
          <label>
            Title
            <input v-model="form.title" type="text" placeholder="How to cut waste behind the bar" />
          </label>
          <label>
            Slug
            <input v-model="form.slug" type="text" placeholder="how-to-cut-waste" />
          </label>
        </div>
        <label>
          Subtitle
          <input v-model="form.subtitle" type="text" placeholder="One sentence positioning" />
        </label>
        <label>
          Excerpt
          <textarea v-model="form.excerpt" rows="3" placeholder="Short summary used in lists." />
        </label>
      </section>

      <section class="panel">
        <h2>Hero Image</h2>
        <label>
          Image URL (always displayed right after title)
          <input v-model="form.cover_image_url" type="url" placeholder="https://..." />
        </label>
        <label>
          Image alt text
          <input v-model="form.cover_image_alt" type="text" placeholder="Bartender topping up pints" />
        </label>
        <div class="image-preview" v-if="form.cover_image_url">
          <img :src="form.cover_image_url" :alt="form.cover_image_alt || form.title" />
        </div>
      </section>

      <section class="panel wide">
        <h2>Body</h2>
        <div class="editor">
          <textarea
            v-model="form.content_md"
            rows="18"
            placeholder="# H1\n## H2\n### H3\n*Italics* and **Bold**\n[link text](https://example.com)"
          />
          <div class="preview">
            <h1 class="preview-title">{{ form.title || 'Preview title' }}</h1>
            <img
              v-if="form.cover_image_url"
              class="preview-image"
              :src="form.cover_image_url"
              :alt="form.cover_image_alt || form.title"
            />
            <div class="preview-body" v-html="previewHtml" />
          </div>
        </div>
      </section>

      <section class="panel">
        <h2>SEO + AEO</h2>
        <label>
          Focus phrase
          <input v-model="form.focus_phrase" type="text" placeholder="reduce pub waste" />
        </label>
        <label>
          Keywords (comma separated)
          <input v-model="form.keywords" type="text" placeholder="inventory, pub ops, margin" />
        </label>
        <label>
          Meta title
          <input v-model="form.meta_title" type="text" placeholder="SEO title for search results" />
        </label>
        <label>
          Meta description
          <textarea v-model="form.meta_description" rows="3" placeholder="Search snippet text" />
        </label>
        <label>
          Canonical URL
          <input v-model="form.canonical_url" type="url" placeholder="https://blog.caskly.ai/..." />
        </label>
        <label>
          FAQ JSON (optional)
          <textarea v-model="form.faq_json" rows="4" placeholder='[{"question":"...","answer":"..."}]' />
        </label>
        <label>
          Schema JSON (optional)
          <textarea v-model="form.schema_json" rows="4" placeholder='{"@context":"https://schema.org"}' />
        </label>
      </section>

      <section class="panel">
        <h2>Social</h2>
        <label>
          Open Graph title
          <input v-model="form.og_title" type="text" placeholder="OG title" />
        </label>
        <label>
          Open Graph description
          <textarea v-model="form.og_description" rows="3" placeholder="OG description" />
        </label>
        <label>
          Open Graph image
          <input v-model="form.og_image_url" type="url" placeholder="https://..." />
        </label>
        <label>
          Twitter title
          <input v-model="form.twitter_title" type="text" placeholder="Twitter title" />
        </label>
        <label>
          Twitter description
          <textarea v-model="form.twitter_description" rows="3" placeholder="Twitter description" />
        </label>
        <label>
          Twitter image
          <input v-model="form.twitter_image_url" type="url" placeholder="https://..." />
        </label>
      </section>

      <section class="panel">
        <h2>Publish</h2>
        <div class="field-row">
          <label>
            Status
            <select v-model="form.status">
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="archived">archived</option>
            </select>
          </label>
          <label>
            Reading time (mins)
            <input v-model="form.reading_time_minutes" type="number" min="1" />
          </label>
        </div>
        <label>
          Published at
          <input v-model="form.published_at" type="datetime-local" />
        </label>
        <label>
          Upload password
          <input v-model="form.upload_password" type="password" placeholder="Admin password" />
        </label>

        <button class="submit" type="button" :disabled="isSubmitting" @click="submit">
          {{ isSubmitting ? 'Submitting…' : 'Submit to database' }}
        </button>
        <p v-if="submitMessage" class="status success">{{ submitMessage }}</p>
        <p v-if="submitError" class="status error">{{ submitError }}</p>
      </section>

      <section class="panel meta-preview">
        <h2>Search Preview</h2>
        <div class="preview-card">
          <p class="preview-url">{{ form.canonical_url || 'https://blog.caskly.ai/your-post' }}</p>
          <p class="preview-title-text">{{ metaPreviewTitle }}</p>
          <p class="preview-desc">{{ metaPreviewDesc }}</p>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.upload {
  min-height: 100vh;
  padding: 48px 64px 72px;
  background: radial-gradient(circle at top, #fff7e8, #ffffff 45%, #f0f4ff 100%);
  color: #0b0b0b;
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 16px;
}

.brand-mark {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #ff6b3d;
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-family: 'Clash Display', sans-serif;
}

.brand-name {
  margin: 0;
  font-weight: 600;
  font-size: 1.2rem;
  font-family: 'Clash Display', sans-serif;
}

.brand-tagline {
  margin: 2px 0 0;
  opacity: 0.7;
  font-size: 0.9rem;
}

.top-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.ghost {
  border: 1px solid #0b0b0b;
  padding: 10px 16px;
  border-radius: 999px;
  background: transparent;
  font-weight: 600;
}

.status-pill {
  padding: 6px 12px;
  border-radius: 999px;
  background: #0b0b0b;
  color: #fff;
  font-size: 0.85rem;
}

.grid {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
}

.panel {
  background: #ffffff;
  border-radius: 20px;
  padding: 22px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 16px 30px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: calc(50% - 44px);
}

.panel h2 {
  margin: 0;
  font-family: 'Clash Display', sans-serif;
  font-size: 1.3rem;
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 500;
}

input,
textarea,
select {
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  font-size: 0.95rem;
  font-family: 'Rubik', sans-serif;
  background: #fffdf9;
}

.field-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.wide {
  grid-column: 1 / -1;
}

.editor {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.preview {
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 16px;
  background: #fdf6ec;
}

.preview-title {
  margin: 0 0 12px;
  font-family: 'Clash Display', sans-serif;
  font-size: 1.6rem;
}

.preview-image {
  width: 100%;
  max-height: 220px;
  object-fit: cover;
  border-radius: 14px;
  margin-bottom: 16px;
}

.preview-body :deep(h1),
.preview-body :deep(h2),
.preview-body :deep(h3) {
  font-family: 'Clash Display', sans-serif;
  margin: 18px 0 8px;
}

.preview-body :deep(p) {
  margin: 0 0 12px;
  line-height: 1.6;
}

.image-preview {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.image-preview img {
  width: 100%;
  display: block;
}

.submit {
  padding: 14px 18px;
  border-radius: 999px;
  background: #ff6b3d;
  color: #fff;
  border: none;
  font-weight: 700;
  font-size: 1rem;
}

.submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.status {
  margin: 0;
  font-size: 0.9rem;
}

.status.success {
  color: #0f7a3a;
}

.status.error {
  color: #b11212;
}

.meta-preview {
  background: #0b0b0b;
  color: #fff;
}

.preview-card {
  background: #1b1b1b;
  border-radius: 16px;
  padding: 18px;
}

.preview-url {
  margin: 0 0 8px;
  font-size: 0.8rem;
  opacity: 0.6;
}

.preview-title-text {
  margin: 0 0 6px;
  font-size: 1.1rem;
  font-weight: 600;
}

.preview-desc {
  margin: 0;
  opacity: 0.7;
  font-size: 0.9rem;
}

@media (max-width: 960px) {
  .upload {
    padding: 32px 20px 48px;
  }

  .top {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
