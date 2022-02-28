### commit 规范
- feat: ⼀个新特性,(新功能)
- fix: 修了⼀个 Bug
- docs: 更新了⽂档（⽐如改了 Readme）
- style: 代码的样式美化，不涉及到功能修改（⽐如改了缩进，css 修改不算）
- refactor: ⼀些代码结构上优化，既不是新特性也不是修 Bug（⽐如函数改个名字）
- perf: 优化了性能的代码改动
- test: 新增或者修改已有的测试代码
- chore: 跟仓库主要业务⽆关的构建/⼯程依赖/⼯具等功能改动（⽐如新增⼀个⽂档⽣成⼯具）
### 搭建项目

- 创建文件夹 `mkdir myapp`
- 搭建项目 `yarn create umi` - `app` - `N` - `antd,dva`

### 安装依赖

- 打开项目文件夹 `cd myapp`
- 安装依赖 `yarn`

### 启动项目
`yarn start`

### 更新layout布局
- 修改src/layouts 完成页面布局

### 约定式路由 vs 配置式路由
- 先采用配置式路由，在 .umirc.js 中配置路由

### 创建页面[默认创建在src目录下]
`umi g page user/index`
`umi g page index --typescript --less` --typescript,--less 约定初始化的模式，可以省略

### 创建导航条对应的空页面
- 根据创建页面的命令添加相应的pages，并配置好相应的路由
- 在 src/layouts/index 文件中将导航定位到相应的页面

### 创建登录页

### bug处理-登录表单
- umi创建的项目使用的antd为3.x版本，现在将antd升级到4.x版本
- 去官网，重新安装antd依赖
`yarn add antd --save`
- 会发现安装完antd4.x后，报错：Warning: [antd: Icon] Empty Icon.Icon不能正常使用
- 首先安装图标组件包 `yarn add @ant-design/icons  --save`
- 然后参考[官网](https://ant.design/components/icon-cn/)引入使用

### 前台端接口联调
- 代理配置 .umirc.js文件 - proxy
- 请求封装 umi-request
- 安装 `yarn add umi-request --save`
- umi-request 的二次封装： src/utils/request
- 统一接口管理： src/services

### git提交出错
- 报错信息
`husky > pre-commit hook failed (add --no-verify to bypass)`,的解决办法
- 解决办法[用第三种方法解决,第二种方法删除pre-commit再次提交也可以成功]
- 卸载husky。只要把项目的package.json文件中devDependencies节点下的husky库删掉，然后重新npm i 一次即可。或者直接在项目根目录下执行npm uninstall husky --save也可以，再次提交，自动化测试功能就屏蔽掉
- 进入项目的.git文件夹(文件夹默认隐藏,可先设置显示或者命令ls查找),再进入hooks文件夹,删除pre-commit文件,重新git commit -m 'xxx' git push即可。
- 将git commit -m "XXX" 改为 git commit --no-verify -m "XXX"

### 配置代码约束和git提交规范
- 当配置完毕提交的时候会出现如下报错
```js
0:0  warning  File ignored by default.  Use a negated ignore pattern (like "--ignore-pattern '!<relative/path/to/filename>'") to override
```
- 解决
变动 .eslintrc.js文件的env配置，添加一行代码
```js
module.exports = {
  env: {
    "embertest": true
  }
};
```

- 写layout布局的时候git 提交因为使用props报错
```js
222:53  error  'children' is missing in props validation  react/prop-types
```
```jsx
// 运行没有问题，git提交报错
<ConfigProvider locale={ZhCN}>
  <div className={styles.main}>{props.children}</div>
</ConfigProvider>
```
- 解决
```jsx
import PropTypes from 'prop-types'

const BasicLayout = ({children}) => {
  return <div>{children}</div>
} 
// 注意看清大小写
BasicLayout.propTypes = {
  children: PropTypes.node
}
```

- 写layout布局 git提交报错
```js
 4:16  error  Component definition is missing display name  react/display-name
```

- 解决
```js
// 先给displayName赋初值，再导出
BasicLayout.displayName = 'BasicLayout'
export default BasicLayout
```

- 写个人中心，运行时form表单发出警告
```js
Input elements should have autocomplete attributes
```
- 解决
```js
// input添加autocomplete属性
 <Input
  className={styles.iptWidth}
  placeholder="请输入邮箱"
  autoComplete="off"
/>
```

- 控制台发出警告
```js
 [Violation] Added non-passive event listener to a scroll-blocking 'mousewheel' event. Consider marking event handler as 'passive' to make the page more responsive
```

- 解决
安装 `npm i default-passive-events -S`
```js
// src下的app.js中加入
import 'default-passive-events'
```

- 书写代码过程中如何实现useState()改变值后立即获取到最新的状态
```js
function App() {
  const [state, setstate] = useState(0);

  const setT = () => {
    setstate(2);
    func();
  };

  const func = () => {
    // 点击后理应获取到state的最新值2，但是控制台打印0
    console.log(state);
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={setT}>set 2</button>
      </header>
    </div>
  );
}
```
- 解决：通过自定义hooks实现useState改变值后获取到最新状态
```js
// 自定义hooks实现如下
import { useEffect, useState, useCallback } from 'react'

const useSyncCallback = callback => {
  const [proxyState, setProxyState] = useState({ current: false })

  const Func = useCallback(() => {
    setProxyState({ current: true })
  }, [proxyState])

  useEffect(() => {
    if (proxyState.current === true) setProxyState({ current: false })
  }, [proxyState])

  useEffect(() => {
    proxyState.current && callback()
  })

  return Func
}

export default useSyncCallback
```
