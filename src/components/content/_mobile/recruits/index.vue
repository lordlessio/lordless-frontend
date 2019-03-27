<template>
  <div id="mobile-tavern-recruits" class="tavern-recruits-box" :class="{ 'is-website': isWebsite }">
    <transition name="ld-hide-fade" mode="out-in" @after-enter="afterEnter">
      <referral-rewards-skeletion isWebsite v-if="loading"/>
      <div v-else class="tavern-recruits-container">
        <div v-if="loadDatas.total" class="tavern-recruits-cnt tavern-recruits-materials">
          <ul>
            <li v-for="(recruit, index) of loadDatas.list" :key="index" class="tavern-recruits-item">
              <recruit-card :info="recruit"/>
            </li>
          </ul>
          <div class="text-center recruits-noMore-text">
            <p v-if="loadMoreLoading && !loadDatas.noMore">
              <i class="el-icon-loading"></i>
            </p>
            <p v-else-if="loadDatas.noMore">No more Recruits~</p>
          </div>
        </div>
        <div v-else class="text-center d-flex col-flex f-auto-center tavern-recruits-empty">
          <span class="relative inline-block line-height-0 recruits-empty-icon">
            <svg>
              <use xlink:href="#icon-sitdown-human"/>
            </svg>
          </span>
          <!-- <h3>This tavern has not yet recruits.</h3> -->
          <p>This tavern has not yet recruits.</p>
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

import RecruitCard from '@/components/reuse/_mobile/card/recruit'

import { getRecruitsByTavernId } from 'api'

import { loadMoreDataMixins } from '@/mixins'
export default {
  name: 'mobile-tavern-recruits-component',
  mixins: [ loadMoreDataMixins ],
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
      loading: true,
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
    RecruitCard
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
        const res = await getRecruitsByTavernId({ pn, ps, tavernId })
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
  .tavern-recruits-box {
    padding-top: 44px;
    &.is-website {
      padding-top: 0px;
      // .tavern-recruits-cnt {
      //   margin-top: -12px;
      // }
      .tavern-recruits-date {
        display: none;
        // padding-bottom: 12px;
      }
      .recruits-noMore-text {
        display: none;
      }
    }
  }

  .tavern-recruits-cnt {

  }
  .tavern-recruits-item {
    &:not(:last-of-type) {
      /deep/ {
        .recruit-card-cnt {
          border-bottom: 1px solid #ddd;
        }
      }
    }
  }
  .recruit-item-cnt {
    padding-left: 20px;
    background-color: #fff;
  }
  .tavern-recruit-icon {
    padding: 8px;
    width: 32px;
    height: 32px;
    fill: #fff;
    background-image: linear-gradient(-225deg, #124BDC 0%, #0079FF 100%);
    border-radius: 100%;
    box-sizing: border-box;
    transform: translateY(20px);
  }
  .tavern-recruit-info {
    margin-left: 12px;
    padding-top: 20px;
    padding-bottom: 20px;
    padding-right: 18px;
  }
  .recruit-info-title {
    font-size: 16px;
    color: #555;
  }
  .recruit-info-reward {
    font-size: 16px;
    color: #0079FF;
  }
  .recruit-info-middle {
    margin-top: 6px;
    font-size: 14px;
    color: #777;
  }
  .recruit-info-address-box {
    margin-left: 12px;
    padding-left: 13px;
    border-left: 1px solid #ddd;
    box-sizing: border-box;
    >span {
      margin-left: 4px;
    }
  }
  .recruit-info-date {
    margin-top: 6px;
    font-size: 14px;
    color: #bbb;
  }


  .tavern-recruits-date {
    padding-top: 12px;
    padding-bottom: 4px;
    padding-left: 24px;
    font-size: 16px;
  }
  .recruits-noMore-text {
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

  // tavern-recruits-empty
  .tavern-recruits-empty {
    padding: 50px 30px 100px;
    box-sizing: border-box;
    @include viewport-unit(min-height, 100vh, 94px);
    // >h3 {
    //   margin-top: 32px;
    //   font-size: 20px;
    //   color: #0B2A48;
    // }
    >p {
      margin-top: 32px;
      font-size: 18px;
      color: #555;
    }
  }
  .recruits-empty-icon {
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
  // .recruits-empty-btn {
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
