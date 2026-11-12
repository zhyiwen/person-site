<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { getPost, getNeighbors, getPostHtml, CAT_LABEL } from '../utils/posts'

const route = useRoute()
const post = computed(() => getPost(route.params.slug))
const neighbors = computed(() => getNeighbors(route.params.slug))

/** 正文 HTML（含 Shiki 代码高亮，异步渲染） */
const html = ref('')
const bodyRef = ref(null)
/** 目录：从渲染后的 h2/h3 里抽 */
const toc = ref([])
const activeId = ref('')
/** 阅读进度 0~1 */
const progress = ref(0)

async function buildToc() {
  await nextTick()
  const el = bodyRef.value
  if (!el) {
    toc.value = []
    return
  }
  const headings = [...el.querySelectorAll('h2, h3')]
  toc.value = headings.map((h, i) => {
    if (!h.id) h.id = `sec-${i + 1}`
    return { id: h.id, text: h.textContent.trim(), level: h.tagName === 'H2' ? 2 : 3 }
  })
  syncActive()
}

/** 滚动时：更新进度条 + 高亮当前小节 */
function onScroll() {
  const doc = document.documentElement
  const total = doc.scrollHeight - window.innerHeight
  progress.value = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0

  if (!toc.value.length) return
  let current = toc.value[0].id
  for (const h of toc.value) {
    const el = document.getElementById(h.id)
    if (el && el.getBoundingClientRect().top <= 120) current = h.id
  }
  activeId.value = current
}

function syncActive() {
  onScroll()
}

function jump(id) {
  const el = document.getElementById(id)
  if (!el) return
  const y = el.getBoundingClientRect().top + window.scrollY - 92
  window.scrollTo({ top: y, behavior: 'smooth' })
}

watch(
  () => route.params.slug,
  async (slug) => {
    html.value = ''
    toc.value = []
    progress.value = 0
    const p = getPost(slug)
    if (p) {
      html.value = await getPostHtml(p)
      document.title = `${p.title} · 译文 · 个人站`
      buildToc()
    }
  },
  { immediate: true },
)

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})
</script>

<template>
  <div v-if="post" class="wrap">
    <!-- 阅读进度 -->
    <div class="progress" :style="{ transform: `scaleX(${progress})` }"></div>

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
      <div ref="bodyRef" class="md-body" v-html="html"></div>

      <div class="doc-end mono">— EOF —</div>
    </article>

    <!-- 目录（宽屏显示，跟在正文右侧） -->
    <aside v-if="toc.length > 1" class="toc mono">
      <p class="toc-title">// 目录</p>
      <button
        v-for="h in toc"
        :key="h.id"
        class="toc-item"
        :class="{ on: activeId === h.id, lv3: h.level === 3 }"
        type="button"
        @click="jump(h.id)"
      >
        {{ h.text }}
      </button>
    </aside>

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

/* ---------- 阅读进度：贴在导航栏下沿 ---------- */
.progress {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  height: 2px;
  z-index: 45;
  transform-origin: 0 50%;
  background: linear-gradient(90deg, var(--primary), var(--primary-2));
  box-shadow: 0 0 10px var(--primary);
  transition: transform 0.1s linear;
  pointer-events: none;
}

/* ---------- 目录：宽屏时浮在正文右侧 ---------- */
.toc {
  display: none;
  position: fixed;
  top: 104px;
  left: calc(50% + 400px);
  width: 186px;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  padding-left: 14px;
  border-left: 1px solid var(--line);
}
.toc-title {
  font-size: 11px;
  color: var(--faint);
  letter-spacing: 1px;
  margin-bottom: 10px;
}
.toc-item {
  display: block;
  width: 100%;
  text-align: left;
  background: none;
  border: 0;
  padding: 5px 0;
  font-family: var(--mono);
  font-size: 12px;
  line-height: 1.5;
  color: var(--faint);
  cursor: pointer;
  transition: color 0.2s ease, padding-left 0.2s ease;
}
.toc-item.lv3 { padding-left: 10px; font-size: 11px; opacity: 0.85; }
.toc-item:hover { color: var(--text); }
.toc-item.on {
  color: var(--primary-text);
  padding-left: 4px;
}
/* 当前小节左侧亮条，压在 .toc 的边框位置 */
.toc-item.on::before {
  content: '';
  position: absolute;
  left: -15px;
  width: 2px;
  height: 15px;
  background: var(--primary);
  box-shadow: 0 0 8px var(--primary);
}
@media (min-width: 1180px) {
  .toc { display: block; }
}
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
.notfound a { color: var(--primary-text); }

@media (max-width: 720px) {
  .doc { padding: 28px 22px; }
  h1 { font-size: 24px; }
  .neighbors { grid-template-columns: 1fr; }
}
</style>
