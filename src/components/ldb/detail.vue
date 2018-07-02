<template>
  <div class="ldb-detail-main" :class="theme">
    <ld-loading :loading="loading"></ld-loading>
    <div class="detail-header">
      <sketch-fab class="detail-fab"/>
    </div>
    <div class="detail-cnt-box">
      <div class="container">
        <div class="cnt-item cnt-header">
          <el-row justify="end" align="bottom">
            <el-col :md="12" :sm="24">
              <h1 class="ldb-name">
                <span>{{ ldbInfo.name.split(',')[0] }}</span>
                <span class="ldb-category" v-for="(category, index) of ldbInfo.category.split(',')" :key="index">{{ category }}</span>
              </h1>
            </el-col>
            <el-col :md="12" :sm="24">
              <div class="d-flex f-align-center">
                <div class="user-info v-flex">
                  <p class="lord-name">
                    {{ 'founy' }}
                  </p>
                  <p class="lord-address">{{ splitAddress(userInfo.address, '******') }}</p>
                </div>
                <div class="user-avatar">
                  <Blockies radius="6px" :seed="userInfo.address" :scale="8"></Blockies>
                  <img-box :src="ldbInfo.ldbIcon.sourceUrl" type="span"></img-box>
                </div>
              </div>
            </el-col>
          </el-row>
          <div class="ldb-msg">
            <p>
              <span>
                <i class="el-icon-location-outline"></i>
              </span>
              <span class="inline-block ldb-location">{{ `${ldbInfo.chainSystem.lat},${ldbInfo.chainSystem.lon}` }}</span>
              <span>·</span>
              <span class="inline-block">{{ ldbInfo.address }}</span>
              <!-- <span class="inline-block ldb-address">{{ ldbInfo.address }}</span> -->
            </p>
            <!-- <p v-if="ldbInfo.category">
              <span class="inline-block ldb-category" v-for="(category, index) of ldbInfo.category.split(',')" :key="index">{{ category }}</span>
            </p> -->
          </div>
        </div>
        <div class="cnt-item ldb-desc">{{ ldbInfo.desc_zh }}</div>
        <div class="cnt-item cnt-features">
          <div class="d-flex sm-col-flex features-container">
            <div class="d-inline-flex md-col-flex sm-row-flex sm-f-align-center features-price features-item">
              <p>Price</p>
              <div class="ldb-price text-nowrap">
                <span>{{ ldbInfo.chainSystem.value }}</span>
                <span>ETH</span>
              </div>
            </div>
            <div class="inline-block features-time features-item">
              <p>Time Left</p>
              <div>
                <p>Expires in 30 days</p>
              </div>
            </div>
            <div class="v-flex md-text-right sm-text-left features-btn features-item">
              <my-button theme="buy">Sign to Buy</my-button>
            </div>
          </div>
        </div>
        <div class="cnt-item large-margin cnt-tasks">
          <h2>任务</h2>
          <div class="tasks-box">
            <div class="d-flex sm-col-flex">
              <my-button theme="info" class="d-inline-flex f-auto-center ldb-task-btn">
                <span class="line-height-1">
                  <svg>
                    <use xlink:href="/static/svg/icon.svg#icon-telegram"/>
                  </svg>
                </span>
                <span>关注 EOS Telegram</span>
              </my-button>
              <my-button theme="info" class="d-inline-flex f-auto-center ldb-task-btn">
                <span class="line-height-1">
                  <svg>
                    <use xlink:href="/static/svg/icon.svg#icon-telegram"/>
                  </svg>
                </span>
                <span>关注 EOS Telegram</span>
              </my-button>
            </div>
            <div>
              <my-button theme="info" class="d-inline-flex f-auto-center ldb-task-btn">
                <span class="line-height-1">
                  <svg>
                    <use xlink:href="/static/svg/icon.svg#icon-medium"/>
                  </svg>
                </span>
                <span>关注 EOS Medium</span>
              </my-button>
            </div>
          </div>
        </div>
        <div class="cnt-item middle-margin cnt-candy">
          <h3>已完成</h3>
          <div class="history-box">
            <div class="history-container text-nowrap">
              <el-row class="history-item history-header finish">
                <el-col :span="6">
                  奖励 Candy
                </el-col>
                <el-col :span="6">
                  WHEN
                </el-col>
                <el-col :span="6">
                  FROM
                </el-col>
                <el-col :span="6">
                  TO
                </el-col>
              </el-row>
              <el-row class="history-cnt-box">
                <el-row class="history-item history-cnt">
                  <el-col :span="6" class="color-pink">
                    <span>20 </span>
                    <span class="text-style-upper">EOS</span>
                  </el-col>
                  <el-col :span="6">
                    <span>1000</span>
                    <span class="text-style-cap">exp</span>
                  </el-col>
                  <el-col :span="6">
                    <span>关注</span>
                    <span class="text-style-upper">Eos</span>
                    <span class="text-style-cap">Telegram</span>
                  </el-col>
                  <el-col :span="6">
                    4 months ago
                  </el-col>
                </el-row>
                <el-row class="history-item history-cnt">
                  <el-col :span="6" class="color-pink">
                    <span>5 </span>
                    <span class="text-style-upper">NAS</span>
                  </el-col>
                  <el-col :span="6">
                    <span>500</span>
                    <span class="text-style-cap">exp</span>
                  </el-col>
                  <el-col :span="6" class="text-nowrap">
                    <span>关注</span>
                    <span class="text-style-upper">Nebulas</span>
                    <span class="text-style-cap">Twitter</span>
                  </el-col>
                  <el-col :span="6">
                    1 hours ago
                  </el-col>
                </el-row>
              </el-row>
            </div>
          </div>
        </div>
        <div class="cnt-item large-margin cnt-history">
          <h2>交易历史</h2>
          <div class="history-box">
            <div class="history-container text-nowrap">
              <el-row class="history-item history-header deal">
                <el-col :span="6">
                  PRICE
                </el-col>
                <el-col :span="6">
                  WHEN
                </el-col>
                <el-col :span="6">
                  FROM
                </el-col>
                <el-col :span="6">
                  TO
                </el-col>
              </el-row>
              <el-row class="history-cnt-box">
                <el-row class="history-item history-cnt">
                  <el-col :span="6" class="color-pink">
                    <span>1000</span>
                    <span class="text-style-upper">ETH</span>
                  </el-col>
                  <el-col :span="6">
                    2 days ago
                  </el-col>
                  <el-col :span="6">
                    {{ splitAddress(userInfo.address) }}
                  </el-col>
                  <el-col :span="6">
                    {{ splitAddress(userInfo.address) }}
                  </el-col>
                </el-row>
                <el-row class="history-item history-cnt">
                  <el-col :span="6" class="color-pink">
                    <span>800</span>
                    <span class="text-style-upper">ETH</span>
                  </el-col>
                  <el-col :span="6">
                    15 days ago
                  </el-col>
                  <el-col :span="6">
                    {{ splitAddress(userInfo.address) }}
                  </el-col>
                  <el-col :span="6">
                    {{ splitAddress(userInfo.address) }}
                  </el-col>
                </el-row>
              </el-row>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ImgBox from '@/components/stories/image'
import Blockies from '@/components/stories/blockies'
import MyButton from '@/components/stories/button'
import SketchFab from '@/components/sketchfab'
import LdLoading from '@/components/stories/loading'
import { getLdbById } from 'api'
import { objectType, splitAddress } from 'utils/tool'
import { mapState } from 'vuex'
export default {
  props: {

    // 是否在 dialog 中打开
    dialog: {
      type: Boolean,
      default: false
    },

    // ldb 建筑id
    ldbId: String,

    // 主题
    theme: {
      type: String,
      default: 'light'
    }
  },
  data: () => {
    return {
      // 页面 loading 状态
      loading: false,
      // ldb 建筑信息
      ldbInfo: {
        name: '',
        userId: {},
        chainSystem: {},
        levelSystem: {},
        ldbIcon: {},
        category: ''
      },
      // 错误信息
      errorMsg: null
    }
  },
  computed: {
    ...mapState('user', {
      userInfo: 'userInfo'
    })
  },
  components: {
    ImgBox,
    MyButton,
    SketchFab,
    LdLoading,
    Blockies
  },
  methods: {

    splitAddress (address, symbol) {
      return splitAddress(address, { symbol })
    },

    // 根据 photos 获取 ldb cover image
    ldbImage (photos) {
      if (objectType(photos)[0] !== 'array') return photos
      return decodeURIComponent(photos[0].split(',')[0])
    },

    // 获取 ldb 建筑详情
    async getLdbInfo (id) {
      this.loading = true
      const res = await getLdbById({ id, pula: 'ldbIcon' })
      if (res.code === 1000) this.ldbInfo = res.data
      else this.errorMsg = res.errorMsg || '未知错误'
      this.loading = false
    },

    // 初始化状态
    initStatus () {
      this.loading = false
      this.errorMsg = null
    },

    // 初始化组件
    init () {
      this.getLdbInfo(this.ldbId)
    }
  },
  watch: {
    ldbId (val) {
      if (val) this.getLdbInfo(val)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/color_mixin.scss';
  @import '@/assets/stylus/mixin/class_mixin.scss';

  @mixin detail-theme($theme: 'light') {
    @if $theme == 'light' {
      background-color: #f4f4f4;
    }
    @if $theme == 'dark' {
      color: #E6E8EC;
      background-color: #101010;
      .lord-name {
        color: #fff;
      }
    }
    @if $theme == 'gray' {
      color: #E6E8EC;
      background-color: #2b2b2b;
      .lord-name {
        color: #E6E8EC;
      }
    }
    @if $theme == 'default' {
      color: #E6E8EC;
      background-color: $--default-bg-color;
      .lord-name {
        color: #E6E8EC;
      }
    }
  }
  .ldb-detail-main {
    width: inherit;
    height: inherit;
    overflow: hidden;
    &.dark {
      @include detail-theme('dark');
    }
    &.gray {
      @include detail-theme('gray');
    }
    &.light {
      @include detail-theme('light');
    }
    &.default {
      @include detail-theme('default');
    }
  }

  .detail-header {
    height: calc((100vh / 3 * 2) + 50px);
    min-height: 300px;
    position: relative;
    &::before, &::after {
      content: '';
      position: absolute;
      top: 0;
      width: 50%;
      height: 100%;
      z-index: 0;
    }
    &::before {
      left: 0;
      @include bg-img-class('~/static/img/test/fandian-left.png', repeat-x, contain);
    }
    &::after {
      right: 0;
      @include bg-img-class('~/static/img/test/fandian-right.png', repeat-x, contain);
    }
    >div {
      position: relative;
      z-index: 1;
    }
  }
  // .detail-fab {
  //   width: 100%;
  // }

  .detail-cnt-box {
    background-image: linear-gradient(top, #240864, #4D33A7);
    @include padding('top', 80px, 1.25);
    @include padding('bottom', 100px, 1.25);
    @include fontSize(16px, 1);
    .container {
      max-width: 1000px;
      @include bg-img-class('~/static/img/utils/lordless-map-bg.png', repeat, auto);
    }
  }

  .cnt-item {
    &:not(:first-of-type) {
      @include margin('top', 40px, 1);
    }
    &.large-margin {
      @include margin('top', 100px, 1);
    }
    &.middle-margin {
      @include margin('top', 60px, 1);
    }
    >h2 {
      @include margin('bottom', 25px, 1);
      @include fontSize(38px, 1);
    }
    >h3 {
      @include margin('bottom', 20px, 1);
      @include fontSize(28px, 1);
    }
  }
  .ldb-name {
    @include fontSize(54px, 1.75);
  }
  .ldb-category {
    color: #373737;
    background-color: #EEC75E;
    border-radius: 3px;
    @include padding(-1, 5px, 1);
    @include fontSize(14px, 1);
    &:not(:last-of-type) {
      @include margin('right', 10px, 1);
    }
  }
  .user-info {
    font-weight: 500;
    text-align: right;
  }

  .lord-name {
    @include margin('bottom', 5px, 1);
    @include fontSize(24px, 1);
  }
  .lord-address {
    color: #d6d6d6;
    @include fontSize(16px, 1);
  }
  .user-avatar {
    // width: 56px;
    // height: 56px;
    // background-color: #ed5736;
    border-radius: 8px;
    overflow: hidden;
    @include margin('left', 15px, 1);
  }

  .ldb-msg {
    @include margin('top', 10px, 1);
    @include fontSize(24px, 1);
  }

  .ldb-desc {
    @include fontSize(18px, 1);
  }

  // cnt-features
  .cnt-features {

  }
  .features-item {
    min-width: 150px;
    font-weight: 500;
    >p {
      line-height: 200%;
      @include fontSize(24px, 1);
    }
    >div {
      @include fontSize(26px, 1);
    }
    &:not(:first-of-type) {
      @include margin('top', 30px, 1, -1);
    }
  }
  .features-btn {
    // text-align: right;
    button {
      border-radius: 25px;
      @include margin(-1, 0, -1, -1);
      @include padding-around(12px, 25px, 12px, 25px, 1);
      @include fontSize(24px, 1);
    }
  }
  .ldb-price {
    color: #EE4CF1;
  }

  .cnt-tasks {
  }
  .tasks-box {
    >div {
      &:not(:first-of-type) {
        @include margin('top', 40px, 1.3);
      }
    }
    .ldb-task-btn {
      &:not(:first-of-type) {
        @include margin('left', 40px, -1);
        @include margin('top', 40px, 1.3, -1);
      }
    }
  }
  .ldb-task-btn {
    font-weight: 500;
    border-radius: 8px;
    @include margin(-1, 0, -1, -1);
    @include padding-around(12px, 40px, 12px, 30px, 1);
    @include fontSize(22px, 1);
    svg {
      width: 30px;
      height: 30px;
    }
    >span {
      @include margin('left', 15px, 1);
    }
  }

  // history box
  .history-box {
    font-weight: 500;
    border-radius: 8px;
    overflow: auto;
    @include fontSize(20px, 1);
  }
  .history-container {
    width: 100%;
    min-width: 600px;
  }
  .history-item {
    // height: 50px;
    // line-height: 50px;
    text-indent: 45px;
    overflow: hidden;
    @include padding('top', 20px, 1);
    @include padding('bottom', 20px, 1);
  }
  .history-header {
    color: #715CB7;
    background-color: #270F72;
    // &.finish {
    //   background-color: #B6A5FF;
    // }
    // &.deal {
    //   background-color: #F6A5FF;
    // }
  }
  .history-cnt-box {
    padding: 15px 0;
    background-color: #31187F;
    color: #fff;
    @include padding('top', 15px, 1);
    @include padding('bottom', 15px, 1);
  }
  .history-cnt {

  }

  @media screen and (max-width: 768px) {
    .detail-header {
      height: calc((100vh / 2) + 50px);
      min-height: 350px;
    }
    .features-item {
      &:not(:first-of-type) {
        margin-top: 30px;
      }
    }
    .tasks-box {
      >div {
        &:not(:first-of-type) {
          margin-top: 30px;
        }
      }
      .ldb-task-btn {
        &:not(:first-of-type) {
          margin-left: 0;
          margin-top: 15px;
        }
      }
    }
  }
</style>
