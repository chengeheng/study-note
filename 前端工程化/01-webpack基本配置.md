# webpack 基本配置

## webpack 工作模式特性

webpack 工作模式是在 webpack 4 之后新加入的，共有三种模式: `production`、`development`和`none`；不同的工作模式相当于针对不同环境的预设 webpack 配置

修改 webpack 工作模式的方式有两种方式：

- 通过 CLI --mode 参数传入
- 通过配置文件设置 mode 属性

## 通过 Webpack 打包后的结果是如何运行起来的

webpack 打包过后的 js 其实就是一个立即执行函数，

## loader 加载器

webpack 使用 loader（加载器）来处理每个模块，而内部默认的 loader 只能处理 js 模板，因此要加载其他的文件类型就得配置不同的 loader

config 配置对象中的 module 属性有个 rules 数组，就是我们针对资源模块的加载配置，其中每个规则对象都需要设置两个属性：

- test 属性：正则表达式，用来匹配打包过程所有遇到的文件路径，也就是寻找需要用当前 loader 解析的文件

- use 属性：用来指定 test 属性匹配到的文件需要使用的 loader

webpack 加载资源文件的过程类似于一个工作管道，可以在这个过程中使用多个 loader，但是这个管道结束时最后输出的结果必须是一段标准的 js 代码字符串

css -> css-loader -> webpack -> bundle.js

use 可以传入一个数组执行多个 loader，多个 loader 的执行顺序是从后向前执行的

### 为什么要在 js 中加载其他资源文件

因为真正需要这个资源的并不是整个应用，而是当前执行的 js 代码。通过 js 代码引入资源文件，可以建立 javascript 和资源文件的依赖关系，这样既在逻辑上比较合理，也容易配合打包工具，确保上线时资源不会缺失，而且只加载需要的部分资源。

### 常用的 loader

| 名称          | 功能                                                                                | 链接                                             |
| ------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------ |
| file-loader   | 把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出文件                       | https://webpack.js.org/loaders/file-loader       |
| url-loader    | 和 file-loader 类似，但是能在文件很小的情况下以 base64 的方式把文件内容注入到代码中 | https://webpack.js.org/loaders/url-loader        |
| babel-loader  | 把 ES6 转换成 ES5                                                                   | https://webpack.js.org/loaders/babel-loader      |
| style-loader  | 把 CSS 代码注入到 Javascript 中，通过 DOM 操作去加载 CSS                            | https://webpack.js.org/loaders/style-loader      |
| css-loader    | 加载 CSS，支持模块化、压缩、文件导入等特性                                          | https://webpack.js.org/loaders/css-loader        |
| sass-loader   | 加载 sass 文件，转换成 css                                                          | https://webpack.js.org/loaders/sass-loader       |
| eslint-loader | 通过 ESLint 检查 JavaScript 代码                                                    | https://github.com/webpack-contrib/eslint-loader |

### 自定义 loader

1. 每个 webpack 的 loader 都需要导出一个函数，这个函数就是这个 loader 对资源的处理过程，输入为加载到的资源文件内容，输出为加工后的结果

   ```javascript
   // 自定义loader
   module.exports = source => {
   	// source为加载的模块内容
   	console.log(source);
   	// do something
   	return process(source);
   };
   ```

2. 如果 loader 不需要其他的 loader 的后续处理，那么返回必须要是可执行的 js 代码字符串

## plugins 插件

`loader`负责项目中各种各样资源模块的记载，而`plugin`则是用来解决项目中除了资源模块打包以外的自动化工作，如清除 dist 目录、生成 html 文件及自动发布打包结果到服务器等。

### 开发自定义插件

webpack 要求自定的插件必须是一个函数或是一个包含 apply 方法的对象，通常会定义一个类型，在这个类型中定义 apply 方法，在使用时，将这个类型实例化去使用。

webpack 的插件机制就是最常见的钩子机制。为了便于插件的扩展，webpack 几乎在每一个环节都埋下了一个钩子；通过在这些钩子上挂在不同的任务，就可以扩展 webpack 的能力。

webpack 的 hook 共三大类，分别是：

- [Compiler Hooks](https://webpack.js.org/api/compiler-hooks/)
- [Compoliation Hooks](https://webpack.js.org/api/compilation-hooks/)
- [JavascriptParser Hooks](https://webpack.js.org/api/parser/)

开发一个自定义插件的步骤：

1. 明确 webpack 插件的类型，创建一个类型并定义一个 apply 方法

- apply 方法会在 webpack 启动时被调用，它接收一个`complier`对象作为参数，这个对象包含此次构建的所有配置信息

  ```javascript
  // remove-comments-plugin.js
  class RemoveCommentsPlugin {
  	apply(compiler) {
  		console.log("RemoveCommentsPlugin 启动");
  		// compiler => 包含构建的所有配置信息的对象
  	}
  }
  ```

2. 明确插件的执行时机，在 webpack 的 hooks 找到合适的钩子函数
   如移除注释的插件，只有当 webpack 需要生成的 bundle.js 文件内容明确后才能执行，所以在 hooks 中选用`emit`钩子，这个钩子接收两个参数：

- 第一个是插件名称；比如当前就是`RemoveCommentsPlugin`
- 第二个就是挂到这个钩子上的函数

  ```javascript
  // remove-comments-plugin.js
  class RemoveCommentsPlugin {
  	apply(compiler) {
  		compiler.hooks.emit.tap("RemoveCommentsPlugin", compilation => {
  			// compilation => 可以理解为此次打包的上下文
  			for (const name in compilation.assets) {
  				console.log(name);
  			}
  		});
  	}
  }
  ```

3. 钩子函数中`compilcation.assets`中拿到了所有的文件内容，可以通过正则或其他方式对文件进行筛选处理

- 通过一个新的对象覆盖原来`compilation.assets`的内容，这样 webpack 最终输出的就是我们返回的对象中`source`方法的返回值
- 同时还需要暴露一个`size`方法，用来返回内容大小，这是 webpack 要求的格式。

  ```javascript
  // remove-comments-plugin.js
  class RemoveCommentsPlugin {
  	apply(compiler) {
  		compiler.hooks.emit.tap("RemoveCommentsPlugin", compilation => {
  			// compilation => 可以理解为此次打包的上下文
  			for (const name in compilation.assets) {
  				if (name.endsWith(".js")) {
  					const contents = compilation.assets[name].source();
  					const noComments = compilation.replace(/\/\*{2,}\/\s?/g, "");
  					compilation.assets[name] = {
  						source: () => noComments,
  						size: () => noComments.length,
  					};
  				}
  			}
  		});
  	}
  }
  module.exports = RemoveCommentsPlugin;
  ```

## webpack 核心工作过程中的关键环节

1. Webpack CLI 启动打包流程

   Webpack CLI 的作用就是将 CLI 参数和 Webpack 配置文件中的配置整合，得到一个完整的配置对象。

   CLI 参数就是在运行 webpack 命令式通过命令行传入的参数，例如`--mode=production`

2. 载入 Webpack 核心模块，创建 Compiler 对象

   Webpack 核心模块的核心方法就叫`webpack`，在这个方法中，首先校验了外部传递过来的 options 参数，紧接着判断了 options 的类型。

   如果 options 是个数组，webpack 内部创建的就是一个`MultiCompiler`，也就是说 webpack 可以支持同时开启多路打包，配置数组中的每一个成员就是一个独立的配置选项。

   创建好`Compiler`对象之后，webpack 会注册配置中的`plugin`，确保每个钩子都能命中。

3. 使用 Complier 对象开始编译整个项目

   `Compiler`内部会先触发`beforeRun`和`run`两个钩子，调用当前对象的`compile`方法，真正开始编译整个项目。

   `compile`方法内部就是创建一个`Compilation`对象，就是这次构建的上下文，包含这次构建中的全部信息。

4. make 阶段

   make 阶段就是在创建好`Compilation`对象之后调用的一个`make`钩子，主要目标就是：

   - 从入口文件开始，解析模块依赖，形成依赖关系树： webpack 会根据项目中的`import`、`require`等之类的语句，解析项目中的依赖关系
   - 递归依赖树，将每个模块交给对应的 Loader 处理
   - 合并 Loader 处理完的结果，将打包结果输出到 dist 目录
   - 运行 plugin，实现各种自动化的构建任务
