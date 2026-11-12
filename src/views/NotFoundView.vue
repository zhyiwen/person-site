<template>
  <div>
    <div class="page-head" v-reveal>
      <h1><span class="mono-tag mono">404</span> 页面走丢了</h1>
      <p class="sub">// command not found · 这个地址不存在或已被移动</p>
    </div>

    <div class="card nf-term" v-reveal="60">
      <div class="term-head">
        <span class="tdot red"></span>
        <span class="tdot yellow"></span>
        <span class="tdot green"></span>
        <span class="term-title mono">~/yiwen — zsh</span>
      </div>
      <div class="term-body mono">
        <p class="line cmd"><span class="prompt">$</span> cd {{ missing }}</p>
        <p class="line err">cd: no such file or directory: {{ missing }}</p>
        <p class="line hint">// 你要找的页面不在这台机器上 —— 可能链接过期，也可能手滑了</p>
      </div>
    </div>

    <div class="nf-actions" v-reveal="140">
      <router-link to="/" class="btn primary mono">cd ~ →</router-link>
      <router-link to="/articles" class="btn ghost mono">ls ./articles</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
/** 截取用户实际访问的路径，用于终端回显（hash 模式下 fullPath 即原始输入） */
const missing = computed(() => {
  const raw = String(route.params.pathMatch || route.path || '')
  const seg = Array.isArray(raw) ? raw.join('/') : raw
  return '/' + String(seg).replace(/^\/+/, '')
})
</script>

<style scoped>
.nf-term { overflow: hidden; }
.term-head {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--line);
}
.tdot { width: 11px; height: 11px; border-radius: 50%; }
.tdot.red { background: #ff5f57; }
.tdot.yellow { background: #febc2e; }
.tdot.green { background: #28c840; }
.term-title {
  font-size: 12px;
  color: var(--faint);
  margin-left: 6px;
  letter-spacing: 0.3px;
}
.term-body { padding: 18px 20px; }
.line { font-size: 13.5px; line-height: 1.9; letter-spacing: 0.3px; }
.line.cmd { color: var(--text); }
.prompt { color: var(--primary-text); margin-right: 6px; }
.line.err { color: var(--calligraphy-text); }
.line.hint { color: var(--muted); font-size: 12.5px; margin-top: 6px; }

.nf-actions {
  margin-top: 24px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.btn {
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  padding: 11px 24px;
  border-radius: 10px;
  transition: transform 0.2s ease, box-shadow 0.2s ease, color 0.2s ease, border-color 0.2s ease;
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
</style>
