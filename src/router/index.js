import Vue from 'vue'
import Router from 'vue-router'
import { sync } from 'vuex-router-sync'
import store from '../store'

import { mutationTypes } from '@/store/types'
import { mobileBool } from 'utils/tool'

import Sign from '@/pages/user/sign.vue'
import Market from '@/pages/market'
import Lbs from '@/pages/lbs'

import TavernDetail from '@/pages/ldb/_detail.vue'

import Guide from '@/pages/help/guide'
import Terms from '@/pages/help/terms'
import Privacy from '@/pages/help/privacy'

import TaskDetail from '@/pages/task/_detail.vue'

import UserDetail from '@/pages/user/_detail'

import Owner from '@/pages/user/owner'
import OwnerInfo from '@/pages/user/owner/children/info'
import OwnerCandy from '@/pages/user/owner/children/candy'
import OwnerTaverns from '@/pages/user/owner/children/taverns'
import OwnerTasks from '@/pages/user/owner/children/tasks'
import OwnerAuthorization from '@/pages/user/owner/children/authorization'
import OwnerActivity from '@/pages/user/owner/children/activity'

// mobile page
import MobileMarket from '@/pages/_mobile/market'
import MobileOwnerIndex from '@/pages/_mobile/owner'
import MobileOwnerCandy from '@/pages/_mobile/owner/candy'
import MobileOwnerQuest from '@/pages/_mobile/owner/_quest'
import MobileOwnerUser from '@/pages/_mobile/owner/user'

// mobile routes
const mobileRoutes = [
  {
    path: '/market',
    name: 'mobile-marketplace',
    component: MobileMarket,
    meta: {
      title: 'Marketplace - LORDLESS',
      header: {
        show: false
      },
      footer: {
        show: false
      }
    }
  },
  {
    path: '/owner/',
    name: 'mobile-page',
    component: MobileOwnerIndex,
    children: [
      {
        path: 'candy',
        name: 'mobile-user-candy',
        component: MobileOwnerCandy,
        meta: {
          title: 'Candy - LORDLESS',
          header: {
            show: false
          },
          footer: {
            show: false
          }
        }
      },
      {
        path: 'quest/:type',
        name: 'mobile-user-quest',
        component: MobileOwnerQuest,
        meta: {
          title: 'Quest - LORDLESS',
          header: {
            show: false
          },
          footer: {
            show: false
          }
        }
      },
      {
        path: 'user',
        name: 'mobile-user-info',
        component: MobileOwnerUser,
        meta: {
          title: 'User - LORDLESS',
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
        redirect: '/market'
      }
    ]
  },
  {
    path: '*',
    name: 'other',
    redirect: '/market'
  }
]

// pc端 routes
const routes = [
  {
    path: '/market',
    name: 'Market',
    component: Market,
    meta: {
      title: 'Marketplace - LORDLESS',
      header: {
        show: true
      }
    }
  },
  {
    path: '/map',
    name: 'Lbs',
    component: Lbs,
    meta: {
      title: 'Map - LORDLESS',
      header: {
        show: false
      },
      footer: {
        show: false
      }
    }
  },
  {
    path: '/tavern/:ldbId',
    name: 'TavernDetail',
    component: TavernDetail,
    meta: {
      title: 'Tavern - LORDLESS',
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
      title: 'Quest - LORDLESS',
      header: {
        fixed: true,
        scroll: true,
        transparent: true
      }
    }
  },
  {
    path: '/guide',
    name: 'guide',
    component: Guide,
    meta: {
      title: 'Guide - LORDLESS ',
      header: {
        fixed: true,
        scroll: true,
        transparent: false
      }
    }
  },
  {
    path: '/terms',
    name: 'terms',
    component: Terms,
    meta: {
      title: 'Terms - LORDLESS ',
      header: {
        pageTitle: 'LORDLESS Term of Use',
        fixed: true,
        scroll: true,
        transparent: false
      }
    }
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: Privacy,
    meta: {
      title: 'Privacy - LORDLESS ',
      header: {
        pageTitle: 'LORDLESS Privacy policy',
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
      title: 'Sign - LORDLESS',
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
      title: 'USER - LORDLESS'
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
          title: 'Overview - LORDLESS',
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
          title: 'My Candies - LORDLESS',
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
        path: 'taverns',
        name: 'Owner-taverns',
        component: OwnerTaverns,
        meta: {
          title: 'My Taverns - LORDLESS',
          navgation: 'taverns',
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
          title: 'My Quests - LORDLESS',
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
          title: 'Authorization - LORDLESS',
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
          title: 'My Activities - LORDLESS',
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

Vue.use(Router)

const isMobile = mobileBool()
console.log('----isMobile', isMobile)

const router = new Router({
  mode: 'history',
  routes: isMobile ? mobileRoutes : routes
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

store.router = router
sync(store, router)
export default router
