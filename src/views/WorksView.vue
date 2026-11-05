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
  </div>
</template>
