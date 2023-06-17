# Webpack 进阶使用

## Dev Server (自动编译)

1. 通过 watch 模式+BrowserSync 实现
   1. 使用 --watch 模式启动
   2. 使用 BrowerSync 刷新浏览器
2. Webpack Dev Server

   1. 从 npm 上安装`webpack-dev-server`
   2. 启动`webpack-dev-server`

      **webpack-dev-server 在 webpack-cli 为 4.x 的版本下运行会报错，因为 4.x 的 webpack-cli 将`config-yargs.js`删除了，所以需要安装 3.x 的 webpack-cli 来启动 webpack-dev-server**

      webpack-dev-server 的配置文件可以在 webpack.config.js 中通过配置 devServer 属性来编写

      webpack-dev-server 为了提高工作速率，它并没有将打包结果写入到磁盘中，而是暂时存放在内存中

      webpack-dev-server 可以配置代理 proxy，用来解决跨域请求问题

## Source Map (源密码地图)

Source Map 是一个 JSON 格式的文件，记录着转换前和转换后代码的映射关系：

- version：指定所使用的 Source Map 标准版本
- source：记录转换前的源文件名称（多个文件打包到同一个文件中）
- names：源代码中使用的成员名称
- mappings：是一个 base64-VLQ 编码的字符串，里面记录的信息就是转换后代码中字符于转换前代码中字符的映射关系

### 使用

开启：

```javascript
// ./webpack.config.js
module.exports = {
	devtool: "source-map", // source map 设置
};
```

现阶段 Webpack 支持的 Source Map 模式有很多种，每种模式下生成的 Source Map 效果和生成速度不一样。

- eval 模式

  eval 模式会将每个模块种的代码都被包裹到了一个 eval 函数中，而且每段模块代码的最后都会通过 sourceURL 的方式声明这个模块对应的源文件路径。

  但是 eval 模式并不会生成 Source Map 文件，所以它的构建速度快，但只能定位源文件的文件路径，无法知道具体的行列信息。

- eval-source-map 模式

  eval-source-map 模式同 eval 模式一样，但是它能够定位具体的行列信息，会生成 Source Map 文件，所以相对 eval 模式构建速度慢一点。

- cheap-eval-source-map 模式

  cheap-eval-source-map 模式就是阉割版的 eval-source-map 模式，虽然也生成了 Source Map 文件，但是只能定位到行，无法定位到列，用构建的速度换取了构建的效果。

- cheap-module-eval-source-map 模式

  cheap-eval-source-map 模式中的代码是经过 ES6 转换后的，但是 cheap-module-eval-source-map 模式的代码就和我们写的代码一摸一样了。

选用哪种模式的思考：

1. 开发环境下：

选择使用`cheap-module-eval-source-map`模式：

- 在使用框架构建代码之后，以 React 和 Vue.js 为例，无论是 JSX 还是 vue 单文件组件，Loader 转换后差别都很大，我需要调试 Loader 转换前的源代码
- 一般情况下，编写的代码每行不会超过 80 个字符，因此能够定位到行到位置就够了，而且省略列信息还可以提升构建速度
- 虽然在这种模式下启动打包会比较慢，但大多数时间内我使用的 webpack-dev-server 都是在监视模式下重新打包，它重新打包的速度非常快

2. 生成环境下：

选用`none`模式：

- Source Map 会暴露我的源代码到生产环境。如果没有控制 Source Map 文件访问权限的话，但凡是有点技术的人都可以很容易的复原项目中涉及的绝大多数源代码，这非常不合理也不安全
- 其次，调试应该是开发阶段的事情，你应该在开发阶段就尽可能找到所有问题和隐患，而不是到了生产环境中再去全民公测

注意，Source Map 并不是 Webpack 特有的功能，只是 Webpack 支持 Source Map，大多数的构建或编译工具也都支持 Source Map。

## HMR（模块热替换）

模块热替换主要用来解决在我们配置了 Webpack Dev Server 自动刷新时都会从新打包，这样会将某些页面没有修改的状态丢失掉，因此才出现了`HMR`的设计。

定义：

HMR 全称 Hot Module Replacement，指在应用运行的过程中，实时的去替换掉应用中的某个模块，而应用的运行状态不会因此而改变。

使用：

- 在运行 webpack-dev-server 命令时，通过`--hot`参数去开启。
- 在配置文件中添加 devServer 配置来实现

  ```javascript
  // ./webpack.config.js
  const webpack = require("webpack");
  module.exports = {
  	// ...
  	devServer: {
  		// 开启 HMR 特性，如果资源不支持 HMR 会 fallback 到 live reloading
  		hot: true,
  		// 只使用 HMR，不会 fallback 到 live reloading
  		// hotOnly: true
  	},
  	plugins: [
  		// ...
  		// HMR特性所需要的插件
  		new webpack.HotModuleReplacementPlugin(),
  	],
  };
  ```

**注意**

HMR 并不像 Webpack 的其他特性一样可以开箱即用，需要有一些额外的操作；除了部分框架继承（如 vue-cli、create-react-app）以及部分 Loader（如：style-loader）之外，还是需要我们通过代码来处理当 js 更新后，如何将更新后的模块替换到页面中。

### HMR APIs

HotModuleReplacementPlugin 为我们的 JavaScript 提供了一套用于处理 HMR 的 API，我们需要在我们自己的代码中，使用这套 API 将更新后的模块替换到正在运行的页面中。

比如主入口文件发生变化，那就必须更新所有模块：

```javascript
// ./index.js
// ...原本的业务代码
module.hot.accept("./editor", () => {
	// 当 ./editor.js更新，自动执行此函数
	console.log("editor更新了");
	// 手动保存editor中的状态就可以实现原来的热加载
	console.log(...editor);
});
```

[React HMR 解决方案](https://github.com/gaearon/react-hot-loader)

## Tree Shaking

Tree-shaking 最早是`Rollup`中推出的一个特性，Webpack 从 2.0 开始支持这个特性，作用就是用来清除应用中的未引用代码（dead-code）。

需要注意的是，Tree-shaking 并不是指 Webpack 中的某一个配置选项，而是一组功能搭配使用过后实现的效果，这组功能在生产模式下都会自动启用，所以使用生产模式打包就会有 Tree-shaking 的效果。

**在 none 模式下打开 Tree Shaking**

- 配置 webpack config 的`optimization`属性

  ```javascript
  // ./webpack.config.js
  module.exports = {
  	// ...其他配置
  	optimization: {
  		// 模块只导出被使用的成员
  		usedExports: true,
  	},
  };
  ```

- 配置`usedExports`后，只能让那些代码不导出，还需要配置`minimize`进行压缩才能清除这部分代码

  ```javascript
  // ./webpack.config.js
  module.exports = {
  	// ...其他配置
  	optimization: {
  		// 模块只导出被使用的成员
  		usedExports: true,
  		// 压缩输出结果
  		minimize: true,
  	},
  };
  ```

- tree shaking 之后可以通过`concatenateModules`继续优化输出

  `concatenateModules`配置的作用就是尽可能将所有的模块合并到一起输出到一个函数中，这样既提升了运行效率，又减少了代码的体积。

  ```javascript
  // ./webpack.config.js
  module.exports = {
  	// ...其他配置
  	optimization: {
  		// 模块只导出被使用的成员
  		usedExports: true,
  		// 压缩输出结果
  		minimize: true,
  		// 尽可能的合并每一个模块到一个函数中
  		concatenateModules: true,
  	},
  };
  ```

**Tree Shaking 实现的前提是 ES Modules**，也就是说，**最终交给 Webpack 打包的代码，必须是使用 ES Modules 的方式来组织的模块化**

这样会有一个问题就是，如果使用 babel-loader 对源码进行预处理的时候，而 Babel 在转换 js 代码时，很有可能处理掉代码中的 ES Modules 部分，把它们转换成 CommonJS 的方式。

Babel 配置中有一个 preset（预设插件集合），如@babel/preset-env，这个预设里面就有转换 ES Modules 的插件，这样 Tree Shaking 就会不生效了。
**Babel（8.x）的版本中默认不开启 ES Modules 转换的插件**

## sideEffects（副作用）

定义：

模块的副作用指的就是模块执行的时候除了导出成员，是否还做了其他的事情。

**Tree Shaking 只能移除没有用到的代码，而想要完整的移除没有用到的模块，则需要开启 sideEffects**

```javascript
// ./webpack.config.js
module.exports = {
	optimization: {
		sideEffects: true,
	},
};
```

此时 webpack 在打包某个模块之前，会先检查这个模块所属的 package.json 中的 sideEffects 标识，如果没有副作用的话，这些没有用到的模块就不会被打包。

也可以在项目中的 package.json 中通过添加 sideEffects 字段来判断是否要开启。

注意：很多基于原型的扩展方式，比如 polyfill 库中，都会更改全局对象但并不引用，这时使用 sideEffects 模式打包就有可能出错，最好的方法就是在 package.json 保留副作用的模块路径（可以使用**通配符**）

```json
// ./package.json
{
	// ...其他配置
	"sideEffects": ["./src/extend.js", "*.css"]
}
```

> 尽量不要写影响全局的副作用代码

## Code Splittig（分块打包）

当应用代码越来越大的时候，打包到同一个文件中会使代码的加载受到影响，浪费不必要的流量和带宽，而为了解决这一问题，webpack 设计了一种 code splitting 分包模式。

Code Splitting 通过把项目中的资源模块按照我们设计的规则打包到不同的 bundle 中，从而降低应用的启动成本，提高响应速度。

方式：

- 根据业务不同配置多个打包入口，输出多个打包结果
- 结合 ES Modules 的动态导入（Dynamic Imports）特性，按需加载模块

#### 多入口打包

只需要在对 webpack 配置文件中的`entry`添加多个属性即可，同时还可以配置`output.filename `来生成不同的打包名称：

```javascript
// ./webpack.config.js
module.exports = {
	entry: {
		index: "./src/index.js",
		album: "./src/album.js",
	},
	output: {
		filename: "[name].bundle.js", // [name]是入口名称
	},
	// ...其他配置
};
```

还可以通过`html-webpack-plugin`来配置生成多页面应用，这里就不写了。

#### 提取公共模块

多入口打包会存在一些公共使用的模块，这些模块代码会被打包多次，如果是一些大的公共模块代码比如 jQuery，则不利于公共模块的缓存。

提取公共模块的配置很简单，只需要在 webpack 配置中开启`splitChunks`就行了。

```javascript
// ./webpack.config.js
module.exports = {
	entry: {
		index: "./src/index.js",
		album: "./src/album.js",
	},
	output: {
		filename: "[name].bundle.js", // [name]是入口名称
	},
	optimization: {
		splitChunks: {
			// 自动提取所有公共模块到单独的bundle
			chunks: "all",
		},
	},
	// ...其他配置
};
```

#### 动态导入

除了多入口打包的方式，Code Splitting 更常见的实现方式还是结合 ES Modules 的动态导入特性，从而实现按需加载。

```javascript
// ./src/test.js

// import moment from 'moment';
const formatTime = time => {
	return import("moment").then(({ default: moment }) => {
		return moment(time).format("YYYY-WW-DD HH:mm:ss");
	});
};

const add = (a, b) => {
	return a + b;
};
```

#### 魔法注释

魔法注释就是给这些动态加入的 js 命名的功能：

```javascript
import(/* webpackChunkName: 'moment' */ "moment").then(
	({ defalut: moment }) => {
		return moment().format("HH:mm:ss");
	}
);
```

> 设置了 output.filename 则无效
