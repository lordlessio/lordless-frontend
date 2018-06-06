<template>
  <div class="ldb-detail-main">
    <div class="detail-header">
      <img-box :src="ldbImage(ldbInfo.photos)" type="span"></img-box>
    </div>
    <div class="detail-content">
      <div class="cnt-header">
        <el-row justify="end" align="bottom">
          <el-col :span="12">
            <h1>{{ ldbInfo.name }}</h1>
          </el-col>
          <el-col :span="12">
            <div class="d-flex f-align-center">
              <div class="user-info v-flex">
                <p>{{ '领主名称' }}</p>
                <p>{{ userInfo.address }}</p>
              </div>
              <div class="user-avatar">
                <img-box></img-box>
              </div>
            </div>
          </el-col>
        </el-row>
        <div class="ldb-msg">
          <span class="inline-block ldb-location">{{ `${ldbInfo.chainSystem.lat},${ldbInfo.chainSystem.lon}` }}</span>
          <span class="inline-block ldb-address">{{ ldbInfo.address }}</span>
        </div>
      </div>
      <div class="cnt-desc">{{ ldbInfo.desc }}</div>
      <div class="cnt-features">
        <div>{{ ldbInfo.chainSystem.value }} ETH</div>
        <my-button theme="bye">购买</my-button>
      </div>
      <div class="cnt-history">
        <h2>Transaction History</h2>
        <el-row class="history-item history-header">
          <el-col :span="6">
            PRICE
          </el-col>
          <el-col :span="6">
            WHEN
          </el-col>
          <el-col :span="6">
            FROM
          </el-col>
          <el-col :span="6">
            TO
          </el-col>
        </el-row>
        <el-row class="history-item history-cnt">
          <el-col :span="6">
            100 ETH
          </el-col>
          <el-col :span="6">
            2 days ago
          </el-col>
          <el-col :span="6">
            {{ userInfo.address }}
          </el-col>
          <el-col :span="6">
            {{ userInfo.address }}
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import ImgBox from '@/stories/image'
import MyButton from '@/stories/button'
import { findLdbById } from 'api'
import { objectT } from '@/assets/utils/tool'
import { mapState } from 'vuex'
export default {
  props: {

    // 是否在 dialog 中打开
    dialog: {
      type: Boolean,
      default: false
    },

    // ldb 建筑id
    ldbId: String
  },
  data: () => {
    return {
      // 页面 loading 状态
      loading: false,
      // ldb 建筑信息
      ldbInfo: {
        userId: {},
        chainSystem: {},
        levelSystem: {}
      },
      // 错误信息
      errorMsg: null
    }
  },
  computed: {
    ...mapState('user', {
      userInfo: 'userInfo'
    })
  },
  components: {
    ImgBox,
    MyButton
  },
  methods: {

    // 根据 photos 获取 ldb cover image
    ldbImage (photos) {
      if (objectT(photos)[0] !== 'array') return photos
      return decodeURIComponent(photos[0].split(',')[0])
    },

    // 获取 ldb 建筑详情
    async getLdbInfo (id) {
      this.loading = true
      const res = await findLdbById({ id })
      if (res.code === 1000) this.ldbInfo = res.data
      else this.errorMsg = res.errorMsg || '未知错误'
      this.loading = false
    },

    // 初始化状态
    initStatus () {
      this.loading = false
      this.errorMsg = null
    }
  },
  watch: {
    ldbId (val) {
      if (val) this.getLdbInfo(val)
    }
  }
}
</script>

<style lang="scss" scoped>
  .ldb-detail-main {
    width: inherit;
    height: inherit;
  }
  .detail-header {
    height: 300px;
  }

  .detail-content {
    font-size: 16px;
  }
  .cnt-header {
    margin-top: 30px;
  }
  .user-info {
    text-align: right;
  }
  .user-avatar {
    width: 40px;
    height: 40px;
    background-color: #ed5736;
    border-radius: 100%;
  }
  .cnt-desc {
    margin: 30px 0;
  }
  .ldb-msg {
    >span {
      padding: 8px 10px;
      border-radius: 5px;
      vertical-align: middle;
      background-color: #cb3a56;
      color: #fff;
      &:not(:first-of-type) {
        margin-left: 30px;
      }
    }
  }

  .cnt-history {
    font-weight: bold;
  }
  .history-item {
    height: 50px;
    color: #fff;
    line-height: 50px;
  }
  .history-header {
    color: #ccc;
    background-color: #e9e7ef;
  }
  .history-cnt {
    background-color: #ed5736;
  }
</style>
