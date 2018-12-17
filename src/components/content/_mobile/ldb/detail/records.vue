<template>
  <div class="mobile-records-box">
    <records-skeletion v-if="loading"/>
    <transition name="ld-hide-fade">
      <div v-if="!loading && total">
        <h2 class="detail-mobile-title">Transaction histroy</h2>
        <div v-for="record of list" :key="record._id" class="d-flex col-flex mobile-records-item">
          <span class="d-flex f-align-center">Price<span class="v-flex text-right text-color-third">{{ record.created_at | timeFormat }}</span></span>
          <p class="price text-upper">{{ record.market[0].price | weiToEth }} ETH</p>
          <span>From</span>
          <p>{{ record.market[0].buyer | splitAddress({ before: 16, end: 8 }) }}</p>
          <span>To</span>
          <p>{{ record.market[0].seller | splitAddress({ before: 16, end: 8 }) }}</p>
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
  }
}
</script>

<style lang="scss" scoped>
  .detail-mobile-title {
    margin-top: 30px;
    margin-bottom: 10px;
    font-size: 20px;
    color: $--text-third-color;
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
    &:not(:first-of-type) {
      margin-top: 20px;
    }
  }
</style>
