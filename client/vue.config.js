module.exports = {
  chainWebpack: config => {
    config
    .plugin('html')
    .tap(args => {
      args[0].title = 'Twitter'
      return args
    })
  },
    devServer: {
      proxy: {
        '^/API': {
          target: 'http://localhost:3000/',
          changeOrigin: true
        },
      }
    }
  }