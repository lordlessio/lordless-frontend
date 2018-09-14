import Vue from 'vue'
import LordlessImage from '@/components/stories/image'

/* istanbul ignore next */
LordlessImage.install = function (Vue) {
  Vue.component(LordlessImage.name, LordlessImage)
}

Vue.use(LordlessImage)
