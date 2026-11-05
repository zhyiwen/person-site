<script setup>
import { useRouter } from 'vue-router'
import { CAT_LABEL } from '../utils/posts'

defineProps({
  post: { type: Object, required: true },
  delay: { type: Number, default: 0 },
})

const router = useRouter()

/** 点标签 = 按标签筛文章（整卡是链，所以要阻止冒泡） */
function toTag(tag, e) {
  e.preventDefault()
  e.stopPropagation()
  router.push({ path: '/articles', query: { tag } })
}
</script>

<template>
  <article class="card item" v-reveal="delay">
    <div class="meta mono">
      <span class="chip" :class="`chip-${post.category}`">{{ CAT_LABEL[post.category] }}</span>
      <button v-for="t in post.tags" :key="t" class="tag" @click="toTag(t, $event)">#{{ t }}</button>
    </div>
    <h3>
      <!-- 标题上的链接用伪元素铺满整张卡片：保持整卡可点，同时让标签能单独点 -->
      <router-link :to="`/posts/${post.slug}`" class="stretch">{{ post.title }}</router-link>
    </h3>
    <p class="excerpt">{{ post.excerpt }}</p>
    <div class="foot mono">
      <span class="date">{{ post.date }}</span>
      <span class="go">read →</span>
      <span class="rt">{{ post.readTime }} min</span>
    </div>
  </article>
</template>

<style scoped>
.item {
  position: relative;
  padding: 22px 24px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-decoration: none;
  color: inherit;
}
.meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; position: relative; z-index: 1; }
.tag {
  font-family: var(--mono);
  font-size: 12px;
  color: var(--faint);
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
  transition: color 0.2s ease;
}
.tag:hover { color: var(--primary); }
h3 { font-size: 17px; line-height: 1.55; transition: color 0.2s ease; }
/* 铺满卡片的点击区 */
.stretch { text-decoration: none; color: inherit; }
.stretch::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: var(--radius);
}
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
