<template>
  <header id="ld-header" class="ld-header" :class="[{ 'fixed': options.fixed }, { 'inverse': !options.scroll }, { 'transparent': options.transparent }, theme]" v-if="options.show">
    <div class="container d-flex">
      <div class="text-left inline-block header-logo">
        <router-link to="/" class="inline-block">
          <svg class="inline-block">
            <use xlink:href="/static/svg/icon.svg#icon-logo-image"/>
          </svg>
          <svg class="inline-block logo-text">
            <use xlink:href="/static/svg/icon.svg#icon-logo-text"/>
          </svg>
        </router-link>
      </div>
      <div @click.stop="toggleHeader" id="header-mask" class="header-mask"></div>
      <div @click.stop="headerItemClick" class="v-flex text-right header-text navbar-sidebar">
        <span class="uppercase md-hidden header-right-item header-close-item sm-text-center">
          <span @click.stop="toggleHeader" class="ld-close-icon"></span>
          <router-link to="/" class="header-sm-logo">
            <svg class="inline-block">
              <use xlink:href="/static/svg/icon.svg#icon-logo-image"/>
            </svg>
          </router-link>
        </span>
        <span class="inline-block header-right-item" data-type="link">
          <router-link to="/mapbox">
            Map
          </router-link>
        </span>
        <span class="inline-block header-right-item" data-type="link">
          <router-link to="/">
            Marketplace
          </router-link>
        </span>
        <span class="inline-block header-right-item" data-type="link">
          <router-link to="/">
            FAQs
          </router-link>
        </span>
        <span class="inline-block header-right-item user-item" data-type="link">
          <user-avatar class="user-avatar" :header="true"></user-avatar>
        </span>
      </div>
    </div>
  </header>
</template>

<script>
import { addClass, removeClass, toggleClass } from 'utils/tool'
import throttle from 'lodash/throttle'
import UserAvatar from '@/components/reuse/userAvatar'
export default {
  props: {
    options: {
      type: Object,
      default: () => {
        return {
          show: true
        }
      }
    },
    theme: {
      type: String,
      default: 'default'
    }
  },
  components: {
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
      if (!this.options.scroll) return
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
  @import '@/assets/stylus/mixin/color_mixin.scss';
  @import '@/assets/stylus/mixin/class_mixin.scss';
  .ld-header {
    width: 100%;
    height: 80px;
    // overflow: hidden;
    z-index: 9;
    transition: all .3s ease;
    background-color: #4D33A7;
    &.fixed {
      position: fixed;
      top: 0;
      left: 0;
    }
    &.default {
      color: #fff;
      fill: #fff;
    }
    &.dark {
      background-color: #0E0F16;
      color: #fff;
      fill: #fff;
    }
    &.transparent {
      background-color: transparent;
    }
    &.inverse {
      background-color: #4D33A7;
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

  .header-logo {
    transition: all .15s ease-out .15s;
    svg {
      fill: inherit;
      width: 64px;
      height: 45px;
      vertical-align: middle;
      &.logo-text {
        margin-left: 10px;
        width: 119px;
        height: 32px;
        transform: translateY(5px);
        @include margin('left', 10px, 1);
      }
    }
  }
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
    // @include distance('margin', 'top', 1, 1, -1);
    // @include distance('margin', 'bottom', 1, 1, -1);
    // @include distance('margin', 'left', 2.5, 1);
    a {
      color: #fff;
      // font-weight: bold;
      text-decoration: none;
      @include fontSize(20px, 1);
    }
    &.user-item {
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

  @media screen and (min-width: 769px) {
    .container {
      line-height: 80px;
    }
  }

  @media screen and (max-width: 768px) {
    .ld-header {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 99;
    }
    .header-logo {
      line-height: 80px;
    }
    .navbar-sidebar {
      position: absolute;
      top: 0;
      right: 0;
      width: 60%;
      max-width: 300px;
      height: 100vh;
      text-align: left;
      background-color: #4f53d6;
      z-index: 1000;
      transform: translateX(100%);
      transition: transform .3s ease-in-out .15s;
      // .overflow();
      .header-right-item {
        // margin: 10px 0 10px 25px;
        display: block;
        @include margin-around(10px, 0, 10px, 25px, 1);
        >a {
          display: inline-block;
          // padding: 5px 10px;
        }
      }
      .header-close-item {
        position: relative;
        height: 80px;
        border-bottom: 1px solid #393b7e;
        @include margin-around(0, 0, 10px, 0, 1);
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
        @include padding('top', 20px, 1, -2);
        svg {
          width: 50px;
          height: 40px;
          fill: #fff;
        }
      }
    }
    .header-logo {
      .logo-text {
        display: none;
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

  @media screen and (min-width: 769px) {
    .container {
      line-height: 80px;
    }
  }

  @media screen and (max-width: 768px) {
    .ld-header {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 99;
    }
    .header-logo {
      line-height: 80px;
    }
    .navbar-sidebar {
      margin: 0;
      position: absolute;
      top: 0;
      right: 0;
      width: 60%;
      max-width: 300px;
      height: 100vh;
      text-align: left;
      background-color: #4f53d6;
      z-index: 1000;
      transform: translateX(100%);
      transition: transform .3s ease-in-out .15s;
      // .overflow();
      .header-right-item {
        margin: 10px 0 10px 25px;
        display: block;
        font-size: 16px;
        >a {
          display: inline-block;
          // padding: 5px 10px;
        }
      }
      .header-close-item {
        position: relative;
        margin: 0 0 10px;
        height: 80px;
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
        padding-top: 20px;
        svg {
          width: 50px;
          height: 40px;
          fill: #fff;
        }
      }
    }
    .header-logo {
      .logo-text {
        display: none;
      }
    }
  }
</style>
