<template>
  <div class="authorize-status-box">
    <div class="authorize-status-container text-center">
      <h1 class="TTFontBolder">{{ infos[type].title }}</h1>
      <p>{{ infos[type].content }}</p>
      <p>New here?Read our guide on getting started.</p>
      <ld-btn theme="info" class="TTFontBolder lordless-message-btn" @click="$router.push('/status')">Read guide</ld-btn>
      <img-box class="authorize-status-img" :center="false" :src="infos[type].imgUrl"></img-box>
    </div>
  </div>
</template>

<script>
import ImgBox from '@/components/stories/image'
import LdBtn from '@/components/stories/button'
export default {
  props: {
    type: {
      type: String,
      default: 'missing'
    }
  },
  data: () => {
    return {
      infos: {
        missing: {
          title: 'MetaMask is Missing',
          content: 'Install MetaMask in your browser extension market.',
          imgUrl: '~static/img/status/status-metamask-addon.png'
        },
        locked: {
          title: 'Your MetaMask is locked',
          content: 'Open MetaMask and follow the instructions to unlock it.',
          imgUrl: '~static/img/status/status-metamask-addon.png'
        },
        browser: {
          title: 'Your browser is unsupported',
          content: 'You need to use Chrome or Firefox which allows you to use MetaMask.',
          imgUrl: '~static/img/status/status-borwser.png'
        }
      }
    }
  },
  components: {
    ImgBox,
    LdBtn
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';
  // .authorize-status-box {
  //   max-width: 600px;
  //   color: #fff;
  //   background-image: linear-gradient(135deg, #5961F9, #EE9AE5);
  //   border-radius: 5px;
  //   box-sizing: border-box;
  //   @include padding-around(70px, 50px, 30px, 50px, 1);
  // }
  .authorize-status-container {
    >h1 {
      @include margin('bottom', 10px, 1);
      @include fontSize(36px, 1.2);
    }
    >p {
      @include fontSize(18px, 1.2);
    }
    >button {
      padding: 12px 20px;
      @include margin(-1, 30px, 1);
    }
    .authorize-status-img {
      margin: 0 auto;
      width: 90%;
    }
  }
</style>
