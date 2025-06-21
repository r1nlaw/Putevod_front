import { createRouter, createWebHistory } from 'vue-router'
import Profile from '../components/Profile.vue'
import LandmarkPage from '@/components/LandmarkPage.vue'
const routes = [
  {
    path: '/route',
    name: 'Route',
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/landmark/:name',
    name: 'LandmarkPage',
    component: LandmarkPage,
    props: true,
    meta: {
      title: 'Достопримечательность Крыма',
      description: 'Узнайте больше о достопримечательности Крыма: история, фото и маршрут на карте.'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
