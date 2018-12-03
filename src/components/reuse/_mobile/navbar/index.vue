<template>
  <section :ref="container" id="mobile-nav-bar" class="TTFontBolder text-center mobile-nav-bar" :class="[scrollDefaultTheme, { 'is-static': !fixed, 'is-active': fixed && !scroll, 'transparent': transparent }]">
    <div class="relative">
      <p class="TTFontBolder nav-history-icon line-height-0" v-if="history" @click.stop="$emit('history')">
        <svg>
          <use xlink:href="#icon-back"/>
        </svg>
      </p>
      <p class="text-cap">{{ text }}</p>
      <div v-if="userAvatar" class="nav-right-box navbar-header-tip">
        <lordless-blockies
          class="user-avatar-poster"
          radius="5px"
          seed="userInfo.address"
          :scale="5"
          theme="dark"/>
      </div>
      <p class="line-height-0 nav-right-box nav-withdraw" v-if="withdraw" @click.stop="withdrawTip = true">
        <el-tooltip v-model="withdrawTip" effect="dark" content="Coming soon" placement="left" :hide-after="3000">
          <span class="inline-block line-height-0 nav-withdraw-icon">
            <svg>
              <use xlink:href="#icon-withdraw"/>
            </svg>
          </span>
        </el-tooltip>
      </p>
    </div>
  </section>
</template>

<script>
import { addClass, removeClass } from 'utils/tool'
export default {
  name: 'mobile-nav-bar',
  props: {
    container: {
      type: String,
      default: `mobile-nav-${new Date().getTime()}`
    },
    text: {
      type: String,
      default: 'Marketplace'
    },
    history: {
      type: Boolean,
      default: false
    },
    withdraw: {
      type: Boolean,
      default: false
    },
    userAvatar: {
      type: Boolean,
      default: false
    },
    transparent: {
      type: Boolean,
      default: false
    },
    fixed: {
      type: Boolean,
      default: true
    },

    // scroll-hidden
    scrollDefaultTheme: {
      type: String,
      default: null
    },
    scroll: {
      type: Boolean,
      default: false
    },
    scrollMark: {
      type: Number,
      default: 150
    }
  },
  data: () => {
    return {
      navbarScrollFunc: null,
      withdrawTip: false
    }
  },
  methods: {
    scrollListener () {
      if (this.navbarScrollFunc) this.destroyScroll()
      // if (!this.scroll || this.pageTitle) return
      let navbarInverse = false
      const dom = this.$refs[this.container]
      const scrollMark = this.scrollMark
      const func = () => {
        const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
        if (!navbarInverse && scrollTop >= scrollMark) {
          addClass('is-active', dom)
          navbarInverse = true
        } else if (navbarInverse && scrollTop < scrollMark) {
          removeClass('is-active', dom)
          navbarInverse = false
        }
      }
      func()

      this.navbarScrollFunc = func

      this.$nextTick(() => document.addEventListener('scroll', this.navbarScrollFunc))
    },
    init () {
      console.log(' ---- navbar init', this.scroll, this.fixed)
      this.$nextTick(() => {
        if (this.scroll || this.fixed) {
          document.body.appendChild(this.$el)
          this.scroll && this.scrollListener()
        }
      })
    },
    destroyScroll () {
      this.scroll && removeClass('is-active', this.$refs[this.container])
      document.removeEventListener('scroll', this.navbarScrollFunc)
      this.navbarScrollFunc = null
    },
    destroy () {
      this.destroyScroll()
      this.$el && this.$el.parentNode && this.$el.parentNode.removeChild(this.$el)
    }
  },
  deactivated () {
    this.destroy()
  },
  activated () {
    this.init()
  },
  beforeDestroy () {
    this.destroy()
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
  .mobile-nav-bar {
    // padding: 12px 0;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 44px;
    line-height: 44px;
    background-color: #4586fc;
    font-size: 20px;
    color: #fff;
    &.scroll-hidden {
      opacity: 0;
      z-index: -99;
    }
    &.transparent {
      color: transparent;
      background-color: transparent;
      .nav-history-icon {
        fill: #999;
      }
    }
    &.is-active, .is-static {
      opacity: 1;
      z-index: 99;
      color: #fff;
      background-color: #4586fc;
      .nav-history-icon {
        fill: #fff;
      }
    }
    &.is-active {
      // opacity: 1;
      // z-index: 99;
      // color: #fff;
      // background-color: #4586fc;
    }
    &.is-static {
      position: static;
      // opacity: 1;
      // z-index: 99;
      // color: #fff;
      // background-color: #4586fc;
    }
  }
  .nav-history-icon {
    position: absolute;
    left: 20px;
    top: 50%;
    width: 18px;
    height: 18px;
    fill: #fff;
    transform: translateY(-50%);
  }
  .nav-right-box {
    position: absolute;
    right: 20px;
    top: 55%;
    transform: translateY(-50%);
  }
  .nav-withdraw-icon {
    width: 22px;
    height: 22px;
    fill: #fff;
  }
  .navbar-header-tip {
    height: 44px;
  }
</style>
