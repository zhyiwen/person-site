<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import ThemeToggle from './ThemeToggle.vue'
import GlobalSearch from './GlobalSearch.vue'

const route = useRoute()

const links = [
  { to: '/', label: '首页', cmd: '~' },
  { to: '/articles', label: '文章', cmd: '/articles' },
  { to: '/books', label: '书单', cmd: '/books' },
  // 作品全集不占导航位，入口在习字页内；访问 /works 时「习字」保持高亮
  { to: '/calligraphy', label: '习字', cmd: '/ink', also: ['/works'] },
  { to: '/about', label: '关于', cmd: '/about' },
]

/** 子页面也算所属栏目 */
const isActive = (l) => route.path === l.to || (l.also || []).includes(route.path)

const mobileOpen = ref(false)
</script>

<template>
  <header class="nav">
    <div class="nav-inner">
      <router-link to="/" class="brand mono">
        <span class="seal"><img src="/yi.png" alt="译文" /></span>
        <span class="brand-text">yiwen<span class="cursor-blink">_</span><span class="domain">.dev</span></span>
      </router-link>

      <nav class="links" :class="{ open: mobileOpen }">
        <router-link
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          class="link"
          :class="{ 'router-link-active': isActive(l) }"
          @click="mobileOpen = false"
        >
          <span class="cmd mono">{{ l.cmd }}</span>
          {{ l.label }}
        </router-link>
      </nav>

      <div class="nav-right">
        <GlobalSearch />
        <ThemeToggle />
        <button class="burger" aria-label="菜单" @click="mobileOpen = !mobileOpen">
          <span :class="{ x1: mobileOpen }"></span>
          <span :class="{ hide: mobileOpen }"></span>
          <span :class="{ x2: mobileOpen }"></span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: color-mix(in srgb, var(--bg) 78%, transparent);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--line);
  transition: background-color 0.35s ease, border-color 0.35s ease;
}
.nav-inner {
  max-width: 1020px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  font-weight: 700;
}
.seal {
  width: 34px;
  height: 34px;
  background: #f6f3ec;
  border-radius: 9px;
  display: grid;
  place-items: center;
  overflow: hidden;
  box-shadow: var(--glow);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.seal img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}
.brand:hover .seal {
  transform: rotate(-6deg) scale(1.06);
  box-shadow: var(--glow), 0 0 44px rgba(43, 217, 255, 0.3);
}
.brand-text { font-size: 15px; letter-spacing: 0.5px; }
.cursor-blink {
  color: var(--primary-text);
  animation: blink 1.1s steps(1) infinite;
  margin-left: 1px;
}
.domain { color: var(--faint); font-weight: 500; }
@keyframes blink { 50% { opacity: 0; } }

.links { display: flex; gap: 2px; }
.link {
  position: relative;
  text-decoration: none;
  color: var(--muted);
  font-size: 14px;
  padding: 8px 13px;
  border-radius: 9px;
  transition: color 0.2s ease, background-color 0.2s ease;
}
.link .cmd {
  font-size: 11px;
  color: var(--faint);
  margin-right: 5px;
  transition: color 0.2s ease;
}
.link:hover { color: var(--text); background: var(--surface-2); }
.link.router-link-active {
  color: var(--primary-text);
  background: var(--primary-weak);
}
.link.router-link-active .cmd { color: var(--primary-2); }
.link.router-link-active::after {
  content: '';
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 1px;
  height: 2px;
  border-radius: 1px;
  background: linear-gradient(90deg, var(--primary), var(--primary-2));
  box-shadow: 0 0 8px var(--primary);
}

.nav-right { display: flex; align-items: center; gap: 8px; }

/* 移动端汉堡 */
.burger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 44px;
  height: 44px;
  padding: 11px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 10px;
  cursor: pointer;
}
.burger span {
  display: block;
  height: 2px;
  background: var(--text);
  border-radius: 2px;
  transition: transform 0.25s ease, opacity 0.2s ease;
}
.burger span.x1 { transform: translateY(7px) rotate(45deg); }
.burger span.hide { opacity: 0; }
.burger span.x2 { transform: translateY(-7px) rotate(-45deg); }

@media (max-width: 720px) {
  .burger { display: flex; }
  .links {
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    flex-direction: column;
    padding: 8px 16px 16px;
    background: var(--surface);
    border-bottom: 1px solid var(--line);
    box-shadow: var(--shadow-md);
    transform: translateY(-12px);
    opacity: 0;
    pointer-events: none;
    transition: transform 0.25s ease, opacity 0.25s ease;
  }
  .links.open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }
  .link .cmd { display: none; }
}
</style>
