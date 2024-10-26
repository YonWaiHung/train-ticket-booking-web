import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import CustomerDashboard from '../views/CustomerDashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    { 
      path: "/admin-dashboard",
      name: 'adminDashboard', 
      component: AdminDashboard 
    },
    { 
      path: "/customer-dashboard", 
      name: 'customerDashboard',
      component: CustomerDashboard 
    },
  ]
})

export default router
