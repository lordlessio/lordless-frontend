<template>
  <section class="lordless-tab-bar">
    <!-- <mobile-nav-bar :text="navigations[activeIndex].navbarText" :scroll="navigations[activeIndex].scroll"/> -->
    <ul class="d-flex tab-bar-ul" @click.stop="chooseBar">
      <li v-for="(item, index) of navigations" :key="index"
        class="v-flex text-center tab-bar-item" :class="{ 'is-active': item.active }">
        <p class="d-inline-flex col-flex f-auto-center"
          :data-active="item.active.toString()" :data-index="index">
          <span class="inline-block">
            <svg>
              <use :xlink:href="`${item.active ? item.activeIcon : item.icon}`"/>
            </svg>
          </span>
          <span class="inline-block text-cap">{{ item.name }}</span>
        </p>
      </li>
    </ul>
  </section>
</template>

<script>
// import MobileNavBar from '@/components/reuse/_mobile/navbar'
import { scrollToTop } from 'utils/tool/animate'
export default {
  name: 'mobile-tab-bar',
  data: () => {
    return {
      // activeText: 'Marketplace',
      activeIndex: 0,
      navigations: [
        {
          icon: '#icon-tab-marketplace',
          activeIcon: '#icon-tab-marketplace',
          name: 'Market',
          route: '/market',
          match: /\/market/,
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
          route: '/owner/quest',
          match: /\/owner\/quest/,
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
    getAttr (node) {
      if (!node || node.nodeName === 'BODY') return {}

      const active = node.getAttribute('data-active')
      const index = node.getAttribute('data-index')
      if (active !== null && index !== null) {
        return { active, index }
      } else return this.getAttr(node.parentNode)
    },

    chooseBar (e) {
      const { active, index } = this.getAttr(e.target)
      if (!active) return
      else if (active === 'true') {
        for (let i = 0; i < this.navigations.length; i++) {
          if (parseInt(index) === i && this.$route.path !== this.navigations[i].route) {
            this.$router.push(this.navigations[i].route)
            break
          }
        }
      } else {
        this.navigations = this.navigations.map((item, i) => {
          const obj = {}
          if (item.active) obj.active = false
          if (parseInt(index) === i) {
            this.activeIndex = index
            obj.active = true
            this.$router.push(item.route)
          }
          return Object.assign({}, item, obj)
        })
      }
      scrollToTop()
    },

    rewriteNavigation (route = '/market', navigations = this.navigations) {
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
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.36);
  z-index: 100;
}
.tab-bar-ul {
  margin-top: 5px;
  // height: 50px;
}
.tab-bar-item {
  height: initial;
  font-size: 10px;
  color: #999;
  fill: #999;
  svg {
    width: 22px;
    height: 22px;
  }
  &.is-active {
    color: #4586fc;
    fill: #4586fc;
  }
}
</style>
