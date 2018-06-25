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
    <el-dialog
      :title="detailLdbInfo.name"
      :visible.sync="ldbDialog"
      custom-class="dialog-ldb-detail gray"
      append-to-body
      lock-scroll
      top="20px">
      <div>
        <ldb-detail dialog theme="gray" :ldbId="detailLdbInfo._id"></ldb-detail>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getChainLdbs } from 'api'
// import { objectType } from 'utils/tool'
import ImgBox from '@/components/stories/image'
import LdbDetail from '@/components/ldb/detail'
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
    LdbDetail
  },
  methods: {

    // 根据 photos 获取 ldb cover image
    // ldbImage (photos) {
    //   if (objectType(photos)[0] !== 'array') return photos
    //   return decodeURIComponent(photos[0].split(',')[0])
    // },

    // 打开详情信息页
    openDetail (info) {
      this.ldbDialog = true
      this.$nextTick(() => {
        this.detailLdbInfo = info
        window.history.pushState(null, null, `/ldb/${info._id}`)
      })
    },

    // 获取 ldb 列表信息
    async getLdbs () {
      const res = await getChainLdbs()
      if (res.code === 1000) {
        this.ldbs = res.data.list
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
