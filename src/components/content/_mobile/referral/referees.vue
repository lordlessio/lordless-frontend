<template>
  <div id="mobile-referral-referees" class="referral-referees-box" :class="{ 'is-website': isWebsite }">
    <transition name="ld-hide-fade" mode="out-in" @after-enter="afterEnter">
      <referral-referees-skeletion v-if="loading"/>
      <div v-else-if="referees.total" class="referral-referees-container">
        <h3 class="d-flex f-align-center referral-referees-title">
          <span class="inline-block">{{ referees.confirmed }} confirmed</span>
          <span class="inline-block">{{ referees.confirming }} confirming</span>
        </h3>
        <ul class="referral-referees-list">
          <li class="d-flex f-align-start referral-referees-item"
            v-for="(item, index) of referees.list" :key="index">
            <lordless-blockies :scale="5" :seed="item.referee.address" jump/>
            <div class="v-flex col-flex referees-item-info">
              <p class="text-break referees-item-address">{{ item.referee.address }}</p>
              <span class="inline-block referees-tx-status" :class="{ 'is-confirmed': item.refererTx.status === 1, 'is-confirming': item.refererTx.status === 0 }">
                <span class="inline-block">{{ item.refererTx.status === 1 ? 'Confirmed' : 'Confirming' }}</span>
              </span>
              <p class="referees-item-date">{{ item.refererTx.finishAt * 1000 | dateFormat('HH:mm MMM DD YYYY') }}</p>
            </div>
          </li>
        </ul>
        <div class="text-center referees-noMore-text">
          <p v-if="loadMoreLoading && !referees.noMore">
            <i class="el-icon-loading"></i>
          </p>
          <p v-else-if="referees.noMore">No more referees~</p>
        </div>
      </div>
      <div v-else class="text-center d-flex col-flex f-auto-center referral-referees-empty">
        <span class="relative inline-block line-height-0 referees-empty-icon">
          <svg>
            <use xlink:href="#icon-sitdown-human"/>
          </svg>
        </span>
        <h3>You have no referees.</h3>
        <p>Invite your friends to get material rewards and deposit boost.</p>
        <span
          id="copy-invitation-link"
          class="TTFontBolder text-center invitation-friends-btn invitation-copy-btn"
          :class="{ 'clipboard': linkClipBool }"
          :data-clipboard-text="invitationLink">
          Invite friends
        </span>
        <!-- <lordless-btn theme="blue-linear" class="referees-empty-btn">Invite friends</lordless-btn> -->
      </div>
    </transition>
  </div>
</template>

<script>
import Clipboard from 'clipboard'
import ReferralRefereesSkeletion from '@/components/skeletion/_mobile/referral/referees'
import { getReferees } from 'api'

import { initLoadingMixins, publicMixins } from '@/mixins'
export default {
  name: 'referral-referees-component',
  mixins: [ initLoadingMixins, publicMixins ],
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
  data: () => {
    return {
      rendered: false,
      referees: {
        list: [],
        confirmed: 0,
        confirming: 0,
        total: 0,
        ps: 1,
        pn: 10,
        noMore: false
      },
      loadMoreLoading: false,
      scrollHandle: null,
      linkClipBool: false
    }
  },
  computed: {
    invitationLink () {
      return `${location.origin}/owner/referee?r=${this.account}`
    }
  },
  watch: {
    linkClipBool (val) {
      if (val) {
        setTimeout(() => {
          this.linkClipBool = false
        }, 1500)
      }
    },
    propPage (pn) {
      this.initReferees({ pn })
    }
  },
  components: {
    ReferralRefereesSkeletion
  },
  methods: {
    afterEnter () {
      this.initLinkClipboard()
      this.scrollListenerFunc()
    },
    initLinkClipboard () {
      const clip = new Clipboard('#copy-invitation-link')
      clip.on('success', (e) => {
        this.linkClipBool = true
        e.clearSelection()
      })
    },
    async initReferees ({ pn = 1 } = {}) {
      this.loadMoreLoading = false
      this.loading = true
      const { list = [], ps = 10, confirmed = 0, confirming = 0, total = 0 } = (await this.getRefereeMethod({ pn })) || {}
      this.referees = {
        list,
        pn,
        ps,
        confirmed,
        confirming,
        total,
        noMore: total <= ps
      }
      if (this.isWebsite) {
        this.$emit('update:propTotal', total)
      }
      this.loading = false
    },

    async getRefereeMethod (params) {
      try {
        const res = await getReferees(params)
        if (res.code === 1000 && res.data) {
          return res.data
        }
        return null
      } catch (err) {
        console.log('-------- err', err.message)
        return null
      }
    },
    // 获取更多 records
    async loadMoreReferees (cb) {
      this.loadMoreLoading = true
      const info = this.referees
      const pn = info.pn + 1
      const { list = [], ps = info.ps, confirmed = 0, confirming = 0, total = 0 } = (await this.getRefereeMethod({ pn })) || {}

      let noMore = false
      if (list.length < ps) {
        noMore = true
      }
      this.$set(this, 'referees', Object.assign({}, info, {
        list: info.list.concat(list),
        pn,
        ps,
        confirmed,
        confirming,
        total,
        noMore
      }))
      this.loadMoreLoading = false
      return cb && cb()
    },

    /**
     * scroll 监听事件
     */
    scrollListenerFunc ({ bool = false, bottom = 80, pHeight = document.body.offsetHeight } = {}) {
      this.scrollHandle && document.removeEventListener('scroll', this.scrollHandle)
      this.scrollHandle = null

      if (this.isWebsite) return

      const box = document.getElementById('mobile-referral-referees')
      let bHeight = box ? box.offsetHeight : 0
      console.log(' --- scroll', bHeight, bottom, pHeight)
      // 如果 bHeight 不存在或者 bHeight - bottom 小于 pHeight, return
      if (!bHeight || bHeight - bottom < pHeight) return

      const handleFunc = () => {
        if (bool || this.planRecords.noMore) return
        if (!bHeight) bHeight = box.offsetHeight
        const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop

        // 如果页面上滑到达指定条件位置
        // 读取更多数据
        if (scrollTop + pHeight + bottom > bHeight) {
          bool = true
          this.loadMoreRecords(() => {
            this.$nextTick(() => {
              bool = false
              bHeight = box.offsetHeight
            })
          })
        }
      }
      handleFunc()

      this.scrollHandle = handleFunc

      this.$nextTick(() => {
        document.addEventListener('scroll', this.scrollHandle)
      })
    }
  },
  async activated () {
    if (!this.rendered) {
      this.rendered = true
      return
    }
    await this.initReferees()
    this.$nextTick(() => this.scrollListenerFunc())
  },
  mounted () {
    this.$nextTick(() => this.initReferees())
  }
}
</script>

<style lang="scss" scoped>
  .referral-referees-box {
    padding-top: 44px;
    padding-bottom: 44px;
    &.is-website {
      padding: 0;
      .referral-referees-container {
        margin-top: 0;
      }
      .referral-referees-list {
        margin-top: 24px;
      }
      .referees-noMore-text {
        display: none;
      }
    }
  }
  .referral-referees-container {
    margin-top: 16px;
  }
  .referral-referees-title {
    padding-left: 20px;
    font-size: 18px;
    color: #0B2A48;
    >span {
      &:not(:first-of-type) {
        position: relative;
        margin-left: 8px;
        padding-left: 9px;
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          width: 1px;
          height: 12px;
          background-color: #ddd;
          transform: translateY(-50%);
        }
      }
    }
  }
  .referral-referees-list {
    margin-top: 4px;
  }
  .referral-referees-item {
    padding-top: 20px;
    padding-left: 20px;
    background-color: #fff;
    &:not(:last-of-type) {
      .referees-item-info {
        border-bottom: 1px solid #ddd;
        box-sizing: border-box;
      }
    }
  }
  .referees-item-info {
    margin-left: 12px;
    padding-right: 20px;
    padding-bottom: 20px;
  }
  .referees-item-address {
    font-size: 16px;
    color: #555;
  }
  .referees-tx-status {
    margin-top: 8px;
    width: 61px;
    height: 22px;
    border-radius: 5px;
    color: #fff;
    overflow: hidden;
    >span {
      padding: 8px 12px;
      font-size: 20px;
      transform: scale(.5);
      transform-origin: 0 0;
    }
    &.is-confirmed {
      background-color: #0079FF;
    }
    &.is-confirming {
      background-color: #F5515F;
    }
  }
  .referees-item-date {
    margin-top: 6px;
    font-size: 14px;
    color: #bbb;
  }

  // referral-referees-empty
  .referral-referees-empty {
    padding: 50px 30px;
    box-sizing: border-box;
    @include viewport-unit(min-height, 100vh, 94px);
    >h3 {
      margin-top: 32px;
      font-size: 20px;
      color: #0B2A48;
    }
    >p {
      margin-top: 12px;
      font-size: 16px;
      color: #555;
    }
  }
  .referees-empty-icon {
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
  // .referees-empty-btn {
  //   margin-top: 32px;
  //   padding: 12px 20px;
  // }

  .referees-noMore-text {
    padding-bottom: 16px;
    padding-top: 16px;
    font-size: 16px;
    color: #999;
    background-color: #fff;
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
