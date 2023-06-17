# PureComponent

PureComponent 会对组件的`props`和`state`进行浅比较，跳过不必要的更新，提高组件的性能。

## 使用

```javascript
import React, { Component } from "react";
class Foo extends Component {
  render() {
    console.log("foo-render");
    const { num } = this.props;
    return <div>foo-{num}</div>;
  }
}
// 普通Component
class App extends Component {
  state = { num: 0 };
  handle = () => {
    this.setState({ num: 0 });
  };

  render() {
    const { num } = this.state;
    return (
      <div>
        <button onClick={this.handle}>点我</button> <Foo num={num} />{" "}
      </div>
    );
  }
}
```

在点击按钮的时候，虽然 num 值不变，但组件`Foo`还是更新了，如果使用`PureComponent`：

```javascript
import React, { PureComponent, Component } from "react";
class Foo extends PureComponent {
  render() {
    console.log("foo-render");
    const { num } = this.props;
    return <div>foo-{num}</div>;
  }
}
```

只有 num 值发生变化才会触发`Foo`组件`render`

## 原理

react 在更新组件时，会根据生命周期`shouldComponentUpdate`的返回值判断是否需要重新调用`render`方法，在`react`源码中可以搜索`checkShouldComponentUpdate`方法看到：

```javascript
/** * 是否更新组件
 * * @param {*} workInProgress
 * * @param {*} ctor
 * * @param {*} oldProps
 * * @param {*} newProps
 * * @param {*} oldState
 * * @param {*} newState
 * * @param {*} nextContext
 * * @returns true更新 false不更新 */
function checkShouldComponentUpdate(
  workInProgress,
  ctor,
  oldProps,
  newProps,
  oldState,
  newState,
  nextContext
) {
  const instance = workInProgress.stateNode; // 组件实例上有shouldComponentUpdate方法，调用拿方法返回值
  if (typeof instance.shouldComponentUpdate === "function") {
    let shouldUpdate = instance.shouldComponentUpdate(
      newProps,
      newState,
      nextContext
    );
    return shouldUpdate;
  }
  // 重点在这
  // 原型上有isPureReactComponent属性，则是extends PureComponent
  // PureComponent在react源码中声明时，在原型上添加了 isPureReactComponent 属性
  // PureComponent.prototype.isPureReactComponent === true
  if (ctor.prototype && ctor.prototype.isPureReactComponent) {
    return (
      // 只对props和state浅比较
      !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState)
    );
  }
  return true;
}
```

而`PureComponent`组件不需要写`shouldComponentUpdate`方法，并且在声明时，会在实例的原型对象上添加`isPureComponent = true`，因此根据上面的`checkShouldComponentUpdate`代码来看，就会走对`props`和`state`的浅比较逻辑。

```javascript
function ComponentDummy() {}
ComponentDummy.prototype = Component.prototype;
function PureComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  // If a component has string refs, we will assign a different object later.
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}
const pureComponentPrototype = (PureComponent.prototype = new ComponentDummy());
pureComponentPrototype.constructor = PureComponent;
// Avoid an extra prototype jump for these methods.
Object.assign(pureComponentPrototype, Component.prototype);
// PureComponent原型上有个isPureReactComponent属性，用来标识是PureComponent组件
pureComponentPrototype.isPureReactComponent = true;
```

## 浅比较逻辑

```javascript
function shallowEqual(obj1, obj2) {
  if (obj1 === obj2) {
    return true;
  }
  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return false;
  }
  let keys1 = Object.keys(obj1);
  let keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    if (!obj2.hasOwnProperty(key) || obj1[key] !== obj2[key]) {
      return false;
    }
  }
  return true;
}
```

## 对比 React.memo

- `React.memo` 用于函数组件、`React.PureComponent` 用于类组件
- `React.memo` 等效于 `React.PureComponent`,但是它只会浅比较 props，因为它不像类组件有一个统一的 state 对象
- `React.memo` 可以自定义 props 的比较方法来确定是否需要更新，但 `React.PureComponent` 只能进行浅比较
