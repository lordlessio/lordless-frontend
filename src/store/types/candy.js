
/**
 * candy store types
 */

const mutationTypes = {
  CANDY_SET_CANDY_PRICE: 'setCandyPrice_mutation',
  CANDY_SET_CANDY_CLAIMED: 'setCandyClaimed_mutation',
  CANDY_SET_CANDY_SYMBOLS: 'setCandySymbols_mutation'
}
const actionTypes = {
  CANDY_SET_CANDY_PRICE: 'setCandyPrice_action',
  CANDY_SET_CANDY_CLAIMED: 'setCandyClaimed_action',
  CANDY_SET_CANDY_SYMBOLS: 'setCandySymbols_action'
}

module.exports = {
  mutationTypes,
  actionTypes
}
