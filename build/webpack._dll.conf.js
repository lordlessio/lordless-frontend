const webpack = require('webpack');
const library = '[name]_dll';
const path = require('path');
// const args = require('minimist')(process.argv.slice(2));
// console.log(args.env)

module.exports = {
  entry: {
    vue: ['vue', 'vue-router', 'vuex-router-sync', 'vuex', 'vue-i18n'],
    utils: ['date-fns', 'axios', 'lodash', 'clipboard', 'ethereum-blockies'],
    // mapbox: ['mapbox-gl']
  },
  output: {
    path: path.join(__dirname, '../dist_dll/'),
    filename: 'js/[name].dll.js',
    library
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      // 最紧凑的输出
      beautify: false,
      // 删除所有的注释
      comments: false,
      compress: {
        // 在UglifyJs删除没有用到的代码时不输出警告
        warnings: false,
        // 删除所有的 `console` 语句
        // 还可以兼容ie浏览器
        drop_console: true,
        // 内嵌定义了但是只用到一次的变量
        collapse_vars: true,
        // 提取出出现多次但是没有定义成变量去引用的静态值
        reduce_vars: true
      }
    }),
    new webpack.DllPlugin({
      path: path.join(__dirname, '../dist_dll/manifest/[name]-manifest.json'),
      // This must match the output.library option above
      name: library,
      context: path.join(__dirname, '../dist_dll/manifest')
    })
  ]
}
