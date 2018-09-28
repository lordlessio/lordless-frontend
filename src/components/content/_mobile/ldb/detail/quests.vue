<template>
  <div class="mobile-quests-box">
    <quests-skeletion v-if="loading"/>

    <transition name="ld-hide-fade">
      <div v-if="!loading">
        <h2 class="detail-mobile-title">Quests</h2>
        <div v-for="item of quests" :key="item._id" class="quests-now-item">
          <div class="d-flex row-flex">
            <div class="d-flex col-flex quests-now-icons">
              <span class="inline-block">
                <svg>
                  <use xlink:href="#icon-logo-image"/>
                </svg>
              </span>
              <span class="inline-block">
                <svg>
                  <use xlink:href="#icon-telegram"/>
                </svg>
              </span>
            </div>
            <div class="d-flex col-flex quests-now-detail">
              <p><link-symbol :href="item.ldbTaskType.url">{{ item.ldbTaskType.name }}</link-symbol></p>
              <div class="quests-now-rewards">
                <p>-{{ item.ldbTaskType.apCost }} AP</p>
                <p class="text-upper">+{{ item.ldbTaskType.priceInUSD * item.ldbTaskType.candyType.USD2TokenCount | formatDecimal }} {{ item.ldbTaskType.candyType.symbol }}</p>
                <p>+{{ item.ac }} AC</p>
              </div>
            </div>
            <div class="d-flex f-align-end">
              <lordless-btn
                class="quests-now-btn"
                theme="blue"
                shadow
                inverse
                :disabled="receiveLoading || !item.countLeft || owner"
                :loading="receiveLoading"
                @click="receive(item)">
                <span v-if="item.userStatus === 0">Applied</span>
                <span v-else-if="item.userStatus === 1">Completed</span>
                <span v-else-if="item.userStatus === -1">Failed</span>
                <span v-else>Apply</span>
              </lordless-btn>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import QuestsSkeletion from '@/components/skeletion/_mobile/ldb/detail/quests'
export default {
  props: {
    quests: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    ldbId: {
      type: [String, Number],
      default: null
    },
    owner: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      receiveLoading: false
    }
  },
  components: {
    QuestsSkeletion
  },
  methods: {
    async receive ({ _id, countLeft } = {}) {
      if (!_id || this.receiveLoading) return
      this.receiveLoading = true
      this.$emit('receive', { _id, countLeft }, ({ errorMsg, data } = {}) => {
        this.receiveLoading = false
        console.log('-------- receive')
        if (data) this.$router.push(`/task/${data._id}`)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .detail-mobile-title {
    margin-top: 20px;
    margin-bottom: 10px;
    font-size: 20px;
    color: $--text-third-color;
  }
  .quests-now-item {
    position: relative;
    padding: 25px;
    height: 100%;
    // background-image: linear-gradient(to right, #3A6073, #16222A);
    background-color: #fff;
    border-radius: 5px;
    // overflow: hidden;
    box-shadow: 0 2px 10px -1px rgba(0, 0, 0, 0.25);
    // &::after {
    //   content: '';
    //   position: absolute;
    //   top: -15%;
    //   left: 38%;
    //   width: 100%;
    //   padding-top: 100%;
    //   border-radius: 100%;
    //   background-image: linear-gradient(45deg , #00C0EB, #3588FD);
    //   mix-blend-mode: soft-light;
    //   overflow: hidden;
    //   z-index: 1;
    // }
    >div {
      position: relative;
      z-index: 2;
    }
  }
  .quests-now-icons {
    >span {
      padding: 18px;
      width: 76px;
      height: 76px;
      border-radius: 100%;
      fill: $--text-blue-color;
      background-color: #fff;
      box-shadow: 0 2px 10px -1px rgba(0, 0, 0, 0.25);
      box-sizing: border-box;
      &:not(:first-of-type) {
        margin-top: -15px;
        z-index: -1;
      }
    }
  }
  .quests-now-detail {
    margin-left: 25px;
    max-width: 125px;
    >p {
      font-size: 18px;
      // word-break: break-all;
    }
  }
  .quests-now-rewards {
    margin-top: 18px;
    color: #999;
    white-space: nowrap;
    >p {
      font-size: 16px;
    }
  }
  .quests-now-btn {
    padding: 9px 14px;
    font-size: 14px;
  }
</style>
