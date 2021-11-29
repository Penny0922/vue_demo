module.exports = {
    lintOnSave:false,
  devServer: {
      proxy: {
          '/api': {
              target: 'https://lianghj.top:8888/api/private/v1/', //接口域名（你请求的第三方接口）
              changeOrigin: true,             //是否跨域 （虚拟的站点需要更管origin）
              ws: true,                       //是否代理 websockets
              secure: true,                   //是否https接口
              pathRewrite: {                  //路径重置
                  '^/api': ''
              } 
          }
      }
    },
    configureWebpack: {    
        resolve: { extensions: [".ts", ".tsx", ".js", ".json"] },    
        module: {        
          rules: [    
            {    
              test: /.tsx?$/,    
              loader: 'ts-loader',    
              exclude: /node_modules/,    
              options: {
                appendTsSuffixTo: [/.vue$/],    
              }    
            }        
          ]    
        }    
      } 
};