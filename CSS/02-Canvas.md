## 画布

canvas 也是一个 HTML 标签，但是 canvas 上面的 width 和 height 属性并不等于 CSS 属性的 width 和 height。

如果不设置 Canvas 元素的样式，则画布的狂啊就等于样式宽高的像素值，也就是 512px

## 坐标系

默认左上角为坐标原点(0, 0)，右下角坐标值为(512, 512)

## 利用 Canvas 绘制几何图形

1. 获取 Canvas 上下文

   ```js
   const canvas = document.querySelector("canvas");
   const context = canvas.getContext("2d");
   ```

2. 利用 Canvas 上下文绘制图形

   绘制一个正方形

   ```js
   const rectSize = [100, 100];
   context.fillStyle = "red";
   context.beginPath();
   context.rect(0.5 * canvas.width, 0.5 * canvas.height, ...rectSize);
   // 绘制在正中心
   context.rect(
     0.5 * (canvas.width - rectSize[0]),
     0.5 * (canvas.height - rectSize[1]),
     ...rectSize
   );
   // 先设置平移变化
   context.translate(-0.5 * rectSize[0], -0.5 * rectSize[1]);

   context.fill();
   ```

利用 canvas 画矩形的步骤：

1. 获取 Canvas 对象，通过 getContext(‘2d’) 得到 2D 上下文；
2. 设置绘图状态，比如填充颜色 fillStyle，平移变换 translate 等等；
3. 调用 beginPath 指令开始绘制图形；
4. 调用绘图指令，比如 rect，表示绘制矩形；
5. 调用 fill 指令，将绘制内容真正输出到画布上。
