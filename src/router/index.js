import { createRouter, createWebHistory } from 'vue-router'
import Profile from '../components/Profile.vue'
import LandmarkPage from '@/components/LandmarkPage.vue'
import Route from '@/components/Route.vue'
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
    path: '/landmarks/:name',
    name: 'LandmarkPage',
    component: LandmarkPage,
    props: true,
    meta: {
      title: 'Достопримечательность Крыма',
      description: 'Узнайте больше о достопримечательности Крыма: история, фото и маршрут на карте.'
    }
  },
  {
    path: '/routeList',
    name: 'RouteList',
    component: Route
  }
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
