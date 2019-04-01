<template>
  <div class="relative d-flex f-align-center tabs-navbar-box" :class="{ 'is-fixed': fixed }">
    <span class="inline-block line-height-0 tabs-nav-history" v-if="history" @click.stop="$emit('history')">
      <svg>
        <use xlink:href="#icon-back"/>
      </svg>
    </span>
    <div
      ref="navbar-tabs-cnt"
      class="v-flex d-flex f-align-center text-center navbar-tabs-cnt"
      @click.stop="chooseTab">
      <span ref="tabs-navbar-bar" class="inline-block tabs-navbar-active-bar"></span>
      <div
        v-for="(item, index) of tabs" :key="index"
        :data-name="item.name"
        class="TTFontBolder tabs-navbar-item">
        <span class="inline-block">{{ item.label }}</span>
      </div>
    </div>
    <span v-if="rightIcon" class="inline-block line-height-0 tab-right-icon" @click.stop="rightPath ? $router.push(rightPath) : null">
      <svg>
        <use :xlink:href="rightIcon"/>
      </svg>
    </span>
  </div>
</template>

<script>
export default {
  name: 'lordless-tabs-navbar',
  props: {
    // container: {
    //   type: String,
    //   default: `mobile-tabs-nav-${new Date().getTime()}`
    // },
    originTab: {
      type: String,
      default: null
    },
    tabs: {
      type: Array,
      default: () => []
    },
    history: {
      type: Boolean,
      default: false
    },
    fixed: {
      type: Boolean,
      default: true
    },
    rightIcon: {
      type: String,
      default: null
    },
    rightPath: {
      type: String,
      default: null
    }
  },
  data: (vm) => {
    return {
      rendered: false,
      currentTab: vm.originTab || vm.tabs[0].name
    }
  },
  watch: {
    originTab (val) {
      val && this.changeTab(val)
    }
  },
  methods: {
    getAttr (node) {
      if (!node || node.nodeName === 'BODY') return {}

      const name = node.getAttribute('data-name')
      if (name !== null) {
        return { name }
      } else return this.getAttr(node.parentNode)
    },

    chooseTab (e) {
      const { name } = this.getAttr(e.target)
      if (!name || name === this.currentTab) return
      this.changeTab(name)
    },

    // 改变 tabs 处理事件
    changeTab (currentTab = this.currentTab) {
      const tabChildrens = document.querySelectorAll('.tabs-navbar-item')
      if (!tabChildrens.length) return

      const activeBar = this.$refs['tabs-navbar-bar']
      for (const item of tabChildrens) {
        const name = item.getAttribute('data-name')
        if (name === currentTab) {
          const nodeLeft = item.offsetLeft
          // const nodeWidth = item.offsetWidth
          const textWidth = item.firstChild.offsetWidth
          activeBar.style = `width: 32px;left: ${nodeLeft + textWidth / 2 - 16}px;`
          break
        }
      }
      this.currentTab = currentTab
      this.$emit('changeTab', currentTab)
    },

    // 初始化 tabs navbar
    init () {
      if (!this.$el) return
      if (!this.fixed) {
        this.changeTab()
        return
      }
      document.body.appendChild(this.$el)

      if (!this.rendered) this.rendered = true
      this.changeTab()

      this.$once('hook:beforeDestroy', () => {
        console.log('-------- beforeDestroy tabs navbar destroy')
        this.$el && this.$el.parentNode && this.$el.parentNode.removeChild(this.$el)
      })
      this.$once('hook:deactivated', () => {
        console.log('-------- deactivated tabs navbar destroy', parent, this.$el)
        this.$el && this.$el.parentNode && this.$el.parentNode.removeChild(this.$el)
      })
    }
  },
  activated () {
    if (!this.rendered) return
    this.init()
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="scss" scoped>

  /**
   *  tabs-navbar-box -- begin
   */
  .tabs-navbar-box {
    // margin-bottom: 1px;
    width: 100%;
    height: 44px;
    background-color: $--navbar-blue-color;
    border-bottom: 1px solid $--navbar-border-color;
    box-sizing: border-box;
    &.is-fixed {
      position: fixed;
      top: 0;
      left: 0;
    }
  }
  .tabs-nav-history {
    margin-left: 12px;
    padding: 8px;
    width: 34px;
    height: 34px;
    fill: #fff;
    box-sizing: border-box;
  }
  .navbar-tabs-cnt {
    padding: 0 20px;
  }
  .tabs-navbar-item {
    font-size: 16px;
    color: #fff;
    &:not(:first-of-type) {
      margin-left: 24px;
    }
  }
  .tabs-navbar-active-bar {
    position: absolute;
    bottom: -0.5px;
    width: 0;
    height: 6px;
    background-color: #FFCC66;
    transition: left .15s;
  }
  .tab-right-icon {
    margin-right: 20px;
    width: 24px;
    height: 24px;
    fill: #fff;
  }
  /**
   *  tabs-navbar-box -- end
   */
</style>
