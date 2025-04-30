import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import PeopleView from '@/views/PeopleView.vue'
import SkillsView from '@/views/SkillsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/skills',
      name: 'skills',
      component: SkillsView,
    },
        {
      path: '/people',
      name: 'people',
      component: PeopleView,
    },
  ],
})

export default router
