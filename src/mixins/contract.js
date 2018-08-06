
import { getTxDetail } from 'api'
import { mapState } from 'vuex'
export default {
  data: () => {
    return {

      // ldb 合约检查状态
      contractStatus: {

        // 合约初始化加载完成状态
        init: false,

        // 是否在市场挂售
        isSell: false,

        // 当前ldb是否属于当前用户
        ldbNFTOwner: false,

        // 当前ldb挂售者是否属于当前用户
        crowdsaleOwner: false
      },

      contractInterval: null
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

      // 检查该 721 资产是否属于当前 metamask 用户
      LDBNFTs.ownerOf(tokenId)
        .then(d => {
          this.contractStatus = Object.assign({}, this.contractStatus, {
            ldbNFTOwner: d === this.account
          })
          console.log('ldbNftOwner:', d === this.account)
        })
        .catch(() => {
          this.contractStatus = Object.assign({}, this.contractStatus, {
            ldbNFTOwner: false
          })
        })
    },

    /**
     * 合约检查 721 资产市场状态
     */
    checkCrowdsale (tokenId, NFTsCrowdsale = this.NFTsCrowdsale) {
      if (!NFTsCrowdsale || !tokenId) return false

      // 合约检查该 721 资产是否在市场出售
      NFTsCrowdsale.isOnAuction(tokenId)
        .then(d => {
          this.contractStatus = Object.assign({}, this.contractStatus, {
            isSell: d,
            init: true
          })
          console.log('isSell:', d)
        })
        .catch(() => {
          this.contractStatus = Object.assign({}, this.contractStatus, {
            isSell: false
          })
        })

      // 合约检查该 721 资产是否属于当前 metamask 用户出售
      NFTsCrowdsale.getAuction(tokenId)
        .then(d => {
          this.contractStatus.crowdsaleOwner = d[0] === this.account
          console.log('crowdsaleOwner:', d[0] === this.account)
        })
        .catch(() => {
          this.contractStatus.crowdsaleOwner = false
        })
    },

    /**
     * 检查 contract event 状态
     * @param {String} tx 合约地址
     * @param {Function} cb 需要执行的回调函数
     */
    async checkTxEvent (tx, cb, interval = this.contractInterval) {
      // 初始化实例
      if (interval) this.clearCInterval(interval)

      // 创建新定时器实例
      interval = setInterval(async () => {
        const res = await getTxDetail({ tx })

        // 如果当前合约执行完毕，清除定时器，执行回调
        if (res.code === 1000 && res.data.response.status) {
          if (cb) cb()
          this.clearCInterval(interval)
        } else if (res.code !== 1000) {
          if (cb) cb(res.errorMsg)
          this.clearCInterval(interval)
        } else {
          if (cb) cb()
          this.clearCInterval(interval)
        }
      }, 5000)

      return interval
    },

    /**
     * 清除 tx interval
     * @param {Object} interval 定时器实例
     */
    clearCInterval (interval = this.contractInterval) {
      if (!interval) return
      clearInterval(interval)
      interval = null
    }
  },
  beforeDestroy () {
    this.clearCInterval()
  }
}
