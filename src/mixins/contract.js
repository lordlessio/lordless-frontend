
import { getActivityByTx, postActivity } from 'api'
import { mapState } from 'vuex'
export default {
  data: () => {
    return {

      // ldb 合约检查状态
      contractStatus: {

        // 合约初始化加载完成状态
        init: false,

        // 是否在市场挂售
        // isSell: false,

        // 当前ldb是否属于当前用户
        ldbNFTOwner: false,

        // 当前ldb挂售者是否属于当前用户
        crowdsaleOwner: false
      },

      contractInterval: [],

      intervals: []
    }
  },
  computed: {
    ...mapState('user', [
      'userInfo'
    ]),
    ...mapState('contract', [
      'LDBNFTs',
      'NFTsCrowdsale'
    ]),
    account () {
      return this.userInfo.address || this.$root.$children[0].web3Opt.address
    }
  },
  methods: {
    /**
     * 合约检查 ldb 是否属于自身
     */
    checkOwner (tokenId) {
      this.checkLdbNFT(tokenId)
      this.checkCrowdsale(tokenId)
    },

    /**
     * 合约检查 721 资产状态
     */
    checkLdbNFT (tokenId, LDBNFTs = this.LDBNFTs) {
      if (!LDBNFTs || !tokenId) return false

      // 合约参数
      const ownerOf = {
        name: 'ownerOf',
        values: [ tokenId ]
      }

      // 检查该 721 资产是否属于当前 metamask 用户
      LDBNFTs.methods(ownerOf.name, ownerOf.values)
        .then(d => {
          // this.contractStatus = Object.assign({}, this.contractStatus, {
          //   ldbNFTOwner: d === this.account
          // })
          this.$set(this.contractStatus, 'ldbNFTOwner', d === this.account)
          console.log('ldbNftOwner:', d === this.account)
        })
        .catch(() => {
          // this.contractStatus = Object.assign({}, this.contractStatus, {
          //   ldbNFTOwner: false
          // })
          this.$set(this.contractStatus, 'ldbNFTOwner', false)
        })
    },

    /**
     * 合约检查 721 资产市场状态
     */
    checkCrowdsale (tokenId, NFTsCrowdsale = this.NFTsCrowdsale) {
      if (!NFTsCrowdsale || !tokenId) return false

      // 合约参数
      // const isOnAuction = {
      //   name: 'isOnAuction',
      //   values: [ tokenId ]
      // }

      // // 合约检查该 721 资产是否在市场出售
      // NFTsCrowdsale.methods(isOnAuction.name, isOnAuction.values)
      //   .then(d => {
      //     // this.contractStatus = Object.assign({}, this.contractStatus, {
      //     //   isSell: d,
      //     //   init: true
      //     // })
      //     this.$set(this.contractStatus, 'isSell', d)
      //     console.log('isSell:', d)
      //   })
      //   .catch(() => {
      //     // this.contractStatus = Object.assign({}, this.contractStatus, {
      //     //   isSell: false
      //     // })
      //     this.$set(this.contractStatus, 'isSell', false)
      //   })

      // 合约参数
      const getAuction = {
        name: 'getAuction',
        values: [ tokenId ]
      }

      // 合约检查该 721 资产是否属于当前 metamask 用户出售
      NFTsCrowdsale.methods(getAuction.name, getAuction.values)
        .then(d => {
          // this.contractStatus.crowdsaleOwner = d[0] === this.account
          this.$set(this.contractStatus, 'crowdsaleOwner', d[1] === this.account)
          this.$set(this.contractStatus, 'init', true)
          console.log('crowdsaleOwner:', d[1] === this.account)
        })
        .catch(() => {
          // this.contractStatus.crowdsaleOwner = false
          this.$set(this.contractStatus, 'crowdsaleOwner', false)
        })
    },

    /**
     * 检查 contract event 状态
     * @param {String} tx 合约地址
     * @param {Function} cb 需要执行的回调函数
     */
    async checkTxEvent ({ tx, action } = {}, cb) {
      if (!tx) return
      if (action) {
        await postActivity({ tx, action })
      }
      const index = this.intervals.length
      let interval = this.intervals[index]
      // 初始化实例
      if (interval) this.clearCInterval({ index })

      // 创建新定时器实例
      interval = setInterval(async () => {
        const res = await getActivityByTx({ tx })

        // 如果当前合约执行完毕，清除定时器，执行回调
        if (res.code === 1000 && !res.data.isPending) {
          if (cb) cb()
          this.clearCInterval({ index })
        } else if (res.code !== 1000) {
          if (cb) cb(res.errorMsg)
          this.clearCInterval({ index })
        } else {
          if (cb) cb()
          this.clearCInterval({ index })
        }
      }, 5000)

      this.intervals[index] = interval

      return interval
    },

    /**
     * 清除 tx interval
     * @param {Object} interval 定时器实例
     */
    clearCInterval ({ index = 0, all = false } = {}) {
      const intervals = this.intervals || []
      if (!all && !intervals[index]) return
      if (all) {
        intervals.map(item => clearInterval(item))
        this.intervals = []
      } else {
        clearInterval(intervals[index])
        this.intervals[index] = null
      }
    }
  },
  beforeDestroy () {
    this.clearCInterval({ all: true })
  }
}
