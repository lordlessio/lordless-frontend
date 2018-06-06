<template>
  <div id="app">
    <Header/>
    <div class="ld-main">
      <router-view/>
    </div>
    <Footer/>
  </div>
</template>

<script>
import Header from '@/components/header'
import Footer from '@/components/footer'
import { mapActions } from 'vuex'
export default {
  name: 'App',
  components: {
    Header,
    Footer
  },
  methods: {
    ...mapActions('user', {
      getUserByToken: 'GET_USER_BY_TOKEN'
    }),

    // 初始化 web3js
    initWeb3 () {
      if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        window.web3js = new Web3(web3.currentProvider)
      } else {
        console.log('No web3? You should consider trying MetaMask!')
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        window.web3js = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
      }
    },

    // 监听账户变化
    linstenAccout () {
      const accounts = web3js.eth.accounts[0]
      setInterval(() => {
        if (accounts && web3js.eth.accounts[0] !== accounts) {
          console.log('------账户失效')
        }
      }, 300)
    },

    // 监听主网络环境
    listenNetWork () {
      web3js.version.getNetwork((err, netId) => {
        console.log('getNetwork err', err, netId)
        switch (netId) {
          case '1':
            console.log('1：This is mainnet')
            break
          case '2':
            console.log('2：This is the deprecated Morden test network.')
            break
          case '3':
            console.log('3：This is the ropsten test network.')
            break
          case '4':
            console.log('4：This is the Rinkeby test network.')
            break
          case '42':
            console.log('42：This is the Kovan test network.')
            break
          default:
            console.log('other：This is an unknown network.')
        }
      })
    }
  },
  mounted () {
    this.getUserByToken()
    this.$nextTick(() => {
      this.initWeb3()
      this.listenNetWork()
      this.linstenAccout()
    })
  }
}
</script>
