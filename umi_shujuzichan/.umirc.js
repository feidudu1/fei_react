
// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  proxy: {
    "/api": {
      "target": "http://10.70.119.181:18081/indicator/v1/",
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
