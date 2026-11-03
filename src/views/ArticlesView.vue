<script setup>
import { ref, computed } from 'vue'
import { POSTS, CAT_LABEL } from '../utils/posts'
import ArticleCard from '../components/ArticleCard.vue'

const filters = [
  { key: 'all', label: 'all' },
  { key: 'tech', label: 'tech' },
  { key: 'reading', label: 'reading' },
  { key: 'calligraphy', label: 'ink' },
]

const active = ref('all')

const list = computed(() =>
  active.value === 'all' ? POSTS : POSTS.filter((p) => p.category === active.value),
)
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
        @click="active = f.key"
      >
        <span class="prompt">›</span> {{ f.label }}
      </button>
    </div>

    <transition-group v-if="list.length" name="fade-slide" tag="div" class="grid">
      <ArticleCard v-for="(p, i) in list" :key="p.slug" :post="p" :delay="i * 60" />
    </transition-group>

    <div v-else class="card empty" v-reveal>
      <p class="empty-line mono">&gt; articles/ is empty</p>
      <p class="empty-hint">文章还在整理中，很快会一篇篇贴上来。</p>
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
