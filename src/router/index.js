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
import OwnerCandy from '@/pages/user/children/candy'
import OwnerBuildings from '@/pages/user/children/buildings'
import OwnerTasks from '@/pages/user/children/tasks'
import OwnerAuthorization from '@/pages/user/children/authorization'
import OwnerActivity from '@/pages/user/children/activity'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/market',
      name: 'Market',
      component: Market,
      meta: {
        title: 'lordless market'
      }
    },
    {
      path: '/map',
      name: 'Lbs',
      component: Lbs,
      meta: {
        title: 'lordless map',
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
        title: 'lordless ldb detail',
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
        title: 'lordless taks detail',
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
        title: 'lordless status',
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
      component: Sign,
      meta: {
        title: 'lordless sign',
        header: {
          fixed: true,
          transparent: true
        }
      }
    },
    {
      path: '/user/:address',
      name: 'userDetail',
      component: UserDetail,
      meta: {
        title: 'lordless user detail'
      }
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
            title: 'lordless owner overview',
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
          component: OwnerCandy,
          meta: {
            title: 'lordless owner candy',
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
            title: 'lordless owner ldbs',
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
            title: 'lordless owner tasks',
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
            title: 'lordless owner authorization',
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
            title: 'lordless owner activity',
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
          redirect: '/map'
        }
      ]
    },
    {
      path: '*',
      name: 'other',
      redirect: '/map'
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

  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
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
