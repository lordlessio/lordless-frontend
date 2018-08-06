
/**
 * layout store types
 */

const mutationTypes = {
  LAYOUT_SET_HEADER_OPTIONS: 'layoutSetHeaderOpts',
  LAYOUT_SET_FOOTER_OPTIONS: 'layoutSetFooterOpts',
  LAYOUT_SET_APP_OPTIONS: 'layoutSetAppOpts',
  LAYOUT_SET_BLURS: 'layoutSetBlurs',
  LAYOUT_SET_MESSAGE_TIP: 'layoutSetMsgTip',
  LAYOUT_SET_META_OPEN: 'layoutSetMetaOpen'
}
const actionTypes = {
  LAYOUT_SET_APP_OPTIONS: 'layoutSetAppOpts',
  LAYOUT_SET_BLURS: 'layoutSetBlurs',
  LAYOUT_SET_META_OPEN: 'layoutSetMetaOpen'
}

module.exports = {
  mutationTypes,
  actionTypes
}
