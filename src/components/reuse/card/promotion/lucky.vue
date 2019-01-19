<template>
  <div class="promotion-lucky-card">
    <div class="lucky-section-item">
      <p class="lucky-section-title">
        <span>Bets</span>
      </p>
      <div class="lucky-section-content f-justify-center bets">
        <div class="d-flex f-align-center" v-if="info.blockInfos.ethBets">
          <p class="v-flex">- {{ info.blockInfos.ethBets.count | weiByDecimals(info.blockInfos.ethBets.decimals) }} ETH</p>
        </div>
        <div class="d-flex f-align-center" v-for="(item, index) of info.blockInfos.tokenBets" :key="index">
          <p class="v-flex">- {{ item.count | weiByDecimals(item.decimals) }} {{ item.candy.symbol }}</p>
        </div>
      </div>
    </div>
    <div class="lucky-section-item">
      <p class="d-flex f-align-center lucky-section-title">
        <span>Winnings</span>
        <span class="v-flex text-right">Probability</span>
      </p>
      <div class="d-flex col-flex lucky-section-content f-justify-center winnings">
        <div class="d-flex f-align-center" v-if="info.blockInfos.ethWinnings">
          <p class="v-flex">+ {{ info.blockInfos.ethWinnings.count | weiByDecimals(info.blockInfos.ethWinnings.decimals) }} ETH</p>
          <p class="lucky-right-content">{{ info.blockInfos.ethWinnings.percent }}%</p>
        </div>
        <div class="d-flex f-align-center" v-for="(item, index) of info.blockInfos.tokenWinnings" :key="index">
          <p class="v-flex">+ {{ item.count | weiByDecimals(item.decimals) }} {{ item.candy.symbol }}</p>
          <p class="lucky-right-content">{{ item.percent }}%</p>
        </div>
      </div>
    </div>
    <div class="d-flex f-align-center lucky-section-item lucky-bottom-section">
      <p class="v-flex d-flex f-align-center lg-cursor-pointer lg-hover-underline" @click.stop="showTip">
        <span class="inline-block line-height-0 lucky-tips-icon">
          <svg>
            <use xlink:href="#icon-tips"/>
          </svg>
        </span>
        <span>Rules & Detail</span>
      </p>
      <lordless-btn
        class="lucky-play-btn"
        theme="red-linear"
        :loading="!web3Error && (btnLoading || isChecking)"
        :disabled="!web3Error && (btnLoading || isChecking || isEnded)"
        @click="playLuckblock">{{ isEnded ? 'Ended' : 'Play now'}}</lordless-btn>
    </div>
    <lordless-lucky-rules v-model="rulesModel"/>
    <lordless-lucky-conditions
      v-model="conditionsModel"
      :ethBets="conditionsInfo.ethBets"
      :tokenBets="conditionsInfo.tokenBets"
      :contractInfo="conditionsInfo.contractInfo"/>
    <lordless-authorize
      ref="authorize"
      blurs
      :tokenBets="tokenBets"
      @dialogClose="btnLoading = false"/>
  </div>
</template>

<script>
import { saveAirdropUser } from 'api'

import { getBalance } from 'utils/web3/utils'

import { metamaskMixins, publicMixins } from '@/mixins'

// import { actionTypes } from '@/store/types'
import { mapState } from 'vuex'
export default {
  name: 'promotion-lucky-card',
  mixins: [metamaskMixins, publicMixins],
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data: () => {
    return {
      isEnded: false,
      isChecking: true,
      rulesModel: false,
      btnLoading: false,
      InsufficientEth: false,

      // conditions options
      conditionsModel: false,
      conditionsInfo: {
        ethBets: {},
        tokenBets: []
      }
    }
  },
  computed: {
    ...mapState('web3', [
      'web3Opt'
    ]),
    ...mapState('contract', [
      'Luckyblock',
      'tokensContract'
    ]),

    playInit () {
      const { loading, isConnected } = this.web3Opt
      return !loading && isConnected && !!this.info._id && !!this.Luckyblock
    },

    web3Error () {
      const { loading, isConnected } = this.web3Opt
      return !loading && !isConnected
    },

    tokenBets () {
      return this.info.blockInfos.tokenBets
    }
  },
  watch: {
    playInit (val) {
      if (val) this.initLuckyblockStatus()
    },
    account (val) {
      if (val && this.playInit) this.initLuckyblockStatus()
    }
  },
  methods: {
    // ...mapActions('contract', [
    //   actionTypes.CONTRACT_SET_TOKEN_ALLOWANCE
    // ]),

    showTip () {
      this.rulesModel = true
    },
    // allowanceSuccess () {
    //   this.doLuckyblock()
    // },

    async initLuckyblockStatus ({ luckyblockId, blockInfos } = this.info, Luckyblock = this.Luckyblock, { web3js } = this.web3Opt) {
      // 如果 web3 没有就绪 或者 网络不匹配，进入 failed 模式
      // if (!isConnected || (process.env.NODE_ENV !== 'development' && parseInt(networkId) !== process.env.APPROVED_NETWORK_ID)) {
      //   this.initFailedplay()
      //   return
      // }
      if (!blockInfos || !Luckyblock) return

      this.isChecking = true

      const { ethWinnings, tokenWinnings } = blockInfos
      const winningNum = ethWinnings.count

      console.log('luckyblockBase before', luckyblockId, winningNum)

      const contractAddress = Luckyblock.address
      // 获取活动的开启状态，如果 luckyblockBase 为true，代表活动关闭
      const luckyblockBase = await Luckyblock.methods('getLuckyblockBase', [ luckyblockId ])
      console.log('luckyblockBase', luckyblockBase)

      // 获取合约的 eth Balance，如果eth不足，则关闭活动
      const { balance } = await getBalance(web3js, contractAddress)

      let isEnded = false
      const contractInfo = {}
      contractInfo.ethBalance = winningNum ? balance : null
      if (balance < winningNum || luckyblockBase) {
        isEnded = true
      }

      contractInfo.tokenWinnings = await Promise.all(tokenWinnings.map(async winnings => {
        const candy = winnings.candy.address
        const tokenBalance = (await this.tokensContract[candy].methods('balanceOf', [ contractAddress ])).toNumber() || 0

        console.log('tokenBalance', tokenBalance)
        // 判断 token 是否充足
        const tokenEnough = tokenBalance >= winnings.count
        if (!tokenEnough) {
          isEnded = true
        }

        // 返回处理之后的 tokenBet
        return {
          tokenBalance,
          candy: winnings.candy
        }
      }))

      this.$set(this.conditionsInfo, 'contractInfo', contractInfo)

      this.isChecking = false
      this.isEnded = isEnded
      console.log('---- winningNum', winningNum, balance, luckyblockBase, contractInfo)
      // this.$nextTick(() => {
      //   if (!this.rendered) this.rendered = true
      //   this.checkplayStatus()
      // })
    },

    // play Luckyblock 事件
    async playLuckblock () {
      this.btnLoading = true
      try {
        const authorize = await this.$refs.authorize.checkoutAuthorize({ tokenAllowance: true })
        if (!authorize) return

        this.doLuckyblock()
      } catch (err) {
        this.btnLoading = false
        this.$notify.error({
          title: 'Error!',
          message: err.message || 'unknow error',
          position: 'bottom-right',
          duration: 3500
        })
      }
    },

    /**
     * 执行 luckyblock 合约
     */
    async doLuckyblock (address = this.account, info = this.info, Luckyblock = this.Luckyblock, web3Opt = this.web3Opt) {
      this.btnLoading = true

      const web3js = web3Opt.web3js

      let conditionsModel = false
      const conditionsInfo = this.conditionsInfo
      const { balance } = await getBalance(web3js, address)

      console.log('balance', balance)
      const ethEnough = balance >= info.blockInfos.ethBets.count
      // 判断 eth 是否足够
      if (!ethEnough) {
        conditionsModel = true
      }
      conditionsInfo.ethBets = Object.assign({}, info.blockInfos.ethBets, {
        conditions: {
          enough: ethEnough,
          need: info.blockInfos.ethBets.count - balance
        }
      })

      const tokenBets = info.blockInfos.tokenBets
      conditionsInfo.tokenBets = await Promise.all(tokenBets.map(async tokenBet => {
        const candy = tokenBet.candy.address
        const balance = await this.tokensContract[candy].methods('balanceOf', [ address ])

        // 判断 token 是否充足
        const tokenEnough = balance.toNumber() >= tokenBet.count
        if (!tokenEnough) {
          conditionsModel = true
        }

        // 返回处理之后的 tokenBet
        return Object.assign({}, tokenBet, {
          conditions: {
            enough: tokenEnough,
            need: tokenBet.count - balance.toNumber()
          }
        })
      }))

      console.log('conditionsInfo', conditionsInfo)

      // const tokenBets = info.blockInfos.tokenBets
      // let tokenEnough = true
      // await (Promise.all(tokenBets.map(async tokenBet => {
      //   const candy = tokenBet.candy.address
      //   const balance = await this.tokensContract[candy].methods('balanceOf', [ address ])

      //   if (!tokenEnough) return tokenBet
      //   // 判断 token 是否充足
      //   if (balance.toNumber() < tokenBet.count) {
      //     this.$notify.warning({
      //       title: 'Warning!',
      //       message: `Insufficient ${tokenBet.candy.symbol.toLocaleUpperCase()}!`,
      //       position: 'bottom-right',
      //       duration: 2500
      //     })
      //     tokenEnough = false
      //   }
      //   return tokenBet
      // })))

      if (conditionsModel) {
        this.btnLoading = false
        this.conditionsModel = true
        this.conditionsInfo = conditionsInfo
        return
      }

      this.metamaskChoose = true
      try {
        const luckyblockParam = {
          name: 'play',
          values: [ info.luckyblockId ]
        }
        const { gasPrice } = web3Opt
        // const gas = (await Luckyblock.estimateGas(luckyblockParam.name, luckyblockParam.values)) || 139999
        const gas = 159999

        const params = {
          gas,
          gasPrice,
          data: Luckyblock[luckyblockParam.name].getData(info.luckyblockId),
          // memo: 'buy a tavern by lordless',
          // feeCustomizable: true,
          value: info.blockInfos.ethBets.count,
          to: Luckyblock.address,
          from: address
        }

        // 使用自有封装对象
        window.lordlessMethods.buy(params).then(async tx => {
          this.btnLoading = false
          console.log('tx', tx)

          await saveAirdropUser({ tx, luckyblockId: info._id })
          this.metamaskChoose = false

          this.$nextTick(() => {
            this.$router.push('/owner/quests?type=promotion&refresh=true')
          })
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
    if (!this.rendered) return
    this.initLuckyblockStatus()
  },
  mounted () {
    this.initLuckyblockStatus()
  }
}
</script>

<style lang="scss" scoped>
  .promotion-lucky-card {
    padding: 20px;
    background-color: #fff;
  }
  .lucky-section-item {
    &:not(:first-of-type) {
      margin-top: 22px;
    }
  }
  .lucky-section-title {
    padding-bottom: 8px;
    font-size: 16px;
    color: #777;
    border-bottom: 1px solid #ddd;
  }
  .lucky-section-content {
    padding-top: 4px;
    @include TTFontBolder();
    font-size: 16px;
    color: #00C1A7;
    &.bets {
      color: #F5515F;
    }
    // &.winnings {
    //   min-height: 64px;
    // }
    p {
      margin-top: 8px;
    }
    @media screen and (min-width: 768px) {
      min-height: 64px;
    }
  }

  .lucky-right-content {
    color: #999;
  }

  .lucky-bottom-section {
    font-size: 14px;
    color: #777;
  }
  .lucky-tips-icon {
    margin-right: 4px;
    width: 15px;
    height: 15px;
    fill: #777;
  }
  .lucky-play-btn {
    padding: 0 16px;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    border: none;
    @include TTFontBold();
  }
</style>
