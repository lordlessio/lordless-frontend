
import { getActivityByTx, postActivity } from 'api'
import { mapState } from 'vuex'
export default {
  data: () => {
    return {

      // ldb 合约检查状态
      // contractStatus: {

      //   // 合约初始化加载完成状态
      //   init: false,

      //   // 是否在市场挂售
      //   // isSell: false,

      //   // 当前ldb是否属于当前用户
      //   ldbNFTOwner: false,

      //   // 当前ldb挂售者是否属于当前用户
      //   crowdsaleOwner: false
      // },

      contractInterval: [],

      intervals: []
    }
  },
  computed: {
    ...mapState('user', [
      'userInfo'
    ]),
    ...mapState('contract', [
      'TavernNFTs',
      'NFTsCrowdsale'
    ]),
    account () {
      return this.userInfo.address || this.$root.$children[0].web3Opt.address || window.localStorage.getItem('currentAddress')
    }
  },
  methods: {
    /**
     * 合约检查 ldb 是否属于自身
     */
    // checkOwner (tokenId) {
    //   this.checkLdbNFT(tokenId)
    //   this.checkCrowdsale(tokenId)
    // },

    /**
     * 合约检查 721 资产状态
     */
    // checkLdbNFT (tokenId, TavernNFTs = this.TavernNFTs) {
    //   if (!TavernNFTs || !tokenId) return false

    //   // 合约参数
    //   const ownerOf = {
    //     name: 'ownerOf',
    //     values: [ tokenId ]
    //   }

    //   // 检查该 721 资产是否属于当前 metamask 用户
    //   TavernNFTs.methods(ownerOf.name, ownerOf.values)
    //     .then(d => {
    //       // this.contractStatus = Object.assign({}, this.contractStatus, {
    //       //   ldbNFTOwner: d === this.account
    //       // })
    //       this.$set(this.contractStatus, 'ldbNFTOwner', d === this.account)
    //       console.log('ldbNftOwner:', d === this.account)
    //     })
    //     .catch(() => {
    //       // this.contractStatus = Object.assign({}, this.contractStatus, {
    //       //   ldbNFTOwner: false
    //       // })
    //       this.$set(this.contractStatus, 'ldbNFTOwner', false)
    //     })
    // },

    // /**
    //  * 合约检查 721 资产市场状态
    //  */
    // checkCrowdsale (tokenId, NFTsCrowdsale = this.NFTsCrowdsale) {
    //   if (!NFTsCrowdsale || !tokenId) return false

    //   // 合约参数
    //   const isOnAuction = {
    //     name: 'isOnAuction',
    //     values: [ tokenId ]
    //   }

    //   // 合约检查该 721 资产是否在市场出售
    //   NFTsCrowdsale.methods(isOnAuction.name, isOnAuction.values)
    //     .then(d => {
    //       // this.contractStatus = Object.assign({}, this.contractStatus, {
    //       //   isSell: d,
    //       //   init: true
    //       // })
    //       this.$set(this.contractStatus, 'isSell', d)
    //       console.log('isSell:', d)
    //     })
    //     .catch(() => {
    //       // this.contractStatus = Object.assign({}, this.contractStatus, {
    //       //   isSell: false
    //       // })
    //       this.$set(this.contractStatus, 'isSell', false)
    //     })

    //   // 合约参数
    //   const getAuction = {
    //     name: 'getAuction',
    //     values: [ tokenId ]
    //   }

    //   // 合约检查该 721 资产是否属于当前 metamask 用户出售
    //   NFTsCrowdsale.methods(getAuction.name, getAuction.values)
    //     .then(d => {
    //       // this.contractStatus.crowdsaleOwner = d[0] === this.account
    //       this.$set(this.contractStatus, 'crowdsaleOwner', d[1] === this.account)
    //       this.$set(this.contractStatus, 'init', true)
    //       console.log('crowdsaleOwner:', d[1] === this.account)
    //     })
    //     .catch(() => {
    //       // this.contractStatus.crowdsaleOwner = false
    //       this.$set(this.contractStatus, 'crowdsaleOwner', false)
    //     })
    // },

    async checkCrowdsaleEvent ({ address, TavernNFTs = this.TavernNFTs, NFTsCrowdsale = this.NFTsCrowdsale } = {}, cb) {
      if (!address) return

      let timeout = null
      const loopFunc = () => {
        // 创建新定时器实例
        timeout = setTimeout(async () => {
          const bool = await TavernNFTs.methods('isApprovedForAll', [address, NFTsCrowdsale.address])

          clearTimeout(timeout)
          timeout = null

          if (bool) {
            return cb && cb()
          } else {
            return loopFunc()
          }
        }, 5000)
      }
      this.$once('hook:beforeDestroy', () => {
        timeout && clearTimeout(timeout)
      })
      return loopFunc()
      // this.intervals[index] = interval
    },

    /**
     * 检查 contract event 状态
     * @param {String} tx 合约地址
     * @param {Function} cb 需要执行的回调函数
     */
    async checkTxEvent ({ tx, action, loop = false, tokenId } = {}, cb) {
      if (!tx) return
      if (action) {
        await postActivity({ tx, action, tokenId })
      }
      if (!loop) return cb()

      // 创建新定时器实例
      let timeout = null
      const loopFunc = () => {
        timeout = setTimeout(async () => {
          clearTimeout(timeout)
          timeout = null

          const res = await getActivityByTx({ tx })

          const cbData = { data: res.data }
          console.log('cbData', cbData)

          if (res.code !== 1000) {
            cbData.err = res.errorMsg
          }

          if (res.code !== 1000 || res.data) return cb && cb(cbData)

          return loopFunc()
        }, 5000)
      }
      this.$once('hook:beforeDestroy', () => {
        timeout && clearTimeout(timeout)
      })
      return loopFunc()
    }

    /**
     * 清除 tx interval
     * @param {Object} interval 定时器实例
     */
  //   clearCInterval ({ index = 0, all = false } = {}) {
  //     const intervals = this.intervals || []
  //     if (!all && !intervals[index]) return
  //     if (all) {
  //       intervals.map(item => clearInterval(item))
  //       this.intervals = []
  //     } else {
  //       clearInterval(intervals[index])
  //       this.$set(this.intervals, index, null)
  //     }
  //   }
  }
  // beforeDestroy () {
  //   this.clearCInterval({ all: true })
  // }
}
