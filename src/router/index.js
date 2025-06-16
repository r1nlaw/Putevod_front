import { createRouter, createWebHistory } from 'vue-router'
import FiltersChips from '../components/FiltersChips.vue'
import Profile from '../components/Profile.vue'

const routes = [
  {
    path: '/route',
    name: 'Route',
    component: FiltersChips
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
