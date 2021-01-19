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

## css3 transform 中的 Matrix（矩阵）

### transform 与坐标系统

`transform`旋转是围绕着中心点旋转的，这个中心点就是`transform-origin`属性对应的点，也是所有矩阵计算的一个重要依据点。

![css坐标系统](http://image.zhangxinxu.com/image/blog/201206/css-transforms-matrix2.png)

当通过设置`transform-origin`来进行设置时，矩阵相关的计算也会随之改变，这样使用`rotate`、`skew`进行旋转拉升的中心点也会发生变化。

`transform`的默认值是`50% 50% 0`，每个值分别对应 x 轴、y 轴和 z 轴的中心点位置。

### transform 的 matrix 方法

```css
transform: matrix(a, b, c, d, e, f);
```

对于坐标为(x, y, 1)的二维点坐标，其计算方式如下图：
![transform-matrix坐标计算](http://image.zhangxinxu.com/image/blog/201206/css-transforms-matrix5.gif)
所以`(x, y)`经过转换后就变成了`(ax+cy+e, bx+dy+f)`。

1. 偏移 translate

`translate` 是根据左（x 轴）和顶部（y 轴）位置给定的参数，从当前元素位置移动；等同于使用矩阵变换`matrix(0, 0, 0, 0, e, f)`，只和最后两个参数有关。

```css
transform: translate(50px, 100px);
/* 等同于 */
transform: matrix(0, 0, 0, 0, 50, 100);
```

2. 缩放 scale

`scale`通过改变 x 轴和 y 轴的刻度来实现对页面元素的拉伸；等同于使用矩阵变换`matrix(a, 0, 0, d, 0, 0)`，缩放只和第一及第四个参数相关。

```css
transform: scale(2, 1);
/* 等同于 */
transform: matrix(2, 0, 0, 1, 0, 0);
```

3. 旋转 rotate

`rotate`给定一个度数，元素顺时针进行旋转，为负数的话则逆时针进行旋转。

```css
transform: rotate(45deg);
/* 效果类似于 */
transform: matrix(0.5, 0.5, -0.5, 0.5, 0, 0); //  被缩小了，需要进行放大
```

可通过矩阵计算得出每个具体的值。

4. 倾斜 skew

`skew`包含两个参数，分别表示 x 轴和 y 轴倾斜的角度，如果第二个参数为空，则默认为 0。

```css
transform: skew(45deg, 0);
/* 效果类似于 */
transform: matrix(1, 0, 1, 1, 0, 0);
```

可通过矩阵计算得出每个具体的值。
