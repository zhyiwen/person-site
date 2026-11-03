<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

/**
 * 打字机效果组件：逐字打出 lines 中的每一行
 */
const props = defineProps({
  lines: { type: Array, required: true },
  speed: { type: Number, default: 50 },
  startDelay: { type: Number, default: 350 },
})

const text = ref('')
let timer = null
let li = 0
let ci = 0

function step() {
  const line = props.lines[li]
  if (ci < line.length) {
    text.value += line[ci++]
    timer = setTimeout(step, props.speed)
  } else if (li < props.lines.length - 1) {
    text.value += '\n'
    li++
    ci = 0
    timer = setTimeout(step, props.speed * 5)
  }
}

onMounted(() => {
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
