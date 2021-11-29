# React

## 什么是 React

React 是一个网页 UI 框架，通过组件化的方式解决视图层开发复用的问题，本质是一个组件化框架。

它的核心设计思路有三点，分别是声明式、组件化与通用性。

- 声明式的优势在于直观与组合。

- 组件化的优势在于视图的拆分与模块复用，可以更容易做到高内聚低耦合。

- 通用性在于一次学习，随处编写。比如 React Native，React 360 等，这里主要靠虚拟 DOM 来保证实现。这使得 React 的适用范围变得足够广，无论是 Web、Native、VR，甚至 Shell 应用都可以开发，这也是 React 的优势。

但作为一个视图层的框架，React 的劣势也十分明显。它并没有提供完整的一揽子解决方 案，在开发大型前端应用时，需要向社区寻找并整合解决方案。虽然一定程度上促进了社区的繁荣，但也为开发者在技术选型和学习适用上造成了一定的成本。

## 什么是虚拟 DOM

从本质上来说，虚拟 DOM 是一个 Javascript 对象，通过对象的方法方式来表示 DOM 结构。

将页面的状态抽象为 js 对象的形式，配合不同的渲染工具，使跨平台渲染成为可能。

通过事务处理机制，将多次 DOM 修改的结果一次性更新到页面上，从而有效的减少页面渲染的次数，减少修改 DOM 的重绘重排次数，提高渲染性能。

虚拟 DOM 设计最初的目的，就是更好的跨平台。

**为什么要用虚拟 DOM**

1. 保证性能下限，在不进行手动优化的情况下，提供过得去的性能

   虚拟 DOM 的性能消耗在 diff 计算上，真实 dom 消耗在重绘重排上

2. 跨平台

// TODO 补充 diff 算法的内容

## React 的 diff

## React 项目中有哪些细节可以优化？实际开发中都做过哪些性能优化？

- 保证数据的不可变性：`React.memo` 、`useMemo`、`useCallback` 减少不必要的渲染
- class 组件的 `shouldComponentUpdate` 做深处理比较
- 不要在 render 中处理数据

主要途径：减少 render 次数和减少计算量

## React16 有什么新特性

- render 支持返回数组和字符串
- Error Boundaries

  React 提供了一个新的内置函数`componentDidCatch`，当有错误发生时，我们可以友好地展示 fallback 组件，可以捕捉子元素抛出的异常；可以复用错误组件

- createPortal

  使用 createProtal 可以快速的创建 Dialog 组件，且不需要牵扯到 componentDidMount 上面来

- 使用 Fiber 重写了核心算法，实现了 hook 机制

1. 生命周期有什么变化

`componentWillMount`，`componentWillReceiveProps`，`componentWillUpdate` 准备废除，新增了 `static getDerivedStateFromProps` 和 `getSnapshotBeforeUpdate`

## 类组件和函数组件的区别

使用和呈现上并没有什么不同，性能上在现代浏览器中也不会有明显差异

不同：

- 类组件是面向对象编程的，主打的是继承、生命周期等核心概念；函数组件的内核是函数式编程，主打的没有副作用、引用透明等特点
- 性能优化上，类组件主要依靠`shouldComponentUpdate`阻断渲染来提升性能；而函数组件依靠`React.memo`缓存渲染结果来提升性能
- 类组件由于生命周期带来的复杂度，并不易于优化；而函数组件本身轻量简单，且在 hooks 的基础上提供了比原先更细粒度的逻辑组织与复用，更能适应 React 的未来发展

> react 官方更推荐“组合优于继承”的设计概念，所以更推荐函数式组件

## React 事件机制

1. React 为什么要用合成事件
2. 事件机制：注册和分发的过程
