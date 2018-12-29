<template>
  <div class="relative alone-layer tavern-keeps-box">

    <!-- ldb detail datas skeletion -->
    <!-- <transition name="ld-suspension-hide-fade"> -->
    <!-- </transition> -->

    <transition name="ld-hide-fade" mode="out-in" @after-enter="datasEnter">
      <tavernkeeps-skeletion v-if="loading && keepsLoading"/>
      <section v-else class="TTFontBolder d-flex col-flex f-align-ceter sm-col-flex detail-tavern-keeps">
        <div class="tavern-keeps-header">
          Earnings of successive tavernkeeps
        </div>
        <ul class="lordless-table-list tavern-keeps-list">
          <li class="d-flex f-align-center lordless-table-item lordless-table-thead tavern-keeps-tr tavern-keeps-thead">
            <p class="tavern-keeps-index">#</p>
            <p class="v-flex tavern-keeps-user">TAVERNKEEP</p>
            <p class="tavern-keeps-earnings">EARNINGS</p>
          </li>
          <li class="d-flex f-align-center tavern-keeps-tr lordless-table-item tavern-keeps-item"
            v-for="(keep, index) of keeps" :key="index"
            @click.stop="$router.push(`/user/${keep.lord._id}`)">
            <p class="tavern-keeps-index">{{ keeps.length - index }}</p>
            <div class="v-flex d-flex f-align-center tavern-keeps-user">
              <lordless-blockies
                class="tavern-keeps-avatar"
                theme="dark"
                :scale="6"
                :size="5"
                jump
                :seed="keep.lord._id"/>
              <p v-if="keep.lord.nickName" class="d-flex f-align-center">
                <span class="keeps-user-name">{{ keep.lord.nickName | sliceStr({ end: 6, symbol: true }) }}</span>
                <span class="keeps-user-address">{{ keep.lord._id | splitAddress({ before: 6, end: 4 }) }}</span>
              </p>
              <p v-else class="keeps-user-name">{{ keep.lord._id | splitAddress({ before: 10, end: 8 }) }}</p>
            </div>
            <p class="tavern-keeps-earnings">$ {{ keep.reward | formatNumber | formatDecimal }}</p>
          </li>
        </ul>
      </section>
    </transition>
  </div>
</template>

<script>
import TavernkeepsSkeletion from '@/components/skeletion/ldb/detail/tavernkeeps'

import { getTavernkeeps } from 'api'
export default {
  name: 'tavern-detail-tavernkeeps',
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    },

    loading: {
      type: Boolean,
      default: false
    }
  },
  data: (vm) => {
    return {
      keepsLoading: true,
      keeps: []
    }
  },
  computed: {
  },
  watch: {
    info (val) {
      if (val && val.id) {
        this.getTavernkeepsHandle(val.id)
      }
    }
  },
  components: {
    TavernkeepsSkeletion
  },
  methods: {
    datasEnter () {
      this.$emit('enter')
    },
    async getTavernkeepsHandle (tokenId = this.info.id) {
      this.keepsLoading = true
      try {
        const res = await getTavernkeeps(tokenId)
        if (res.code === 1000 && res.data) {
          this.keeps = res.data
        }
      } catch (err) {
        this.keepsLoading = false
      }
      this.keepsLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .tavern-keeps-box {
    // border-radius: 5px;
    // overflow: hidden;
  }
  .detail-tavern-keeps {
    // padding: 0 18px;
    background-color: #fff;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, .25);
  }
  .tavern-keeps-header {
    // margin: 0 -18px;
    padding-left: 36px;
    height: 64px;
    line-height: 64px;
    font-size: 24px;
    color: #fff;
    background-image: linear-gradient(to right, #124BDC, #0079FF);
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .tavern-keeps-list {
  }
  .tavern-keeps-tr {

  }
  .tavern-keeps-thead {
    padding: 0 18px;
    // height: 56px;
    // line-height: 56px;
    // color: #999;
  }
  .tavern-keeps-index {
    width: 70px;
    color: #999;
    text-align: center;
  }
  .tavern-keeps-user {
    padding-left: 20px;
  }
  .keeps-user-name {
    margin-left: 12px;
  }
  .keeps-user-address {
    margin-left: 12px;
    color: #999;
  }
  .tavern-keeps-earnings {
    width: 180px;
  }
  .tavern-keeps-item {
    padding: 24px 18px;
    &:hover {
      padding: 24px 8px;
    }
    // height: 80px;
    // line-height: 80px;
    // color: #555;
    // border-top: 1px solid #ddd;
  }
</style>
