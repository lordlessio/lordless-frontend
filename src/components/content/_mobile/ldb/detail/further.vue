<template>
  <div>
    <!-- <lordless-fixed :bottom="0" v-if="!loading">
      <div class="d-flex f-align-center mobile-further-box" :class="{ 'lg-blur': blurs[0] }">
        <lordless-btn
          v-if="recruitBtnInfo.show"
          class="v-flex tavern-further-btn"
          theme="purple-linear"
          :loading="furtherLoading"
          :disabled="furtherLoading || recruitBtnInfo.pending || recruitBtnInfo.disabled"
          @click="recruitHome">
          {{ recruitBtnInfo.text }}
        </lordless-btn>
        <lordless-btn
          class="v-flex tavern-further-btn"
          theme="blue-linear">
            <a class="d-inline-flex f-align-center" :href="`https://opensea.io/assets/0x15820072729d045ec5232ba3bd060ec5df38e09a/${info.id}`" target="_blank">
              <span>{{ userHome ? 'Trade on OpenSea' : 'Trade' }}</span>
            </a>
          </lordless-btn>
      </div>
    </lordless-fixed>
    <recruit-reminder-dialog v-model="dialogModel" @confirm="dialogConfirm"/>
    <lordless-authorize
      ref="recruitedAuthorize"
      blurs
      tokenAllowanceType="recruited"
      :tokenBets="recruitedTokenBets"/> -->
  </div>
</template>

<script>
// import RecruitReminderDialog from '@/components/reuse/dialog/recruit/reminder'
// import { mapState } from 'vuex'
// import { metamaskMixins, publicMixins } from '@/mixins'
// export default {
//   mixins: [ metamaskMixins, publicMixins ],
//   props: {
//     info: {
//       type: Object,
//       default: () => {}
//     },
//     loading: {
//       type: Boolean,
//       default: false
//     }
//   },
//   data: () => {
//     return {
//       rendered: false,
//       furtherLoading: true,
//       recruitPending: false,
//       dialogModel: false,
//       recruitBtnInfo: {
//         text: 'Get recruited',
//         show: true,
//         pending: false
//       },
//       recruitedTokenBets: []
//     }
//   },
//   computed: {
//     ...mapState('user', [
//       'userHome'
//     ]),
//     ...mapState('web3', [
//       'web3Opt'
//     ]),
//     ...mapState('contract', [
//       'Recruited'
//     ]),
//     ...mapState('layout', [
//       'blurs'
//     ]),
//     ...mapState('candy', [
//       'candySymbols'
//     ]),
//     furtherInit () {
//       return !this.web3Opt.loading && this.web3Opt.isConnected && !!this.Recruited && !!this.info.id
//     },
//     isFullWarn () {
//       return this.info && (this.info.recruits.hunterMembers / this.info.recruits.maxHunterMembers) > 0.9
//     }
//   },
//   watch: {
//     info (val) {
//       console.log('----------- further info watch', val, this.furtherInit)
//       val && val.id && this.init()
//     },
//     furtherInit (val) {
//       val && this.init()
//     }
//   },
//   components: {
//     RecruitReminderDialog
//   },
//   methods: {
//     async checkRecruitTavernInfo (info = this.info, Recruited = this.Recruited) {
//       this.furtherLoading = true
//       const candySymbols = this.candySymbols.list

//       const result = await Recruited.methods('checkHomeInfo', [ info.id ])
//       const hopsAddress = await Recruited.methods('hopsAddress')
//       console.log(' ========= candySymbols', candySymbols, info.id)

//       if (!info.id) return []
//       this.recruitedTokenBets = [
//         {
//           candy: hopsAddress,
//           count: result[2].toNumber() || 1000e18 * info.chain.popularity
//         }
//       ]

//       console.log('------ result', result, hopsAddress, result[2].toNumber(), this.recruitedTokenBets)
//       this.furtherLoading = false
//     },

//     initRecruitBtnInfo (info = this.info, userHome = this.userHome) {
//       const btnInfo = {
//         text: 'Get recruited',
//         show: true,
//         pending: false,
//         disabled: false
//       }
//       console.log('----------- initRecruitBtnInfo', info, userHome)
//       if (!info) {
//         btnInfo.show = false
//       } else if (info.recruits.maxHunterMembers <= info.recruits.hunterMembers) {
//         btnInfo.text = 'Full Members'
//         btnInfo.disabled = true
//       } else if (this.recruitPending) {
//         btnInfo.text = 'Pending'
//         btnInfo.pending = true
//       } else if (userHome && userHome.homeInfo.tavern._id === info._id) {
//         btnInfo.show = false
//       } else if (userHome && userHome.homeInfo.tavern._id !== info._id) {
//         btnInfo.text = 'Replace Tavern'
//       }
//       console.log('-------- btnInfo', btnInfo)
//       this.recruitBtnInfo = btnInfo
//     },

//     async init (web3js = this.web3Opt.web3js) {
//       if (!this.furtherInit) return

//       const recruitTxKey = 'lordless-recruit-tx'
//       const recruitTx = localStorage.getItem(recruitTxKey)
//       if (recruitTx) {
//         web3js.eth.getTransactionReceipt(recruitTx, (err, res) => {
//           let bool = false
//           if (err) {
//             bool = false
//             return
//           }
//           bool = !!res
//           if (bool) {
//             localStorage.removeItem(recruitTxKey)
//             this.checkRecruitTavernInfo()
//           } else {
//             this.recruitPending = true
//           }
//         })
//       } else {
//         this.checkRecruitTavernInfo()
//       }

//       this.$nextTick(() => this.initRecruitBtnInfo())
//     },

//     dialogConfirm () {
//       this.dialogModel = false
//       this.doRecruit()
//     },

//     async recruitHome (Recruited = this.Recruited) {
//       try {
//         const authorize = await this.$refs.recruitedAuthorize.checkoutAuthorize({ tokenAllowance: true })
//         if (!authorize) return
//         if (this.isFullWarn) {
//           this.dialogModel = true
//         } else this.doRecruit()
//       } catch (err) {
//         this.$notify.error({
//           title: 'Error!',
//           message: err.message || 'unknow error',
//           position: 'bottom-right',
//           duration: 3500
//         })
//       }
//     },
//     async doRecruit (account = this.account, info = this.info, web3Opt = this.web3Opt, Recruited = this.Recruited) {
//       if (!this.furtherInit) return

//       this.furtherLoading = true
//       this.metamaskChoose = true

//       try {
//         const recruitedParam = {
//           name: 'recruit',
//           values: [ info.id ]
//         }
//         const { gasPrice } = web3Opt
//         const gas = (await Recruited.estimateGas(recruitedParam.name, recruitedParam.values)) || 299999
//         // const gas = 299999

//         const params = {
//           gas,
//           gasPrice,
//           data: Recruited[recruitedParam.name].getData(info.id),
//           value: 0,
//           to: Recruited.address,
//           from: account
//         }

//         // console.log('params', params)

//         // 使用自有封装对象
//         window.lordlessMethods.buy(params).then(async tx => {
//           // console.log('tx', tx)
//           localStorage.setItem('lordless-recruit-tx', tx)

//           this.metamaskChoose = false
//           this.furtherLoading = false

//           this.recruitPending = true
//           this.$nextTick(() => this.initRecruitBtnInfo())
//         })
//           .catch((err) => {
//             console.log('err', err.message)
//             this.metamaskChoose = false
//             this.furtherLoading = false
//           })
//       } catch (err) {
//         this.$notify.error({
//           title: 'Error!',
//           message: err.message || 'unknow error',
//           position: 'bottom-right',
//           duration: 3500
//         })
//       }
//     },
//     initStatus () {
//       this.furtherLoading = true
//       this.recruitPending = false
//     }
//   },
//   deactivated () {
//     this.initStatus()
//   },
//   beforeDestroy () {
//     console.log('-=========== further beforeDestroy')
//     this.initStatus()
//   },
//   mounted () {
//     console.log('------------ further mounted')
//     this.$nextTick(() => this.init())
//   }
// }
</script>

<style lang="scss" scoped>
  // .mobile-further-box {
  //   // padding: 0 18px;
  //   position: fixed;
  //   // position: absolute;
  //   bottom: 0;
  //   left: 0;
  //   width: 100%;
  //   overflow: hidden;
  //   z-index: 2199;
  // }
  // .tavern-further-btn {
  //   width: 100%;
  //   height: 50px;
  //   line-height: 50px;
  //   border-radius: 0;
  // }
  // // .trading-opensea-icon {
  // //   margin-right: 8px;
  // //   width: 20px;
  // //   height: 20px;
  // //   fill: #fff;
  // // }
</style>
