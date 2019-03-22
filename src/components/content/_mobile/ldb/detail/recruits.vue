<template>
  <div class="relative alone-layer tavern-recruits-box">
    <transition name="ld-hide-fade" mode="out-in">
      <section v-if="!loading" class="d-flex col-flex f-align-ceter sm-col-flex detail-tavern-recruits">
        <h2 class="detail-mobile-title">Recruits</h2>
        <div class="tavern-recruits-bottom">
          <div class="tavern-recruits-cnt">
            <ul class="tavern-recruit-ul">
              <li class="d-flex f-align-center tavern-recruit-item"
                :class="{ 'has-line': item.line }"
                v-for="(item, index) of recruits" :key="index"
                @click.stop="item.path ? $router.push(item.path): null">
                <span class="v-flex">{{ item.text }}</span>
                <span :class="{ 'color-main': !item.blueValue, 'color-blue': item.blueValue }">{{ item.value }}</span>
                <span v-if="item.path" class="inline-block line-height-0 recruit-arrow-icon">
                  <svg>
                    <use xlink:href="#icon-arrow-line-right"/>
                  </svg>
                </span>
              </li>
            </ul>
          </div>
          <lordless-btn
            v-if="recruitBtnInfo.show"
            class="v-flex tavern-recruits-btn"
            theme="blue"
            inverse
            :loading="recruitsLoading"
            :disabled="recruitsLoading || recruitBtnInfo.pending || recruitBtnInfo.disabled"
            @click="recruitHome">
            {{ recruitBtnInfo.text }}
          </lordless-btn>
        </div>
      </section>
    </transition>
    <recruit-reminder-dialog v-model="dialogModel" @confirm="dialogConfirm"/>
    <lordless-authorize
      ref="recruitedAuthorize"
      blurs
      tokenAllowanceType="recruited"
      :tokenBets="recruitedTokenBets"/>
  </div>
</template>

<script>
// import { getTavernkeeps } from 'api'
import RecruitReminderDialog from '@/components/reuse/dialog/recruit/reminder'

import { weiByDecimals, formatMoneyNumber } from 'utils/tool'
import { mapState } from 'vuex'
import { metamaskMixins, publicMixins } from '@/mixins'
export default {
  name: 'mobile-tavern-recruits',
  mixins: [ metamaskMixins, publicMixins ],
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    },

    loading: {
      type: Boolean,
      default: false
    }
  },
  data: (vm) => {
    return {
      recruitsLoading: true,
      recruitPending: false,
      dialogModel: false,
      recruitBtnInfo: {
        text: 'Get recruited',
        show: true,
        pending: false
      },
      recruitedTokenBets: [],
      hopsFee: 0
    }
  },
  computed: {
    ...mapState('user', [
      'userHome'
    ]),
    ...mapState('web3', [
      'web3Opt'
    ]),
    ...mapState('contract', [
      'Recruited'
    ]),
    ...mapState('layout', [
      'blurs'
    ]),
    ...mapState('candy', [
      'candySymbols'
    ]),
    recruitsInit () {
      return !this.web3Opt.loading && this.web3Opt.isConnected && !!this.Recruited && !!this.info.id
    },
    isFullWarn () {
      return this.info && (this.info.recruits.hunterMembers / this.info.recruits.maxHunterMembers) > 0.9
    },
    recruits () {
      const info = this.info
      if (!info.id) return []
      return [
        {
          text: 'Recruits',
          value: (info.recruits.hunterMembers || '0').toLocaleString(),
          path: `/recruits/${info.id}`
        },
        {
          text: 'Commissions',
          path: `/commissions/${info.id}`,
          line: true
        },
        {
          text: 'Max recruits',
          value: (info.recruits.maxHunterMembers || '0').toLocaleString()
        },
        {
          text: 'Recruit boost',
          value: `${(info.chain.popularity - 1) * 0.5 + 3}%`
        },
        {
          text: 'HOPS cost',
          value: formatMoneyNumber(weiByDecimals((this.hopsFee || this.info.recruits.fee))),
          blueValue: true
        }
      ]
    }
  },
  watch: {
    info (val) {
      console.log('----------- recruits info watch', val, this.recruitsInit)
      val && val.id && this.init()
    },
    recruitsInit (val) {
      val && this.init()
    }
  },
  components: {
    RecruitReminderDialog
  },
  methods: {
    async checkRecruitTavernInfo (info = this.info, Recruited = this.Recruited) {
      this.recruitsLoading = true
      const candySymbols = this.candySymbols.list
      console.log('--------- come in checkRecruitTavernInfo', Recruited)

      let result = await Recruited.methods('checkHomeInfo', [ info.id ])
      const hopsAddress = await Recruited.methods('hopsAddress')
      console.log(' ========= candySymbols', candySymbols, info.id)

      if (!info.id) return []
      if (!result['0'] && !parseInt(result['1'])) {
        result = await Recruited.methods('checkOriginHomeInfo', [ info.id ])
      }
      this.recruitedTokenBets = [
        {
          candy: hopsAddress,
          count: result[2].toNumber() || info.recruits.fee
        }
      ]
      this.hopsFee = result[2].toNumber()

      console.log('------ result', result, hopsAddress, result[2].toNumber(), this.recruitedTokenBets)
      this.recruitsLoading = false
    },

    initRecruitBtnInfo (info = this.info, userHome = this.userHome) {
      const btnInfo = {
        text: 'Get recruited',
        show: true,
        pending: false,
        disabled: false
      }
      console.log('----------- initRecruitBtnInfo', info, userHome)
      if (!info) {
        btnInfo.show = false
      } else if (info.recruits.maxHunterMembers <= info.recruits.hunterMembers) {
        btnInfo.text = 'Full Members'
        btnInfo.disabled = true
      } else if (this.recruitPending) {
        btnInfo.text = 'Pending'
        btnInfo.pending = true
      } else if (userHome && userHome.homeInfo.tavern._id === info._id) {
        btnInfo.show = false
      } else if (userHome && userHome.homeInfo.tavern._id !== info._id) {
        btnInfo.text = 'Replace Tavern'
      }
      console.log('-------- btnInfo', btnInfo)
      this.recruitBtnInfo = btnInfo
    },

    async init (web3js = this.web3Opt.web3js) {
      if (!this.recruitsInit) return

      const recruitTxKey = 'lordless-recruit-tx'
      const recruitTx = localStorage.getItem(recruitTxKey)
      if (recruitTx) {
        web3js.eth.getTransactionReceipt(recruitTx, (err, res) => {
          let bool = false
          if (err) {
            bool = false
            return
          }
          bool = !!res
          if (bool) {
            localStorage.removeItem(recruitTxKey)
            this.checkRecruitTavernInfo()
          } else {
            this.recruitPending = true
          }
        })
      } else {
        this.checkRecruitTavernInfo()
      }

      this.$nextTick(() => this.initRecruitBtnInfo())
    },

    dialogConfirm () {
      this.dialogModel = false
      this.doRecruit()
    },

    async recruitHome (Recruited = this.Recruited) {
      try {
        const authorize = await this.$refs.recruitedAuthorize.checkoutAuthorize({ tokenAllowance: true })
        if (!authorize) return
        if (this.isFullWarn) {
          this.dialogModel = true
        } else this.doRecruit()
      } catch (err) {
        this.$notify.error({
          title: 'Error!',
          message: err.message || 'unknow error',
          position: 'bottom-right',
          duration: 3500
        })
      }
    },
    async doRecruit (account = this.account, info = this.info, web3Opt = this.web3Opt, Recruited = this.Recruited) {
      if (!this.recruitsInit) return

      this.recruitsLoading = true
      this.metamaskChoose = true

      try {
        const recruitedParam = {
          name: 'recruit',
          values: [ info.id ]
        }
        const { gasPrice } = web3Opt
        const gas = (await Recruited.estimateGas(recruitedParam.name, recruitedParam.values)) || 299999
        // const gas = 299999

        const params = {
          gas,
          gasPrice,
          data: Recruited[recruitedParam.name].getData(info.id),
          value: 0,
          to: Recruited.address,
          from: account
        }

        // console.log('params', params)

        // 使用自有封装对象
        window.lordlessMethods.buy(params).then(async tx => {
          // console.log('tx', tx)
          localStorage.setItem('lordless-recruit-tx', tx)

          this.metamaskChoose = false
          this.recruitsLoading = false

          this.recruitPending = true
          this.$nextTick(() => this.initRecruitBtnInfo())
        })
          .catch((err) => {
            console.log('err', err.message)
            this.metamaskChoose = false
            this.recruitsLoading = false
          })
      } catch (err) {
        this.$notify.error({
          title: 'Error!',
          message: err.message || 'unknow error',
          position: 'bottom-right',
          duration: 3500
        })
      }
    },
    initStatus () {
      this.recruitsLoading = true
      this.recruitPending = false
    }
  },
  deactivated () {
    this.initStatus()
  },
  beforeDestroy () {
    console.log('-=========== recruits beforeDestroy')
    this.initStatus()
  },
  mounted () {
    console.log('------------ recruits mounted')
    this.$nextTick(() => this.init())
  }
}
</script>

<style lang="scss" scoped>
  .tavern-recruits-box {
    // overflow: hidden;
  }
  .detail-mobile-title {
    margin-top: 28px;
    margin-bottom: 10px;
    font-size: 18px;
    color: $--main-color;
  }
  .tavern-recruits-bottom {
    border-radius: 5px;
    box-shadow: 0 2px 5px 0px rgba(0, 0, 0, .25);
  }
  .tavern-recruits-cnt {
    padding: 16px 18px;
    background-color: #fff;
  }

  // tavern-recruit-ul
  .tavern-recruit-ul {

  }
  .tavern-recruit-item {
    font-size: 16px;
    color: #555;
    &:not(:first-of-type) {
      margin-top: 18px;
    }
    &.has-line {
      padding-bottom: 18px;
      border-bottom: 1px solid #ddd;
    }
  }
  .recruit-arrow-icon {
    margin-left: 8px;
    width: 14px;
    height: 14px;
    fill: #bbb;
  }

  .tavern-recruits-btn {
    width: 100%;
    height: 48px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
</style>
