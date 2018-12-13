<template>
  <section class="lordless-tab-bar">
    <!-- <mobile-nav-bar :text="navigations[activeIndex].navbarText" :scroll="navigations[activeIndex].scroll"/> -->
    <ul class="d-flex tab-bar-ul">
      <li v-for="(item, index) of navigations" :key="index"
        class="v-flex text-center tab-bar-item" :class="{ 'is-active': item.active, 'is-home': item.name === 'Home' }"
        :data-active="item.active.toString()" :data-index="index"
        @click.stop="chooseBar">
        <p class="d-inline-flex col-flex f-auto-center">
          <span class="inline-block line-height-0 tab-bar-icon">
            <svg>
              <use :xlink:href="`${item.active ? item.activeIcon : item.icon}`"/>
            </svg>
          </span>
          <span class="inline-block text-cap tab-bar-name">{{ item.name }}</span>
        </p>
      </li>
    </ul>
  </section>
</template>

<script>
// import MobileNavBar from '@/components/reuse/_mobile/navbar'
// import { scrollToTop } from 'utils/tool/animate'
import { mutationTypes } from '@/store/types'
import { mapMutations } from 'vuex'
export default {
  name: 'mobile-tab-bar',
  data: () => {
    return {
      // activeText: 'Marketplace',
      activeIndex: 0,
      navigations: [
        {
          icon: '#icon-logo-image',
          activeIcon: '#icon-logo-image',
          name: 'Home',
          route: '/home',
          match: /\/(home|project)/,
          active: true
        },
        {
          icon: '#icon-beer',
          activeIcon: '#icon-beer',
          name: 'Taverns',
          route: '/taverns',
          match: /\/taverns/,
          active: true
        },
        {
          icon: '#icon-tab-candy_unselected',
          activeIcon: '#icon-tab-candy_selected',
          name: 'Candies',
          route: '/owner/candy',
          match: /\/owner\/candy/,
          active: false
        },
        {
          icon: '#icon-tab-quest',
          activeIcon: '#icon-tab-quest',
          name: 'Quests',
          route: '/owner/quests',
          match: /\/owner\/quests/,
          active: false
        },
        {
          icon: '#icon-tab-user_unselected',
          activeIcon: '#icon-tab-user_selected',
          name: 'Me',
          route: '/owner/info',
          match: /\/owner\/(info|activities|taverns|authorization|general)/,
          active: false
        }
      ]
    }
  },
  watch: {
    '$route' (route) {
      this.rewriteNavigation(route.path)
    }
  },
  methods: {
    ...mapMutations('layout', [
      mutationTypes.LAYOUT_SET_POP_DIRECTION
    ]),

    getAttr (node) {
      if (!node || node.nodeName === 'BODY') return {}

      const active = node.getAttribute('data-active')
      const index = node.getAttribute('data-index')
      if (active !== null && index !== null) {
        return { active, index }
      } else return this.getAttr(node.parentNode)
    },

    /**
     * choose bar 委托事件
     */
    chooseBar (e) {
      const { active, index } = this.getAttr(e.target)

      let fromIndex = 0
      let toIndex = index

      let routePath = ''

      if (!active) return false
      else if (active === 'true') {
        for (let i = 0; i < this.navigations.length; i++) {
          if (parseInt(index) === i && this.$route.path !== this.navigations[i].route) {
            // this.$router.push(this.navigations[i].route)
            routePath = this.navigations[i].route
            break
          }
        }
      } else {
        this.navigations = this.navigations.map((item, i) => {
          const obj = {}
          if (item.active) {
            obj.active = false
            fromIndex = i
          }
          if (parseInt(index) === i) {
            toIndex = i
            this.activeIndex = index
            obj.active = true
            routePath = item.route
            // this.$router.push(item.route)
          }
          return Object.assign({}, item, obj)
        })
      }

      let direction = '_forward'
      if (toIndex < fromIndex) direction = '_reverse'
      this[mutationTypes.LAYOUT_SET_POP_DIRECTION](direction)

      this.$nextTick(() => this.$router.push(routePath))
      // scrollToTop()
    },

    rewriteNavigation (route = '/home', navigations = this.navigations) {
      this.navigations = navigations.map(item => {
        item.active = false
        if (route.match(item.match)) {
          item.active = true
        }
        return item
      })
    }
  },
  mounted () {
    document.body.appendChild(this.$el)
    this.$nextTick(() => {
      const route = this.$route.path
      this.rewriteNavigation(route)
    })
  }
}
</script>

<style lang="scss" scoped>
.lordless-tab-bar {
  // padding: 10px 0;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50px;
  background-color: #fff;
  box-shadow: 0 0 10px 0px #dedede;
  z-index: 100;
}
.tab-bar-ul {
  margin-top: 8px;
  // height: 50px;
}
.tab-bar-item {
  height: initial;
  font-size: 12px;
  color: #999;
  fill: #999;
  &.is-active {
    color: #4586fc;
    fill: #4586fc;
  }
  &.is-home {
    .tab-bar-icon {
      padding: 4px;
      border-radius: 100%;
      background-color: #999;
      fill: #fff;
      box-sizing: border-box;
    }
    &.is-active {
      .tab-bar-icon {
        background-color: #4586fc;
      }
    }
  }
}
.tab-bar-name {
  // line-height: 12px;
  transform: scale(.84);
}
.tab-bar-icon {
  margin-bottom: 1px;
  width: 22px;
  height: 22px;
}
</style>
