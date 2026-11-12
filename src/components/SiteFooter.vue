<template>
  <footer class="foot mono">
    <p>
      © {{ year }} yiwen · built with vue
      <span class="sep">|</span>
      <span class="ok">●</span> all systems operational
    </p>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

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
  color: var(--green);
  text-shadow: 0 0 8px color-mix(in srgb, var(--green) 80%, transparent);
  margin-right: 4px;
}
</style>
