<template>
  <div class="promotion-lucky-card">
    <div class="lucky-section-item">
      <p class="lucky-section-title">
        <span>Bets</span>
      </p>
      <div class="lucky-section-content bets">
        <div class="d-flex f-align-center" v-if="info.dropInfos.ethBet">
          <p class="v-flex">- {{ info.dropInfos.ethBet.count | weiByDecimals(info.dropInfos.ethBet.decimals) }} ETH</p>
        </div>
        <div class="d-flex f-align-center" v-for="(item, index) of info.dropInfos.tokenBets" :key="index">
          <p class="v-flex">- {{ item.count | weiByDecimals(item.decimals) }} {{ item.candy.symbol }}</p>
        </div>
      </div>
    </div>
    <div class="lucky-section-item">
      <p class="d-flex f-align-center lucky-section-title">
        <span>Winnings</span>
        <span class="v-flex text-right">Probability</span>
      </p>
      <div class="d-flex col-flex lucky-section-content winnings">
        <div class="d-flex f-align-center" v-if="info.dropInfos.ethWinning">
          <p class="v-flex">+ {{ info.dropInfos.ethWinning.count | weiByDecimals(info.dropInfos.ethWinning.decimals) }} ETH</p>
          <p class="lucky-right-content">{{ info.dropInfos.ethWinning.percent }}%</p>
        </div>
        <div class="d-flex f-align-center" v-for="(item, index) of info.dropInfos.tokenWinnings" :key="index">
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
        class="lucky-claim-btn"
        theme="red-linear"
        :loading="btnLoading"
        :disabled="btnLoading"
        @click="playLuckyDrop">Play now</lordless-btn>
    </div>
    <lordless-lucky-rules v-model="rulesModel"/>
    <lordless-authorize
      ref="authorize"
      blurs
      :tokenBets="tokenBets"
      @allowanceSuccess="allowanceSuccess"/>
  </div>
</template>

<script>
import { saveAirdropUser } from 'api'

import { getBalance } from 'utils/web3/utils'

import { metamaskMixins, publicMixins } from '@/mixins'
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
      rulesModel: false,
      btnLoading: false,
      InsufficientEth: false
    }
  },
  computed: {
    ...mapState('web3', [
      'web3Opt'
    ]),
    ...mapState('contract', [
      'Luckydrop',
      'airdropTokens'
    ]),

    tokenBets () {
      return this.info.dropInfos.tokenBets
    }
  },
  methods: {
    showTip () {
      this.rulesModel = true
    },
    allowanceSuccess () {
      this.doLuckyDrop()
    },

    // play LuckyDrop 事件
    async playLuckyDrop () {
      this.btnLoading = true
      try {
        const authorize = await this.$refs.authorize.checkoutAuthorize({ tokenAllowance: true })
        if (!authorize) return

        this.doLuckyDrop()
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
     * 执行 luckyDrop 合约
     */
    async doLuckyDrop (address = this.account, info = this.info, Luckydrop = this.Luckydrop, web3Opt = this.web3Opt) {
      this.btnLoading = true

      const web3js = web3Opt.web3js

      const { balance } = await getBalance(web3js, address)

      console.log('balance', balance)
      // 判断 eth 是否足够
      if (balance < info.dropInfos.ethBet.count) {
        this.$notify.warning({
          title: 'Warning!',
          message: 'ETH is Insufficient',
          position: 'bottom-right',
          duration: 2500
        })
        this.btnLoading = false
        return
      }

      const tokenBets = info.dropInfos.tokenBets
      let tokenEnough = true
      await (Promise.all(tokenBets.map(async tokenBet => {
        const candy = tokenBet.candy.address
        const balance = await this.airdropTokens[candy].methods('balanceOf', [ address ])

        if (!tokenEnough) return tokenBet
        // 判断 token 是否充足
        if (balance.toNumber() < tokenBet.count) {
          this.$notify.warning({
            title: 'Warning!',
            message: `${tokenBet.candy.symbol.toLocaleUpperCase()} is Insufficient!`,
            position: 'bottom-right',
            duration: 2500
          })
          tokenEnough = false
        }
        return tokenBet
      })))

      if (!tokenEnough) {
        this.btnLoading = false
        return
      }

      this.metamaskChoose = true
      try {
        const luckydropParam = {
          name: 'claim',
          values: [ info.dropId ]
        }
        const { gasPrice } = web3Opt
        const gas = (await Luckydrop.estimateGas(luckydropParam.name, luckydropParam.values)) || 300000

        const params = {
          gas,
          gasPrice,
          data: Luckydrop.claim.getData(info.dropId),
          // memo: 'buy a tavern by lordless',
          // feeCustomizable: true,
          value: info.dropInfos.ethBet.count,
          to: Luckydrop.address,
          from: address
        }

        // 使用自有封装对象
        window.lordlessMethods.buy(params).then(async tx => {
          this.btnLoading = false
          console.log('tx', tx)

          await saveAirdropUser({ tx, luckydropId: info._id })
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
    p {
      margin-top: 8px;
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
  .lucky-claim-btn {
    padding: 0 16px;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    border: none;
    @include TTFontBold();
  }
</style>
