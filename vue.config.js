const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',
  lintOnSave: false,
  outputDir: 'dist', // 设置打包输出目录
  assetsDir: 'static', // 设置静态资源目录
  configureWebpack: {
    output: {
      filename: './static/js/[name].js', // JS 文件输出路径
      chunkFilename: './static/js/[name].js' // 分块文件输出路径
    }
  },
  css: {
    extract: {
      filename: './static/css/[name].css', // CSS 文件输出路径
      chunkFilename: './static/css/[name].css' // 分块 CSS 输出路径
    }
  },
});
