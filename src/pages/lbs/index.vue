<template>
  <div class="ld-lbs-main">
    <Mapbox
      ref="lordMap"
      :scrollZooms="mapScrollZooms"
      :mPitch="lbsMPitch"
      @imageMarkerClick="openDetail"
      @load="mapLoad"/>
    <div class="lbs-search">
      <AutoComplete
        placeholder="Search buidings in LORDLESS"
        @handleSearch="handleSearch"
        @handleSelect="handleSelect"
        @trend="handleSelect">
      </AutoComplete>
    </div>
    <div class="lbs-tx-box">
      <loop-task ref="loopTask"></loop-task>
      <!-- <TxCarousel
        ref="txCarousel"
        :direction="-1"
        @logoEvt="$router.push('/market')"></TxCarousel> -->
    </div>
    <div class="sm-hidden text-nowrap lbs-user-box">
      <!-- <user-avatar :scale="9" theme="dark" shadow loginText="Login" :showInfo="false"></user-avatar> -->
      <header-tip></header-tip>
    </div>
    <div class="sm-hidden lbs-control-box" v-if="mapControl">
      <div class="d-flex col-flex lbs-control-container">
        <!-- <span class="inline-block color-secondary"
          :class="{ 'is-disabled': isMapMaxZoom }"
          @click.stop="changeMapZoom('plus', isMapMaxZoom)">
          <svg>
            <use xlink:href="#icon-search-plus"/>
          </svg>
        </span>
        <span class="inline-block color-secondary"
          :class="{ 'is-disabled': isMapMinZoom }"
          @click.stop="changeMapZoom('minus', isMapMinZoom)">
          <svg>
            <use xlink:href="#icon-search-minus"/>
          </svg>
        </span> -->
        <span v-if="!isMapMinZoom" class="inline-block color-secondary"
          @click.stop="changeMapZoom('minus', isMapMinZoom)">
          <svg>
            <use xlink:href="#icon-ldb-map"/>
          </svg>
        </span>
      </div>
    </div>
    <detail-dialog
      v-model="detailModel"
      theme="light"
      :ldbId="ldbDetail._id"
      @close="dialogClose"
    ></detail-dialog>
  </div>
</template>

<script>
import Mapbox from '@/components/content/lbs/mapbox'
import DetailDialog from '@/components/reuse/dialog/ldb/detail'
import HeaderTip from '@/components/reuse/headerTip'
// import TxCarousel from '@/components/reuse/txCarousel'
import LoopTask from '@/components/reuse/loopTask'
import AutoComplete from '@/components/reuse/autoComplete'
import Blockies from '@/components/stories/blockies'
// import UserAvatar from '@/components/reuse/userAvatar'
import { getAutoLdbs, getChainLdbs } from 'api'
import { historyState, transferCoords } from 'utils/tool'
import { mapActions, mapState } from 'vuex'
import { actionTypes } from '@/store/types'
export default {
  data: () => {
    return {
      emptyList: [
        {
          empty: 1,
          name: '没有记录'
        }
      ],

      ldbs: [],

      coordsPath: null,

      coordQuery: null,

      // ldb dialog 显示控制
      detailModel: false,
      ldbDetail: {},

      // map control
      mapControl: false,

      // lordMap options
      lbsMPitch: 60,
      mapScrollZooms: [12, 17]
    }
  },
  components: {
    Mapbox,
    AutoComplete,
    LoopTask,
    // TxCarousel,
    DetailDialog,
    Blockies,
    // UserAvatar,
    HeaderTip
  },
  computed: {
    ...mapState('ldb', [
      'historySearchLdbs'
    ]),
    ...mapState('user', [
      'userInfo'
    ]),
    isMapMaxZoom () {
      return this.$refs.lordMap.isMaxZoom
    },
    isMapMinZoom () {
      return this.$refs.lordMap.isMinZoom
    },
    trendings () {
      return this.ldbs.slice(0, 3)
    }
  },
  methods: {
    ...mapActions('ldb', [
      actionTypes.LDB_GET_HISTORY_SEARCH_LDBS,
      actionTypes.LDB_SET_HISTORY_SEARCH_LDB
    ]),

    async getLdbs () {
      const result = await getChainLdbs({ extensions: 'base', offset: -1 })
      if (result.code === 1000) {
        const ldbs = result.data.list
        this.ldbs = ldbs
        console.log('ldbs', ldbs)
        this.$refs.lordMap.createImageMarkers(ldbs)
        // this.$refs.lordMap.createPointLayer(ldbs)
        this.$refs.lordMap.createPointMarkers(ldbs)
        // this.$refs.lordMap.createMarkers(this.test_ldbs)
        this.$nextTick(() => this.flyToLdb())
      }
    },

    /**
     * 重组ldb搜索结果
     * 根据接口返回的ldb数据及本地ldb数据返回新的数组
     * 主体为 接口数据
     */
    restructurSearchLdbs (ldbs, localLdbs, query) {
      localLdbs = localLdbs.filter(item => item.name.zh.toLowerCase().indexOf(query.toLowerCase()) !== -1)
      const localLdbIds = localLdbs.map(item => item._id)

      const b = []
      const c = []
      // 存在于数据库中，但是没有记录的
      const a = ldbs.filter((item) => {
        // 没有存在于数据库中的
        if (!item.id) b.push(item)

        const sIndex = localLdbIds.indexOf(item._id)

        // 存在于记录中的
        if (item.id && sIndex !== -1) c.push(localLdbs[sIndex])

        // 数据存在并且本地没有记录
        return item.id && sIndex === -1
      })

      const result = [].concat(c, a, b)
      if (result.length) result[result.length - 1].last = 1

      return result
    },

    /**
     * filter Complete list
     * @param {String} query
     */
    filterComplete (query, list) {
      const localLdbs = this.historySearchLdbs
      return query ? this.restructurSearchLdbs(list, localLdbs, query) : [].concat([{
        trending: 1,
        list: this.trendings
      }], localLdbs)
    },

    /**
     * auto complete search event
     */
    async handleSearch (string = '', cb) {
      let result = []
      const search = string.trim()
      if (search) {
        result = await getAutoLdbs({ search })
        if (result.code === 1000) result = result.data.list
      }
      this.$nextTick(() => cb(this.filterComplete(search, result)))
    },

    /**
     * auto complete select event
     */
    handleSelect (item) {
      if (item.id) {
        // 调整地图显示视图
        this.flyToLdb(item.id)
        // 如果是已上链信息，存储在记录中
        this[actionTypes.LDB_SET_HISTORY_SEARCH_LDB](item)
      }
    },

    /**
     *  map load event
     */
    mapLoad () {
      this.getLdbs()

      this.initMapControl()

      this.$refs.loopTask.init()
      // this.$refs.txCarousel.init()
      // if (ldb) {
      //   this.flyToLdb(ldb)
      //   this.coordQuery = coords
      //   this.$refs.lordMap.flyToCoords({ center: coords.split(','), pitch: this.lbsMPitch, zoom: this.mapScrollZooms[this.mapScrollZooms.length - 1] })
      // }
    },

    flyToLdb (ldbId = this.$route.query.ldb, ldbs = this.ldbs) {
      if (!ldbId) return
      const ldb = ldbs.filter(item => item._id === parseInt(ldbId))[0]
      console.log('ldb', ldb)
      if (!ldb) return
      let { lng, lat } = ldb.chain
      lng = transferCoords(lng)
      lat = transferCoords(lat)
      this.$refs.lordMap.flyToCoords({ center: [lng, lat], pitch: this.lbsMPitch, zoom: this.mapScrollZooms[this.mapScrollZooms.length - 1] }, () => {
        historyState(`${this.$route.path}?tavern=${ldbId}`)
      })
    },

    /**
     * init map control
     */
    initMapControl () {
      if (!this.mapControl) this.mapControl = true
    },

    /**
     * change map zoom
     * @param {String} direction zoom方向，放大或缩小。'plus' or 'minus'
     */
    changeMapZoom (direction = 'plus', disabled = false) {
      if (disabled) return
      this.$refs.lordMap[`${direction}MapZoom`](undefined, undefined)
    },

    /**
     * 打开详情信息页
     */
    openDetail (info) {
      this.detailModel = true
      this.$nextTick(() => {
        this.ldbDetail = info
        const { id } = info

        // const coords = [transferCoords(lng), transferCoords(lat)].toString()
        // this.coordQuery = coords

        this.coordsPath = `${this.$route.path}?tavern=${id}`
        historyState(`/tavern/${info.id}`)
      })
    },

    /**
     * 对话框关闭后触发
     */
    dialogClose () {
      historyState(this.coordsPath)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this[actionTypes.LDB_GET_HISTORY_SEARCH_LDBS]()
      this.$refs.lordMap.init()
    })
  }
}
</script>

<style lang="scss">
  @import '@/assets/stylus/mixin/index.scss';
  .ld-lbs-main {
    position: relative;
    @include viewport-unit(height, 100vh);
  }
  .lbs-search {
    position: absolute;
    top: 50px;
    left: 60px;
    width: 100%;
    max-width: 400px;
    @include padding(-1, 20px, 1, -2);
  }
  .lbs-tx-box {
    position: absolute;
    bottom: 50px;
    left: 60px;
    width: 100%;
    max-width: 750px;
    box-sizing: border-box;
    z-index: 2;
    @include padding(-1, 20px, 1, -2);
  }
  .lbs-user-box {
    position: absolute;
    right: 60px;
    top: 50px;
    // width: 54px;
    // height: 54px;
    // border-radius: 6px;
    // color: #fff;
    // cursor: pointer;
    // &.shadow {
    //   box-shadow: 2px 4px 8px 0 rgba(12, 0, 42, .5);
    // }
  }
  .lbs-control-box {
    position: absolute;
    bottom: 50px;
    right: 60px;
    box-shadow: 2.5px 5px 20px 0 rgba(0, 0, 0, .25);
  }
  .lbs-control-container {
    background-color: #fff;
    border-radius: 10px;
    overflow: hidden;
    >span {
      position: relative;
      cursor: pointer;
      @include padding(-1, 12px, 1);
      &:not(:first-of-type) {
        &::before {
          content: '';
          position: absolute;
          left: 15%;
          top: 0;
          width: 70%;
          height: 0px;
          border-top: 1px solid #ccc;
        }
      }
      &.is-disabled {
        cursor: no-drop;
      }
    }
    svg {
      width: 30px;
      height: 30px;
    }
  }
  @media screen and (max-width: 768px) {
    .lbs-search {
      left: 0;
      box-sizing: border-box;
    }
    .lbs-tx-box {
      left: 0;
    }
  }
</style>
