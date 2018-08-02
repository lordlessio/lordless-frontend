<template>
  <el-container class="ld-user-box">
    <Loading
      class="ld-user-loading"
      :loading="loading"
      :index="99">
      <svg>
        <use xlink:href="/static/svg/icon.svg#icon-logo-image"/>
      </svg>
    </Loading>
    <aside class="d-flex lg-col-flex sm-row-flex ld-user-navgation">
      <div class="d-flex f-auto-center user-navgation-logo sm-hidden" @click="$router.push('/')">
        <svg class="logo-text">
          <use xlink:href="/static/svg/icon.svg#icon-logo-text"/>
        </svg>
        <svg class="logo-image">
          <use xlink:href="/static/svg/icon.svg#icon-logo-image"/>
        </svg>
      </div>
      <div class="d-flex col-flex v-flex">
        <ul class="d-flex v-flex sm-row-flex lg-col-flex user-navgation-list">
          <li
            class="TTFontBolder user-navgation-item"
            :class="{ 'active': $route.meta.navgation === nav.name }"
            v-for="(nav, index) of navgations"
            :key="index"
            @click="$router.push(nav.path)">
            <div class="d-flex f-align-center sm-f-justify-center navgation-item-cnt">
              <span class="navgation-item-icon">
                <svg>
                  <use :xlink:href="`/static/svg/icon.svg#icon-${nav.icon}`"/>
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
                <use xlink:href="/static/svg/icon.svg#icon-reddit"/>
              </svg>
            </span>
            <span class="text-cap" @click="logout">Logout</span>
          </div>
        </div>
      </div>
    </aside>
    <el-container class="col-flex ld-user-container">
      <div class="ld-user-header">
        <ld-header v-bind="headerOpt"></ld-header>
      </div>
      <el-main class="d-flex ld-user-content">
        <router-view class="v-flex user-content-container"></router-view>
      </el-main>
    </el-container>
    <Authorize
      ref="authorize"
      :crowdsale="false"
      :modelClose="false"
      :autoClose="false"
      @init="authorizeInit"
      @blurs="dialogSetBlurs"
      @fClose="fCloseAuthorize">
    </Authorize>
  </el-container>
</template>

<script>
import LdHeader from '@/components/layout/header'
import Authorize from '@/components/reuse/authorize'
import Loading from '@/components/stories/loading'

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
          icon: 'reddit',
          path: '/user/info'
        },
        {
          name: 'buildings',
          icon: 'reddit',
          path: '/user/buildings'
        },
        {
          name: 'candy',
          icon: 'reddit',
          path: '/user/candy'
        },
        {
          name: 'tasks',
          icon: 'reddit',
          path: '/user/info'
        },
        {
          name: 'authorization',
          icon: 'reddit',
          path: '/user/info'
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
    Loading,

    LdHeader,
    Authorize
  },
  methods: {
    ...mapActions('user', [
      actionTypes.USER_SET_USER_BY_TOKEN,
      actionTypes.USER_LOGOUT
    ]),

    authorizeInit () {
      console.log('-------init')
      this.checkUser()
    },

    fCloseAuthorize () {
      if (this.loading) this.$router.push('/')
    },

    async checkUser () {
      if (this.userInfo._id) {
        this.loading = false
        return
      }
      this.$refs.authorize.checkoutAuthorize()
    },

    async logout () {
      await this[actionTypes.USER_LOGOUT]({ reset: true })
    }
  },
  watch: {
    userInfo (val, oVal) {
      if (!val._id) {
        this.$refs.authorize.checkoutAuthorize()
        this.loading = true
      } else this.loading = false
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.checkUser()
    })
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';

  .ld-user-box {
    height: 100vh;
    min-height: 500px;
  }
  // ld-user-loading
  @keyframes outline {
    0% {
      stroke-dashoffset: 205px;
      fill: rgba(202, 202, 202, .5);
    }
    100% {
      stroke-dashoffset: 0;
      fill: rgba(202, 202, 202, .1);
    }
  }

  .ld-user-loading {
    // filter: grayscale(30%) sepia(30%);
    background-color: #fff;
    text-align: center;
    svg {
      position: relative;
      top: 35%;
      width: 150px;
      height: 100px;

      fill: rgba(202, 202, 202, .5);
      stroke: #332C2B;
      stroke-dasharray: 205px;
      animation-fill-mode: both;
      animation: outline 5s ease-in-out infinite alternate;
    }
  }

  // ld-user-navgation
  .ld-user-navgation {
    width: 250px;
  }

  .user-navgation-logo {
    height: 80px;
    border-bottom: 1px solid rgba(77, 70, 210, 0.05);
    fill: #4E47D3;
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
      color: #4E47D3;
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
    color: #EB8785;
    fill: #EB8785;
  }

  .ld-user-container {
    position: relative;
    @include padding('bottom', 60px, 1, -2);
  }
  .ld-user-header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 80px;
    padding: 0 30px;
    background-color: #4E47D3;
    color: #fff;
    z-index: 9;
  }

  .ld-user-content {
    padding: 80px 0 0;
    background-color: #f4f4f4;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  .user-content-container {
    margin: 0 auto;
    max-width: 1000px;
  }

  @media screen and (min-width: 992px) {
    .logo-image {
      display: none;
    }
  }
  @media screen and (max-width: 991px) {
    .ld-user-navgation {
      width: 100px;
    }
    .user-navgation-logo {
      .logo-text {
        display: none;
      }
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
        background-color: #4E47D3;
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
