import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import CustomerDashboard from '../views/CustomerDashboard.vue'
import TrainBookingForm from '@/components/TrainBookingForm.vue'
import TrainList from '@/components/TrainList.vue'
import BookingSummary from '@/components/BookingSummary.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // },
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
    {
      path: '/train-list',
      component: TrainList,
      props: (route) => ({
        origin: route.query.origin,
        destination: route.query.destination,
        departureDate: route.query.departureDate,
      }),
    },
    {
      path: '/booking-summary',
      name: 'bookingSummary',
      component: BookingSummary,
      props: (route) => ({
        bookingDetails: route.query.bookingDetails ? JSON.parse(route.query.bookingDetails) : {},
      }),
    },
  ]
})

export default router
