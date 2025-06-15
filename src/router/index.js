import { createRouter, createWebHistory } from 'vue-router'
import FiltersChips from '../components/FiltersChips.vue'
const routes = [
    {
      path: '/route',
      name: 'Route',
      component: FiltersChips
    },
  ]
  

const router = createRouter({
  history: createWebHistory(), 
  routes
})

export default router
