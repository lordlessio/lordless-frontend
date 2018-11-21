<template>
  <section class="d-flex f-auto-center text-center mobile-wallets-box">
    <div class="v-flex mobile-wallets-container">
      <h2 class="mobile-wallets-title">No wallet available</h2>
      <p class="mobile-wallets-desc">We can’t connect the external wallet.<br>Please download the wallet beblow to play our game inside.</p>
      <div class="mobile-wallet-btns">
        <lordless-btn class="full-width mobile-wallet-btn" theme="blue" inverse>
          <span class="inline-block wallet-icon">
            <svg>
              <use xlink:href="#icon-alphawallet"/>
            </svg>
          </span>
          <span class="inline-block arrow-icon">
            <svg>
              <use xlink:href="#icon-arrow-circle"/>
            </svg>
          </span>
        </lordless-btn>
        <lordless-btn class="full-width mobile-wallet-btn" theme="blue" inverse>
          <span class="inline-block wallet-icon">
            <svg>
              <use xlink:href="#icon-alphawallet"/>
            </svg>
          </span>
          <span class="inline-block arrow-icon">
            <svg>
              <use xlink:href="#icon-arrow-circle"/>
            </svg>
          </span>
        </lordless-btn>
        <lordless-btn class="full-width mobile-wallet-btn" theme="blue" inverse>
          <span class="inline-block wallet-icon">
            <svg>
              <use xlink:href="#icon-alphawallet"/>
            </svg>
          </span>
          <span class="inline-block arrow-icon">
            <svg>
              <use xlink:href="#icon-arrow-circle"/>
            </svg>
          </span>
        </lordless-btn>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'mobile-wallets'
}
</script>

<style lang="scss" scoped>
  .mobile-wallets-box {
    @include viewport-unit(min-height, 100vh, 112px);
  }
  .mobile-wallets-container {
    margin: 0 auto;
    max-width: 300px;
  }
  .mobile-wallets-title {
    font-size: 24px;
    color: #555;
  }
  .mobile-wallets-desc {
    margin-top: 18px;
    font-size: 16px;
    color: #999;
  }
  .mobile-wallet-btns {
    margin-top: 45px;
  }
  .mobile-wallet-btn {
    padding: 10px 0;
    &:not(:first-of-type) {
      margin-top: 12px;
    }
    .wallet-icon {
      width: 120px;
      height: 30px;
    }
    .arrow-icon {
      margin-left: 15px;
      width: 25px;
      height: 25px;
    }
  }
</style>
