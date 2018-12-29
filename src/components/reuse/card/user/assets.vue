<template>
  <transition name="ld-hide-in-fade">
    <div v-if="!loading" class="info-item-container user-info-section info-assets-section">
      <h2 class="info-cnt-title">Assets</h2>
      <div class="d-flex f-align-center sm-col-flex text-center">
        <div class="v-flex d-flex col-flex info-cnt-box info-card-cnt assets-estimated-box" style="z-index: 3;">
          <p class="card-cnt-title">Estimated Value</p>
          <div class="v-flex d-flex col-flex assets-estimated-cnt">
            <p class="card-cnt-tip">Valued by USD</p>
            <div class="v-flex d-flex col-flex f-auto-center card-cnt-box estimated-cnt-box">
              <h1 class="TTFontBlack">${{ overviews.estimated || 0 | formatDecimal }}</h1>
              <!-- <p class="">USD</p> -->
            </div>
          </div>
        </div>
        <div class="v-flex d-flex col-flex info-cnt-box info-card-cnt assets-earnings-box" style="z-index: 2;">
          <p class="card-cnt-title">Taverns earnings</p>
          <div v-if="!overviews.ldbEarnings.total" class="v-flex d-flex col-flex assets-earnings-unknow">
            <p class="card-cnt-tip">Rewards from Taverns</p>
            <div class="v-flex d-flex col-flex f-auto-center card-cnt-box">
              <p>You have no transactions</p>
              <lordless-btn
                class="user-info-btn"
                theme="blue"
                inverse
                shadow
                @click.native="$router.push('/taverns')">
                Buy a Tavern
              </lordless-btn>
            </div>
          </div>
          <div v-if="overviews.ldbEarnings.total" class="v-flex d-flex col-flex assets-earnings-know">
            <p class="card-cnt-tip">Rewards from Taverns</p>
            <div class="v-flex d-flex col-flex assets-earnings-list">
              <ul class="text-left">
                <li
                  v-for="item of overviews.ldbEarnings.list.slice(0, overviews.ps)"
                  :key="item._id"
                  class="d-flex f-align-center earnings-list-item">
                  <div class="v-flex d-flex f-align-center text-ellipsis">
                    <span>Reward from</span>
                    <lordless-blockies
                      class="inline-block line-height-0 mar-l1"
                      :scale="3"
                      radius="3px"
                      jump
                      :seed="item.executor.info"></lordless-blockies>
                  </div>
                  <span class="earnings-item-reward">+{{ item.lord.reward.count | sliceStr({ end: 6 }) }} <span>{{ item.reward.candy.symbol }}</span></span>
                </li>
                <li
                  v-if="overviews.ldbEarnings.total >= overviews.ps"
                  class="info-more">
                  <router-link class="d-flex f-align-baseline" to="/owner/candy">
                    <span>More </span>
                    <span data-type="icon">
                      <i class="el-icon-d-arrow-right"></i>
                    </span>
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="v-flex d-flex col-flex info-cnt-box info-card-cnt assets-recent-box" style="z-index: 1;">
          <p class="card-cnt-title">Recent transactions</p>
          <div v-if="!recents.total" class="v-flex d-flex col-flex assets-recent-unknow">
            <p class="card-cnt-tip">Rewards from Taverns</p>
            <div class="v-flex d-flex f-auto-center col-flex card-cnt-box">
              <p>You have no transactions</p>
              <lordless-btn
                class="user-info-btn"
                theme="blue"
                inverse
                shadow
                @click.native="$router.push('/taverns')">
                Taverns
              </lordless-btn>
            </div>
          </div>
          <div v-if="recents.total" class="v-flex d-flex col-flex assets-recent-know">
            <p class="card-cnt-tip">Rewards from Taverns</p>
            <div class="v-flex d-flex col-flex assets-recent-list">
              <ul class="text-left">
                <li
                  class="d-flex recent-list-item"
                  v-for="(recent, index) of recents.list.slice(0, overviews.ps)"
                  :key="index">
                  <p class="v-flex text-ellipsis">
                    Bought
                    <a :href="`${ETHERSCANURL}/tx/${recent.tx.transactionHash}`" target="_blank"> #{{ recent.market[0].tokenId }} </a>
                    for
                    <span> {{ recent.market[0].price | weiToEth }} ETH</span>
                  </p>
                  <span class="recent-item-date">{{ recent.created_at | timeFormat }}</span>
                </li>
                <li
                  v-if="recents.total >= recents.ps"
                  class="info-more">
                  <router-link class="d-flex f-align-baseline" to="/owner/activity">
                    <span>More </span>
                    <span data-type="icon">
                      <i class="el-icon-d-arrow-right"></i>
                    </span>
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    recents: {
      type: Object,
      default: () => {
        return {}
      }
    },
    overviews: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    ETHERSCANURL () {
      return process.env.ETHERSCANURL
    }
  }
}
</script>

<style lang="scss" scoped>
  // info-card-cnt
  .info-card-cnt {
    position: relative;
    height: 260px;
    font-family: $--font-TTNormsRegular;
    &:not(:first-of-type) {
      @include margin('top', 20px, 1, -2);
      @include margin('left', -8px, -2);
      @include padding('left', 33px, -2);
    }
  }
  .card-cnt-title {
    font-family: $--font-TTNormsMedium;
    font-size: 20px;
  }
  .card-cnt-tip {
    font-size: 14px;
    color: #999;
    @include padding('top', 5px, 1);
    @include padding('bottom', 10px, 1);
  }
  .card-cnt-box {
    color: #999;
  }

  // info-assets-section
  .estimated-cnt-box {
    color: #4E47D3;
    >h1 {
      font-size: 48px;
    }
    >p {
      font-size: 24px;
      @include margin('top', 15px, 1);
    }
  }

  .earnings-list-item {
    color: #999;
    @include margin('top', 10px, 1);
    span {
      display: inline-block;
      max-width: 150px;
    }
  }
  .earnings-item-reward {
    font-family: $--font-TTNormsMedium;
    color: #4E47D3;
    text-align: right;
    @include width(120px, 1.2);
  }
  .recent-list-item {
    font-size: 16px;
    color: #999;
    @include margin('top', 10px, 1);
    a, span {
      color: #4E47D3;
    }
    >p {
      max-width: 190px;
    }
    .recent-item-date {
      color: #bbb;
    }
  }
  .recent-item-date {
    display: inline-block;
    font-family: $--font-TTNormsMedium;
    text-align: right;
    @include width(120px, 1.2);
  }
  .info-more {
    transform: translateY(12px);
    >a {
      font-size: 14px;
      color: #4E47D3;
      >[data-type="icon"] {
        margin-left: 3px;
        font-size: 12px;
      }
    }
  }
</style>

