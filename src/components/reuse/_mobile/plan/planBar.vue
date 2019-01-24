<template>
  <section class="lordless-plan-bar" :class="{ 'is-hide': tabBarHide }">
    <!-- <mobile-nav-bar :text="navigations[activeIndex].navbarText" :scroll="navigations[activeIndex].scroll"/> -->
    <ul class="d-flex plan-bar-ul">
      <li v-for="(item, index) of navigations" :key="index"
        class="v-flex text-center plan-bar-item" :class="{ 'is-active': item.active }"
        :data-active="item.active.toString()" :data-index="index"
        @click.stop="chooseBar">
        <p class="d-inline-flex col-flex f-auto-center">
          <span class="inline-block line-height-0 plan-bar-icon">
            <svg>
              <use :xlink:href="`${item.active ? item.activeIcon : item.icon}`"/>
            </svg>
          </span>
          <span class="inline-block text-cap plan-bar-name">{{ item.name }}</span>
        </p>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'mobile-plan-bar',
  data: () => {
    return {
      tabBarHide: false,
      // activeText: 'Marketplace',
      activeIndex: 0,
      navigations: [
        {
          icon: '#icon-sprout',
          activeIcon: '#icon-sprout',
          name: 'LESS deposit',
          route: '/owner/hops',
          // match: /\/(home|project)/,
          match: /^\/owner\/hops/,
          active: true
        },
        {
          icon: '#coin-hops',
          activeIcon: '#coin-hops',
          name: 'My deposits',
          route: '/owner/deposits',
          match: /^\/owner\/deposits/,
          active: false
        },
        {
          icon: '#icon-tab-quest_unselected',
          activeIcon: '#icon-tab-quest_selected',
          name: 'Records',
          route: '/owner/plan/records',
          match: /^\/owner\/plan\/records/,
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
    // ...mapMutations('layout', [
    //   mutationTypes.LAYOUT_SET_POP_DIRECTION
    // ]),

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
      // this[mutationTypes.LAYOUT_SET_POP_DIRECTION](direction)
      sessionStorage.setItem('lordless_direction', direction)

      this.$nextTick(() => this.$router.push(routePath))
      // scrollToTop()
    },

    rewriteNavigation (route = '/owner/hops', navigations = this.navigations) {
      let isHide = true
      this.navigations = navigations.map(item => {
        item.active = false
        if (route.match(item.match)) {
          item.active = true
          isHide = false
        }
        return item
      })
      this.tabBarHide = isHide
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
.lordless-plan-bar {
  // padding: 10px 0;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50px;
  background-color: #fff;
  box-shadow: 0 0 10px 0px #dedede;
  z-index: 100;
  transition: all .3s;
  &.is-hide {
    transform: translateY(100%);
    opacity: 0;
    visibility: hidden;
  }
}
.plan-bar-ul {
  margin-top: 8px;
  // height: 50px;
}
.plan-bar-item {
  height: initial;
  font-size: 12px;
  color: #999;
  fill: #999;
  &.is-active {
    color: #4586fc;
    fill: #4586fc;
  }
}
.plan-bar-name {
  // line-height: 12px;
  transform: scale(.84);
}
.plan-bar-icon {
  margin-bottom: 1px;
  width: 22px;
  height: 22px;
}
</style>
