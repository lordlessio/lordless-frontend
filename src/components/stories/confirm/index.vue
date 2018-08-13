<template>
  <el-dialog
    title="交易成功"
    :visible.sync="detailAlert"
    width="300px"
    :close-on-click-modal="false"
    :center="true"
    append-to-body
    :show-close="false">
    <div class="confirm-box">
      <div class="d-flex confirm-container">
        <span @click.stop="authorizeDialog = false" class="inline-block confirm-close">
          <i class="el-icon-close"></i>
        </span>
        <div class="confirm-cnt-left">
          <img-box class="confirm-poster" :src="ldbInfo.ldbIcon.sourceUrl" type="span"></img-box>
        </div>
        <div class="v-flex confirm-cnt-box">
          <h3>{{ ldbInfo.name.zh }}</h3>
          <div class="d-flex row-flex confirm-ldb-info">
            <div class="d-flex col-flex confirm-ldb-key">
              <p>段位：</p>
              <p>坐标：</p>
              <p>价格：</p>
            </div>
            <div class="v-flex d-flex col-flex confirm-ldb-value">
              <p>{{ ldbInfo.chain.level }}</p>
              <p>{{ ldbInfo.chain.lng }}, {{ ldbInfo.chain.lat }}</p>
              <p>{{ ldbInfo.chain.auction.price | weiToEth }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <ld-button @click="detailAlert = false" v-if="type === 'submit'">{{ cancelText }}</ld-button>
      <ld-button theme="info-2" @click="submit">{{ submitText }}</ld-button>
    </div>
  </el-dialog>
</template>

<script>
import LdButton from '@/components/stories/button'
import ImgBox from '@/components/stories/image'
export default {
  name: 'lordless-confirm',
  props: {
    type: {
      type: String,
      default: 'submit'
    },
    submitText: {
      type: String,
      default: '确 定'
    },
    cancelText: {
      type: String,
      default: '取 消'
    },
    isSyncSubmit: {
      type: Boolean,
      default: false
    },
    ldbInfo: {
      type: Object,
      default: () => {
        return {
          ldbIcon: {}
        }
      }
    }
  },
  data: {
    detailAlert: false
  },
  components: {
    LdButton,
    ImgBox
  },
  methods: {
    submit () {
      if (this.isSyncSubmit) {
        this.$emit('submit', () => {
          this.detailAlert = false
        })
      } else {
        this.$emit('submit')
        this.detailAlert = false
      }
    }
  },
  watch: {
    detailAlert (val) {
      if (!val) this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss" scoped>
  .confirm-box {
    margin: -25px -25px -30px;
    width: inherit;
    height: inherit;
  }
  .confirm-container {
    padding: 50px 35px 30px;
    position: relative;
  }
  .confirm-close {
    position: absolute;
    top: 15px;
    right: 15px;
    font-size: 30px;
    cursor: pointer;
  }
  .confirm-cnt-left {
    position: relative;
    width: 100px;
    padding-top: 100px;
  }
  .confirm-poster {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  .confirm-cnt-box {
    margin-left: 20px;
  }
</style>
