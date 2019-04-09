<template>
  <div class="hunter-task-card" :class="{ 'is-finished': finished }">
    <div class="d-flex f-align-center task-card-title">
      <span class="inline-block line-height-0 task-title-icon">
        <svg>
          <use :xlink:href="hunterTaskInfo.icon"/>
        </svg>
      </span>
      <h3 class="v-flex">{{ hunterTaskInfo.title }}</h3>
    </div>
    <div class="task-card-desc card-info-box" @click.stop="$router.push(`${hunterTaskInfo.path}?refer=${$route.path}`)">
      <p class="TTFontBolder d-flex f-align-center">
        <span>How</span>
        <span class="inline-block line-height-0 task-arrow-icon">
          <svg>
            <use xlink:href="#icon-back"/>
          </svg>
        </span>
      </p>
      <h3>{{ hunterTaskInfo.desc }}</h3>
    </div>
    <div class="d-flex f-align-end task-card-bottom">
      <div class="v-flex card-info-box">
        <p class="TTFontBolder">Reward(Material)</p>
        <h3>{{ hunterTaskInfo.rewardCount.toLocaleString() }}{{ hunterTaskInfo.token.symbol }}</h3>
      </div>
      <lordless-btn
        class="task-card-btn"
        :theme="btnInfo.theme"
        :disabled="this.finished"
        @click="openDialog">{{ btnInfo.text }}</lordless-btn>
    </div>
    <hunter-task-dialog
      v-model="taskDialogModel"
      :taskTitle="hunterTaskInfo.title"
      :dialogType="dialogType"
      :btnLoading="checkLoading"
      :rewardCount="hunterTaskInfo.rewardCount"
      @confirm="checkTask"/>
  </div>
</template>

<script>
import HunterTaskDialog from '@/components/reuse/dialog/hunterTasks'

import { checkHunterTask } from 'api'
export default {
  name: 'mobile-hunter-task-card',
  props: {
    info: {
      type: Object,
      default: () => {}
    },
    finished: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    //   1: 关注 tg
    //   2: 持有less
    //   3: 成为 referee
    //   4: 邀请一个 referrer
    //   5: 参加一次 deposit
    //   6: 称为 recruit
    //   7: 解包 bounty chest
    //   8: 成为 tavernkeep
    return {
      taskInfos: {
        1: {
          icon: '#icon-hunter-task-like',
          title: 'Follow LORDLESS Telegram',
          desc: 'Follow the @lordless_global.',
          path: '/owner/bind/telegram'
        },
        2: {
          icon: '#icon-hunter-task-wallet',
          title: 'Hold LESS in the wallet',
          desc: 'You have to hold 1,000 LESS at least.',
          path: '/owner/info'
        },
        3: {
          icon: '#icon-hunter-task-badge',
          title: 'Referee program',
          desc: 'Become a referee.',
          path: '/owner/referee'
        },
        4: {
          icon: '#icon-hunter-task-email',
          title: 'Invitation program',
          desc: 'Invite one friend at least.',
          path: '/owner/referral/invitation'
        },
        5: {
          icon: '#icon-hunter-task-coin',
          title: 'LESS Term Deposit',
          desc: 'Make LESS Term Deposit once at least.',
          path: '/owner/hops'
        },
        6: {
          icon: '#icon-hunter-task-sword',
          title: 'Get recruited',
          desc: 'Become a Recruit.',
          path: '/taverns'
        },
        7: {
          icon: '#icon-hunter-task-box',
          title: 'Unlock a Bounty Chest',
          desc: 'Unlock the Bounty Chest once at least.',
          path: '/owner/bc?type=chests'
        },
        8: {
          icon: '#icon-hunter-task-viking-helmet',
          title: 'Become a Tavernkeep',
          desc: 'Hold one Tavern at least.',
          path: '/taverns'
        }
      },
      taskDialogModel: false,
      dialogType: 0,
      checkLoading: false
    }
  },
  computed: {
    hunterTaskInfo () {
      const _info = this.info
      return Object.assign({}, _info, this.taskInfos[_info.type])
    },
    btnInfo () {
      return {
        text: this.finished ? 'Approved' : 'Submit',
        theme: this.finished ? 'green' : 'blue'
      }
    }
  },
  components: {
    HunterTaskDialog
  },
  methods: {
    openDialog () {
      this.dialogType = 0
      this.taskDialogModel = true
    },
    async checkTask () {
      this.checkLoading = true
      try {
        const res = await checkHunterTask({ type: this.hunterTaskInfo.type })
        if (res.code === 1000) {
          this.dialogType = res.data ? 1 : 2
          if (res.data) {
            this.$emit('completed', this.hunterTaskInfo)
          }
        }
      } catch (err) {
        this.$notify.error({
          title: 'CheckHunterTask Error!',
          message: err.message || 'Invalidate Error!',
          position: 'bottom-right',
          duration: 2500
        })
      }
      this.checkLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .hunter-task-card {
    padding: 18px;
    background-image: linear-gradient(-225deg, rgb(18, 75, 220) 0%, rgb(0, 121, 255) 100%);
    border-radius: 5px;
    box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.3);
    color: #fff;
    &.is-finished {
      background-image: none;
      background-color: #f0f0f0;
      box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.3);
      color: #555;
      .card-info-box {
        >p {
          color: #777;
          fill: #777;
        }
      }
    }
  }
  .task-card-title {
    >h3 {
      font-size: 16px;
    }
  }
  .task-title-icon {
    margin-right: 8px;
    width: 32px;
    height: 32px;
  }
  .task-card-desc {
    margin-top: 10px;
  }
  .card-info-box {
    >p {
      font-size: 14px;
      color: #bdb9fd;
      fill: #bdb9fd;
    }
    >h3 {
      margin-top: 4px;
      font-size: 16px;
    }
  }
  .task-arrow-icon {
    margin-left: 6px;
    width: 10px;
    height: 10px;
    transform: rotate(180deg);
  }

  .task-card-bottom {
    margin-top: 16px;
  }
  .task-card-btn {
    width: 86px;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
  }
</style>
