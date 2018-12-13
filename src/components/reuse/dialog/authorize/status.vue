<template>
  <div class="authorize-status-box" @touchmove.stop>
    <div class="authorize-status-container text-center">
      <h1 class="TTFontBolder">{{ statusInfos[type].title }}</h1>
      <p>{{ statusInfos[type].content }}</p>
      <p>New here?Read our guide on getting started.</p>
      <lordless-btn theme="deep-blue" class="TTFontBolder lordless-message-btn" @click="$router.push('/guide')">Read guide</lordless-btn>
      <lordless-img class="authorize-status-img" :alt="statusInfos[type].title" :sType="statusInfos[type].sType" :center="false" :src="statusInfos[type].imgUrl | originSource"/>
    </div>
  </div>
</template>

<script>
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
        mobile: {
          missing: {
            title: 'Web3 is Missing',
            content: 'Install MetaMask in your browser extension market.',
            imgUrl: '/img/guide/status-metamask-addon.png',
            sType: 'width'
          },
          locked: {
            title: 'Your Web3 is locked',
            content: 'Open MetaMask and follow the instructions to unlock it.',
            imgUrl: '/img/guide/status-locked-metamask.png',
            sType: 'width'
          },
          network: {
            title: 'Ethereum network is unallow',
            content: 'Please Choose a right network.',
            imgUrl: '/img/guide/status-main-network.png',
            sType: 'auto'
          },
          browser: {
            title: 'Your browser is unsupported',
            content: 'You need to use Chrome or Firefox which allows you to use MetaMask.',
            imgUrl: '/img/guide/status-borwser.png',
            sType: 'width'
          }
        },
        pc: {
          missing: {
            title: 'MetaMask is Missing',
            content: 'Install MetaMask in your browser extension market.',
            imgUrl: '/img/guide/status-metamask-addon.png',
            sType: 'width'
          },
          locked: {
            title: 'Your MetaMask is locked',
            content: 'Open MetaMask and follow the instructions to unlock it.',
            imgUrl: '/img/guide/status-locked-metamask.png',
            sType: 'width'
          },
          network: {
            title: 'MetaMask network is unallow',
            content: 'Open MetaMask and Choose right network.',
            imgUrl: '/img/guide/status-main-network.png',
            sType: 'auto'
          },
          browser: {
            title: 'Your browser is unsupported',
            content: 'You need to use Chrome or Firefox which allows you to use MetaMask.',
            imgUrl: '/img/guide/status-borwser.png',
            sType: 'width'
          }
        }
      }
    }
  },
  computed: {
    isMobile () {
      return this.$root.$children[0].isMobile
    },
    statusInfos () {
      const type = this.isMobile ? 'mobile' : 'pc'
      return this.infos[type]
    }
  }
}
</script>

<style lang="scss" scoped>

  .authorize-status-box {
    padding-top: 15px;
  //   max-width: 600px;
  //   color: #fff;
  //   background-image: linear-gradient(135deg, #5961F9, #EE9AE5);
  //   border-radius: 5px;
  //   box-sizing: border-box;
  //   @include padding-around(70px, 50px, 30px, 50px, 1);
  }
  .authorize-status-container {
    >h1 {
      @include margin('bottom', 10px, 1);
      @include fontSize(36px, 1.4);
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
      max-height: 400px;
    }
  }
</style>
