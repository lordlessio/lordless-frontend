import Vue from 'vue'
import LordlessBlockies from '@/components/stories/blockies'

/* istanbul ignore next */
LordlessBlockies.install = function (Vue) {
  Vue.component(LordlessBlockies.name, LordlessBlockies)
}

Vue.use(LordlessBlockies)
