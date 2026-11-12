<template>
  <div>
    <div class="page-head" v-reveal>
      <h1><span class="mono-tag mono">$ man</span> 关于我</h1>
      <p class="sub">// 写代码的人，也在写字</p>
    </div>

    <div class="card about" v-reveal="60">
      <div class="avatar">
        <span class="glyph">译</span>
        <i class="ring"></i>
      </div>
      <div class="text">
        <h2>译文 <span class="mono alias">@yiwen</span></h2>
        <p>前端开发工程师。日常写 Vue / uni-app / 小程序 / ECharts，正在学 Flutter。相信「先把地基打牢，再上框架」。</p>
        <p>工作之外读书、写毛笔字，主攻篆书，临李斯《峄山碑》。相信慢功夫和复利——技术如此，写字如此，读书也如此。</p>
      </div>
    </div>

    <section class="quotes" v-reveal="120">
      <div class="quotes-head">
        <h2><span class="mono-tag mono">$ cat</span> 喜欢的句子</h2>
        <span class="count mono">{{ QUOTES.length }} lines</span>
      </div>

      <ul class="quote-list">
        <li
          v-for="(q, i) in QUOTES"
          :key="q.id"
          class="card quote-item"
          :style="{ '--c': q.accent }"
          v-reveal="150 + i * 80"
        >
          <i class="bar"></i>
          <span class="num mono">{{ String(i + 1).padStart(2, '0') }}</span>
          <div class="q-body">
            <p class="q-text">
              <span v-for="(line, li) in q.lines" :key="li" class="q-line">{{ line }}</span>
            </p>
            <p class="q-src mono">// {{ q.source }}</p>
          </div>
        </li>
      </ul>
    </section>

    <div class="card motto" v-reveal="420">
      <p class="m">「合抱之木，生于毫末；九层之台，起于累土。」</p>
      <p class="s mono">—— 道德经 · v64.0</p>
    </div>
  </div>
</template>

<script setup>
import { QUOTES } from '../data/quotes'
</script>

<style scoped>
/* ---------- 关于卡片 ---------- */
.about {
  padding: 40px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 36px;
  align-items: center;
}
.avatar {
  position: relative;
  width: 108px;
  height: 108px;
  border-radius: 24px;
  background:
    radial-gradient(circle at 30% 24%, rgba(255, 255, 255, 0.45), transparent 58%),
    linear-gradient(140deg, var(--primary) 0%, var(--primary-2) 100%);
  display: grid;
  place-items: center;
  box-shadow: var(--glow), var(--shadow-md);
}
/* 头像内的细网格，呼应全站科技网格 */
.avatar::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.14) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.14) 1px, transparent 1px);
  background-size: 14px 14px;
  -webkit-mask-image: radial-gradient(circle at 50% 60%, transparent 30%, #000 78%);
  mask-image: radial-gradient(circle at 50% 60%, transparent 30%, #000 78%);
  pointer-events: none;
}
.glyph {
  position: relative;
  z-index: 1;
  font-family: 'Songti SC', 'STSong', 'SimSun', serif;
  font-size: 54px;
  line-height: 1;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 2px 12px rgba(4, 16, 24, 0.35);
  transform: translateY(-2px);
}
.ring {
  position: absolute;
  inset: -7px;
  border-radius: 28px;
  border: 1px dashed color-mix(in srgb, var(--primary) 50%, transparent);
  animation: spin 14s linear infinite;
  pointer-events: none;
}
@keyframes spin { to { transform: rotate(360deg); } }

.text h2 { font-size: 24px; margin-bottom: 10px; letter-spacing: 1px; }
.alias { font-size: 14px; color: var(--faint); font-weight: 500; }
.text p { color: var(--muted); font-size: 15px; margin-bottom: 6px; }

/* ---------- 喜欢的句子 ---------- */
.quotes { margin-top: 44px; }
.quotes-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 16px;
}
.quotes-head h2 {
  font-size: 19px;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.quotes-head .mono-tag {
  font-family: var(--mono);
  font-size: 13px;
  font-weight: 500;
  color: var(--primary-text);
}
.count { font-size: 12px; color: var(--faint); letter-spacing: 1px; }

.quote-list {
  list-style: none;
  display: grid;
  gap: 14px;
}
.quote-item {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 26px 30px 24px;
  overflow: hidden;
}
/* 左侧彩条：每句一个主题色 */
.bar {
  position: absolute;
  left: 0;
  top: 20px;
  bottom: 20px;
  width: 3px;
  border-radius: 0 2px 2px 0;
  background: var(--c);
  box-shadow: 0 0 12px color-mix(in srgb, var(--c) 55%, transparent);
  transition: top 0.25s ease, bottom 0.25s ease;
}
.quote-item:hover .bar { top: 12px; bottom: 12px; }
.quote-item:hover {
  border-color: color-mix(in srgb, var(--c) 45%, var(--line));
}

.num {
  font-size: 12px;
  color: var(--faint);
  letter-spacing: 1px;
  padding-top: 8px;
  flex: none;
  transition: color 0.25s ease;
}
.quote-item:hover .num { color: var(--c); }

.q-body { flex: 1; min-width: 0; }
.q-text {
  font-family: 'Songti SC', 'STSong', 'SimSun', serif;
  font-size: 19px;
  line-height: 1.95;
  letter-spacing: 1.5px;
  color: var(--text);
}
.q-line { display: block; }
.q-src {
  margin-top: 10px;
  font-size: 12px;
  color: var(--faint);
  letter-spacing: 0.5px;
  transition: color 0.25s ease;
}
.quote-item:hover .q-src { color: color-mix(in srgb, var(--c) 70%, var(--faint)); }

/* ---------- 结尾座右铭 ---------- */
.motto {
  margin-top: 16px;
  padding: 28px 40px;
  text-align: center;
}
.m { font-size: 17px; letter-spacing: 2px; margin-bottom: 6px; color: var(--muted); }
.s { color: var(--faint); font-size: 12px; letter-spacing: 2px; }

@media (max-width: 720px) {
  .about { grid-template-columns: 1fr; text-align: center; padding: 32px 24px; }
  .avatar { margin: 0 auto; }
  .quote-item { padding: 20px 20px 18px; gap: 12px; }
  .q-text { font-size: 17px; letter-spacing: 1px; line-height: 1.9; }
  .num { display: none; }
  .motto { padding: 24px 20px; }
  .m { font-size: 15px; letter-spacing: 1px; }
}
</style>
