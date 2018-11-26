<template>
  <section class="d-flex col-flex f-auto-center text-center mobile-connect-box">
    <div class="mobile-connect-container">
      <p class="mobile-connect-icon">
        <svg>
          <use xlink:href="#icon-wallet"/>
        </svg>
      </p>
      <p class="TTFontBolder text-break mobile-connect-address">{{ account }}</p>
      <p class="mobile-connect-desc">For external wallets, we will need to verify the ownership of your account by having you sign a message.<br>This verification step will help to ensure your transaction information stays secure and private.</p>
      <div class="mobile-connect-btns">
        <lordless-btn class="TTFontBolder mobile-connect-btn" theme="blue" inverse shadow @click="$emit('connect')">Connect</lordless-btn>
      </div>
    </div>
  </section>
</template>

<script>
import { publicMixins } from '@/mixins'
export default {
  name: 'mobile-connect',
  mixins: [publicMixins],
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
    margin: 0 auto;
    max-width: 300px;
    font-size: 16px;
  }
  .mobile-connect-icon {
    margin: 0 auto;
    width: 120px;
    height: 120px;
    line-height: 0;
    fill: #999;
  }
  .mobile-connect-address {
    margin-top: 36px;
    padding: 10px 12px;
    border: 2px dashed #4586FC;
    color: #4586FC;
  }
  .mobile-connect-desc {
    margin-top: 12px;
    color: #999;
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
