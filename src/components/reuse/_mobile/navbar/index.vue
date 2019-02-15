<template>
  <section :ref="container" id="mobile-nav-bar" class="TTFontBolder text-center mobile-nav-bar" :class="[scrollDefaultTheme, { 'is-history': history, 'is-static': !fixed, 'is-active': fixed && !scroll, 'transparent': transparent, 'blur': blurs[0] }]">
    <div class="relative" @click.stop="withdrawTip = false">
      <p class="TTFontBolder nav-history-icon line-height-0" v-if="history" @click.stop="$emit('history')">
        <svg>
          <use xlink:href="#icon-back"/>
        </svg>
      </p>
      <p class="text-cap mobile-navbar-text">
        <span class="text-ellipsis inline-block">{{ text }}</span>
      </p>
      <div v-if="rightIcon" class="d-inline-flex f-auto-center nav-right-box nav-right-icon-box" @click.stop="rightPath ? $router.push(rightPath) : null">
        <span class="inline-block line-height-0 navbar-right-icon">
          <svg>
            <use :xlink:href="rightIcon"/>
          </svg>
        </span>
      </div>
      <div v-if="userAvatar && userInfo._id" class="TTFontBold d-flex f-align-center nav-right-box navbar-header-tip">
        <span class="inline-block line-height-0 navbar-tip-icon">
          <svg>
            <use xlink:href="#icon-color-star"/>
          </svg>
        </span>
        <span class="inline-block">AP&nbsp;&nbsp;{{ userInfo.ap }}</span>
      </div>
      <!-- <p class="relative line-height-0 nav-right-box nav-withdraw-box" v-if="withdraw">
        <span class="inline-block line-height-0 nav-withdraw-icon">
          <svg>
            <use xlink:href="#icon-withdraw"/>
          </svg>
        </span>
      </p> -->
    </div>
  </section>
</template>

<script>
import { addClass, removeClass } from 'utils/tool'
import { userMixins } from '@/mixins'

import { mapState } from 'vuex'
export default {
  name: 'mobile-nav-bar',
  mixins: [userMixins],
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
    rightIcon: {
      type: String,
      default: null
    },
    rightPath: {
      type: String,
      default: null
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
      rendered: false,
      navbarScrollFunc: null
      // withdrawTip: false
    }
  },
  computed: {
    ...mapState('layout', [
      'blurs'
    ])
  },
  // watch: {
  //   withdrawTip (val) {
  //     if (val) {
  //       setTimeout(() => {
  //         this.withdrawTip = false
  //       }, 1500)
  //     }
  //   }
  // },
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

      console.log('navbar ------ scroll')

      this.$nextTick(() => document.addEventListener('scroll', this.navbarScrollFunc))
    },
    init () {
      console.log(' ---- navbar init', this.scroll, this.fixed)
      this.$nextTick(() => {
        console.log('navbar ------ init')
        if (!this.rendered) this.rendered = true

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
    if (!this.rendered) return
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
    background-color: #0079FF;
    font-size: 16px;
    color: #fff;
    &.scroll-hidden {
      opacity: 0;
      z-index: -99;
    }
    &.is-history {
      padding-top: 12px;
      transition: padding-top .3s;
      &.is-active, .is-static {
        padding-top: 0px;
      }
    }
    &.transparent {
      color: transparent;
      background-color: transparent;
      .nav-history-icon {
        fill: #fff;
      }
    }
    &.is-active, .is-static {
      opacity: 1;
      z-index: 99;
      color: #fff;
      background-color: #0079FF;
      .nav-history-icon {
        width: 18px;
        fill: #fff;
        background-color: transparent;
      }
      .navbar-header-tip {
        background-image: none;
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
    padding: 9px 0;
    position: absolute;
    left: 20px;
    top: 50%;
    width: 36px;
    height: 36px;
    fill: #fff;
    background-color: #777;
    transform: translateY(-50%);
    box-sizing: border-box;
    border-radius: 100%;
  }
  .mobile-navbar-text {
    font-weight: bold;
    height: 44px;
    // font-size: 16px;
    >span {
      max-width: 128px;
    }
  }
  .nav-right-box {
    position: absolute;
    right: 20px;
    top: 55%;
    transform: translateY(-50%);
  }
  .nav-right-icon-box {

  }
  .navbar-right-icon {
    width: 18px;
    height: 18px;
    fill: #fff;
  }
  // .nav-withdraw-box {
  //   @include TTFontBold();
  //   &::before {
  //     content: 'Coming soon';
  //     position: absolute;
  //     left: -10px;
  //     top: -3px;
  //     padding: 3px 8px;
  //     min-width: 80px;
  //     text-align: center;
  //     height: 25px;
  //     line-height: 25px;
  //     font-size: 12px;
  //     background-color: #303133;
  //     transform: translateX(-100%);
  //     border-radius: 5px;
  //     opacity: 0;
  //     visibility: hidden;
  //     transition: all .15s;
  //   }
  //   &::after {
  //     content: '';
  //     position: absolute;
  //     top: 8px;
  //     left: -10px;
  //     border-top: 5px solid transparent;
  //     border-bottom: 5px solid transparent;
  //     border-left: 5px solid #303133;
  //     opacity: 0;
  //     visibility: hidden;
  //     transition: all .15s;
  //   }
  //   &.show-tip {
  //     &::before, &::after {
  //       opacity: 1;
  //       visibility: visible;
  //     }
  //   }
  // }
  .nav-withdraw-icon {
    width: 22px;
    height: 22px;
    fill: #fff;
  }
  .navbar-header-tip {
    right: 10px;
    padding: 0 10px;
    height: 35px;
    line-height: 35px;
    color: #fff;
    background: linear-gradient(-225deg, #124BDC 0%, #0079FF 100%);
    border-radius: 5px;
  }
  .navbar-tip-icon {
    margin-right: 5px;
    width: 16px;
    height: 16px;
  }
</style>
