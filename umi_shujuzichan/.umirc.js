
// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  proxy: {
    "/api": {
      "target": "http://192.168.221.9:8082/indicator/v1/",
      // "target": "http://10.70.119.181:18081/indicator/v1/",
      "changeOrigin": true,
      "pathRewrite": {
        "^/api": ""
      }
    }
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: false,
      dva: true,
      dynamicImport: false,
      title: 'umi_shujuzichan',
      dll: false,
      
      routes: {
        exclude: [
          /components\//,
        ],
      },
    }],
    
  ],
  chainWebpack(config, { webpack }) {
    // console.log(111, config.module.rule())
    // console.log(222, webpack());
    
    config.module.rule('gltf')
      .test(/\.(gltf)$/)
      .use('gltf-webpack-loader')
      .loader('gltf-webpack-loader')
    config.module.rule('gltf')
      .test(/\.(obj)$/)
      .use('webpack-obj-loader')
      .loader('webpack-obj-loader')
    // config.module.rule()
    //   .test(/\.(bin)$/)
    //   .use()
    //   .loader('file-loader')
    // config.plugins('ProvidePlugin')
    //   .init((Plugin, args) => new webpack.ProvidePlugin({
    //            THREE: ['three/examples/js/loaders/GLTFLoader'],
          // }))
    // config.resolve.modules
    config.module.rule()
      .test(require.resolve('three/examples/js/loaders/GLTFLoader'))
      .use('imports-loader?THREE=three')
      .loader('imports-loader?THREE=three')
      // .use('imports-loader?THREE=three')
    config.module.rule()
      .test(require.resolve('three/examples/js/loaders/GLTFLoader'))
      .use('exports-loader?THREE.GLTFLoader')
      .loader('exports-loader?THREE.GLTFLoader')
    // const ruleGltf = [
    //   {
    //     test: /\.(gltf)$/,
    //     use: [{
    //       loader: 'gltf-webpack-loader',
    //     }, ],
    //   },
    //   {
    //     test: require.resolve('three/examples/js/loaders/GLTFLoader'),
    //     use: 'imports-loader?THREE=three',
    //   }, {
    //     test: require.resolve('three/examples/js/loaders/GLTFLoader'),
    //     use: 'exports-loader?THREE.GLTFLoader',
    //   },

    // ]
    // config.module.rule.push(...ruleGltf)
  }
}
