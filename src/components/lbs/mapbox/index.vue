<template>
  <div :id="container" style="position: relative;width: 100%;height: 100%;"></div>
</template>

<script>
import MapBox from 'mapbox-gl/dist/mapbox-gl.js'
export default {
  name: 'mapbox',
  props: {
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
      mapZoom: 10,
      markers: {},
      markerShowZoom: 14,
      lngLat: null
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
        const coords = [chainSystem.lat, chainSystem.lon]
        const imgSrc = ldbIcon.sourceUrl
        const markerDom = this.createMarkerDom({ name, imgSrc, level: levelSystem.level })
        markerDom.addEventListener('click', () => {
          this.markerClick(item)
        }, false)
        const marker = new MapBox.Marker(markerDom)
          .setLngLat(coords)
          .setOffset([50, -50])
          .addTo(map)

        marker.remove()

        // set marker to markers by _id
        this.markers[_id] = marker
      })

      let startTime = new Date()
      const checkMarker = (delay = 300) => {
        if (new Date() - startTime < delay) return
        startTime = new Date()
        this.checkMarkerIsInView()
      }
      this.checkMarkerIsInView()
      this.mapMoveEvent(checkMarker)
      this.mapZoomEndEvent(this.checkMarkerIsInView)
      this.mapZoomEvent(checkMarker)
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
      const boxHtml = `<div class="_marker--ldb-container"><img src="${imgSrc}" style="width: 100px;"/><div class="_marker--lord-box"><div class="_marker--lord-cnt"><img data-attr="avatar" src="https://s.gravatar.com/avatar/7680a5a89452076e5ab340bf74a2a786?s=80"/><span>${name}</span></div></div></div>`
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
     * @returns {Object} Returns LngLonLike 数据
     */
    getMouseCenter (delay = 300, map = this.map) {
      let mousemoveEvt = null
      let startTime = new Date()
      const func = (e) => {
        // 去抖限制, 因为 mapbox 监听事件不能使用 _.debounce
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
      this.map = map

      map.on('load', () => {
        // 添加marker
        // this.createMarker(map)

        this.getMouseCenter()

        this.mapWheel(map)

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
      let myIndex = 0
      let zooms = [10, 14, 15]
      // let center
      const wheelFunc = (e) => {
        if (bool) return
        if (e.originalEvent.deltaY < 5 && e.originalEvent.deltaY > -5) return

        // deltaY 大于0，代表向下滚动,zoom 放大，反之缩小
        if (e.originalEvent.deltaY >= 5) --myIndex
        else if (e.originalEvent.deltaY <= -5) ++myIndex

        // 如果 myIndex 不在规定范围，重置其属性并return
        if (myIndex < 0 || myIndex > zooms.length - 1) {
          myIndex = myIndex < 0 ? 0 : zooms.length - 1
          return
        }
        bool = true
        this.flyToCoords({ zoom: zooms[myIndex] }, () => {
          bool = false
        })
      }
      map.on('wheel', wheelFunc)
    },

    /**
     * 根据坐标 及 其他配置改变地图显示位置
     * @param {Object} flyOptions center: 地图中心点，zoom: 地图zoom duration 动画持续时间
     * @param {Function} cb 动画执行完毕的回调
     * @param {Map} map 地图实例，默认为当前实例
     */
    flyToCoords ({ center = this.lngLat, zoom = 14, duration = 1000 } = {}, cb, map = this.map) {
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
     * check marker is inView
     * @param {Object} map map instence
     */
    checkMarkerIsInView (map = this.map) {
      const bounds = map.getBounds()
      const markers = this.markers
      const mapZoom = map.getZoom()
      const markerShowZoom = this.markerShowZoom
      console.time('check marker')
      for (const mk in markers) {
        if (this.inBounds(markers[mk].getLngLat(), bounds) && mapZoom >= markerShowZoom) markers[mk].addTo(map)
        else markers[mk].remove()
      }
      console.timeEnd('check marker')
    },

    inBounds (point, bounds) {
      var lng = (point.lng - bounds._ne.lng) * (point.lng - bounds._sw.lng) <= 0
      var lat = (point.lat - bounds._ne.lat) * (point.lat - bounds._sw.lat) <= 0
      return lng && lat
    }
  },
  mounted () {
    this.$nextTick(() => this.init())
  }
}
</script>

<style lang="scss">
  ._marker--ldb-container {
    // height: 100%;
    // transform-origin: center;
    // transform: scale(.5);
    // transition: transform linear .15s;
  }

  ._marker--lord-box {
    display: none;
    height: 35px;
    overflow: hidden;
  }
  ._marker--lord-cnt {
    // height: 100%;
    // opacity: 0;
    // transform: translateY(-100%);
    // transition: all ease-in .15s;
    >img {
      display: inline-block;
      vertical-align: middle;
      width: 100px;
      border-radius: 100%;
    }
    >span {
      margin-left: 10px;
      display: inline-block;
      vertical-align: middle;
      color: #fff;
      font-size: 16px;
      font-weight: bold;
    }
  }
</style>
