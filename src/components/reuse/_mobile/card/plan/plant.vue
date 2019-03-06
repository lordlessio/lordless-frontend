<template>
  <div class="relative hops-plant-cnt" :class="{ 'is-mega': info.level === 4, 'is-large': !small, 'is-boost': boostNumber, 'is-selected': isActive && !small }" @click.stop="choosePlan">
    <div v-if="!small" class="hops-plant-sub-box">
      <span class="inline-block line-height-0 plant-sub-icon">
        <svg>
          <use xlink:href="#icon-sub-ok"/>
        </svg>
      </span>
    </div>
    <div v-if="!small" class="d-flex f-align-start">
      <div class="hops-plant-left">
        <p class="ImpactFont relative hops-plant-held" :class="{ 'is-small': heldValue.length > 5 }">
          <span class="relative">
            {{ heldValue }}
            <span class="inline-block line-height-0 plant-held-boost-icon">
              <svg>
                <use xlink:href="#icon-out-top"/>
              </svg>
            </span>
          </span>
        </p>
        <p class="TTFontBolder text-line-through old-plant-held">{{ oldHeldValue }}</p>
      </div>
      <div class="v-flex text-ellipsis hops-plant-right">
        <h3 class="relative text-upper hops-plant-level">{{ levelText }}<span v-if="levelText === 'MEGA'" class="relative plant-level-choice">Best choice</span></h3>
        <div class="plant-deposits-info">
          <p class="ImpactFont text-ellipsis">
            {{ info.lockTime / 3600 / 24 }} DAY term deposits
          </p>
          <p class="hops-plant-lessAmount">{{ weiByDecimals(info.minimumAmount).toLocaleString() }} LESS at least</p>
        </div>
        <!-- <p class="plant-income-info"><span class="TTFontBlack">{{ info.lessToHops * 100 }}</span> HOPS income on every  100 LESS invested.</p> -->
      </div>
    </div>
    <div v-else class="hops-plant-small" :class="{ 'is-active': isActive }">
      <p class="TTFontBolder text-ellipsis plant-small-type">{{ levelText }} {{ info.lockTime / 3600 / 24 }} day</p>
      <p class="ImpactFont plant-small-held">{{ heldValue }} HELD<span v-if="boostNumber" class="TTFontBold text-line-through plant-small-old-held">{{ oldHeldValue }}</span></p>
      <p class="plant-small-min-least">{{ weiByDecimals(info.minimumAmount).toLocaleString() }} LESS at least</p>
    </div>
    <lordless-authorize
      ref="plantAuthorize"
      blurs
      tokenAllowanceType="plant"
      :tokenBets="tokenBets"/>
    <lordless-authorize
      ref="growplusAuthorize"
      blurs
      tokenAllowanceType="growplus"
      :tokenBets="tokenBets"/>
  </div>
</template>

<script>
import Decimal from 'decimal.js-light'
import { weiByDecimals } from 'utils/tool'
export default {
  name: 'mobile-hops-plant-card',
  props: {
    info: {
      type: Object,
      default: {}
    },
    lessBalance: {
      type: Number,
      default: 0
    },
    small: {
      type: Boolean,
      default: false
    },
    boost: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      tokenBets: []
    }
  },
  computed: {
    // notBalance () {
    //   return this.lessBalance !== -1 && this.info.minimumAmount > this.lessBalance
    // },
    boostNumber () {
      return this.info.version === 2 ? this.boost : 0
    },
    levelText () {
      const levels = {
        0: 'QUICK',
        1: 'BASIC',
        2: 'PLUS',
        3: 'PRO',
        4: 'MEGA'
      }
      return levels[this.info.level]
    },
    oldHeldValue () {
      const info = this.info
      if (!info._id) return 0
      return info.lessToHops.toFixed(1).toString()
    },
    heldValue () {
      const info = this.info
      if (!info._id) return 0
      const _boostNumber = this.boostNumber
      const _heldValue = (new Decimal(info.lessToHops).mul(1 + _boostNumber)).toString()
      return _heldValue.split('.')[1] ? _heldValue : _heldValue + '.0'
    }
  },
  methods: {
    weiByDecimals () {
      return weiByDecimals(...arguments)
    },
    choosePlan () {
      if (this.notBalance) return
      const _info = this.info
      this.tokenBets = [
        {
          candy: _info.lessCandy,
          count: _info.minimumAmount
        }
      ]

      this.$nextTick(async () => {
        const authorize = _info.version === 2 ? this.$refs.growplusAuthorize : this.$refs.plantAuthorize
        if (!authorize) return
        const bool = await authorize.checkoutAuthorize({ tokenAllowance: true })
        console.log('choosePlan', _info, bool)
        if (!bool) return
        this.$emit('choosePlan', this.info)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .hops-plant-cnt {
    &.is-large {
      padding: 24px;
      background-color: #fff;
      border-radius: 5px;
      box-shadow: 0 0 10px 3px rgba(0, 0, 0, .1);
    }
    &.is-mega {
      // .hops-plant-held {
      //   color: $--main-blue-color;
      // }
      &:not(.is-boost) {
        .hops-plant-level {
          color: $--main-blue-color;
          // &::before {
          //   background-color: $--main-red-color;
          // }
        }
      }
    }
    &.is-boost {
      .hops-plant-held {
        color: $--main-red-color;
      }
      .hops-plant-level {
        &::before {
          background-color: $--main-red-color;
        }
      }
      .plant-level-choice {
        &::before {
          background-color: #555;
        }
      }
      .plant-held-boost-icon {
        display: block;
      }
      .old-plant-held {
        display: block;
      }
    }
    &.is-selected {
      background-image: linear-gradient(-225deg, #124BDC 0%, #0079FF 100%);
      box-shadow: 0 0 10px 5px rgba(0, 121, 255, .3);
      .hops-plant-sub-box {
        display: block;
      }
      .plant-sub-icon {
        fill: $--main-blue-color;
      }
      .plant-deposits-info, .hops-plant-lessAmount, .old-plant-held, .hops-plant-held, .hops-plant-level {
        color: #fff;
      }
      .hops-plant-level {
        &::before {
          background-color: #fff;
        }
      }
      .plant-level-choice {
        &::before {
          background-color: #fff;
        }
      }
      .plant-held-boost-icon {
        fill: #fff;
      }
      &.is-pro, &.is-boost {
        box-shadow: 0 0 10px 5px rgba(245, 81, 95, .2);
        background-image: linear-gradient(-45deg, #F5515F 0%, #D1001F 100%);
        .plant-sub-icon {
          fill: $--main-red-color;
        }
      }
    }
    // &.not-balance {
    //   // background-color: #fff;
    //   .hops-plant-held, .hops-plant-level, .plant-deposits-info, .plant-income-info {
    //     color: #bbb;
    //   }
    //   .hops-plant-level {
    //     &::before {
    //       background-color: #bbb;
    //     }
    //   }
    //   // .plant-income-info {
    //   //   >span {
    //   //     @include TTFontBold();
    //   //   }
    //   // }
    //   .hops-plant-lessAmount {
    //     margin-top: -2px;
    //     color: $--main-red-color;
    //     @include TTFontBolder();
    //   }

    //   .hops-plant-small {
    //     .plant-small-type {
    //       color: #bbb;
    //     }
    //     .plant-small-held {
    //       color: #bbb;
    //     }
    //   }
    // }
  }
  .hops-plant-sub-box {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
    width: 48px;
    height: 48px;
    border-top-right-radius: 5px;
    overflow: hidden;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      border-left: 48px solid transparent;
      border-right: 48px solid #fff;
      border-bottom: 48px solid transparent;
      z-index: 1;
    }
  }
  .plant-sub-icon {
    position: absolute;
    right: 6px;
    top: 6px;
    width: 16px;
    height: 16px;
    z-index: 2;
  }

  .plant-held-boost-icon {
    display: none;
    position: absolute;
    right: -10px;
    top: -10px;
    width: 10px;
    height: 10px;
    fill: $--main-red-color;
  }
  .old-plant-held {
    display: none;
    color: #bbb;
    transform: translateY(-4px);
  }
  .hops-plant-held {
    margin-right: 16px;
    padding-top: 16px;
    width: 72px;
    // padding-right: 24px;
    font-size: 36px;
    color: $--main-blue-color;
    &::before {
      content: 'HELD';
      position: absolute;
      left: 0;
      top: 0;
      font-size: 14px;
      font-family: $--font-TTNormsBold;
    }
    &.is-small {
      font-size: 18px;
    }
  }

  // .hops-plant-right {
  //   margin-left: 16px;
  // }
  .hops-plant-level {
    padding-left: 10px;
    font-size: 14px;
    color: #555;
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      width: 6px;
      height: 14px;
      transform: translateY(-50%);
      background-color: $--main-blue-color;
    }
  }
  .plant-level-choice {
    margin-left: 18px;
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: -12px;
      width: 6px;
      height: 6px;
      transform: translateY(-50%);
      background-color: $--main-blue-color;
      border-radius: 100%;
    }
  }
  .plant-deposits-info {
    margin-top: 8px;
    font-size: 20px;
  }
  .hops-plant-lessAmount {
    margin-top: 6px;
    font-size: 14px;
    color: #999;
  }

  // .plant-income-info {
  //   margin-top: 12px;
  //   padding-top: 8px;
  //   border-top: 1px solid #ddd;
  //   font-size: 14px;
  //   color: #555;
  // }

  // hops-plant-small
  .hops-plant-small {
    // padding: 10px 16px;
    // width: 144px;
    // border-radius: 5px;
    // box-sizing: border-box;
    // background-color: #fff;
    // box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.12);
    padding: 10px 16px;
    background-color: #fff;
    border-radius: 5px;
    .plant-small-type {
      font-size: 14px;
      color: #777;
    }
    .plant-small-held {
      font-size: 24px;
      color: #0079FF;
    }
    &.is-active {
      background-color: #0079FF;
      >p {
        color: #fff;
      }
    }
  }
  .plant-small-old-held {
    margin-left: 10px;
    font-size: 16px;
    color: #ddd;
  }
  .plant-small-min-least {
    font-size: 14px;
    color: #999;
  }
</style>
