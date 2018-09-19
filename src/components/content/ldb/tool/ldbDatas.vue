<template>
  <div class="relative alone-layer ldb-datas-box">

    <!-- ldb detail datas skeletion -->
    <!-- <transition name="ld-suspension-hide-fade"> -->
      <datas-skeletion v-if="loading"></datas-skeletion>
    <!-- </transition> -->

    <transition name="ld-hide-fade" @after-enter="datasEnter">
      <section v-if="!loading" class="d-flex f-align-ceter sm-col-flex detail-ldb-datas">
        <div class="v-flex ldb-datas-item">
          <div class="datas-item-title">Level <count-up class="inline-block" :startVal="countUp.level.start" :endVal="countUp.level.end" :duration="countUp.level.duration" :isReady="countUp.level.isReady"></count-up></div>
          <h2>
            <span class="datas-item-current">
              <count-up class="inline-block" :startVal="countUp.cAC.start" :endVal="countUp.cAC.end" :duration="countUp.cAC.duration" :isReady="countUp.cAC.isReady"></count-up>
            </span>
            <span class="TTFontBold inline-block datas-item-next">/ <count-up class="inline-block" :startVal="countUp.nAC.start" :endVal="countUp.nAC.end" :duration="countUp.nAC.duration" :isReady="countUp.nAC.isReady"></count-up></span>
          </h2>
          <div class="ldb-datas-progress">
            <lordless-progress
              shadow
              :current="countUp.cAC.end"
              :max="countUp.nAC.end"
              :gradient="progressOpts.level.gradient">
            </lordless-progress>
          </div>
          <p class="ldb-datas-desc">{{ countUp.nAC.end - countUp.cAC.end }} AC to level up</p>
        </div>
        <div class="v-flex ldb-datas-item">
          <p class="datas-item-title">Action Point</p>
          <h2>
            <span class="datas-item-current">
              <count-up class="inline-block" :startVal="countUp.cAP.start" :endVal="countUp.cAP.end" :duration="countUp.cAP.duration" :isReady="countUp.cAP.isReady"></count-up>
            </span>
            <span class="TTFontBold inline-block datas-item-next">/ <count-up class="inline-block" :startVal="countUp.nAP.start" :endVal="countUp.nAP.end" :duration="countUp.nAP.duration" :isReady="countUp.nAP.isReady"></count-up></span></h2>
          <div class="ldb-datas-progress">
            <lordless-progress
              shadow
              :current="countUp.cAP.end"
              :max="countUp.nAP.end"
              :gradient="progressOpts.action.gradient">
            </lordless-progress>
          </div>
          <p class="ldb-datas-desc">{{ countUp.cAP.end }} AP remaining</p>
        </div>
      </section>
    </transition>
  </div>
</template>

<script>
import DatasSkeletion from '@/components/skeletion/ldb/detail/tool/datas'
import { nextAC, _setTimeout } from 'utils/tool'
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
  data: (vm) => {
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
      },
      acTimer: null,
      apTimer: null,
      countUp: {
        level: {
          isReady: false,
          duration: 1500,
          start: 0,
          end: 0
        },
        cAC: {
          isReady: false,
          duration: 1500,
          start: 0,
          end: 0
        },
        nAC: {
          isReady: false,
          duration: 1500,
          start: 0,
          end: 0
        },
        cAP: {
          isReady: false,
          duration: 1500,
          start: 0,
          end: 0
        },
        nAP: {
          isReady: false,
          duration: 1500,
          start: 0,
          end: 0
        }
      }
    }
  },
  computed: {
    // ldbActiveness () {
    //   return this.info.activeness
    // },
    apLeft () {
      return this.info.apLeft
    }
  },
  watch: {
    /**
     * 监听建筑当前经验
     * 根据当前建筑等级，计算升级所需经验
     * 达到升级条件，改变建筑等级
     */
    'info.activeness' (val) {
      const func = () => {
        return () => {
          let _this = this
          clearTimeout(_this.acTimer)
          _this.acTimer = null
          _this.acTimer = setTimeout(() => {
            const nextAc = nextAC(_this.info.chain.level)
            if (val >= nextAc) {
              const info = _this.info
              info.chain.level += 1
              _this.$emit('update:info', info)
              _this.initLevelCU({ end: info.chain.level })
              _this.initNextACCU({ end: nextAC(info.chain.level) })
            }
            _this.initCurrentACCU({ end: val })
          }, 600)
        }
      }
      func()()
    },

    /**
     * 监听当前建筑 apLeft
     */
    apLeft (val) {
      const func = () => {
        return () => {
          let _this = this
          clearTimeout(_this.apTimer)
          _this.apTimer = null
          _this.apTimer = setTimeout(() => {
            _this.initCurrentAPCU({ end: val })
          }, 600)
        }
      }
      func()()
    }
  },
  components: {
    DatasSkeletion
  },
  methods: {
    datasEnter () {
      this.$emit('enter')
      this.initCountUp()
    },
    initCountUp () {
      this.initLevelCU()
      this.initCurrentACCU()
      this.initNextACCU()
      this.initCurrentAPCU()
      this.initNextAPCU()
    },
    initLevelCU ({ start = this.countUp.level.start, end = this.countUp.level.end || this.info.chain.level } = {}) {
      if (!this.countUp.level.isReady) {
        this.$set(this.countUp, 'level', {
          start: end,
          end,
          isReady: true,
          duration: 1500
        })
        return
      }
      this.$set(this.countUp.level, 'end', end)

      _setTimeout({ duration: this.countUp.level.duration }, () => {
        this.$set(this.countUp.level, 'start', end)
      })

      // const timeOut = setTimeout(() => {
      //   this.$set(this.countUp.level, 'start', end)
      //   clearTimeout(timeOut)
      // }, this.countUp.level.duration)
    },

    initCurrentACCU ({ start = this.countUp.cAC.start, end = this.countUp.cAC.end || this.info.activeness } = {}) {
      if (!this.countUp.cAC.isReady) {
        this.$set(this.countUp, 'cAC', {
          start: end,
          end,
          isReady: true,
          duration: 1500
        })
        return
      }
      this.$set(this.countUp.cAC, 'end', end)

      _setTimeout({ duration: this.countUp.cAC.duration }, () => {
        this.$set(this.countUp.cAC, 'start', end)
      })
      // const timeOut = setTimeout(() => {
      //   this.$set(this.countUp.cAC, 'start', end)
      //   clearTimeout(timeOut)
      // }, this.countUp.cAC.duration)
    },

    initNextACCU ({ start = this.countUp.nAC.start, end = this.countUp.nAC.end || nextAC(this.info.chain.level) } = {}) {
      if (!this.countUp.nAC.isReady) {
        this.$set(this.countUp, 'nAC', {
          start: end,
          end,
          isReady: true,
          duration: 1500
        })
        return
      }
      this.$set(this.countUp.nAC, 'end', end)

      _setTimeout({ duration: this.countUp.nAC.duration }, () => {
        this.$set(this.countUp.nAC, 'start', end)
      })
      // const timeOut = setTimeout(() => {
      //   this.$set(this.countUp.nAC, 'start', end)
      //   clearTimeout(timeOut)
      // }, this.countUp.nAC.duration)
    },

    initCurrentAPCU ({ start = this.countUp.cAP.start, end = this.countUp.cAP.end || this.info.apLeft } = {}) {
      if (!this.countUp.cAP.isReady) {
        this.$set(this.countUp, 'cAP', {
          start: end,
          end,
          isReady: true,
          duration: 1500
        })
        return
      }
      this.$set(this.countUp.cAP, 'end', end)

      _setTimeout({ duration: this.countUp.cAP.duration }, () => {
        this.$set(this.countUp.cAP, 'start', end)
      })
      // const timeOut = setTimeout(() => {
      //   this.$set(this.countUp.cAP, 'start', end)
      //   clearTimeout(timeOut)
      // }, this.countUp.cAP.duration)
    },

    initNextAPCU ({ start = this.countUp.nAP.start, end = this.countUp.nAP.end || this.info.ap } = {}) {
      if (!this.countUp.nAP.isReady) {
        this.$set(this.countUp, 'nAP', {
          start: end,
          end,
          isReady: true,
          duration: 1500
        })
        return
      }
      this.$set(this.countUp.nAP, 'end', end)

      _setTimeout({ duration: this.countUp.nAP.duration }, () => {
        this.$set(this.countUp.nAP, 'start', end)
      })
      // let startt = 0
      // const step = (timestamp) => {
      //   if (!startt) startt = timestamp
      //   if (timestamp - startt < this.countUp.nAP.duration) return window.requestAnimationFrame(step)
      //   return this.$set(this.countUp.nAP, 'start', end)
      // }
      // return window.requestAnimationFrame(step)
      // const timeOut = setTimeout(() => {
      //   this.$set(this.countUp.nAP, 'start', end)
      //   clearTimeout(timeOut)
      // }, this.countUp.nAP.duration)
    }
  }
}
</script>

<style lang="scss" scoped>
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
    }
  }
  .datas-item-current {

  }
  .datas-item-next {
    font-size: 18px;
    font-weight: normal;
    color: #999;
    transform: translateY(-3px);
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
