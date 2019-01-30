
/**
 * contract store types
 */

const mutationTypes = {
  CONTRACT_SET_INSTANCE: 'setContractIntance_mutation',
  CONTRACT_SET_AIRDROP_TOKENS: 'setContractAirdropTokens_mutation',
  CONTRACT_SET_LUCKYBLOCK_TOKEN_ALLOWANCE: 'setLuckyblockTokenAllowance_mutation',
  CONTRACT_SET_HOPS_PLAN_TOKEN_ALLOWANCE: 'setHOPSPlanTokenAllowance_mutation',
  CONTRACT_SET_BOUNTY_TOKEN_ALLOWANCE: 'setBountyTokenAllowance_mutation',
  CONTRACT_SET_BOUNTYNFT_APPROVE: 'setBountyNFTApprove_mutation',
  CONTRACT_SET_TOKEN_BALANCE: 'setTokenBalance_mutation'
}
const actionTypes = {
  CONTRACT_SET_INSTANCE: 'setContractIntance_action',
  CONTRACT_INIT_INSTANCE: 'initContract_action',
  CONTRACT_CHECK_CROWDSALE: 'checkCrowdsale_action',
  CONTRACT_SET_LUCKYBLOCK_TOKEN_ALLOWANCE: 'setLuckyblockTokenAllowance_action',
  CONTRACT_SET_HOPS_PLAN_TOKEN_ALLOWANCE: 'setHOPSPlanTokenAllowance_action',
  CONTRACT_SET_BOUNTY_TOKEN_ALLOWANCE: 'setBountyTokenAllowance_action',
  CONTRACT_CHECK_BOUNTYNFT_APPROVE: 'setBountyNFTApprove_action',
  CONTRACT_SET_BOUNTYNFT_APPROVE: 'setBountyNFTApprove_action',
  CONTRACT_SET_AIRDROP_TOKENS: 'setContractAirdropTokens_action',
  CONTRACT_SET_TOKENS_BALANCE: 'setTokensBalance_action'
}

module.exports = {
  mutationTypes,
  actionTypes
}
