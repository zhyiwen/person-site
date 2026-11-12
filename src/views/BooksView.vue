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
  /* 均值只算 0-5 的正常评分；myRating=6 是「推荐」，不参与均分 */
  avg: (() => {
    const rated = books.filter((b) => b.myRating && b.myRating < 6)
    return (rated.reduce((s, b) => s + b.myRating, 0) / Math.max(1, rated.length)).toFixed(1)
  })(),
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

/* ---------- 阅读回顾（按年/月） ---------- */
/** 阅读事件：重读书取 readDates 每一遍，普通书取 finishDate；在读/搁置无完成日期，不参与 */
const readEvents = computed(() => {
  const evts = []
  books.forEach((b) => {
    if (b.paused) return
    const dates = b.readDates && b.readDates.length ? b.readDates : b.finishDate ? [b.finishDate] : []
    dates.forEach((d, i) => evts.push({ book: b, date: d, round: dates.length > 1 ? i + 1 : 0 }))
  })
  return evts
})

const reviewYears = computed(() => [...new Set(readEvents.value.map((e) => e.date.slice(0, 4)))].sort())
const reviewYear = ref(reviewYears.value[reviewYears.value.length - 1])

const shiftYear = (n) => {
  const i = reviewYears.value.indexOf(reviewYear.value)
  const j = Math.min(reviewYears.value.length - 1, Math.max(0, i + n))
  reviewYear.value = reviewYears.value[j]
}

/** 从统计图跳过来：直达某年回顾 */
const goReview = (y) => {
  reviewYear.value = y
  view.value = 'review'
}

/** 该年全部阅读事件（时间正序） */
const yearEvents = computed(() =>
  readEvents.value.filter((e) => e.date.startsWith(reviewYear.value)).sort((a, b) => a.date.localeCompare(b.date)),
)

/** 按月分组：[{ month, events }]，只含有书的月份，时间正序 */
const monthGroups = computed(() => {
  const map = new Map()
  yearEvents.value.forEach((e) => {
    const m = Number(e.date.slice(5, 7))
    if (!map.has(m)) map.set(m, [])
    map.get(m).push(e)
  })
  return [...map.keys()]
    .sort((a, b) => a - b)
    .map((m) => ({ month: m, events: map.get(m) }))
})

/** 我的评分分布（myRating=6 是「推荐」，单独一行排在最上面） */
const ratingDist = computed(() => {
  const map = {}
  books.forEach((b) => {
    if (b.myRating) map[b.myRating] = (map[b.myRating] || 0) + 1
  })
  const rows = [5, 4, 3, 2, 1].map((r) => ({ label: '★'.repeat(r), n: map[r] || 0 }))
  if (map[6]) rows.unshift({ label: '👑 推荐', n: map[6] })
  return rows
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
      <button :class="{ active: view === 'review' }" @click="view = 'review'">
        <span class="prompt">›</span> 回顾
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
          <!-- 推荐：myRating=6，右上角斜丝带，与左上角状态角标互不冲突 -->
          <span v-if="b.myRating >= 6" class="ribbon mono">推荐</span>
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
            <span class="mine" v-if="b.myRating && b.myRating < 6">
              <i v-for="n in 5" :key="n" :class="{ on: n <= b.myRating }">★</i>
            </span>
            <span class="crown" v-else-if="b.myRating >= 6" title="我的推荐">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M2.5 8 8 11.5 12 4.8l4 6.7 5.5-3.5-1.9 9.3H4.4Z" />
                <rect x="4.6" y="18.6" width="14.8" height="2.2" rx="1.1" />
              </svg>
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
            :title="notesOf(b).map((n) => n.title).join(' / ')"
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

    <!-- 阅读回顾视图 -->
    <section v-else-if="view === 'review'" class="review" v-reveal>
      <!-- 年份选择器：左右切换 + 年份胶囊 -->
      <div class="year-nav card mono">
        <button
          class="y-arrow"
          :disabled="reviewYear === reviewYears[0]"
          title="上一年"
          @click="shiftYear(-1)"
        >‹</button>
        <span class="y-cur">{{ reviewYear }}</span>
        <button
          class="y-arrow"
          :disabled="reviewYear === reviewYears[reviewYears.length - 1]"
          title="下一年"
          @click="shiftYear(1)"
        >›</button>
        <div class="y-pills">
          <button
            v-for="y in reviewYears"
            :key="y"
            class="y-pill"
            :class="{ active: y === reviewYear }"
            @click="reviewYear = y; reviewMonth = 0"
          >{{ y }}</button>
        </div>
      </div>

      <!-- 按月分节，时间正序一路排下去 -->
      <Transition name="rv" mode="out-in">
        <div :key="reviewYear">
          <p class="r-sum mono">// {{ reviewYear }} 年共读完 {{ yearEvents.length }} 本</p>

          <template v-if="monthGroups.length">
            <section v-for="g in monthGroups" :key="g.month" class="m-group">
              <div class="m-head mono">
                <span class="m-name">{{ g.month }}<i>月</i></span>
                <span class="m-line"></span>
                <span class="m-count">{{ g.events.length }} 本</span>
              </div>
              <div class="shelf review-shelf">
                <div v-for="e in g.events" :key="`${e.book.title}-${e.date}`" class="book-card">
                  <div class="cover">
                    <img
                      :src="`/covers/${e.book.image}.jpg`"
                      :alt="e.book.title"
                      loading="lazy"
                      @error="(ev) => ev.target.closest('.cover').classList.add('no-img')"
                    />
                    <span v-if="e.round" class="badge mono gold">第{{ e.round }}遍</span>
                    <span v-if="e.book.myRating >= 6" class="ribbon mono">推荐</span>
                  </div>
                  <div class="binfo">
                    <h3 :title="e.book.title">{{ e.book.title }}</h3>
                    <p class="author">{{ e.book.author }}</p>
                    <div class="rates mono">
                      <span class="douban">★ {{ e.book.doubanRating }}</span>
                      <span class="mine" v-if="e.book.myRating && e.book.myRating < 6">
                        <i v-for="n in 5" :key="n" :class="{ on: n <= e.book.myRating }">★</i>
                      </span>
                    </div>
                    <div class="bmeta mono">
                      <span>{{ e.date }}</span>
                    </div>
                    <router-link
                      v-if="noteMap[e.book.title]"
                      :to="`/posts/${notesOf(e.book)[0].slug}`"
                      class="note-link mono"
                    >✎ 读后记 →</router-link>
                  </div>
                </div>
              </div>
            </section>
          </template>

          <div v-else class="empty mono">// {{ reviewYear }} 年没有读完的书</div>
        </div>
      </Transition>
    </section>

    <!-- 统计视图 -->
    <section v-else class="viz" v-reveal>
      <div class="viz-card card">
        <div class="viz-head mono">
          <span>// 每年读完</span>
          <em>{{ yearStats.length }} 年 · 共 {{ stats.finished }} 本</em>
        </div>
        <div class="cols">
          <div v-for="y in yearStats" :key="y.year" class="col" :title="`查看 ${y.year} 年回顾`" @click="goReview(y.year)">
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
          <div v-for="r in ratingDist" :key="r.label" class="vrow">
            <span class="vlabel mono">{{ r.label }}</span>
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
/* ---------- 统计条 ---------- */
<style scoped>
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
.c-reread { color: var(--reading-text); }
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
  color: var(--primary-text);
  background: var(--primary-weak);
  box-shadow: var(--glow);
}
.view-tabs button.active .prompt { color: var(--primary-text); }

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
  color: var(--primary-text);
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
  cursor: pointer;
}
.col:hover .cbar { filter: brightness(1.25); }
.col:hover .cyear { color: var(--primary); }
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

/* ---------- 阅读回顾 ---------- */
.year-nav {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 16px;
}
.year-nav:hover { transform: none; }
.y-arrow {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface-2);
  color: var(--muted);
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  transition: color 0.18s ease, border-color 0.18s ease, background-color 0.18s ease;
}
.y-arrow:hover:not(:disabled) {
  color: var(--primary);
  border-color: color-mix(in srgb, var(--primary) 45%, var(--line));
  background: var(--primary-weak);
}
.y-arrow:disabled { opacity: 0.3; cursor: default; }
.y-cur {
  min-width: 68px;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 3px;
  color: var(--primary-text);
}
.y-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-left: auto;
}
.y-pill {
  font-family: var(--mono);
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 7px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.18s ease;
}
.y-pill:hover { background: var(--surface-2); color: var(--text); }
.y-pill.active {
  background: var(--primary-weak);
  border-color: color-mix(in srgb, var(--primary) 45%, transparent);
  color: var(--primary-text);
}

/* 年度小结行 */
.r-sum {
  font-size: 12px;
  color: var(--faint);
  margin-bottom: 20px;
}

/* 月份小节 */
.m-group { margin-bottom: 34px; }
.m-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}
.m-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--primary-text);
  letter-spacing: 1px;
}
.m-name i {
  font-style: normal;
  font-size: 12px;
  font-weight: 400;
  color: var(--faint);
  margin-left: 1px;
}
.m-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, color-mix(in srgb, var(--primary) 30%, transparent), var(--line));
}
.m-count { font-size: 11px; color: var(--faint); }

/* 年切换动画 */
.rv-enter-active,
.rv-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.rv-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.rv-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

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
/* 视觉 22px 不变，命中区扩到 ~42px */
.s-clear::before {
  content: "";
  position: absolute;
  inset: -10px;
  border-radius: 50%;
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
  color: var(--primary-text);
}
.f-btn.active .cnt { color: var(--primary-text); }

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
/* 在读：绿色，跟「重读」的金色、「搁置」的灰色区分开 */
.badge.reading {
  background: color-mix(in srgb, var(--green) 92%, #000);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18);
}
.badge.paused { background: color-mix(in srgb, var(--text) 55%, transparent); }
/* 推荐：右上角斜丝带（45°，两端被封面裁掉），亮金底深棕字，扁平无渐变 */
.ribbon {
  position: absolute;
  top: 13px;
  right: -42px;
  width: 132px;
  padding: 3px 0;
  transform: rotate(45deg);
  background: #f2b52e;
  color: #4a3200;
  font-size: 10px;
  line-height: 1.4;
  letter-spacing: 3px;
  text-indent: 3px;
  text-align: center;
  white-space: nowrap;
  z-index: 2;
  pointer-events: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.22);
}

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
.rd-head { color: var(--reading-text); letter-spacing: 1px; }
.book-card:hover .rd-tip {
  opacity: 1;
  transform: translateY(0);
}
/* 触屏无 hover：重读记录常显（留档核心数据不靠 hover 门控） */
@media (hover: none) {
  .rd-tip {
    opacity: 1;
    transform: none;
  }
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
.douban { color: var(--stone-text); }
.mine { display: inline-flex; gap: 1px; }
.mine i { color: var(--line); font-style: normal; font-size: 11px; }
.mine i.on { color: var(--calligraphy); }
/* 推荐：皇冠替代五角星 */
.crown { display: inline-flex; align-items: center; }
.crown svg {
  width: 13px;
  height: 13px;
  fill: var(--sand);
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.15));
}
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
  color: var(--reading-text);
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
