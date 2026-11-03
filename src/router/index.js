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
    { path: '/', name: 'home', component: HomeView },
    { path: '/articles', name: 'articles', component: ArticlesView },
    { path: '/posts/:slug', name: 'post', component: ArticleDetailView },
    { path: '/books', name: 'books', component: BooksView },
    { path: '/calligraphy', name: 'calligraphy', component: CalligraphyView },
    { path: '/about', name: 'about', component: AboutView },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
