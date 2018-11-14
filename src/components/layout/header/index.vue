<template>
  <header id="ld-header" class="ld-header" :class="[{ 'fixed': fixed }, { 'inverse': inverse && !scroll }, { 'transparent': transparent }, { 'inherit': inherit }, { 'margin': pageTitle }, theme]" v-if="show">
    <div class="relative container header-container d-flex f-align-center">
      <div class="text-left inline-block header-left" :class="{ 'lg-hidden': !logo.pc, 'sm-hidden': !logo.mobile }" v-if="logo.show">
        <header-logo :theme="theme"></header-logo>
        <!-- <router-link to="/" class="inline-block header-logo">
          <svg class="inline-block">
            <use xlink:href="#icon-logo-image"/>
          </svg>
        </router-link> -->
        <!-- <div>
          <p></p>
        </div> -->
      </div>
      <div @click.stop="toggleHeader" id="header-mask" class="header-mask"></div>
      <div @click.stop="headerItemClick" class="v-flex lg-d-flex lg-f-align-center lg-f-justify-end header-text navbar-sidebar">
        <span class="uppercase lg-hidden header-right-item header-close-item sm-text-center">
          <span @click.stop="toggleHeader" class="ld-close-icon"></span>
          <router-link to="/" class="header-sm-logo">
            <svg class="inline-block">
              <use xlink:href="#icon-logo-image"/>
            </svg>
          </router-link>
        </span>
        <span v-if="!isMobile" class="inline-block header-right-item" data-type="link">
          <router-link to="/map">
            Map
          </router-link>
        </span>
        <span class="inline-block header-right-item" data-type="link">
          <router-link to="/market">
            Marketplace
          </router-link>
        </span>
        <span class="inline-block header-right-item" data-type="link">
          <a href="https://github.com/lordlessio/game-contracts/wiki/FAQ" target="_blank">
            FAQs
          </a>
        </span>
        <span class="inline-block header-right-item line-height-0" data-type="link">
          <a href="https://t.me/lordlessio" target="_blank">
            <svg>
              <use xlink:href="#icon-telegram"/>
            </svg>
          </a>
        </span>
        <div class="header-right-item user-item" data-type="link">
          <user-avatar
            class="user-avatar"
            :theme="theme === 'dark' ? 'light' : 'dark'"
            :showText="false"
            :leftInfo="!isMobile"/>
        </div>
      </div>
    </div>
    <div id="header-page-title" class="header-page-title sm-hidden" v-if="pageTitle">
      <div class="container text-center page-title-container">
        <p>{{ pageTitle }}</p>
        <span class="back-to-top inlin-block" @click.stop="toTop">
          <svg>
            <use xlink:href="#"/>
          </svg>
          Back to top
        </span>
      </div>
    </div>
  </header>
</template>

<script>
import { addClass, removeClass, toggleClass } from 'utils/tool'
import { scrollToTop } from 'utils/tool/animate'
import throttle from 'lodash/throttle'
import UserAvatar from '@/components/reuse/userAvatar'
import HeaderLogo from './logo'
import { checkMobileMixins } from '@/mixins'
export default {
  mixins: [ checkMobileMixins ],
  props: {

    // 显示选项
    show: {
      type: Boolean,
      default: false
    },

    // page title
    pageTitle: {
      type: String,
      default: null
    },

    // logo 显示参数
    logo: {
      type: Object,
      default: () => {
        return {
          show: true,
          mobile: true,
          pc: true
        }
      }
    },

    // position fixed
    fixed: {
      type: Boolean,
      default: false
    },

    inverse: {
      type: Boolean,
      default: false
    },

    // 是否跟随界面滚动
    scroll: {
      type: Boolean,
      default: false
    },

    // 字体颜色 inherit
    inherit: {
      type: Boolean,
      default: false
    },

    // 背景透明
    transparent: {
      type: Boolean,
      default: false
    },

    // header 主题
    theme: {
      type: String,
      default: 'dark'
    }
  },
  data: () => {
    return {
      // slideBool: false,
      // parentE: null
      // mobile: false
      headerScrollFunc: null,
      titleScrollFunc: null
    }
  },
  computed: {
    isMobile () {
      return this.$root.$children[0].isMobile
    }
  },
  components: {
    HeaderLogo,
    UserAvatar
  },
  methods: {
    toggleHeader () {
      // this.slideBool = !this.slideBool
      toggleClass('show-sidebar', document.getElementById('ld-header'))
    },
    toTop () {
      const before = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
      return scrollToTop({ before })
    },
    // destroy () {
    //   if (this.mobile && this.$el && this.$el.parentNode) {
    //     this.$el.parentNode.removeChild(this.$el)
    //   }
    // },
    headerItemClick (e) {
      const dataHref = e.target.getAttribute('data-type')
      if (dataHref && document.querySelector('.ld-header.show-sidebar')) {
        removeClass('show-sidebar', document.getElementById('ld-header'))
      }
    },
    init () {
      this.headerScroll()
      this.titleScroll()
    },
    headerScroll () {
      if (this.headerScrollFunc) document.removeEventListener('scroll', this.headerScrollFunc)
      this.headerScrollFunc = null
      if (!this.scroll || this.pageTitle) return
      let navbarInverse = false
      const func = () => {
        const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
        if (!navbarInverse && scrollTop > 50) {
          addClass('inverse', document.getElementById('ld-header'))
          navbarInverse = true
        } else if (navbarInverse && scrollTop <= 50) {
          removeClass('inverse', document.getElementById('ld-header'))
          navbarInverse = false
        }
      }
      func()

      this.headerScrollFunc = throttle(func, 300)
      document.addEventListener('scroll', throttle(func, 300))

      this.$once('hook:beforeDestroy', () => {
        document.removeEventListener('scroll', throttle(func, 300))
      })
    },

    titleScroll () {
      if (this.titleScrollFunc) document.removeEventListener('scroll', this.titleScrollFunc)
      this.titleScrollFunc = null

      if (!this.scroll || !this.pageTitle) return

      const headerHeight = document.getElementById('ld-header').offsetHeight
      let bool = true
      const func = () => {
        const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
        if (bool && scrollTop >= headerHeight) {
          bool = false
          addClass('toggle', document.getElementById('ld-header'))
        } else if (!bool && scrollTop <= headerHeight) {
          bool = true
          removeClass('toggle', document.getElementById('ld-header'))
        }
      }
      func()

      this.titleScrollFunc = func
      document.addEventListener('scroll', func)

      this.$once('hook:beforeDestroy', () => {
        document.removeEventListener('scroll', func)
      })
    }
  },
  mounted () {
    this.$nextTick(() => this.init())
  }
}
</script>

<style lang="scss" scoped>
  .ld-header {
    width: 100%;
    // overflow: hidden;
    z-index: 999;
    transition: all .3s ease;
    @include height(90px, -2);
    @include height(70px, 1, -2);
    &.toggle {
      transform: translateY(-100%);
      .header-page-title {
        padding: 21px 0 20px;
        &::before {
          transform: translate(-50%, 0) translateZ(0);
        }
      }
      .back-to-top {
        opacity: 1;
        visibility: visible;
      }
    }
    &.fixed {
      position: fixed;
      top: 0;
      left: 0;
    }
    &.dark {
      background-color: $--header-bg-color;
      color: #fff;
      // .header-logo {
      //   background-color: #fff;
      //   fill: $--text-deep-blue-color;
      //   color: $--text-deep-blue-color;
      // }
      .header-right-item {
        fill: #fff;
      }
      .header-page-title {
        border-color: $--header-bg-color;
      }
    }
    &.light {
      background-color: #fff;
      color: #555;
      // .header-logo {
      //   background-color: $--text-blue-color;
      //   fill: #fff;
      //   color: $--text-blue-color;
      // }
      .header-right-item {
        fill: $--text-blue-color;
      }
      .header-page-title {
        border-color: #fff;
      }
    }
    &.margin {
      @include margin('bottom', 90px, -2);
    }
    &.shadow {
      box-shadow: 0 2px 5px 0px rgba(0, 0, 0, .25);
    }
    &.transparent {
      background-color: transparent;
    }
    &.inherit {
      color: inherit;
    }
    &.inverse {
      background-color: $--header-bg-color;
    }
    &.show-sidebar {
      .header-container {
        overflow: visible;
        // transition-delay: 0s;
      }
      .header-logo {
        opacity: 0;
        transform: scale(.3);
      }
      .header-mask {
        opacity: 1;
        visibility: visible;
        z-index: 999;
        transition: opacity .15s ease-in, visibility 0s 0s, z-index 0s 0s;
      }
      .navbar-sidebar {
        transform: translateX(0);
        transition: transform .15s ease-in .15s, z-index 0s .15s;
        .ld-close-icon {
          opacity: 1;
          transition: opacity .15s ease-in .15s;
          &::before {
            transform: translate(-50%, -50%) rotate(135deg);
          }
          &::after {
            transform: translate(-50%, -50%) rotate(-135deg);
          }
          &::before, &::after {
            transition: transform .3s ease-in .15s;
          }
        }
      }
    }
  }
  .header-container {
    // overflow: hidden;
    transition: overflow 0s .3s;
  }
  .container {
    height: 100%;
  }

  // .header-logo {
  //   position: relative;
  //   // height: 80px;
  //   // line-height: 80px;
  //   transition: all .15s ease-out .15s;
  //   padding: 11px;
  //   width: 54px;
  //   height: 54px;
  //   border-radius: 100%;
  //   box-sizing: border-box;
  //   &::before {
  //     content: 'BETA';
  //     position: absolute;
  //     right: 0;
  //     top: 3px;
  //     font-family: $--font-TTNormsBold;
  //     font-size: 12px;
  //     padding: 3px;
  //     background-color: #fff;
  //     border-radius: 2px;
  //     box-shadow: 0 2px 5px rgba(0, 0, 0, .25);
  //     transform: scale(.75) translateX(60%);
  //   }
  //   svg {
  //     fill: inherit;
  //     width: 100%;
  //     height: 100%;
  //   }
  // }
  .header-text {
  }

  .ld-close-icon {
    display: inline-block;
    position: relative;
    width: 30px;
    height: 30px;
    background-color: inherit;
    @include padding(-1, 5px, 1);
    &::before, &::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      width: 60%;
      height: 3px;
      background-color: #2b2b2b;
      transform-origin: 50% 50%;
    }
    &::before {
      transform: translate(-50%, -50%) rotate(45deg);
    }
    &::after {
      transform: translate(-50%, -50%) rotate(-45deg);
    }
  }

  .header-right-item {
    margin-left: 25px;
    a {
      font-family: $--font-TTNormsBold;
      font-size: 18px;
      color: inherit;
      text-decoration: none;
    }
    svg {
      fill: inherit;
      width: 24px;
      height: 24px;
    }
    &.user-item {
      margin-left: 60px;
      height: 100%;
      .user-avatar {
        height: 48px;
      }
    }
  }

  .navbar-right {
    flex: 1;
    text-align: right;
    // font-weight: bold;
  }

  .header-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    @include viewport-unit('height', 100vh);
    background-color: rgba(0, 0, 0, .5);
    opacity: 0;
    visibility: hidden;
    transition: opacity .15s ease-out .15s, visibility 0s .3s, z-index 0s .3s;;
    z-index: -1;
  }

  .navbar-logo {
    line-height: 1;
    transform: scale(1);
    transform-origin: 0 30%;
    opacity: 1;
    transition: all .15s ease-in .15s;
    >img {
      width: 100%;
    }
  }

  /**
   *  header-page-title  -- begin
   */
  .header-page-title {
    margin-top: -1px;
    position: relative;
    padding: 6px 0 20px;
    background-color: inherit;
    font-size: 36px;
    font-family: $--font-TTNormsBold;
    transform: translateY(0);
    z-index: 1;
    &::before {
      content: '';
      position: absolute;
      bottom: 1px;
      left: 50%;
      width: 0;
      height: 0;
      border-top: 20px solid;
      border-left: 25px solid transparent;
      border-right: 25px solid transparent;
      border-top-color: inherit;
      transform: translate(-50%, 100%) translateZ(0);
      z-index: 1;
    }
  }

  .page-title-container {
    position: relative;
    >span {
      position: absolute;
      bottom: 0;
      right: 0;
      font-size: 16px;
      font-family: $--font-TTNormsMedium;
      letter-spacing: 0;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
      >svg {
        width: 20px;
        height: 20px;
      }
    }
  }
  .back-to-top {
    opacity: 0;
    visibility: hidden;
    transition: all .3s;
  }

  /**
   *  header-page-title  -- end
   */

  @media screen and (min-width: 769px) {
    .container {
      // line-height: 80px;
    }
  }

  @media screen and (max-width: 768px) {
    .ld-header {
      &.light {
        .ld-close-icon {
          &::before, &::after {
            background-color: #555;
          }
        }
        &.show-sidebar {
          .ld-close-icon {
            &::before, &::after {
              background-color: #fff;
            }
          }
        }
      }
      &.dark {
        .ld-close-icon {
          &::before, &::after {
            background-color: #fff;
          }
        }
      }
    }
    .ld-header {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 2299;
      // line-height: 60px;
    }
    // .header-logo {
    //   // line-height: 60px;
    //   svg {
    //     width: 54px;
    //     height: 40px;
    //   }
    // }
    .navbar-sidebar {
      margin: 0;
      position: absolute;
      top: 0;
      right: 0;
      // width: 60%;
      width: 100%;
      // @include distance('max-width', 300px, -2);
      @include viewport-unit('max-width', 100vw, 80px);
      // height: 100%;
      @include viewport-unit('height', 100vh);
      background-color: #4f53d6;
      z-index: 1000;
      transform: translateX(100%);
      transition: transform .3s ease-in-out .15s;
      // .overflow();
      .header-right-item {
        margin: 20px 0 20px 25px;
        display: block;
        font-size: 16px;
        line-height: 1.4;
        fill: #fff !important;
        color: #fff;
        >a {
          display: inline-block;
          // padding: 5px 10px;
        }
      }
      .header-close-item {
        position: relative;
        margin: 0 0 10px;
        height: 70px;
        border-bottom: 1px solid #393b7e;
      }
      .ld-close-icon {
        position: absolute;
        left: -50px;
        top: 50%;
        transform: translateY(-50%);
        &::before, &::after {
          background-color: #fff;
          transition: transform .3s ease-out 0s;
        }
        &::before {
          transform: translate(-50%, -150%) rotate(0deg);
        }
        &::after {
          transform: translate(-50%, 150%) rotate(0deg);
        }
      }
      .header-sm-logo {
        padding-top: 10px;
        svg {
          width: 54px;
          height: 40px;
          fill: #fff;
        }
      }
    }
  }
</style>
