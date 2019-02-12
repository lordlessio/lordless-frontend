'use strict'

/**
 * 精确加法
 */

export const _add = function () {
  const nums = Array.from(arguments)
  if (nums.length < 2) return nums[0] || 0
  const digits = []

  for (const num of nums) {
    digits.push((num.toString().split('.')[1] || '').length)
  }
  const baseNum = Math.pow(10, digits.sort((a, b) => b - a)[0])
  return nums.reduce((a, b) => a + b * baseNum, 0) / baseNum
}

/**
 * 精确乘法
 */

export const _mul = function () {
  const nums = Array.from(arguments)
  console.log('==== _mul nums', arguments)
  if (nums.length < 2) return nums[0] || 0
  const digits = []

  for (const num of nums) {
    digits.push((num.toString().split('.')[1] || '').length)
  }
  const baseNum = Math.pow(10, digits.sort((a, b) => b - a)[0])
  return nums.reduce((a, b) => a * b * baseNum, 1) / Math.pow(baseNum, digits.length)
}

export const _strip = function (num, precision = 12) {
  return +parseFloat(num.toPrecision(precision))
}
