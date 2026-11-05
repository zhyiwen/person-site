<script setup>
import InkWall from '../components/InkWall.vue'
import { WORKS } from '../utils/works'

const works = WORKS
</script>

<template>
  <div>
    <div class="page-head" v-reveal>
      <h1><span class="mono-tag mono">$ ls</span> 作品</h1>
      <p class="sub">// 整篇临帖与日课 · 共 {{ works.length }} 张 · 点开看大图</p>
    </div>

    <InkWall :works="works" />

    <router-link to="/calligraphy" class="back mono">← 回到习字</router-link>
  </div>
</template>

<style scoped>
.back {
  display: block;
  width: fit-content;
  margin: 28px auto 0;
  font-size: 12px;
  letter-spacing: 1px;
  text-decoration: none;
  color: var(--faint);
  transition: color 0.2s ease, transform 0.2s ease;
}
.back:hover {
  color: var(--primary);
  transform: translateX(-3px);
}
</style>
