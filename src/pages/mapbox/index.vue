<template>
  <div class="ld-lbs-main">
    <Mapbox
      ref="lordMap"
      :scrollZooms="mapScrollZooms"
      @markerClick="openDetail"
      @load="mapLoad"/>
    <div class="lbs-search">
      <AutoComplete
        placeholder="Search location or buiding in LORDLESS"
        @handleSearch="handleSearch"
        @handleSelect="handleSelect">
      </AutoComplete>
    </div>
    <div class="lbs-tx-box font-bold">
      <TxCarousel
        ref="txCarousel"
        :direction="-1"
        @logoEvt="$router.push('/market')"></TxCarousel>
    </div>
    <div class="lbs-user-box" :class="{ 'shadow': userInfo.address }">
      <user-avatar :scale="9"></user-avatar>
      <!-- <Blockies
        radius="6px"
        :seed="userInfo.address"
        :scale="9"
        @click.native="$router.push('/login')"></Blockies> -->
    </div>
    <div class="lbs-control-box" v-if="mapControl">
      <div class="d-flex col-flex lbs-control-container">
        <span class="inline-block color-secondary"
          :class="{ 'is-disabled': isMapMaxZoom }"
          @click.stop="changeMapZoom('plus', isMapMaxZoom)">
          <svg>
            <use xlink:href="static/svg/icon.svg#icon-search-plus"/>
          </svg>
        </span>
        <span class="inline-block color-secondary"
          :class="{ 'is-disabled': isMapMinZoom }"
          @click.stop="changeMapZoom('minus', isMapMinZoom)">
          <svg>
            <use xlink:href="static/svg/icon.svg#icon-search-minus"/>
          </svg>
        </span>
        <span class="inline-block color-secondary"
          @click.stop="$router.push('/market')">
          <svg>
            <use xlink:href="static/svg/icon.svg#icon-map"/>
          </svg>
        </span>
      </div>
    </div>
    <detail-dialog
      ref="ldbDetail"
      theme="light"
      :ldbId="ldbDetail._id"
      @close="dialogClose"
    ></detail-dialog>
  </div>
</template>

<script>
import Mapbox from '@/components/lbs/mapbox'
import DetailDialog from '@/components/reuse/detailDialog'
import TxCarousel from '@/components/reuse/txCarousel'
import AutoComplete from '@/components/stories/autoComplete'
import Blockies from '@/components/stories/blockies'
import UserAvatar from '@/components/reuse/userAvatar'
// import { getGoogleInfos, getChainLdbs } from 'api'
import { historyState } from 'utils/tool'
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

      coordsPath: null,

      // ldb dialog 显示控制
      ldbDialog: false,
      ldbDetail: {},

      // map control
      mapControl: false,

      // lordMap options
      mapScrollZooms: [10, 14, 16]
    }
  },
  components: {
    Mapbox,
    AutoComplete,
    TxCarousel,
    DetailDialog,
    Blockies,
    UserAvatar
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
      return this.$root.$children[0].ldbs.slice(0, 3)
    }
  },
  methods: {
    ...mapActions('ldb', [
      actionTypes.LDB_GET_HISTORY_SEARCH_LDBS,
      actionTypes.LDB_SET_HISTORY_SEARCH_LDB
    ]),

    async getLdbs () {
      const ldbs = this.$root.$children[0].ldbs
      this.ldbs = ldbs
      this.$refs.lordMap.createMarkers([ldbs[0], ldbs[1]])
      // const result = await getChainLdbs({ extensions: 'base' })
      // if (result.code === 1000) {
      //   const ldbs = result.data.list
      //   console.log('ldbs', ldbs)
      //   this.$refs.lordMap.createMarkers(ldbs)
      // }
    },

    /**
     * 重组ldb搜索结果
     * 根据接口返回的ldb数据及本地ldb数据返回新的数组
     * 主体为 接口数据
     */
    restructurSearchLdbs (ldbs, localLdbs, query) {
      ldbs = ldbs.filter(item => item.name.zh.toLowerCase().indexOf(query.toLowerCase()) !== -1)
      // localLdbs = localLdbs.filter(item => item.name.zh.toLowerCase().indexOf(query.toLowerCase()) !== -1)
      // const localLdbIds = localLdbs.map(item => item._id)

      // const b = []
      // const c = []

      // 存在于数据库中，但是没有记录的
      // const a = ldbs.filter((item) => {
      //   // 没有存在于数据库中的
      //   if (!item._id) b.push(item)

      //   const sIndex = localLdbIds.indexOf(item._id)

      //   // 存在于记录中的
      //   if (item._id && sIndex !== -1) c.push(localLdbs[sIndex])

      //   return item._id && sIndex === -1
      // })

      // return [].concat(c, a, b)
      return ldbs
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
      // let result = []
      const input = string.trim()
      // if (input) {
      //   result = await getGoogleInfos({ input })
      //   if (result.code === 1000) result = result.data.list
      // }
      this.$nextTick(() => cb(this.filterComplete(input, this.ldbs)))
    },

    /**
     * auto complete select event
     */
    handleSelect (item) {
      if (item._id) {
        // 如果是已上链信息，存储在记录中
        this[actionTypes.LDB_SET_HISTORY_SEARCH_LDB](item)

        // 调整地图显示视图
        const { lat, lng } = item.chainSystem
        this.$refs.lordMap.flyToCoords({ center: [lng, lat], zoom: this.mapScrollZooms[this.mapScrollZooms.length - 1] }, () => {
          historyState(`${this.$route.path}?coords=${[lng, lat].toString()}`)
        })
      }
    },

    /**
     *  map load event
     */
    mapLoad () {
      const coords = this.$route.query.coords

      this.getLdbs()

      this.initMapControl()

      this.$refs.txCarousel.init()
      if (coords) {
        this.$refs.lordMap.flyToCoords({ center: coords.split(','), zoom: this.mapScrollZooms[this.mapScrollZooms.length - 1] })
      }
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
      this.$refs.lordMap[`${direction}MapZoom`](undefined, undefined, () => {
        console.log('------- map plus', direction)
      })
    },

    /**
     * 打开详情信息页
     */
    openDetail (info) {
      this.$refs.ldbDetail.open()
      this.$nextTick(() => {
        this.ldbDetail = info
        const { lat, lng } = info.chainSystem
        this.coordsPath = `${this.$route.path}?coords=${[lng, lat].toString()}`
        historyState(`/ldb/${info._id}`)
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
  },
  beforeDestroy () {
    this.$refs.txCarousel.destroy()
  }
}
</script>

<style lang="scss">
  @import '@/assets/stylus/mixin/class_mixin.scss';
  .ld-lbs-main {
    position: relative;
    height: 100vh;
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
    @include padding(-1, 20px, 1, -2);
  }
  .lbs-user-box {
    position: absolute;
    right: 60px;
    top: 50px;
    width: 54px;
    height: 54px;
    border-radius: 6px;
    color: #fff;
    white-space: nowrap;
    font-weight: bold;
    cursor: pointer;
    &.shadow {
      box-shadow: 2px 4px 8px 0 rgba(12, 0, 42, .5);
    }
  }
  .lbs-control-box {
    position: absolute;
    bottom: 50px;
    right: 60px;
  }
  .lbs-control-container {
    background-color: #fff;
    border-radius: 10px;
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
        fill: #ccc;
        stroke: #ccc;
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
