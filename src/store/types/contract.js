
/**
 * contract store types
 */

const mutationTypes = {
  CONTRACT_SET_INSTANCE: 'setContractIntance',
  CONTRACT_SET_AIRDROP_TOKENS: 'setContractAirdropTokens'
}
const actionTypes = {
  CONTRACT_SET_INSTANCE: 'setContractIntance',
  CONTRACT_INIT_INSTANCE: 'initContract',
  CONTRACT_CHECK_CROWDSALE: 'checkCrowdsale',
  CONTRACT_SET_AIRDROP_TOKENS: 'setContractAirdropTokens_action'
}

module.exports = {
  mutationTypes,
  actionTypes
}
