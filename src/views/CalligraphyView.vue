<script setup>
import { computed } from "vue";
import { CHARS, SCRIPT_STATS } from "../data/chars";
import { postsByCategory } from "../utils/posts";
import { WORKS } from "../utils/works";
import InkWall from "../components/InkWall.vue";
import ArticleCard from "../components/ArticleCard.vue";

const posts = postsByCategory("calligraphy");
const chars = CHARS;
const scriptStats = SCRIPT_STATS;
const works = WORKS;

/**
 * 习字页只露最新 6 件，等宽等高的三列方块（InkWall layout="grid"），
 * 全集保持瀑布流，在 /works
 */
const PREVIEW_SHOW = 6;
const overflow = computed(() => works.length > PREVIEW_SHOW);
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
        <span class="count mono">
          <span v-for="s in scriptStats" :key="s.script" class="st">{{ s.script }} {{ s.count }}</span>
          <span class="dim">{{ chars.length }} chars</span>
        </span>
      </div>
      <div class="glyph-row">
        <div
          v-for="(c, i) in chars"
          :key="c.char"
          class="glyph-cell"
          v-reveal="80 + i * 55"
        >
          <span class="glyph" :style="{ '--mask': `url(${c.url})` }"></span>
          <span v-if="c.script" class="glyph-script mono">{{ c.script }}</span>
          <span class="glyph-modern mono" :title="c.char">{{ c.modern }}</span>
          <span class="glyph-tip mono">{{ c.char }} · {{ c.source }}</span>
        </div>
      </div>
      <!-- <p class="glyph-src mono">// {{ CHARS_SOURCE }}</p> -->
    </section>

    <section class="wall" v-reveal="60">
      <div class="wall-head">
        <h2 class="sec-title mono">🖼️ ink_wall/ — 整篇习作</h2>
        <span class="count mono">{{
          works.length ? works.length + " pieces" : "empty"
        }}</span>
      </div>

      <!-- 最新 6 件，等宽等高；全集（瀑布流）在 /works -->
      <InkWall
        v-if="works.length"
        :works="works"
        :limit="PREVIEW_SHOW"
        layout="grid"
      />

      <!-- 没照片：空状态 -->
      <div v-else class="card wall-empty" v-reveal>
        <span class="empty-plus mono">+</span>
        <p class="empty-line mono">&gt; ink_wall/ is empty</p>
        <p class="empty-hint">
          整篇临帖照片放进 <code>src/assets/ink/</code>，命名
          <code>日期-标题.jpg</code>，这里会自动排成作品墙。
        </p>
      </div>

      <!-- 入口常在：不收起时也不让 /works 变成无 UI 入口的幽灵页 -->
      <router-link v-if="works.length" to="/works" class="wall-more mono">
        {{ overflow ? `全部 ${works.length} 张作品 →` : "作品全集 →" }}
      </router-link>
    </section>

    <section class="posts">
      <h2 class="sec-title mono" v-reveal>✍️ ink_log/*.md</h2>

      <div v-if="posts.length" class="grid">
        <ArticleCard
          v-for="(p, i) in posts"
          :key="p.slug"
          :post="p"
          :delay="i * 80"
        />
      </div>

      <div v-else class="card empty" v-reveal>
        <p class="empty-line mono">&gt; ink_log/ is empty</p>
        <p class="empty-hint">
          习字记录还没开始写 ——
          哪一遍临得最有感觉，或者卡在哪一笔，写下来就是一篇。
        </p>
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
.glyphs {
  margin-bottom: 44px;
}
.glyph-row {
  /* 格数随收集的字数自动换行：最小 84px，宽屏尽量挤进同一行，避免末行只剩一个字 */
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(84px, 1fr));
  gap: 10px;
}
.glyph-cell {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  display: grid;
  place-items: center;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: color-mix(in srgb, var(--surface) 55%, transparent);
  color: var(--text);
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.25s ease,
    box-shadow 0.25s ease,
    color 0.25s ease;
}
.glyph-cell:hover {
  transform: translateY(-5px);
  z-index: 3;
  color: var(--primary);
  border-color: color-mix(in srgb, var(--primary) 45%, var(--line));
  box-shadow: var(--glow);
}
/* PNG 的 alpha 当蒙版，颜色跟随主题；下留 8px 给简体角标让位 */
.glyph {
  width: 64%;
  height: 64%;
  margin-bottom: 8px;
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
/* 书体角标：左上角，篆 / 隶 / 楷 / 行 / 草；刻意调淡，不抢字的风头 */
.glyph-script {
  position: absolute;
  top: 7px;
  left: 9px;
  font-size: 11px;
  line-height: 1;
  letter-spacing: 1px;
  color: var(--faint);
  opacity: 0.55;
}
/* 现代写法：右下角斜切角标，简体对照，只作轻提示 */
.glyph-modern {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  /* 往内收 8px：卡片有 12px 圆角，贴着角放会把字裁掉 */
  padding: 0 8px 8px 0;
  font-size: 11px;
  line-height: 1;
  background: color-mix(in srgb, var(--primary) 22%, transparent);
  clip-path: polygon(100% 0, 100% 100%, 0 100%);
  color: var(--primary-text);
  transition: background 0.2s ease;
}
.glyph-cell:hover .glyph-modern {
  background: color-mix(in srgb, var(--primary) 36%, transparent);
}
/* 悬停详情：自定义标签，比原生 title 快且清晰 */
.glyph-tip {
  position: absolute;
  left: 7px;
  bottom: 7px;
  transform: translateY(4px);
  white-space: nowrap;
  padding: 2px 8px;
  font-size: 10px;
  letter-spacing: 0.5px;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--primary) 40%, var(--line));
  background: color-mix(in srgb, var(--surface) 96%, var(--primary) 4%);
  color: var(--text);
  box-shadow: var(--glow);
  opacity: 0;
  pointer-events: none;
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}
.glyph-cell:hover .glyph-tip {
  opacity: 1;
  transform: translateY(0);
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
.count {
  font-size: 12px;
  color: var(--faint);
  letter-spacing: 1px;
}
/* 集字头部的书体统计：篆 7 · 楷 3 · 10 chars */
.count .st {
  margin-right: 10px;
  color: var(--calligraphy-text);
}
.count .dim {
  padding-left: 10px;
  border-left: 1px solid var(--line);
  opacity: 0.75;
}

.wall-more {
  display: block;
  width: fit-content;
  margin: 8px auto 0;
  padding: 9px 18px;
  font-size: 12px;
  letter-spacing: 1px;
  text-decoration: none;
  color: var(--primary-text);
  border: 1px solid color-mix(in srgb, var(--primary) 35%, var(--line));
  border-radius: 999px;
  background: color-mix(in srgb, var(--primary) 7%, transparent);
  transition:
    background-color 0.25s ease,
    border-color 0.25s ease,
    transform 0.25s ease;
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
.wall-empty:hover {
  transform: none;
  box-shadow: none;
}
.empty-plus {
  display: inline-grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px dashed color-mix(in srgb, var(--primary) 40%, var(--line));
  color: var(--primary-text);
  font-size: 18px;
  margin-bottom: 12px;
}
@keyframes slotIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
code {
  font-family: var(--mono);
  font-size: 12px;
  padding: 1px 5px;
  border-radius: 4px;
  color: var(--primary-text);
  background: color-mix(in srgb, var(--primary) 10%, transparent);
}

/* ---------- 文章列表 ---------- */
.posts {
  margin-top: 40px;
}
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
.empty:hover {
  transform: none;
  box-shadow: none;
}
.empty-line {
  font-size: 13px;
  color: var(--primary-text);
  margin-bottom: 8px;
}
.empty-hint {
  font-size: 14px;
  color: var(--muted);
}

@media (max-width: 860px) {
  .glyph-row {
    grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
  }
  .posts .grid {
    grid-template-columns: 1fr;
  }
}
</style>
