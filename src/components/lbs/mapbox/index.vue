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
      default: 'mapbox://styles/joe-hill/cji3a04kn1fag2rn77p7q3798'
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
      mapZoom: 10
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
     * 初始化地图
     */
    init () {
      const { token, container, mapStyle, center, minZoom, maxZoom, zoom, pitch } = this
      MapBox.accessToken = token
      const maxBounds = new MapBox.LngLatBounds([120.92470373018017, 30.650390197707168], [122.07312119714027, 31.835625755135595])
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
      const imgSrc = '/static/img/dongfangmingzhu.png'
      map.on('load', () => {
        /**
         * 添加marker
         * marker是以添加 dom 的形式显示在地图中
         */

        const box = document.createElement('div')
        box.className = 'marker _marker--ldb-box'
        box.style.width = '250px'
        box.style.height = '250px'
        const boxHtml = `<div class="_marker--ldb-container"><img src="${imgSrc}" style="height: 100%;"/><div class="_marker--lord-box"><div class="_marker--lord-cnt"><img data-attr="avatar" src="https://s.gravatar.com/avatar/7680a5a89452076e5ab340bf74a2a786?s=80"/><span>我的建筑</span></div></div></div>`
        box.innerHTML = boxHtml
        // box.addEventListener('click', this.ldbHandle)
        new MapBox.Marker(box)
          .setLngLat([121.49532509415997, 31.241900149767687])
          .setOffset([50, -50])
          .addTo(map)
      })
      window.lMap = map

      let lnglat = [0, 0]
      map.on('mousemove', (e) => {
        lnglat = [e.lngLat.lng, e.lngLat.lat]
      })
      map.on('click', () => {
        console.log('lnglat', lnglat)
      })
      // let myZoom = map.getZoom()
      // map.on('zoom', () => {
      //   if (!map.scrollZoom.isEnabled()) return
      //   console.log('map.getZoom()', map.getZoom(), lnglat)
      //   map.scrollZoom.disable()
      //   map.touchZoomRotate.disable()
      //   if (map.getZoom() > myZoom) {
      //     ++myZoom
      //     // map.zoomIn({
      //     //   duration: 500,
      //     //   easing: (x) => x,
      //     //   offset: lnglat,
      //     //   animate: true
      //     // })
      //   } else if (map.getZoom() < myZoom) {
      //     --myZoom
      //     // map.zoomOut({
      //     //   duration: 500,
      //     //   easing: (x) => x,
      //     //   offset: lnglat,
      //     //   animate: true
      //     // })
      //   }
      //   map.flyTo({
      //     // center: lnglat,
      //     zoom: myZoom,
      //     duration: 500
      //   })
      //   setTimeout(() => {
      //     myZoom = map.getZoom()
      //     map.scrollZoom.enable()
      //     map.touchZoomRotate.enable()
      //   }, 500)
      // })
      this.map = map
    }
  },
  mounted () {
    this.$nextTick(() => this.init())
  }
}
</script>

<style lang="scss">
  ._marker--ldb-container {
    height: 100%;
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
    height: 100%;
    // opacity: 0;
    // transform: translateY(-100%);
    // transition: all ease-in .15s;
    >img {
      display: inline-block;
      vertical-align: middle;
      height: 100%;
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
