<script setup lang="ts">
// Placeholder content until the API + database are wired.
const posts = [
  {
    slug: 'reduce-waste-behind-the-bar',
    title: 'How to cut waste behind the bar without slowing service',
    excerpt:
      'A practical playbook for British pubs: better prep discipline, smarter par levels, and a weekly cadence that sticks.',
    date: 'Feb 2, 2026',
    readTime: '7 min read',
    category: 'Operations',
    image: '/src/assets/home.jpg',
  },
  {
    slug: 'rotas-that-staff-love',
    title: 'Rotas that staff actually love (and that managers can maintain)',
    excerpt:
      'Build predictability for your team while staying flexible on busy match days with a few high-leverage rules.',
    date: 'Jan 28, 2026',
    readTime: '6 min read',
    category: 'People',
    image: '/src/assets/home.jpg',
  },
  {
    slug: 'stock-counts-in-30-mins',
    title: 'Stock counts in 30 minutes: the pub manager’s checklist',
    excerpt:
      'A tight, repeatable routine that keeps cellar numbers accurate without the usual end-of-week stress.',
    date: 'Jan 23, 2026',
    readTime: '5 min read',
    category: 'Inventory',
    image: '/src/assets/home.jpg',
  },
  {
    slug: 'promotions-for-quiet-weeknights',
    title: 'Promotions that lift quiet weeknights (without discount fatigue)',
    excerpt:
      'Create demand for Monday to Thursday with mini-events, low-cost bundles, and smart upsells.',
    date: 'Jan 17, 2026',
    readTime: '8 min read',
    category: 'Marketing',
    image: '/src/assets/home.jpg',
  },
  {
    slug: 'aeo-ready-pub-answers',
    title: 'AEO-ready answers your pub customers are already asking',
    excerpt:
      'A list of questions that win featured snippets and voice search, plus the structure to answer them clearly.',
    date: 'Jan 11, 2026',
    readTime: '6 min read',
    category: 'SEO',
    image: '/src/assets/home.jpg',
  },
  {
    slug: 'matchday-operations',
    title: 'Matchday operations: smoother service in the first 30 minutes',
    excerpt:
      'Prep the bar, the floor, and the team for a perfect kickoff surge—no chaos required.',
    date: 'Jan 6, 2026',
    readTime: '5 min read',
    category: 'Service',
    image: '/src/assets/home.jpg',
  },
]

const topics = ['All', 'Operations', 'Inventory', 'People', 'Marketing', 'SEO', 'Service']
</script>

<template>
  <div class="home">
    <header class="site-header">
      <div class="brand">
        <span class="brand-mark">C</span>
        <div>
          <p class="brand-name">Caskly Blog</p>
          <p class="brand-tagline">Management insights for British pubs</p>
        </div>
      </div>
      <nav class="nav">
        <a class="nav-link is-active" href="#">Home</a>
        <a class="nav-link" href="#">Topics</a>
        <a class="nav-link" href="#">About</a>
      </nav>
    </header>

    <section class="hero">
      <div class="hero-copy">
        <h1>Where profits are brewed</h1>
        <p>
          Caskly turns the daily chaos into repeatable systems. This blog shares the tactics that keep
          British pubs profitable and consistently well-run.
        </p>
        <div class="hero-actions">
          <a class="button" href="#latest">Browse latest posts</a>
          <a class="button ghost" href="#subscribe">Get the weekly digest</a>
        </div>
      </div>
      <div class="hero-card">
        <p class="hero-card-label" style="color: var(--accent);">Featured this week</p>
        <h3>Rotas that staff actually love (and that managers can maintain)</h3>
        <p>
          Predictable shifts, fewer swaps, and a framework that keeps the team happy without sacrificing
          busy-night coverage.
        </p>
        <div class="meta-row">
          <span>People</span>
          <span>6 min read</span>
        </div>
      </div>
    </section>

    <section class="topics">
      <p class="section-title">Browse by topic</p>
      <div class="topic-row">
        <button v-for="topic in topics" :key="topic" class="topic-pill">
          {{ topic }}
        </button>
      </div>
    </section>

    <section id="latest" class="latest">
      <div class="section-head">
        <h2>Latest posts</h2>
        <p>Focused, specific playbooks you can use on your next shift.</p>
      </div>
      <div class="post-grid">
        <article v-for="post in posts" :key="post.slug" class="post-card">
          <div class="post-image">
            <img :src="post.image" :alt="post.title" class="post-img" loading="lazy" />
          </div>
          <div class="post-meta">
            <span class="post-category">{{ post.category }}</span>
            <span>{{ post.date }}</span>
          </div>
          <h3>{{ post.title }}</h3>
          <p class="post-excerpt">{{ post.excerpt }}</p>
          <div class="post-footer">
            <span>{{ post.readTime }}</span>
            <a class="post-link" href="#">Read post</a>
          </div>
        </article>
      </div>
    </section>

    <section id="subscribe" class="subscribe">
      <div>
        <p class="section-title">Weekly digest</p>
        <h2>Practical ops advice for British pubs, delivered every Thursday.</h2>
        <p class="muted">No fluff. Just the tactics that move your numbers.</p>
      </div>
      <form class="subscribe-form">
        <input type="email" placeholder="Your email address" />
        <button type="button">Subscribe</button>
      </form>
    </section>

    <footer class="site-footer">
      <div>
        <p class="brand-name">Caskly Blog</p>
        <p class="muted">AI-powered management tool for British pubs.</p>
      </div>
      <p class="muted">© 2026 Caskly. All rights reserved.</p>
    </footer>
  </div>
</template>

<style scoped>
/* Layout */
.home {
  padding: 48px 72px 64px;
  display: flex;
  flex-direction: column;
  gap: 56px;
}

.site-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  width: calc(100% - 160px);
  left: 80px;
  top: 55px;
  padding: 10px;
  border-radius: 24px;
  background-color: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
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
  background: var(--accent);
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-family: 'Clash Display', sans-serif;
}

.brand-name {
  margin: 0;
  font-weight: 600;
  font-size: 1.1rem;
  font-family: 'Clash Display', sans-serif;
}

.brand-tagline {
  margin: 2px 0 0;
  color: var(--ink);
  opacity: 0.7;
  font-size: 0.9rem;
}

.nav {
  display: flex;
  gap: 20px;
  font-size: 0.95rem;
}

.nav-link {
  padding: 6px 0;
  color: var(--ink);
  opacity: 0.7;
}

.nav-link.is-active {
  color: var(--ink);
  opacity: 1;
  border-bottom: 2px solid var(--accent);
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
  gap: 36px;
  align-items: center;
  height: calc(100vh - 90px);
  padding: 48px;
  border-radius: 28px;
  background:
    linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)),
    url('@/assets/home.jpg');
  background-size: cover;
  background-position: center;
}

.hero-copy h1 {
  margin: 12px 0 16px;
  font-family: 'Clash Display', sans-serif;
  font-size: 2.6rem;
  line-height: 1.15;
  color: #fff;
}

.hero-copy p {
  margin: 0 0 24px;
  color: #fff;
  font-size: 1.05rem;
  max-width: 520px;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.7rem;
  color: #fff;
}

.hero-actions {
  display: flex;
  gap: 16px;
}

.button {
  padding: 12px 20px;
  border-radius: 999px;
  background: var(--accent);
  color: #fff;
  font-weight: 600;
  border: none;
}

.button.ghost {
  background: transparent;
  border: 1px solid var(--line);
  color: var(--ink);
}

.hero-card {
  background: var(--paper);
  padding: 28px;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.4);
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.hero-card-label {
  margin: 0 0 8px;
  font-size: 0.85rem;
  color: var(--ink);
  opacity: 0.6;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.hero-card h3 {
  font-family: 'Clash Display', sans-serif;
  margin: 0 0 12px;
  font-size: 1.4rem;
}

.hero-card p {
  margin: 0 0 18px;
  color: var(--ink);
  opacity: 0.7;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  color: var(--ink);
  opacity: 0.7;
  font-size: 0.9rem;
}

.topics {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title {
  margin: 0;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--ink);
  opacity: 0.6;
}

.topic-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.topic-pill {
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--paper);
  font-size: 0.85rem;
  color: var(--ink);
}

.latest {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.section-head h2 {
  margin: 0 0 8px;
  font-family: 'Clash Display', sans-serif;
  font-size: 2rem;
  color: var(--accent);
}

.section-head p {
  margin: 0;
  color: var(--ink);
  opacity: 0.7;
}

.post-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.post-card {
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: 18px;
  overflow: hidden;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.post-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent);
}

.post-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--ink);
  opacity: 0.7;
}

.post-category {
  color: var(--accent);
  font-weight: 600;
}

.post-card h3 {
  margin: 0;
  font-family: 'Clash Display', sans-serif;
  font-size: 1.25rem;
}

.post-excerpt {
  margin: 0;
  color: var(--ink);
  opacity: 0.7;
  line-height: 1.5;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: var(--ink);
  opacity: 0.7;
}

.post-link {
  color: var(--accent);
  font-weight: 600;
}

.subscribe {
  background: var(--paper);
  border-radius: 20px;
  padding: 32px;
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
  gap: 24px;
  align-items: center;
  border: 1px solid var(--line);
}

.subscribe h2 {
  margin: 8px 0 8px;
  font-family: 'Clash Display', sans-serif;
  font-size: 1.8rem;
}

.subscribe-form {
  display: flex;
  gap: 12px;
}

.subscribe-form input {
  flex: 1;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid var(--line);
  font-size: 0.95rem;
}

.subscribe-form button {
  padding: 12px 18px;
  border-radius: 12px;
  border: none;
  background: var(--accent);
  color: #fff;
  font-weight: 600;
}

.site-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--line);
  padding-top: 24px;
}

.muted {
  color: var(--ink);
  opacity: 0.7;
  margin: 0;
}

@media (max-width: 960px) {
  .home {
    padding: 32px 24px 48px;
  }

  .site-header {
    position: relative;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .hero {
    grid-template-columns: 1fr;
  }

  .subscribe {
    grid-template-columns: 1fr;
  }

  .subscribe-form {
    flex-direction: column;
  }

  .site-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}

.post-image {
  width: 100%;
  height: 160px;
  overflow: hidden;
  border-radius: 14px;
  border: 1px solid var(--line);
}

.post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>
