<template>
  <header class="ld-header">
    <div class="container d-flex">
      <div class="text-left inline-block header-logo">
        <router-link to="/" class="inline-block">
          <svg class="inline-block">
            <use xlink:href="/static/svg/icon.svg#icon-logo-image"/>
          </svg>
          <svg class="inline-block logo-text">
            <use xlink:href="/static/svg/icon.svg#icon-logo-text"/>
          </svg>
        </router-link>
      </div>
      <div class="v-flex text-right header-text">
        <span class="inline-block">
          <router-link to="/">
          Marketplace
          </router-link>
        </span>
        <span class="inline-block">
          <router-link to="/">
          FAQs
          </router-link>
        </span>
        <span class="inline-block">
          <router-link to="/">
          Sign in
          </router-link>
        </span>
      </div>
    </div>
  </header>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
  .ld-header {
    height: 80px;
    background-color: #0E0F16;
  }
  .container {
    height: 100%;
    line-height: 80px;
    color: #fff;
  }

  .header-logo {
    svg {
      fill: #fff;
      width: 64px;
      height: 45px;
      vertical-align: middle;
      &.logo-text {
        margin-left: 10px;
        width: 119px;
        height: 32px;
        transform: translateY(5px);
      }
    }
  }
  .header-text {
    a {
      margin: 0 12px;
      color: #fff;
      font-size: 20px;
      font-weight: bold;
      text-decoration: none;
    }
  }
</style>
