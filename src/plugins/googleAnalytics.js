import Vue from 'vue'
import router from '@/router'
import VueAnalytics from 'vue-analytics'

if (process.env.NODE_ENV === 'production') {
  Vue.use(VueAnalytics, {
    id: 'UA-61249489-10',
    disableScriptLoader: true, // 必须在html中完成初始化，这里显式禁止去下载ga脚本
    router, // 确保路由切换时可以自动统计
    autoTracking: {
      pageviewOnLoad: true // 网站初始化时做统计
    }
  })
}
