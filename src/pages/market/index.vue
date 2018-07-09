<template>
  <div class="ld-market">
    <div class="page-container">
      <el-row :gutter="20" class="cnt-box" @click.stop="openDetail()">
        <el-col
          v-for="item of ldbs" :key="item._id"
          :sm="12" :md="8" :lg="6">
          <div class="cnt-item" @click.stop="openDetail(item)">
            <figure class="cards">
              <figcaption>
                <img-box :src="item.ldbIcon.sourceUrl" type="span"></img-box>
              </figcaption>
            </figure>
            <div>name</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <detail-dialog
      ref="ldbDetail"
      theme="default"
      :ldbId="detailLdbInfo._id"
      @close="dialogClose">
    </detail-dialog>
  </div>
</template>

<script>
import { getChainLdbs } from 'api'
import DetailDialog from '@/components/reuse/detailDialog'
import { historyState } from 'utils/tool'
import ImgBox from '@/components/stories/image'
export default {
  data: () => {
    return {

      // ldb 建筑列表
      ldbs: [],

      // ldb dialog 显示控制
      ldbDialog: false,
      detailLdbInfo: {}
    }
  },
  components: {
    ImgBox,
    DetailDialog
  },
  methods: {

    // 根据 photos 获取 ldb cover image
    // ldbImage (photos) {
    //   if (objectType(photos)[0] !== 'array') return photos
    //   return decodeURIComponent(photos[0].split(',')[0])
    // },

    /**
     * 打开详情信息页
     */
    openDetail (info) {
      this.$refs.ldbDetail.open()
      this.ldbDialog = true
      this.$nextTick(() => {
        this.detailLdbInfo = info
        historyState(`/ldb/${info._id}`)
      })
    },

    /**
     * 对话框关闭触发函数
     */
    dialogClose () {
      historyState(this.$route.path)
    },

    /**
     * 获取 ldb 列表信息
     */
    async getLdbs () {
      const res = await getChainLdbs()
      if (res.code === 1000) {
        this.ldbs = res.data.list
        window.ldbs = this.ldbs
      }
    }
  },
  watch: {
    ldbDialog (val) {
      // 如果对话框关闭，改变浏览器地址为详情页面地址
      if (!val) {
        window.history.pushState(null, null, this.$route.path)
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getLdbs()
    })
  }
}
</script>

<style lang="scss" scoped>
  .ld-market {

  }
  .cnt-box {

  }
  .cards {
    border-radius: 5px;
    background-color: #f36838;
    > figcaption {
      height: 200px;
      border-radius: 5px;
      overflow: hidden;
    }
  }
  .cnt-item {
    color: #fff;
    cursor: pointer;
  }
</style>
