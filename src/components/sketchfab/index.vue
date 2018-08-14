<template>
  <div class="fab-main-box" :class="{ 'show-fab': is3D }" style="position: relative;width: inherit;height: inherit">
    <!-- <Loading :loading="loadFab" :index="10" position="absolute" class="d-flex f-auto-center fab-loading-box"> -->
      <!-- <img src="/static/svg/animation.svg"/> -->
      <!-- <svg>
        <use xlink:href="/static/svg/animation.svg#animation-bars"/>
      </svg> -->
    <!-- </Loading> -->
    <span class="inline-block switch-btn" @click.stop="switchFab">{{ this.is3D ? '2D' : '3D' }}</span>
    <div class="fab-poster">
      <img-box sType="height" bottom :src="poster" type="span"></img-box>
    </div>
    <div class="fab-content">
      <iframe src="" @load="sketchLoad" width="100%" height="100%" ref="sketch_frame" id="sketch_frame" frameborder="0" allow="autoplay; fullscreen; vr" allowvr allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
      <!-- <div class="sketch-bottom-cnt">
        <div class="d-flex">
          <div class="lord-avatar">
            <Blockies ref="lordAvatar" :autoInit="false" :seed="lordInfo.address" :size="10"/>
          </div>
          <div class="v-flex" v-if="viewerReady">
            <p class="lord-name-box">
              <span class="inline-block lord-name">{{ lordInfo.name }}</span>
            </p>
            <p class="lord-address">{{ lordInfo.address | splitAddress({ symbol: '******' }) }}</p>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import ImgBox from '@/components/stories/image'
import Blockies from '@/components/stories/blockies'
import Loading from '@/components/stories/loading'
export default {
  props: {
    lordInfo: {
      type: Object,
      default: () => {
        return {
          name: 'lordless',
          address: '0xc7dc18f76c110f8426466ccc2c1c97f7dfc2e2a0'
        }
      }
    },
    poster: String,
    urlId: {
      type: String,
      default: 'd02b032cb4b04e75b5d71dd8808d13a9'
    },
    autostart: {
      type: Number,
      default: 1
    },
    ui_stop: {
      type: Number,
      default: 0
    },
    ui_animations: {
      type: Number,
      default: 0
    },
    ui_annotations: {
      type: Number,
      default: 0
    },
    ui_controls: {
      type: Number,
      default: 0
    },
    ui_fullscreen: {
      type: Number,
      default: 0
    },
    ui_general_controls: {
      type: Number,
      default: 0
    },
    ui_help: {
      type: Number,
      default: 0
    },
    ui_hint: {
      type: Number,
      default: 0
    },
    ui_infos: {
      type: Number,
      default: 0
    },
    ui_inspector: {
      type: Number,
      default: 0
    },
    ui_inspector_open: {
      type: Number,
      default: 0
    },
    ui_settings: {
      type: Number,
      default: 0
    },
    ui_vr: {
      type: Number,
      default: 0
    },
    ui_watermark: {
      type: Number,
      default: 0
    },
    ui_watermark_link: {
      type: Number,
      default: 0
    }
  },
  data: () => {
    return {
      is3D: false,
      viewerReady: false,
      loadFab: false
    }
  },
  components: {
    ImgBox,
    Blockies,
    Loading
  },
  methods: {

    /**
     * append mapbox cdn to body
     */
    async initSketchfab () {
      return new Promise((resolve, reject) => {
        if (window.Sketchfab) return resolve()
        const el = document.createElement('script')
        el.src = 'https://static.sketchfab.com/api/sketchfab-viewer-1.2.1.js'
        el.type = 'text/javascript'
        el.async = true
        document.head.appendChild(el)
        el.onload = () => {
          setTimeout(() => resolve(), 0)
        }
        el.onerror = (e) => reject(new Error(e))
      })
    },

    async initFab () {
      await this.initSketchfab()

      this.is3D = true
      const iframe = this.$refs.sketch_frame

      // By default, the latest version of the viewer API will be used.
      const client = new Sketchfab(iframe)

      // Alternatively, you can request a specific version.
      // var client = new Sketchfab( '1.2.1', iframe );
      const {
        autostart, urlId,
        ui_stop, ui_animations, ui_annotations, ui_controls, ui_fullscreen,
        ui_general_controls, ui_help, ui_hint, ui_infos, ui_inspector, ui_inspector_open,
        ui_settings, ui_vr, ui_watermark, ui_watermark_link
      } = this

      client.init(urlId, {
        autostart,
        ui_stop,
        ui_animations,
        ui_annotations,
        ui_controls,
        ui_fullscreen,
        ui_general_controls,
        ui_help,
        ui_hint,
        ui_infos,
        ui_inspector,
        ui_inspector_open,
        ui_settings,
        ui_vr,
        ui_watermark,
        ui_watermark_link,
        success: (fab) => {
          fab.start()
          console.log('------ start', fab)
          // fab.setFov(50)
          // fab.lookat([0, 13, 10], [0, 10, 0], 4.3)
          fab.addEventListener('viewerready', () => {
            console.log('viewerready')
            // this.$refs.lordAvatar.init()
            this.is3D = true
            this.viewerReady = true
            this.loadFab = false
          })
        },
        error: () => {
          console.log('Viewer error')
        }
      })
    },

    sketchLoad () {
      console.log('------ sketchLoad')
    },
    switchFab () {
      if (this.viewerReady) {
        this.is3D = !this.is3D
        return
      }
      this.loadFab = true
      this.initFab()
    }
  }
}
</script>

<style lang="scss" scoped>
  .fab-main-box {
    margin: 0 auto;
    max-width: 1600px;
    &.show-fab {
      .fab-poster {
        visibility: hidden;
        transition: all .35s ease, visibility 0s .35s;
      }
      .fab-content {
        opacity: 1;
        visibility: visible;
        z-index: 2;
      }
    }
  }
  .fab-loading-box {
    background-color: rgba(78, 78, 78, .9);
    >img {
      width: 80px;
    }
  }
  // .sketch-bottom-cnt {
  //   position: absolute;
  //   left: 0;
  //   bottom: 15px;
  //   color: #fff;
  //   font-weight: bold;
  //   // background-color: #6e53ff;
  // }
  .switch-btn {
    position: absolute;
    left: 5px;
    bottom: 5px;
    width: 50px;
    height: 50px;
    border-radius: 100%;
    color: #373737;
    font-weight: 500;
    font-size: 20px;
    background-color: #F6D242;
    text-align: center;
    line-height: 50px;
    z-index: 9;
    visibility: visible;
    opacity: 1;
    cursor: pointer;
  }
  .fab-poster {
    position: relative;
    width: 100%;
    height: 100%;
    transition: all .35s ease, visibility 0s 0s;
  }
  .fab-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    visibility: hidden;
    opacity: 0;
    transition: opacity .35s ease, visibility 0s 0s, z-index 0s 0s;
  }
  // .lord-avatar {
  //   margin-right: 10px;
  //   width: 50px;
  //   height: 50px;
  //   border-radius: 100px;
  //   overflow: hidden;
  // }
  // .lord-name-box {
  //   font-size: 16px;
  //   line-height: 1.8;
  // }
  // .lord-name-title {
  //   margin-right: 6px;
  // }
  // .lord-address {
  //   font-size: 14px;
  // }
</style>
