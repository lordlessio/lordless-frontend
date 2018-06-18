<template>
  <div class="ldb-detail-main" :class="theme">
    <div class="detail-header">
      <img-box :src="ldbImage(ldbInfo.photos)" type="span"></img-box>
    </div>
    <div class="detail-cnt-box">
      <div class="container">
        <div class="cnt-item cnt-header">
          <el-row justify="end" align="bottom">
            <el-col :span="12">
              <h1 class="ldb-name">{{ ldbInfo.name }}</h1>
            </el-col>
            <el-col :span="12">
              <div class="d-flex f-align-center">
                <div class="user-info v-flex">
                  <p class="lord-name-box">
                    <span class="inline-block lord-name-title">领主</span>
                    <span class="inline-block lord-name">{{ '领主名称' }}</span>
                  </p>
                  <p class="lord-address">{{ splitAddress(userInfo.address, '******') }}</p>
                </div>
                <div class="user-avatar">
                  <img-box></img-box>
                </div>
              </div>
            </el-col>
          </el-row>
          <div class="ldb-msg">
            <span class="inline-block ldb-location">{{ `${ldbInfo.chainSystem.lat},${ldbInfo.chainSystem.lon}` }}</span>
            <span class="inline-block ldb-address">{{ ldbInfo.address }}</span>
          </div>
        </div>
        <div class="cnt-item cnt-desc">{{ ldbInfo.desc }}</div>
        <div class="cnt-item cnt-features">
          <div class="d-flex features-container">
            <div class="inline-block features-price features-item">
              <p>Price</p>
              <div>
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
            <div class="v-flex features-btn features-item">
              <my-button theme="buy">购买</my-button>
            </div>
          </div>
        </div>
        <div class="cnt-item cnt-tasks">
          <h2>任务</h2>
          <div class="tasks-box">
            <div>
              <my-button theme="info-1" class="d-inline-flex f-auto-center task-btn">
                <span class="line-height-1">
                  <svg>
                    <use xlink:href="/static/svg/icon.svg#icon-telegram"/>
                  </svg>
                </span>
                <span>关注 EOS Telegram</span>
              </my-button>
              <my-button theme="info-1" class="d-inline-flex f-auto-center task-btn">
                <span class="line-height-1">
                  <svg>
                    <use xlink:href="/static/svg/icon.svg#icon-telegram"/>
                  </svg>
                </span>
                <span>关注 EOS Telegram</span>
              </my-button>
            </div>
            <div>
              <my-button theme="info-2" class="d-inline-flex f-auto-center task-btn">
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
        <div class="cnt-item cnt-candy">
          <h3>已完成</h3>
          <div class="history-box">
            <el-row class="history-item history-header">
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
            <el-row class="history-item history-cnt">
              <el-col :span="6" class="color-green">
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
              <el-col :span="6" class="color-green">
                <span>5 </span>
                <span class="text-style-upper">NAS</span>
              </el-col>
              <el-col :span="6">
                <span>500</span>
                <span class="text-style-cap">exp</span>
              </el-col>
              <el-col :span="6">
                <span>关注</span>
                <span class="text-style-upper">Nebulas</span>
                <span class="text-style-cap">Twitter</span>
              </el-col>
              <el-col :span="6">
                1 hours ago
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="cnt-item cnt-history">
          <h2>交易历史</h2>
          <div class="history-box">
            <el-row class="history-item history-header">
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
            <el-row class="history-item history-cnt">
              <el-col :span="6" class="color-green">
                <span>1000</span>
                <span class="text-style-upper">ETH</span>
              </el-col>
              <el-col :span="6" class="color-red">
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
              <el-col :span="6" class="color-green">
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ImgBox from '@/stories/image'
import MyButton from '@/stories/button'
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
        userId: {},
        chainSystem: {},
        levelSystem: {}
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
    MyButton
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
      const res = await getLdbById({ id })
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
  }
  .ldb-detail-main {
    padding-bottom: 60px;
    width: inherit;
    height: inherit;
    &.dark {
      @include detail-theme('dark');
    }
    &.gray {
      @include detail-theme('gray');
    }
    &.light {
      @include detail-theme('light');
    }
  }
  .detail-header {
    height: 300px;
  }

  .detail-cnt-box {
    font-size: 16px;
    .container {
      max-width: 1000px;
    }
  }

  .cnt-item {
    margin-top: 40px;
    >h2 {
      font-size: 35px;
    }
    >h2 {
      font-size: 24px;
    }
    >h3 {
      font-size: 18px;
    }
  }
  .cnt-header {
    // margin-top: 45px;
    .el-row {
      margin-bottom: 10px;
    }
  }
  .ldb-name {
    font-size: 35px;
  }
  .user-info {
    font-weight: 500;
    text-align: right;
  }

  .lord-name-box {
    line-height: 1.8;
  }
  .lord-name {
    font-size: 16px;
  }
  .lord-name-title {
    margin-right: 6px;
    font-size: 14px;
    color: #E6E8EC;
  }
  .lord-address {
    font-size: 14px;
    color: #aaa;
  }
  .user-avatar {
    margin-left: 15px;
    width: 56px;
    height: 56px;
    background-color: #ed5736;
    border-radius: 100%;
  }
  .cnt-desc {
    // margin: 30px 0;
  }

  // cnt-features
  .cnt-features {

  }
  .features-item {
    min-width: 150px;
    font-weight: 500;
    >p {
      font-size: 16px;
    }
    >div {
      margin-top: 10px;
      font-size: 20px;
    }
  }
  .features-btn {
    text-align: right;
    button {
      font-size: 22px;
    }
  }

  .cnt-tasks {

  }
  .tasks-box {
    margin-left: -10px;
  }
  .task-btn {
    padding: 15px 30px 15px 20px;
    font-size: 16px;
    font-weight: 500;
    svg {
      width: 24px;
      height: 24px;
    }
    >span {
      margin-left: 10px;
    }
  }

  .ldb-msg {
    >span {
      padding: 8px 10px;
      border-radius: 5px;
      vertical-align: middle;
      background-color: $--color-btn-yellow;
      color: #fff;
      &:not(:first-of-type) {
        margin-left: 30px;
      }
    }
  }

  .history-box {
    margin-top: 10px;
    font-weight: 500;
  }
  .history-item {
    height: 50px;
    color: #fff;
    line-height: 50px;
    text-indent: 45px;
    overflow: hidden;
  }
  .history-header {
    color: #696B74;
    background-color: #2B2C2C;
  }
  .history-cnt {
    background-color: #44424D;
  }
</style>
