<template>
  <div style="position: relative;width: inherit;height: inherit">
    <iframe src="" width="100%" height="100%" ref="sketch_frame" id="sketch_frame" frameborder="0" allow="autoplay; fullscreen; vr" allowvr allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
    <div class="sketch-bottom-cnt">
      <div class="d-flex">
        <div class="lord-avatar">
          <Blockies ref="lordAvatar" :autoInit="false" :seed="lordInfo.address" :size="10"/>
        </div>
        <div class="v-flex" v-if="viewerReady">
          <p class="lord-name-box">
            <span class="inline-block lord-name-title">领主: </span>
            <span class="inline-block lord-name">{{ lordInfo.name }}</span>
          </p>
          <p class="lord-address">{{ splitAddress(lordInfo.address, '******') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ImgBox from '@/components/stories/image'
import Blockies from '@/components/stories/blockies'
import { splitAddress } from 'utils/tool'
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
      viewerReady: false
    }
  },
  components: {
    ImgBox,
    Blockies
  },
  methods: {
    init () {
      const iframe = this.$refs.sketch_frame
      const urlid = '621fc1f1e7f142dab3f7d48c9e6feff1'

      // By default, the latest version of the viewer API will be used.
      const client = new Sketchfab(iframe)

      // Alternatively, you can request a specific version.
      // var client = new Sketchfab( '1.2.1', iframe );
      const {
        autostart,
        ui_stop, ui_animations, ui_annotations, ui_controls, ui_fullscreen,
        ui_general_controls, ui_help, ui_hint, ui_infos, ui_inspector, ui_inspector_open,
        ui_settings, ui_vr, ui_watermark, ui_watermark_link
      } = this
      client.init(urlid, {
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
          // fab.setFov(50)
          // fab.lookat([0, 13, 10], [0, 10, 0], 4.3)
          fab.addEventListener('viewerready', () => {
            this.$refs.lordAvatar.init()
            this.viewerReady = true
          })
        },
        error: () => {
          console.log('Viewer error')
        }
      })
    },
    splitAddress (address) {
      return splitAddress(address)
    }
  },
  mounted () {
    this.$nextTick(() => this.init())
  }
}
</script>

<style lang="scss" scoped>
  .sketch-bottom-cnt {
    position: absolute;
    left: 0;
    bottom: 15px;
    width: 100%;
    height: 40px;
    color: #4c4c4c;
    font-weight: bold;
    // background-color: #6e53ff;
  }
  .lord-avatar {
    margin-right: 10px;
    width: 50px;
    height: 50px;
    border-radius: 100px;
    overflow: hidden;
  }
  .lord-name-box {
    font-size: 16px;
    line-height: 1.8;
  }
  .lord-name-title {
    margin-right: 6px;
  }
  .lord-address {
    font-size: 14px;
  }
</style>
