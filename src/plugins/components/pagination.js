import Vue from 'vue'
import LordlessPagination from '@/components/stories/pagination'

/* istanbul ignore next */
LordlessPagination.install = function (Vue) {
  Vue.component(LordlessPagination.name, LordlessPagination)
}

Vue.use(LordlessPagination)
