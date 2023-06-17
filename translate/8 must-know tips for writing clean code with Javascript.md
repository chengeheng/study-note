# 使用 Javascript 编写简洁代码的 8 个必备技巧

Javascript 是一个优秀的编程语言，但是，即使对一些资深的程序员来说，编写简洁明了的 javascript 代码也可能是一个巨大的挑战。

那简洁的代码应该是什么样的呢？它应该是：

1. 可读性高
2. 易于调试
3. 高效和高性能并重

下面是一些工具和技巧可以使你的 javascript 代码质量上一个台阶：

## 1. 在一个 api 请求以及 json 解析时使用 try catch 捕获

在请求 api 的时候可能会发生很多错误，因此必须小心处理这些场景。而当处理 JSON 的时候，不要自动认为提供的内容是值得信任的，尝试处理可能的不一致从而使你的代码更加健壮。

```javascript
try {
  // 做一个请求或事复杂JSON的解析
} catch (err) {
  // 处理错误
}
```

## 2. 使用代码检查工具（ESLint）

一个代码检查工具是一个静态代码分析工具，可以根据一组预定义的规则和配置检查程序和风格错误。简单来说它可以提升你的 JS 或 TS 代码质量并使它们更加连贯。

## 3. 在你的编辑器中追踪 Javascript 代码问题

保持 Javascript 代码库清洁的一个主要组成部分是使跟踪和查看代码本身的问题变得更加容易。在编辑器中跟踪代码库也可以让工程师做到：

- 全面了解类如技术 debt 等更大的问题
- 查看每个代码库问题的内容
- 减少上下文切换
- 持续解决技术债务

你可以使用很多工具来追踪你的技术债务，但最快的、最简单的方法是使用与 Jira、Linear、Asana 和其他项目管理工具集成的 VSCode 或 JetBrains 的免费 Stepsize 扩展。

## 4. 充分利用模版字符串

模版字符串将允许您在保留格式的同时将值注入字符串，并且代码比进行字符串算术更便于阅读。

```javascript
// 避免这样
const headerText = "Hello " + user.name + ", welcome to " + workspace.name;

// 推荐这样
const headerText = `Hello ${user.name}, welcome to ${workspace.name}`;
```

## 5. 搜索东西时使用正则表达式

虽然正则表达式从外面看起来很深奥，但它是一个非常强大的字符串解析工具，它允许您构建复杂的模式来解决各种困难的字符串匹配场景。

## 6. 使用可选链操作符

不要再使用长的逻辑判断组合，使用可选链操作符简化你的代码

```javascript
// 避免这样
if (data && data.payload && data.payload.workspace.name === "default") {
  // 做一些事
}
// 推荐这样
if (data?.payload?.workspace?.name === "default") {
  // 做一些事
}
```

## 7. 避免嵌套

嵌套式增加代码复杂性并使其更难阅读和理解的必经之路。如果嵌套的深度超过两层，请考虑重构，通过具有根级返回条件、更短的代码块并将嵌套的逻辑抽象到它自己的函数中。

## 8. 注释所有非典型代码，但不要让它取代代码可读性

有时候你必须处理没有既定约定的罕见场景。给代码添加注释来帮助解释它的作用和相关的上下文可以极大的帮助其他程序员同时对在将来返回阅读代码的你自己也是一个提醒。但这不应该背用作一开始就没有考虑编写可读代码的借口。

> 翻译自[8 must-know tips for writing clean code with Javascript](https://dev.to/alexomeyer/8-must-know-tips-for-writing-clean-code-with-javascript-i4)
