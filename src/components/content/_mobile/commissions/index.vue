<template>
  <div id="mobile-tavern-commissions" ref="lordless-load-more-box" class="tavern-commissions-box" :class="{ 'is-website': isWebsite }">
    <transition name="ld-hide-fade" mode="out-in" @after-enter="afterEnter">
      <referral-rewards-skeletion isWebsite v-if="loading"/>
      <div v-else class="tavern-commissions-container">
        <div v-if="loadDatas.total" class="tavern-commissions-cnt tavern-commissions-materials">
          <ul>
            <li v-for="(commission, index) of loadDatas.list" :key="index" class="tavern-commission-item" :class="{ 'none-line': commission.month }">
              <commission-card :info="commission"/>
            </li>
          </ul>
          <div class="text-center commissions-noMore-text">
            <p v-if="loadMoreLoading && !loadDatas.noMore">
              <i class="el-icon-loading"></i>
            </p>
            <p v-else-if="loadDatas.noMore">No more Commissions~</p>
          </div>
        </div>
        <div v-else class="text-center d-flex col-flex f-auto-center tavern-commissions-empty">
          <span class="relative inline-block line-height-0 commissions-empty-icon">
            <svg>
              <use xlink:href="#icon-sitdown-human"/>
            </svg>
          </span>
          <!-- <h3>This tavern has not yet Commissions.</h3> -->
          <p>This tavern has not yet Commissions.</p>
          <!-- <span
            id="copy-invitation-link"
            class="TTFontBolder text-center invitation-friends-btn invitation-copy-btn"
            :class="{ 'clipboard': linkClipBool }"
            :data-clipboard-text="invitationLink">
            Invite friends
          </span> -->
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import ReferralRewardsSkeletion from '@/components/skeletion/_mobile/referral/rewards'

import CommissionCard from '@/components/reuse/_mobile/card/commission'

import { getTavernCommissions } from 'api'

import { loadMoreDataMixins, initLoadingMixins } from '@/mixins'
export default {
  name: 'tavern-commissions-component',
  mixins: [ loadMoreDataMixins, initLoadingMixins ],
  props: {
    isWebsite: {
      type: Boolean,
      default: false
    },
    propPage: {
      type: Number,
      default: 1
    },
    propTotal: {
      type: Number,
      default: 0
    }
  },
  data: (vm) => {
    return {
      rendered: false,
      loadDatas: {
        list: [],
        ps: 10,
        pn: 1,
        total: 0,
        noMore: false
      },
      changeLoading: false,
      linkClipBool: false,
      disabledScroll: vm.isWebsite
      // loadMoreLoading: false
    }
  },
  computed: {
    invitationLink () {
      return `${location.origin}/owner/referee?r=${this.account}`
    }
  },
  watch: {
    propPage (pn) {
      this.initReferralRecords({ pn })
    }
  },
  components: {
    ReferralRewardsSkeletion,
    CommissionCard
  },
  methods: {
    afterEnter () {
      this.scrollListenerFunc()
    },

    async initReferralRecords ({ tavernId = this.$route.params.tavernId || 0, pn = 1 } = {}) {
      this.loadMoreLoading = false
      this.loading = true
      const { list = [], ps = 10, total = 0 } = (await this.getDataMethod({ pn, tavernId })) || {}
      this.loadDatas = {
        list,
        pn,
        ps,
        total,
        noMore: total <= ps
      }
      if (this.isWebsite) {
        this.$emit('update:propTotal', total)
      }
      this.loading = false
    },

    async getDataMethod ({ pn, ps = this.loadDatas.ps, tavernId = this.$route.params.tavernId || 0 }) {
      try {
        const res = await getTavernCommissions({ pn, ps, tavernId })
        return res.data
      } catch (err) {
        return null
      }
    }
  },
  async activated () {
    if (!this.rendered) {
      this.rendered = true
      return
    }
    await this.initReferralRecords()

    this.$nextTick(() => this.scrollListenerFunc())
  },
  mounted () {
    this.$nextTick(() => this.initReferralRecords())
  }
}
</script>

<style lang="scss" scoped>
  .tavern-commissions-box {
    padding-top: 44px;
  }

  .tavern-commissions-cnt {

  }
  .tavern-commission-item {
    &:not(:last-of-type) {
      /deep/ {
        .commission-card-cnt {
          border-bottom: 1px solid #ddd;
        }
      }
    }
  }


  .commissions-noMore-text {
    padding-bottom: 16px;
    padding-top: 16px;
    font-size: 16px;
    color: #999;
    background-color: #fff;
    border-top: 1px solid #eee;
    box-shadow: border-box;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 20%;
      width: 60%;
      height: 1px;
      background-color: #eee;
    }
  }

  // tavern-commissions-empty
  .tavern-commissions-empty {
    padding: 50px 30px 100px;
    box-sizing: border-box;
    @include viewport-unit(height, 100vh, 94px);
    // >h3 {
    //   margin-top: 32px;
    //   font-size: 18px;
    //   color: #555;
    // }
    >p {
      margin-top: 32px;
      font-size: 18px;
      color: #555;
    }
  }
  .commissions-empty-icon {
    width: 298px;
    max-width: 100%;
    padding-top: 298px;
    >svg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
  // .commissions-empty-btn {
  //   margin-top: 32px;
  //   padding: 12px 20px;
  // }

  .invitation-friends-btn {
    margin-top: 32px;
    padding: 0 20px;
    height: 44px;
    line-height: 44px;
    font-size: 16px;
    color: #fff;
    fill: #fff;
    background-image: linear-gradient(-225deg, #124BDC 0%, #0079FF 100%);
    border-radius: 5px;
    box-sizing: border-box;
  }

  .invitation-copy-btn {
    position: relative;
    &::before {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      border-bottom: 5px solid rgba(0, 0, 0, .75);
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      transform: translateX(-50%);
      opacity: 0;
      visibility: hidden;
      transition: all .4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    &::after {
      content: 'Copied!';
      position: absolute;
      bottom: -40px;
      left: 50%;
      padding: 0 14px;
      height: 30px;
      line-height: 30px;
      background-color: rgba(0, 0, 0, .75);
      font-size: 14px;
      color: #fff;
      border-radius: 5px;
      white-space: nowrap;
      transform: translateX(-50%);
      opacity: 0;
      visibility: hidden;
      transition: all .4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    &.clipboard {
      &::before, &::after {
        opacity: 1;
        visibility: visible;
      }
    }
  }
</style>
