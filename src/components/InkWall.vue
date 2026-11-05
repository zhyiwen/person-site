<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

/**
 * 作品墙（瀑布流 + 大图浏览）
 * - works：作品数组（含 url / title / date / copy / note）
 * - limit：最多显示几张，0 = 全部
 * 大图浏览在「当前显示的作品」内部循环
 */
const props = defineProps({
  works: { type: Array, default: () => [] },
  limit: { type: Number, default: 0 },
})

const shown = computed(() => (props.limit > 0 ? props.works.slice(0, props.limit) : props.works))
const rest = computed(() => Math.max(0, props.works.length - shown.value.length))

/* ---------- 大图浏览 ---------- */
const active = ref(-1)
const canNav = computed(() => shown.value.length > 1)

function open(i) {
  active.value = i
}
function close() {
  active.value = -1
}
function step(d) {
  const n = shown.value.length
  if (!n) return
  active.value = (active.value + d + n) % n
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
  <div class="ink-wall">
    <div v-if="shown.length" class="wall-grid">
      <figure
        v-for="(w, i) in shown"
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

    <slot name="empty" v-if="!shown.length" />
    <p v-if="rest" class="rest mono">// 另有 {{ rest }} 张未在此处显示</p>

    <!-- 大图 -->
    <transition name="lb">
      <div v-if="active >= 0" class="lightbox" @click.self="close">
        <button class="lb-close" aria-label="关闭" @click="close">✕</button>
        <button v-if="canNav" class="lb-nav prev" aria-label="上一张" @click.stop="step(-1)">‹</button>
        <figure class="lb-figure">
          <img :src="shown[active].url" :alt="shown[active].title" />
          <figcaption class="mono">
            {{ shown[active].title }}
            <span v-if="shown[active].date"> · {{ shown[active].date }}</span>
            <span v-if="shown[active].copy"> · {{ shown[active].copy }}</span>
          </figcaption>
        </figure>
        <button v-if="canNav" class="lb-nav next" aria-label="下一张" @click.stop="step(1)">›</button>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* ---------- 瀑布流 ---------- */
.wall-grid {
  /* 不裁切、不留边带，照片按原比例排 */
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
.work:hover .ph img {
  transform: scale(1.04);
}
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
.work:hover .zoom {
  opacity: 1;
  transform: translateY(0);
}

figcaption {
  padding: 12px 6px 4px;
}
.w-title {
  font-size: 14px;
  letter-spacing: 0.5px;
}
.w-meta {
  font-size: 11px;
  color: var(--faint);
  margin-top: 4px;
}
.w-note {
  font-size: 13px;
  color: var(--muted);
  margin-top: 8px;
  line-height: 1.7;
}
.rest {
  font-size: 12px;
  color: var(--faint);
  text-align: center;
  margin-top: 4px;
}

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
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: none;
  }
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
.lb-close:hover {
  transform: rotate(90deg);
  background: rgba(255, 255, 255, 0.14);
}
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
.lb-nav:hover {
  background: rgba(255, 255, 255, 0.16);
  border-color: var(--primary);
}
.lb-nav.prev {
  left: 18px;
}
.lb-nav.next {
  right: 18px;
}

.lb-enter-active,
.lb-leave-active {
  transition: opacity 0.25s ease;
}
.lb-enter-from,
.lb-leave-to {
  opacity: 0;
}

@media (max-width: 860px) {
  .wall-grid {
    columns: 2;
  }
  .lightbox {
    padding: 24px 12px;
  }
  .lb-nav {
    width: 38px;
    height: 38px;
  }
  .lb-nav.prev {
    left: 8px;
  }
  .lb-nav.next {
    right: 8px;
  }
}
</style>
