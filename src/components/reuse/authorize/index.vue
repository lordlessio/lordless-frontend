<template>
  <el-dialog
    :visible.sync="authorizeDialog"
    custom-class="inline-block lordless-dialog authorize-dialog no-header light"
    width="initial"
    append-to-body
    :center="true"
    :show-close="false">
    <div class="authorize-box">
      <div class="d-flex authorize-container">
        <span @click.stop="ldbDialog = false" class="inline-block authorize-close">
          <i class="el-icon-close"></i>
        </span>
        <div>
          <Blockies :scale="avatar.scale" :radius="avatar.radius" :seed="address"/>
        </div>
        <div class="v-flex authorize-cnt-box">
          <div class="authorize-cnt-top">
            <p>钱包地址</p>
            <p>{{ address }}</p>
          </div>
          <div class="d-flex">
            <div class="authorize-choose">
              <check-box @click="authorizeFunc" :default="isApproved"></check-box>
            </div>
            <div class="v-flex authorize-text">
              授权<span class="color-main">虚拟市场合约</span>代您操作土地
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import CheckBox from '@/components/stories/checkbox'
import Blockies from '@/components/stories/blockies'
import { splitAddress } from 'utils/tool'
import { mapState } from 'vuex'
export default {
  props: {
    avatar: {
      type: Object,
      default: () => {
        return {
          scale: 18,
          radius: '20px'
        }
      }
    },
    address: {
      type: String,
      default: ''
    }
  },
  data: () => {
    return {
      authorizeDialog: false,
      isApproved: false
    }
  },
  computed: {
    ...mapState('contract', [
      'ldbNFTContract',
      'ldbNFTCrowdsaleContract'
    ])
  },
  components: {
    Blockies,
    CheckBox
  },
  methods: {
    splitAddress (address, { before = 8, end = 6, symbox = '******' } = {}) {
      return splitAddress(address, { before: 8, end: 6, symbox: '******' })
    },
    async checkoutAuthorize () {
      if (!this.address) return false
      const ldbNFTContract = this.ldbNFTContract
      const isApproved = await ldbNFTContract.isApprovedForAll(this.address, ldbNFTContract.address)
      if (!isApproved) this.authorizeDialog = true
      else this.authorizeDialog = false
      this.isApproved = isApproved

      return isApproved
    },
    authorizeFunc (cb) {
      const isApproved = this.isApproved
      const address = this.address
      const ldbNFTContract = this.ldbNFTContract
      if (!isApproved) {
        ldbNFTContract.setApprovalForAll(ldbNFTContract.address, address).then(d => {
          cb()
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .authorize-box {
    margin: -25px -25px -30px;
    width: inherit;
    height: inherit;
  }
  .authorize-container {
    padding: 50px 35px 30px;
    position: relative;
  }
  .authorize-close {
    position: absolute;
    top: 15px;
    right: 15px;
    font-size: 30px;
  }
  .authorize-cnt-box {
    margin-left: 20px;
  }
  .authorize-cnt-top {
    margin-bottom: 30px;
    font-size: 18px;
  }
  .authorize-choose {
    width: 26px;
    height: 26px;
    border-radius: 5px;
    overflow: hidden;
  }
  .authorize-text {
    margin-left: 10px;
    font-size: 18px;
  }
</style>
