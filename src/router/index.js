import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld.vue'
import Login from '@/pages/user/login.vue'
import Market from '@/pages/market'
import Lbs from '@/pages/lbs'

import LdbDetail from '@/pages/ldb/_detail.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
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
      path: '/ldb',
      name: 'Ldb',
      children: [
        {
          path: ':ldbId',
          name: 'ldbDetail',
          component: LdbDetail
        }
      ]
    },
    {
      path: '*',
      name: 'other',
      redirect: '/market'
    }
  ]
})
