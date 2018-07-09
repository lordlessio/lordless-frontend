<template>
  <div :id="container" class="mapbox-main-box" :class="{ 'sm-marker': !isMaxZoom }" style="position: relative;width: 100%;height: 100%;"></div>
</template>

<script>
import MapBox from 'mapbox-gl/dist/mapbox-gl.js'
export default {
  name: 'mapbox',
  props: {
    markerShowZoom: {
      type: Number,
      default: 14
    },
    scrollZooms: {
      type: Array,
      default: () => {
        return [10, 14, 16]
      }
    },
    container: {
      type: String,
      default: 'ld-map'
    },
    token: {
      type: String,
      default: 'pk.eyJ1Ijoiam9lLWhpbGwiLCJhIjoiY2ppMWVldDIyMDlvcTNxcXAyZ3RuMmJ0YyJ9.4zH2xLDDfAmYp0k91-KOIA'
    },
    mapStyle: {
      type: String,
      default: 'mapbox://styles/joe-hill/cjifv0uhy0ag62rn3zk2tqh0b'
    },
    center: {
      type: Array,
      default: () => {
        return [121.499809, 31.239666]
      }
    },
    minZoom: {
      type: Number,
      default: 10
    },
    maxZoom: {
      type: Number,
      default: 16
    },
    zoom: {
      type: Number,
      default: 10
    },
    pitch: {
      type: Number,
      default: 15
    }
  },
  data: () => {
    return {
      map: null,
      markers: {},
      lngLat: null,
      isMaxZoom: false,
      isMinZoom: false
    }
  },
  methods: {

    /**
     * 根据 center 及 radius 获取 bounds 坐标对象
     */
    getBounds (center = [], radius = 100) {
      const bounds = new MapBox.LngLat(...center).toBounds(radius)
      const nw = bounds.getNorthWest().toArray()
      const ne = bounds.getNorthEast().toArray()
      const se = bounds.getSouthEast().toArray()
      const sw = bounds.getSouthWest().toArray()
      return [nw, ne, se, sw]
    },

    /**
     * 添加marker
     * marker是以添加 dom 的形式显示在地图中
     */
    createMarkers (list, map = this.map) {
      list.map(item => {
        const { _id, name, chainSystem, levelSystem, ldbIcon } = item
        const coords = [chainSystem.lat, chainSystem.lng]
        const imgSrc = ldbIcon.sourceUrl
        const markerDom = this.createMarkerDom({ name, imgSrc, level: levelSystem.level })
        markerDom.addEventListener('click', () => {
          this.markerClick(item)
        }, false)
        const marker = new MapBox.Marker(markerDom)
          .setLngLat(coords)
          .setOffset([-50, -50])
          .addTo(map)

        marker.remove()

        // set marker to markers by _id
        this.markers[_id] = marker
      })

      let startTime = new Date()
      const checkMarker = (delay = 300) => {
        // 如果map 的 zoom正在变化或者相邻事件执行时间少于300毫秒,return
        if (new Date() - startTime < delay || map.isZooming()) return
        startTime = new Date()
        this.checkMarkerIsInView()
      }
      this.checkMarkerIsInView()

      // map move 之后，check marker Inview
      this.mapMoveEvent(checkMarker)

      // 每次zoom变化前，remove marker
      this.mapZoomStartEvent(() => this.checkMarkerIsInView(undefined, true))

      // 每次zoom变化后，check marker Inview
      this.mapZoomEndEvent(this.checkMarkerIsInView)
    },

    /**
     * marker 点击事件
     */
    markerClick (item) {
      this.$emit('markerClick', item)
    },

    /**
     * 创建 marker dom
     */
    createMarkerDom ({ name, imgSrc, level } = {}) {
      const box = document.createElement('div')
      box.className = `marker _marker--ldb-box _marker--level-${level}`
      box.style.width = 'inherit'
      box.style.height = 'inherit'
      const boxHtml = `<div class="_marker--ldb-container"><img src="${imgSrc}" style="width: 100%"/><div class="_marker--info-box"><div class="d-flex col-flex _marker--info-container"><div class="d-flex f-align-center _marker--info-top"><span><img/></span><span>800 / 1000</span></div><div class="_marker--info-bottom"><div class="_marker--info-progress" style="width: ${600 / 1000 * 100}%"><span class="inline-block info-progress-main"></span></div></div></div>`
      box.innerHTML = boxHtml
      return box
    },

    /**
     * 添加区域 layer
     */
    addAreaLayer (map = this.map) {

    },

    /**
     * 获取当前鼠标所处位置
     * @param {Obejct} map 地图对象
     * @returns {Object} Returns LngLatLike 数据
     */
    getMouseCenter (delay = 300, map = this.map) {
      let mousemoveEvt = null
      let startTime = new Date()
      const func = (e) => {
        // 去抖限制, mapbox 监听事件不能使用 _.debounce
        if (new Date() - startTime < delay) return
        startTime = new Date()
        this.lngLat = e.lngLat
      }
      if (mousemoveEvt) return
      mousemoveEvt = map.on('mousemove', func)
    },

    /**
     * 初始化地图
     */
    init () {
      const { token, container, mapStyle, center, minZoom, maxZoom, zoom, pitch } = this
      MapBox.accessToken = token
      const maxBounds = new MapBox.LngLatBounds([120.849955, 30.682195], [122.007218, 31.870125])
      const map = new MapBox.Map({
        container, // container id
        // style: 'mapbox://styles/mapbox/light-v9', // stylesheet location
        style: mapStyle, // stylesheet location
        center, // starting position [lng, lat]
        // center: [-87.618312, 41.866282],
        minZoom,
        maxZoom,
        zoom, // starting zoom
        pitch,
        // bearing: 30
        maxBounds
        // attributionControl: true
      })
      map.scrollZoom.disable()
      map.touchZoomRotate.disable()
      map.doubleClickZoom.disable()
      this.map = map

      map.on('load', () => {
        // 添加marker
        // this.createMarker(map)

        this.getMouseCenter()

        this.mapWheel(map)

        this.checkMapZoom(map)

        this.$emit('load')
      })
      window.lMap = map
    },

    /**
     * mapbox zoom 事件
     */
    mapZoomEvent (cb, map = this.map) {
      let zoomEvent = null
      const func = () => {
        if (cb) cb()
      }
      if (zoomEvent) return
      zoomEvent = map.on('zoom', func)
    },

    /**
     * mapbox zoomend 事件
     */
    mapZoomEndEvent (cb, map = this.map) {
      let zoomEndEvent = null
      const func = () => {
        this.checkMapZoom(map)
        if (cb) cb()
      }
      if (zoomEndEvent) return
      zoomEndEvent = map.on('zoomend', func)
    },

    /**
     * mapbox zoomstart 事件
     */
    mapZoomStartEvent (cb, map = this.map) {
      let zoomStartEvent = null
      const func = () => {
        if (cb) cb()
      }
      if (zoomStartEvent) return
      zoomStartEvent = map.on('zoomstart', func)
    },

    /**
     * mapbox move 事件
     */
    mapMoveEvent (cb, map = this.map) {
      let moveEvent = null
      const func = () => {
        if (cb) cb()
      }
      if (moveEvent) return
      map.on('move', func)
    },

    /**
     * mapbox wheel 事件
     */
    mapWheel (map = this.map) {
      let bool = false
      // let center
      const wheelFunc = (e) => {
        if (bool) return
        if (e.originalEvent.deltaY < 5 && e.originalEvent.deltaY > -5) return

        bool = true
        // deltaY 大于0，代表向下滚动,zoom 放大，反之缩小
        if (e.originalEvent.deltaY >= 5) {
          this.plusMapZoom(this.lngLat, map, () => {
            bool = false
          })
        } else if (e.originalEvent.deltaY <= -5) {
          this.minusMapZoom(this.lngLat, map, () => {
            bool = false
          })
        }
      }
      map.on('wheel', wheelFunc)
    },

    /**
     * 根据 scrollZooms 放大地图 zoom
     */
    plusMapZoom (center, map = this.map, cb) {
      const zooms = this.scrollZooms
      if (!zooms || !zooms.length) return
      const currentZoom = map.getZoom()
      let currentIndex = zooms.indexOf(currentZoom)

      // 如果当前zoom是最后一级，return
      if (currentIndex === zooms.length - 1) {
        if (cb) cb()
        return
      }

      // 如果没找到当前zoom，currentIndex 重置为倒数第二级
      if (currentIndex === -1) currentIndex = zooms.length - 2
      this.flyToCoords({ center, zoom: zooms[currentIndex + 1] }, () => {
        if (cb) cb()
      })
    },

    /**
     * 根据 scrollZooms 缩小地图 zoom
     */
    minusMapZoom (center, map = this.map, cb) {
      const zooms = this.scrollZooms
      if (!zooms || !zooms.length) return
      const currentZoom = map.getZoom()
      let currentIndex = zooms.indexOf(currentZoom)

      // 如果当前zoom是第一级，return
      if (currentIndex === 0) {
        if (cb) cb()
        return
      }

      // 如果没找到当前zoom，currentIndex 重置为第二级
      if (currentIndex === -1) currentIndex = 1
      this.flyToCoords({ center, zoom: zooms[currentIndex - 1] }, () => {
        if (cb) cb()
      })
    },

    /**
     * 根据坐标 及 其他配置改变地图显示位置
     * @param {Object} flyOptions center: 地图中心点，zoom: 地图zoom duration 动画持续时间
     * @param {Function} cb 动画执行完毕的回调
     * @param {Map} map 地图实例，默认为当前实例
     */
    flyToCoords ({ center = this.map.getCenter(), zoom = 14, duration = 1000 } = {}, cb, map = this.map) {
      if (map.isZooming()) {
        if (cb) cb()
        return
      }
      map.flyTo({
        center,
        zoom,
        duration
      })
      const timeOut = setTimeout(() => {
        clearTimeout(timeOut)
        if (cb) cb()
      }, duration)
    },

    /**
     * check map current zoom is maxZoom or minZoom
     */
    checkMapZoom (map = this.map) {
      if (!this.mapControl) this.mapControl = true
      const maxZoom = map.getMaxZoom()
      const minZoom = map.getMinZoom()
      const currentZoom = map.getZoom()
      const srollZooms = this.scrollZooms
      if (currentZoom === maxZoom || currentZoom === srollZooms[srollZooms.length - 1]) {
        this.isMaxZoom = true
      } else if (currentZoom === minZoom || currentZoom === srollZooms[0]) {
        this.isMinZoom = true
      } else {
        this.isMaxZoom = false
        this.isMinZoom = false
      }
    },

    /**
     * check marker is inView
     * @param {Object} map map instence
     */
    checkMarkerIsInView (map = this.map, remove = false) {
      const bounds = map.getBounds()
      const markers = this.markers
      const mapZoom = Math.round(map.getZoom())
      const markerShowZoom = this.markerShowZoom
      console.time('check marker')
      for (const mk in markers) {
        if (this.inBounds(markers[mk].getLngLat(), bounds) && mapZoom >= markerShowZoom && !remove) markers[mk].addTo(map)
        else markers[mk].remove()
      }
      console.timeEnd('check marker')
    },

    inBounds (point, bounds) {
      var lng = (point.lng - bounds._ne.lng) * (point.lng - bounds._sw.lng) <= 0
      var lat = (point.lat - bounds._ne.lat) * (point.lat - bounds._sw.lat) <= 0
      return lng && lat
    }
  }
}
</script>

<style lang="scss">

  .mapbox-main-box {
    &.sm-marker {
      ._marker--ldb-container, .info-progress-main {
        width: 100px;
      }
      ._marker--info-top {
        margin-bottom: 0;
        height: 0;
        opacity: 0;
        visibility: hidden;
        transition: height .35s ease, opacity .35s ease 0s, visibility 0s .35s;
      }
      ._marker--info-bottom {
        height: 6px;
      }
    }
  }

  @mixin progress-gradient-bg($start: #FFBB17, $end: #FFED38, $duration: to right) {
    .info-progress-main {
      background-image: linear-gradient($duration, $start, $end);
    }
  }
  ._marker--ldb-box {
    &._marker--level-1 {
      @include progress-gradient-bg();
    }
    &._marker--level-2 {
      @include progress-gradient-bg();
    }
    &._marker--level-3 {
      @include progress-gradient-bg();
    }
    &._marker--level-4 {
      @include progress-gradient-bg();
    }
    &._marker--level-5 {
      @include progress-gradient-bg();
    }
  }

  ._marker--ldb-container {
    width: 150px;
    line-height: 1;
    // height: 100%;
    // transform-origin: center;
    // transform: scale(.5);
    transition: width .35s ease-in-out;
  }

  ._marker--info-box {
    color: #fff;
    overflow: hidden;
  }
  ._marker--info-container {
    margin-top: 10px;
  }
  ._marker--info-top {
    margin-bottom: 8px;
    font-size: 18px;
    height: 22px;
    transition: height .35s ease, opacity .15s ease .15s, visibility 0s 0s;
  }

  ._marker--info-bottom {
    height: 15px;
    border-radius: 10px;
    background-color: #fff;
    overflow: hidden;
    transition: height .35s ease-in-out;
  }
  ._marker--info-progress {
    position: relative;
    height: 100%;
    border-radius: 10px;
    overflow: hidden;
  }
  .info-progress-main {
    width: 150px;
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    transition: width .35s ease-in-out;
  }
</style>
