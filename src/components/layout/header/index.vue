<template>
  <header id="ld-header" class="ld-header" :class="[{ 'fixed': fixed }, { 'inverse': inverse && !scroll }, { 'transparent': transparent }, { 'inherit': inherit }, theme]" v-if="show">
    <div class="container d-flex f-align-center">
      <div class="text-left inline-block header-left" v-if="showLogo">
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
        <span class="inline-block header-right-item" data-type="link">
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
        <div class="header-right-item user-item sm-hidden" data-type="link">
          <user-avatar class="user-avatar" :theme="theme === 'dark' ? 'light' : 'dark'" :showText="false"></user-avatar>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { addClass, removeClass, toggleClass } from 'utils/tool'
import throttle from 'lodash/throttle'
import UserAvatar from '@/components/reuse/userAvatar'
import HeaderLogo from './logo'
export default {
  props: {

    // 显示选项
    show: {
      type: Boolean,
      default: false
    },

    // logo 显示参数
    showLogo: {
      type: Boolean,
      default: true
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
  components: {
    HeaderLogo,
    UserAvatar
  },
  methods: {
    toggleHeader () {
      toggleClass('show-sidebar', document.getElementById('ld-header'))
    },
    headerItemClick (e) {
      const dataHref = e.target.getAttribute('data-type')
      if (dataHref && document.querySelector('.ld-header.show-sidebar')) {
        removeClass('show-sidebar', document.getElementById('ld-header'))
      }
    },
    headerScroll () {
      if (!this.scroll) return
      // const header = document.getElementById('ld-header')
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
      document.addEventListener('scroll', throttle(func, 300))
    }
  },
  mounted () {
    this.$nextTick(() => this.headerScroll())
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';
  .ld-header {
    width: 100%;
    // overflow: hidden;
    z-index: 999;
    transition: all .3s ease;
    @include height(90px, -2);
    @include height(60px, 1, -2);
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
      .header-logo {
        opacity: 0;
        transform: scale(.3);
      }
      .header-mask {
        opacity: 1;
        visibility: visible;
        transition: opacity .15s ease-in, visibility 0s 0s;
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

  .header-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    opacity: 0;
    visibility: hidden;
    transition: opacity .15s ease-out .15s, visibility 0s .3s;
    z-index: 999;
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

  .navbar-right {
    flex: 1;
    text-align: right;
    // font-weight: bold;
  }

  .header-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    opacity: 0;
    visibility: hidden;
    transition: opacity .15s ease-out .15s, visibility 0s .3s;
    z-index: 999;
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

  .navbar-right {
    flex: 1;
    text-align: right;
    // font-weight: bold;
  }

  @media screen and (min-width: 769px) {
    .container {
      // line-height: 80px;
    }
  }

  @media screen and (max-width: 768px) {
    .ld-header {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 99;
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
      position: fixed;
      top: 0;
      right: 0;
      width: 60%;
      max-width: 300px;
      height: 100%;
      background-color: #4f53d6;
      z-index: 1000;
      transform: translateX(100%);
      transition: transform .3s ease-in-out .15s;
      // .overflow();
      .header-right-item {
        margin: 15px 0 10px 25px;
        display: block;
        font-size: 16px;
        line-height: 1.4;
        >a {
          display: inline-block;
          // padding: 5px 10px;
        }
      }
      .header-close-item {
        position: relative;
        margin: 0 0 10px;
        height: 60px;
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
