<template>
  <div class="v-flex d-flex website-invitation-box">
    <div class="v-flex d-flex col-flex website-invitation-container">
      <h1 class="d-flex f-align-baseline text-cap owner-children-title">
        <span class="v-flex">Invitation</span>
      </h1>
      <div class="user-tabs-box">
        <el-tabs
          class="relative v-flex"
          v-model="invitationTab"
          @tab-click="switchTab">
          <el-tab-pane
            label="Invitation"
            name="invitation"/>
          <el-tab-pane
            label="Referees"
            name="referees"/>
          <el-tab-pane
            label="Rewards"
            name="rewards"/>
        </el-tabs>
      </div>
      <div v-if="currentTab === 'rewards'" class="owner-children-sort-box">
        <span>Filter by</span>
        <lordless-select
          class="owner-children-select"
          v-model="rewardSortModel"
          :items="rewardSortItems"/>
      </div>
      <div class="v-flex invitation-cnt-box">
        <div v-if="currentTab === 'invitation'">
          <referrel-invitation
            isWebsite/>
        </div>
        <div v-else-if="currentTab === 'referees'">
          <referrel-referees
            isWebsite
            :propPage.sync="invitationPages.referees"
            :propTotal.sync="invitationTotals.referees"/>
        </div>
        <div v-else>
          <referrel-rewards
            isWebsite
            :sortModel="rewardSortModel"
            :propPage.sync="invitationPages.rewards"
            :propTotal.sync="invitationTotals.rewards"/>
        </div>
      </div>
      <div
        v-if="paginationData.pagination && paginationData.total"
        class="owner-children-pagination">
        <lordless-pagination
          :scrollE="$el"
          :scrollPE="pageScrollPE"
          :total="paginationData.total"
          :currentPage="paginationData.pn"
          background
          @currentChange="pageChange"/>
      </div>
    </div>
  </div>
</template>

<script>
import ReferrelInvitation from '@/components/content/_mobile/referral/invitation'
import ReferrelReferees from '@/components/content/_mobile/referral/referees'
import ReferrelRewards from '@/components/content/_mobile/referral/rewards'

import { mapState } from 'vuex'
export default {
  name: 'website-invitation-page',
  data: () => {
    return {
      invitationTab: 'invitation',
      currentTab: 'invitation',
      rewardSortModel: 'materials',
      rewardSortItems: [
        {
          label: 'Materials',
          value: 'materials'
        },
        {
          label: 'HOPS',
          value: 'hops'
        }
      ],
      invitationTotals: {
        referees: 0,
        rewards: 0
      },
      invitationPages: {
        referees: 1,
        rewards: 1
      }
    }
  },
  computed: {
    ...mapState('user', [
      'userInfo'
    ]),
    paginationData () {
      const _currentTab = this.currentTab
      console.log('------ paginationData', {
        pagination: _currentTab !== 'invitation',
        total: this.invitationTotals[_currentTab],
        pn: this.invitationPages[_currentTab]
      })
      return {
        pagination: _currentTab !== 'invitation',
        total: this.invitationTotals[_currentTab],
        pn: this.invitationPages[_currentTab]
      } || {}
    },
    pageScrollPE () {
      return document.getElementById('user-main-content')
    }
  },
  components: {
    ReferrelInvitation,
    ReferrelReferees,
    ReferrelRewards
  },
  methods: {
    pageChange (pn) {
      const _currentTab = this.currentTab
      this.$set(this.invitationPages, _currentTab, pn)
      console.log('----- pageChange', this.invitationPages)
    },
    switchTab (e) {
      if (this.currentTab === this.invitationTab) return
      this.currentTab = this.invitationTab
    },

    // 初始化 packageBounty
    initPackageBounty () {

    }
  },
  watch: {
    userInfo (val, oval) {
      if (val && oval) this.initPackageBounty()
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initPackageBounty()
    })
  }
}
</script>

<style lang="scss" scoped>
  .website-invitation-box {
    padding-top: 30px;
    // height: 100%;
  }
  .website-invitation-container {
    // height: 100%;
    >h1 {
      // padding: 0 30px;
    }
  }
  .website-invitation-cnt {
    margin-top: 30px;
    padding: 0 30px;
    @include overflow();
    // padding: 30px 35px 0;
  }
  .invitation-cnt-box {
    margin-top: 35px;
  }
</style>
