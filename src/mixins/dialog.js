
import { addClass, removeClass } from 'utils/tool'

import { mutationTypes } from '@/store/types'
import { mapMutations } from 'vuex'
export default {
  computed: {
    isMobile () {
      return this.$root.$children[0].isMobile
    }
  },
  watch: {
    dialogModel (val) {
      if (this.isMobile) {
        const lordless = document.getElementById('lordless')
        switch (val) {
          case true:
            this.$nextTick(() => addClass('mobile-dialog-open', lordless))
            break
          case false:
            removeClass('mobile-dialog-open', lordless)
            break
          default:
            break
        }
      }
    }
  },
  methods: {
    ...mapMutations('layout', [
      mutationTypes.LAYOUT_SET_BLURS
    ]),

    // dialog setBlurs 监听
    dialogSetBlurs (val, num = 0) {
      const blursNum = (val ? 1 : 0) + num
      this[mutationTypes.LAYOUT_SET_BLURS](blursNum)
    }
  }
}
