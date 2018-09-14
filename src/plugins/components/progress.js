import Vue from 'vue'
import LordlessProgress from '@/components/stories/progress'

/* istanbul ignore next */
LordlessProgress.install = function (Vue) {
  Vue.component(LordlessProgress.name, LordlessProgress)
}

Vue.use(LordlessProgress)
