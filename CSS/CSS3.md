## css3 重要模块

- 选择器
- 盒模型
- 背景和边框
- 文字特效
- 2D/3D 转换
- 动画
- 多列布局
- 用户界面

## 多重背景（multiple backgrounds）

多重背景，也就是 css2 里的 background 的属性外加 origin、clip 和 size 组成的新 background 的多次叠加，**缩写时为用逗号隔开的每组值**；

用分解写法时，如果有多个背景图片，而其他属性只有一个（例如 background-repeat 只有一个），表明所有背景图片应用该属性值。

```css
/* 语法缩写如下 */
background: [background-color] | [background-image] |
  [background-position][/background-size] | [background-repeat] |
  [background-attachment] | [background-clip] | [background-origin];
```

也可以拆分开:

```css
background-image: url1, url2, ..., urlN;
background-repeat: repeat1, repeat2, ..., repeatN;
backround-position: position1, position2, ..., positionN;
background-size: size1, size2, ..., sizeN;
/* 设置背景图像是否固定或者随着页面的其余部分滚动 */
background-attachment: attachment1, attachment2, ..., attachmentN;
/* 规定背景图片的定位区域 */
background-clip: clip1, clip2, ..., clipN;
background-origin: origin1, origin2, ..., originN;
background-color: color;
```

> 注：

1. `background-size`可以指定背景图片的大小，在 css3 之前，图片的大小由图像的实际大小决定。
2. `background-origin`指定背景图像的位置区域，可选值从外到内有：`border-box`、`padding-box`和`content-box`。
3. `background-clip` 背景剪裁属性，从指定位置开始绘制，可选值有：`border-box`、`padding-box`和`content-box`。
