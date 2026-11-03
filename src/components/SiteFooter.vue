<template>
  <footer class="foot mono">
    <p>
      © 2026 yiwen · built with vue
      <span class="sep">|</span>
      <span class="ok">●</span> all systems operational
    </p>
  </footer>
</template>

<style scoped>
.foot {
  border-top: 1px solid var(--line);
  padding: 26px 24px 38px;
  text-align: center;
  color: var(--faint);
  font-size: 12px;
  transition: border-color 0.35s ease;
}
.sep { margin: 0 10px; color: var(--line); }
.ok {
  color: #34d399;
  text-shadow: 0 0 8px rgba(52, 211, 153, 0.8);
  margin-right: 4px;
}
</style>
