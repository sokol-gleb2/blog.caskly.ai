import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UploadView from '../views/UploadView.vue'
import PostView from '../views/PostView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {title: "Learn more about running a pub | Caskly Blog"}
    },
    {
      path: '/upload',
      name: 'upload',
      component: UploadView,
      meta: {title: "Caskly Blog Upload | Authorised Only"}
    },
    {
      path: '/posts/:slug',
      name: 'post',
      component: PostView,
      props: true,
      meta: {title: "Learn more about running a pub | Caskly Blog"}
    },
  ],
})

export default router
