# BFC

BFC 即 Block Formatting Contexts（块级格式化上下文）,它属于 CSS 布局模式的流动模型，是 W3C CSS2.1 规范的一个概念，决定了元素如何对其内容进行定位，以及与其他元素的关系和相互作用。

具有 BFC 特性的元素可以看做是隔离了的独立容器，容器里面的元素不会在布局上影响到外面的元素，并且 BFC 具有普通容器所没有的一些特性。

## BFC 规则

在块格式化上下文中，每一个元素左外边与包含块的左边相接触（对于从右到左的格式化，右外边接触右边），即使存在浮动也是如此（所以浮动元素正常会直接贴近它的包含块的左边，与普通元素重合），除非这个元素也创建了一个新的 BFC

## 形成 BFC 的条件

只要元素满足下面任一条件即可触发 BFC 特性：

- body 根元素
- 浮动元素： float 除 none 以外的值
- 绝对定位元素： position（absolute、fixed）
- display 为 inline-block、table-cells、flex
- overflow 除了 visible 以外的值（hidden、auto、scroll）

## BFC 常见作用

1. **阻止外边距折叠（margin 塌陷问题）**

在标准的文档流中，块级标签之间竖直方向的 margin 会以大的为准，如：

```html
<html>
  <head>
    <style>
      div {
        width: 100px;
        height: 100px;
        background: lightblue;
        margin: 100px;
      }
    </style>
  </head>
  <body>
    <div></div>
    <div></div>
  </body>
</html>
```

![](https://cdn.nlark.com/yuque/0/2020/png/2340220/1598117589161-2afec7c3-e14e-45b1-994b-8e9d00806183.png#align=left&display=inline&height=361&margin=%5Bobject%20Object%5D&originHeight=361&originWidth=231&size=0&status=done&style=none&width=231)

上述效果看到两个同时处于一个 BFC 容器下（body 元素）的 div 边距发生了重叠，如果为了避免外边距的重叠，可以将其放在不同的 BFC 容器中。

```html
<div class="container">
  <p></p>
</div>
<div class="container">
  <p></p>
</div>
```

```css
.container {
  overflow: hidden;
}
p {
  width: 100px;
  height: 100px;
  background: lightblue;
  margin: 100px;
}
```

2. **清除浮动**

通常情况下父元素的高度会被子元素撑开，而如果子元素为浮动元素则父元素不会被撑开，上下边界重合，这时候就需要清除浮动。

```html
<div style="border: 10px solid #000; overflow: hidden">
  <div
    style="width: 100px; height: 100px; background: grey; float: left;"
  ></div>
</div>
```

3. **阻止元素被浮动元素覆盖**

相同层级的 div，如果左侧块级元素添加了浮动，而右侧未添加浮动，则左侧 div 会覆盖右侧的 div：

```html
<div style="height: 100px; width: 100px; float: left; background: lightblue;">
  我是一个左浮动的元素
</div>
<div style="height: 100px; width: 100px; background: grey;">
  我是一个没有设置浮动，也没有触发BFC元素，width: 200px; height: 200px;
  background: grey;
</div>
```

![](https://cdn.nlark.com/yuque/0/2020/png/2340220/1598117589142-0ca0c532-34df-485c-960a-855d61acc1c0.png#align=left&display=inline&height=214&margin=%5Bobject%20Object%5D&originHeight=214&originWidth=211&size=0&status=done&style=none&width=211)

如果这时候想第二个元素不被覆盖，则可以把第二个元素改为 BFC 元素，即：

```html
<div style="height: 100px; width: 100px; float: left; background: lightblue;">
  我是一个左浮动的元素
</div>
<div style="height: 100px; width: 100px; background: grey; overflow: hidden;">
  我是一个没有设置浮动，也没有触发BFC元素，width: 200px; height: 200px;
  background: grey;
</div>
```

![](https://cdn.nlark.com/yuque/0/2020/png/2340220/1598117589077-b52ddda7-b331-4ed9-af08-1cebc6b68fe3.png#align=left&display=inline&height=220&margin=%5Bobject%20Object%5D&originHeight=220&originWidth=316&size=0&status=done&style=none&width=316)

这个方法可以用来实现两列自适应布局，左边宽度固定，右边的内容自适应宽度。
