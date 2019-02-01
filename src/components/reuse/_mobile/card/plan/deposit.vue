<template>
  <div class="mobile-deposit-card-box">
    <div class="deposit-card-container">
      <h3 class="deposit-card-title">LESS {{ planLockDays }} DAY Term Deposit</h3>
      <div v-if="info.growHopsTx.length" class="deposit-planBase-txs">
        <div v-for="(item, index) of info.growHopsTx" :key="`growhops_${index}`" class="planBase-tx-item">
          <a class="d-flex f-align-center" :href="`${ETHERSCANURL}/tx/${item.tx}`" target="_blank">
            <div class="v-flex planBase-tx-info">
              <p>Deposit on &nbsp;&nbsp;{{ item.lockAt ? item.lockAt * 1000 : new Date() | dateFormat('HH:mm MMM DD YYYY') }}</p>
              <p class="text-ellipsis planBase-tx-address">{{ item.tx }}</p>
            </div>
            <div class="text-right planBase-tx-right">
              <span class="inline-block line-height-0 planBase-tx-icon">
                <svg>
                  <use xlink:href="#icon-arrow-line-right"/>
                </svg>
              </span>
            </div>
          </a>
        </div>
        <div v-for="(item, index) of info.withdrawTx" :key="`withdraw_${index}`" class="planBase-tx-item">
          <a class="d-flex f-align-center" :href="`${ETHERSCANURL}/tx/${item.tx}`" target="_blank">
            <div class="v-flex planBase-tx-info">
              <p>Withdraw on &nbsp;&nbsp;{{ item.startAt * 1000 | dateFormat('HH:mm MMM DD YYYY') }}</p>
              <p class="text-ellipsis planBase-tx-address">{{ item.tx }}</p>
            </div>
            <div class="text-right planBase-tx-right">
              <span class="inline-block line-height-0 planBase-tx-icon">
                <svg>
                  <use xlink:href="#icon-arrow-line-right"/>
                </svg>
              </span>
            </div>
          </a>
        </div>
      </div>
      <ul class="relative deposit-planBase-details">
        <li class="d-flex f-align-center planBase-details-item"
          v-for="(item, index) of detailsInfo" :key="index">
          <span class="details-item-title">{{ item.title }}</span>
          <span class="v-flex text-right details-item-text">{{ item.text }}</span>
        </li>
      </ul>
      <div class="deposit-card-bottom">
        <p class="d-flex f-align-center planBase-details-item deposit-less-amount" :class="{ 'text-line-through': isGrowFailed }">
          <span class="details-item-title">LESS</span>
          <span class="TTFontBolder v-flex text-right">{{ weiByDecimals(info.lessAmount).toLocaleString() }}</span>
        </p>
        <div class="text-right deposit-bottom-desc">
          <!-- <p class="TTFontBolder v-flex" v-if="!isMature">The deposit is immature.</p>
          <p class="TTFontBolder v-flex" v-else-if="isGrowFailed">The deposit was failed.</p>
          <p class="TTFontBolder v-flex" v-else-if="isWithdrawPending">The deposit is withdrawing.</p>
          <p class="TTFontBolder v-flex" v-else-if="info.isWithdrawn">You’ve withdrawn.</p>
          <p class="TTFontBolder v-flex" v-else>Your LESS is mature.</p> -->
          <lordless-btn
            class="deposit-withdraw-btn"
            theme="blue"
            inverse
            :loading="btnLoading"
            :disabled="btnLoading || !isMature || isGrowPending || isGrowFailed || isWithdrawPending || info.isWithdrawn"
            @click="withdraw">
            <span v-if="isGrowPending">Depositing</span>
            <span v-else-if="isGrowFailed">Depositing</span>
            <span v-else-if="isImmature">Immature</span>
            <span v-else-if="isWithdrawFailed">Mature</span>
            <span v-else-if="isWithdrawPending">Withdrawing</span>
            <span v-else-if="info.isWithdrawn">Withdrawn</span>
            <span v-else>Withdraw</span>
            </lordless-btn>
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
    ETHERSCANURL () {
      return process.env.ETHERSCANURL
    },
    isWithdrawPending () {
      const info = this.info
      if (!info._id) return true
      const { withdrawTx } = info
      // const now = new Date().getTime() / 1000
      // && now - item.startAt < 24 * 3600
      const isComplete = withdrawTx.filter(item => item.status === 1).length
      return withdrawTx.length && !isComplete && !!withdrawTx.filter(item => item.status === 0).length
    },
    isWithdrawFailed () {
      const info = this.info
      if (!info._id) return true
      const { withdrawTx } = info
      return withdrawTx[0] && withdrawTx[0].status === -1
    },
    isGrowPending () {
      const info = this.info
      if (!info._id) return true
      return info.growHopsTx[0] && info.growHopsTx[0].status === 0
    },
    isGrowFailed () {
      const info = this.info
      if (!info._id) return true
      return info.growHopsTx[0] && info.growHopsTx[0].status === -1
    },
    isImmature () {
      const info = this.info
      if (!info._id) return false
      const { status, releaseAt } = info.growHopsTx[0]
      return status === 1 && new Date() < new Date(releaseAt * 1000)
    },
    isMature () {
      const info = this.info
      if (!info._id) return false
      const { status, releaseAt } = info.growHopsTx[0]
      console.log('----- isMature', releaseAt, status, new Date() >= new Date(releaseAt * 1000))
      // return (status === 1 || !info.withdrawTx.filter(item => item.status === 1).length) && new Date() >= new Date(releaseAt * 1000)
      return status === 1 && new Date() >= new Date(releaseAt * 1000)
    },
    heldValue () {
      const info = this.info
      if (!info._id) return {}
      // return (info.planBase.lessToHops / (info.planBase.lockTime / 3600 / 24 / 30)).toFixed(1).toString()
      const _planBase = info.planBase
      return _planBase ? _planBase.lessToHops.toFixed(1).toString() : '?'
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
        0: 'QUICK',
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
          title: 'HELD',
          text: this.heldValue
        },
        {
          title: 'Deposit Period',
          text: `${this.planLockDays} day`
        },
        {
          title: 'Deposit on',
          text: (this.isGrowPending || this.isGrowFailed) ? '--' : dateFormat(new Date(info.growHopsTx[0].lockAt * 1000), 'MMM. DD YYYY HH:mm:ss')
        },
        {
          title: 'Mature on',
          text: (this.isGrowPending || this.isGrowFailed) ? '--' : dateFormat(new Date(info.growHopsTx[0].releaseAt * 1000), 'MMM. DD YYYY HH:mm:ss')
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
        const _withdrawTx = this.info.withdrawTx
        _withdrawTx.unshift({ tx, status: 0, startAt: Math.ceil(new Date().getTime() / 1000) })
        if (tx) this.$set(this.info, 'withdrawTx', _withdrawTx)
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
    // margin-top: 10px;
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
  /**
   *  deposit-planBase-txs -- begin
   */
  .deposit-planBase-txs {
    margin-top: 10px;
    padding: 12px 0;
    border-top: 1px solid #ddd;
  }
  .planBase-tx-item {
    &:not(:first-of-type) {
      margin-top: 18px;
    }
  }
  .planBase-tx-info {
    max-width: 90%;
    font-size: 14px;
    color: #777;
  }
  .planBase-tx-address {
    font-size: 12px;
    color: #bbb;
  }
  .planBase-tx-right {
    width: 40px;
  }
  .planBase-tx-icon {
    width: 14px;
    height: 14px;
    fill: #bbb;
  }
  /**
   *  deposit-planBase-txs -- end
   */
</style>
