<template>
  <div v-if="info._id" class="promotion-claim-box" :class="{ 'is-failed': failed }">
    <div class="promotion-claim-left">
      <!-- <p class="promotion-claim-failed">??? total</p> -->
      <p class="d-flex f-align-center f-justify-between promotion-claim-nums">
        <span class="TTFontBolder promotion-claim-symbol">{{ info.project.symbol }}</span>
        <span>
          <span>
            <span v-if="!progressNums.completed || failed">-,---</span>
            <count-up v-else class="inline-block" :startVal="0" :endVal="progressNums.left" :duration="1" :isReady="progressNums.completed"></count-up> /
          </span>
          <span>
            <span v-if="!progressNums.completed || failed">-,---</span>
            <count-up v-else class="inline-block" :startVal="0" :endVal="progressNums.total" :duration="1" :isReady="progressNums.completed"></count-up>
          </span>
        </span>
        <!-- <span class="promotion-left-num">
          <span v-if="!progressNums.completed" class="inline-block">...</span>
          <count-up v-else class="inline-block" :startVal="0" :endVal="progressNums.left" :duration="1" :isReady="progressNums.completed"></count-up>&nbsp;&nbsp;left
        </span>
        <span>
          <span v-if="!progressNums.completed" class="inline-block">...</span>
          <span v-else>
            Total&nbsp;
            <count-up class="inline-block" :startVal="0" :endVal="progressNums.total" :duration="1" :isReady="progressNums.completed"></count-up>
          </span>
        </span> -->
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
        <span class="inline-block">+ {{ (weiByDecimals(info.countPerUser, info.decimals)).toLocaleString() }}</span>
        <!-- <span class="inline-block text-upper promotion-claim-symbol">{{ info.project.symbol }}</span> -->
      </p>
      <lordless-btn
        class="TTFontBold promotion-claim-btn"
        theme="promotion"
        inverse
        :disabled="!web3Error && (isClaimed || loading || isEnd || (airdropUserInfo.status !== undefined && airdropUserInfo.status !== -1))"
        :loading="loading"
        @click="claimPromotion">{{ isEnd ? 'Ended' : isClaimed ? 'Claimed' : 'Claim now' }}</lordless-btn>
    </div>
    <lordless-authorize
      ref="authorize"
      @sign="signSuccess"
      @blurs="dialogSetBlurs($event, metamaskChoose ? 1 : 0)"/>
  </div>
</template>

<script>
import { saveAirdropUser, getAirdropUserInfo } from 'api'

import { weiByDecimals } from 'utils/tool'
import { metamaskMixins, dialogMixins, publicMixins } from '@/mixins'

import { mapState } from 'vuex'
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
      failed: false,
      rendered: false,
      loading: true,
      isClaimed: false,
      airdropUserInfo: {},
      progressNums: {
        completed: false,
        total: 1,
        left: 1,
        dropping: 0
      },
      progress: {
        underColor: '#ddd',
        gradient: {
          direction: '45deg',
          start: '#D0374E',
          end: '#F5515F'
        }
      }
    }
  },
  computed: {
    ...mapState('contract', [
      'tokensContract',
      'Airdrop'
    ]),
    ...mapState('web3', [
      'web3Opt'
    ]),
    claimInit () {
      return !this.web3Opt.loading && this.web3Opt.isConnected && !!this.Airdrop && !!this.info._id && !this.tokensContract[this.info.project.address]
    },
    web3Error () {
      const { loading, isConnected } = this.web3Opt
      return !loading && !isConnected
    },
    claimedNum () {
      return this.progressNums.dropping
    },
    tokenAddress () {
      const { project } = this.info
      return typeof project === 'object' ? project.address : project
    },
    isEnd () {
      const { open, countPerUser, decimals } = this.info
      return !open || (!this.failed && this.progressNums.left < parseFloat(weiByDecimals(countPerUser, decimals)))
    }
  },
  watch: {
    claimInit (val) {
      if (val) this.initAirdropStatus()
    },
    account (val) {
      if (val && this.claimInit) this.initAirdropStatus()
    },
    claimedNum (val) {
      this.$emit('update:claimed', val)
    },
    web3Error (val) {
      if (val) this.initFailedClaim()
    }
    // tokensContract (val) {
    //   console.log('----- watch tokensContract')
    // }
  },
  methods: {
    weiByDecimals () {
      return weiByDecimals(...arguments)
    },

    /**
     * 初始化状态
     */
    initStatus () {
      this.failed = false
      this.isClaimed = true
      this.$set(this.progressNums, 'dropping', 0)
    },

    /**
     * 初始化 failed 模式
     */
    initFailedClaim () {
      this.failed = true
      this.$nextTick(() => {
        this.isClaimed = false
        this.loading = false

        this.$set(this.progressNums, 'dropping', -1)
      })
    },

    /**
     * 初始化 airdrop 状态
     */
    async initAirdropStatus ({ project } = this.info, { isConnected, networkId } = this.web3Opt) {
      // 如果 web3 没有就绪 或者 网络不匹配，进入 failed 模式
      // if (!isConnected || (process.env.NODE_ENV !== 'development' && parseInt(networkId) !== process.env.APPROVED_NETWORK_ID)) {
      //   this.initFailedClaim()
      //   return
      // }
      if (!project) return

      // 初始化状态
      this.initStatus()

      const address = typeof project === 'object' ? project.address : project
      this.$nextTick(() => {
        if (!this.rendered) this.rendered = true
        this.checkClaimStatus()
        setTimeout(() => {
          this.initProgressNumber(address)
        }, 0)
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

        const airdropUserInfo = (await getAirdropUserInfo({ airdropId: this.info._id, status: 0 })).data
        console.log('isConnected ---- before', isConnected, airdropUserInfo)
        if (!isConnected) {
          isConnected = !!airdropUserInfo
          console.log('isConnected ---- after', isConnected)
        }
        this.airdropUserInfo = airdropUserInfo || {}
        this.isClaimed = isConnected
      } catch (err) {
        this.loading = false
        this.isClaimed = false
      }
      this.loading = false
    },

    async initProgressNumber (tokenAddress = this.tokenAddress, Airdrop = this.Airdrop) {
      const TokenContract = this.tokensContract[tokenAddress]
      const bridgeContract = this.info.bOfContract
      // console.log('tokensContract', this.tokensContract)
      if (!TokenContract) {
        this.progressNums = { total: 0, left: 0, dropping: 0, completed: true }
        return
      }
      // const _count = await Airdrop.methods('getAirdrop', [ this.info.airdropId ])
      // console.log('_count', _count[1].toNumber())
      let decimals = this.info.decimals || (await TokenContract.methods('decimals')).toNumber() || 18

      const _left = await TokenContract.methods('balanceOf', [ bridgeContract || Airdrop.address ])
      // console.log('_left', _left.toNumber() / Math.pow(10, decimals), this.info.project.symbol)
      // console.log('_left', _left, _left.toNumber() / Math.pow(10, decimals))
      const _dropping = await Airdrop.methods('tokenTotalClaim', [ bridgeContract || tokenAddress ])
      // console.log('_dropping', _dropping, _dropping.toNumber())

      const left = parseFloat(_left.toNumber() / Math.pow(10, decimals))
      const dropping = parseFloat(_dropping.toNumber() / Math.pow(10, decimals))
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
        const authorize = await this.$refs.authorize.checkoutAuthorize({ guide: true })

        if (!authorize || this.failed) return

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
        const gas = (await Airdrop.estimateGas(claimParams.name, claimParams.values)) || 120000

        // console.log('--- gas', gas, gasPrice)
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

        // 使用自有封装对象
        window.lordlessMethods.buy(params).then(async tx => {
          this.loading = false
          this.isClaimed = true

          this.$set(this.progressNums, 'left', this.progressNums.left - 100)
          this.$set(this.progressNums, 'dropping', this.progressNums.dropping + 100)

          await saveAirdropUser({ tx, airdropId: info._id })
          this.metamaskChoose = false

          this.$nextTick(() => {
            this.$router.push('/owner/quests?type=promotion&refresh=true')
          })
        })
          .catch((err) => {
            console.log('err', err.message)
            this.metamaskChoose = false
            this.loading = false
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
    this.initAirdropStatus()
  },
  mounted () {
    this.initAirdropStatus()
  }
}
</script>

<style lang="scss" scoped>
  .promotion-claim-box {
    &.is-failed {
      .promotion-claim-num {
        visibility: hidden;
      }
      // .promotion-claim-failed {
      //   display: block;
      // }
      // .promotion-claim-nums {
      //   display: none;
      // }
    }
  }
  // .promotion-claim-failed {
  //   display: none;
  // }
  .promotion-claim-left {
    font-size: 16px;
    color: #777;
  }
  .promotion-progress-bar {
    margin-top: 6px;
    height: 22px;
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
    // margin-left: 5px;
    // font-size: 16px;
    color: #F5515F;
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
    padding: 0 16px;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    border: none;
    @include TTFontBold();
  }
</style>
