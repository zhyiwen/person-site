<script setup>
import { ref, computed, watch } from 'vue'
import { books, categories, statusOptions, getBookStatus, matchStatus } from '../data/books'

/* ---------- 筛选状态 ---------- */
const keyword = ref('')
const activeCat = ref('all')
const activeStatus = ref('all')
const activeSort = ref('default')
const pageSize = ref(24)

const sortOptions = [
  { value: 'default', label: '默认' },
  { value: 'douban', label: '豆瓣高分' },
  { value: 'mine', label: '我的评分' },
  { value: 'dateDesc', label: '最近读完' },
  { value: 'dateAsc', label: '最早读完' },
]

/* ---------- 统计 ---------- */
const stats = computed(() => ({
  total: books.length,
  finished: books.filter((b) => matchStatus(b, 'finished')).length,
  reading: books.filter((b) => matchStatus(b, 'reading')).length,
  reread: books.filter((b) => matchStatus(b, 'reread')).length,
  paused: books.filter((b) => matchStatus(b, 'paused')).length,
  avg: (books.reduce((s, b) => s + (b.myRating || 0), 0) / books.length).toFixed(1),
}))

const catCounts = computed(() => {
  const map = { all: books.length }
  categories.forEach((c) => {
    if (c.id !== 'all') map[c.id] = books.filter((b) => b.category === c.id).length
  })
  return map
})

const statusCounts = computed(() => {
  const map = {}
  statusOptions.forEach((s) => {
    map[s.id] = books.filter((b) => matchStatus(b, s.id)).length
  })
  return map
})

/* ---------- 过滤 + 排序 ---------- */
const filtered = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  let list = books.filter((b) => {
    if (activeCat.value !== 'all' && b.category !== activeCat.value) return false
    if (!matchStatus(b, activeStatus.value)) return false
    if (q && !`${b.title}${b.author}`.toLowerCase().includes(q)) return false
    return true
  })

  const byDate = (a, b) => (b.finishDate || '').localeCompare(a.finishDate || '')
  switch (activeSort.value) {
    case 'douban':
      list = [...list].sort((a, b) => b.doubanRating - a.doubanRating)
      break
    case 'mine':
      list = [...list].sort((a, b) => b.myRating - a.myRating || byDate(a, b))
      break
    case 'dateDesc':
      list = [...list].sort(byDate)
      break
    case 'dateAsc':
      list = [...list].sort((a, b) => (a.finishDate || '9999').localeCompare(b.finishDate || '9999'))
      break
    default:
      list = [...list].sort(byDate)
  }
  return list
})

const visible = computed(() => filtered.value.slice(0, pageSize.value))
const hasMore = computed(() => filtered.value.length > pageSize.value)

watch([keyword, activeCat, activeStatus, activeSort], () => {
  pageSize.value = 24
})
</script>

<template>
  <div>
    <div class="page-head" v-reveal>
      <h1><span class="mono-tag mono">$ find</span> 书单</h1>
      <p class="sub">total {{ stats.total }} books · avg my rating {{ stats.avg }} ★</p>
    </div>

    <!-- 统计条 -->
    <div class="stats mono" v-reveal="40">
      <div class="stat">
        <b>{{ stats.finished }}</b>
        <span>已读</span>
      </div>
      <div class="stat">
        <b class="c-reading">{{ stats.reading }}</b>
        <span>在读</span>
      </div>
      <div class="stat">
        <b class="c-reread">{{ stats.reread }}</b>
        <span>重读</span>
      </div>
      <div class="stat">
        <b class="c-paused">{{ stats.paused }}</b>
        <span>搁置</span>
      </div>
      <div class="stat">
        <b>{{ categories.length - 1 }}</b>
        <span>分类</span>
      </div>
    </div>

    <!-- 搜索 -->
    <div class="search-wrap" v-reveal="80">
      <svg class="s-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </svg>
      <input v-model="keyword" class="search mono" type="text" placeholder="搜索书名或作者…" />
      <button v-if="keyword" class="s-clear" @click="keyword = ''">✕</button>
    </div>

    <!-- 筛选面板 -->
    <div class="panel card" v-reveal="120">
      <div class="row">
        <span class="row-label mono">分类</span>
        <div class="chips">
          <button
            v-for="c in categories"
            :key="c.id"
            class="f-btn"
            :class="{ active: activeCat === c.id }"
            @click="activeCat = c.id"
          >
            {{ c.name }}<em class="cnt">{{ catCounts[c.id] }}</em>
          </button>
        </div>
      </div>
      <div class="row">
        <span class="row-label mono">状态</span>
        <div class="chips">
          <button
            v-for="s in statusOptions"
            :key="s.id"
            class="f-btn"
            :class="{ active: activeStatus === s.id }"
            @click="activeStatus = s.id"
          >
            {{ s.name }}<em class="cnt">{{ statusCounts[s.id] }}</em>
          </button>
        </div>
      </div>
      <div class="row">
        <span class="row-label mono">排序</span>
        <div class="chips">
          <button
            v-for="o in sortOptions"
            :key="o.value"
            class="f-btn"
            :class="{ active: activeSort === o.value }"
            @click="activeSort = o.value"
          >
            {{ o.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- 结果统计 -->
    <p class="result mono">
      {{ filtered.length }} 本结果 <span v-if="keyword">· 关键词「{{ keyword }}」</span>
    </p>

    <!-- 书籍网格 -->
    <div class="shelf">
      <div v-for="(b, i) in visible" :key="`${b.title}-${i}`" class="book-card" v-reveal="Math.min(i, 8) * 40">
        <div class="cover">
          <img
            :src="`/covers/${b.image}.jpg`"
            :alt="b.title"
            loading="lazy"
            @error="(e) => e.target.closest('.cover').classList.add('no-img')"
          />
          <span v-if="b.aginRead" class="badge mono">重读</span>
          <span v-else-if="getBookStatus(b) === 'paused'" class="badge mono paused">搁置</span>
        </div>
        <div class="binfo">
          <h3 :title="b.title">{{ b.title }}</h3>
          <p class="author">{{ b.author }}</p>
          <div class="rates mono">
            <span class="douban">★ {{ b.doubanRating }}</span>
            <span class="mine">
              <i v-for="n in 5" :key="n" :class="{ on: n <= b.myRating }">★</i>
            </span>
          </div>
          <div class="bmeta mono">
            <span v-if="b.finishDate">{{ b.finishDate }}</span>
            <span v-else-if="b.paused" class="em-paused">已搁置</span>
            <span v-else class="em-reading">
              在读 {{ b.currentPage }}/{{ b.totalPages }}
            </span>
            <span v-if="b.wordCount" class="wc">{{ b.wordCount }}</span>
          </div>
          <div v-if="!b.finishDate && b.currentPage" class="bar">
            <i :style="{ width: Math.min(100, (b.currentPage / b.totalPages) * 100) + '%' }"></i>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!filtered.length" class="empty mono">// no books matched — 换个关键词试试</div>

    <div v-if="hasMore" class="more-wrap">
      <button class="load-more mono" @click="pageSize += 24">
        加载更多（剩余 {{ filtered.length - pageSize }} 本）
      </button>
    </div>
  </div>
</template>

<style scoped>
/* ---------- 统计条 ---------- */
.stats {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}
.stat {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  box-shadow: var(--shadow-sm);
}
.stat b { font-size: 22px; line-height: 1.2; }
.stat span { font-size: 12px; color: var(--faint); }
.c-reading { color: var(--tech); }
.c-reread { color: var(--reading); }
.c-paused { color: var(--faint); }

/* ---------- 搜索 ---------- */
.search-wrap {
  position: relative;
  max-width: 520px;
  margin: 0 auto 20px;
}
.s-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 17px;
  height: 17px;
  color: var(--faint);
}
.search {
  width: 100%;
  padding: 12px 40px 12px 44px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.search::placeholder { color: var(--faint); }
.search:focus {
  border-color: var(--primary);
  box-shadow: var(--glow);
}
.s-clear {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: var(--surface-2);
  color: var(--muted);
  width: 22px;
  height: 22px;
  border-radius: 50%;
  font-size: 11px;
  cursor: pointer;
}
.s-clear:hover { color: var(--primary); }

/* ---------- 筛选面板 ---------- */
.panel { padding: 8px 18px; margin-bottom: 20px; }
.panel:hover { transform: none; }
.row {
  display: flex;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px dashed var(--line);
  align-items: flex-start;
}
.row:last-child { border-bottom: none; }
.row-label {
  flex-shrink: 0;
  width: 36px;
  font-size: 12px;
  color: var(--faint);
  padding-top: 6px;
  letter-spacing: 2px;
}
.chips { display: flex; flex-wrap: wrap; gap: 6px; }
.f-btn {
  font-size: 13px;
  font-family: var(--mono);
  border: 1px solid transparent;
  background: transparent;
  color: var(--muted);
  padding: 5px 12px;
  border-radius: 7px;
  cursor: pointer;
  transition: all 0.18s ease;
}
.f-btn .cnt {
  font-style: normal;
  font-size: 11px;
  color: var(--faint);
  margin-left: 5px;
}
.f-btn:hover { background: var(--surface-2); color: var(--text); }
.f-btn.active {
  background: var(--primary-weak);
  border-color: color-mix(in srgb, var(--primary) 45%, transparent);
  color: var(--primary);
}
.f-btn.active .cnt { color: var(--primary); }

/* ---------- 结果 ---------- */
.result {
  font-size: 12px;
  color: var(--faint);
  margin-bottom: 14px;
}

/* ---------- 书架网格 ---------- */
.shelf {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px 18px;
}
.book-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: default;
}
.cover {
  position: relative;
  aspect-ratio: 3 / 4.2;
  border-radius: 10px;
  overflow: hidden;
  background: var(--surface-2);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease,
    border-color 0.3s ease;
}
.cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}
.book-card:hover .cover {
  transform: translateY(-6px);
  border-color: color-mix(in srgb, var(--primary) 40%, var(--line));
  box-shadow: var(--shadow-md), var(--glow);
}
.book-card:hover .cover img { transform: scale(1.05); }
.cover.no-img img { display: none; }
.cover.no-img::after {
  content: 'NO COVER';
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--faint);
  letter-spacing: 2px;
}
.badge {
  position: absolute;
  top: 8px;
  left: 8px;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 5px;
  background: color-mix(in srgb, var(--reading) 85%, #000);
  color: #fff;
  letter-spacing: 1px;
}
.badge.paused { background: color-mix(in srgb, var(--text) 55%, transparent); }

.binfo h3 {
  font-size: 14px;
  line-height: 1.45;
  font-weight: 600;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.author {
  font-size: 12px;
  color: var(--faint);
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rates {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  margin-top: 4px;
}
.douban { color: var(--sand); }
.mine { display: inline-flex; gap: 1px; }
.mine i { color: var(--line); font-style: normal; font-size: 11px; }
.mine i.on { color: var(--calligraphy); }
.bmeta {
  display: flex;
  gap: 8px;
  font-size: 11px;
  color: var(--faint);
  margin-top: 4px;
  flex-wrap: wrap;
}
.em-reading { color: var(--tech); }
.em-paused { color: var(--faint); }
.wc { opacity: 0.7; }
.bar {
  height: 3px;
  border-radius: 2px;
  background: var(--surface-2);
  margin-top: 6px;
  overflow: hidden;
}
.bar i {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--primary-2));
  border-radius: 2px;
}

.empty {
  text-align: center;
  padding: 60px 0;
  color: var(--faint);
  font-size: 13px;
}

.more-wrap { text-align: center; margin-top: 32px; }
.load-more {
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--muted);
  font-size: 13px;
  padding: 10px 26px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.load-more:hover {
  border-color: var(--primary);
  color: var(--primary);
  box-shadow: var(--glow);
}

@media (max-width: 960px) {
  .shelf { grid-template-columns: repeat(3, 1fr); }
  .stats { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 600px) {
  .shelf { grid-template-columns: repeat(2, 1fr); }
  .stats { grid-template-columns: repeat(2, 1fr); }
  .row { flex-direction: column; gap: 6px; }
  .row-label { width: auto; padding-top: 0; }
}
</style>
