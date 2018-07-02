<template>
  <div class="ld-lbs-main">
    <Mapbox
      ref="myMap"
      @markerClick="openDetail"
      @load="mapLoad"/>
    <div class="lbs-search">
      <AutoComplete
        placeholder="Search location or buiding in LORDLESS"
        @handleSearch="handleSearch"
        @handleSelect="handleSelect">
      </AutoComplete>
    </div>
    <div class="lbs-tx-box">
      <TxCarousel
        ref="txCarousel"
        @logoEvt="$router.push('/market')"></TxCarousel>
    </div>
    <detail-dialog
      ref="ldbDetail"
      theme="default"
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
import { getPoiInfos, getChainLdbs } from 'api'
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
      ldbDetail: {}
    }
  },
  components: {
    Mapbox,
    AutoComplete,
    TxCarousel,
    DetailDialog
  },
  computed: {
    ...mapState('ldb', [
      'historySearchLdbs'
    ])
  },
  methods: {
    ...mapActions('ldb', [
      actionTypes.LDB_GET_HISTORY_SEARCH_LDBS,
      actionTypes.LDB_SET_HISTORY_SEARCH_LDB
    ]),

    async getLdbs () {
      const result = await getChainLdbs({ extensions: 'base' })
      if (result.code === 1000) {
        const ldbs = result.data.list
        console.log('ldbs', ldbs)
        this.$refs.myMap.createMarkers(ldbs)
      }
    },

    /**
     * 重组ldb搜索结果
     * 根据接口返回的ldb数据及本地ldb数据返回新的数组
     * 主体为 接口数据
     */
    restructurSearchLdbs (ldbs, localLdbs, query) {
      localLdbs = localLdbs.filter(item => item.name.toLowerCase().indexOf(query.toLowerCase()) !== -1)
      const localLdbIds = localLdbs.map(item => item._id)

      const b = []
      const c = []

      // 存在于数据库中，但是没有记录的
      const a = ldbs.filter((item) => {
        // 没有存在于数据库中的
        if (!item._id) b.push(item)

        const sIndex = localLdbIds.indexOf(item._id)

        // 存在于记录中的
        if (item._id && sIndex !== -1) c.push(localLdbs[sIndex])

        return item._id && sIndex === -1
      })

      return [].concat(c, a, b)
    },

    /**
     * filter Complete list
     * @param {String} query
     */
    filterComplete (query, list) {
      const localLdbs = this.historySearchLdbs
      return query ? this.restructurSearchLdbs(list, localLdbs, query) : localLdbs
    },

    async handleSearch (string = '', cb) {
      let result = []
      const query = string.trim()
      if (query) {
        result = await getPoiInfos({ query })
        if (result.code === 1000) result = result.data.list
      }
      this.$nextTick(() => cb(this.filterComplete(query, result)))
    },

    handleSelect (item) {
      if (item._id) {
        // 如果是已上链信息，存储在记录中
        this[actionTypes.LDB_SET_HISTORY_SEARCH_LDB](item)

        // 调整地图显示视图
        const { lat, lon } = item.chainSystem
        this.$refs.myMap.flyToCoords({ center: [lat, lon], zoom: 14 }, () => {
          console.log('this.$route', this.$route)
          historyState(`${this.$route.path}?coords=${[lat, lon].toString()}`)
        })
      }
    },

    /**
     *  map load event
     */
    mapLoad () {
      const coords = this.$route.query.coords
      this.getLdbs()
      this.$refs.txCarousel.init()
      if (coords) {
        this.$refs.myMap.flyToCoords({ center: coords.split(','), zoom: 14 })
      }
    },

    /**
     * 打开详情信息页
     */
    openDetail (info) {
      this.$refs.ldbDetail.open()
      this.$nextTick(() => {
        this.ldbDetail = info
        const { lat, lon } = info.chainSystem
        this.coordsPath = `${this.$route.path}?coords=${[lat, lon].toString()}`
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
    })
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
    top: 30px;
    left: 30px;
    width: 100%;
    max-width: 400px;
    @include padding(-1, 20px, 1, -2);
  }
  .lbs-tx-box {
    position: absolute;
    bottom: 50px;
    left: 50px;
    width: 100%;
    max-width: 750px;
    box-sizing: border-box;
    @include padding(-1, 20px, 1, -2);
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
