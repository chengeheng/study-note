# 如何写一个好的 README 文档

README 文件是一个一站式的文档文件。通常来说，它不仅仅是那些第一次访问你项目的人首先会阅读的文件，同时对那些常用你项目的人来说也是一份重要文件。

## README 为什么那么重要？

几周前我需要安装一个开源项目到我的电脑上。这是我第一次接触到这个项目但是体验却很糟糕。本来只需要花费我一到两个小时的时间却花费了我两天，其中最主要的原因就是它没有一个帮助提升接触项目的开发人员以获得更好的首次交互体验的 README 文档。

## 谁是你的主要读者？

在挖掘什么是好的文档和怎么去写一个 README 文档之前，我们先挖掘下谁会去阅读这个文件。

写一个好的 README 文档的其中一个关键是以读者的角度思考。这篇文档主要受众是谁？谁是你的读者？在这种思维下，我喜欢将他们分为三类：

1. **终端用户**：

   他们是你应用的真实用户，也可能是寻找解决方案的业务分析师。他们可能没有那么强的技术知识，同时他们可能更关注你的解决方案的基础方面而不是技术实施。

2. **技术用户**：

   这些人一般都有一定的技术背景并且他们希望在自己的环境中安装这个项目。你也可以将他们想象成一种集成器，他们将会把你的项目集成到他们所工作的项目中。他们关注技术方面，然后仅作为一个用户来说，相对你的项目是如何实施的，他们更关心它提供的功能。例如，如果你的项目提供一个 API 或者提供一个库，他们会使用这个 API 或者是库，但是他们不会对所有技术细节感兴趣。

   需要注意的是根据你的项目类型不同，有时候终端用户和技术用户在某个维度上可能是相同的读者。例如，如果你的项目是一个 javascript 库比如 React JS，大部分情况你的终端用户同时也是一个技术用户，一个开发者。但是，如果你的仓库是一个 ios 应用，你的终端用户（一些使用 app store 的 iphone 用户）就不一定是你的技术用户了（那些使用 xcode 安装这些应用的人）。

3. **贡献者**：

   他们是你需要交互的人，因为他们将更进一步的参与到你的项目中。例如，一个贡献者可以是一个需要安装这个解决方案的技术用户，是一个想提交一个 bug 或者新的功能建议的人，是一个想提交一个带有增强功能申请的人，也可以是一个在经济上想提供支持的人。正如你可以看到的，这是一个多样化的群体，但是却将能让事情简单化的所有人集中到一个集体中。

## README 格式和写作技巧

虽然 README 文档是一个纯文本文件，但是由于大部分的源代码服务器比如 Github、Gitlab 或是 Azure Repos 都支持 Markdown 文本格式，所以你看到的大部分的 README 文档都是有 Markdown 语法编写的。

这种文本格式足够简单同时又足够丰富用来编写一个好的文档输出。它支持标题、加粗、斜体、无序列表、有序列表、代码块、链接等。事实上，屏幕下方的这篇博客就是使用 Markdown 语法编写的。

一个 markdown 的简单示例：

```markdown
# Heading 1

Preprending a `#` at the beginning of the first
line of a paragraph converts it into a heading
1 (biggest font heading).

## Heading 2

Two `#` is for heading 2. And so on so forth till 6.

To set a text in _bold_ just enclose it
in asterisks. For _italic_ use the underscore.

Markdown also supports [links](http:/dev.to/merlos)
```

基于[people don't read, they scan](https://www.nngroup.com/articles/how-users-read-on-the-web/)这篇文章，正确的使用 markdown 可以让你给文档一个好的视觉结构用来帮助用户扫面文档的内容。

通过一个好的文章结构（使用标题、列表、片段），你可以帮助你的用户快速的找到他们想要找到的信息。

例如，一个开发者在他回家的火车途中找到了你的项目，由于只是在手机上阅读所以他给了你文章一颗星准备几天后再安装它。几周后他发现一个 bug 并且他想提交这个 bug。通过在你的 README 文档中增加标题，他将会更轻松的找到他感兴趣的特定的章节。

而且，为了适应我们在网上阅读的习惯、或者 ie 的扫描、寻找关键字等，你可以遵循以下几点为 web 写文章的原则：

1. **使用短的篇章**。大约 3 到 5 行是一个比较好的规则，每个片段应该只有一个概念，这有助于扫读。
2. **使用项目符号或者是有序列表**而不是逗号分隔列表。这个原则列表就是一个例子，同时这也有助于扫读。
3. **不要使用`click here`**来添加一个链接，使用一个有意义的字段来代替。其中的一个原因是，使用`click here`是强迫用户去阅读这个链接之后的文档，而有意义的文本则可以给读者解释[为什么不要在这边使用`click here`](http://stephanieleary.com/2015/05/why-click-here-is-a-terrible-link-and-what-to-write-instead/)
4. **用粗体突出关键字或句子段落**，不要使用下划线，因为这会和链接混淆。
5. 在每个段落**以最重要的信息开头**。在你的文章中使用[倒金字塔结构](https://www.aresearchguide.com/inverted-pyramid-structure-in-writing.html)。文章的开始对你的读者来说是最重要的，然后在提供更多的详细信息。

## README 的内容

好的，既然我们已经知道了我们要给谁写 README 以及如何组织好的文章结构和形式，接下来看下 README 文档里面建议写的内容。

下面展示的文章结构符合与你的项目交互的自然逻辑：

1. 首先，我们要简要的**解释下这个项目是关于什么的**，

2. 然后，我们继续介绍**如何安装和启动项目**，

3. 最后，我们给读者提供**加入和合作的方式**。

这种文档结构遵循我们之前展示的不同用户对你项目的熟悉程度。终端用户只想要学习你的项目相关就可以了。

请注意，部分结构可能不符合你的项目，或者你想以其他形式来组合它们，但无论哪种情况这三层结构都是需要给读者提供的。

让我们从一下几部分开始：

### 概述

在这部分你想**简要的介绍你的项目**，所以这里应该不超过两段或者三段文字。思考你需要告诉那些第一次寻找你项目的人哪些内容。这部分主要面向的读者就是你的终端用户。

在简单的介绍信息之后，你可以一如一些到其他网站的链接、更进一步解释的维基百科或是一个示例给那些想要进一步了解你的项目的人。

最后，你可能需要列出来一些技术点、你使用的或是你支撑的框架（如何不是很明显的话）。这是给一些技术人员的，他们可能需要评估下你的项目是否符合他们自己项目或者组织的结构。

下面 ReactJS 项目的结构：

```markdown
React is a JavaScript library for building user interfaces.

1. Declarative: React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes. Declarative views make your code more predictable, simpler to understand, and easier to debug.
2. Component-Based: Build encapsulated components that manage their own state, then compose them to make complex UIs. Since component logic is written in JavaScript instead of templates, you can easily pass rich data through your app and keep the state out of the DOM.
3. Learn Once, Write Anywhere: We don't make assumptions about the rest of your technology stack, so you can develop new features in React without rewriting existing code. React can also render on the server using Node and power mobile apps using [React Native]().

[Learn how to use React in your project]().
```

正如你看到的，前面是展示项目内容，最后给你提供一个链接用来获取更多信息。在这个例子中，终端用户和技术用户是同样的，都主要是开发者。

### 安装

到这部分你已经吸引了读者足够的关注，所以他们会想着更进一步并且去试试你的项目。

在这里你需要**解释如何安装你的项目**。比如一个 NodeJs 应用，通常你需要像下面这样组织：

```commandLine
git clone http://url-to-my-repo
npm install
npm start
```

或是一个 python 项目：

```commandLine
pip install your-library-name

```

依次类推。

专家提示：在 markdown 语法中，你可以用` ``` ` 来闭合你的代码块。这是如果你在第一个` ``` `后面加上语言的名称（比如`ruby`、`javascript`、`typescript`、`swift`、`bash`），这样在展示模式下，语法规则将会被高亮。

比如；

![](https://res.cloudinary.com/practicaldev/image/fetch/s--7oKvpRZp--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/2hhyfbslnq0dnug7bh5f.png)

将会被渲染成

```javascript
// This is my Javascript code
if (a > b) return true;
```

请注意上面的例子中你已经假定了你的读者已经安装了响应的包管理器，`npm`或是`pip`，但是也是有可能没有安装的。所以，需要**考虑在尝试安装项目之前指定所需的先决条件**。在上述的 NodeJs 示例中可以这样：

```markdown
To install this application you need (Node JS 16.0 or above)[https://nodejs.org/en/download/]
```

### 用法/入门

既然用户已经把你的项目下载到他的系统中，那么是时候展示他能依赖你的项目所有具有的超能力了。

在入门中你也可以增加一些基础的指引或者要点来丰富你的文档。

总的来说，目标就是**指导读者在安装你的项目到他的环境之后可以做什么**。

### 文档

在基础的步骤/入门之后，用户可能会想进一步深入到你的项目功能中。这时根据不同的项目种类来分，有以下两种：

- 如果是一个应用，文档中就需要包含如何使用它，配置项，以及如何在不同情况下安装它；
- 如果是一个库或是框架，这部分就需要介绍 API、方法、类或者一些进一步的示例。

你也可以考虑添加一些额外的文档内容：

- 好的部署实践：如何在一个生产环境中部署你的项目。
- 安全指南：如何加强你的安装项以避免网络安全问题。
- 故障分析。
- 等等...

你可以将文档和你的入门指导合并起来，这取决于你想怎么组织你的介绍文档和你的 README 文档。

### 发展

从这部分起将主要面向那些想深入到你的项目中或是成为社区活跃成员的读者。在潜在的读者分类中，我们把这部分读者叫做贡献者。

这个开发部分主要是介绍开发模式喜爱的环境设置。你需要什么工具以及怎么在调试模式下运行你的项目，启动单元测试等。

```commandLine
# Example of running the automated unit test suite
npm test
```

### 贡献

本节旨在为想要真正做出贡献的读者提供额外的信息：

- 如何报告一个 bug；
- 行为守则；
- 编码规范；
- 如何提交一个 PR；
- 如何获取到支持；
- 如何捐助；
- 如何获取到社区帮助
- 等等...

你可能想在一个单独的文件中增加这部分文档。比如[Github 允许你创建一个 CODE of CONDUCT.md](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/adding-a-code-of-conduct-to-your-project)以及[其他文件](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/about-community-management-and-moderation)。

### 致谢

**致谢那些给你提供灵感的人**或是提及那些项目**主要的贡献者**即添加新功能的、提交新的代码请求的以及修复 bug 的等是一个良好的实践。

### 许可证

最后一部分 README 的内容通常是版权和许可证。

虽然咋一看你可能觉得这个并不重要，但事实上设置许可证是一个关键步骤，因为它可以帮助其他开发者了解您的软件的使用限制。

这里提供一些[开源的许可列表](https://opensource.org/licenses)。你应该大致了解每个许可证的含义。就个人而言，我通常在 GPL3 和 MIT 之间进行选择。

1. [MIT](https://opensource.org/licenses/MIT)是最简单的许可证，简单来说：你可以使用这段代码做你任何想做的事。风险自负并且不要起诉我就可以。

2. [GPL](https://opensource.org/licenses/gpl-license)是[著佐权许可证](https://en.wikipedia.org/wiki/Copyleft)的一种。它比 MIT 有更强的限制，要求任何公开发布的使用你代码的人或组织也要发布同样的 GPL 版权。它对商业用途的吸引力较小，但对整个社区来说更好，因为所有的贡献都会被返回给社区。[GNU/Linux kernel](https://www.kernel.org/doc/html/latest/process/license-rules.html)就是在这个版权下发布的。

在 README 的这部分通常不需要把这个版权文档添加进来，只需要添加引用就可以，但是通常你需要在你的`LICENSE`或是`LICENSE.md`文档中包含整个文件的副本。

## 额外添加

你还可以添加一些其他的东西到你的 README 文档中比如图片和状态徽章。

### 图片

正如之前提到的，README 文档通常是以 markdown 语法编写。这种语言允许你添加图片链接进去并在阅读模式下 markdown 会展示图片的内容。

特别是以下两种情况图片可能会很有帮助：

1. 使文档看起来色彩缤纷。比如在 readme 的开头增加一个 logo 会使它看起来很好看，这会提供一个很好的第一印象。

2. 展示/提供示例。一图胜千言。你可以录制一个简单的 gif 动画来展示你项目的关键特点，这可以帮助读者轻松掌握你的项目的主要内容。

### 状态标签

![状态标签示例](https://res.cloudinary.com/practicaldev/image/fetch/s--3ga8sdnE--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7br0d13rgvk2id0env0z.png)

另一个好的元素可以增加到你的 README 文档中的就是状态徽章。状态徽章可以展示你项目某个特定方面的状态、单元测试是否失败、管道是否工作、发布的最新版本以及代码的覆盖范围等等。

它给你的读者提供关于你项目的某些指标快照。

你可以从[徽章/盾牌仓库](https://github.com/badges/shields)中增加一些徽章到你的项目中。

在 README 文档中使用图片和徽章的唯一缺点是他们不能在简单的文本编辑器中呈现。但你可以忽略这个缺点，因为大多数情况下这个文档是呈现在仓库管理网站或是开发人员的友好的编辑器中，而这些编辑器通常支持 markdown 呈现。

## 总结

如果你参与了一个开源项目，那么 README 文档则是提升开发体验的一站式的关键文档。

为了写一个好的 readme 文档，你需要时刻记得将要阅读文件的读者的类型：终端用户、技术用户和贡献者。

你应该额外注意人们如何在网络中阅读你的文档，使用 markdown 语法帮助他们扫读你的 README 文档，同时使用一些良好实践比如较短的篇幅、有序的列表以及倒金字塔写作模式。

README 文档的内容应该遵循这样的结构：首先介绍项目、然后解释如何安装使用它、最后解释如何作为贡献者参与到项目中来。

希望你喜欢这篇文章。最后一个问题。你最喜欢的一篇 README 文档是哪个？

> 翻译自[How to write a good README](https://dev.to/merlos/how-to-write-a-good-readme-bog)
