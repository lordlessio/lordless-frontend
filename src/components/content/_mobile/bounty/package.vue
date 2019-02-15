<template>
  <div class="package-bounty-box">
    <transition name="ld-hide-fade" mode="out-in" @after-enter="afterEnter">
      <package-bounty-skeletion v-if="loading"/>
      <div v-else-if="!bountyAssets.assetsByEth" class="d-flex f-auto-center col-flex bounty-chest-empty">
        <span class="inline-block line-height-0 chest-empty-icon">
          <svg>
            <use xlink:href="#icon-chest-empty"/>
          </svg>
        </span>
        <h2>You have no tokens.</h2>
        <p>Claim some tokens in the taverns.</p>
        <lordless-btn class="chest-empty-btn" theme="blue-linear" @click="$router.push('/taverns')">Go to Taverns</lordless-btn>
      </div>
      <div v-else>
        <div class="package-bounty-header">
          <p class="d-flex f-align-center">
            <span>Unlocking cost (HOPS)</span>
            <span class="TTFontBolder text-right v-flex">{{ weiByDecimals(needHopsAmount).toLocaleString() }}</span>
          </p>
          <p class="d-flex f-align-center">
            <span>Bounty Chest size (ETH)</span>
            <span class="TTFontBolder text-right v-flex">≈ {{ currentVolume | formatDecimal }}</span>
          </p>
          <!-- <h1 class="d-flex f-auto-center">
            <span class="inline-block line-height-0 bounty-chest-eth-icon">
              <svg>
                <use xlink:href="#icon-eth-price"/>
              </svg>
            </span>
            <span>{{ currentVolume | formatDecimal }}</span>
          </h1> -->
        </div>
        <div ref="package-bounty-container" class="relative container package-bounty-container">
          <div class="package-bounty-candies-info package-bounty-options">
            <h3 class="d-flex f-align-center">
              <span class="inline-block line-height-0 package-info-icon">
                <svg>
                  <use xlink:href="#icon-bounty-chest-checked"/>
                </svg>
              </span>
              <span>SIZE</span>
              <div v-if="!insufficientAssets" class="text-right v-flex translate-slider-box">
                <span class="d-inline-flex f-align-center" @click.stop="bountySlider = !bountySlider">
                  <span class="inline-block line-height-0 translate-slider-icon">
                    <svg>
                      <use xlink:href="#icon-switch"/>
                    </svg>
                  </span>
                  <span v-if="!bountySlider">SLIDER</span>
                  <span v-else>OPTIONS</span>
                </span>
              </div>
            </h3>
            <div class="bounty-options-box">
              <div v-if="bountySlider" class="package-bounty-slider">
                <el-slider
                  v-model="bountySliderModel"
                  :show-tooltip="false"
                  :disabled="insufficientAssets">
                </el-slider>
              </div>
              <div v-else class="d-flex f-align-center bounty-option-btns">
                <lordless-btn
                  v-for="(item, index) of bountyOptionBtns"
                  :key="index"
                  class="v-flex bounty-option-btn"
                  :theme="(item === optionBtnTab && !insufficientAssets) ? 'blue-linear' : 'default'"
                  :disabled="insufficientAssets || (item !== -1 && totalBountyVolume < item)"
                  @click="chooseBtnOption(item)" >
                  <span v-if="item === -1">ALL</span>
                  <span v-else>{{ item }} ETH</span>
                </lordless-btn>
              </div>
            </div>
          </div>
          <div class="package-bounty-candies-info package-bounty-bounties">
            <h3 class="d-flex f-align-center">
              <span class="inline-block line-height-0 package-info-icon">
                <svg>
                  <use xlink:href="#icon-bounty-diamond"/>
                </svg>
              </span>
              <span>BOUNTIES</span>
              <!-- <span>&nbsp;&nbsp;(≈ {{ totalBountyVolume | formatDecimal }}ETH)</span> -->
            </h3>
            <div class="package-bounties-cnt-box">
              <ul class="package-bounty-candies-box">
                <li class="d-flex f-align-center bounties-box-title">
                  <span class="inline-block line-height-0 bounties-box-title-icon">
                    <svg>
                      <use xlink:href="#icon-radio-selected"/>
                    </svg>
                  </span>
                  <span>Wrapping</span>
                </li>
                <li v-for="(item, index) of packageBountiesInfo" :key="index"
                  class="d-flex f-align-center bounty-candies-item" :class="{ 'is-gray': !item.count }">
                  <span class="bounty-candy-symbol">{{ item.candy.symbol }}</span>
                  <span class="v-flex text-right">x {{ item.count | formatMoneyNumber }}</span>
                </li>
              </ul>
              <ul class="package-bounty-candies-box">
                <li class="d-flex f-align-center bounties-box-title">
                  <span class="inline-block line-height-0 bounties-box-title-icon">
                    <svg>
                      <use xlink:href="#icon-balance"/>
                    </svg>
                  </span>
                  <span>Balance</span>
                </li>
                <li v-for="(item, index) of packageBountiesInfo" :key="index"
                  class="d-flex f-align-center bounty-candies-item" :class="{ 'is-gray': !item.left }">
                  <span class="bounty-candy-symbol">{{ item.candy.symbol }}</span>
                  <span class="v-flex text-right">x {{ (item.left || 0) | formatMoneyNumber }}</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="chest-asked-box">
            <p class="TTFontBolder text-center chest-asked-title">FREQUENTLY ASKED QUESTIONS</p>
            <ul class="chest-asked-questions">
              <li
                class="asked-questions-item"
                :class="{ 'is-show': item.show }"
                v-for="(item, index) of askedQuestions" :key="index"
                @click.stop="toggleQuestion(index)">
                <h3 class="relative asked-questions-title">
                  <span>{{ item.title }}</span>
                  <span class="inline-block line-height-0 asked-title-triangle">
                    <svg>
                      <use xlink:href="#icon-triangle-left"/>
                    </svg>
                  </span>
                </h3>
                <p class="TTFontNormal asked-questions-desc">
                  <span class="inline-block">{{ item.desc }}</span>
                </p>
              </li>
            </ul>
          </div>
          <!-- <div class="package-bounty-candies-info package-bounty-cost">
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
          </div> -->
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
      bountySliderModel: 100,
      bountySlider: false,

      optionBtnTab: -1,
      bountyOptionBtns: [0.1, 0.3, -1],

      // bounty chest asked questions
      askedQuestions: [
        {
          title: 'Why do I need to make a Bounty Chest?',
          desc: 'You need to wrap your rewards up in a Bounty Chest and then you can open the chest with HOPS to reap all the tokens.',
          show: false
        }, {
          title: 'What is Bounty Chest?',
          desc: 'You need to wrap your rewards up in a Bounty Chest and then you can open the chest with HOPS to reap all the tokens.',
          show: false
        }, {
          title: 'What is Bounty Chest size?',
          desc: 'You need to wrap your rewards up in a Bounty Chest and then you can open the chest with HOPS to reap all the tokens.',
          show: false
        }, {
          title: 'Why does the size of Bounty Chest change?',
          desc: 'You need to wrap your rewards up in a Bounty Chest and then you can open the chest with HOPS to reap all the tokens.',
          show: false
        }
      ]
    }
  },
  computed: {
    insufficientAssets () {
      return this.bountyAssets.assetsByEth < this.bountyAssets.almostEth
    },
    totalBountyVolume () {
      console.log('--- totalBountyVolume', formatDecimal(this.bountyAssets.assetsByEth))
      return this.bountyAssets.assetsByEth || 0
    },

    // options btn choose volume
    optionBtnVolume () {
      return this.optionBtnTab === -1 ? this.totalBountyVolume : this.optionBtnTab
    },

    // opitons slider choose volume
    sliderCVolume () {
      const almostEth = this.bountyAssets.almostEth
      if (this.insufficientAssets) return this.totalBountyVolume
      return this.bountySliderModel === 100 ? this.totalBountyVolume : _strip(almostEth + _strip(((this.totalBountyVolume - almostEth) / 100) * this.bountySliderModel))
    },

    // 根据判断，显示当前 volume
    currentVolume () {
      return this.bountySlider ? this.sliderCVolume : this.optionBtnVolume
    },
    needHopsAmount () {
      const _needHopsPrice = this.bountyAssets.needHopsPrice
      return _strip(_needHopsPrice * this.currentVolume)
    }
  },
  watch: {
    currentVolume (val) {
      const _packageBountiesInfo = JSON.parse(JSON.stringify(this.bountyAssets.detailBountiesInfo))

      // 如果当前 volume 等于 totalBountyVolume，恢复 packageBountiesInfo 为初始状态
      if (val === this.totalBountyVolume) {
        this.packageBountiesInfo = _packageBountiesInfo
        return
      }
      // 当前选择的 eth 价值数量
      const _cVolume = formatDecimal(val)

      // 计算平均值
      const averageVolume = _strip(_cVolume / _packageBountiesInfo.length)

      // 多余的token存储
      const overTokens = {}

      // 消耗的token存储
      const costTokens = {}

      console.log('averageVolume', averageVolume, this.totalBountyVolume, _cVolume)

      // _packageBountiesInfo 初始为 ethVolume 降序排列状态,统一从后端处理的数据
      for (const item of _packageBountiesInfo) {
        const token = item.candy.address
        console.log('------ token', token, item.ethVolume, averageVolume)

        // 如果当前 token 的 ethVolume 大于 平均值
        if (item.ethVolume > averageVolume) {
          // 计算超出的 ethVolume
          const _overEthVolume = _add(item.ethVolume, -averageVolume)

          // 超出的数据 存储数据至 overTokens
          overTokens[token] = {
            candy: item.candy,
            _count: item._count,
            overEthVolume: _overEthVolume
          }

          // 存储token消耗数据
          costTokens[token] = {
            candy: item.candy,
            _count: item._count,
            _ethVolume: item.ethVolume,
            ethVolume: averageVolume
          }
          console.log('------ _overEthVolume', _overEthVolume, JSON.stringify(overTokens[token]), JSON.stringify(costTokens[token]))
        // 反之，如果当前 token 的 ethVolume 小于等于 平均值
        } else {
          // 先将该 token 数据存储
          costTokens[token] = Object.assign({}, item, { _ethVolume: item.ethVolume })

          // 计算达到平均值还需要的 volume 为 needVolume
          let needVolume = averageVolume - item.ethVolume

          // 遍历 _overTokens 数据
          const _overTokens = Object.values(overTokens)
          for (const oItem of _overTokens) {
            // 如果 needVolume 被填充完毕，跳出循环
            if (needVolume <= 0) break
            const _token = oItem.candy.address

            // 如果 该 overToken 的 overEthVolume 大于 needVolume
            if (oItem.overEthVolume > needVolume) {
              console.log('--------- over', _add(overTokens[_token].overEthVolume, -needVolume), _add(costTokens[_token].ethVolume, needVolume))

              // 扣除 needVolume 数量的该 overToken 的 overEthVolume
              overTokens[_token].overEthVolume = _add(overTokens[_token].overEthVolume, -needVolume)

              // 增加 needVolume 数量的该 token 对应 costTokens 中的ethVolume
              costTokens[_token].ethVolume = _add(costTokens[_token].ethVolume, needVolume)

              // 跳出循环
              break
            } else {
              // 如果该 overToken 中的 overEthVolume 少于或等于 needVolume

              // 增加 needVolume 数量的该 token 对应 costTokens 中的ethVolume
              costTokens[_token].ethVolume = costTokens[_token]._ethVolume

              // 删除 overTokens 中该 token 信息
              delete overTokens[_token]

              // 继续执行循环
            }
          }
        }
      }
      console.log('overTokens', overTokens)
      console.log('costTokens', costTokens)
      console.log('=============', Object.values(costTokens).map(item => {
        const count = item._count ? item.ethVolume / item._ethVolume * item._count : 0
        return Object.assign({}, item, {
          count,
          left: item._count - count
        })
      }))

      // 处理 costTokens 数据为 packageBountiesInfo 格式数据,并赋值
      this.packageBountiesInfo = Object.values(costTokens).map(item => {
        const count = item._count ? item.ethVolume / item._ethVolume * item._count : 0
        return Object.assign({}, item, {
          count,
          left: item._count - count
        })
      })
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

    initQuestions () {

    },

    // toggle question label
    toggleQuestion (index) {
      const descDom = document.querySelectorAll('.asked-questions-item .asked-questions-desc')[index]
      const textHeight = descDom.firstChild.offsetHeight
      const _askedQuestions = this.askedQuestions
      _askedQuestions[index].show = !_askedQuestions[index].show

      descDom.style = `height: ${_askedQuestions[index].show ? textHeight : 0}px;`
      this.askedQuestions = _askedQuestions
    },

    // 选择 bounty button 选项
    chooseBtnOption (volume) {
      this.optionBtnTab = volume
      // if (volume === -1) {
      //   this.bountySliderModel = 1000
      // } else {
      //   console.log('===== chooseBtnOption', _strip(parseFloat((volume - 0.1) / this.totalBountyVolume) * 100))
      //   this.bountySliderModel = _strip((volume - 0.1) / this.totalBountyVolume * 100)
      // }
    },

    // 初始化组件数据
    initPackageBounty () {
      this.getBountyAssets()
      this.initbountyBtnBox()
    },

    // 获取用户可打包 token 数据
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

    // 初始化 btn box
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
      this.$confirm('<p class="logout-tip-text">The action of making Bounty Chest can not be rollbacked. Are you sure to continue?</p>', 'Bounty Chest', {
        confirmButtonText: 'YES',
        dangerouslyUseHTMLString: true,
        showCancelButton: false,
        center: true,
        customClass: 'lordless-logout-confirm',
        confirmButtonClass: 'logout-confirm-btn'
      }).then(() => {
        this.doPackageBounty()
      })
    },

    // 打包
    async doPackageBounty () {
      this.packageLoading = true
      try {
        let volume = this.currentVolume
        if (volume === this.totalBountyVolume) volume = -1
        else volume = formatDecimal(volume)

        const res = await packageBounty({ volume })
        if (res.code === 1000 && res.data) this.$router.push('/owner/bounty/chests')
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
    this.optionBtnTab = -1
    this.bountySliderModel = 100
    this.loading = true
    this.bountySlider = false
    this.askedQuestions = this.askedQuestions.map(item => {
      item.show = false
      return item
    })
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
    /deep/ {
      .el-slider__runway, .el-slider__bar {
        height: 8px;
      }
      .el-slider__bar {
        background-color: #0079FF;
      }
      .el-slider__button {
        position: relative;
        width: 32px;
        height: 32px;
        background-color: #0079FF;
        border: 4px solid #f8f8f8;
        box-sizing: border-box;
        &::before {
          content: '|||';
          position: absolute;
          top: 40%;
          left: 50%;
          transform: translate(-50%, -50%) scale(.5);
          line-height: 10px;
          font-size: 24px;
          font-weight: bolder;
          color: #fff;
        }
      }
      .el-slider__runway {
        &.disabled {
          .el-slider__bar {
            background-color: #c0c4cc;
          }
          .el-slider__button {
            background-color: #c0c4cc;
          }
        }
      }
    }
  }

  /**
   *  bounty-chest-empty  -- begin
   */
  .bounty-chest-empty {
    @include viewport-unit(min-height, 100vh, 50px);
    >h2 {
      margin-top: 32px;
      font-size: 20px;
    }
    >p {
      margin-top: 12px;
      font-size: 16px;
    }
  }
  .chest-empty-icon {
    width: 200px;
    height: 200px;
  }
  .chest-empty-btn {
    margin-top: 32px;
    padding: 12px 24px;
  }
  /**
   *  bounty-chest-empty  -- end
   */

  .package-bounty-header {
    padding: 54px 24px 20px;
    background-color: #0079FF;
    font-size: 16px;
    color: #fff;
    >p {
      &:not(:first-of-type) {
        margin-top: 6px;
      }
    }
    // >h1 {
    //   margin-top: 4px;
    //   font-size: 36px;
    // }
  }
  // .bounty-chest-eth-icon {
  //   margin-right: 6px;
  //   width: 20px;
  //   height: 36px;
  //   fill: #fff;
  // }
  .package-bounty-container {
    // padding-top: 44px;
    padding-bottom: 80px;
    z-index: 1;
  }
  .package-bounty-desc {
    margin-top: 12px;
    font-size: 16px;
    color: #555;
  }

  .package-bounty-candies-info {
    margin-top: 24px;
    >h3 {
      font-size: 16px;
    }
    .package-info-icon {
      margin-right: 6px;
      width: 20px;
      height: 20px;
    }
  }

  // package-bounty-options
  .package-bounty-options {

  }
  .translate-slider-box {
    color: #999;
    fill: #999;
  }
  .translate-slider-icon {
    margin-right: 6px;
    width: 16px;
    height: 16px;
  }
  .bounty-options-box {
    margin-top: 18px;
    height: 44px;
  }
  .bounty-option-btns {

  }
  .bounty-option-btn {
    padding: 12px 0;
    font-size: 16px;
    color: #555;
    box-shadow: 1px 2px 4px 0 rgba(0, 0, 0, 0.3);
    &[disabled] {
      box-shadow: 1px 2px 4px 0 rgba(0, 0, 0, 0.1);
    }
    &:not(:first-of-type) {
      margin-left: 8px;
    }
  }

  // package-bounty-bounties
  .package-bounty-bounties {
    // margin-top: 32px;
  }

  // package-bounty-cost
  .package-bounty-cost {
    // margin-top: 40px;
  }
  .package-bounties-cnt-box {
    margin-top: 18px;
    padding: 18px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.12);
  }
  .package-bounty-candies-box {
    &:not(:first-of-type) {
      margin-top: 24px;
    }
  }
  .bounties-box-title {
    margin-bottom: 10px;
    font-size: 14px;
    color: #555;
  }
  .bounties-box-title-icon {
    margin-right: 6px;
    width: 16px;
    height: 16px;
    fill: #0079FF;
  }
  .bounty-candies-item {
    font-size: 16px;
    color: #555;
    &:not(:first-of-type) {
      margin-top: 6px;
    }
    &.is-gray {
      color: #bbb;
    }
  }
  .bounty-candy-symbol {
    color: #777;
  }
  // .bounty-candies-item {
  //   margin-top: 18px;
  //   padding: 18px;
  //   font-size: 16px;
  //   color: #555;
  //   background-color: #fff;
  //   border-radius: 5px;
  //   &.bounty {
  //     box-shadow: 0 0 8px 0 rgba(0, 121, 255, 0.45);
  //     transition: all .3s, visibility 0s 0s;
  //     .bounty-candy-icon {
  //       width: 20px;
  //       height: 20px;
  //     }
  //   }
  //   &.cost {
  //     color: #005736;
  //     box-shadow: 0 0 8px 0 rgba(0, 193, 167, 1);
  //     .bounty-candy-icon {
  //       width: 24px;
  //       height: 24px;
  //     }
  //   }
  //   &.is-hide {
  //     opacity: 0;
  //     visibility: hidden;
  //     height: 0;
  //     padding: 0;
  //     margin: 0;
  //     transform: scale(0);
  //     transform-origin: center;
  //     transition: all .3s, visibility 0s .3s;
  //   }
  // }
  // .bounty-candy-symbol {
  //   margin-left: 10px;
  // }
  // .bounty-candy-icon {
  //   fill: #0079FF;
  // }

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

  /**
   *  chest-asked-box   -- begin
   */
  .chest-asked-box {
    margin-top: 24px;
  }
  .chest-asked-title {
    margin: 32px 0;
    font-size: 16px;
    color: #999;
  }
  .chest-asked-questions {
    margin-top: 18px;
  }
  .asked-questions-item {
    &:not(:first-of-type) {
      margin-top: 24px;
    }
    &.is-show {
      .asked-questions-desc {
        visibility: visible;
        transform: scaleY(1);
        transition: all .3s, visibility 0s 0s;

      }
      .asked-title-triangle {
        svg {
          transform: rotate(-90deg);
        }
      }
    }
  }
  .asked-questions-title {
    padding-right: 16px;
    font-size: 16px;
  }
  .asked-title-triangle {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    fill: #777;
    svg {
      transition: all .3s;
    }
  }
  .asked-questions-desc {
    margin-top: 8px;
    font-size: 16px;
    color: #999;
    height: 0px;
    visibility: hidden;
    transform: scaleY(0);
    transform-origin: top;
    transition: all .3s, visibility 0s .3s;
    overflow: hidden;
  }
  /**
   *  chest-asked-box   -- end
   */
</style>
