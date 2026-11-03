<script setup>
import { CAT_LABEL } from '../utils/posts'

defineProps({
  post: { type: Object, required: true },
  delay: { type: Number, default: 0 },
})
</script>

<template>
  <router-link :to="`/posts/${post.slug}`" class="card item" v-reveal="delay">
    <div class="meta mono">
      <span class="chip" :class="`chip-${post.category}`">{{ CAT_LABEL[post.category] }}</span>
      <span v-for="t in post.tags" :key="t" class="tag">#{{ t }}</span>
    </div>
    <h3>{{ post.title }}</h3>
    <p class="excerpt">{{ post.excerpt }}</p>
    <div class="foot mono">
      <span class="date">{{ post.date }}</span>
      <span class="go">read →</span>
      <span class="rt">{{ post.readTime }} min</span>
    </div>
  </router-link>
</template>

<style scoped>
.item {
  padding: 22px 24px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-decoration: none;
  color: inherit;
}
.meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.tag { font-size: 12px; color: var(--faint); }
h3 { font-size: 17px; line-height: 1.55; transition: color 0.2s ease; }
.item:hover h3 { color: var(--primary); }
.excerpt {
  font-size: 14px;
  color: var(--muted);
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.foot {
  display: flex;
  align-items: center;
  gap: 12px;
  border-top: 1px dashed var(--line);
  padding-top: 12px;
  margin-top: 4px;
}
.date { font-size: 12px; color: var(--faint); }
.rt { font-size: 12px; color: var(--faint); margin-left: auto; }
.go {
  font-size: 12px;
  color: var(--primary);
  font-weight: 600;
  transition: text-shadow 0.25s ease, letter-spacing 0.25s ease;
}
.item:hover .go {
  text-shadow: 0 0 10px var(--primary);
  letter-spacing: 1px;
}
</style>
