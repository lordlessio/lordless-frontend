<template>
  <div class="ldb-detail-main" :class="theme">
    <ld-loading :loading="loading"></ld-loading>
    <div class="detail-header">
      <sketch-fab :poster="ldbInfo.ldbIcon.sourceUrl" class="detail-fab"/>
    </div>
    <div class="detail-cnt-box">
      <div class="container">
        <div class="cnt-item cnt-header">
          <el-row justify="end" align="bottom">
            <el-col :md="12" :sm="24">
              <h1 class="d-flex row-flex f-align-baseline ldb-name">
                <span>{{ ldbInfo.name.zh }}</span>
                <span class="mar-l1 ldb-category">{{ ldbInfo.origin.category.split(',')[0] }}</span>
                <!-- <span class="ldb-category" v-for="(category, index) of ldbInfo.origin.category.split(',')" :key="index">{{ category }}</span> -->
              </h1>
            </el-col>
            <el-col :md="12" :sm="24">
              <div class="d-flex f-align-center">
                <div class="user-info v-flex">
                  <div v-if="userInfo.address">
                    <p class="lord-name">
                      {{ 'LORDLESS' }}
                    </p>
                    <p class="lord-address">{{ splitAddress(userInfo.address, '******') }}</p>
                  </div>
                </div>
                <div class="user-avatar">
                  <user-avatar
                    shadow
                    :scale="9"
                    radius='8px'
                    :fontSize="'24px'"
                    :showText="false"></user-avatar>
                </div>
              </div>
            </el-col>
          </el-row>
          <div class="ldb-msg">
            <p>
              <span>
                <i class="el-icon-location-outline"></i>
              </span>
              <span class="inline-block ldb-location">{{ `${ldbInfo.chainSystem.lat},${ldbInfo.chainSystem.lng}` }}</span>
              <!-- <span class="inline-block"> · {{ ldbInfo.address }}</span> -->
              <!-- <span class="inline-block ldb-address">{{ ldbInfo.address }}</span> -->
            </p>
            <!-- <p v-if="ldbInfo.category">
              <span class="inline-block ldb-category" v-for="(category, index) of ldbInfo.category.split(',')" :key="index">{{ category }}</span>
            </p> -->
          </div>
        </div>
        <div class="cnt-item ldb-desc">{{ ldbInfo.desc.zh }}</div>
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
              <!-- <ld-button theme="default" @click="pushChain" v-if="unOnChain">push chain</ld-button> -->
              <div v-if="showSell">
                <ld-button theme="info" :disabled="contractLoading" shadow :contract="true" @click="sell">Sell</ld-button>
                <!-- <div class="inline-block sell-input">
                  <input class="lordless-input" v-model="sellModel" placeholder="ETH"/>
                </div> -->
              </div>
              <ld-button theme="info" :disabled="contractLoading" shadow contract @click="unsell" v-if="showUnSell">Un Sell</ld-button>
              <ld-button theme="purple" :disabled="contractLoading" shadow contract @click="buy" v-if="showBuy"><span v-if="!userInfo.address">Sign to {{ this.isOwner ? 'Sell' : 'Buy' }}</span><span v-if="userInfo.address">Buy</span></ld-button>
            </div>
          </div>
        </div>
        <div class="cnt-item large-margin cnt-tasks">
          <h2>任务</h2>
          <div class="tasks-box">
            <div class="d-flex sm-col-flex">
              <ld-button theme="purple-gradient" shadow class="d-inline-flex f-auto-center ldb-task-btn">
                <span class="line-height-1">
                  <svg>
                    <use xlink:href="/static/svg/icon.svg#icon-telegram"/>
                  </svg>
                </span>
                <span>关注 EOS Telegram</span>
              </ld-button>
              <ld-button theme="purple-gradient" shadow class="d-inline-flex f-auto-center ldb-task-btn">
                <span class="line-height-1">
                  <svg>
                    <use xlink:href="/static/svg/icon.svg#icon-telegram"/>
                  </svg>
                </span>
                <span>关注 EOS Telegram</span>
              </ld-button>
            </div>
            <div>
              <ld-button theme="purple-gradient" shadow class="d-inline-flex f-auto-center ldb-task-btn">
                <span class="line-height-1">
                  <svg>
                    <use xlink:href="/static/svg/icon.svg#icon-medium"/>
                  </svg>
                </span>
                <span>关注 EOS Medium</span>
              </ld-button>
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
                    {{ splitAddress('0x4cd98f82decade2d152e256efd1f8d5a334a3e28') }}
                  </el-col>
                  <el-col :span="6">
                    {{ splitAddress('0xc2d1021aad26d2eff4c748fdfa9af08973b7bf01') }}
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
                    {{ splitAddress('0x4cd98f82decade2d152e256efd1f8d5a334a3e28') }}
                  </el-col>
                  <el-col :span="6">
                    {{ splitAddress('0xbeb7ec0617984da30784feaf8e4b45cfa214f246') }}
                  </el-col>
                </el-row>
              </el-row>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Authorize
      ref="authorize"
      :address="userInfo.address"></Authorize>

    <order-dialog v-model="orderModel" :ldbInfo="ldbInfo"></order-dialog>
    <!-- <el-dialog
      title="提示"
      :visible.sync="detailAlert"
      width="300px"
      :close-on-click-modal="false"
      :center="true"
      :show-close="false">
      <div class="ld-relogin-input">
        <p>账户信息失效了，需要重新认证呀！</p>
        <input disabled type="text" :value="reloginAddress"/>
      </div>
      <div slot="footer" class="dialog-footer">
        <ld-button @click="detailAlert = false">取 消</ld-button>
        <ld-button theme="info-2" @click="metaLogin">确 定</ld-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import ImgBox from '@/components/stories/image'
import UserAvatar from '@/components/reuse/userAvatar'
import LdButton from '@/components/stories/button'
import SketchFab from '@/components/sketchfab'
import LdLoading from '@/components/stories/loading'
import Authorize from '@/components/reuse/authorize'
import OrderDialog from '@/components/reuse/orderDialog'
// import { getLdbById } from 'api'
import { objectType, splitAddress } from 'utils/tool'
import { mapState } from 'vuex'
// import lordContract from '@/contract'
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
        name: {},
        desc: {},
        origin: {
          category: ''
        },
        userId: {},
        chainSystem: {},
        levelSystem: {},
        ldbIcon: {},
        user: {}
      },

      // 错误信息
      errorMsg: null,
      tokenId: 0,

      isSell: false,
      ldbNftOwner: false,
      crowdsaleOwner: false,
      detailAlert: false,
      orderModel: false,
      contractLoading: false
    }
  },
  computed: {
    ...mapState('user', [
      'userInfo'
    ]),
    ...mapState('contract', [
      'ldbNFTContract',
      'buildingContract',
      'ldbNFTCrowdsaleContract'
    ]),
    // unOnChain () {
    //   const ldbInfo = this.ldbInfo
    //   return ldbInfo.ocs === 1
    // },
    showSell () {
      const ldbInfo = this.ldbInfo
      return !this.showSign && this.isOwner && !this.isSell && ldbInfo.ocs === 2
    },
    showUnSell () {
      const ldbInfo = this.ldbInfo
      return !this.showSign && this.isOwner && this.isSell && ldbInfo.ocs === 2
    },
    showBuy () {
      const ldbInfo = this.ldbInfo
      return this.showSign || (this.isSell && ldbInfo.ocs === 2)
    },
    showSign () {
      return !this.userInfo.address
    },
    isOwner () {
      return this.ldbNftOwner || this.crowdsaleOwner
    },
    account () {
      return this.$root.$children[0].web3Opt.address
    }
  },
  components: {
    ImgBox,
    LdButton,
    SketchFab,
    LdLoading,
    UserAvatar,
    Authorize,
    OrderDialog
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
      // this.loading = true
      // const res = await getLdbById({ id, pula: 'ldbIcon' })
      // if (res.code === 1000) this.ldbInfo = Object.assign({}, this.ldbInfo, { user: this.userInfo }, res.data, { ocs: 1 })
      // else this.errorMsg = res.errorMsg || '未知错误'
      // this.loading = false
      const ldbs = this.$root.$children[0].ldbs
      for (const item of ldbs) {
        if (item._id === id) {
          this.ldbInfo = item
          this.sellModel = item.chainSystem.value
          window.ldbInfo = item
          break
        }
      }

      this.$emit('initInfo')
    },

    // 初始化状态
    initStatus () {
      this.loading = false
      this.errorMsg = null
    },

    // 初始化组件
    init () {
      this.getLdbInfo(this.ldbId)
    },

    // 购买建筑
    async buy () {
      try {
        // 检查市场权限
        const authorize = await this.$refs.authorize.checkoutAuthorize()
        if (!authorize) return

        const tokenId = this.ldbInfo.tokenID
        const ldbNFTCrowdsaleContract = this.ldbNFTCrowdsaleContract
        window.ldbNFTCrowdsaleContract = ldbNFTCrowdsaleContract

        // 根据 tokenID 获取建筑链上信息
        const ldb = await ldbNFTCrowdsaleContract.getAuction(tokenId)
        const { address } = this.$root.$children[0].web3Opt
        console.log('ldb', address, ldb[1].toNumber(), address, tokenId)

        this.contractLoading = true
        // 根据链上信息购买建筑
        ldbNFTCrowdsaleContract.payByEth(tokenId, {
          from: address,
          value: ldb[1]
        })
          .then(crowdsaleTx => {
            console.log('crowdsaleTx', crowdsaleTx)
            this.ldbInfo.chainSystem.sellStatus = 0
            setTimeout(() => {
              this.contractLoading = false
              this.orderModel = true
              this.checkOwner()
            }, 5000)
          })
          .catch(() => {
            this.contractLoading = false
          })
      } catch (err) {
        console.log('err', err)
        this.contractLoading = false
      }
    },

    async sell () {
      try {
        const authorize = await this.$refs.authorize.checkoutAuthorize()
        if (!authorize) return
        const tokenId = this.ldbInfo.tokenID
        // const buildingContract = this.buildingContract
        // const building = await buildingContract.building(tokenId)
        // console.log('building', building)
        const ldbNFTCrowdsaleContract = this.ldbNFTCrowdsaleContract
        const { web3js } = this.$root.$children[0].web3Opt
        const { value } = this.ldbInfo.chainSystem
        console.log('--- sell value', value, tokenId)

        this.contractLoading = true
        ldbNFTCrowdsaleContract.newAuction(web3js.toWei(value), tokenId, Math.floor(new Date().getTime() / 1000) + 3600)
          .then(ntfCrowdsaleTx => {
            console.log('sell ntfCrowdsaleTx', ntfCrowdsaleTx)
            this.ldbInfo.chainSystem.sellStatus = 1
            setTimeout(() => {
              this.checkOwner()
              this.contractLoading = false
            }, 5000)
          })
          .catch(() => {
            this.contractLoading = false
          })
        console.log('ldbNFTCrowdsaleContract', ldbNFTCrowdsaleContract)
      } catch (err) {
        console.log('err', err)
        this.contractLoading = false
      }
    },

    async unsell () {
      try {
        const authorize = await this.$refs.authorize.checkoutAuthorize()
        if (!authorize) return
        const tokenId = this.ldbInfo.tokenID
        const buildingContract = this.buildingContract
        const building = await buildingContract.building(tokenId)
        console.log('building', building)
        const ldbNFTCrowdsaleContract = this.ldbNFTCrowdsaleContract

        this.contractLoading = true
        ldbNFTCrowdsaleContract.cancelAution(tokenId)
          .then(ntfCrowdsaleTx => {
            console.log('unsell ntfCrowdsaleTx', ntfCrowdsaleTx)
            this.ldbInfo.chainSystem.sellStatus = 0
            setTimeout(() => {
              this.checkOwner()
              this.contractLoading = false
            }, 5000)
          })
          .catch(() => {
            this.contractLoading = false
          })
        console.log('ldbNFTCrowdsaleContract', ldbNFTCrowdsaleContract)
      } catch (err) {
        console.log('err', err)
        this.contractLoading = false
      }
    },

    // async pushChain () {
    //   try {
    //     const { address } = this.$root.$children[0].web3Opt
    //     const { lat, lng } = this.ldbInfo.chainSystem
    //     const { level } = this.ldbInfo.levelSystem
    //     const ldbNFTContract = this.ldbNFTContract
    //     const buildingContract = this.buildingContract
    //     console.log('ldbNFTContract', ldbNFTContract, buildingContract)
    //     const tokenId = (await ldbNFTContract.totalSupply()).toNumber()
    //     console.log('--- tokenId', tokenId)
    //     this.ldbInfo.tokenID = tokenId
    //     window.ldbInfo = this.ldbInfo
    //     ldbNFTContract.mint(address, tokenId)
    //       .then(ldfTx => {
    //         console.log('ldfTx', ldfTx)

    //         // 坐标转换为整数
    //         console.log('---', this.getFullCoord(lat), this.getFullCoord(lng), tokenId, this.ldbInfo)
    //         // 如果是正式环境，合约不会立即执行完成，需要等待合约结果之后才可以赋值
    //         buildingContract.build(tokenId, this.getFullCoord(lng, 10), this.getFullCoord(lat, 10), level)
    //           .then(buildTx => {
    //             console.log('buildTx', buildTx)
    //             this.ldbInfo.ocs = 2
    //           })
    //       })
    //   } catch (err) {
    //     console.log('err', err)
    //   }
    // },

    /**
     * 传入小数，返回对应位数的字符串小数
     */
    getFullCoord (coord, bit = 14) {
      // 直接 toFixed 会造成小数改变,所以需要分解之后
      let [ int, decimal ] = coord.toString().split('.')
      decimal = parseFloat(`0.${decimal}`).toFixed(bit).slice(2)
      return parseInt(int + decimal)
    },

    checkOwner () {
      this.checkLdbNft()
      this.checkCrowdsale()
    },

    /**
     * 检查 721 资产状态
     */
    checkLdbNft (ldbNFTContract = this.ldbNFTContract) {
      if (!ldbNFTContract) return ldbNFTContract
      // 检查该 721 资产是否属于当前 metamask 用户
      ldbNFTContract.ownerOf(this.ldbInfo.tokenID)
        .then(d => {
          this.ldbNftOwner = d === this.account
          console.log('ldbNftOwner:', d === this.account)
        })
        .catch(() => {
          this.ldbNftOwner = false
        })
    },

    /**
     * 检查 721 资产市场状态
     */
    checkCrowdsale (ldbNFTCrowdsaleContract = this.ldbNFTCrowdsaleContract) {
      if (!ldbNFTCrowdsaleContract) return false

      // 检查该 721 资产是否在市场出售
      ldbNFTCrowdsaleContract.isOnAuction(this.ldbInfo.tokenID)
        .then(d => {
          this.isSell = d
          console.log('isSell:', d)
        })
        .catch(() => {
          this.isSell = false
        })

      // 检查该 721 资产是否属于当前 metamask 用户出售
      ldbNFTCrowdsaleContract.getAuction(this.ldbInfo.tokenID)
        .then(d => {
          this.crowdsaleOwner = d[0] === this.account
          console.log('crowdsaleOwner:', d[0] === this.account)
        })
        .catch(() => {
          this.crowdsaleOwner = false
        })
    }
  },
  watch: {
    ldbId (val) {
      if (val) this.getLdbInfo(val)
    },
    ldbNFTContract (val) {
      if (val) {
        this.checkLdbNft(val)
      }
    },
    ldbNFTCrowdsaleContract (val) {
      if (val) {
        this.checkCrowdsale(val)
      }
    },
    account (val) {
      this.contractLoading = false
      if (val) {
        this.checkOwner()
      }
    }
  },
  mounted () {
    this.$nextTick(() => this.$emit('mounted'))
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/color_mixin.scss';
  @import '@/assets/stylus/mixin/class_mixin.scss';

  @mixin detail-theme($theme: 'light') {
    @if $theme == 'light' {
      background-color: #f4f4f4;
      .ldb-price {
        color: $--secondary-color;
      }
      .history-header {
        color: #fff;
        background-color: $--main-color;
      }
      .history-cnt-box {
        color: $--text-main-color;
        background-color: #fff;
      }
    }
    @if $theme == 'dark' {
      color: #E6E8EC;
      background-color: #101010;
      .lord-name {
        color: #fff;
      }
      .container {
        @include bg-img-class('~/static/img/utils/lordless-map-bg.png', repeat, auto);
      }
    }
    @if $theme == 'gray' {
      color: #E6E8EC;
      background-color: #2b2b2b;
      .lord-name {
        color: #E6E8EC;
      }
      .container {
        @include bg-img-class('~/static/img/utils/lordless-map-bg.png', repeat, auto);
      }
    }
    @if $theme == 'default' {
      color: #E6E8EC;
      background-color: $--default-bg-color;
      .lord-name {
        color: #E6E8EC;
      }
      .lord-address {
        color: #d6d6d6;
      }
      .detail-cnt-box {
        background-image: linear-gradient(top, #240864, #4D33A7);
      }
      .container {
        @include bg-img-class('~/static/img/utils/lordless-map-bg.png', repeat, auto);
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
    // &::before, &::after {
    //   content: '';
    //   position: absolute;
    //   top: 0;
    //   width: 50%;
    //   height: 100%;
    //   z-index: 0;
    // }
    // &::before {
    //   left: 0;
    //   @include bg-img-class('~/static/img/test/fandian-left.png', repeat-x, contain);
    // }
    // &::after {
    //   right: 0;
    //   @include bg-img-class('~/static/img/test/fandian-right.png', repeat-x, contain);
    // }
    >div {
      position: relative;
      z-index: 1;
    }
  }
  // .detail-fab {
  //   width: 100%;
  // }

  .detail-cnt-box {
    @include padding('top', 80px, 1.25);
    @include padding('bottom', 100px, 1.25);
    @include fontSize(16px, 1);
    .container {
      max-width: 1000px;
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
    @include fontSize(16px, 1);
  }
  .user-avatar {
    @include margin('left', 15px, 1);
    >svg {
      fill: #fff;
      width: 56px;
      height: 56px;
    }
  }

  .ldb-msg {
    @include margin('top', 10px, 1);
    @include fontSize(24px, 1);
  }

  .ldb-desc {
    line-height: 1.6;
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
      @include margin('left', 30px, -2);
    }
  }
  // .sell-input {
  //   width: 80px;
  //   height: 40px;
  // }
  .features-btn {
    // text-align: right;
    button {
      border-radius: 25px;
      @include margin-around(0, 0, 0, 15px, 1);
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
    @include padding-around(15px, 40px, 15px, 30px, 1);
    @include fontSize(24px, 1);
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
