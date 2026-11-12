<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

/**
 * 打字机效果组件：逐字打出 lines 中的每一行
 */
const props = defineProps({
  lines: { type: Array, required: true },
  /** 首屏信息不该被动画扣住 10 秒：28ms/字 + 行间 ×2，8 行约 4s 内打完 */
  speed: { type: Number, default: 28 },
  startDelay: { type: Number, default: 350 },
  linePauseMul: { type: Number, default: 2 },
})

const text = ref('')
let timer = null
let li = 0
let ci = 0

/** 用户声明减少动效（或系统级设置）时跳过打字，直接全量渲染 */
function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

function step() {
  const line = props.lines[li]
  if (ci < line.length) {
    text.value += line[ci++]
    timer = setTimeout(step, props.speed)
  } else if (li < props.lines.length - 1) {
    text.value += '\n'
    li++
    ci = 0
    timer = setTimeout(step, props.speed * props.linePauseMul)
  }
}

onMounted(() => {
  if (prefersReducedMotion()) {
    text.value = props.lines.join('\n')
    return
  }
  timer = setTimeout(step, props.startDelay)
})
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <pre class="type mono">{{ text }}<span class="cursor">▊</span></pre>
</template>

<style scoped>
.type {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.9;
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--text);
}
.cursor {
  color: var(--primary);
  animation: blink 1s steps(1) infinite;
  margin-left: 2px;
}
@keyframes blink {
  50% { opacity: 0; }
}
</style>
