# JS 深浅复制

## 浅复制

1. 扩展运算符（复制对象和数组）

   ```javascript
   const copyObject = { ...originalObject };
   const copyArray = [...originalArray];
   ```

   不足：

   - 不能复制普通对象的 prototype 属性
   - 不能复制内置对象的`特殊属性`（internal slots）
   - 只能复制对象本身的属性（非继承）
   - 只复制对象的可枚举属性（enumerable）
   - 复制的数据属性都是`可写的`（writable）和`可配置的`（configurable）

2. Object.assign()

   Object.assign()的工作方式和扩展运算符类似

   ```javascript
   const copy1 = { ...originalObject };
   const copy2 = Object.assign({}, originalObject);
   ```

   Object.assign()并非完全和扩展运算符等同，他们之间存在一些细微的差别。

   - 扩展运算符在副本中直接定义新的属性；
   - Object.assign()通过赋值的方式来处理副本中对应属性。

3. Object.getOwnPropertyDescriptors()和 Object.defineProperties()

   ```javascript
   function copyAllOwnProperties(original) {
     return Object.defineProperties(
       {},
       Object.getOwnPropertyDescriptors(original)
     );
   }
   ```

   - 能够复制所有自由属性
   - 能够复制非枚举属性

## 深复制

1. 嵌套扩展运算符实现深复制

   ```javascript
   const original = { name: "123", work: { address: "shanghai" } };
   const copy = {
     ...original,
     work: { ...original.work },
   };

   original.work !== copy.work; // 指向不同的引用地址
   ```

2. 使用 JSON 实现数据的深复制

   1. 先将普通对象转换为 `JSON 字符串(stringify)`
   2. 再`解析(parse)`该串

   ```javascript
   function jsonDeepCopy(original) {
     return JSON.parse(JSON.stringify(original));
   }
   ```

   JSON 复制的方法有一个明显的问题就是只能处理 JSON 所能识别的 key 和 value，对于不支持的类型，会被直接忽略掉。

3. 递归实现深复制

   1. 利用`for-in`对对象的属性进行遍历（自身属性+继承属性）
   2. `source.hasOwnProperty(i)`判断是否是非继承的可枚举属性
   3. `typeof source[i] === "object"`判断值的类型，如果是对象，递归处理

   ```javascript
   function clone(source){
       let target = {};
       for(let i in source){
           if(source.hasOwnProperty(i)){
               if(typeof source)
           }else{
               target[i] = source[i]
           }
       }
       return target
   }
   ```
