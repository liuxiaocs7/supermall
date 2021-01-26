module.exports = {
    configureWebpack: {
        resolve: {
            // 给文件夹配置别名
            alias: {
                'assets': '@/assest',
                'common': '@/common',
                'components': '@/components',
                'network': '@/network',
                'views': '@/views',
            }
        }
    }
}
