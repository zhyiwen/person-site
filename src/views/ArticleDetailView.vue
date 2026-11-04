<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getPost, getNeighbors, getPostHtml, CAT_LABEL } from '../utils/posts'

const route = useRoute()
const post = computed(() => getPost(route.params.slug))
const neighbors = computed(() => getNeighbors(route.params.slug))

/** 正文 HTML（含 Shiki 代码高亮，异步渲染） */
const html = ref('')
watch(
  () => route.params.slug,
  async (slug) => {
    html.value = ''
    const p = getPost(slug)
    if (p) {
      html.value = await getPostHtml(p)
      document.title = `${p.title} · 译文 · 个人站`
    }
  },
  { immediate: true },
)
</script>

<template>
  <div v-if="post" class="wrap">
    <router-link to="/articles" class="back mono">← cd ..</router-link>

    <article class="card doc">
      <div class="doc-head">
        <div class="meta mono">
          <span class="chip" :class="`chip-${post.category}`">{{ CAT_LABEL[post.category] }}</span>
          <span v-for="t in post.tags" :key="t" class="tag">#{{ t }}</span>
        </div>
        <h1>{{ post.title }}</h1>
        <div class="info mono">
          <span>{{ post.date }}</span>
          <span class="sep">/</span>
          <span>{{ post.readTime }} min read</span>
          <span class="sep">/</span>
          <span>content/posts/{{ post.slug }}.md</span>
        </div>
      </div>

      <!-- Markdown 渲染结果 -->
      <div class="md-body" v-html="html"></div>

      <div class="doc-end mono">— EOF —</div>
    </article>

    <nav class="neighbors">
      <router-link v-if="neighbors.older" :to="`/posts/${neighbors.older.slug}`" class="nb card">
        <span class="nb-label mono">← older</span>
        <span class="nb-title">{{ neighbors.older.title }}</span>
      </router-link>
      <span v-else class="nb empty"></span>
      <router-link v-if="neighbors.newer" :to="`/posts/${neighbors.newer.slug}`" class="nb card right">
        <span class="nb-label mono">newer →</span>
        <span class="nb-title">{{ neighbors.newer.title }}</span>
      </router-link>
    </nav>
  </div>

  <div v-else class="notfound mono">
    <p>404 — post not found</p>
    <router-link to="/articles">← 返回文章列表</router-link>
  </div>
</template>

<style scoped>
.wrap { max-width: 760px; margin: 0 auto; }
.back {
  display: inline-block;
  margin-bottom: 16px;
  font-size: 13px;
  color: var(--muted);
  text-decoration: none;
  transition: color 0.2s ease;
}
.back:hover { color: var(--primary); }

.doc { padding: 44px 48px 36px; }
.doc-head { margin-bottom: 8px; }
.meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
.tag { font-size: 12px; color: var(--faint); }
h1 {
  font-size: 32px;
  line-height: 1.4;
  letter-spacing: 0.5px;
  margin-bottom: 14px;
}
.info {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 12px;
  color: var(--faint);
  flex-wrap: wrap;
  padding-bottom: 22px;
  border-bottom: 1px solid var(--line);
}
.sep { opacity: 0.5; }
.doc-end {
  margin-top: 36px;
  padding-top: 20px;
  border-top: 1px dashed var(--line);
  text-align: center;
  font-size: 12px;
  color: var(--faint);
  letter-spacing: 3px;
}

.neighbors {
  margin-top: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.nb {
  padding: 16px 20px;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: inherit;
}
.nb.empty { border: none; background: none; box-shadow: none; }
.nb.right { text-align: right; }
.nb-label { font-size: 11px; color: var(--faint); }
.nb-title { font-size: 14px; color: var(--text); }
.nb:hover .nb-title { color: var(--primary); }

.notfound { text-align: center; padding: 80px 0; color: var(--muted); }
.notfound a { color: var(--primary); }

@media (max-width: 720px) {
  .doc { padding: 28px 22px; }
  h1 { font-size: 24px; }
  .neighbors { grid-template-columns: 1fr; }
}
</style>
