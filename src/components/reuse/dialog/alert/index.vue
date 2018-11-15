<template>
  <el-dialog
    :visible.sync="tipModel"
    :custom-class="`inline-block lordless-dialog message-dialog center mobile-center no-header transparent`"
    width="100%"
    append-to-body
    center
    top="-50px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    @open="$emit('open')"
    @close="$emit('close')">
    <div class="text-center lordless-message-box lordless-meta-dialog">
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
    </div>
    <!-- <div class="text-center lordless-message-box lordless-meta-dialog">
      <span
        @click.stop="closeDialog"
        class="inline-block line-height-1 lordless-message-close">
        <i class="el-icon-close"></i>
      </span>
      <h3 slot="title">
        No wallet available
      </h3>
      <p class="d-flex f-align-center TTFontBold alert-main-cnt">
        <span class="v-flex">
          We can’t connect the external wallet.<br>
          Please download the wallet beblow to play our game inside.
        </span>
      </p>
      <p class="d-flex f-auto-center alert-wallets">
        <lordless-btn
          class="d-inline-flex f-align-center alert-wallet-btn"
          theme="blue"
          @click="$emit('input', false)">
          可可钱包
        </lordless-btn>
      </p>
    </div> -->
  </el-dialog>
</template>

<script>
export default {
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
      tipModel: false
    }
  },
  watch: {
    value (val) {
      this.tipModel = val
      this.$emit('blurs', val)
    }
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
    padding-top: 30px;
    padding-bottom: 30px;
    >h3 {
      font-size: 24px;
    }
  }
  // .alert-main-cnt {
  //   margin-top: 14px;
  //   font-size: 16px;
  // }
  // .alert-wallets {
  //   margin-top: 30px;
  // }
  // .alert-wallet-btn {
  //   padding: 15px;
  // }
  .alert-main-cnt {
    margin-top: 25px;
    margin-bottom: 30px;
  }
  .lordless-meta-dialog {
    font-size: 16px;
  }
  .alert-btn {
    padding: 8px 14px;
    font-weight: bold;
    >svg {
      margin-right: 8px;
      width: 16px;
      height: 16px;
      stroke: $--text-blue-color;
      stroke-width: 2px;
      fill: none;
    }
  }
</style>
