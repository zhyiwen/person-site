import { createRouter, createWebHashHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import ArticlesView from '../views/ArticlesView.vue'
import ArticleDetailView from '../views/ArticleDetailView.vue'
import BooksView from '../views/BooksView.vue'
import CalligraphyView from '../views/CalligraphyView.vue'
import AboutView from '../views/AboutView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { title: '首页' } },
    { path: '/articles', name: 'articles', component: ArticlesView, meta: { title: '文章' } },
    { path: '/posts/:slug', name: 'post', component: ArticleDetailView, meta: { title: null } },
    { path: '/books', name: 'books', component: BooksView, meta: { title: '书单' } },
    { path: '/calligraphy', name: 'calligraphy', component: CalligraphyView, meta: { title: '习字' } },
    { path: '/about', name: 'about', component: AboutView, meta: { title: '关于' } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

/** 每个路由独立的页面标题（SEO + 标签页可读性）；文章详情页由组件写入具体标题 */
router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} · 译文 · 个人站` : '译文 · 个人站'
})

export default router
