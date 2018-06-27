import { login } from 'api'
import { mapState, mapActions } from 'vuex'
import { actionTypes } from '@/store/types'
export default {
  computed: {
    ...mapState('web3', [
      'web3Opt',
      'userExpired'
    ])
  },
  methods: {
    ...mapActions('user', [
      actionTypes.USER_SET_USER_BY_TOKEN,
      actionTypes.USER_SET_USER_TOKEN
    ]),

    metaMaskLogin () {
      const { web3js, address } = this.web3Opt
      if (!address) return
      const str = web3js.toHex('lordless')
      // 调起 metamask personal_sign 方法
      web3js.personal.sign(str, web3js.eth.defaultAccount, async (err, result) => {
        if (!err) {
          if (result) this.login(result, address)
        }
        if (err) this.loginError()
      })
    },
    async login (sigStr, address) {
      const res = await login({ sigStr, address })
      if (res.code === 1000) {
        console.log('=====', res)
        this[actionTypes.USER_SET_USER_TOKEN]({ address, token: res.token })
        this[actionTypes.USER_SET_USER_BY_TOKEN]()
      } else this.loginError(res)
      console.log('-----res', res)
    }
  }
}
