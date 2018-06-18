<template>
  <footer class="ld-footer">
    <div class="container">
      <div class="d-flex footer-top">
        <div class="v-flex text-left footer-logo">
          <router-link to="/" class="inline-block">
            <svg class="inline-block logo-img">
              <use xlink:href="/static/svg/icon.svg#icon-logo-image"/>
            </svg>
            <svg class="inline-block logo-text">
              <use xlink:href="/static/svg/icon.svg#icon-logo-text"/>
            </svg>
          </router-link>
        </div>
        <div class="v-flex text-right footer-icons-box">
          <div class="footer-icons-item">
            <a class="inline-block" target="__blank" href="https://twitter.com/LordLessIo">
              <svg>
                <use xlink:href="/static/svg/icon.svg#icon-twitter"/>
              </svg>
            </a>
          </div>
          <div class="footer-icons-item">
            <a class="inline-block" target="_blank" href="https://github.com/lordlessio">
              <svg>
                <use xlink:href="/static/svg/icon.svg#icon-github"/>
              </svg>
            </a>
          </div>
          <div class="footer-icons-item">
            <a class="inline-block" target="_blank" href="https://medium.com/@LordLessIo">
              <svg>
                <use xlink:href="/static/svg/icon.svg#icon-medium"/>
              </svg>
            </a>
          </div>
          <div class="footer-icons-item">
            <a class="inline-block" target="_blank" href="https://t.me/lordlessio">
              <svg>
                <use xlink:href="/static/svg/icon.svg#icon-telegram"/>
              </svg>
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

}
</script>

<style lang="scss" scoped>
  .ld-footer {
    margin-top: -230px;
    padding-top: 50px;
    padding-bottom: 50px;
    height: 130px;
    background-color: #000;
    color: #fff;
    svg {
      fill: #fff;
    }
  }
  .container {
    height: 100%;
    // line-height: 150px;
    color: #fff;
    // text-align: center;
  }
  .footer-top {
    margin-bottom: 60px;
  }
  .footer-logo {
    .logo-img {
      width: 64px;
      height: 45px;
    }
    .logo-text {
      margin-left: 10px;
      width: 119px;
      height: 32px;
    }
  }
  .footer-icons-item {
    display: inline-block;
    margin: 0 23px;
    svg {
      width: 30px;
      height: 30px;
    }
  }
  .footer-copyright {
    font-weight: 500;
  }
</style>
