# http 及浏览器原理

## 重绘和回流是什么，对页面有什么性能影响

[参考地址](https://zhuanlan.zhihu.com/p/286021449)

重绘和回流是渲染步骤中的一小节，但是这两个步骤对于性能影响很大。

- 重绘是当节点需要更改外观而不会影响布局的，比如改变 color 就叫称为重绘

- 回流是布局或者几何属性需要改变就称为回流。

回流必定会发生重绘，重绘不一定会引发回流。回流所需的成本比重绘高的多，改变深层次的节点很可能导致父节点的一系列回流。

所以以下几个动作可能会导致性能问题：

- 改变 window 大小
- 改变字体
- 添加或删除样式
- 文字改变
- 定位或者浮动
- 盒模型

很多人不知道的是，重绘和回流其实和 Event loop 有关。

**当 Event loop 执行完 Microtasks 后，会判断 document 是否需要更新。**

因为浏览器是 60Hz 的刷新率，每 16ms 才会更新一次。然后判断是否有 resize 或者 scroll，有的话会去触发事件，所以 resize 和 scroll 事件也是至少 16ms 才会触发一次，并且自带节流功能。判断是否触发了 media query 更新动画并且发送事件判断是否有全屏操作事件执行 requestAnimationFrame 回调执行 IntersectionObserver 回调，该方法用于判断元素是否可见，可以用于懒加载上，但是兼容性不好更新界面以上就是一帧中可能会做的事情。如果在一帧中有空闲时间，就会去执行 requestIdleCallback 回调。

## 如何减少重绘和回流

## 浏览器强缓存和协商缓存是什么，有什么区别，优先级如何

**强缓存**

强缓存是通过 http 头部信息中的 Expires 和 Cache-Control 两个字段来控制的，用来表示资源的缓存时间：

1. Expires：用来表示资源的失效时间
2. Cache-Control：一般利用该字段的 max-age 来判断，这个值是一个相对时间

   ```
   Cache-Control: max-age=3600 // 代表着资源的有效期是3600秒
   ```

> Cache-Control 和 Expire 同时启用的时候，Cache-Control 的优先级更高

**协商缓存**

协商缓存是由服务器确定缓存资源是否可用。

1. Last-Modify/If-Modify-Since：浏览器会根据资源的最后修改时间判断是否命中缓存，如果命中缓存，则返回 304，并且不会返回资源内容，并且不会返回 Last-Modify。
2. Etag/If-None-Match：Etag/If-None-Match 是“实体标签”（Entity Tag）的缩写，是资源的一个唯一标识，资源变化都会导致 ETag 变化。
