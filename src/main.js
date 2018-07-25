'use strict'
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Lordless from './App.vue'
import router from './router'
import store from './store'
import './plugins'
import {
  Col, Row,
  Tabs, Dialog, Autocomplete, Pagination,
  Collapse, CollapseItem
} from 'element-ui'
import VueI18n from 'vue-i18n'

// 项目国际化文件
import enLocale from '@/assets/locales/en.json'
import zhLocale from '@/assets/locales/zh-cn.json'

// element 国际化文件
import eleEnLocale from 'element-ui/lib/locale/lang/en'
import eleZhLocale from 'element-ui/lib/locale/lang/zh-CN'
import ElementLocale from 'element-ui/lib/locale'

import 'stylus/index.scss'

// 使用 element-ui 组件
Vue.use(Col)
Vue.use(Row)

Vue.use(Tabs)
Vue.use(Dialog)
Vue.use(Autocomplete)
Vue.use(Pagination)

// Vue.use(Slider)
// Vue.use(Carousel)
// Vue.use(CarouselItem)
Vue.use(Collapse)
Vue.use(CollapseItem)

// 配置 element 默认参数
Vue.prototype.$ELEMENT = { size: 'large', zIndex: 3000 }

// 使用 vueI18n 国际化插件
Vue.use(VueI18n)

// 配置国际化
const messages = {
  en: {
    ...enLocale,
    ...eleEnLocale
  },
  zh: {
    ...zhLocale,
    ...eleZhLocale
  }
}

const i18n = new VueI18n({
  locale: 'zh',
  messages
})

// Element 国际化配置
ElementLocale.i18n((key, value) => i18n.t(key, value))

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#lordless',
  router,
  store,
  i18n,
  components: { Lordless },
  template: '<Lordless/>'
}).$mount('#lordless')
