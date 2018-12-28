<template>
  <div class="mobile-records-box">
    <records-skeletion v-if="loading"/>
    <transition name="ld-hide-fade">
      <div v-if="!loading && total">
        <h2 class="detail-mobile-title">Transaction histroy</h2>
        <div v-if="!record.isPending" v-for="record of list" :key="record._id" class="mobile-record-item-box">
          <a class="d-flex col-flex mobile-records-item" :href="`${ETHERSCANURL}/tx/${record.tx.transactionHash}`" target="_blank">
            <span class="d-flex f-align-center">PRICE<span class="v-flex text-right text-color-third">{{ record.created_at | timeFormat }}</span></span>
            <p class="TTFontBolder price text-upper">{{ record.market[0].price | weiToEth }} ETH</p>
            <span>FROM</span>
            <p>{{ record.market[0].buyer | splitAddress({ before: 16, end: 8 }) }}</p>
            <span>TO</span>
            <p>{{ record.market[0].seller | splitAddress({ before: 16, end: 8 }) }}</p>
          </a>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import RecordsSkeletion from '@/components/skeletion/_mobile/ldb/detail/records'
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    total: {
      type: Number,
      default: 0
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  components: {
    RecordsSkeletion
  },
  computed: {
    ETHERSCANURL () {
      return process.env.ETHERSCANURL
    }
  }
}
</script>

<style lang="scss" scoped>
  .detail-mobile-title {
    margin-top: 28px;
    margin-bottom: 10px;
    font-size: 24px;
    color: #0B2A48;
  }

  .mobile-record-item-box {
    &:not(:first-of-type) {
      margin-top: 20px;
    }
  }
  .mobile-records-item {
    padding: 20px 20px 30px;
    font-size: 16px;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 2px 5px 0px rgba(0, 0, 0, .25);
    >p {
      // font-size: 16px;
      color: #555;
      &.price {
        font-size: 24px;
        color: $--text-blue-color;
      }
    }
    >span {
      color: #999;
      &:not(:first-of-type) {
        margin-top: 10px;
      }
    }
  }
</style>
