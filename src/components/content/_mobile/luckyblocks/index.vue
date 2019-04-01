<template>
  <div class="lordless-luckyblocks-box">
    <lordless-tabs-navbar
      :originTab="currentTab"
      :tabs="luckyBlocksTabs"
      @changeTab="tabChange"/>
    <transition name="ld-hide-fade" mode="out-in" @after-enter="afterEnter">
      <promotions-skeletion class="luckyblocks-skeletion-box" v-if="loading"/>
      <div v-else-if="currentTab === 'luckyblocks'" class="luckyblocks-tab-content">
        <ul class="d-flex f-wrap f-align-start promotions-list">
          <li class="promotions-item"
            v-for="(item, index) of luckyblocks" :key="index">
            <figure>
              <figcaption
                :style="`background-image: url(${ossOrigin + item.banners[0]})`"
                @click.stop="$router.push(`/project/${item.project._id}`)"/>
              <promotion-lucky
                class="promotion-item-info"
                :info="item"/>
            </figure>
          </li>
        </ul>
      </div>
      <div v-else class="records-tab-content">
        <div v-if="!lbRecords.total" class="d-flex col-flex f-auto-center records-empty-box">
          <span class="inline-block line-height-0 records-empty-icon">
            <svg>
              <use xlink:href="#icon-chest-empty"/>
            </svg>
          </span>
          <h2>You have no records.</h2>
          <lordless-btn class="records-empty-btn" theme="blue-linear" @click="currentTab = 'luckyblocks'">Try your luck</lordless-btn>
        </div>
        <div v-else class="records-cnt-container" id="mobile-lb-records-box">
          <ul class="lb-records-ul">
            <li class="lb-records-item" v-for="(promotion, index) of lbRecords.list" :key="index">
              <mobile-quest-promotion
                v-if="promotion.airdrop"
                :info="promotion"/>

              <mobile-quest-lucky
                v-else-if="promotion.luckyblock"
                :info="promotion"/>
            </li>
          </ul>
          <div class="text-center quest-item-loadmore">
            <p v-if="loadMoreLoading && !lbRecords.noMore">
              <i class="el-icon-loading"></i>
            </p>
            <p v-else-if="lbRecords.noMore">AH! no more Records~</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import PromotionsSkeletion from '@/components/skeletion/project/promotions'

import PromotionLucky from '@/components/reuse/card/promotion/lucky'
import MobileQuestPromotion from '@/components/reuse/_mobile/card/quests/promotion'
import MobileQuestLucky from '@/components/reuse/_mobile/card/quests/lucky'

import { historyState } from 'utils/tool'
import { getAirdropUsers } from 'api'
import { promotionsMixins, initLoadingMixins } from '@/mixins'
export default {
  name: 'luckyblocks-content-component',
  mixins: [ promotionsMixins, initLoadingMixins ],
  data: (vm) => {
    let type = vm.$route.query.type
    const types = [ 'luckyblocks', 'records' ]
    type = types.includes(type) ? type : 'luckyblocks'
    return {
      currentTab: type,
      rendered: true,
      loadMoreLoading: false,
      luckyBlocksTabs: [
        {
          label: 'Lucky Blocks',
          name: 'luckyblocks'
        }, {
          label: 'Records',
          name: 'records'
        }
      ],

      lbRecords: {
        pn: 1,
        ps: 10,
        list: [],
        total: 0,
        noMore: false
      }
    }
  },
  watch: {
    currentTab (val) {
      val && this.initLuckyBlocks(val)
    }
  },
  components: {
    PromotionLucky,
    MobileQuestPromotion,
    MobileQuestLucky,

    PromotionsSkeletion
  },
  methods: {
    afterEnter () {
      this.currentTab === 'records' && this.scrollListenerFunc()
    },

    tabChange (e) {
      console.log('------- tab change', e)
      this.currentTab = e
      historyState(`/lb?type=${e}`)
    },

    async initLuckyBlocks (currentTab = this.currentTab) {
      this.loading = true
      if (currentTab === 'luckyblocks') {
        await this.getAirdropsHandle()
      } else {
        await this.initRecords()
      }
      this.loading = false
    },

    async initRecords (pn = 1) {
      const { list, ps, total } = await this.getLBRecordsMethod({ pn })
      this.lbRecords = {
        pn, ps, list, total, noMore: total < ps
      }
    },

    /**
     * 获取 task 基础事件
     */
    async getLBRecordsMethod ({ pn = this.lbRecords.pn, ps = this.lbRecords.ps } = {}) {
      // const params = { pn, ps, type: _type, status: _status }
      const params = { pn, ps, type: 'promotion' }

      let data = null
      try {
        const res = await getAirdropUsers(params)
        if (res.code === 1000 && res.data) {
          data = res.data
        }
      } catch (err) {}

      return data
    },

    // 获取更多 tasks
    async loadMoreTasks (cb) {
      this.loadMoreLoading = true
      const info = this.lbRecords
      const pn = info.pn + 1
      const { list, ps, total } = await this.getLBRecordsMethod({ pn })

      let noMore = false
      if (list && list.length < ps) {
        noMore = true
      }
      this.lbRecords = {
        list: info.list.concat(list),
        pn,
        ps,
        total,
        noMore
      }
      this.loadMoreLoading = false
      return cb && cb()
    },

    /**
     * scroll 监听事件
     */
    scrollListenerFunc ({ bool = false, bottom = 80, pHeight = document.body.offsetHeight, chooseTab = false } = {}) {
      this.scrollHandle && document.removeEventListener('scroll', this.scrollHandle)
      this.scrollHandle = null

      console.log(' --- scroll')
      const box = document.getElementById('mobile-lb-records-box')
      let bHeight = box ? box.offsetHeight : 0
      // 如果 bHeight 不存在或者 bHeight - bottom 小于 pHeight, return
      if (!bHeight || bHeight - bottom < pHeight) return

      // const _currentTab = this.currentTab

      // chooseTab 根据已有 scrollTop 值做变化
      if (chooseTab) {
        // 将 scrollTop 修改为当前 tab 的scrollTop值
        const _cScrollTop = this.lbRecords.scrollTop || 0
        console.log('_cScrollTop', _cScrollTop)
        scrollTo(_cScrollTop)
      }

      const handleFunc = () => {
        if (bool || this.lbRecords.noMore) return
        if (!bHeight) bHeight = box.offsetHeight
        const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop

        // 如果页面上滑到达指定条件位置
        // 读取更多数据
        if (scrollTop + pHeight + bottom > bHeight) {
          bool = true
          this.loadMoreTasks(() => {
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
    await this.initLuckyBlocks()

    this.currentTab === 'records' && this.scrollListenerFunc()
  },
  mounted () {
    this.$nextTick(async () => {
      await this.initLuckyBlocks()
      this.rendered = true
    })
    // loopCandyClamied()
  }
}
</script>

<style lang="scss" scoped>
  .lordless-luckyblocks-box {
    padding-top: 44px;
    padding-bottom: 50px;
  }
  .luckyblocks-skeletion-box {
    // padding: 0 20px;
    // box-shadow: border-box;
  }
  .promotions-list {
    // margin: -30px -12px 0;
  }
  .promotions-item {
    margin: 30px 20px 0;
    width: 348px;
    box-shadow: 0 0 10px 3px rgba(222, 222, 222, 1);
    border-radius: 5px;
    overflow: hidden;
    transition: all .35s;
    // &:not(:first-of-type) {
    //   margin-left: 24px;
    // }
    &:hover {
      cursor: pointer;
      box-shadow: 0 0 10px 6px rgba(222, 222, 222, 1);
    }
    figcaption {
      width: 100%;
      height: 135px;
      @include bg-size();
    }
  }
  .promotion-item-info {
    padding: 20px;
    cursor: default;
  }

  /**
   *  records-tab-content  -- begin
   */
  .records-tab-content {

  }
  .records-empty-box {
    // padding: 0 48px;
    @include viewport-unit(min-height, 100vh, 94px);
    >h2 {
      margin-top: 32px;
      font-size: 20px;
      color: $--main-color;
    }
  }
  .records-empty-icon {
    width: 200px;
    height: 200px;
  }
  .records-empty-btn {
    margin-top: 32px;
    width: 280px;
    height: 42px;
    line-height: 42px;
  }
  .quest-item-loadmore {
    margin-top: 20px;
    font-size: 16px;
    color: #999;
  }
  /**
   *  records-tab-content  -- end
   */

  // records-cnt-container
  .records-cnt-container {
    padding: 24px 20px 20px;
  }
  .lb-records-item {
    border-radius: 5px;
    box-shadow: 0 0 8px 3px rgba(0, 0, 0, .1);
    &:not(:first-of-type) {
      margin-top: 16px;
    }
  }
</style>
