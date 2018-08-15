<template>
  <div class="d-flex user-activity-box">
    <div class="d-flex v-flex col-flex user-activity-container">
      <h1 class="text-cap user-activity-title">activity</h1>
      <div
        v-if="!activities.length && !loading"
        class="d-flex v-flex col-flex f-auto-center text-center no-asset-box">
        <svg>
          <use xlink:href="#icon-action"/>
        </svg>
        <p>You have no Activity now.</p>
        <div class="d-flex f-auto-center TTFontBolder">
          <span>Try to purchase or sell a LDB in</span>
          <span class="inline-block">
            <ld-btn class="TTFontBolder no-asset-btn" theme="default" shadow @click="$router.push('/market')">Marketplace</ld-btn>
          </span>
        </div>
      </div>
      <div
        v-if="activities.length"
        class="v-flex user-activity-tabs">
        <el-tabs
          v-model="activityTab">
          <el-tab-pane
            label="Activity"
            name="Activity">
            <el-row :gutter="20" class="user-activity-cnt">
              <el-col
                :xs="24"
                class="activity-item"
                v-for="(activity, index) of activities"
                :key="index">
                <activity-card
                  :info="activity"
                  :type="activity.market[0].action.toUpperCase()"
                  :tx="activity.tx.transactionHash">
                </activity-card>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
         <Pagination
            class="ld-activity-pagination"
            :total="pageTotal"
            background
            @currentChange="pageChange">
          </Pagination>
      </div>
    </div>
  </div>
</template>

<script>
import ActivityCard from '@/components/reuse/card/activity'
import Pagination from '@/components/stories/pagination'
import LdBtn from '@/components/stories/button'

import { getActivitysByUser } from 'api'
import { mapState } from 'vuex'
export default {
  data: () => {
    return {

      loading: false,

      // 当前 tab 区域
      activityTab: 'Activity',

      /**
       * all Activities options
       */

      // 用户全部的 tx 记录
      activities: [],
      // 记录总数
      pageTotal: 1
    }
  },
  computed: {
    ...mapState('user', [
      'userInfo'
    ])
  },
  components: {
    ActivityCard,
    Pagination,
    LdBtn
  },
  methods: {

    async getActivities ({ address = this.userInfo.address, pn = 1, ps = 10 } = {}) {
      this.loading = true
      if (!address) return

      const params = {
        opt: {
          pn,
          ps
        },
        user: address
      }
      const res = await getActivitysByUser(params)
      if (res.code === 1000) {
        const { list, total } = res.data
        this.activities = list
        this.total = total
      }
      this.loading = false
    },

    pageChange (e) {
      this.getActivities({ pn: e })
    }
  },
  watch: {
    userInfo (val) {
      if (val.address) this.getActivities({ address: val.address })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getActivities()
    })
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';
  .user-activity-box {
    font-size: 16px;
    @include padding(-1, 30px, 1);
    /deep/ .el-tabs__header {
      margin: 0;
    }
    /deep/ .el-tabs__content {
      position: static;
      overflow: initial;
    }
    /deep/ .el-tabs__item {
      font-size: 18px;
      color: #999;
      &.is-active {
        color: inherit;
      }
    }
  }

  .user-activity-title {
    font-size: 36px;
    color: #999;
  }

  .ld-activity-pagination {
    position: absolute;
    left: 0;
    bottom: -100px;
  }

   .user-activity-tabs {
    position: relative;
    @include margin('top', 35px, 1);
    @include margin('bottom', 150px, 1);
  }
  .user-no-sale-activity {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .activity-item {
    @include margin('top', 30px, 1);
  }

  .ld-activity-pagination {
    position: absolute;
    left: 0;
    bottom: -100px;
  }
</style>
