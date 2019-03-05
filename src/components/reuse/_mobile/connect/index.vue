<template>
  <section class="d-flex col-flex f-auto-center text-center mobile-clipboard-box mobile-connect-box" :class="{ 'clipboard': clipBool }">
    <div class="mobile-connect-container">
      <p class="mobile-connect-icon">
        <svg>
          <use xlink:href="#icon-connect-wallet"/>
        </svg>
      </p>
      <h2>Connect wallet</h2>
      <p class="mobile-connect-desc">For external wallets, we will need to verify the ownership of your account by having you sign a message. This verification step will help to ensure your transaction information stays secure and private.</p>
      <p id="copy-link" class="TTFontBolder text-break mobile-connect-address"
        :data-clipboard-text="account">{{ account }}</p>
      <div class="mobile-connect-btns">
        <lordless-btn class="TTFontBolder mobile-connect-btn" theme="blue-linear" shadow @click="$emit('connect')">Connect</lordless-btn>
      </div>
    </div>
  </section>
</template>

<script>
import { publicMixins, clipboardMixins } from '@/mixins'
export default {
  name: 'mobile-connect',
  mixins: [publicMixins, clipboardMixins],
  data: () => {
    return {}
  }
}
</script>

<style lang="scss" scoped>
  .mobile-connect-box {
    // height: 100%;
  }
  .mobile-connect-container {
    padding: 15px 0 35px;
    margin: 0 auto;
    max-width: 290px;
    font-size: 16px;
    >h2 {
      margin-top: 18px;
      font-size: 20px;
      color: #0B2A48;
    }
  }
  .mobile-connect-icon {
    margin: 0 auto;
    width: 196px;
    height: 196px;
    line-height: 0;
    // fill: #bbb;
  }
  .mobile-connect-address {
    margin: 12px auto 0;
    padding: 9px 12px;
    max-width: 240px;
    border: 2px dashed #777;
    font-size: 16px;
    color: #777;
    background-color: #fff;
    border-radius: 5px;
  }
  .mobile-connect-desc {
    margin-top: 12px;
    color: #555;
    line-height: 1.2;
  }
  .mobile-connect-btns {
    margin-top: 36px;
  }
  .mobile-connect-btn {
    padding: 12px 0;
    width: 100%;
    &:not(:first-of-type) {
      margin-top: 12px;
    }
  }
</style>
