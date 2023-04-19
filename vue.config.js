module.exports = {
    lintOnSave: false,
    publicPath: process.env.VUE_APP_BASE_ASSETS,
    // assetsDir: 'static',
    devServer: {
        open: true,
        port: 80,
        proxy: {
            "/api": {
                target: 'http://124.71.161.213:8084',
                pathRewrite: { "^/api": "" },
                ws: true,
                changeOrigin: true
            }
        }
    }
}