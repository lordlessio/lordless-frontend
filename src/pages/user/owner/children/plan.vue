<template>
  <div class="user-plan-page">
    <h1 class="d-flex f-align-baseline text-cap owner-children-title">
      <span class="v-flex">HOPS</span>
    </h1>
    <div
      class="user-tabs-box plan-tabs-box">
      <el-tabs
        v-model="planTab"
        @tab-click="switchTab">
        <el-tab-pane
          label="LESS Deposit"
          name="lessDeposit">
        </el-tab-pane>
        <el-tab-pane
          class="candy-tab-box"
          label="Deposits"
          name="deposits">
        </el-tab-pane>
        <el-tab-pane
          class="candy-tab-box"
          label="Records"
          name="records">
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="v-flex d-flex">
      <transition name="ld-hide-fade" mode="out-in">
        <plan-hops v-if="planTab === 'lessDeposit'" @deposit="depositSuccess"/>
        <plan-deposits v-else-if="planTab === 'deposits'"/>
        <plan-records v-else/>
      </transition>
    </div>
  </div>
</template>

<script>
import PlanHops from '@/components/content/plan/hops'
import PlanDeposits from '@/components/content/plan/deposits'
import PlanRecords from '@/components/content/plan/records'

import { historyState } from 'utils/tool'
export default {
  name: 'website-user-plan-page',
  data: (vm) => {
    return {
      planTab: vm.$route.query.type || 'lessDeposit'
    }
  },
  components: {
    PlanHops,
    PlanDeposits,
    PlanRecords
  },
  methods: {
    switchTab () {
      historyState(`/owner/hops?type=${this.planTab}`)
    },
    depositSuccess () {
      this.planTab = 'deposits'
    }
  }
}
</script>

<style lang="scss" scoped>
  .user-plan-page {

  }
  .plan-tabs-box {
    margin-bottom: 10px;
  }
</style>
