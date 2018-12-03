<template>
  <div class="mobile-tavern-detail">
    <mobile-nav-bar
      ref="mobile-nav-bar"
      v-bind="scrollOpt"
      @history="tCloseHandle"/>
    <ldb-detail ref="ldbDetail" theme="light" @tClose="tCloseHandle"/>
  </div>
</template>

<script>
import LdbDetail from '@/components/content/ldb/detail'

import { mutationTypes } from '@/store/types'
import { mapMutations } from 'vuex'
export default {
  data: () => {
    return {
      scrollOpt: {
        show: true,
        history: true,
        text: 'Tavern',
        scroll: true,
        userAvatar: true,
        transparent: true,
        scrollMark: 100
      }
    }
  },
  components: {
    LdbDetail
  },
  methods: {
    ...mapMutations('layout', [
      mutationTypes.LAYOUT_SET_POP_DIRECTION
    ]),
    tCloseHandle () {
      this[mutationTypes.LAYOUT_SET_POP_DIRECTION]('_reverse')
      this.$nextTick(() => this.$router.push('/taverns'))
      // if (history.length) {
      //   history.go(-1)
      // } else {
      //   this.$router.push('/market')
      // }
    },
    initTavern () {
      const { tavernId } = this.$route.params
      this.$nextTick(() => this.$refs.ldbDetail.init(tavernId))
    }
  },
  activated () {
    this.initTavern()
  },
  mounted () {
    this.initTavern()
  }
}
</script>

