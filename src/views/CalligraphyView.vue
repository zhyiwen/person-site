<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { CHARS, CHARS_SOURCE } from '../data/chars'
import { postsByCategory } from '../utils/posts'
import { WORKS } from '../utils/works'
import ArticleCard from '../components/ArticleCard.vue'

const posts = postsByCategory('calligraphy')
const chars = CHARS
const works = WORKS

/* ---------- 大图浏览 ---------- */
const active = ref(-1)
const hasWorks = works.length > 0

function open(i) { active.value = i }
function close() { active.value = -1 }
function step(d) {
  if (!hasWorks) return
  active.value = (active.value + d + works.length) % works.length
}

function onKey(e) {
  if (active.value < 0) return
  if (e.key === 'Escape') close()
  if (e.key === 'ArrowLeft') step(-1)
  if (e.key === 'ArrowRight') step(1)
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})

/* 大图打开时锁住背景滚动 */
watch(active, (v) => {
  document.body.style.overflow = v >= 0 ? 'hidden' : ''
})
</script>

<template>
  <div>
    <div class="page-head" v-reveal>
      <h1><span class="mono-tag mono">$ run</span> 习字</h1>
      <p class="sub">// 主攻篆书 · 临李斯《峄山碑》· 慢功夫，不着急</p>
    </div>

    <!-- 集字：从自己的临帖里抠出来的单字 -->
    <section v-if="chars.length" class="glyphs" v-reveal="40">
      <div class="wall-head">
        <h2 class="sec-title mono">🖌️ ink_tiles/ — 集字</h2>
        <span class="count mono">{{ chars.length }} chars</span>
      </div>
      <div class="glyph-row">
        <div
          v-for="(c, i) in chars"
          :key="c.char"
          class="glyph-cell"
          v-reveal="80 + i * 55"
        >
          <span class="glyph" :style="{ '--mask': `url(${c.url})` }" :title="c.char"></span>
        </div>
      </div>
      <p class="glyph-src mono">// {{ CHARS_SOURCE }}</p>
    </section>

    <section class="wall" v-reveal="60">
      <div class="wall-head">
        <h2 class="sec-title mono">🖼️ ink_wall/ — 整篇习作</h2>
        <span class="count mono">{{ hasWorks ? works.length + ' pieces' : 'empty' }}</span>
      </div>

      <!-- 有照片：作品墙 -->
      <div v-if="hasWorks" class="wall-grid">
        <figure
          v-for="(w, i) in works"
          :key="w.file"
          class="card work"
          v-reveal="i * 70"
          @click="open(i)"
        >
          <div class="ph">
            <img :src="w.url" :alt="w.title" loading="lazy" />
            <span class="zoom mono">查看</span>
          </div>
          <figcaption>
            <p class="w-title">{{ w.title }}</p>
            <p class="w-meta mono">
              <span v-if="w.date">{{ w.date }}</span>
              <span v-if="w.copy"> · {{ w.copy }}</span>
            </p>
            <p v-if="w.note" class="w-note">{{ w.note }}</p>
          </figcaption>
        </figure>
      </div>

      <!-- 没照片：空状态 -->
      <div v-else class="card wall-empty" v-reveal>
        <span class="empty-plus mono">+</span>
        <p class="empty-line mono">&gt; ink_wall/ is empty</p>
        <p class="empty-hint">
          整篇临帖照片放进 <code>src/assets/ink/</code>，命名 <code>日期-标题.jpg</code>，这里会自动排成作品墙。
        </p>
      </div>
    </section>

    <section class="posts">
      <h2 class="sec-title mono" v-reveal>✍️ ink_log/*.md</h2>

      <div v-if="posts.length" class="grid">
        <ArticleCard v-for="(p, i) in posts" :key="p.slug" :post="p" :delay="i * 80" />
      </div>

      <div v-else class="card empty" v-reveal>
        <p class="empty-line mono">&gt; ink_log/ is empty</p>
        <p class="empty-hint">习字记录还没开始写 —— 哪一遍临得最有感觉，或者卡在哪一笔，写下来就是一篇。</p>
      </div>
    </section>

    <!-- 大图 -->
    <transition name="lb">
      <div v-if="active >= 0" class="lightbox" @click.self="close">
        <button class="lb-close" aria-label="关闭" @click="close">✕</button>
        <button v-if="works.length > 1" class="lb-nav prev" aria-label="上一张" @click.stop="step(-1)">‹</button>
        <figure class="lb-figure">
          <img :src="works[active].url" :alt="works[active].title" />
          <figcaption class="mono">
            {{ works[active].title }}
            <span v-if="works[active].date"> · {{ works[active].date }}</span>
            <span v-if="works[active].copy"> · {{ works[active].copy }}</span>
          </figcaption>
        </figure>
        <button v-if="works.length > 1" class="lb-nav next" aria-label="下一张" @click.stop="step(1)">›</button>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.sec-title {
  font-size: 14px;
  margin-bottom: 16px;
  color: var(--muted);
  font-weight: 600;
}

/* ---------- 集字 ---------- */
.glyphs { margin-bottom: 44px; }
.glyph-row {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 10px;
}
.glyph-cell {
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: color-mix(in srgb, var(--surface) 55%, transparent);
  color: var(--text);
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.25s ease, box-shadow 0.25s ease, color 0.25s ease;
}
.glyph-cell:hover {
  transform: translateY(-5px);
  color: var(--primary);
  border-color: color-mix(in srgb, var(--primary) 45%, var(--line));
  box-shadow: var(--glow);
}
/* PNG 的 alpha 当蒙版，颜色跟随主题 */
.glyph {
  width: 66%;
  height: 66%;
  background: currentColor;
  -webkit-mask-image: var(--mask);
  mask-image: var(--mask);
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
}
.glyph-src {
  margin-top: 12px;
  text-align: center;
  font-size: 12px;
  color: var(--faint);
  letter-spacing: 0.5px;
}

/* ---------- 作品墙 ---------- */
.wall-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}
.count { font-size: 12px; color: var(--faint); letter-spacing: 1px; }

.wall-grid {
  /* 瀑布流：不裁切、不留边带，照片按原比例排 */
  columns: 3;
  column-gap: 16px;
}
.work {
  display: block;
  padding: 10px;
  margin: 0 0 16px;
  cursor: zoom-in;
  break-inside: avoid;
}
.ph {
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  background: var(--surface-2);
}
.ph img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
.work:hover .ph img { transform: scale(1.04); }
.zoom {
  position: absolute;
  right: 8px;
  bottom: 8px;
  font-size: 11px;
  letter-spacing: 1px;
  padding: 3px 8px;
  border-radius: 999px;
  color: #041018;
  background: var(--primary);
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.work:hover .zoom { opacity: 1; transform: translateY(0); }

figcaption { padding: 12px 6px 4px; }
.w-title { font-size: 14px; letter-spacing: 0.5px; }
.w-meta { font-size: 11px; color: var(--faint); margin-top: 4px; }
.w-note {
  font-size: 13px;
  color: var(--muted);
  margin-top: 8px;
  line-height: 1.7;
}

/* ---------- 空状态占位槽 ---------- */
.wall-empty {
  padding: 36px 28px;
  text-align: center;
  border-style: dashed;
  box-shadow: none;
  animation: slotIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.wall-empty:hover { transform: none; box-shadow: none; }
.empty-plus {
  display: inline-grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px dashed color-mix(in srgb, var(--primary) 40%, var(--line));
  color: var(--primary);
  font-size: 18px;
  margin-bottom: 12px;
}
@keyframes slotIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
}
code {
  font-family: var(--mono);
  font-size: 12px;
  padding: 1px 5px;
  border-radius: 4px;
  color: var(--primary);
  background: color-mix(in srgb, var(--primary) 10%, transparent);
}

/* ---------- 文章列表 ---------- */
.posts { margin-top: 40px; }
.posts .grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
.empty {
  padding: 40px 28px;
  text-align: center;
  box-shadow: none;
  border-style: dashed;
}
.empty:hover { transform: none; box-shadow: none; }
.empty-line { font-size: 13px; color: var(--primary); margin-bottom: 8px; }
.empty-hint { font-size: 14px; color: var(--muted); }

/* ---------- 大图浏览 ---------- */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(4, 10, 16, 0.9);
  backdrop-filter: blur(6px);
  display: grid;
  place-items: center;
  padding: 40px 72px;
}
.lb-figure {
  max-width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  animation: lbIn 0.32s cubic-bezier(0.22, 1, 0.36, 1);
}
.lb-figure img {
  max-width: min(88vw, 900px);
  max-height: 78vh;
  object-fit: contain;
  border-radius: 10px;
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.6);
  background: #0b1118;
}
.lb-figure figcaption {
  font-size: 12px;
  color: rgba(221, 231, 242, 0.72);
  letter-spacing: 1px;
  text-align: center;
}
@keyframes lbIn {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: none; }
}
.lb-close {
  position: absolute;
  top: 22px;
  right: 24px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.06);
  color: #dde7f2;
  font-size: 14px;
  cursor: pointer;
  transition: transform 0.25s ease, background 0.25s ease;
}
.lb-close:hover { transform: rotate(90deg); background: rgba(255, 255, 255, 0.14); }
.lb-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.06);
  color: #dde7f2;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  transition: background 0.25s ease, border-color 0.25s ease;
}
.lb-nav:hover { background: rgba(255, 255, 255, 0.16); border-color: var(--primary); }
.lb-nav.prev { left: 18px; }
.lb-nav.next { right: 18px; }

.lb-enter-active,
.lb-leave-active { transition: opacity 0.25s ease; }
.lb-enter-from,
.lb-leave-to { opacity: 0; }

@media (max-width: 860px) {
  .glyph-row { grid-template-columns: repeat(4, 1fr); }
  .wall-grid { columns: 2; }
  .posts .grid { grid-template-columns: 1fr; }
  .lightbox { padding: 24px 12px; }
  .lb-nav { width: 38px; height: 38px; }
  .lb-nav.prev { left: 8px; }
  .lb-nav.next { right: 8px; }
}
</style>
