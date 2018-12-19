<template>
  <div class="relative ldb-tx-history">

    <!-- ldb detail records skeletion -->
    <!-- <transition name="ld-suspension-hide-fade"> -->
      <records-skeletion v-if="loading"/>
    <!-- </transition> -->

    <transition name="ld-hide-fade">
      <section v-if="!loading && total" class="ldb-left-section">
        <!-- <h3 class="d-flex f-align-baseline">Transaction history<span class="v-flex text-right cursor-pointer" @click="$emit('more')">View more</span></h3> -->
        <h3 class="d-flex f-align-baseline">Transaction history</h3>
        <!-- <el-row
          v-if="!total"
          class="text-center ldb-no-txs">
          <p>暂无交易哦</p>
        </el-row> -->
        <ul class="TTFontBolder d-flex col-flex lordless-table-list shadow quests-list">
          <li class="d-flex lordless-table-item lordless-table-thead">
            <p class="v-flex quests-item-name">PRICE</p>
            <p class="v-flex quests-item-cost">WHEN</p>
            <p class="v-flex quests-item-reward">FROM</p>
            <p class="v-flex quests-item-reward">TO</p>
          </li>
          <li class="lordless-table-item records-table-item"
            v-for="(record, index) of list"
            :key="index">
            <a class="d-flex f-align-center" :href="`${ETHERSCANURL}tx/${record.tx.transactionHash}`" target="_blank">
              <p class="v-flex d-flex f-align-center line-height-0 quests-item-name">
                <span class="inline-block records-eth-icon">
                  <svg>
                    <use xlink:href="#icon-eth-price"/>
                  </svg>
                </span>
                <span class="inline-block">{{ record.market[0].price | weiToEth }}</span>
              </p>
              <p class="v-flex quests-item-cost">{{ record.created_at | timeFormat }}</p>
              <p class="v-flex text-upper quests-item-reward">
                <link-symbol underline :to="record.market[0].buyer">
                  {{ record.market[0].buyer | splitAddress({ before: 6, end: 4 }) }}
                </link-symbol>
              </p>
              <p class="v-flex text-upper quests-item-reward">
                <link-symbol underline :to="record.market[0].seller">
                  {{ record.market[0].seller | splitAddress({ before: 6, end: 4 }) }}
                </link-symbol>
              </p></a>
          </li>
        </ul>
      </section>
    </transition>
  </div>
</template>

<script>
import RecordsSkeletion from '@/components/skeletion/ldb/detail/records'

export default {
  name: 'tavern-detail-records',
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
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
  // ldb-tx-history

  .ldb-tx-history {
    margin-top: 100px;
  }
  .ldb-tx-cnt {

  }
  .ldb-tx-header {
    padding-left: 35px;
    padding-right: 35px;
    margin-bottom: 8px;
    color: #999;
    font-size: 16px;
    background-color: transparent;
  }
  .ldb-tx-list {

  }
  .records-table-item {
    >a {
      color: inherit;
    }
  }
  .ldb-no-txs {
    padding: 50px 0;
  }
  .ldb-tx-item {
    padding: 25px 35px;
    font-size: 18px;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .25);
    &:not(:first-of-type) {
      margin-top: 25px;
    }
  }

  .records-eth-icon {
    margin-right: 4px;
    width: 10px;
    height: 12px;
    fill: #555;
    stroke: #555;
    stroke-width: 1;
  }
</style>
