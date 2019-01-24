<template>
  <div class="mobile-deposit-card-box" :class="{ 'is-pending': isPending, 'is-failed': isFailed }">
    <div class="deposit-card-container">
      <h3 class="deposit-card-title">LESS {{ planLockDays }} DAY Term Deposit</h3>
      <ul class="relative deposit-planBase-details">
        <li class="d-flex f-align-center planBase-details-item"
          v-for="(item, index) of detailsInfo" :key="index">
          <span class="details-item-title">{{ item.title }}</span>
          <span class="v-flex text-right details-item-text">{{ item.text }}</span>
        </li>
      </ul>
      <div class="deposit-card-bottom">
        <p class="d-flex f-align-center planBase-details-item deposit-less-amount" :class="{ 'text-line-through': isFailed }">
          <span class="details-item-title">LESS</span>
          <span class="TTFontBolder v-flex text-right">{{ weiByDecimals(info.lessAmount).toLocaleString() }}</span>
        </p>
        <div class="d-flex f-align-center deposit-bottom-desc">
          <p class="TTFontBolder v-flex" v-if="!isMature">The deposit is immature.</p>
          <p class="TTFontBolder v-flex" v-else-if="isFailed">The deposit was failed.</p>
          <p class="TTFontBolder v-flex" v-else-if="isWithdrawPending">The deposit is withdrawing.</p>
          <p class="TTFontBolder v-flex" v-else-if="info.isWithdrawn">You’ve withdrawn.</p>
          <p class="TTFontBolder v-flex" v-else>Your LESS is mature.</p>
          <lordless-btn
            class="deposit-withdraw-btn"
            theme="blue"
            inverse
            :loading="btnLoading"
            :disabled="btnLoading || isWithdrawPending || !isMature || isPending || isFailed || info.isWithdrawn"
            @click="withdraw">Withdraw</lordless-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { dateFormat, weiByDecimals } from 'utils/tool'
export default {
  name: 'mobile-deposit-card',
  props: {
    info: {
      type: Object,
      default: {}
    }
  },
  data: () => {
    return {
      btnLoading: false
    }
  },
  computed: {

    isWithdrawPending () {
      const info = this.info
      if (!info._id) return true
      return info.withdrawTx.status === 0 && !!info.withdrawTx.tx
    },

    isPending () {
      const info = this.info
      if (!info._id) return true
      return info.growHopsTx.status === 0
    },

    isFailed () {
      const info = this.info
      if (!info._id) return true
      return this.info.growHopsTx.status === -1
    },

    isMature () {
      const info = this.info
      if (!info._id) return false
      const { status, releaseAt } = this.info.growHopsTx
      console.log('----- isMature', releaseAt, status, new Date() >= new Date(releaseAt * 1000))
      return status === 1 && new Date() >= new Date(releaseAt * 1000)
    },

    helmValue () {
      const info = this.info
      if (!info._id) return {}
      return (info.planBase.lessToHops / (info.planBase.lockTime / 3600 / 24 / 30)).toFixed(1).toString()
    },

    planLockDays () {
      const info = this.info
      if (!info._id) return {}
      return info.planBase.lockTime / 3600 / 24
    },

    planType () {
      const info = this.info
      if (!info._id) return {}
      const _planTypes = {
        1: 'BASIC',
        2: 'PLUS',
        3: 'PRO'
      }
      return _planTypes[info.planBase.level]
    },

    detailsInfo () {
      const info = this.info
      if (!info._id) return {}
      return [
        {
          title: 'Plan',
          text: this.planType
        },
        {
          title: 'HELM',
          text: this.helmValue
        },
        {
          title: 'Deposit Period',
          text: `${this.planLockDays} day`
        },
        {
          title: 'Deposit on',
          text: (this.isPending || this.isFailed) ? '--' : dateFormat(new Date(info.growHopsTx.lockAt * 1000), 'MMM. DD YYYY HH:mm:ss')
        },
        {
          title: 'Mature on',
          text: (this.isPending || this.isFailed) ? '--' : dateFormat(new Date(info.growHopsTx.releaseAt * 1000), 'MMM. DD YYYY HH:mm:ss')
        }
      ]
    }
  },
  methods: {
    weiByDecimals () {
      return weiByDecimals(...arguments)
    },
    withdraw () {
      this.btnLoading = true
      this.$emit('withdraw', (tx) => {
        if (tx) this.$set(this.info.withdrawTx, 'tx', tx)
        this.btnLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .mobile-deposit-card-box {
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 0 8px 2px rgba(0, 0, 0, .12);
    &.is-pending, &.is-failed {
      .deposit-planBase-details {
          &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(255, 255, 255, .6);
          z-index: 1;
        }
        &::after {
          position: absolute;
          left: 0;
          top: 50%;
          width: 100%;
          font-size: 48px;
          color: #555;
          text-align: center;
          transform: translateY(-50%);
          z-index: 2;
          @include TTFontBolder();
        }
      }
      .details-item-text {
        color: #999;
      }
    }
    &.is-pending {
      .deposit-planBase-details {
        &::after {
          content: 'PENDING';
        }
      }
    }
    &.is-failed {
      .deposit-planBase-details {
        &::after {
          content: 'FAILED';
        }
      }
      .deposit-less-amount {
        color: #999;
      }
      .details-item-text {
        text-decoration: line-through;
      }
    }
  }
  .deposit-card-container {
    padding: 20px;
  }
  .deposit-card-title {
    font-size: 16px;
  }

  .deposit-planBase-details {
    margin-top: 10px;
    padding-top: 12px;
    padding-bottom: 12px;
    background-color: #fff;
    border-top: 1px solid #ddd;
  }
  .planBase-details-item {
    font-size: 14px;
    &:not(:last-of-type) {
      margin-bottom: 8px;
    }
  }
  .details-item-title {
    color: #999;
  }

  .deposit-card-bottom {
    padding-top: 12px;
    border-top: 1px solid #ddd;
  }
  .deposit-less-amount {
    font-size: 16px;
    .details-item-title {
      font-size: 14px;
    }
  }
  .deposit-bottom-desc {
    padding-top: 12px;
    font-size: 16px;
    color: #555;
  }
  .deposit-withdraw-btn {
    padding: 8px 15px;
    font-size: 14px;
    @include TTFontBold();
  }
</style>
