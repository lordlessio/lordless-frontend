<template>
  <footer class="ld-footer" :class="theme" v-if="show">
    <div class="container">
      <div class="d-flex sm-col-flex lg-f-align-center sm-text-center footer-top">
        <div class="v-flex lg-text-left footer-logo">
          <router-link to="/" class="inline-block" v-if="theme !== 'default'">
            <svg class="inline-block logo-img">
              <use xlink:href="#icon-logo-image"/>
            </svg>
            <svg class="inline-block logo-text">
              <use xlink:href="#icon-logo-text"/>
            </svg>
          </router-link>
          <router-link to="/" class="inline-block" v-if="theme === 'default'">
            <img alt="lordless logo" class="footer-logo-png" src="~/static/img/footer/ld-footer-logo.png"/>
          </router-link>
        </div>
        <div class="sm-d-flex sm-f-justify-around lg-text-right footer-icons-box">
          <div class="sm-v-flex footer-icons-item">
            <a class="inline-block" target="__blank" href="https://twitter.com/lordless_global">
              <svg v-if="theme !== 'default'">
                <use xlink:href="#icon-twitter"/>
              </svg>
              <img alt="twitter icon" v-if="theme === 'default'" src="~/static/img/footer/ld-Twitter-icon.png"/>
            </a>
          </div>
          <div class="sm-v-flex footer-icons-item">
            <a class="inline-block" target="_blank" href="https://github.com/lordlessio">
              <svg v-if="theme !== 'default'">
                <use xlink:href="#icon-github"/>
              </svg>
              <img alt="github icon" v-if="theme === 'default'" src="~/static/img/footer/ld-Github-icon.png"/>
            </a>
          </div>
          <div class="sm-v-flex footer-icons-item">
            <a class="inline-block" target="_blank" href="https://medium.com/@LordLessIo">
              <svg v-if="theme !== 'default'">
                <use xlink:href="#icon-medium"/>
              </svg>
              <img alt="medium icon" v-if="theme === 'default'" src="~/static/img/footer/ld-Medium-icon.png"/>
            </a>
          </div>
          <div class="sm-v-flex footer-icons-item">
            <a class="inline-block" target="_blank" href="https://t.me/lordless_global">
              <svg v-if="theme !== 'default'">
                <use xlink:href="#icon-telegram"/>
              </svg>
              <img alt="telegram icon" v-if="theme === 'default'" src="~/static/img/footer/ld-Telegram-icon.png"/>
            </a>
          </div>
        </div>
      </div>
      <div class="text-center footer-copyright">Copyright © 2017 - 2018 LORDLESS. All right reserved</div>
    </div>
  </footer>
</template>

<script>
export default {
  props: {

    // 是否显示
    show: {
      type: Boolean,
      default: true
    },

    // footer 主题
    theme: {
      type: String,
      default: 'default'
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/class_mixin.scss';
  .ld-footer {
    height: 130px;
    @include margin('top', -230px, 1);
    @include padding('top', 80px, 1.34);
    @include padding('bottom', 100px, 1.34);
    &.default {
      background-color: #fff;
      color: #373737;
      fill: #fff;
      border-top: 1px solid #E1E1E2;
    }
    &.dark {
      background-color: #000;
      color: #fff;
      fill: #fff;
      border-top: 1px solid #373737;
    }
  }
  .container {
    height: 100%;
  }
  .footer-top {
    @include margin('bottom', 70px, 2);
  }
  .footer-logo {
    .footer-logo-png {
      width: 200px;
    }
    .logo-img {
      width: 64px;
      height: 45px;
    }
    .logo-text {
      width: 119px;
      height: 32px;
      @include margin('left', 10px, 1);
    }
  }
  .footer-icons-box {
    @include margin('top', 30px, 1, -1);
  }
  .footer-icons-item {
    display: inline-block;
    @include margin('left', 23px, -2);
    @include margin('right', 23px, -2);
    svg {
      fill: inherit;
    }
    svg, img {
      width: 30px;
      height: 30px;
    }
  }
  .footer-copyright {
    font-weight: 500;
  }

</style>
