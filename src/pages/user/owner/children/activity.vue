<template>
  <div class="d-flex user-activity-box">
    <div class="d-flex v-flex col-flex user-activity-container">
      <h1 class="text-cap user-activity-title">activity</h1>
      <div
        v-if="!activities.total && !loading"
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
        v-if="activities.total"
        class="v-flex user-activity-tabs">
        <el-tabs
          v-model="activityTab">
          <el-tab-pane
            label="Activity"
            name="Activity">
            <transition name="ld-suspension-hide-fade">
              <div v-if="loading" class="user-activity-skeletion">
                <div class="d-flex f-aligin-center">
                  <div class="v-flex d-flex f-aligin-center activity-skeletion-left skeletion-breath">
                    <p></p>
                    <div class="v-flex">
                      <p></p>
                      <p></p>
                      <p></p>
                    </div>
                  </div>
                  <div class="d-flex f-align-center activity-skeletion-right skeletion-breath">
                    <p></p>
                  </div>
                </div>
              </div>
            </transition>
            <transition>
              <el-row :gutter="20" class="user-activity-cnt">
                <el-col
                  :xs="24"
                  class="activity-item"
                  v-for="(activity, index) of activities.list"
                  :key="index">
                  <activity-card
                    :info="activity"
                    :type="activity.market[0].action.toUpperCase()"
                    :tx="activity.tx.transactionHash">
                  </activity-card>
                </el-col>
              </el-row>
            </transition>
          </el-tab-pane>
        </el-tabs>
         <Pagination
            class="ld-activity-pagination"
            :total="activities.total"
            :size="activities.ps"
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

      loading: true,

      // 当前 tab 区域
      activityTab: 'Activity',

      /**
       * all Activities options
       */

      // 用户全部的 tx 记录
      activities: {
        total: 0,
        list: [],
        pn: 1,
        ps: 10
      }
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

    async getActivities ({ address = this.userInfo.address, pn = this.activities.pn, ps = this.activities.ps } = {}) {
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
        this.activities = res.data
      }
      this.loading = false
    },

    pageChange (pn) {
      this.getActivities({ pn })
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

  // user-activity-skeletion
  .user-activity-skeletion {
    position: absolute;
    top: 70px;
    left: 0;
    width: 100%;
    >div {
      padding: 35px 45px 35px 45px;
      border-radius: 5px;
      background-color: $--skeletion-light;
    }
  }
  .activity-skeletion-left {
    >p {
      margin-right: 15px;
      width: 75px;
      height: 75px;
      background-color: $--skeletion-dark;
      border-radius: 100%;
    }
    >div {
      >p {
        width: 90%;
        height: 20px;
        background-color: $--skeletion-dark;
        &:nth-of-type(1) {
          width: 150px;
          height: 15px;
        }
        &:nth-of-type(2) {
          margin-top: 15px;
        }
        &:nth-of-type(3) {
          margin-top: 10px;
        }
      }
    }
  }
  .activity-skeletion-right {
    margin-left: 80px;
    >p {
      width: 180px;
      height: 60px;
      border-radius: 5px;
      background-color: $--skeletion-dark;
    }
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
