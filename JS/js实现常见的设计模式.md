# js 实现常见的设计模式

总体来说设计模式分为三大类：

1. 创建型模式，共五种：工厂方法模式、抽象工厂模式、单例模式、建造者模式、原型模式；
2. 结构型模式，共七种：适配器模式、装饰器模式、代理模式、外观模式、桥接模式、组合模式、享元模式；
3. 行为型模式，共十一种：策略模式、模板方法模式、观察者模式/发布订阅模式、迭代子模式、责任链模式、命令模式、备忘录模式、状态模式、访问者模式、中介者模式、解释器模式。

## 手写单例模式（创建模式）

```javascript
let CreateSingleton = (function () {
  let instance;
  return function (name) {
    if (instance) {
      return instance;
    }
    this.name = name;
    return (instance = this);
  };
})();

CreateSingleton.prototype.getName = function () {
  return this.name;
};
```

代码测试

```javascript
let Winner = new CreateSingleton("Winner");
let Loser = new CreateSingleton("Loser");

console.log(Winner === Loser); // true
console.log(Winner.getName()); // "Winner"
console.log(Loser.getName()); // "Winner"
```

## 手写观察者模式（行为模式）

```javascript
// 定义observe
const queuedObservers = new Set();
const observe = (fn) => queuedObservers.add(fn);

const observable = (obj) =>
  new Proxy(obj, {
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver);
      // notify
      queuedObservers.forEach((observer) => observer());
      return result;
    },
  });
```

代码测试

```javascript
obj = observable({
  name: "789",
});

observe(function test() {
  console.log("触发了");
});
obj.name = "123";
// 触发了
// "123"
```

## 手写发布订阅模式（行为模式）

```javascript
class Observer {
  caches = {}; // 事件中心

  // eventName 事件名，独一无二，fn订阅后执行的自定义行为
  on(eventName, fn) {
    this.caches[eventName] = this.caches[eventName] || [];
    this.caches[eventName].push(fn);
  }

  // 发布 => 将订阅的事件进行统一执行
  emit(eventName, data) {
    if (this.caches[eventName]) {
      this.caches[eventName].forEach((fn) => fn(data));
    }
  }

  // 取消订阅 => 如果fn传，直接取消该事件所有订阅信息
  off(eventName, fn) {
    if (this.caches[eventName]) {
      const newCaches = fn
        ? this.caches[eventName].filter((e) => e !== fn)
        : [];
      this.caches[eventName] = newCaches;
    }
  }
}
```

代码测试

```javascript
const ob = new Observer();
const l1 = (data) => console.log(`l1_${data}`);
const l2 = (data) => console.log(`l2_${data}`);

ob.on("event1", l1);
ob.on("event1", l2);

// 发布订阅
ob.emit("event1", 789);
// l1_789
// l2_789

// 取消订阅l1
ob.off("event1", l1);

ob.emit("event1", 567);
// l2_567
```

## 观察者模式 VS 发布订阅模式

![观察者模式 VS 发布订阅模式](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1537ff7bba6c437eae41aad1ff8abf51~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

1. 从表面看：

   - 观察者模式里，只有两个角色：观察者+被观察者
   - 而发布订阅模式里，却不仅仅只有发布者和订阅者两个角色，还有一个经常被忽略的（经纪人｜ Broker）

2. 更深层次：

   - 观察者和被观察者，是`松耦合`的关系
   - 发布者和订阅者，则完全不存在耦合

3. 从使用层面上：

   - 观察者模式，多用于单个应用内部
   - 发布订阅模式，则更多的是一种`跨应用的模式｜cross-application pattern`，比如我们常用的消息中间件
