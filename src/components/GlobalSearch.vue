<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { POSTS, CAT_LABEL } from '../utils/posts'
import { books } from '../data/books'
import { WORKS } from '../utils/works'
import { QUOTES } from '../data/quotes'

const router = useRouter()

const open = ref(false)
const q = ref('')
const cursor = ref(0)
const inputEl = ref(null)
const listEl = ref(null)

/** 索引只建一次，首次打开时构建（157 条，同步构建也很快） */
let index = null

function buildIndex() {
  if (index) return index
  const strip = (s) => s.replace(/```[\s\S]*?```/g, ' ').replace(/[#>*`|]/g, ' ')

  const posts = POSTS.map((p) => ({
    type: 'post',
    typeLabel: CAT_LABEL[p.category] || '文章',
    title: p.title,
    sub: `${p.date} · ${p.readTime} min`,
    to: `/posts/${p.slug}`,
    hay: `${p.title} ${p.tags.join(' ')} ${p.excerpt} ${strip(p.body)}`.toLowerCase(),
    head: p.title.toLowerCase(),
  }))

  const bk = books.map((b) => ({
    type: 'book',
    typeLabel: '书',
    title: b.title,
    sub: b.author,
    to: '/books',
    book: b.title,
    hay: `${b.title} ${b.author}`.toLowerCase(),
    head: b.title.toLowerCase(),
  }))

  const works = WORKS.map((w) => ({
    type: 'work',
    typeLabel: '习作',
    title: w.title,
    sub: w.date,
    to: '/works',
    hay: `${w.title} ${w.copy} ${w.note}`.toLowerCase(),
    head: w.title.toLowerCase(),
  }))

  const quotes = QUOTES.map((x) => ({
    type: 'quote',
    typeLabel: '句子',
    title: x.lines.join(''),
    sub: x.source,
    to: '/about',
    hay: `${x.lines.join('')} ${x.source}`.toLowerCase(),
    head: x.lines.join('').toLowerCase(),
  }))

  index = [...posts, ...bk, ...works, ...quotes]
  return index
}

const results = computed(() => {
  const kw = q.value.trim().toLowerCase()
  if (!kw) return []
  const tokens = kw.split(/\s+/).filter(Boolean)
  const hits = []
  for (const item of buildIndex()) {
    if (!tokens.every((t) => item.hay.includes(t))) continue
    // 标题命中权重最高，其次是短字段
    let score = 0
    tokens.forEach((t) => {
      if (item.head.includes(t)) score += 10
      else if (item.sub.toLowerCase().includes(t)) score += 4
      else score += 1
    })
    // 类型微调：文章优先于书
    if (item.type === 'post') score += 3
    hits.push({ item, score })
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, 12).map((h) => h.item)
})

function reset() {
  q.value = ''
  cursor.value = 0
}

function show() {
  open.value = true
  nextTick(() => inputEl.value?.focus())
}

function hide() {
  open.value = false
  reset()
}

function go(item) {
  if (!item) return
  hide()
  if (item.type === 'book') router.push({ path: '/books', query: { q: item.book } })
  else router.push(item.to)
}

function move(d) {
  if (!results.value.length) return
  const n = results.value.length
  cursor.value = (cursor.value + d + n) % n
  nextTick(() => {
    listEl.value?.querySelector('.gs-item.on')?.scrollIntoView({ block: 'nearest' })
  })
}

function onKeydown(e) {
  const meta = e.metaKey || e.ctrlKey
  // ⌘K / Ctrl+K 开关
  if (meta && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    open.value ? hide() : show()
    return
  }
  if (e.key === '/' && !open.value) {
    const tag = document.activeElement?.tagName
    if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
      e.preventDefault()
      show()
    }
    return
  }
  if (!open.value) return
  if (e.key === 'Escape') hide()
  else if (e.key === 'ArrowDown') {
    e.preventDefault()
    move(1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    move(-1)
  } else if (e.key === 'Enter') {
    e.preventDefault()
    go(results.value[cursor.value])
  }
}

watch(q, () => (cursor.value = 0))
watch(open, (v) => {
  document.body.style.overflow = v ? 'hidden' : ''
})

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})

const ICON = {
  post: '¶',
  book: '❏',
  work: '✎',
  quote: '❝',
}

/** 把命中的词包一层 <mark>（先转义再加标记，避免 XSS） */
function highlight(text) {
  const kw = q.value.trim()
  const esc = String(text).replace(
    /[&<>"]/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c],
  )
  if (!kw) return esc
  const tokens = kw
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  if (!tokens.length) return esc
  return esc.replace(new RegExp(`(${tokens.join('|')})`, 'gi'), '<mark>$1</mark>')
}
</script>

<template>
  <button class="trigger mono" type="button" aria-label="搜索" @click="show">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
    <kbd>⌘K</kbd>
  </button>

  <Teleport to="body">
    <transition name="gs">
      <div v-if="open" class="gs-mask" @click.self="hide">
        <div class="gs-panel" role="dialog" aria-label="全站搜索">
          <div class="gs-head">
            <span class="gs-prompt mono">$</span>
            <input
              ref="inputEl"
              v-model="q"
              class="gs-input mono"
              type="text"
              placeholder="搜文章、书、习作、句子…"
              spellcheck="false"
            />
            <span class="gs-hint mono">esc 关闭</span>
          </div>

          <div v-if="q.trim()" ref="listEl" class="gs-list">
            <button
              v-for="(r, i) in results"
              :key="r.type + i"
              class="gs-item"
              :class="{ on: i === cursor }"
              type="button"
              @mouseenter="cursor = i"
              @click="go(r)"
            >
              <span class="gs-icon mono">{{ ICON[r.type] }}</span>
              <span class="gs-main">
                <span class="gs-title" v-html="highlight(r.title)"></span>
                <span class="gs-sub mono">{{ r.typeLabel }} · {{ r.sub }}</span>
              </span>
              <span class="gs-enter mono">↵</span>
            </button>

            <p v-if="!results.length" class="gs-empty mono">
              // 没有匹配 —— 换个词试试
            </p>
          </div>

          <div v-else class="gs-tips mono">
            <p><b>⌘K</b> 唤醒 · <b>↑↓</b> 选择 · <b>↵</b> 打开</p>
            <p class="dim">可搜：文章正文 / 书名与作者 / 习作标题 / 喜欢的句子</p>
          </div>

          <div v-if="results.length" class="gs-foot mono">
            {{ results.length }} 条结果
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
/* ---------- 导航栏触发按钮 ---------- */
.trigger {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 38px;
  padding: 0 10px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 10px;
  color: var(--muted);
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
}
.trigger svg { width: 15px; height: 15px; }
.trigger kbd {
  font-size: 10px;
  color: var(--faint);
  border: 1px solid var(--line);
  border-radius: 4px;
  padding: 1px 5px;
}
.trigger:hover {
  color: var(--primary);
  border-color: color-mix(in srgb, var(--primary) 45%, var(--line));
  background: var(--primary-weak);
}

/* ---------- 遮罩与面板 ---------- */
.gs-mask {
  position: fixed;
  inset: 0;
  z-index: 300;
  background: color-mix(in srgb, var(--bg) 30%, rgba(0, 0, 0, 0.55));
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 12vh 20px 20px;
}
.gs-panel {
  width: min(640px, 100%);
  background: var(--surface);
  border: 1px solid color-mix(in srgb, var(--primary) 28%, var(--line));
  border-radius: 14px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45), var(--glow);
  overflow: hidden;
}
.gs-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 18px;
  border-bottom: 1px solid var(--line);
}
.gs-prompt { color: var(--primary); font-size: 15px; }
.gs-input {
  flex: 1;
  background: none;
  border: 0;
  outline: none;
  color: var(--text);
  font-size: 15px;
}
.gs-input::placeholder { color: var(--faint); }
.gs-hint { font-size: 11px; color: var(--faint); }

.gs-list {
  max-height: min(52vh, 420px);
  overflow-y: auto;
  padding: 6px;
}
.gs-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  border: 0;
  border-radius: 9px;
  background: none;
  color: var(--text);
  cursor: pointer;
  transition: background-color 0.15s ease;
}
.gs-item.on { background: var(--primary-weak); }
.gs-icon {
  width: 22px;
  text-align: center;
  color: var(--primary);
  font-size: 13px;
  flex: none;
}
.gs-main { flex: 1; min-width: 0; }
.gs-title {
  display: block;
  font-size: 14px;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.gs-sub {
  display: block;
  font-size: 11px;
  color: var(--faint);
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.gs-enter {
  font-size: 12px;
  color: var(--faint);
  opacity: 0;
  transition: opacity 0.15s ease;
}
.gs-item.on .gs-enter { opacity: 1; color: var(--primary); }

.gs-tips {
  padding: 20px 18px 22px;
  font-size: 12px;
  color: var(--muted);
  line-height: 2;
}
.gs-tips b { color: var(--primary); font-weight: 600; }
.gs-tips .dim { color: var(--faint); }

.gs-empty {
  padding: 26px 0;
  text-align: center;
  font-size: 12px;
  color: var(--faint);
}
.gs-foot {
  padding: 8px 16px 10px;
  border-top: 1px solid var(--line);
  font-size: 11px;
  color: var(--faint);
  text-align: right;
}

/* 命中高亮 */
:deep(mark) {
  background: color-mix(in srgb, var(--primary) 22%, transparent);
  color: var(--primary);
  border-radius: 3px;
  padding: 0 1px;
}

/* 进出动画 */
.gs-enter-active,
.gs-leave-active { transition: opacity 0.2s ease; }
.gs-enter-from,
.gs-leave-to { opacity: 0; }
.gs-enter-active .gs-panel {
  animation: gsIn 0.26s cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes gsIn {
  from { opacity: 0; transform: translateY(-10px) scale(0.985); }
  to { opacity: 1; transform: none; }
}

@media (max-width: 720px) {
  .trigger kbd { display: none; }
  .gs-mask { padding: 8vh 12px 12px; }
}
</style>
