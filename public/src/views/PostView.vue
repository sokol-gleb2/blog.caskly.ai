<script setup lang="ts">
    import { computed, onBeforeUnmount, ref, watch } from 'vue';
    import { useRoute } from 'vue-router';

    const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

    type Post = {
        id: string,
        slug: string,
        title: string,
        subtitle: string,
        excerpt: string,
        content_md: string,
        content_html: string,
        cover_image_url: string,
        cover_image_alt: string,
        status: string,
        reading_time_minutes: string,
        published_at: string,
        created_at: string,
        updated_at: string,
        focus_phrase: string,
        keywords: string[] | null,
        meta_title: string,
        meta_description: string,
        canonical_url: string,
        og_title: string,
        og_description: string,
        og_image_url: string,
        twitter_title: string,
        twitter_description: string,
        twitter_image_url: string,
        faq_json: string,
        schema_json: string,
    };

    const postDetails = ref<Post>();

    const route = useRoute();
    const slug = route.params.slug as string;

    fetch(`${apiBase}/blogs/${slug}`)
        .then(res => res.json())
        .then(data => {
            postDetails.value = data.item;
        })

    const pageTitle = computed(() => {
        if (!postDetails.value) return 'Blog Post';
        return postDetails.value.meta_title || postDetails.value.title;
    });

    const pageDescription = computed(() => {
        if (!postDetails.value) return '';
        return postDetails.value.meta_description || postDetails.value.excerpt || postDetails.value.subtitle || '';
    });

    const pageCanonical = computed(() => {
        if (!postDetails.value) return '';
        return postDetails.value.canonical_url || '';
    });

    const pageImage = computed(() => {
        if (!postDetails.value) return '';
        return postDetails.value.og_image_url || postDetails.value.cover_image_url || '';
    });

    const keywordList = computed(() => {
        if (!postDetails.value?.keywords) return [];
        return postDetails.value.keywords;
    });

    const pageKeywords = computed(() => keywordList.value.join(', '));

    const faqSchema = computed(() => postDetails.value?.faq_json || null);
    const customSchema = computed(() => postDetails.value?.schema_json || null);

    const schemaScriptIds = {
        faq: 'caskly-faq-schema',
        custom: 'caskly-custom-schema',
    };

    const upsertJsonLd = (id: string, data: unknown) => {
        const existing = document.getElementById(id);
        if (!data) {
            if (existing?.parentNode) {
                existing.parentNode.removeChild(existing);
            }
            return;
        }

        const script = (existing || document.createElement('script')) as HTMLScriptElement;
        script.id = id;
        script.type = 'application/ld+json';
        script.text = typeof data === 'string' ? data : JSON.stringify(data);
        if (!existing) {
            document.head.appendChild(script);
        }
    };

    watch(
        () => faqSchema.value,
        (value) => {
            upsertJsonLd(schemaScriptIds.faq, value);
        },
        { immediate: true },
    );

    watch(
        () => customSchema.value,
        (value) => {
            upsertJsonLd(schemaScriptIds.custom, value);
        },
        { immediate: true },
    );

    onBeforeUnmount(() => {
        upsertJsonLd(schemaScriptIds.faq, null);
        upsertJsonLd(schemaScriptIds.custom, null);
    });
</script>
<template>
    <teleport to="head" v-if="postDetails">
        <title>{{ pageTitle }}</title>
        <meta name="description" :content="pageDescription" />
        <meta name="keywords" :content="pageKeywords" />
        <link v-if="pageCanonical" rel="canonical" :href="pageCanonical" />

        <meta property="og:type" content="article" />
        <meta property="og:title" :content="postDetails.og_title || pageTitle" />
        <meta property="og:description" :content="postDetails.og_description || pageDescription" />
        <meta property="og:image" :content="pageImage" />
        <meta property="og:url" :content="pageCanonical || ''" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" :content="postDetails.twitter_title || pageTitle" />
        <meta name="twitter:description" :content="postDetails.twitter_description || pageDescription" />
        <meta name="twitter:image" :content="postDetails.twitter_image_url || pageImage" />

    </teleport>

    <main class="post">
        <section class="post-hero" v-if="postDetails">
            <p class="post-eyebrow">Blog</p>
            <h1 class="post-title">{{ postDetails.title }}</h1>
            <p class="post-subtitle" v-if="postDetails.subtitle">{{ postDetails.subtitle }}</p>
        </section>

        <figure class="post-cover" v-if="postDetails?.cover_image_url">
            <img
                class="post-cover-img"
                :src="postDetails.cover_image_url"
                :alt="postDetails.cover_image_alt || postDetails.title"
                loading="eager"
                decoding="async"
            />
            <figcaption class="post-cover-caption" v-if="postDetails.cover_image_alt">
                {{ postDetails.cover_image_alt }}
            </figcaption>
        </figure>

        <section class="post-body" v-if="postDetails">
            <div class="post-meta">
                <span v-if="postDetails.published_at">Published {{ new Date(postDetails.published_at).toLocaleDateString() }}</span>
                <span v-if="postDetails.reading_time_minutes">{{ postDetails.reading_time_minutes }} min read</span>
                <span v-if="postDetails.focus_phrase">Focus: {{ postDetails.focus_phrase }}</span>
            </div>

            <div class="post-excerpt" v-if="postDetails.excerpt">
                <p>{{ postDetails.excerpt }}</p>
            </div>

            <article class="post-content" v-html="postDetails.content_html"></article>

            <div class="post-tags" v-if="keywordList.length">
                <h2>Topics</h2>
                <ul>
                    <li v-for="tag in keywordList" :key="tag">
                        <span class="tag">{{ tag }}</span>
                    </li>
                </ul>
            </div>

            <div class="post-links">
                <h2>More Reading</h2>
                <p>Browse the <router-link to="/">blog home</router-link> for additional guides and answers.</p>
            </div>
        </section>
    </main>
</template>

<style scoped>
.post {
    max-width: 900px;
    margin: 0 auto;
    padding: 48px 20px 80px;
    color: #0b0f14;
    font-family: "Charter", "Iowan Old Style", "Palatino Linotype", "Book Antiqua", "Times New Roman", serif;
    line-height: 1.7;
}

.post-hero {
    margin-bottom: 28px;
}

.post-eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-size: 12px;
    color: #6b7280;
}

.post-title {
    font-size: clamp(32px, 5vw, 54px);
    line-height: 1.1;
    margin: 12px 0 8px;
}

.post-subtitle {
    font-size: 20px;
    color: #374151;
    margin: 0;
}

.post-cover {
    margin: 22px 0 40px;
}

.post-cover-img {
    width: 100%;
    border-radius: 16px;
    display: block;
    box-shadow: 0 24px 60px rgba(9, 15, 20, 0.2);
}

.post-cover-caption {
    margin-top: 10px;
    font-size: 13px;
    color: #6b7280;
}

.post-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 18px;
    font-size: 13px;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 18px;
}

.post-excerpt {
    font-size: 18px;
    color: #1f2937;
    border-left: 3px solid #111827;
    padding-left: 16px;
    margin-bottom: 28px;
}

.post-content :deep(h2) {
    font-size: 28px;
    margin-top: 36px;
}

.post-content :deep(h3) {
    font-size: 22px;
    margin-top: 28px;
}

.post-content :deep(p) {
    margin: 16px 0;
}

.post-content :deep(a) {
    color: #0f4c5c;
    text-decoration: underline;
}

.post-content :deep(ul),
.post-content :deep(ol) {
    padding-left: 20px;
    margin: 16px 0;
}

.post-tags {
    margin-top: 40px;
}

.post-tags ul {
    list-style: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.tag {
    display: inline-block;
    background: #f3f4f6;
    color: #111827;
    padding: 6px 12px;
    border-radius: 999px;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.post-links {
    margin-top: 36px;
    padding: 20px;
    border-radius: 12px;
    background: linear-gradient(120deg, #fdf2f8 0%, #eef2ff 100%);
}

@media (max-width: 640px) {
    .post {
        padding: 32px 16px 60px;
    }
}
</style>
