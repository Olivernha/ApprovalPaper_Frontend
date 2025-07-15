import {
  createWebHistory,
  createRouter,
  type RouteLocationNormalized,
  type NavigationGuardNext,
} from 'vue-router'
import { useLoadingBar } from '@/composables/useLoadingBar'

const { start, finish, fail } = useLoadingBar()

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
    path: '/search', // This path will handle the search results
    name: 'SearchResults',
    component: () => import('../views/SearchResultsView.vue'),
  },
  {
    path: '/department/:id',
    name: 'Department',
    component: () => import('../views/ApprovalPaper.vue'),
    props: true,
    beforeEnter: (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext,
    ) => {
      const id = to.params.id
      if (id && typeof id === 'string' && isValidObjectId(id)) {
        next()
      } else {
        next({ name: 'NotFound' })
      }
    },
  },
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

// Navigation guards for loading bar
router.beforeEach((to, from, next) => {
  // Only show loading bar if we're actually changing routes
  if (to.path !== from.path) {
    start()
  }
  next()
})

router.afterEach(() => {
  finish()
})

router.onError(() => {
  fail()
})

export default router
