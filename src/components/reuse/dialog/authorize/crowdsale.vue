<template>
  <div class="crowdsale-box">
    <div class="text-center crowdsale-container">
      <div class="inline-block lordless-shadow" :style="`border-radius: ${avatar.radius};`">
        <Blockies
          :scale="avatar.scale"
          :radius="avatar.radius"
          :seed="address"
          theme="light"/>
      </div>
      <div class="crowdsale-cnt-box">
        <div class="crowdsale-cnt-top">
          <p class="TTFontBolder">Wallet address</p>
          <p class="TTFontNormal crowdsale-info-text">{{ address }}</p>
        </div>
        <p class="crowdsale-markline"></p>
        <div class="crowdsale-cnt-bottom">
          <p class="TTFontBolder">Authorization</p>
          <p class="TTFontNormal crowdsale-info-text">Authorization the <a href="#" class="TTFontBolder">Marketplace contract</a> to operate LDB</p>
        </div>
        <div>
          <ld-btn
            class="TTFontBolder lordless-message-btn crowdsale-btn"
            theme="info"
            shadow
            :loading="crowdsalePending"
            :disabled="crowdsalePending"
            @click="chooseCrowdsale">Go</ld-btn>
        </div>
      </div>
      <div class="contract-pending-tip" v-if="crowdsalePending">
        <p>contract is pending, waiting for few minutes</p>
      </div>
    </div>
  </div>
</template>

<script>
import Blockies from '@/components/stories/blockies'
import CheckBox from '@/components/stories/checkbox'
import LdBtn from '@/components/stories/button'

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
      'LDBNFTs',
      'NFTsCrowdsale'
    ]),

    web3Opt () {
      return this.$root.$children[0].web3Opt
    }
  },
  components: {
    Blockies,
    CheckBox,
    LdBtn
  },
  methods: {

    /**
     * 检查是否 授权了市场合约
     */
    // async checkCrowdsale () {
    //   const LDBNFTs = this.LDBNFTs
    //   const NFTsCrowdsale = this.NFTsCrowdsale
    //   const crowdsaleModel = await LDBNFTs.isApprovedForAll(this.address, NFTsCrowdsale.address)
    //   console.log('authorize crowdsaleModel', crowdsaleModel)
    //   if (!crowdsaleModel) this.$emit('input', true)
    //   else this.$emit('input', false)

    //   this.crowdsaleModel = crowdsaleModel
    //   return crowdsaleModel
    // },

    /**
     * 授权市场合约
     */
    async chooseCrowdsale ({ LDBNFTs = this.LDBNFTs, web3Opt = this.web3Opt, NFTsCrowdsale = this.NFTsCrowdsale } = {}) {
      const crowdsaleModel = this.crowdsaleModel

      if (!crowdsaleModel) {
        // metamask 是否被打开
        this.metamaskChoose = true

        const { gasPrice } = web3Opt

        // 传输的合约参数
        const setApprovalForAll = {
          name: 'setApprovalForAll',
          values: [ NFTsCrowdsale.address, true ]
        }

        // 估算 gas,不准
        // const gas = (await LDBNFTs.estimateGas(setApprovalForAll.name, setApprovalForAll.values)) || 300000
        const gas = 300000

        // 执行合约
        LDBNFTs.methods(setApprovalForAll.name, setApprovalForAll.values.concat([{ gas, gasPrice }]))
          .then(tx => {
            this.crowdsalePending = true
            this.metamaskChoose = false
            this.$emit('pending', { tx })
          })
          .catch(err => {
            console.log('err', err)
            this.metamaskChoose = false
            this.$emit('error', err)
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';
  .crowdsale-box {
    padding-bottom: 10px;
    border-radius: 5px;
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
    height: 0;
    border-bottom: 1px dashed #fff;
    @include width(50%, 1);
    @include margin-around(30px, auto, 45px, auto, 1);
  }
  .crowdsale-choose {
    width: 26px;
    height: 26px;
    border-radius: 5px;
    overflow: hidden;
    background-color: $--secondary-color;
  }
  .crowdsale-text {
    margin-left: 10px;
    font-size: 18px;
  }
  .crowdsale-btn {
    @include margin('top', 40px, 1);
    @include padding('left', 25px, 1);
    @include padding('right', 25px, 1);
  }
</style>
