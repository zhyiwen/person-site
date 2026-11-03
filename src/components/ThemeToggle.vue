<script setup>
import { useTheme } from '../composables/useTheme'

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <button
    class="toggle"
    :aria-label="theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'"
    @click="toggleTheme"
  >
    <span class="track" :class="{ dark: theme === 'dark' }">
      <!-- 太阳 -->
      <svg class="icon sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <circle cx="12" cy="12" r="4.5" />
        <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5 5l1.4 1.4M17.6 17.6L19 19M19 5l-1.4 1.4M6.4 17.6L5 19" />
      </svg>
      <!-- 月亮 -->
      <svg class="icon moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />
      </svg>
      <span class="knob"></span>
    </span>
  </button>
</template>

<style scoped>
.toggle {
  border: none;
  background: none;
  cursor: pointer;
  padding: 4px;
}
.track {
  position: relative;
  display: flex;
  align-items: center;
  width: 62px;
  height: 30px;
  border-radius: 999px;
  background: var(--surface-2);
  border: 1px solid var(--line);
  transition: background-color 0.35s ease, border-color 0.35s ease;
  overflow: hidden;
}
.icon {
  width: 14px;
  height: 14px;
  position: absolute;
  top: 50%;
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.25s ease;
}
.sun {
  left: 8px;
  color: var(--sand);
  transform: translateY(-50%) rotate(0deg);
  opacity: 1;
}
.moon {
  right: 8px;
  color: var(--stone);
  transform: translateY(-50%) rotate(-90deg);
  opacity: 1;
}
.track.dark .sun { transform: translateY(-50%) rotate(90deg); opacity: 0.35; }
.track.dark .moon { transform: translateY(-50%) rotate(0deg); }
.knob {
  position: absolute;
  left: 4px;
  top: 50%;
  transform: translateY(-50%);
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--primary);
  box-shadow: var(--shadow-sm);
  transition: left 0.35s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.35s ease;
}
.track.dark .knob { left: 34px; }
</style>
