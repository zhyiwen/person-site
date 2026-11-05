<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { POSTS, CAT_LABEL } from '../utils/posts'
import ArticleCard from '../components/ArticleCard.vue'

const route = useRoute()
const router = useRouter()

const filters = [
  { key: 'all', label: 'all' },
  { key: 'tech', label: 'tech' },
  { key: 'reading', label: 'reading' },
  { key: 'calligraphy', label: 'ink' },
]

const active = ref('all')
/** 从 ?tag=xxx 读出来的标签筛选 */
const activeTag = ref('')

watch(
  () => route.query.tag,
  (t) => {
    activeTag.value = typeof t === 'string' ? t : ''
  },
  { immediate: true },
)

/** 当前标签下有多少篇（用来在标签条上显示） */
const tagCounts = computed(() => {
  const map = {}
  POSTS.forEach((p) => p.tags.forEach((t) => (map[t] = (map[t] || 0) + 1)))
  return map
})

const list = computed(() =>
  POSTS.filter((p) => {
    if (active.value !== 'all' && p.category !== active.value) return false
    if (activeTag.value && !p.tags.includes(activeTag.value)) return false
    return true
  }),
)

function pickCategory(key) {
  active.value = key
  // 切分类时保留标签筛选会更直观，但容易筛出空列表，这里一并不清
}

function clearTag() {
  router.push({ path: '/articles' })
}
</script>

<template>
  <div>
    <div class="page-head" v-reveal>
      <h1><span class="mono-tag mono">$ ls</span> 文章</h1>
      <p class="sub">total {{ POSTS.length }} · markdown 驱动 · click to read</p>
    </div>

    <div class="filter mono" v-reveal="60">
      <button
        v-for="f in filters"
        :key="f.key"
        class="f-btn"
        :class="{ active: active === f.key }"
        @click="pickCategory(f.key)"
      >
        <span class="prompt">›</span> {{ f.label }}
      </button>
    </div>

    <!-- 标签筛选条（从卡片上的 #标签 点进来） -->
    <div v-if="activeTag" class="tag-bar mono" v-reveal="70">
      <span class="tb-label">tag</span>
      <span class="tb-chip">
        #{{ activeTag }}
        <em>{{ tagCounts[activeTag] || 0 }}</em>
      </span>
      <button class="tb-clear" @click="clearTag">✕ 清除</button>
    </div>

    <transition-group v-if="list.length" name="fade-slide" tag="div" class="grid">
      <ArticleCard v-for="(p, i) in list" :key="p.slug" :post="p" :delay="i * 60" />
    </transition-group>

    <div v-else class="card empty" v-reveal>
      <p class="empty-line mono">&gt; articles/ is empty</p>
      <p class="empty-hint">
        这个条件下还没有文章<template v-if="activeTag">（标签 #{{ activeTag }}）</template>。
      </p>
    </div>
  </div>
</template>

<style scoped>
.filter { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
.f-btn {
  font-family: var(--mono);
  font-size: 13px;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--muted);
  padding: 7px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.f-btn .prompt { color: var(--faint); margin-right: 2px; transition: color 0.2s ease; }
.f-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
  box-shadow: var(--glow);
}
.f-btn.active {
  background: var(--primary-weak);
  border-color: var(--primary);
  color: var(--primary);
  box-shadow: var(--glow);
}
.f-btn.active .prompt { color: var(--primary); }

/* 标签条 */
.tag-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: -8px 0 20px;
  font-size: 12px;
}
.tb-label { color: var(--faint); letter-spacing: 1px; }
.tb-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  color: var(--primary);
  background: var(--primary-weak);
  border: 1px solid color-mix(in srgb, var(--primary) 40%, transparent);
}
.tb-chip em {
  font-style: normal;
  font-size: 11px;
  color: var(--primary-2);
  opacity: 0.85;
}
.tb-clear {
  font-family: var(--mono);
  font-size: 12px;
  background: none;
  border: 0;
  padding: 2px 0;
  color: var(--faint);
  cursor: pointer;
  transition: color 0.2s ease;
}
.tb-clear:hover { color: var(--primary); }

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.empty {
  padding: 48px 28px;
  text-align: center;
  border-style: dashed;
  box-shadow: none;
}
.empty:hover { transform: none; box-shadow: none; }
.empty-line { font-size: 13px; color: var(--primary); margin-bottom: 8px; }
.empty-hint { font-size: 14px; color: var(--muted); }

@media (max-width: 860px) {
  .grid { grid-template-columns: 1fr; }
}
</style>
