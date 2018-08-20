<template>
  <div class="ld-activity-card" :class="{ 'shadow': shadow }">
    <div class="ld-activity-container">
      <div class="d-flex f-align-center activity-status-box">
        <div class="v-flex d-flex f-align-center">
          <span class="inline-block line-height-1 activity-status-svg">
            <svg>
              <use :xlink:href="`#${statusSvg}`"/>
            </svg>
          </span>
          <div class="v-flex ld-activity-desc">
            <p>{{ new Date() | dateFormat }}</p>
            <p v-if="type === 'CANCELAUCTION'">You cancelled the sale of <span> LDB #{{ info.market[0].tokenId }}. </span> You will get it back when the transaction is confirmed on chain.</p>
            <p v-else-if="type === 'NEWAUCTION'">You started a sale by action for <span> LDB #{{ info.market[0].tokenId }}. </span></p>
            <p v-else>You requested to purchase <span> LDB #{{ info.market[0].tokenId }}. </span> If nobody's confirmation comes earlier, you will get the LDB finally.</p>
          </div>
        </div>
        <div class="d-flex col-flex f-justify-between text-right activity-view-detail">
          <ld-btn
            class="activity-view-btn"
            theme="blue">
            <a class="d-flex f-align-center" :href="`${ETHERSCANURL}/${tx}`" target="_blank">
              <span class="inline-block activity-view-svg">
                <svg>
                  <use xlink:href="#icon-etherscan"/>
                </svg>
              </span>
              <span>View Details</span>
            </a>
          </ld-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LdBtn from '@/components/stories/button'
export default {
  props: {
    shadow: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: 'PAYBYETHSUCCESS'
    },
    tx: {
      type: String,
      default: ''
    },
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    statusSvg () {
      if (this.type === 'CANCELAUCTION') {
        return 'icon-cancel-sale'
      }
      if (this.type === 'NEWAUCTION') {
        return 'icon-sale'
      }
      console.log('type', this.type)
      if (this.type === 'PAYBYETHSUCCESS' || this.type === 'PAYBYETH') {
        return 'icon-auction'
      }
    },
    ETHERSCANURL () {
      return process.env.ETHERSCANURL
    }
  },
  components: {
    LdBtn
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';
  .ld-activity-card {
    background-color: #fff;
    border-radius: 5px;
    @include padding-around(35px, 45px, 35px, 45px, 1);
    &.shadow {
      box-shadow: 5px 5px 5px 0 rgba(0, 0, 0, .1);
    }
  }
  .ld-activity-container {
    color: #555;
    h2 {
      font-family: $--font-TTNormsBold;
      font-size: 24px;
    }
  }

  .activity-status-svg {
    margin-right: 15px;
    padding: 20px;
    width: 75px;
    height: 75px;
    fill: #fff;
    background-color: $--text-blue-color;
    border-radius: 100%;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, .25);
    box-sizing: border-box;
    >svg {
      width: 100%;
      height: 100%;
    }
  }

  .ld-activity-desc {
    >p {
      &:nth-of-type(1) {
        color: #555;
        font-size: 14px;
      }
      &:nth-of-type(2) {
        min-height: 50px;
        margin-top: 8px;
        color: #999;
        font-size: 18px;
        >span {
          color: $--text-blue-color;
        }
      }
    }
  }

  .activity-view-detail {
    @include margin('left', 80px, -2);
  }
  .activity-view-btn {
    padding: 0;
    font-size: 20px;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .25);
    >a {
      padding: 17px 20px;
    }
  }
  .activity-view-svg {
    margin-right: 12px;
    width: 30px;
    height: 30px;
  }

</style>
