<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

type BlogPost = {
  slug: string
  title: string
  cover_image_url: string | null
  excerpt: string | null
  reading_time_minutes: number | null
  published_at: string | null
  created_at: string,
  category?: string | null
};

const posts = ref<BlogPost[]>([]);
const topics = ref<string[]>([]);
const featuredPost = computed(() => (posts.value.length ? posts.value[0] : null));
const router = useRouter();

const formatDate = (value: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString();
};

const goToPost = (slug: string) => {
  router.push(`/posts/${slug}`);
};

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';


onMounted(async () => {
  try {
    fetch(`${API_BASE}/blogs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        posts.value = Array.isArray(data.items) ? data.items : [];
        console.log(data.items);
        
        const categories = posts.value
          .map((post) => post.category)
          .filter((value): value is string => Boolean(value));
        topics.value = [...new Set(categories)];
      })
    
  } catch (error) {
    posts.value = [];
  }
});
</script>

<template>
  <div class="home">
    <header class="site-header">
      <div class="brand">
        <img src="../assets/caskly-logo-100x100.png" alt="C" class="brand-mark">
        <div>
          <p class="brand-name">Caskly Blog</p>
          <p class="brand-tagline">Management insights for British pubs</p>
        </div>
      </div>
      <nav class="nav">
        <a class="nav-link is-active" href="#">Home</a>
        <a class="nav-link" href="#">Topics</a>
        <a class="nav-link" href="#">About</a>
        <router-link class="nav-link" to="/upload">Upload</router-link>
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
      <div class="hero-card" v-if="featuredPost" role="button" tabindex="0" @click="goToPost(featuredPost.slug)">
        <p class="hero-card-label" style="color: var(--accent);">Featured this week</p>
        <h3>{{ featuredPost.title }}</h3>
        <p v-if="featuredPost.excerpt">
          {{ featuredPost.excerpt }}
        </p>
        <p v-else>Check back soon for the latest insights.</p>
        <div class="meta-row">
          <span v-if="formatDate(featuredPost.published_at || featuredPost.created_at)">
            {{ formatDate(featuredPost.published_at || featuredPost.created_at) }}
          </span>
          <span v-if="featuredPost.reading_time_minutes">{{ featuredPost.reading_time_minutes }} min read</span>
        </div>
      </div>
      <div class="hero-card" v-else>
        <p class="hero-card-label" style="color: var(--accent);">Featured this week</p>
        <h3>No featured post yet</h3>
        <p>Check back soon for the latest insights.</p>
      </div>
    </section>

    <section class="topics">
      <p class="section-title">Browse by topic</p>
      <div class="topic-row">
        <button v-if="topics.length > 0" v-for="topic in topics" :key="topic" class="topic-pill">
          {{ topic }}
        </button>
        <h3 v-else>No topics to browse</h3>
      </div>
    </section>

    <section id="latest" class="latest">
      <div class="section-head">
        <h2>Latest posts</h2>
        <p>Focused, specific playbooks you can use on your next shift.</p>
      </div>
      <div class="post-grid">
        <article
          v-if="posts.length > 0"
          v-for="post in posts"
          :key="post.slug"
          class="post-card"
          role="button"
          tabindex="0"
          @click="goToPost(post.slug)"
        >
          <div class="post-image" v-if="post.cover_image_url">
            <img :src="post.cover_image_url" :alt="post.title" class="post-img" loading="lazy" />
          </div>
          <div class="post-meta">
            <span class="post-category">{{ post.category }}</span>
            <span>{{ post.created_at }}</span>
          </div>
          <h3>{{ post.title }}</h3>
          <p class="post-excerpt">{{ post.excerpt }}</p>
          <div class="post-footer">
            <span>{{ post.reading_time_minutes }}</span>
            <router-link class="post-link" :to="`/posts/${post.slug}`">Read post</router-link>
          </div>
        </article>
        <h3 v-else>No posts yet. Check in later.</h3>
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
  gap: 4px;
}

.brand-mark {
  width: 55px;
  height: 55px;
  border-radius: 12px;
}

.brand-name {
  margin: 0;
  font-weight: 600;
  font-size: 1.5rem;
  font-family: 'Clash Display', sans-serif;
}

.brand-tagline {
  margin: 2px 0 0;
  color: var(--ink);
  opacity: 0.7;
  font-size: 1rem;
}

.nav {
  display: flex;
  gap: 20px;
  font-size: 1.2rem;
  font-weight: bold;
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
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
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
  min-width: 350px;
  max-width: calc(33% - 44px);
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
