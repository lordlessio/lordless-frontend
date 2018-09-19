<template>
  <div class="info-item-container info-home-section">
    <h2 class="info-cnt-title">Home</h2>
    <div v-if="loading" class="d-flex f-align-center info-home-skeletion">
      <p class="skeletion-breath"></p>
      <div class="v-flex skeletion-breath">
        <p></p>
        <p></p>
        <p></p>
      </div>
    </div>
    <transition name="ld-hide-in-fade">
      <div v-if="!loading" class="d-flex f-align-center info-cnt-box info-home-box">
        <div class="info-home-poster">
          <svg v-if="!home || !home._id">
            <use xlink:href="#icon-help"/>
          </svg>
          <img v-else alt="tavern popularity" :src="`/img/tavern/ldb-level-${home.ldb.chain.popularity}.png` | originSource({ size: 135 })"/>
        </div>
        <div class="v-flex info-home-cnt">
          <div class="info-home-unknow" v-if="!home || !home._id">
            <p>{{ call }} have no home now.</p>
            <p v-if="owner">Set a home you will be located there when you login.</p>
            <lordless-btn
              class="user-info-btn"
              theme="blue"
              inverse
              shadow
              @click="$router.push('/lbs')">
              View map now
            </lordless-btn>
          </div>
          <div class="info-home-know" v-if="home && home._id">
            <p class="info-ldb-name">{{ home.ldb.name.zh }}</p>
            <p class="text-ellipsis info-ldb-influence">{{ home.ldb.chain.influence }} influence</p>
            <div class="d-flex f-align-baseline info-home-status">
              <p class="v-flex">{{ home.ldb.apLeft }} AP remaining</p>
              <lordless-btn
                class="user-info-btn"
                theme="blue"
                inverse
                shadow
                @click="$router.push(`/tavern/${home.ldb.id}`)">
                Go
              </lordless-btn>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    home: {
      type: Object,
      default: () => {
        return {}
      }
    },
    owner: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    call () {
      return this.owner ? 'You' : 'He(She)'
    }
  }
}
</script>

<style lang="scss" scoped>
  // info-home-skeletion
  .info-home-skeletion {
    padding: 20px 25px;
    background-color: $--skeletion-light;
    border-radius: 5px;
    >p {
      width: 90px;
      height: 90px;
      border-radius: 100%;
      background-color: $--skeletion-dark;
    }
    >div {
      margin-left: 15px;
      >p {
        background-color: $--skeletion-dark;
        &:nth-of-type(1) {
          width: 150px;
          height: 25px;
        }
        &:nth-of-type(2) {
          margin-top: 15px;
          width: 100px;
          height: 18px;
        }
        &:nth-of-type(3) {
          margin-top: 20px;
          width: 200px;
          height: 25px;
        }
      }
    }
  }

  // info-home-section
  .info-home-section {
    @include margin('left', 15px, -2);
  }
  .info-home-box {
    @include height(135px, -2);
  }

  .info-home-cnt {
    margin-left: 20px;
  }
  .info-home-poster {
    position: relative;
    padding: 22px;
    width: 90px;
    height: 90px;
    border-radius: 100%;
    box-sizing: border-box;
    box-shadow: 2.5px 5px 20px 0 rgba(0, 0, 0, .25);
    // @include padding(-1, 22px, 1);
    svg {
      width: 100%;
      height: 100%;
      fill: #BDB9FD;
    }
    >img {
      position: absolute;
      left: -15%;
      top: -15%;
      width: 130%;
    }
  }
  .info-home-unknow {
    color: #999999;
    font-size: 14px;
  }

  .info-ldb-name {
    font-size: 20px;
    font-weight: 500;
  }
  .info-ldb-influence {
    margin-top: 6px;
    font-size: 16px;
    color: #999999;
  }

  .info-home-status {
    color: #4E47D3;
    @include fontSize(20px, 1.2);
  }
</style>
