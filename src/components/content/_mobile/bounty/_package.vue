<template>
  <div class="relative package-bounty-box">
    <transition name="ld-hide-fade" mode="out-in" @after-enter="afterEnter">
      <package-bounty-skeletion v-if="loading"/>
      <div v-else>
        <span class="inline-block line-height-0 package-bounty-gift-bg">
          <svg>
            <use xlink:href="#icon-bounty-gift"/>
          </svg>
        </span>
        <div ref="package-bounty-container" class="relative container package-bounty-container">
          <div class="package-bounty-header">
            <h2>Make a Bounty Chest</h2>
            <p class="package-bounty-desc">You need to wrap your rewards up in a Bounty Chest and then you can open the chest with HOPS to reap all the tokens.</p>
          </div>
          <div class="package-bounty-candies-info package-bounty-bounties">
            <div class="package-bounty-slider">
              <el-slider
                v-model="bountySliderModel">
              </el-slider>
              <p>{{ currentVolume }}</p>
            </div>
            <h3 class="d-flex f-align-center">
              <span class="inline-block line-height-0 package-info-icon">
                <svg>
                  <use xlink:href="#icon-bounty-diamond"/>
                </svg>
              </span>
              <span>BOUNTIES</span>
              <span>&nbsp;&nbsp;(≈ {{ totalBountyVolume | formatDecimal }}ETH)</span>
            </h3>
            <ul class="package-bounty-candies-box">
              <li v-for="(item, index) of packageBountiesInfo" :key="index"
                class="d-flex f-align-center bounty-candies-item bounty"
                :class="{ 'is-hide': item.hide }">
                <span class="inline-block line-height-0 bounty-candy-icon">
                  <svg>
                    <use :xlink:href="`#coin-${item.candy.symbol.toLocaleLowerCase()}`"/>
                  </svg>
                </span>
                <span class="bounty-candy-symbol">{{ item.candy.symbol }}</span>
                <span class="v-flex text-right">x {{ item.count | formatMoneyNumber }}</span>
              </li>
            </ul>
          </div>
          <div class="package-bounty-candies-info package-bounty-cost">
            <h3 class="d-flex f-align-center">
              <span class="inline-block line-height-0 package-info-icon">
                <svg>
                  <use xlink:href="#icon-bounty-key"/>
                </svg>
              </span>
              <span>UNLOCKING COST</span>
            </h3>
            <ul class="package-bounty-candies-box">
              <li class="TTFontBolder d-flex f-align-center bounty-candies-item cost">
                <span class="inline-block line-height-0 bounty-candy-icon">
                  <svg>
                    <use xlink:href="#icon-origin-hops"/>
                  </svg>
                </span>
                <span class="bounty-candy-symbol">HOPS</span>
                <span class="v-flex text-right">x {{ weiByDecimals(needHopsAmount).toLocaleString() }}</span>
              </li>
            </ul>
          </div>
          <div ref="package-bounty-btn-box" class="package-bounty-btn-box">
            <lordless-btn
              class="full-width package-bounty-btn"
              theme="blue"
              inverse
              :loading="packageLoading"
              :disabled="insufficientAssets || packageLoading"
              @click="packageBounty">
              <span v-if="insufficientAssets" class="d-flex f-auto-center">At least
                <span class="inline-block line-height-0 bounty-eth-icon">
                  <svg>
                    <use xlink:href="#icon-eth-price"/>
                  </svg>
                </span>
                {{ bountyAssets.almostEth }} &nbsp;for a chest</span>
              <span v-else>Make a Bounty Chest now</span>
            </lordless-btn>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import PackageBountySkeletion from '@/components/skeletion/_mobile/bounty/package'
import { weiByDecimals, formatDecimal } from 'utils/tool'
import { _add, _strip } from 'utils/tool/math'
import { getBountyInfos, packageBounty } from 'api'
export default {
  name: 'package-bounty-component',
  data: () => {
    return {
      rendered: false,
      loading: true,
      packageLoading: false,
      bountyAssets: {
        detailBountiesInfo: [],
        needHopsAmount: 0,
        needHopsPrice: 0,
        assetsByEth: 0,
        almostEth: 0,
        ethPrice: 0
      },
      packageBountiesInfo: [],
      // bounty slider option
      bountySliderModel: 100
    }
  },
  computed: {
    insufficientAssets () {
      return this.bountyAssets.assetsByEth < this.bountyAssets.almostEth
    },
    totalBountyVolume () {
      return this.bountyAssets.assetsByEth || 0
    },
    currentVolume () {
      const almostEth = this.bountyAssets.almostEth
      return _strip(almostEth + _strip(((this.totalBountyVolume - almostEth) / 100) * this.bountySliderModel))
    },
    needHopsAmount () {
      const _needHopsPrice = this.bountyAssets.needHopsPrice
      return _strip(_needHopsPrice * this.currentVolume)
    }
  },
  watch: {
    currentVolume (val) {
      const _packageBountiesInfo = JSON.parse(JSON.stringify(this.packageBountiesInfo))
      const _ethPrice = this.bountyAssets.ethPrice

      // 总持有 token 的 eth 价值数量
      const _tVolume = this.totalBountyVolume

      // 当前选择的 eth 价值数量
      const _cVolume = val

      // 滚动 slider cut 掉的 eth 价值数量
      const _cutVolume = _add(_tVolume, -_cVolume)
      console.log('------- watch currentVolume', _tVolume, _cVolume, _cutVolume, _packageBountiesInfo)

      // 使用 reduce 方法做 token操作
      _packageBountiesInfo.reduce((a, item, index) => {
        // _result 代表当前及之前所有的 ethVolume
        const _result = a + item.ethVolume

        // 如果 _result 小于等于 _cutVolume，则隐藏该 token
        if (_result <= _cutVolume) {
          _packageBountiesInfo[index].hide = true
          _packageBountiesInfo[index].count = 0

        // 如果 _cutVolume 减去之前token 的 ethVolume 大于 0,代表需要操作该 token 数据
        } else if (_cutVolume - a > 0) {
          // 获取该 token 剩余 volume
          const _itemLeftVolume = item.ethVolume - (_cutVolume - a)

          // 计算该 token 剩余 count
          const _itemLeftCount = _itemLeftVolume * _ethPrice * item.candy.USD2TokenCount
          console.log('----- _itemLeftVolume', _itemLeftVolume, '_itemLeftCount', _itemLeftCount, '_cutVolume', _cutVolume, a)
          _packageBountiesInfo[index].hide = false
          _packageBountiesInfo[index].count = _itemLeftCount

        // 其他情况，恢复token数据
        } else {
          _packageBountiesInfo[index].hide = false
          _packageBountiesInfo[index].count = item._count
        }
        return _result
      }, 0)
      this.packageBountiesInfo = _packageBountiesInfo
    }
  },
  components: {
    PackageBountySkeletion
  },
  methods: {
    weiByDecimals () {
      return weiByDecimals(...arguments)
    },

    formatDecimal () {
      return formatDecimal(...arguments)
    },

    afterEnter () {
      this.initbountyBtnBox()
    },

    initPackageBounty () {
      this.getBountyAssets()
      this.initbountyBtnBox()
    },

    async getBountyAssets () {
      this.loading = true
      try {
        const res = await getBountyInfos()
        if (res.code === 1000 && res.data) {
          this.bountyAssets = res.data
          this.packageBountiesInfo = res.data.detailBountiesInfo
        }
      } catch (err) {
        console.log('--- err', err)
      }
      this.loading = false
      if (!this.rendered) this.rendered = true
    },

    initbountyBtnBox () {
      const box = this.$refs['package-bounty-btn-box']
      const parent = this.$refs['package-bounty-container']
      console.log('---- initbountyBtnBox', box, parent)
      if (!box || !parent) return
      document.body.appendChild(box)
      this.$once('hook:beforeDestroy', () => {
        parent.appendChild(box)
      })
      this.$once('hook:deactivated', () => {
        parent.appendChild(box)
      })
    },

    async packageBounty () {
      this.packageLoading = true
      try {
        const res = await packageBounty({ percent: this.bountySliderModel })
        if (res.code === 1000 && res.data) this.$router.push('/owner/bc?type=chests')
        else if (res.code !== 1000) {
          this.$notify.error({
            title: 'Package Error!',
            message: res.errorMsg,
            position: 'bottom-right',
            duration: 2500
          })
        }
      } catch (err) {
        this.$notify.error({
          title: 'Package Error!',
          message: err.message || 'Unknow Error!',
          position: 'bottom-right',
          duration: 2500
        })
      }
      this.packageLoading = false
    }
  },
  deactivated () {
    this.bountySliderModel = 100
    this.loading = true
  },
  activated () {
    if (!this.rendered) return
    this.initPackageBounty()
  },
  mounted () {
    this.$nextTick(() => this.initPackageBounty())
  }
}
</script>

<style lang="scss" scoped>
  .package-bounty-box {

  }
  .package-bounty-gift-bg {
    position: absolute;
    top: 20px;
    right: -30px;
    width: 178px;
    height: 178px;
    opacity: 0.2;
  }
  .package-bounty-container {
    padding-top: 44px;
    padding-bottom: 80px;
    z-index: 1;
  }
  .package-bounty-header {
    padding-top: 28px;
    >h2 {
      font-size: 24px;
    }
  }
  .package-bounty-desc {
    margin-top: 12px;
    font-size: 16px;
    color: #555;
  }

  .package-bounty-candies-info {
    >h3 {
      font-size: 16px;
    }
    .package-info-icon {
      margin-right: 6px;
      width: 20px;
      height: 20px;
    }
  }

  .package-bounty-bounties {
    margin-top: 32px;
  }

  .package-bounty-cost {
    margin-top: 40px;
  }
  .bounty-candies-item {
    margin-top: 18px;
    padding: 18px;
    font-size: 16px;
    color: #555;
    background-color: #fff;
    border-radius: 5px;
    &.bounty {
      box-shadow: 0 0 8px 0 rgba(0, 121, 255, 0.45);
      transition: all .3s, visibility 0s 0s;
      .bounty-candy-icon {
        width: 20px;
        height: 20px;
      }
    }
    &.cost {
      color: #005736;
      box-shadow: 0 0 8px 0 rgba(0, 193, 167, 1);
      .bounty-candy-icon {
        width: 24px;
        height: 24px;
      }
    }
    &.is-hide {
      opacity: 0;
      visibility: hidden;
      height: 0;
      padding: 0;
      margin: 0;
      transform: scale(0);
      transform-origin: center;
      transition: all .3s, visibility 0s .3s;
    }
  }
  .bounty-candy-symbol {
    margin-left: 10px;
  }
  .bounty-candy-icon {
    fill: #0079FF;
  }

  .package-bounty-btn-box {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }
  .package-bounty-btn {
    padding: 16px 0;
    border-radius: 0;
  }
  .bounty-eth-icon {
    margin-left: 6px;
    margin-right: 4px;
    width: 12px;
    height: 16px;
  }
</style>
