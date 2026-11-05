<script setup>
import { CHARS, CHARS_SOURCE } from '../data/chars'
import { postsByCategory } from '../utils/posts'
import { WORKS } from '../utils/works'
import InkWall from '../components/InkWall.vue'
import ArticleCard from '../components/ArticleCard.vue'

const posts = postsByCategory('calligraphy')
const chars = CHARS
const works = WORKS

/** 习字页只放最近几件，全集在 /works */
const PREVIEW = 3
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
        <span class="count mono">{{ works.length ? works.length + ' pieces' : 'empty' }}</span>
      </div>

      <!-- 有照片：最近几件预览 -->
      <InkWall v-if="works.length" :works="works" :limit="PREVIEW" />

      <!-- 没照片：空状态 -->
      <div v-else class="card wall-empty" v-reveal>
        <span class="empty-plus mono">+</span>
        <p class="empty-line mono">&gt; ink_wall/ is empty</p>
        <p class="empty-hint">
          整篇临帖照片放进 <code>src/assets/ink/</code>，命名 <code>日期-标题.jpg</code>，这里会自动排成作品墙。
        </p>
      </div>

      <router-link v-if="works.length > PREVIEW" to="/works" class="wall-more mono">
        全部 {{ works.length }} 张作品 →
      </router-link>
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

.wall-more {
  display: block;
  width: fit-content;
  margin: 8px auto 0;
  padding: 9px 18px;
  font-size: 12px;
  letter-spacing: 1px;
  text-decoration: none;
  color: var(--primary);
  border: 1px solid color-mix(in srgb, var(--primary) 35%, var(--line));
  border-radius: 999px;
  background: color-mix(in srgb, var(--primary) 7%, transparent);
  transition: background-color 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
}
.wall-more:hover {
  background: color-mix(in srgb, var(--primary) 14%, transparent);
  border-color: var(--primary);
  transform: translateY(-2px);
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

@media (max-width: 860px) {
  .glyph-row { grid-template-columns: repeat(4, 1fr); }
  .posts .grid { grid-template-columns: 1fr; }
}
</style>
