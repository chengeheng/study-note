# Webpack

## 如何实现 Webpack 持久化缓存

- 服务端设置 HTTP 缓存头（Catch-Control 缓存头）
- 打包依赖（dependencies）和运行时（runtime）到不同的 chunk 中，即使用 splitChunk
- 延迟加载：使用 import 动态加载
- 保证 hash 值稳定

## 如何优化 Webpack 的打包体积

- 压缩代码
- 提取页面公共资源
- Tree Shaking
- Scope hoisting
- 图片压缩
- 借助工具分析性能瓶颈（speed-measure-webpack-plugins）
