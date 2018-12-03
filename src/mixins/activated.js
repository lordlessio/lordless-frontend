import { mutationTypes } from '@/store/types'
import { mapState, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapState('layout', [
      'activated'
    ])
  },
  methods: {
    ...mapMutations('layout', [
      mutationTypes.LAYOUT_SET_ACTIVATED_OPTIONS
    ])
  }
}
