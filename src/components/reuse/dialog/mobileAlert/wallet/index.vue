<template>
  <el-dialog
    :visible.sync="tipModel"
    :custom-class="`inline-block lordless-dialog message-dialog center no-header transparent`"
    width="100%"
    append-to-body
    center
    top="0"
    :close-on-click-modal="true"
    :close-on-press-escape="false"
    :show-close="false"
    @open="$emit('open')"
    @close="$emit('close')">
    <!-- <div class="text-center lordless-message-box lordless-meta-dialog">
      <h3 slot="title">
        Oops!
      </h3>
      <p class="d-flex f-align-center TTFontBold alert-main-cnt">
        <span class="v-flex">
          Mobile browser is not supported by Metamask.<br>
          Enter the website below in Chrome/Firefox for desktop instead.
        </span>
      </p>
      <p slot="footer">
        <lordless-btn
          class="d-inline-flex f-align-center alert-btn"
          theme="blue"
          @click="$emit('input', false)">Confirm</lordless-btn>
      </p>
    </div> -->
    <div class="text-center lordless-message-box lordless-meta-dialog">
      <span
        @click.stop="closeDialog"
        class="inline-block line-height-1 lordless-message-close">
        <i class="el-icon-close"></i>
      </span>

      <mobile-wallets dialog/>
      <!-- <h3 slot="title">
        No wallet available
      </h3>
      <p class="d-flex f-align-center TTFontBold alert-main-cnt">
        <span class="v-flex">
          We can’t connect the external wallet.<br>
          Please download the wallet beblow to play our game inside.
        </span>
      </p>
      <p class="d-flex f-wrap f-align-center alert-wallets" :class="{ 'f-justify-around': wallets.length > 1, 'f-justify-center': wallets.length <= 1 }">
        <lordless-btn
          v-for="(item, index) of wallets"
          :key="index"
          class="d-inline-flex f-align-center alert-wallet-btn"
          theme="blue">
          <a class="line-height-0 inline-block" target="_blank" :href="item.link">
            <img :src="item.logo"/>
          </a>
        </lordless-btn>
      </p> -->
    </div>
  </el-dialog>
</template>

<script>
import MobileWallets from '@/components/reuse/_mobile/wallets/trust'
import { layoutMixins } from '@/mixins'
import { addClass, removeClass } from 'utils/tool'
export default {
  mixins: [layoutMixins],
  props: {
    value: {
      type: Boolean,
      default: false
    },
    desc: {
      type: String,
      default: ''
    }
  },
  data: () => {
    return {
      tipModel: false,
      wallets: [
        {
          name: 'AlphaWallet',
          logo: '/static/svg/wallet/alphawallet_en.svg',
          link: 'https://alphawallet.com/'
        },
        {
          name: 'coco-wallet',
          logo: '/static/svg/wallet/coco_en.svg',
          link: 'http://cocowallet.com.cn/'
        },
        {
          name: 'Buntoy',
          logo: '/static/svg/wallet/buntoy_en.svg',
          link: 'https://www.buntoy.com/'
        }
      ]
    }
  },
  watch: {
    value (val) {
      this.tipModel = val
      this.$emit('blurs', val)
    },
    tipModel (val) {
      const lordless = document.getElementById('lordless')
      if (val) {
        addClass('mobile-dialog-open', lordless)
      } else {
        removeClass('mobile-dialog-open', lordless)
      }
    }
  },
  components: {
    MobileWallets
  },
  methods: {
    closeDialog () {
      this.$emit('input', false)
    }
  }
}
</script>

<style lang="scss" scoped>
  .lordless-message-box {
    padding-top: 50px;
    padding-bottom: 50px;
    // >h3 {
    //   font-size: 24px;
    // }
  }
  // .alert-main-cnt {
  //   margin-top: 14px;
  //   font-size: 16px;
  // }
  // .alert-wallets {
  //   margin-top: 20px;
  // }
  // .alert-wallet-btn {
  //   margin-top: 15px;
  //   padding: 8px 15px;
  //   img {
  //     width: 120px;
  //     height: 40px;
  //   }
  // }


  // oops style

  // .alert-main-cnt {
  //   margin-top: 25px;
  //   margin-bottom: 30px;
  // }
  // .lordless-meta-dialog {
  //   font-size: 16px;
  // }
  // .alert-btn {
  //   padding: 8px 14px;
  //   font-weight: bold;
  //   >svg {
  //     margin-right: 8px;
  //     width: 16px;
  //     height: 16px;
  //     stroke: $--text-blue-color;
  //     stroke-width: 2px;
  //     fill: none;
  //   }
  // }
</style>
