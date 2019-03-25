<template>
  <div class="relative alone-layer tavern-recruits-box">
    <transition name="ld-hide-fade" mode="out-in">
      <section v-if="!loading && !recruitsLoading" class="d-flex col-flex f-align-ceter sm-col-flex detail-tavern-recruits">
        <div class="tavern-recruits-cnt">
          <div class="d-flex f-align-center recruits-cnt-top">
            <div class="v-flex recruits-limit-box">
              <p>Recruits / Maximum limit</p>
              <h3>
                <span class="recruits-current-limit" :class="{ 'color-blue': info.recruits.hunterMembers !== info.recruits.maxHunterMembers, 'color-gray': info.recruits.hunterMembers >= info.recruits.maxHunterMembers }">{{ info.recruits.hunterMembers }}</span> <span :class="{ 'color-red': info.recruits.hunterMembers / info.recruits.maxHunterMembers > 0.9 }">/ {{ info.recruits.maxHunterMembers || 60 }}</span>
              </h3>
            </div>
            <div class="alone-layer recruits-tavern-level">
              <img class="full-width" :alt="`tavern popularity ${info.chain.popularity}`" :src="`/img/tavern/ldb-level-${info.chain.popularity}.png` | originSource({ size: 450 })"/>
            </div>
          </div>
          <div class="d-flex col-flex f-auto-center recruits-cnt-bottom">
            <p>Recruit boost comparison</p>
            <div class="d-flex f-align-center recruits-boosts-box">
              <div class="v-flex recruits-boosts-item">
                <h3 class="text-nowrap">+ {{ info.chain.popularity }}%</h3>
                <p>Tavern’s</p>
              </div>
              <p class="v-flex recruits-boosts-vs">VS.</p>
              <div class="v-flex recruits-boosts-item">
                <h3 class="text-nowrap">+ {{ userHome ? userHome.homeInfo.tavern.chain.popularity : 0 }}%</h3>
                <p>Yours</p>
              </div>
            </div>
          </div>
        </div>
        <div class="tavern-recruit-btns">
          <lordless-btn
            v-if="recruitBtnInfo.show"
            class="tavern-recruit-btn"
            theme="purple-linear"
            :loading="furtherLoading"
            :disabled="furtherLoading || recruitBtnInfo.pending || recruitBtnInfo.disabled"
            @click="recruitHome">
            <span>{{ recruitBtnInfo.text }}</span>
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
import RecruitReminderDialog from '@/components/reuse/dialog/recruit/reminder'
import { mapState } from 'vuex'
import { metamaskMixins, publicMixins, checkTokensBalanceMixins } from '@/mixins'
export default {
  name: 'website-tavern-recruits',
  mixins: [ metamaskMixins, publicMixins, checkTokensBalanceMixins ],
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
      recruitsLoading: false,

      // recruit btn options
      furtherLoading: true,
      recruitPending: false,
      dialogModel: false,
      recruitBtnInfo: {
        text: 'Get recruited',
        show: true,
        pending: false
      },
      recruitedTokenBets: []
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
    furtherInit () {
      return !this.web3Opt.loading && this.web3Opt.isConnected && !!this.Recruited && !!this.info.id
    },
    isFullWarn () {
      return this.info && (this.info.recruits.hunterMembers / this.info.recruits.maxHunterMembers) > 0.9
    },
    enoughHopsFee () {
      return this.info.recruits.fee
    }
  },
  watch: {
    info (val) {
      console.log('----------- further info watch', val, this.furtherInit)
      val && val.id && this.init()
    },
    furtherInit (val) {
      val && this.init()
    }
  },
  components: {
    RecruitReminderDialog
  },
  methods: {
    async checkRecruitTavernInfo (info = this.info, Recruited = this.Recruited) {
      this.furtherLoading = true
      const candySymbols = this.candySymbols.list

      const result = await Recruited.methods('checkHomeInfo', [ info.id ])
      const hopsAddress = await Recruited.methods('hopsAddress')
      console.log(' ========= candySymbols', candySymbols, info.id)

      if (!info.id) return []
      this.recruitedTokenBets = [
        {
          candy: hopsAddress,
          count: result[2].toNumber() || 1000e18 * info.chain.popularity
        }
      ]

      console.log('------ result', result, hopsAddress, result[2].toNumber(), this.recruitedTokenBets)
      this.furtherLoading = false
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
      if (!this.furtherInit) return

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
      if (!this.furtherInit) return

      this.furtherLoading = true
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
          this.furtherLoading = false

          this.recruitPending = true
          this.$nextTick(() => this.initRecruitBtnInfo())
        })
          .catch((err) => {
            console.log('err', err.message)
            this.metamaskChoose = false
            this.furtherLoading = false
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
      this.furtherLoading = true
      this.recruitPending = false
    }
  },
  beforeDestroy () {
    console.log('-=========== further beforeDestroy')
    this.initStatus()
  },
  mounted () {
    console.log('------------ further mounted')
    this.$nextTick(() => this.init())
  }
}
</script>

<style lang="scss" scoped>
  .tavern-recruits-box {
    // overflow: hidden;
  }
  .tavern-recruits-cnt {
    padding: 16px 18px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 3px 10px 2px rgba(0, 0, 0, .15);
  }
  .recruits-cnt-top {
    padding-bottom: 16px;
    border-bottom: 1px solid #ddd;
  }
  .recruits-limit-box {
    font-size: 14px;
    color: #777;
    >h3 {
      margin-top: 2px;
      font-size: 16px;
    }
  }
  .recruits-current-limit {
    // color: $--main-blue-color;
  }
  .recruits-tavern-level {
    width: 48px;
    height: 48px;
    line-height: 1;
  }

  // recruits-cnt-bottom
  .recruits-cnt-bottom {
    padding-top: 12px;
    font-size: 14px;
    color: #777;
  }
  .recruits-boosts-box {
    margin-top: 12px;
    line-height: 1.2;
  }
  .recruits-boosts-item {
    >h3 {
      font-size: 20px;
      color: $--main-color;
    }
  }
  .recruits-boosts-vs {
    margin: 0 24px;
  }

  .tavern-recruit-btn {
    margin-top: 12px;
    width: 100%;
    height: 50px;
  }
</style>
