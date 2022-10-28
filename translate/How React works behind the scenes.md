# 屏幕下的 React 是如何工作的

React 是用来做用户交互页面的最流行的 JavaScript 库。它是声明式的、高效的和灵活的。

但是，你有没有思考过在屏幕下 React 是如何真正工作的？让我们一起看下 React 在基本层上是如何运行的。

React 是一个 JavaScript 库，用于创建和维护 UI 在内存中的表示。当用户使用一个 React 应用做交互时，React 更新内存中的表示方式并且把改变通过 UI 反应出来。

React 使用虚拟 DOM，虚拟 DOM 就是一种能表达时真实 DOM 的 JavaScript 对象。它是一颗轻量级的树，因为它只包含渲染一个 UI 所必要的信息。

当一个用户使用 React 应用时，React 会更新虚拟 DOM。然后 React 会比较虚拟 DOM 和真实的 DOM。React 只会对真实 DOM 做一些必要的改变，也就是显示在 UI 上的改变。

虚拟 DOM 时一个 JavaScript 对象。这个对象由 React 元素组成，而 React 元素则是最小单位的 React 应用。

React 元素是不可变的，也就是说它们无法被改变。一旦一个 React 元素被创建了，它就再也不能更新了。

这就是为什么 React 这么快的原因。React 只需要更新那些在真实 DOM 中被改变的元素，而不需要重新渲染整个 UI。

React 元素也是轻量级的。它们只是一个 JavaScript 对象，并且没有其他额外的头部信息。

React 元素可以通过`React.createElement()`方法创建：

```javascript
React.createElement({
  type,
  props,
  children,
});
```

type 参数用来说明创建元素的类型，它可以是一个 HTML 标签、一个 React 组件或者是一个函数。

props 参数则是用来表示元素的属性，它是一个由 key 和 value 键值对组成的对象。

children 参数表明一个元素的子集，一个元素的 children 可以是一个 React 元素或者是一个字符串。

下面是创建一个 React 元素的示例：

```javascript
const element = React.createElement({
    "div",
    {id: "container"},
    "Hello World"
})
```

上述代码创建了一个类型是`div`的 React 元素，这个元素有个值为`container`的 id 属性和一个子集为字符串`Hello World`。

React 元素只是 JavaScript 对象，它们可以储存在变量中并且可以像其他任何对象一样被传递。

React 组件就是一些返回 React 元素的函数或是类。

```jsx
function Welcome (props){
    return React.createElement({
        "h1",
        null,
        "Hello, "+props.name+"!"
    })
}

class Welcome extends React.Component {
    render(){
        return React.createElement({
            "h1",
            null,
            "Hello, " + this.props.name + "!"
        })
    }
}
```

上述代码定义了一个名为`Welcome`的组件，这个`Welcome`组件返回一个 React 元素。

当一个 React 元素被创建的时候，React 会给一个`key`给这个组件，这个`key`是用来作为这个元素的唯一标识。

React 使用`key`来跟踪元素在虚拟 DOM 中的位置。当用户与 React 程序交互时，React 使用`key`在虚拟 DOM 中快速找到更改的元素。

React 只需要更新那些在真实 DOM 中被改变的元素，而不会重新渲染整个 UI。

React 也会使用`key`来判断那个 DOM 节点需要被更新。React 会使用它来对比虚拟 DOM 节点和真实 DOM 节点。

React 使用一个`diff`算法来找到更改的元素，这个`diff`算法是寻找哪个元素被更改的有效的方法。

React 通过更改 DOM 节点来更新真实的 DOM，并且只更新那些有更新的 DOM 节点。

> 翻译自[How React works behind the scenes](https://dev.to/amrtcrypto/how-react-works-behind-the-scenes-5e4k)
