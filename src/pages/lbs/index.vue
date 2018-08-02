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
    <div class="sm-hidden lbs-user-box text-nowrap font-bold" :class="{ 'shadow': userInfo.address }">
      <user-avatar :scale="9"></user-avatar>
    </div>
    <div class="sm-hidden lbs-control-box" v-if="mapControl">
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
            <use xlink:href="static/svg/color_icon.svg#icon-map"/>
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
import Mapbox from '@/components/lbs/mapbox'
import DetailDialog from '@/components/reuse/ldb/detailDialog'
import TxCarousel from '@/components/reuse/txCarousel'
import AutoComplete from '@/components/stories/autoComplete'
import Blockies from '@/components/stories/blockies'
import UserAvatar from '@/components/reuse/userAvatar'
import { getGoogleInfos, getChainLdbs } from 'api'
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

      ldbs: [],

      coordsPath: null,

      // ldb dialog 显示控制
      detailModel: false,
      ldbDetail: {},

      // map control
      mapControl: false,

      // lordMap options
      lbsMPitch: 45,
      mapScrollZooms: [11, 17],
      test_ldbs: [
        {
          'id': 'rectLBJ0ALHhlp0WZ',
          'fields': {
            'ID': 'ChIJ29SwJftwsjURZYXg4jufPhY',
            'name': '东方明珠电视塔',
            // 'location': '121.4997553,31.2396889'
            'location': '121.49532238509406,31.241702767429803'
          },
          'createdTime': '2018-07-05T03:44:13.000Z'
        },
        {
          'id': 'rec0YeedlpId3MtSq',
          'fields': {
            'ID': 'ChIJ85jmoOVwsjURUwHkgtyDLj8',
            'name': '金茂大厦',
            'location': '121.5057491,31.2352515'
          },
          'createdTime': '2018-07-05T04:38:18.000Z'
        },
        {
          'id': 'recSL0ujeYQC5Ht96',
          'fields': {
            'ID': 'ChIJ33XthSl7sjURtfalYd9mk60',
            'name': '龙华寺',
            'location': '121.451911,31.173807'
          },
          'createdTime': '2018-07-05T04:38:34.000Z'
        },
        {
          'id': 'recef7w0aFojU21Gt',
          'fields': {
            'ID': 'ChIJ070dKpmLrTURKJlpICBYzKE',
            'name': '和平饭店',
            'location': '121.48507315515991,31.24102240732591'
          },
          'createdTime': '2018-07-05T04:39:09.000Z'
        },
        {
          'id': 'recDgvFOM35JTALYF',
          'fields': {
            'ID': 'ChIJVV1KHv5vsjURQgiHHZfGW3o',
            'name': '静安寺',
            'location': '121.445284,31.2235188'
          },
          'createdTime': '2018-07-05T04:40:33.000Z'
        },
        {
          'id': 'recm1Z61i3qBs4tXT',
          'fields': {
            'ID': 'ChIJt9Odl89zsjURydc6obzggtQ',
            'name': '复旦大学',
            'location': '121.5036178,31.2974197'
          },
          'createdTime': '2018-07-05T04:41:10.000Z'
        },
        {
          'id': 'recceUkFHEqsepZTo',
          'fields': {
            'ID': 'ChIJod1XLgdysjURK8vwJfZQYe8',
            'name': '上海马戏城',
            'location': '121.4479,31.3065'
          },
          'createdTime': '2018-07-05T04:42:38.000Z'
        },
        {
          'id': 'recGajqX95K3FO6aP',
          'fields': {
            'ID': 'ChIJM2MiazhlsjURxx2KHXj1pTk',
            'name': '上海交通大学',
            'location': '121.432841,31.201001'
          },
          'createdTime': '2018-07-05T05:12:04.000Z'
        },
        {
          'id': 'rec8ZOMQYUuVEQfin',
          'fields': {
            'ID': 'ChIJsQ6bJjBlsjURM3wPtmOeUGA',
            'name': '徐家汇天主教堂',
            'location': '121.436094,31.191284'
          },
          'createdTime': '2018-07-05T05:14:18.000Z'
        },
        {
          'id': 'recfhSSH7o8mDSumi',
          'fields': {
            'ID': 'ChIJu6e72yOJrTURNsOn_vdW-b8',
            'name': '上海老城隍庙',
            'location': '121.492507,31.225731'
          },
          'createdTime': '2018-07-05T05:14:50.000Z'
        },
        {
          'id': 'recSkQFHol3TnbZNS',
          'fields': {
            'ID': 'ChIJcTvO8GpwsjURs16N9rvf6YE',
            'name': 'China Art Museum',
            'location': '121.494769,31.18466999999999'
          },
          'createdTime': '2018-07-05T05:16:39.000Z'
        },
        {
          'id': 'rectq6qJsvDAXYWD9',
          'fields': {
            'ID': 'ChIJcT52JmpwsjURKKp8uyIQKjU',
            'name': '上海中心大厦',
            'location': '121.505618,31.233518'
          },
          'createdTime': '2018-07-05T05:17:50.000Z'
        },
        {
          'id': 'recxY19jRgTUzTwWD',
          'fields': {
            'ID': 'ChIJY2v3jN9vsjURmJotCOxoanY',
            'name': '玉佛禅寺',
            'location': '121.4451206,31.2413465'
          },
          'createdTime': '2018-07-05T05:18:55.000Z'
        },
        {
          'id': 'rec6G6BIaZ0XhlKEx',
          'fields': {
            'ID': 'ChIJwefaxOVwsjURO6kUnqabBCA',
            'name': '上海环球金融中心',
            'location': '121.5074394,31.2345644'
          },
          'createdTime': '2018-07-05T05:27:19.000Z'
        },
        {
          'id': 'rec74GCOc746cGNM2',
          'fields': {
            'ID': 'ChIJc4a6gwRwsjURyKjEddrSUkI',
            'name': '上海展览中心',
            'location': '121.451557,31.225728'
          },
          'createdTime': '2018-07-05T06:50:49.000Z'
        },
        {
          'id': 'rec3a0DMEswNgnVA0',
          'fields': {
            'ID': 'ChIJP7ayDeNvsjUReHQt9tYhLHU',
            'name': '马勒别墅饭店',
            'location': '121.456325,31.222899'
          },
          'createdTime': '2018-07-05T07:25:39.000Z'
        },
        {
          'id': 'recesycNBZgheBQSf',
          'fields': {
            'ID': 'ChIJnybRSp5vsjURkqx-Hh_u650',
            'name': '真如寺',
            'location': '121.401481,31.24912900000001'
          },
          'createdTime': '2018-07-05T07:28:30.000Z'
        },
        {
          'id': 'rec5f3pFCBRaE3NEN',
          'fields': {
            'ID': 'ChIJsRalGnVmsjUR1XZKw0l5K9k',
            'name': '凌空SOHO',
            'location': '121.351981,31.222034'
          },
          'createdTime': '2018-07-05T07:33:12.000Z'
        },
        {
          'id': 'recBlUsOwVRYdH5Ml',
          'fields': {
            'ID': 'ChIJzVG6SnVwsjUR5pA_VrzKlQw',
            'name': '中国共产党代表团驻泸办事处纪念馆',
            'location': '121.468354,31.21415699999999'
          },
          'createdTime': '2018-07-05T07:38:57.000Z'
        },
        {
          'id': 'rech5nVNZPVkjJSZB',
          'fields': {
            'ID': 'ChIJS1PJhCCJrTURX3p_BAEEIzw',
            'name': '鹤鸣楼',
            'location': '121.7002536,31.19150539999999'
          },
          'createdTime': '2018-07-05T07:55:03.000Z'
        },
        {
          'id': 'recaDeNWEstjaitDH',
          'fields': {
            'ID': 'ChIJ_Z5YLkF3sjURb5YrV89BCgQ',
            'name': '喜玛拉雅中心',
            'location': '121.562066,31.20842099999999'
          },
          'createdTime': '2018-07-05T09:09:19.000Z'
        },
        {
          'id': 'reciKzZ4TQYcPd8Lr',
          'fields': {
            'ID': 'ChIJFezOP0llsjURgZUzT-yILHw',
            'name': '武康大楼',
            'location': '121.438326,31.20448'
          },
          'createdTime': '2018-07-05T10:23:11.000Z'
        },
        {
          'id': 'reciG0RIpHoCuWOO2',
          'fields': {
            'ID': 'ChIJhdAI4UtwsjURVNYQjN6LIGk',
            'name': '上海锦江国际饭店',
            'location': '121.4716114,31.2336684'
          },
          'createdTime': '2018-07-05T10:57:18.000Z'
        },
        {
          'id': 'recS3FNlhYixHhWiY',
          'fields': {
            'ID': 'ChIJ1SgS6NdzsjURBSF-FMPluK0',
            'name': '上海国际设计中心',
            'location': '121.5014411,31.287065'
          },
          'createdTime': '2018-07-05T11:03:58.000Z'
        },
        {
          'id': 'recY3NPv0ulPtE3cT',
          'fields': {
            'ID': 'ChIJA82k2VlwsjURRL3PSQJWb3c',
            'name': 'D&D SOHO',
            'location': '121.48309110672122,31.24049921038716'
          },
          'createdTime': '2018-07-05T11:07:32.000Z'
        },
        {
          'id': 'recJyjBjOVOv2VTa1',
          'fields': {
            'ID': 'ChIJUc4JPXVwsjURpcgj1QNyf5I',
            'name': '思南公馆东苑',
            'location': '121.46514069767392,31.216568775986733'
          },
          'createdTime': '2018-07-05T15:44:40.000Z'
        }
      ]
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
      return this.ldbs.slice(0, 3)
    }
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
        this.ldbs = ldbs
        console.log('ldbs', ldbs)
        this.$refs.lordMap.createImageMarkers(ldbs)
        this.$refs.lordMap.createPointMarkers(ldbs)
        // this.$refs.lordMap.createMarkers(this.test_ldbs)
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
      const input = string.trim()
      if (input) {
        result = await getGoogleInfos({ input })
        if (result.code === 1000) result = result.data.list
      }
      this.$nextTick(() => cb(this.filterComplete(input, result)))
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
        this.$refs.lordMap.flyToCoords({ center: coords.split(','), pitch: this.lbsMPitch, zoom: this.mapScrollZooms[this.mapScrollZooms.length - 1] })
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
      this.detailModel = true
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
  @import '@/assets/stylus/mixin/index.scss';
  .ld-lbs-main {
    position: relative;
    height: 100%;
  }
  .lbs-search {
    position: absolute;
    top: 50px;
    left: 60px;
    width: 100%;
    max-width: 400px;
    box-shadow: 2.5px 5px 20px 0 rgba(0, 0, 0, .25);
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
    cursor: pointer;
    &.shadow {
      box-shadow: 2px 4px 8px 0 rgba(12, 0, 42, .5);
    }
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
