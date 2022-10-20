# svg 中 viewBox 图解

## 定义

viewBox 属性定义了画布上可以显示的区域

```html
<!-- viewBox="minX, minY, width, height" -->
<svg width="200" height="200" viewBox="0 0 100 100"></svg>
```

## 示例

首先定义一个宽高都为 300 的 svg，并在其中画一个矩形，这时候看到的就是一个完整的矩形：

```html
<svg width="300" height="300" style="border: 1px solid">
	<defs>
		<linearGradient id="color1" x1="0%" y1="0%" x2="100%" y2="0%">
			<stop offset="0" stop-color="green" />
			<stop offset="0.5" stop-color="yellow" />
			<stop offset="1" stop-color="red" />
		</linearGradient>
	</defs>
	<rect x="10" y="10" width="200" height="100" fill="url(#color1)"></rect>
</svg>
```

<svg width="300" height="300" style="border: 1px solid" >
	<defs>
		<linearGradient id="color1" x1="0%" y1="0%" x2="100%" y2="0%">
			<stop offset="0" stop-color="green" />
			<stop offset="0.5" stop-color="yellow" />
			<stop offset="1" stop-color="red" />
		</linearGradient>
	</defs>
	<rect x="10" y="10" width="200" height="100" fill="url(#color1)"></rect>
</svg>

此时如果设置 svg 的 viewBox 属性：

```html
<svg width="300" height="300" style="border: 1px solid" viewBox="105 55 60 60">
	<defs>
		<linearGradient id="color1" x1="0%" y1="0%" x2="100%" y2="0%">
			<stop offset="0" stop-color="green" />
			<stop offset="0.5" stop-color="yellow" />
			<stop offset="1" stop-color="red" />
		</linearGradient>
	</defs>
	<rect x="10" y="10" width="200" height="100" fill="url(#color1)"></rect>
</svg>
```

<svg width="300" height="300" style="border: 1px solid" viewBox="105 50 60 60">
	<defs>
		<linearGradient id="color1" x1="0%" y1="0%" x2="100%" y2="0%">
			<stop offset="0" stop-color="green" />
			<stop offset="0.5" stop-color="yellow" />
			<stop offset="1" stop-color="red" />
		</linearGradient>
	</defs>
	<rect x="10" y="10" width="200" height="100" fill="url(#color1)"></rect>
</svg>

viewBox 的每个属性含义如下：

```
105 表示相对于svg左上角的横坐标；
55 表示相对于svg左上角的纵坐标；
60 表示截取的视区的宽度；
60 表示截取的视区的高度。
```

将 svg 中 viewBox 的区域截出来并放大到整个 svg 显示

- **宽高比相同的 viewBox**

当 viewBox 设置的宽高比和 svg 的宽高比相同的时候，viewBox 截取出来的区域会 svg 的整个区域，以实现放大或者缩小的效果

- **非等比例的 viewBox**

如果设置的 viewBox 的宽高比和 svg 的宽高比不是等比例的，则会将宽或者高当中某一边放到最大即可，而另一边则会居中显示：

```html
<!-- 灰色边框的高被居中显示 -->
<svg width="300" height="300" style="border: 1px solid" viewBox="10 10 300 150">
	<defs>
		<linearGradient id="color1" x1="0%" y1="0%" x2="100%" y2="0%">
			<stop offset="0" stop-color="green" />
			<stop offset="0.5" stop-color="yellow" />
			<stop offset="1" stop-color="red" />
		</linearGradient>
	</defs>
	<rect x="10" y="10" width="120" height="140" fill="url(#color1)"></rect>
	<rect
		x="10"
		y="10"
		width="300"
		height="150"
		fill="transparent"
		stroke="#fff"
	></rect>
</svg>
```

<svg width="300" height="300" style="border: 1px solid" viewBox="10 10 300 150">
	<defs>
		<linearGradient id="color1" x1="0%" y1="0%" x2="100%" y2="0%">
			<stop offset="0" stop-color="green" />
			<stop offset="0.5" stop-color="yellow" />
			<stop offset="1" stop-color="red" />
		</linearGradient>
	</defs>
	<rect x="10" y="10" width="120" height="140" fill="url(#color1)"></rect>
    <rect x="10" y="10" width="300" height="150" fill="transparent"  stroke="#f1f1f1"></rect>
</svg>

## preserveAspectRatio

当 viewBox 的宽高比和 svg 不相同时，截取的区域会被尽量按照 svg 的宽或者高来展示，另一个方向则会居中，但是其实可以调整其位置不让居中，这时候就需要通过 svg 的 preserveAspectRatio 属性来设置。

preserveAspectRatio 由两个部分组成：

- 第一个部分决定 viewBox 的对齐方式

| 属性值 | 含义                             |
| ------ | -------------------------------- |
| xMin   | viewPort 和 viewBox 左边对齐     |
| xMid   | viewPort 和 viewBox x 轴中心对齐 |
| xMax   | viewPort 和 viewBox 右边对齐     |
| YMin   | viewPort 和 viewBox 上边对齐     |
| YMid   | viewPort 和 viewBox y 轴中心对齐 |
| YMax   | viewPort 和 viewBox 下边对齐     |

viewPort 表示当前可视区域，x 小写，但是 y 大写

- 第二个部分决定压缩比例

| 属性值 | 含义                                    |
| ------ | --------------------------------------- |
| meet   | 保持纵横比缩放 viewBox 适应 viewPort    |
| slice  | 保持纵横比同时比例小的方向填满 viewPort |
| none   | 扭曲纵横比以充分适应 viewPort           |

根据上面两个部分的含义，可以看出 preserveAspectRatio 的默认值为`preserveAspectRatio="xMidYMid meet"`

```html
<!-- preserveAspectRatio的第一部分设置为YMin，所以截取区域会和viewPort的上边对齐 -->
<svg
	width="300"
	height="300"
	style="border: 1px solid"
	viewBox="10 10 300 150"
	preserveAspectRatio="xMidYMin meet"
>
	<defs>
		<linearGradient id="color1" x1="0%" y1="0%" x2="100%" y2="0%">
			<stop offset="0" stop-color="green" />
			<stop offset="0.5" stop-color="yellow" />
			<stop offset="1" stop-color="red" />
		</linearGradient>
	</defs>
	<rect x="10" y="10" width="120" height="140" fill="url(#color1)"></rect>
	<rect
		x="10"
		y="10"
		width="300"
		height="150"
		fill="transparent"
		stroke="#f1f1f1"
	></rect>
</svg>
```

<svg width="300" height="300" style="border: 1px solid" viewBox="10 10 300 150" preserveAspectRatio="xMidYMin meet">
	<defs>
		<linearGradient id="color1" x1="0%" y1="0%" x2="100%" y2="0%">
			<stop offset="0" stop-color="green" />
			<stop offset="0.5" stop-color="yellow" />
			<stop offset="1" stop-color="red" />
		</linearGradient>
	</defs>
	<rect x="10" y="10" width="120" height="140" fill="url(#color1)"></rect>
    <rect x="10" y="10" width="300" height="150" fill="transparent"  stroke="#f1f1f1"></rect>
</svg>
