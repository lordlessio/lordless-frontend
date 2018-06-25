import Vue from 'vue'
import Vuex from 'vuex'

import user from './user'
import layout from './layout'
import web3 from './web3'
import ldb from './ldb'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {},
  mutations: {},
  modules: {
    user,
    layout,
    web3,
    ldb
  }
})

export default store
