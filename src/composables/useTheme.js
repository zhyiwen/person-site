import { ref, watchEffect } from 'vue'

const STORAGE_KEY = 'theme'
const theme = ref(document.documentElement.dataset.theme || 'light')

/** 切换并持久化主题 */
function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

// 主题变化时同步到 <html data-theme> 并写入 localStorage
watchEffect(() => {
  document.documentElement.dataset.theme = theme.value
  localStorage.setItem(STORAGE_KEY, theme.value)
})

export function useTheme() {
  return { theme, toggleTheme }
}
