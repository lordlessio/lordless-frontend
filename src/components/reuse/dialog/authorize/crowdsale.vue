<template>
  <div v-if="value" class="crowdsale-box">
    <div v-if="isMobile" class="text-center mobile-crowdsale-container">
      <h2>Authorization</h2>
      <p>Authorize the Marketplace contract to operate tarven</p>
      <lordless-btn
        class="TTFontBolder lordless-message-btn crowdsale-btn"
        theme="blue"
        shadow
        :loading="crowdsalePending"
        :disabled="crowdsalePending"
        @click="chooseCrowdsale">Confirm</lordless-btn>
    </div>
    <div v-else class="text-center crowdsale-container">
      <div class="inline-block lordless-shadow" :style="`border-radius: ${avatar.radius};`">
        <lordless-blockies
          :scale="avatar.scale"
          :radius="avatar.radius"
          :seed="address"
          theme="light"/>
      </div>
      <div class="crowdsale-cnt-box">
        <div class="crowdsale-cnt-top">
          <p class="TTFontBolder">Wallet address</p>
          <p class="TTFontNormal text-break crowdsale-info-text">{{ address }}</p>
        </div>
        <p class="crowdsale-markline"></p>
        <div class="crowdsale-cnt-bottom">
          <p class="TTFontBolder">Authorization</p>
          <p class="TTFontNormal crowdsale-info-text">Authorization the <a :href="`${ETHERSCANURL}/address/${NFTsCrowdsale.address}`" target="_blank" class="TTFontBolder">Marketplace contract</a> to operate Taverns</p>
        </div>
        <div>
          <lordless-btn
            class="TTFontBolder lordless-message-btn crowdsale-btn"
            theme="deep-blue"
            shadow
            :loading="crowdsalePending"
            :disabled="crowdsalePending"
            @click="chooseCrowdsale">Go</lordless-btn>
        </div>
      </div>
      <div class="contract-pending-tip" v-if="crowdsalePending">
        <p>contract is pending, waiting for few minutes</p>
      </div>
    </div>
  </div>
</template>

<script>
import { metamaskMixins } from '@/mixins'

import { mapState } from 'vuex'
export default {
  mixins: [metamaskMixins],
  props: {
    value: {
      type: Boolean,
      default: false
    },
    // chooseBool: {
    //   type: Boolean,
    //   default: false
    // },
    avatar: {
      type: Object,
      default: () => {
        return {
          scale: 18,
          radius: '20px'
        }
      }
    },
    address: {
      type: String,
      default: ''
    }
  },
  data: () => {
    return {
      crowdsalePending: false
    }
  },
  computed: {
    ...mapState('contract', [
      'TavernNFTs',
      'NFTsCrowdsale'
    ]),

    web3Opt () {
      return this.$root.$children[0].web3Opt
    },

    ETHERSCANURL () {
      return process.env.ETHERSCANURL
    },

    isMobile () {
      return this.$root.$children[0].isMobile
    }
  },
  methods: {

    /**
     * 检查是否 授权了市场合约
     */
    // async checkCrowdsale () {
    //   const TavernNFTs = this.TavernNFTs
    //   const NFTsCrowdsale = this.NFTsCrowdsale
    //   const crowdsaleModel = await TavernNFTs.isApprovedForAll(this.address, NFTsCrowdsale.address)
    //   console.log('authorize crowdsaleModel', crowdsaleModel)
    //   if (!crowdsaleModel) this.$emit('input', true)
    //   else this.$emit('input', false)

    //   this.crowdsaleModel = crowdsaleModel
    //   return crowdsaleModel
    // },

    /**
     * 授权市场合约
     */
    async chooseCrowdsale ({ TavernNFTs = this.TavernNFTs, web3Opt = this.web3Opt, NFTsCrowdsale = this.NFTsCrowdsale } = {}) {
      this.crowdsalePending = true

      // 检查是否已经授权
      const bool = await TavernNFTs.methods('isApprovedForAll', [this.address, NFTsCrowdsale.address])
      console.log('--------- bool', bool, this.address)
      if (bool) {
        this.crowdsalePending = false
        this.$emit('pending', { pass: true })
        return
      }

      // metamask 是否被打开
      this.metamaskChoose = true

      const { gasPrice } = web3Opt

      // 传输的合约参数
      const setApprovalForAll = {
        name: 'setApprovalForAll',
        values: [ NFTsCrowdsale.address, true ]
      }

      // 估算 gas,不准
      const gas = (await TavernNFTs.estimateGas(setApprovalForAll.name, setApprovalForAll.values)) || 300000
      // console.log('---- gas', gas)
      // const gas = 300000

      // 执行合约
      TavernNFTs.methods(setApprovalForAll.name, setApprovalForAll.values.concat([{ from: this.address, gas, gasPrice }]))
        .then(tx => {
          this.metamaskChoose = false
          this.$emit('pending', { tx })
        })
        .catch(err => {
          console.log('err', err)
          this.metamaskChoose = false
          this.crowdsalePending = false
          this.$emit('error', err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  .crowdsale-box {
    padding-bottom: 10px;
    border-radius: 5px;
  }
  .mobile-crowdsale-container {
    >h2 {
      font-size: 24px;
    }
    >p {
      margin-top: 12px;
      font-size: 16px;
    }
    .lordless-message-btn {
      margin-top: 35px;
    }
  }
  .crowdsale-container {
    position: relative;
  }
  .crowdsale-close {
    position: absolute;
    top: 15px;
    right: 15px;
    font-size: 30px;
    cursor: pointer;
  }
  .crowdsale-cnt-box {
    margin-top: 30px;
    font-size: 18px;
  }
  .crowdsale-cnt-top {
    margin-bottom: 30px;
  }
  .crowdsale-info-text {
    font-size: 20px;
    >a {
      color: $--text-yellow-color;
    }
  }
  .crowdsale-markline {
    margin: 15px auto 25px;
    height: 0;
    border-bottom: 1px dashed #fff;
    @include width(50%, 1);
    @include margin-around(30px, auto, 45px, auto, 1);
  }
  // .crowdsale-choose {
  //   width: 26px;
  //   height: 26px;
  //   border-radius: 5px;
  //   overflow: hidden;
  //   background-color: $--secondary-color;
  // }
  .crowdsale-text {
    margin-left: 10px;
    font-size: 18px;
  }
  .crowdsale-btn {
    padding-left: 25px;
    padding-right: 25px;
    margin-top: 40px;
  }
</style>
