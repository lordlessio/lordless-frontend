<template>
  <div class="ad-space-box">
    <div class="d-flex f-align-center ad-space-container">
      <span>Ad space for rent. </span>
      <span>
        <a href="https://t.me/EuryChen" target="_blank">Book your slot here!</a>
      </span>
      <span class="inline-block line-height-0 ad-space-finger">
        <svg>
          <use xlink:href="#icon-finger-left"/>
        </svg>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mobile-ad-space'
}
</script>

<style lang="scss" scoped>
  .ad-space-container {
    padding-left: 30px;
    height: 60px;
    line-height: 60px;
    font-size: 16px;
    color: #fff;
    background-image: linear-gradient(45deg, #E64C4C 0%, #2D1F98 100%);
    a {
      margin: 0 5px;
      color: inherit;
      text-decoration: underline;
    }
  }
  .ad-space-finger {
    width: 20px;
    height: 20px;
    fill: #fff;
  }
</style>
