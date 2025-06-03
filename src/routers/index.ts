import { createWebHistory, createRouter, type RouteLocationNormalized, type NavigationGuardNext } from 'vue-router'

const isValidObjectId = (id: string) => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/
  return objectIdRegex.test(id)
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/department/:id',
    name: 'Department',
    component: () => import('../views/ApprovalPaper.vue'),
    props: true,
    beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
      const id = to.params.id
      if (id && typeof id === 'string' && isValidObjectId(id)) {
        next()
      } else {
        next({ name: 'NotFound' })
      }
    },
  },
  // Catch all route for 404 pages
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
