<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { books, categories, statusOptions, getBookStatus, matchStatus } from '../data/books'
import { POSTS } from '../utils/posts'
import { compareTitles } from '../utils/pinyin'

const route = useRoute()

/* ---------- 筛选状态 ---------- */
const keyword = ref('')
const activeCat = ref('all')
const activeStatus = ref('all')
const activeSort = ref('default')
const pageSize = ref(24)

/** 从全站搜索点书名进来时带着 ?q=书名，直接过滤 */
watch(
  () => route.query.q,
  (v) => {
    if (typeof v === 'string' && v) {
      keyword.value = v
      activeCat.value = 'all'
      activeStatus.value = 'all'
      pageSize.value = 24
    }
  },
  { immediate: true },
)

const sortOptions = [
  { value: 'default', label: '默认排序' },
  { value: 'douban', label: '豆瓣高分' },
  { value: 'mine', label: '我的评分' },
  { value: 'dateDesc', label: '最近读完' },
]

/* ---------- 书 ↔ 读书笔记 ---------- */
/** 文章 frontmatter 里写了 book: 书名，就在对应书的卡片上挂「读后记」入口 */
const noteMap = computed(() => {
  const map = {}
  POSTS.forEach((p) => {
    if (p.book) (map[p.book] = map[p.book] || []).push(p)
  })
  return map
})
const notesOf = (b) => noteMap.value[b.title] || []

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

/* ---------- 数据可视化 ---------- */
const view = ref('shelf')

/** 每年读完本数 */
const yearStats = computed(() => {
  const map = {}
  books.forEach((b) => {
    if (!b.finishDate) return
    const y = b.finishDate.slice(0, 4)
    map[y] = (map[y] || 0) + 1
  })
  return Object.keys(map)
    .sort()
    .map((y) => ({ year: y, n: map[y] }))
})
const maxYear = computed(() => Math.max(1, ...yearStats.value.map((x) => x.n)))

/** 我的评分分布 */
const ratingDist = computed(() => {
  const map = {}
  books.forEach((b) => {
    if (b.myRating) map[b.myRating] = (map[b.myRating] || 0) + 1
  })
  return [5, 4, 3, 2, 1].map((r) => ({ rating: r, n: map[r] || 0 }))
})
const maxRating = computed(() => Math.max(1, ...ratingDist.value.map((x) => x.n)))

/** 分类分布（数量降序） */
const topCats = computed(() =>
  categories
    .filter((c) => c.id !== 'all')
    .map((c) => ({ name: c.name, n: books.filter((b) => b.category === c.id).length }))
    .filter((c) => c.n > 0)
    .sort((a, b) => b.n - a.n),
)
const maxCat = computed(() => Math.max(1, ...topCats.value.map((x) => x.n)))

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
    default:
      // 默认：按书名首字母 A→Z（组内按拼音）
      list = [...list].sort((a, b) => compareTitles(a.title, b.title))
  }
  return list
})

const visible = computed(() => filtered.value.slice(0, pageSize.value))
const hasMore = computed(() => filtered.value.length > pageSize.value)

/* 重读遍数：readDates 里每条记录是一遍读完的日期 */
const roundOf = (b) => (b.readDates && b.readDates.length > 1 ? b.readDates.length : 0)

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

    <!-- 视图切换：书架 / 统计 -->
    <div class="view-tabs mono" v-reveal="50">
      <button :class="{ active: view === 'shelf' }" @click="view = 'shelf'">
        <span class="prompt">›</span> 书架
      </button>
      <button :class="{ active: view === 'stats' }" @click="view = 'stats'">
        <span class="prompt">›</span> 统计
      </button>
    </div>

    <template v-if="view === 'shelf'">
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
          <span v-if="b.aginRead" class="badge mono gold">重读</span>
          <span v-else-if="getBookStatus(b) === 'paused'" class="badge mono paused">搁置</span>
          <span v-else-if="getBookStatus(b) === 'reading'" class="badge mono reading">在读</span>
          <!-- hover 明细：每一遍的阅读日期 -->
          <div v-if="roundOf(b)" class="rd-tip mono">
            <p class="rd-head">// 重读记录</p>
            <p v-for="(d, ri) in b.readDates" :key="ri">第{{ ri + 1 }}遍 · {{ d }}</p>
          </div>
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
            <span v-if="b.finishDate">
              <template v-if="roundOf(b)">第{{ roundOf(b) }}遍 · </template>{{ b.finishDate }}
            </span>
            <span v-else-if="b.paused" class="em-paused">已搁置</span>
            <span v-else class="em-reading">
              在读 {{ b.currentPage }}/{{ b.totalPages }}
            </span>
            <span v-if="b.wordCount" class="wc">{{ b.wordCount }}</span>
          </div>
          <div v-if="!b.finishDate && b.currentPage" class="bar">
            <i :style="{ width: Math.min(100, (b.currentPage / b.totalPages) * 100) + '%' }"></i>
          </div>
          <router-link
            v-if="notesOf(b).length"
            :to="`/posts/${notesOf(b)[0].slug}`"
            class="note-link mono"
            :title="notesOf(b)[0].title"
          >
            ✎ 读后记<template v-if="notesOf(b).length > 1"> ×{{ notesOf(b).length }}</template> →
          </router-link>
        </div>
      </div>
    </div>

    <div v-if="!filtered.length" class="empty mono">// no books matched — 换个关键词试试</div>

    <div v-if="hasMore" class="more-wrap">
      <button class="load-more mono" @click="pageSize += 24">
        加载更多（剩余 {{ filtered.length - pageSize }} 本）
      </button>
    </div>
    </template>

    <!-- 统计视图 -->
    <section v-else class="viz" v-reveal>
      <div class="viz-card card">
        <div class="viz-head mono">
          <span>// 每年读完</span>
          <em>{{ yearStats.length }} 年 · 共 {{ stats.finished }} 本</em>
        </div>
        <div class="cols">
          <div v-for="y in yearStats" :key="y.year" class="col">
            <span class="cnum mono">{{ y.n }}</span>
            <div class="cbar" :style="{ height: (y.n / maxYear) * 78 + '%' }"></div>
            <span class="cyear mono">{{ y.year }}</span>
          </div>
        </div>
      </div>

      <div class="viz-card card">
        <div class="viz-head mono">
          <span>// 我的评分</span>
          <em>平均 {{ stats.avg }} ★</em>
        </div>
        <div class="vrows">
          <div v-for="r in ratingDist" :key="r.rating" class="vrow">
            <span class="vlabel mono">{{ '★'.repeat(r.rating) }}</span>
            <div class="vtrack"><i :style="{ width: (r.n / maxRating) * 100 + '%' }"></i></div>
            <span class="vnum mono">{{ r.n }}</span>
          </div>
        </div>
      </div>

      <div class="viz-card card wide">
        <div class="viz-head mono">
          <span>// 分类分布</span>
          <em>{{ topCats.length }} 类</em>
        </div>
        <div class="vrows">
          <div v-for="c in topCats" :key="c.name" class="vrow">
            <span class="vlabel mono">{{ c.name }}</span>
            <div class="vtrack"><i :style="{ width: (c.n / maxCat) * 100 + '%' }"></i></div>
            <span class="vnum mono">{{ c.n }}</span>
          </div>
        </div>
      </div>
    </section>
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

/* ---------- 视图切换 ---------- */
.view-tabs {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  margin-bottom: 22px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--surface);
}
.view-tabs button {
  font-family: var(--mono);
  font-size: 13px;
  padding: 6px 18px;
  border: 0;
  border-radius: 7px;
  background: none;
  color: var(--muted);
  cursor: pointer;
  transition: color 0.2s ease, background-color 0.2s ease;
}
.view-tabs .prompt { color: var(--faint); margin-right: 2px; }
.view-tabs button:hover { color: var(--text); }
.view-tabs button.active {
  color: var(--primary);
  background: var(--primary-weak);
  box-shadow: var(--glow);
}
.view-tabs button.active .prompt { color: var(--primary); }

/* ---------- 统计视图 ---------- */
.viz {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.viz-card { padding: 22px 24px 18px; }
.viz-card.wide { grid-column: 1 / -1; }
.viz-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  font-size: 12px;
  color: var(--primary);
  letter-spacing: 1px;
  margin-bottom: 18px;
}
.viz-head em { font-style: normal; color: var(--faint); font-size: 11px; }

/* 柱状图 */
.cols {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 210px;
  padding-top: 4px;
}
.col {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
  min-width: 0;
}
.cnum { font-size: 11px; color: var(--muted); }
.cbar {
  width: 100%;
  max-width: 46px;
  border-radius: 5px 5px 0 0;
  background: linear-gradient(180deg, var(--primary), color-mix(in srgb, var(--primary) 25%, transparent));
  box-shadow: 0 0 14px color-mix(in srgb, var(--primary) 35%, transparent);
  min-height: 3px;
  transition: height 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.cyear { font-size: 10px; color: var(--faint); }

/* 横向条 */
.vrows { display: flex; flex-direction: column; gap: 10px; }
.vrow {
  display: grid;
  grid-template-columns: 88px 1fr 34px;
  align-items: center;
  gap: 10px;
}
.vlabel {
  font-size: 11px;
  color: var(--muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.vtrack {
  height: 8px;
  border-radius: 4px;
  background: var(--surface-2);
  overflow: hidden;
}
.vtrack i {
  display: block;
  height: 100%;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--reading), color-mix(in srgb, var(--reading) 40%, transparent));
  transition: width 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}
/* 分类那块用科技青，和评分区分开 */
.viz-card.wide .vtrack i {
  background: linear-gradient(90deg, var(--tech), color-mix(in srgb, var(--tech) 40%, transparent));
}
.vnum { font-size: 11px; color: var(--faint); text-align: right; }

@media (max-width: 860px) {
  .viz { grid-template-columns: 1fr; }
  .viz-card.wide { grid-column: auto; }
  .cols { height: 170px; }
  .vrow { grid-template-columns: 70px 1fr 30px; }
}

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
  color: #fff;
  letter-spacing: 1px;
}
/* 重读：金色渐变，经典感 */
.badge.gold {
  background: linear-gradient(135deg, #9a6b15, #d9a441 40%, #f3cf6b 62%, #c8922a);
  color: #3d2a04;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.35);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.55), 0 1px 3px rgba(0, 0, 0, 0.25);
}
.badge.reading { background: color-mix(in srgb, var(--tech) 85%, #000); }
.badge.paused { background: color-mix(in srgb, var(--text) 55%, transparent); }

/* 重读记录浮层（hover 封面显示） */
.rd-tip {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px 12px;
  background: color-mix(in srgb, var(--surface) 90%, transparent);
  backdrop-filter: blur(8px);
  border-top: 1px solid color-mix(in srgb, var(--reading) 35%, var(--line));
  font-size: 11px;
  line-height: 1.7;
  color: var(--muted);
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.25s ease, transform 0.25s ease;
  pointer-events: none;
}
.rd-tip p { margin: 0; }
.rd-head { color: var(--reading); letter-spacing: 1px; }
.book-card:hover .rd-tip {
  opacity: 1;
  transform: translateY(0);
}

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
/* 豆瓣分用中性色，和「我的评分」的金色星区分开 */
.douban { color: var(--stone); }
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

/* 书 ↔ 读后记 */
.note-link {
  display: inline-block;
  width: fit-content;
  margin-top: 6px;
  font-size: 11px;
  letter-spacing: 0.5px;
  text-decoration: none;
  color: var(--reading);
  border-bottom: 1px dashed color-mix(in srgb, var(--reading) 45%, transparent);
  transition: color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}
.note-link:hover {
  color: var(--primary);
  border-bottom-color: var(--primary);
  transform: translateX(2px);
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
