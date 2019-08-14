
// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  proxy: {
    "/api": {
      "target": "http://192.168.221.9:18181/indicator/v1/",
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
}
