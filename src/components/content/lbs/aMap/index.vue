<template>
  <div style="position: relative;width: 100%;height: 100%;">
    <div :id="mapInstance" style="width: 100%;height: 100%;"></div>
  </div>
</template>

<script>
// export default {
//   props: {

//     /**
//      * js地址参数
//      */
//     version: {
//       type: String,
//       default: '1.4.7'
//     },
//     aMapKey: {
//       type: String,
//       default: 'd7f3652abd27e6b04fca7b4b716fe84a'
//     },

//     /**
//      * 地图默认参数
//      */

//     // 地图实例化对象
//     mapInstance: {
//       type: String,
//       default: 'lbs_amap'
//     },
//     // 是否3D视图,默认为关闭
//     viewMode: {
//       type: String,
//       default: '2D'
//     },
//     // 地图加载完成之后中心位置
//     center: {
//       type: Array,
//       default: () => {
//         return [121.499809, 31.239666]
//       }
//     },
//     // 默认地图zoom
//     zoom: {
//       type: Number,
//       default: 16
//     },
//     // 地图zoom范围
//     zooms: {
//       type: Array,
//       default: () => {
//         return [10, 17]
//       }
//     },
//     // 地图旋转角度
//     rotation: {
//       type: Number,
//       default: 45
//     },
//     // 3D视角偏移角度
//     pitch: {
//       type: Number,
//       default: 30
//     },
//     // 地图样式
//     mapStyle: {
//       type: String,
//       default: 'amap://styles/8adb8e2f9b096faa218a3b3c97824642'
//     },
//     // 楼块出现是否带动画
//     buildingAnimation: {
//       type: Boolean,
//       default: true
//     },
//     // 是否监控地图容器尺寸变化，默认值为false
//     resizeEnable: {
//       type: Boolean,
//       default: true
//     },
//     // 地图是否可旋转，默认false
//     rotateEnable: {
//       type: Boolean,
//       default: false
//     },
//     // 是否允许设置俯仰角度，3D视图下为true，2D视图下无效
//     pitchEnable: {
//       type: Boolean,
//       default: true
//     },
//     // 是否支持可以扩展最大缩放级别,和zooms属性配合使用
//     // 设置为true的时候，zooms的最大级别在PC上可以扩大到20级，移动端还是高清19/非高清20
//     expandZoomRange: {
//       type: Boolean,
//       default: false
//     },

//     /**
//      * 自定义参数
//      */

//     // 是否显示 marker 点标记
//     shouMaker: {
//       type: Boolean,
//       default: true
//     },
//     // 是否点聚合
//     isMarkerClusterer: {
//       type: Boolean,
//       default: false
//     },
//     // 默认选中的建筑id
//     ldbId: {
//       type: Number,
//       default: null
//     },
//     // 需要展示的建筑列表
//     ldbs: {
//       type: Array,
//       default: () => {
//         return []
//       }
//     },
//     // 点标记展示类型
//     markerTag: {
//       type: Number,
//       default: 2
//     },
//     // 地图插件配置
//     mapPluginOptions: {
//       type: Object,
//       default: () => {
//         return {}
//       }
//     },
//     // 网格尺寸
//     gridSize: {
//       type: Number,
//       default: 80
//     },

//     // 需要开启的插件
//     plugins: {
//       type: Array,
//       default: () => ['AMap.CircleMarker', 'ElasticMarker']
//     },
//     /**
//      * 插件配置
//      * 由多个对象构成的数组
//      * 如果需要配置某个插件
//      * eg: { Geolocation: { showZoomBar: true } }
//      */
//     pluginOptions: {
//       type: Object,
//       default: () => {}
//     }
//   },
//   data: (vm) => {
//     return {
//       loading: false,
//       // aMap 地图对象
//       aMap: null,
//       cluster: null,
//       markers: null,
//       markerOptions: {
//         gridSize: vm.gridSize,
//         maxZoom: vm.zooms[1]
//       },
//       // 默认插件配置
//       defaultPluginOptions: {
//         ControlBar: {
//           showZoomBar: true,
//           // 是否显示倾斜按钮，pc默认为true，移动端为false
//           showControlButton: true,
//           position: {
//             right: '10px',
//             top: '10px'
//           }
//         }
//       }
//     }
//   },
//   methods: {

//     // 根据中心点和半径获取方形 bounds
//     getBounds ({ center, radius = 150 }) {
//       const circle = new AMap.Circle({
//         center,
//         radius
//       })
//       return circle.getBounds()
//     },

//     // 绘制图片 canvas
//     drawImgCanvas ({ imgSrc, center, width = 300 }) {
//       const canvas = document.createElement('canvas')
//       canvas.width = canvas.height = width
//       const ctx = canvas.getContext('2d')
//       const img = new Image()
//       img.src = imgSrc
//       img.onload = () => {
//         ctx.drawImage(img, 0, 0, width, width)
//         const CanvasLayer = new AMap.CanvasLayer({
//           canvas,
//           bounds: this.getBounds({ center }),
//           zooms: [10, 17],
//           zIndex: 1000
//         })
//         CanvasLayer.setMap(this.aMap)
//       }
//     },

//     // 绘制灵活点标记
//     drawElasticMarker (map = this.aMap) {
//       // const img1 = 'http://localhost:8081/static/img/test-ldb-1.png'
//       // const img2 = 'http://localhost:8080/static/img/test-ldb-3.png'
//       const img2 = 'http://lordless.io/_nuxt/img/ldb-b1.5569738.png'
//       // zoomStyleMapping 显示状态 key： 对应zoom，value：显示styles层数
//       const zoomStyleMapping = { 14: 0, 15: 0, 16: 0, 17: 0 }
//       const facilities = []
//       const marker = new AMap.ElasticMarker({
//         position: [121.499809, 31.239666],
//         zooms: [15, 17],
//         styles: [
//           {
//             icon: {
//               img: img2,
//               size: [60, 120], // 可见区域的大小
//               // imageSize: [100, 200], // 图片大小, 默认等于size
//               ancher: [40, 120], // 锚点
//               fitZoom: 16, // 最合适的级别
//               scaleFactor: 2, // 地图放大一级的缩放比例系数
//               maxScale: 2, // 最大放大比例
//               minScale: 0.125// 最小放大比例
//             }
//           }],
//         zoomStyleMapping
//       })
//       facilities.push(marker)
//       map.add(facilities)
//     },

//     // 地图插件配置
//     aMapPluginOptions () {
//       const options = {}
//       // 默认配置
//       const defaultPluginOptions = this.defaultPluginOptions
//       // 传入的配置
//       const pluginOptions = this.pluginOptions
//       // 需要的插件
//       const plugins = this.plugins
//       // 根据插件引入对应的配置
//       for (const item of plugins) {
//         options[item] = Object.assign({}, defaultPluginOptions[item], pluginOptions[item])
//       }
//       return options
//     },

//     // 初始化插件
//     // initPlugins (aMap = this.aMap) {
//     //   AMap.plugin(['AMap.CircleEditor'], () => {
//     //     const circleEditor = new AMap.CircleEditor()
//     //     aMap.addControl(circleEditor)
//     //   })
//     //   this.drawImgCanvas({ imgSrc: 'http://localhost:4000/img/first/ldb-b9.png', center: aMap.getCenter() })
//     // },

//     // 加载 aMap 文件
//     loadAMap () {
//       const url = `//webapi.amap.com/maps?v=${this.version}&key=${this.aMapKey}&plugin=${this.plugins.toString()}&callback=aMapLoad`
//       const script = document.createElement('script')
//       script.type = 'text/javascript'
//       script.async = true
//       script.defer = true
//       script.src = url
//       document.head.appendChild(script)
//       window.aMapLoad = () => {
//         this.initAMap()
//       }
//     },

//     // 初始化 aMap 地图
//     initAMap () {
//       console.log('-----', AMap, this.mapInstance)
//       const { viewMode, center, zoom, zooms, rotation, pitch, mapStyle, buildingAnimation, resizeEnable, rotateEnable, pitchEnable, expandZoomRange } = this
//       const options = { viewMode, center, zoom, zooms, rotation, pitch, mapStyle, buildingAnimation, resizeEnable, rotateEnable, pitchEnable, expandZoomRange }
//       console.log('options', options)
//       const aMap = new AMap.Map(this.mapInstance, options)
//       this.aMap = aMap
//       // const toolbar = new AMap.ToolBar()
//       // aMap.plugin(toolbar)
//       console.log(aMap.getCity(res => console.log(res)))
//       this.$nextTick(() => {
//         AMap.plugin(['AMap.ControlBar'], () => {
//           // 创建并添加工具条控件
//           const { ControlBar } = this.pluginOptions
//           const controlBar = new AMap.ControlBar(ControlBar)
//           aMap.addControl(controlBar)
//         })
//         // this.initPlugins(aMap)
//         this.drawElasticMarker()
//         // this.drawImgCanvas({ imgSrc: 'http://localhost:4000/img/first/ldb-b9.png', center: aMap.getCenter() })
//       })
//     }
//   },
//   mounted () {
//     this.$nextTick(() => {
//       if (window.AMap) this.initAMap()
//       else this.loadAMap()
//     })
//   }
// }
</script>

<style lang="scss">
  .amap-marker-label {
    padding: 6px;
    font-size: 16px;
    text-align: center;
    color: #fff;
    border-radius: 15px;
    background-color: rgb(154, 126, 207);
    border: solid 2px rgb(1, 197, 199);
  }
</style>
