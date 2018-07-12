import Vue from 'vue'
import Router from 'vue-router'
import { sync } from 'vuex-router-sync'
import store from '../store'

import { mutationTypes } from '@/store/types'

import Login from '@/pages/user/login.vue'
import Market from '@/pages/market'
import Lbs from '@/pages/lbs'
import MapBox from '@/pages/mapbox'

import LdbDetail from '@/pages/ldb/_detail.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Market-index',
      component: Market
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/market',
      name: 'Market',
      component: Market
    },
    {
      path: '/lbs',
      name: 'Lbs',
      component: Lbs
    },
    {
      path: '/mapbox',
      name: 'MapBox',
      component: MapBox,
      meta: {
        header: {
          show: false
        },
        footer: {
          show: false
        }
      }
    },
    {
      path: '/ldb/:ldbId',
      name: 'ldbDetail',
      component: LdbDetail,
      meta: {
        header: {
          fixed: true,
          scroll: true,
          transparent: true
        }
      }
    },
    {
      path: '*',
      name: 'other',
      redirect: '/market'
    }
  ]
})

/**
 * router loading status
 */
router.beforeEach((to, from, next) => {
  const { header, footer } = to.meta
  console.log('header', header)
  console.log('footer', footer)
  store.commit(`layout/${mutationTypes.LAYOUT_SET_HEADER_OPTIONS}`, header)
  store.commit(`layout/${mutationTypes.LAYOUT_SET_FOOTER_OPTIONS}`, footer)
  next()
})

// google统计
router.afterEach(function (to) {
  if (window.ga) {
    window.ga('set', 'page', to.fullPath) // 你可能想根据请求参数添加其他参数，可以修改这里的 to.fullPath
    window.ga('send', 'pageview')
  }
})

store.router = router
sync(store, router)
export default router
