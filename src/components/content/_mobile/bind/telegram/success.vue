<template>
  <div class="telegram-bind-success-box">
    <div class="d-flex f-auto-center container bind-success-container">
      <div class="text-center bind-success-content">
        <p class="success-human-icon">
          <span class="inline-block line-height-0">
            <svg>
              <use xlink:href="#icon-human"/>
            </svg>
          </span>
        </p>
        <p class="success-ok-icon">
          <span class="inline-block line-height-0">
            <svg>
              <use xlink:href="#icon-gradient-ok"/>
            </svg>
          </span>
        </p>
        <p>You have bound to the account</p>
        <h3 class="d-flex f-auto-center bound-user-info">
          <span class="inline-block line-height-0 bound-info-icon">
            <svg>
              <use xlink:href="#icon-telegram"/>
            </svg>
          </span>
          <span>{{ userInfo.telegram.username || `${userInfo.telegram.first_name || ''} ${userInfo.telegram.last_name || ''}` }}</span>
        </h3>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'telegram-bind-success-component',
  computed: {
    ...mapState('user', [
      'userInfo'
    ])
  }
}
</script>

<style lang="scss" scoped>
  .telegram-bind-success-box {

  }
  .bind-success-container {
    padding: 80px 0 50px;
    box-sizing: border-box;
    @include viewport-unit(min-height, 100vh);
  }
  .success-human-icon {
    >span {
      width: 270px;
      height: 250px;
    }
  }
  .success-ok-icon {
    margin-top: 10px;
    margin-bottom: 10px;
    >span {
      width: 100px;
      height: 100px;
    }
  }
  .bound-user-info {
    margin-top: 12px;
    font-size: 20px;
    color: #0B2A48;
  }
  .bound-info-icon {
    margin-right: 8px;
    width: 20px;
    height: 20px;
    fill: #0B2A48;
  }
</style>
