export const profillMethods = (web3) => {
  let lordlessMethods = {}
  console.log('----- lordlessMethods')
  // 注册 sign 函数
  Object.defineProperty(lordlessMethods, 'sign', {
    value: (message, address) => {
      return new Promise((resolve, reject) => {
        if (window.imToken) {
          window.imToken.callAPI('transaction.personalSign', { message, address }, function (err, result) {
            resolve({ err, result })
          })
        } else {
          // 调起通用 web3 的 personal_sign 方法
          web3 && web3.personal.sign(web3.toHex(message), address, (err, result) => {
            resolve({ err, result })
          })
        }
      })
    }
  })

  Object.defineProperty(lordlessMethods, 'buy', {
    value: (params) => {
      return new Promise((resolve, reject) => {
        if (window.imToken) {
          imToken.callAPI('transaction.tokenPay', params, function (err, txHash) {
            if (err) {
              reject(err)
            } else {
              resolve(txHash)
            }
          })
        } else {
          web3.eth.sendTransaction(params, function (err, txHash) {
            if (err) {
              reject(err)
            } else {
              resolve(txHash)
            }
          })
        }
      })
    }
  })
  window.lordlessMethods = lordlessMethods
}
