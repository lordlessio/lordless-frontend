
/**
 * contract store types
 */

const mutationTypes = {
  CONTRACT_SET_INSTANCE: 'setContractIntance_mutation',
  CONTRACT_SET_AIRDROP_TOKENS: 'setContractAirdropTokens_mutation',
  CONTRACT_SET_TOKEN_ALLOWANCE: 'setTokenAllowance_mutation'
}
const actionTypes = {
  CONTRACT_SET_INSTANCE: 'setContractIntance_action',
  CONTRACT_INIT_INSTANCE: 'initContract_action',
  CONTRACT_CHECK_CROWDSALE: 'checkCrowdsale_action',
  CONTRACT_SET_AIRDROP_TOKENS: 'setContractAirdropTokens_action'
}

module.exports = {
  mutationTypes,
  actionTypes
}
