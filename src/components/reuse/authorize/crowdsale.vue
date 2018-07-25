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
          <p class="crowdsale-info-text">{{ address }}</p>
        </div>
        <p class="crowdsale-markline"></p>
        <div class="crowdsale-cnt-bottom">
          <p class="TTFontBolder">Authorization</p>
          <p class="crowdsale-info-text">Authorization the <a href="#" class="TTFontBolder">Marketplace contract</a> to operate LDB</p>
        </div>
        <div>
          <ld-btn
            class="TTFontBolder lordless-message-btn crowdsale-btn"
            theme="info"
            shadow
            :disabled="crowdsalePending"
            @click="chooseCrowdsale">Go</ld-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Blockies from '@/components/stories/blockies'
import CheckBox from '@/components/stories/checkbox'
import LdBtn from '@/components/stories/button'

import { mapState } from 'vuex'
export default {
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
      'ldbNFTContract',
      'ldbNFTCrowdsaleContract'
    ])
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
    //   const ldbNFTContract = this.ldbNFTContract
    //   const ldbNFTCrowdsaleContract = this.ldbNFTCrowdsaleContract
    //   const crowdsaleModel = await ldbNFTContract.isApprovedForAll(this.address, ldbNFTCrowdsaleContract.address)
    //   console.log('authorize crowdsaleModel', crowdsaleModel)
    //   if (!crowdsaleModel) this.$emit('input', true)
    //   else this.$emit('input', false)

    //   this.crowdsaleModel = crowdsaleModel
    //   return crowdsaleModel
    // },

    /**
     * 授权市场合约
     */
    chooseCrowdsale () {
      const crowdsaleModel = this.crowdsaleModel
      const ldbNFTContract = this.ldbNFTContract
      const ldbNFTCrowdsaleContract = this.ldbNFTCrowdsaleContract
      if (!crowdsaleModel) {
        this.crowdsalePending = true
        ldbNFTContract.setApprovalForAll(ldbNFTCrowdsaleContract.address, true)
          .then(d => {
            this.$emit('pending', d)
          })
          .catch(err => {
            this.crowdsalePending = false
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
    border-radius: 5px;
    @include padding('bottom', 40px, 1);
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
    @include margin-around(15px, auto, 30px, auto, 1);
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
