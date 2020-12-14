# webpack 扩展知识

## 实现配置文件智能提示

- 在 webpack.config.js 头部引入`Configuration`类型
- 定义 webpack 的配置类型为`Configuration`类型，vscode 则可以实现智能提示

```javascript
import { Configuration } from "webpack";
/**
 * @type {Configuration}
 */
const configs = {};
module.exports = configs;
```

## bundle、chunk、module 都是什么

- bundle：是由 webpack 打包出来的文件
- chunk：代码块，一个 chunk 由多个模块组合而成，用于代码的合并和分割
- module：是开发中的单个模块，在 webpack 的世界，一切依赖模块，一个模块对应一个文件，webpack 会从配置的 entry 中递归开始找出所有依赖的模块

## 在进阶使用上，如何进一步利用 webpack 优化前端的性能

- 利用 CDN 加速：在构建过程中，将引用的静态资源路径修改为 CDN 上对应的路径，可以利用 webpack 对于 output 参数和各 loader 的 publicPath 参数来修改资源路径

[前端性能优化](https://github.com/elecrabbit/front-end-interview/blob/master/docs/guide/load.md)

## 如何提高 webpack 的构建速度

## 如何提高 webpack 的打包速度
