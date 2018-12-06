<template>
  <div v-if="info._id" class="promotion-claim-box">
    <div class="promotion-claim-left">
      <p class="d-flex f-align-center f-justify-between">
        <span>
          <span v-if="!progressNums.completed" class="inline-block">...</span>
          <count-up v-else class="inline-block" :startVal="0" :endVal="progressNums.total" :duration="1000" :isReady="progressNums.completed"></count-up>&nbsp;total
        </span>
        <span class="promotion-left-num">
          <span v-if="!progressNums.completed" class="inline-block">...</span>
          <count-up v-else class="inline-block" :startVal="0" :endVal="progressNums.left" :duration="1000" :isReady="progressNums.completed"></count-up>&nbsp;&nbsp;left
        </span>
      </p>
      <div class="promotion-progress-bar">
        <lordless-progress
          :current="progressNums.left"
          :max="progressNums.total"
          :underColor="progress.underColor"
          :gradient="progress.gradient"/>
      </div>
    </div>
    <div class="d-flex f-align-center promotion-claim-candy">
      <!-- <p class="v-flex d-flex f-align-center">
        <span class="inline-block line-height-0 home-candy-icon promotion-candy-coin">
          <svg>
            <use xlink:href="#coin-less"/>
          </svg>
        </span>
        <span class="inline-block">LESS</span>
      </p> -->
      <p class="TTFontBolder v-flex d-flex f-justify-start promotion-claim-num">
        <span class="inline-block">+ {{ info.countPerUser | weiToEth }}</span>
        <span class="inline-block text-upper promotion-claim-symbol">{{ info.project.symbol }}</span>
      </p>
      <lordless-btn
        class="TTFontBold promotion-claim-btn"
        theme="promotion"
        inverse
        :disabled="isClaimed || loading"
        :loading="loading"
        @click="claimPromotion">{{ isClaimed ? 'Claimed' : 'Claim now' }}</lordless-btn>
    </div>
    <lordless-authorize
      ref="authorize"
      @sign="signSuccess"
      @blurs="dialogSetBlurs($event, metamaskChoose ? 1 : 0)"/>
  </div>
</template>

<script>
import { saveAirdropUser, getAirdropUserInfo } from 'api'

import { weiToEth } from 'utils/tool'
import { metamaskMixins, dialogMixins, publicMixins } from '@/mixins'

import { actionTypes } from '@/store/types'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'promotion-claim-card',
  mixins: [metamaskMixins, dialogMixins, publicMixins],
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    },
    claimed: {
      type: Number,
      default: 0
    }
  },
  data: () => {
    return {
      rendered: false,
      loading: true,
      isClaimed: false,
      progressNums: {
        completed: false,
        total: 0,
        left: 0,
        dropping: 0
      },
      progress: {
        underColor: '#ddd',
        gradient: {
          direction: '-45deg',
          start: '#F5515F',
          end: '#9F041B'
        }
      }
    }
  },
  computed: {
    ...mapState('contract', [
      'airdropTokens',
      'Airdrop'
    ]),
    ...mapState('web3', [
      'web3Opt'
    ]),
    claimInit () {
      return !this.web3Opt.loading && this.web3Opt.isConnected && !!this.Airdrop && !!this.info._id
    },
    claimedNum () {
      return this.progressNums.dropping
    }
  },
  watch: {
    claimInit (val) {
      if (val) this.initTokenContract()
    },
    account (val) {
      if (val && this.claimInit) this.initTokenContract()
    },
    claimedNum (val) {
      this.$emit('update:claimed', val)
    }
  },
  methods: {
    ...mapActions('contract', [
      actionTypes.CONTRACT_SET_AIRDROP_TOKENS
    ]),

    initTokenContract ({ project } = this.info) {
      if (!project) return
      const address = typeof project === 'object' ? project.address : project
      this[actionTypes.CONTRACT_SET_AIRDROP_TOKENS](address)
      this.$nextTick(() => {
        if (!this.rendered) this.rendered = true
        this.initProgressNumber(address)
        this.checkClaimStatus()
      })
    },

    /**
     * check claim status
     */
    async checkClaimStatus (account = this.account, airdropId = this.info.airdropId, Airdrop = this.Airdrop) {
      if (!Airdrop) return
      this.loading = true
      try {
        let isConnected = false
        isConnected = await Airdrop.methods('isCollected', [ account, airdropId ])
        console.log('isConnected ---- before', isConnected)
        if (!isConnected) {
          isConnected = !!((await getAirdropUserInfo({ airdropId: this.info._id })).data)
          console.log('isConnected ---- after', isConnected)
        }
        this.isClaimed = isConnected
      } catch (err) {
        this.loading = false
        this.isClaimed = false
      }
      this.loading = false
    },

    async initProgressNumber (tokenAddress, TokenContract = this.airdropTokens[tokenAddress], Airdrop = this.Airdrop) {
      if (!TokenContract) {
        this.progressNums = { total: 0, left: 0, dropping: 0 }
        return
      }
      const _left = await TokenContract.methods('balanceOf', [ Airdrop.address ])
      console.log('_left', _left.toNumber())
      const _dropping = await Airdrop.methods('tokenTotalClaim', [ tokenAddress ])
      console.log('_dropping', _dropping.toNumber())

      const left = parseFloat(weiToEth(_left.toNumber()))
      const dropping = parseFloat(weiToEth(_dropping.toNumber()))
      const total = parseFloat(left + dropping)
      this.progressNums = { total, left, dropping, completed: true }
    },

    signSuccess () {
      this.$nextTick(() => {
        this.claimPromotion()
      })
    },

    async claimPromotion (info = this.info, Airdrop = this.Airdrop, web3Opt = this.web3Opt) {
      const airdropId = info.airdropId
      if (!airdropId) return
      try {
        // 检查市场权限
        const authorize = this.$refs.authorize.checkoutAuthorize({ guide: true })

        if (!authorize) return

        // pId = (await Airdrop.methods('getAirdropIds') || [])[0]

        // if (!pId) return

        this.metamaskChoose = true
        this.loading = true

        const { gasPrice, address } = web3Opt

        // 传输的合约参数
        const claimParams = {
          name: 'claim',
          values: [ airdropId ]
        }

        // 估算 gas
        // const gas = await NFTsCrowdsale.payByEth.estimateGas(tokenId)
        const gas = (await Airdrop.estimateGas(claimParams.name, claimParams.values)) || 100000

        console.log('--- gas', gas, gasPrice)
        // 根据链上信息 claim 糖果
        const params = {
          gas,
          gasPrice,
          data: Airdrop.claim.getData(airdropId),
          // memo: 'buy a tavern by lordless',
          // feeCustomizable: true,
          to: Airdrop.address,
          from: address
        }

        // Airdrop.methods(claimParams.name, claimParams.values.concat([{ gas, gasPrice }]))
        //   .then(tx => {
        //     console.log('----- buyHandle tx', tx)
        //     // this.buyPending = true
        //     this.metamaskChoose = false

        //     this.checkTxEvent({ tx, action: claimParams.name, pId }, () => {
        //       this.$router.push('/owner/activity')
        //     })
        //   })
        //   .catch((err) => {
        //     console.log('err', err)
        //     this.metamaskChoose = false
        //   })

        // 使用自有封装对象
        window.lordlessMethods.buy(params).then(async tx => {
          console.log('----- claimHandle tx', tx)
          // this.buyPending = true
          this.loading = false
          this.isClaimed = true

          this.$set(this.progressNums, 'left', this.progressNums.left - 100)
          this.$set(this.progressNums, 'dropping', this.progressNums.dropping + 100)

          await saveAirdropUser({ tx, airdropId: info._id })
          this.metamaskChoose = false

          this.$nextTick(() => this.$router.push('/owner/quest?type=promotion&refresh=true'))
        })
          .catch((err) => {
            console.log('err', err.message)
            this.metamaskChoose = false
            this.loading = false
            // this.$notify.error({
            //   title: 'Error!',
            //   message: err.message || 'unknow error',
            //   position: 'bottom-right',
            //   duration: 3500
            // })
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
    if (!this.rendered) return
    this.initTokenContract()
  },
  mounted () {
    this.initTokenContract()
  }
}
</script>

<style lang="scss" scoped>
  .promotion-claim-left {
    font-size: 16px;
    color: #777;
  }
  .promotion-progress-bar {
    margin-top: 6px;
    height: 28px;
    border-radius: 5px;
    overflow: hidden;
  }
  .promotion-claim-candy {
    margin-top: 20px;
    font-size: 16px;
    color: #777;
  }
  .promotion-left-num {
    // color: #EB8785;
  }
  .promotion-claim-num {
    font-size: 24px;
    color: #F5515F;
  }
  .promotion-claim-symbol {
    margin-left: 5px;
    font-size: 16px;
  }
  // .promotion-candy-coin {
  //   margin-right: 6px;
  //   padding: 6px;
  //   width: 29px;
  //   height: 29px;
  //   border-radius: 100%;
  //   box-sizing: border-box;
  //   background-image: linear-gradient(-45deg, #00C0EB 0%, #0079FF 100%);
  //   fill: #fff;
  // }
  .promotion-claim-btn {
    padding: 8px 14px;
    font-size: 14px;
    border: none;
  }
</style>
