<template>
  <div class="ldb-datas-box">
    <div v-if="loading" class="d-flex ldb-datas-skeletion">
      <div class="v-flex skeletion-breath">
        <p></p>
        <p></p>
        <p></p>
        <p></p>
      </div>
      <div class="v-flex skeletion-breath">
        <p></p>
        <p></p>
        <p></p>
        <p></p>
      </div>
    </div>
    <transition name="ld-hide-fade">
      <section v-show="!loading" class="d-flex f-align-ceter sm-col-flex detail-ldb-datas">
        <div class="v-flex ldb-datas-item">
          <p class="datas-item-title">Level {{ info.chain.level }}</p>
          <h2>
            {{ info.activeness }}
            <span class="TTFontBold inline-block">/ {{ info.chain.level | nextAC }}</span>
          </h2>
          <div class="ldb-datas-progress">
            <ld-progress
              shadow
              :current="info.activeness"
              :max="info.chain.level | nextAC"
              :gradient="progressOpts.level.gradient">
            </ld-progress>
          </div>
          <p class="ldb-datas-desc">{{ info.chain.level | remainingAC(info.activeness) }} AC to level up</p>
        </div>
        <div class="v-flex ldb-datas-item">
          <p class="datas-item-title">Action Point</p>
          <h2>
            {{ info.apLeft }}
            <span class="TTFontBold inline-block">/ {{ info.ap }}</span></h2>
          <div class="ldb-datas-progress">
            <ld-progress
              shadow
              :current="info.apLeft"
              :max="info.ap"
              :gradient="progressOpts.action.gradient">
            </ld-progress>
          </div>
          <p class="ldb-datas-desc">{{ info.apLeft }} AP remaining</p>
        </div>
      </section>
    </transition>
  </div>
</template>

<script>
import LdProgress from '@/components/stories/progress'
import { nextAC } from 'utils/tool'
export default {
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    },

    loading: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      progressOpts: {
        level: {
          gradient: {
            direction: 'to bottom',
            start: '#CDCAF6',
            end: '#96A8FD'
          }
        },
        action: {
          gradient: {
            direction: 'to bottom',
            start: '#00C0EB',
            end: '#3588FD'
          }
        }
      }
    }
  },
  computed: {
    ldbActiveness () {
      return this.info.activeness
    }
  },
  watch: {
    /**
     * 监听建筑当前经验
     * 根据当前建筑等级，计算升级所需经验
     * 达到升级条件，改变建筑等级
     */
    ldbActiveness (val) {
      const nextAc = nextAC(this.info.chain.level)
      if (val >= nextAc) {
        const info = this.info
        info.chain.level += 1
        this.$emit('update:info', info)
      }
    }
  },
  components: {
    LdProgress
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/stylus/mixin/index.scss';
  // ldb-datas-skeletion
  .ldb-datas-skeletion {
    border-radius: 5px;
    background-color: $--skeletion-light;
    >div {
      padding: 32px 30px;
      >p {
        background-color: $--skeletion-dark;
        &:nth-of-type(1) {
          width: 80px;
          height: 30px;
        }
        &:nth-of-type(2) {
          margin-top: 15px;
          width: 120px;
          height: 45px;
        }
        &:nth-of-type(3) {
          margin-top: 15px;
          height: 25px;
          border-radius: 5px;
        }
        &:nth-of-type(4) {
          margin-top: 10px;
          width: 50%;
          height: 15px;
        }
      }
    }
  }

  // detail-ldb-datas
  .detail-ldb-datas {
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .25);
  }
  .ldb-datas-item {
    padding: 32px 30px;
    >h2 {
      margin-top: 10px;
      >span {
        font-size: 18px;
        font-weight: normal;
        color: #999;
        transform: translateY(-3px);
      }
    }
  }
  .datas-item-title {
    font-size: 24px;
  }
  .ldb-datas-progress {
    margin-top: 20px;
    height: 27px;
    border-radius: 5px;
    overflow: hidden;
  }
  .ldb-datas-desc {
    margin-top: 10px;
    color: #999;
    font-size: 14px;
  }
</style>
