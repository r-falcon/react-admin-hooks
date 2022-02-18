/**
 * umi 配置. 和config/config.js 二选一
 */
// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  // 配置式路由
  routes: [
    {
      path: '/login',
      component: '../pages/login/index'
    },
    {
      path: '/',
      component: '../layouts/index',
      routes: [
        {
          path: '/',
          component: '../pages/index'
        },
        {
          path: '/user/index',
          component: '../pages/user/index'
        },
        {
          path: '/center/index',
          component: '../pages/user/center/index'
        },
        {
          path: '/right/role',
          component: '../pages/right/role'
        },
        {
          path: '/right/index',
          component: '../pages/right/index'
        },
        {
          path: '/goods/list',
          component: '../pages/goods/list'
        },
        {
          path: '/goods/params',
          component: '../pages/goods/params'
        },
        {
          path: '/goods/add',
          component: '../pages/goods/add'
        },
        {
          path: '/order/list',
          component: '../pages/order/index'
        },
        {
          path: '/chart/show',
          component: '../pages/chart/show'
        }
      ]
    }
  ],
  // 配置代理
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:8888',
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    }
  },
  // 插件配置
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: false,
        title: 'react-admin',
        links: [
          {
            rel: 'icon',
            href: '/favicon.png'
          }
        ],
        dll: false,
        routes: {
          exclude: [
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//
          ]
        }
      }
    ]
  ],
  // 配置路径别名
  alias: {
    '@': require('path').resolve(__dirname, 'src')
  }
}
