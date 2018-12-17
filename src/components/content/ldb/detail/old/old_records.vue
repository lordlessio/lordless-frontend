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
        <div class="alone-layer left-section-cnt ldb-tx-cnt">
          <el-row class="ldb-tx-header">
            <el-col :span="5">
              Price
            </el-col>
            <el-col :span="7">
              When
            </el-col>
            <el-col :span="6">
              From
            </el-col>
            <el-col :span="6">
              To
            </el-col>
          </el-row>
          <el-row class="ldb-tx-list">
            <el-row
                v-if="total"
                v-for="(record, index) of list"
                :key="index"
                class="ldb-tx-item">
              <el-col :span="5" class="color-blue">
                <span>{{ record.market[0].price | weiToEth }}</span>
                <span class="text-upper">ETH</span>
              </el-col>
              <el-col :span="7">
                {{ record.created_at | timeFormat }}
              </el-col>
              <el-col :span="6" class="sm-text-ellipsis">
                <link-symbol underline :to="record.market[0].buyer">
                  {{ record.market[0].buyer | splitAddress({ before: 6, end: 4 }) }}
                </link-symbol>
              </el-col>
              <el-col :span="6" class="sm-text-ellipsis">
                <link-symbol underline :to="record.market[0].seller">
                  {{ record.market[0].seller | splitAddress({ before: 6, end: 4 }) }}
                </link-symbol>
              </el-col>
            </el-row>
          </el-row>
        </div>
      </section>
    </transition>
  </div>
</template>

<script>
import RecordsSkeletion from '@/components/skeletion/ldb/detail/records'

export default {
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
</style>
