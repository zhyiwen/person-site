<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

/* 滚动超过一屏再出现，避免刚进页面就浮个按钮 */
const SHOW_AFTER = 520
const visible = ref(false)

const onScroll = () => {
  visible.value = window.scrollY > SHOW_AFTER
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))

/* html 上已有 scroll-behavior: smooth，这里显式再写一次更稳 */
const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
</script>

<template>
  <transition name="btt">
    <button v-show="visible" class="btt" type="button" aria-label="回到顶部" title="回到顶部" @click="toTop">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3.6 4.4 11.2h4.7v8.4h5.8v-8.4h4.7z" />
      </svg>
    </button>
  </transition>
</template>

<style scoped>
.btt {
  position: fixed;
  right: 26px;
  bottom: 26px;
  z-index: 60;
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: color-mix(in srgb, var(--surface) 86%, transparent);
  backdrop-filter: blur(8px);
  color: var(--primary);
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.25s ease,
    box-shadow 0.25s ease;
}
.btt:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--primary) 45%, var(--line));
  box-shadow: var(--shadow-md);
}
.btt:active { transform: translateY(-1px); }
.btt:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--primary) 55%, transparent);
  outline-offset: 2px;
}
.btt svg { width: 18px; height: 18px; fill: currentColor; }

.btt-enter-active,
.btt-leave-active {
  transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
.btt-enter-from,
.btt-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.94);
}

@media (max-width: 640px) {
  .btt {
    right: 14px;
    bottom: 16px;
    width: 40px;
    height: 40px;
    border-radius: 11px;
  }
}
</style>
