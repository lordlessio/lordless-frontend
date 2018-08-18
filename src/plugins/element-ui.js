import Vue from 'vue'
import {
  Container, Header, Main, Aside,
  Col, Row,
  Tooltip, Progress, Select, Option, Carousel, CarouselItem,
  Tabs, TabPane, Dialog, Autocomplete, Pagination,
  Collapse, CollapseItem
} from 'element-ui'

// 使用 element-ui 组件
Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Aside)

Vue.use(Col)
Vue.use(Row)

Vue.use(Tooltip)
// Vue.use(Message)
Vue.use(Progress)
Vue.use(Select)
Vue.use(Option)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Dialog)
Vue.use(Autocomplete)
Vue.use(Pagination)

// Vue.use(Slider)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Collapse)
Vue.use(CollapseItem)

// 配置 element 默认参数
Vue.prototype.$ELEMENT = { size: 'large', zIndex: 3000 }
