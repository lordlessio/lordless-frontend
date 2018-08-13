import Vue from 'vue'
import Router from 'vue-router'
import { sync } from 'vuex-router-sync'
import store from '../store'

import { mutationTypes } from '@/store/types'

import Sign from '@/pages/user/sign.vue'
import Market from '@/pages/market'
import Lbs from '@/pages/lbs'

import LdbDetail from '@/pages/ldb/_detail.vue'

import Status from '@/pages/help/status'

import TaskDetail from '@/pages/task/_detail.vue'

import UserDetail from '@/pages/user/_detail'

import Owner from '@/pages/user'
import OwnerInfo from '@/pages/user/children/info'
import OwnerCandies from '@/pages/user/children/candies'
import OwnerBuildings from '@/pages/user/children/buildings'
import OwnerTasks from '@/pages/user/children/tasks'
import OwnerAuthorization from '@/pages/user/children/authorization'
import OwnerActivity from '@/pages/user/children/activity'

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
      path: '/market',
      name: 'Market',
      component: Market
    },
    {
      path: '/lbs',
      name: 'Lbs',
      component: Lbs,
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
      path: '/task/:taskId',
      name: 'taskDetail',
      component: TaskDetail,
      meta: {
        header: {
          fixed: true,
          scroll: true,
          transparent: true
        }
      }
    },
    {
      path: '/status',
      name: 'status',
      component: Status,
      meta: {
        header: {
          fixed: true,
          scroll: true,
          transparent: false
        }
      }
    },
    {
      path: '/sign',
      name: 'lordless-sign',
      component: Sign
    },
    {
      path: '/user/:address',
      name: 'userDetail',
      component: UserDetail
    },
    {
      path: '/owner',
      name: 'owner',
      component: Owner,
      children: [
        {
          path: 'info',
          name: 'OwnerInfo',
          component: OwnerInfo,
          meta: {
            navgation: 'overview',
            header: {
              show: false
            },
            footer: {
              show: false
            }
          }
        },
        {
          path: 'candy',
          name: 'Owner-candy',
          component: OwnerCandies,
          meta: {
            navgation: 'candy',
            header: {
              show: false
            },
            footer: {
              show: false
            }
          }
        },
        {
          path: 'ldb',
          name: 'Owner-ldbs',
          component: OwnerBuildings,
          meta: {
            navgation: 'ldb',
            header: {
              show: false
            },
            footer: {
              show: false
            }
          }
        },
        {
          path: 'tasks',
          name: 'Owner-tasks',
          component: OwnerTasks,
          meta: {
            navgation: 'tasks',
            header: {
              show: false
            },
            footer: {
              show: false
            }
          }
        },
        {
          path: 'authorization',
          name: 'Owner-authorization',
          component: OwnerAuthorization,
          meta: {
            navgation: 'authorization',
            header: {
              show: false
            },
            footer: {
              show: false
            }
          }
        },
        {
          path: 'activity',
          name: 'Owner-activity',
          component: OwnerActivity,
          meta: {
            navgation: 'activity',
            header: {
              show: false
            },
            footer: {
              show: false
            }
          }
        },
        {
          path: '*',
          redirect: '/info'
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

/**
 * router loading status
 */
router.beforeEach((to, from, next) => {
  const { header, footer } = to.meta
  store.commit(`layout/${mutationTypes.LAYOUT_SET_HEADER_OPTIONS}`, header)
  store.commit(`layout/${mutationTypes.LAYOUT_SET_FOOTER_OPTIONS}`, footer)
  store.commit(`layout/${mutationTypes.LAYOUT_SET_BLURS}`, 0)
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
