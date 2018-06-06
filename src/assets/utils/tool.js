
/**
 * 获取 data 数据类型
 * @param {Object} data 需要分析的数据
 *
 * 返回数组形式， String1: 数据详细类型，String2：数据大类型.一般为 'object'
 * @return {Array} [ String1, String2 ]
 * x
 */
export const objectT = (data) => {
  const type = typeof data
  if (type !== 'object') {
    return [type, type]
  }
  let objT = Object.prototype.toString.call(data)
  objT = (objT.split(' ')[1].replace(/]/, '')).toLocaleLowerCase()
  return [objT, type]
}
export const stringifyParse = (data) => {
  if (objectT(data)[1] !== 'object') return data
  return JSON.parse(JSON.stringify(data))
}
