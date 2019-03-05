<template>
  <div class="lordless-referee-box">
    <transition name="ld-hide-fade" mode="out-in">
      <referee-skeletion v-if="loading"/>
      <div v-else class="lordless-referee-container">
        <lordless-fixed :top="44">
          <div class="d-flex f-auto-center lordless-referee-header">
            <div class="TTFontBolder v-flex referee-header-container">
              <p class="header-address-tip" :class="{ 'is-failed': (referrerInputModel && !isRequireReferrer && editedReferrer) || isReferrerOwner || isAddressReferrer }">{{ headerAddressTip }}</p>
              <div class="d-flex f-align-center referee-header-info">
                <div class="v-flex referee-header-left">
                  <input
                    v-if="isShowInput"
                    v-model="referrerInputModel"
                    aria-label="input text"
                    class="lordless-input referee-header-input"
                    ref="referee-input"
                    type="text"
                    :maxlength="42"
                    placeholder="Enter an address"
                    @focus="referrerInputFocus"
                    @blur="referrerInputBlur"/>
                  <div v-else class="referee-address-box">
                    <!-- 如果 referrer 是从数据库中获取的, 或者是从 query 获取的有效地址 -->
                    <h2 v-if="(!referrerAddress && !isShowInput) || (!editedReferrer && (refereeInfo.referrer || queryReferrer))" class="v-flex">
                      <span v-if="referrerAddress">{{ referrerAddress | splitAddress({ before: 6, end: 4, symbol: '******' }) }}</span>
                      <span v-else>No referrer</span>
                    </h2>
                    <p v-else class="TTFontBold text-break break-referee-address">{{ referrerAddress }}</p>
                  </div>
                </div>

                <div class="referee-header-right">
                  <p v-if="isEditReferrer && !isShowInput && (!isQueryReferrer || !isRequireReferrer)"
                    class="referee-header-control"
                    @click.stop="editReferrer">
                    {{ referrerAddress ? 'Edit' : 'Add referrer' }}
                  </p>
                  <lordless-blockies v-else-if="!isEditReferrer || isQueryReferrer" :seed="referrerAddress" theme="light" :scale="4"/>
                </div>
              </div>
            </div>
          </div>
        </lordless-fixed>
        <div class="lordless-referee-cnt">
          <div class="TTFontBolder d-flex col-flex f-auto-center referee-cnt-top">
            <span class="inline-block line-height-0 referee-cnt-icon">
              <svg>
                <use :xlink:href="tipsStatus.icon"/>
              </svg>
            </span>
            <h3>{{ tipsStatus.title }}</h3>
            <p>{{ tipsStatus.desc }}</p>
          </div>
          <ul class="invitation-reward-box">
            <li class="d-flex f-align-center invitation-reward-item"
              v-for="(item, index) of rewards" :key="index">
              <span class="inline-block line-height-0">
                <svg>
                  <use :xlink:href="item.cntIcon"/>
                </svg>
              </span>
              <div class="v-flex reward-item-info">
                <h3 class="relative">{{ item.title }}</h3>
                <p v-html="item.desc" class="reward-item-desc"></p>
              </div>
            </li>
          </ul>
          <div class="invitation-reward-tips">
            <p class="d-flex f-align-center">
              <span class="inline-block line-height-0 invitation-tips-icon">
                <svg>
                  <use xlink:href="#icon-tips"/>
                </svg>
              </span>
              <span>Tips</span>
            </p>
            <p>The materials can be made into Bounty Chest which can be sold or opened.</p>
            <p>HELD, HOPS earned on every LESS per deposit, describes the income of the deposit.</p>
          </div>
          <div class="text-center invitation-tg-group-box">
            <span class="inline-block line-height-0 tg-group-icon">
              <svg>
                <use xlink:href="#icon-referral-telegram"/>
              </svg>
            </span>
            <h3>
              <a href="https://t.me/lordless_global" target="_blank" class="text-underline">LORDLESS Global Group</a>
            </h3>
            <p>{{ telegramStatus.text }}</p>
          </div>
        </div>
        <lordless-fixed :bottom="0" v-if="!isBinded && this.referrerAddress">
          <lordless-btn
            class="lordless-bottom-btn"
            theme="blue-linear"
            :loading="btnLoading"
            :disabled="btnLoading || isTxPending || !isRequireReferrer"
            @click="confirmInvitation">
            {{ refererBtnText }}
          </lordless-btn>
        </lordless-fixed>
      </div>
    </transition>
  </div>
</template>

<script>
import RefereeSkeletion from '@/components/skeletion/_mobile/referee'

import { getRefereeInfo } from 'api'
import { metamaskMixins, publicMixins, initLoadingMixins } from '@/mixins'
import { mapState } from 'vuex'
export default {
  name: 'lordless-referee-component',
  mixins: [ metamaskMixins, publicMixins, initLoadingMixins ],
  data: () => {
    return {
      rendered: false,
      refereeInfo: {},
      btnLoading: false,
      userReferees: [],

      // referrer input options
      referrerInputModel: '',
      isShowInput: false,
      editedReferrer: false,
      isInputBlur: false,

      isTxPending: false,
      addressRegex: /^(0x)[a-fA-F0-9]{40}$/,
      rewards: [
        {
          title: 'Material reward',
          cntIcon: '#icon-referral-handshake',
          desc: 'After the confirmation you will get <span>10,000 LESS material.</span>'
        }, {
          title: 'HOPS deposit reward',
          cntIcon: '#icon-referral-reward',
          desc: 'Get a <span>HELD boost</span> in LESS Term Deposit.'
        }
      ]
    }
  },
  computed: {
    ...mapState('contract', [
      'Referer'
    ]),
    ...mapState('web3', [
      'web3Opt'
    ]),

    // referrer 地址
    referrerAddress () {
      return this.refereeInfo.referrer || (this.editedReferrer ? this.referrerInputModel : this.queryReferrer || '')
    },

    // 通过 query 传入的 referrer 地址
    queryReferrer () {
      let str = this.$route.query.r || ''
      if (str.match(this.addressRegex)) return str
      return ''
    },

    // 判断 referrer 地址是否是自身
    isReferrerOwner () {
      return this.account === this.referrerAddress.toLocaleLowerCase()
    },

    // 判断自己是否是地址的referrer
    isAddressReferrer () {
      return this.userReferees.includes(this.referrerAddress.toLocaleLowerCase())
    },

    // referrer 地址是否有效
    isRequireReferrer () {
      return this.referrerAddress.match(this.addressRegex) && !this.isReferrerOwner && !this.isAddressReferrer
    },

    // 是否可编辑 referrer 地址
    isEditReferrer () {
      return !this.refereeInfo.referrer
    },

    // 是否使用 query 传入的 referrer 地址
    isQueryReferrer () {
      return this.isEditReferrer && this.queryReferrer
    },

    // 是否已经绑定
    isBinded () {
      return this.refereeInfo.refererTx && this.refereeInfo.refererTx.status === 1
    },

    refererBtnText () {
      switch (true) {
        case this.isTxPending:
          return 'Pending'
        case this.isReferrerOwner:
          return 'Can‘t owner address'
        case this.isAddressReferrer:
          return 'Can‘t your referee'
        case this.isRequireReferrer:
          return 'Confirm invitation'
        default:
          return 'Invalid address'
      }
    },

    headerAddressTip () {
      let str = 'Referrer address'
      console.log('------ referrerAddress', this.referrerAddress)
      switch (true) {
        case this.isRequireReferrer && !this.isEditReferrer:
          str = 'Invitation address'
          break
        case this.isReferrerOwner:
          str = 'Can‘t owner address'
          break
        case this.isAddressReferrer:
          str = 'Can‘t your referee'
          break
        case this.referrerAddress && !this.isRequireReferrer:
          str = 'Invalid address'
          break
        default:
          str = 'Referrer address'
          break
      }
      return str
    },

    // 内容状态数据
    tipsStatus () {
      const { referrer, refererTx = {} } = this.refereeInfo
      let obj = {}
      switch (true) {
        case this.isTxPending:
          obj = {
            icon: '#icon-airplane',
            title: 'Your invitation is pending',
            desc: 'Please be patient and wait for a moment.'
          }
          break
        case this.isBinded:
          obj = {
            icon: '#icon-bounty-chest-checked',
            title: 'You have already been a referee.',
            desc: 'Now you can enjoy your rights below.'
          }
          break
        case this.isQueryReferrer && this.isRequireReferrer:
          obj = {
            icon: '#icon-target',
            title: 'One more step',
            desc: 'Confirm the invitation via a transaction.'
          }
          break
        case referrer && refererTx.status !== 1:
          obj = {
            icon: '#icon-pencils',
            title: 'Overlapping invitation',
            desc: 'You can only confirm the original invitation.'
          }
          break
        default:
          obj = {
            icon: '#icon-color-certificate',
            title: 'Become a referee',
            desc: 'The rewards below are waiting for you.'
          }
      }
      return obj
    },

    // telegram 状态数据
    telegramStatus () {
      let obj = {}
      switch (true) {
        case this.isBinded:
          obj = {
            text: 'Communicate with more people.'
          }
          break
        default:
          obj = {
            text: 'Have no address? Choose one from our users.'
          }
      }
      return obj
    }
  },
  watch: {
    account (val, oval) {
      if (val && oval) {
        this.checkUserReferrer()
      }
    }
  },
  components: {
    RefereeSkeletion
  },
  methods: {
    referrerInputFocus () {
      this.isInputBlur = false
    },

    referrerInputBlur () {
      this.isShowInput = false
      this.isInputBlur = true
    },

    editReferrer () {
      this.isShowInput = true
      this.referrerInputModel = this.referrerAddress
      this.editedReferrer = true
      this.$nextTick(() => {
        this.$refs['referee-input'].focus()
      })
    },

    initReferee () {
      this.checkUserReferrer()
    },

    async checkUserReferrer () {
      this.loading = true
      try {
        const res = await getRefereeInfo()
        if (res.code === 1000) {
          this.refereeInfo = res.data || {}
          this.userReferees = res.referees

          const refereeTxKey = `lordless_referee_${this.account}_tx`
          const refereeTx = localStorage.getItem(refereeTxKey)
          console.log('------- checkUserReferrer', refereeTxKey, refereeTx)
          if (res.data && res.data.refererTx.status === 1) {
            refereeTx && localStorage.removeItem(refereeTxKey)

            // 如果该用户在 localStorage 中存入了 tx,并且 refererTx.status 还是 0, 则 isTxPending 为 true
          } else if (refereeTx) {
            this.isTxPending = true
          }
        }
      } catch (err) {
        console.log('------ err', err.message)
      }
      this.loading = false
    },

    // 提交 invitation
    async confirmInvitation (referrerAddress = this.referrerAddress, account = this.account, Referer = this.Referer, web3Opt = this.web3Opt) {
      if (!this.isRequireReferrer || this.btnLoading || !Referer) return
      this.btnLoading = true
      this.metamaskChoose = true
      try {
        const refererParam = {
          name: 'addReferer',
          values: [ referrerAddress ]
        }
        const { gasPrice } = web3Opt
        const gas = (await Referer.estimateGas(refererParam.name, refererParam.values)) || 139999

        const params = {
          gas,
          gasPrice,
          data: Referer[refererParam.name].getData(referrerAddress),
          // memo: 'buy a tavern by lordless',
          // feeCustomizable: true,
          value: 0,
          to: Referer.address,
          from: account
        }

        // console.log('params', params)

        // 使用自有封装对象
        window.lordlessMethods.buy(params).then(async tx => {
          // console.log('tx', tx)

          this.metamaskChoose = false
          this.btnLoading = false
          const refereeTxKey = `lordless_referee_${this.account}_tx`
          localStorage.setItem(refereeTxKey, tx)
          this.isTxPending = true
        })
          .catch((err) => {
            console.log('err', err.message)
            this.metamaskChoose = false
            this.btnLoading = false
          })
      } catch (err) {
        this.$notify.error({
          title: 'Error!',
          message: err.message || 'unknow error',
          position: 'bottom-right',
          duration: 3500
        })
      }
    }
  },
  activated () {
    if (!this.rendered) {
      this.rendered = true
      return
    }
    this.initReferee()
  },
  mounted () {
    this.$nextTick(() => this.initReferee())
  }
}
</script>
<style lang="scss" scoped>
  .lordless-referee-header {
    padding: 8px 20px 0;
    height: 80px;
    background-color: $--main-blue-color;
    box-sizing: border-box;
  }
  .referee-header-container {
    padding: 0 20px;
    font-size: 14px;
    color: #fff;
  }
  .header-address-tip {
    &.is-failed {
      color: #F5515F;
    }
  }
  .referee-header-info {
    margin-top: 2px;
  }
  .referee-header-input {
    font-family: $--font-TTNormsBold;
    font-size: 24px;
    &::placeholder {
      color: rgba(255, 255, 255, .25);
    }
  }
  .referee-address-box {
    >h2 {
      font-size: 24px;
    }
    >p {
      font-size: 14px;
    }
  }
  .break-referee-address {
    padding-right: 24px;
  }
  .referee-header-right {
    margin-left: 24px;
  }
  .referee-header-control {
    font-size: 16px;
    // margin-left: 12px;
  }


  /**
   *  lordless-referee-cnt  -- begin
   */
  .lordless-referee-cnt {
    padding: 124px 20px 0;
  }
  .referee-cnt-top {
    margin-top: 64px;
    >h3 {
      margin-top: 36px;
      color: $--main-color;
    }
    >p {
      margin-top: 8px;
      font-size: 16px;
      color: #555;
    }
  }
  .referee-cnt-icon {
    width: 120px;
    height: 120px;
  }

  //  invitation-reward-box
  .invitation-reward-box {
    margin-top: 36px;
    color: #555;
  }
  .invitation-reward-item {
    >span {
      width: 64px;
      height: 64px;
    }
    &:not(:first-of-type) {
      margin-top: 32px;
    }
  }
  .reward-item-info {
    margin-left: 16px;
    color: #555;
    >h3 {
      padding-left: 12px;
      font-size: 20px;
      color: $--main-color;
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        width: 6px;
        height: 12px;
        background-color: $--main-blue-color;
        transform: translateY(-50%);
      }
    }
  }
  .reward-item-desc {
    font-size: 16px;
    /deep/ {
      >span {
        font-family: $--font-TTNormsBold;
        color: $--main-blue-color;
      }
    }
  }
  .invitation-reward-tips {
    margin-top: 50px;
    >p {
      color: #777;
      font-size: 12px;
      &:first-of-type {
        font-size: 14px;
        color: #555;
      }
      &:not(:first-of-type) {
        margin-top: 8px;
      }
    }
  }
  .invitation-tips-icon {
    margin-right: 6px;
    width: 12px;
    height: 12px;
    fill: #777;
  }

  // invitation-tg-group-box
  .invitation-tg-group-box {
    margin-top: 32px;
    padding: 32px 0 84px;
    >h3 {
      margin-top: 24px;
      font-size: 16px;
      color: #555;
    }
    >p {
      margin-top: 8px;
      font-size: 14px;
      color: #777;
    }
  }
  .tg-group-icon {
    width: 72px;
    height: 63px;
    fill: #555;
  }
  /**
   *  lordless-referee-cnt  -- end
   */
</style>
