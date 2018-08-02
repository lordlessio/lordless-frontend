import { mutationTypes } from '@/store/types'
import { mapMutations } from 'vuex'
export default {
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
