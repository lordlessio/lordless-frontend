import { mutationTypes } from '@/store/types'
import { mapMutations } from 'vuex'
export default {
  data: () => {
    return {
      metamaskChoose: false
    }
  },
  methods: {
    ...mapMutations('layout', [
      mutationTypes.LAYOUT_SET_META_OPEN
    ])
  },
  watch: {
    metamaskChoose (val) {
      console.log('-- metamask mixins metamaskChoose', val)
      this[mutationTypes.LAYOUT_SET_META_OPEN](val)
    }
  }
}
