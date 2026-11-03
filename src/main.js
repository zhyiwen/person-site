import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)

/**
 * v-reveal 自定义指令：元素进入视口时上浮淡入
 * 用法：<div v-reveal> 或 <div v-reveal="200">（延迟 ms，做交错动画）
 */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.12 },
)

app.directive('reveal', {
  mounted(el, binding) {
    const delay = binding.value || 0

    // 已在首屏内的元素：保留入场动画，但加兜底，避免任何环境下卡在透明状态
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight) {
      el.classList.add('reveal')
      el.style.transitionDelay = `${delay}ms`
      const show = () => el.classList.add('is-visible')
      requestAnimationFrame(() => requestAnimationFrame(show))
      setTimeout(show, 400) // 兜底
      return
    }

    // 首屏之外：进入视口时上浮淡入
    el.classList.add('reveal')
    if (delay) el.style.transitionDelay = `${delay}ms`
    observer.observe(el)
  },
  unmounted(el) {
    observer.unobserve(el)
  },
})

app.use(router)
app.mount('#app')
