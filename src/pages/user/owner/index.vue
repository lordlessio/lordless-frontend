<template>
  <el-container class="ld-user-box">
    <!-- <Loading
      :loading="false"
      crown
      position="fixed"
      :index="99">
    </Loading> -->
    <aside class="d-flex lg-col-flex sm-row-flex ld-user-navgation">
      <div class="d-flex f-auto-center user-navgation-logo sm-hidden">
        <header-logo theme="deep-blue"></header-logo>
      </div>
      <div class="d-flex col-flex v-flex">
        <ul class="d-flex v-flex sm-row-flex lg-col-flex user-navgation-list">
          <li
            class="user-navgation-item"
            :class="{ 'active': $route.meta.navgation === nav.name.toLowerCase() }"
            v-for="(nav, index) of navgations"
            :key="index"
            @click="$router.push(nav.path)">
            <div class="d-flex f-align-center sm-f-justify-center TTFontBolder navgation-item-cnt">
              <span class="navgation-item-icon">
                <svg>
                  <use :xlink:href="`#icon-${nav.icon}_${$route.meta.navgation === nav.name.toLowerCase() ? 'selected' : 'unselected'}`"/>
                </svg>
              </span>
              <span class="text-cap">{{ nav.name }}</span>
            </div>
          </li>
        </ul>
        <div class="TTFontBolder user-navgation-item user-logout sm-hidden">
          <div class="d-flex f-align-center cursor-pointer navgation-item-cnt">
            <span class="navgation-item-icon">
              <svg>
                <use xlink:href="#icon-logout"/>
              </svg>
            </span>
            <span class="text-cap" @click="logout">Logout</span>
          </div>
        </div>
      </div>
    </aside>
    <el-container class="col-flex ld-user-container">
      <div class="ld-user-header">
        <ld-header v-bind="headerOpt" theme="light"></ld-header>
      </div>
      <el-main class="d-flex ld-user-content">
        <div class="v-flex d-flex user-content-container">
          <transition name="owner-cnt-fade">
            <router-view class="owner-cnt-box" v-if="true"></router-view>
          </transition>
        </div>
      </el-main>
    </el-container>
    <Authorize
      ref="authorize"
      :modelClose="false"
      :autoClose="false"
      @init="checkUser"
      @blurs="dialogSetBlurs"
      @fClose="fCloseAuthorize">
    </Authorize>
  </el-container>
</template>

<script>
import HeaderLogo from '@/components/layout/header/logo'
import LdHeader from '@/components/layout/header'
import Authorize from '@/components/reuse/dialog/authorize'
// import Loading from '@/components/stories/loading'

import { dialogMixins } from '@/mixins'

import { actionTypes } from '@/store/types'
import { mapState, mapActions } from 'vuex'
export default {
  mixins: [ dialogMixins ],
  data: () => {
    return {
      navgations: [
        {
          name: 'overview',
          icon: 'overview',
          path: '/owner/info'
        },
        {
          name: 'taverns',
          icon: 'building',
          path: '/owner/taverns'
        },
        {
          name: 'candy',
          icon: 'candy',
          path: '/owner/candy'
        },
        {
          name: 'tasks',
          icon: 'task',
          path: '/owner/tasks'
        },
        {
          name: 'activity',
          icon: 'authorization',
          path: '/owner/activity'
        },
        {
          name: 'authorization',
          icon: 'authorization',
          path: '/owner/authorization'
        }
      ],
      headerOpt: {
        show: true,
        showLogo: false,
        inverse: false,
        transparent: true,
        inherit: true
      },
      loading: true
    }
  },
  computed: {
    ...mapState('user', [
      'userInfo'
    ])
  },
  components: {
    // Loading,

    HeaderLogo,
    LdHeader,
    Authorize
  },
  methods: {
    ...mapActions('user', [
      actionTypes.USER_SET_USER_BY_TOKEN,
      actionTypes.USER_LOGOUT
    ]),

    fCloseAuthorize () {
      if (this.loading) this.$router.push('/')
    },

    async checkUser () {
      const authorize = this.$refs.authorize.checkoutAuthorize()
      this.loading = !this.userInfo.address && !authorize
    },

    async logout () {
      await this[actionTypes.USER_LOGOUT]({ reset: true })
    }
  },
  watch: {
    userInfo (val, oVal) {
      console.log('---- val', val, oVal)
      this.$nextTick(() => this.checkUser())
    }
  }
  // mounted () {
  //   this.$nextTick(() => {
  //     if (this.userInfo._id) {
  //       this.checkUser()
  //     }
  //   })
  // }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';

  .owner-cnt-fade-enter-active {
    opacity: 1;
    z-index: 1;
    transition: opacity .4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .owner-cnt-fade-leave-active {
    transition-duration: 0s;
  }
  .owner-cnt-fade-enter, .owner-cnt-fade-leave-to {
    opacity: 0;
  }

  .ld-user-box {
    height: 100vh;
    min-height: 500px;
  }

  // ld-user-navgation
  .ld-user-navgation {
    width: 250px;
    z-index: 1;
    box-shadow: 1px 3px 5px 0 rgba(0, 0, 0, .1);
  }

  .user-navgation-logo {
    height: 90px;
    border-bottom: 1px solid rgba(77, 70, 210, 0.05);
    fill: $--text-deep-blue-color;
    cursor: pointer;
    svg {
      width: 150px;
    }
  }
  .user-navgation-item {
    position: relative;
    font-size: 16px;
    color: #999;
    fill: #999;
    span {
      display: inline-block;
    }
    &:not(.user-logout) {
      cursor: pointer;
    }
    &.active {
      color: $--text-deep-blue-color;
      fill: $--text-deep-blue-color;
      background-color: rgba(77, 70, 210, 0.05);
      .navgation-item-cnt {
        &::before {
          visibility: visible;
        }
      }
    }
    &:hover {
      &:not(.user-logout):not(.active) {
        background-color: rgba(77, 70, 210, 0.02);
      }
    }
  }
  .navgation-item-cnt {
    position: relative;
    width: 100%;
    box-sizing: border-box;
    @include padding('left', 20px, -2);
  }
  .navgation-item-icon {
    width: 22px;
    height: 22px;
    @include margin('right', 15px, -2);
  }
  .user-logout {
    height: 100px;
    color: $--text-red-color;
    fill: $--text-red-color;
  }

  .ld-user-container {
    position: relative;
    z-index: 0;
    @include padding('bottom', 60px, 1, -2);
  }
  .ld-user-header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 90px;
    padding: 0 30px;
    background-color: #fff;
    // color: #fff;
    z-index: 9;
    box-shadow: 2px 3px 5px 0 rgba(0, 0, 0, .1);
  }

  .ld-user-content {
    padding: 90px 0 0;
    background-color: #f4f4f4;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  .user-content-container {
    position: relative;
    margin: 0 auto;
    max-width: 1000px;
    @include viewport-unit(width, 100vw);
  }
  .owner-cnt-box {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    min-height: 100%;
  }
  @media screen and (max-width: 991px) {
    .ld-user-navgation {
      width: 100px;
    }
    .user-navgation-logo {
      // .logo-text {
      //   display: none;
      // }
      svg {
        width: 50px;
      }
    }
    .text-cap {
      display: none !important;
    }
  }
  @media screen and (min-width: 769px) {
    .user-navgation-item {
      padding: 20px 0;
    }
    .navgation-item-cnt {
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 5px;
        height: 100%;
        background-color: $--text-deep-blue-color;
        visibility: hidden;
      }
    }
  }
  @media screen and (max-width: 768px) {
    .ld-user-navgation {
      position: absolute;
      width: 100%;
      height: 60px;
      bottom: 0;
      left: 0;
      z-index: 99;
      background-color: #fff;
    }
    .user-navgation-item {
      text-align: center;
      flex: 1;
    }
    .navgation-item-cnt {
      height: 100%;
    }
  }
</style>
