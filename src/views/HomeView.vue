<script setup>
import { POSTS } from '../utils/posts'
import { books, matchStatus } from '../data/books'
import TypeWriter from '../components/TypeWriter.vue'
import ArticleCard from '../components/ArticleCard.vue'

const latest = POSTS.slice(0, 3)
const finishedCount = books.filter((b) => matchStatus(b, 'finished')).length

const termLines = [
  '$ whoami',
  '> 译文 — 前端开发工程师',
  '$ cat skills.json',
  '> ["Vue", "uni-app x", "小程序", "ECharts", "Flutter*"]',
  '$ wc -l reading.log',
  `> ${books.length} 本书 · ${finishedCount} 本已读完`,
  '$ uptime',
  '> 临李斯《峄山碑》中 · 博客持续编译中…',
]
</script>

<template>
  <div>
    <!-- Hero：左文案 + 右终端窗口 -->
    <section class="hero">
      <div class="hero-left">
        <span class="badge mono" v-reveal>// HELLO_WORLD</span>
        <h1 v-reveal="80">
          <span class="grad">译文</span> 的数字花园<br />
          <span class="dim">代码 · 书页 · 笔墨</span>
        </h1>
        <p class="lead" v-reveal="160">
          一个前端工程师的持续集成流水线：日常构建技术笔记，
          异步同步读书心得，定时打印毛笔习作。不追热点，只提交经过验证的思考。
        </p>
        <div class="actions" v-reveal="240">
          <router-link to="/articles" class="btn primary mono">ls ./articles →</router-link>
          <router-link to="/books" class="btn ghost mono">cat books.json</router-link>
        </div>
        <div class="stats mono" v-reveal="320">
          <span class="stat"><b>{{ POSTS.length }}</b> posts</span>
          <span class="dot">·</span>
          <span class="stat"><b>{{ books.length }}</b> books</span>
          <span class="dot">·</span>
          <span class="stat status"><i></i> online</span>
        </div>
      </div>

      <div class="terminal card" v-reveal="200">
        <div class="term-head">
          <span class="tdot red"></span>
          <span class="tdot yellow"></span>
          <span class="tdot green"></span>
          <span class="term-title mono">~/yiwen — zsh</span>
        </div>
        <div class="term-body">
          <TypeWriter :lines="termLines" />
        </div>
      </div>
    </section>

    <!-- 最新文章 -->
    <section class="latest">
      <div class="sec-head" v-reveal>
        <h2><span class="mono-tag mono">01/</span> 最新提交</h2>
        <router-link to="/articles" class="more mono">view all →</router-link>
      </div>
      <div class="grid" v-if="latest.length">
        <ArticleCard v-for="(p, i) in latest" :key="p.slug" :post="p" :delay="i * 90" />
      </div>
      <div v-else class="card empty" v-reveal>
        <p class="empty-line mono">&gt; articles/ is empty</p>
        <p class="empty-hint">文章还在整理中，很快会一篇篇贴上来。</p>
      </div>
    </section>

    <!-- 三个模块入口 -->
    <section class="entries">
      <router-link to="/articles" class="card entry" v-reveal="0">
        <div class="entry-head">
          <span class="entry-icon" style="--c: var(--tech)">⌘</span>
          <span class="entry-id mono">/articles</span>
        </div>
        <h3>技术笔记</h3>
        <p>Vue、uni-app、ECharts 的实战与踩坑，写下来才算真的会了。</p>
        <div class="entry-bar" style="--c: var(--tech)"></div>
      </router-link>
      <router-link to="/books" class="card entry" v-reveal="90">
        <div class="entry-head">
          <span class="entry-icon" style="--c: var(--reading)">⌥</span>
          <span class="entry-id mono">/books · {{ books.length }}</span>
        </div>
        <h3>我的书单</h3>
        <p>{{ books.length }} 本读过的书，按分类、状态、评分随意翻。</p>
        <div class="entry-bar" style="--c: var(--reading)"></div>
      </router-link>
      <router-link to="/calligraphy" class="card entry" v-reveal="180">
        <div class="entry-head">
          <span class="entry-icon" style="--c: var(--calligraphy)">✎</span>
          <span class="entry-id mono">/calligraphy</span>
        </div>
        <h3>篆书习作</h3>
        <p>主攻篆书，临李斯《峄山碑》。记录每一遍的进步与卡点。</p>
        <div class="entry-bar" style="--c: var(--calligraphy)"></div>
      </router-link>
    </section>
  </div>
</template>

<style scoped>
.hero {
  padding: 48px 0 56px;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 48px;
  align-items: center;
}
.badge {
  display: inline-block;
  color: var(--primary);
  font-size: 13px;
  padding: 5px 14px;
  border-radius: 8px;
  border: 1px dashed color-mix(in srgb, var(--primary) 40%, transparent);
  background: var(--primary-weak);
  margin-bottom: 22px;
}
h1 {
  font-size: 42px;
  line-height: 1.3;
  letter-spacing: 1px;
}
h1 .grad {
  background: linear-gradient(92deg, var(--primary), var(--primary-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
h1 .dim {
  font-size: 30px;
  color: var(--muted);
  font-weight: 600;
}
.lead {
  margin-top: 18px;
  color: var(--muted);
  font-size: 16px;
  max-width: 520px;
}
.actions { margin-top: 28px; display: flex; gap: 12px; flex-wrap: wrap; }
.btn {
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  padding: 11px 24px;
  border-radius: 10px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}
.btn:hover { transform: translateY(-2px); }
.btn.primary { background: var(--primary); color: #041018; box-shadow: var(--glow); }
.btn.primary:hover { box-shadow: var(--glow), var(--shadow-md); }
.btn.ghost {
  background: var(--surface);
  color: var(--muted);
  border: 1px solid var(--line);
}
.btn.ghost:hover { color: var(--primary); border-color: var(--primary); }

.stats {
  margin-top: 26px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: var(--faint);
  flex-wrap: wrap;
}
.stats b { color: var(--text); font-weight: 700; }
.dot { color: var(--faint); }
.status { display: inline-flex; align-items: center; gap: 7px; color: var(--muted); }
.status i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 8px rgba(52, 211, 153, 0.8);
  animation: pulse 2s ease infinite;
}
@keyframes pulse {
  50% { opacity: 0.4; }
}

/* ---------- 终端窗口 ---------- */
.terminal {
  overflow: hidden;
  border-radius: var(--radius);
}
.term-head {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 12px 16px;
  background: var(--surface-2);
  border-bottom: 1px solid var(--line);
}
.tdot { width: 11px; height: 11px; border-radius: 50%; }
.tdot.red { background: #ff5f57; }
.tdot.yellow { background: #febc2e; }
.tdot.green { background: #28c840; }
.term-title {
  margin-left: 8px;
  font-size: 12px;
  color: var(--faint);
}
.term-body {
  padding: 20px 22px 26px;
  min-height: 236px;
}

/* ---------- 最新文章 ---------- */
.latest { margin-top: 24px; }
.sec-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 20px;
}
.sec-head h2 { font-size: 22px; letter-spacing: 1px; display: flex; gap: 12px; align-items: baseline; }
.mono-tag { color: var(--primary); font-size: 14px; font-weight: 600; }
.more {
  color: var(--primary);
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
}
.more:hover { text-shadow: 0 0 12px var(--primary); }
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.empty {
  padding: 40px 28px;
  text-align: center;
  border-style: dashed;
  box-shadow: none;
}
.empty:hover { transform: none; box-shadow: none; }
.empty-line { font-size: 13px; color: var(--primary); margin-bottom: 8px; }
.empty-hint { font-size: 14px; color: var(--muted); }

/* ---------- 模块入口 ---------- */
.entries {
  margin-top: 48px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.entry {
  padding: 24px 24px 28px;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
  color: inherit;
}
.entry-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.entry-icon {
  width: 42px;
  height: 42px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  font-size: 19px;
  color: var(--c);
  background: color-mix(in srgb, var(--c) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--c) 30%, transparent);
}
.entry-id { font-size: 12px; color: var(--faint); }
.entry h3 { font-size: 17px; }
.entry p { font-size: 14px; color: var(--muted); flex: 1; }
.entry-bar {
  margin-top: 16px;
  height: 3px;
  border-radius: 2px;
  background: linear-gradient(90deg, var(--c), transparent);
  transform: scaleX(0.35);
  transform-origin: left;
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}
.entry:hover .entry-bar { transform: scaleX(1); }

@media (max-width: 900px) {
  .hero { grid-template-columns: 1fr; gap: 32px; }
  h1 { font-size: 32px; }
  h1 .dim { font-size: 23px; }
  .grid, .entries { grid-template-columns: 1fr; }
}
</style>
