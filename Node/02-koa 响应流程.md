# Koa 处理请求响应流程

用`koa-generator`生成一个`koa`项目，阅读其入口文件`app.js`并分析其流程，可以简化成以下代码：

```javascript
const Koa = require("koa");
const app = new Koa();
// 处理中间件
app.use(middlewares);

app.listen(3000);
```

查看`koa`的源码，可以看到，在调用`app.listen`的时候首先调用了`http.createServer()`生成了一个`http.Server`对象；然后在请求时，将请求的数据解析出来生成`req`和`res`对象，作为参数传入到用户函数中，`koa`中的体现则是中间件中处理；最后用户函数调用`res.end()`来结束处理，并对接口做出响应。

因此，需要关注的地方有

- `http.createServer`函数的作用
- 解析`req`和`res`的过程

### http.createServer

```javascript
const { Server } = require("_http_server");
function createServer(opts, requestListener) {
  return new Server(opts, requestListener);
}
```

`http.createServer()`函数返回一个`Server`实例，这个`Server`实例从`_http_server`导出，简化其源码，可以得到主要内容有：

```javascript
// lib/_http_server.js
function Server(options, requestListener) {
  if (!(this instanceof Server)) return new Server(options, requestListener);
  // 根据入参判断requestListener
  if (typeof options === "function") {
    requestListener = options;
    options = {};
  } else if (options == null || typeof options === "object") {
    options = { ...options };
  } else {
    throw new ERR_INVALID_ARG_TYPE("options", "object", options);
  }

  if (requestListener) {
    this.on("request", requestListener);
  }
  this.on("connection", connectionListener);
}
```

在`Server`对象中添加了两个事件

- `request事件`：绑定`requestListener()`函数，在`koa`中表现为中间件处理函数
- `connection事件`：绑定`connectionListener()`函数，`_http_server`中的`Server`继承自`net.Server`，在`net`源码中可以看到当有连接时会触发`connection`事件

根据`_http_server`的代码，可以看到`request`事件触发的流程：

`connectionListener` --> `connectionListenerInternal` --> `parserOnIncoming` --> `request`

当连接建立时，`socket`里面有数据时触发`data`事件，调用`socketOnData`解析 HTTP 报文，当确认完`http`请求之后，触发`request`事件

### 解析具体的流程

1. 建立连接

当客户端请求过来之后，`Server`实例建立`TCP`连接并触发`connection`事件，同时会在`connectionListener`事件中暴露`socket`套接字对象，之后`http`模块就通过`socket`来与客户端进行数据交互。

2. 解析参数

当`TCP`推送数据之后，`socket`会触发`data`事件，开始解析参数

```javascript
// lib/_http_server.js
function connectionListenerInternal(server, socket) {
  ...
  const state = {
    onData: null,
    onEnd: null,
    onClose: null,
    onDrain: null,
    outgoing: [],
    incoming: [],
    outgoingData: 0,
    keepAliveTimeoutSet: false,
  };
  state.onData = socketOnData.bind(undefined, server, socket, parser, state);
  state.onEnd = socketOnEnd.bind(undefined, server, socket, parser, state);
  ...
  socket.on("data", state.onData); --> A
  ...
  parser.onIncoming = parserOnIncoming.bind(undefined, server, socket, state);  --> B
  ...
}

function socketOnData(server, socket, parser, state, d) {
  assert(!socket._paused);
  debug("SERVER socketOnData %d", d.length);

  const ret = parser.execute(d); --> C
  onParserExecuteCommon(server, socket, parser, state, ret, d);
}
```

在`_http_common.js`中可以看到，`parser`继承自`HTTPServer`，并且绑定了 4 个解析参数的函数:

```javascript
// lib/_http_common.js
const parsers = new FreeList('parsers', 1000, function parsersCb() {
  const parser = new HTTPParser();

  cleanParser(parser);

  parser[kOnHeaders] = parserOnHeaders;
  parser[kOnHeadersComplete] = parserOnHeadersComplete;
  parser[kOnBody] = parserOnBody;
  parser[kOnMessageComplete] = parserOnMessageComplete;

  return parser;
});
function parserOnHeadersComplete(versionMajor, versionMinor, headers, method,
                                 url, statusCode, statusMessage, upgrade,
                                 shouldKeepAlive) {
  ...
  const incoming = parser.incoming = new ParserIncomingMessage(socket);
  incoming.httpVersionMajor = versionMajor;
  incoming.httpVersionMinor = versionMinor;
  incoming.httpVersion = `${versionMajor}.${versionMinor}`;
  incoming.url = url;
  incoming.upgrade = upgrade;
  ...
  return parser.onIncoming(incoming, shouldKeepAlive);
}
```

在代码 C 行执行`parser.execute`的时候，就是执行上述绑定的 4 个解析参数的函数

当`parser`解析完`TCP`头部信息之后，就会调用`parserOnHeadersComplete`方法，在`parserOnHeadersComplete`内，`parser`会先创建一个`ParserIncomingMessage`实例，并把请求头的结果包装到该实例上；在确认了`http`请求之后，调用`parser.onIncoming`方法，并把得到`IncomingMessage`实例作为参数传递进去；而在代码 B 行可以看到，`parser.onIncoming`方法其实就是`_http_server.js`中的`parserOnIncoming`函数：

```javascript
function parserOnIncoming(server, socket, state, req, keepAlive) {
  state.incoming.push(req);
  ...
  const res = new server[kServerResponse](req);
  res._keepAliveTimeout = server.keepAliveTimeout;
  res._onPendingData = updateOutgoingData.bind(undefined, socket, state);

  res.shouldKeepAlive = keepAlive;
  if (socket._httpMessage) {
    // There are already pending outgoing res, append.
    state.outgoing.push(res);
  } else {
    res.assignSocket(socket);
  }

  // When we're finished writing the response, check if this is the last
  // response, if so destroy the socket.
  res.on(
    "finish",
    resOnFinish.bind(undefined, req, res, socket, state, server)
  );

  ...
  server.emit("request", req, res);
  return 0; // No special treatment.
}
```

在`parserOnIncoming`中，先将传进来的`IncomingMessage`实例保存到`incoming`队列中，同时创建了一个`ServerResponse`实例，然后触发`Server`的`request`事件，并把`req`、`res`两个实例传递进去；`request`事件的监听函数就是调用`http.createServer`的参数，也就是`requestListener`，这样在`requestListener`回调函数中就收到这次`http`请求的`request`

3. 调用用户函数

`http-parser`解析完参数之后，就会调用`createServer`传递进来的`requset`的监听函数，通常传递进来的也就是用户函数，该函数默认接受两个参数，就是传递进来的`req`和`res`实例；通过`req`获取`TCP`传递进来的参数，通过`res`来对返回进行处理

4. 处理`http`返回

`res`是`ServerResponse`实例，继承自`OutgoingMessage`。因此通过原型链继承，调用`res`的方法就是调用`OutgoingMessage`的方法器源码在`lib`下面的`_http_outgoing.js`文件中:

```javascript
const http = require("http");
// 创建 server 对象
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("响应内容");
});
// 开始监听 3000 端口的请求
server.listen(3000);
```

上述代码就是简单的调用`res`方法对`http`的返回进行操作：

- 通过`res.writeHead`来对`response`的响应头进行更改
- 通过`res.end`来响应接口请求并结束

`res`的写方法就是对`res`对象进行操作更改，主要看`res.end`方法如果响应接口请求并触发结束事件:

```javascript

OutgoingMessage.prototype.end = function end(chunk, encoding, callback) {
  ...
  if (chunk) {
    write_(this, chunk, encoding, null, true);
  } else if (this.finished) {
    if (typeof callback === 'function') {
      if (!this.writableFinished) {
        this.on('finish', callback);
      } else {
        callback(new ERR_STREAM_ALREADY_FINISHED('end'));
      }
    }
    return this;
  } else if (!this._header) {
    this._contentLength = 0;
    this._implicitHeader(); // 生成响应头
  }
  ...
  const finish = onFinish.bind(undefined, this); --> D

  if (this._hasBody && this.chunkedEncoding) {
    this._send('0\r\n' + this._trailer + '\r\n', 'latin1', finish);
  } else {
    // Force a flush, HACK.
    this._send('', 'latin1', finish);
  }
  ...
  return this;
};
```

`res.end`方法就是`OutgoingMessage.prototype.end`方法，主要包含几个操作：

- 生成响应头：根据是否有`chunk`判断是否调用`write_`方法，在`write_`方法内会判断`chunk`内是否有响应头信息，没有则默认生成响应头
- 触发`finish`事件：通过`_send`方法将`finish`函数传递到`_writeRaw`函数中，在`socket`将数据写进去之后，通过回调函数的方式调用`finish`函数，结束响应

### koa 处理接口请求

了解`http.createServer()`的作用之后，再来看下`koa`如何处理接口请求，在调用`http.createServer`的时候，`koa`向里面传递了一个`callback`回调函数：

```javascript
// koa2/lib/application.js
/**
   * Return a request handler callback
   * for node's native http server.
   *
   * @return {Function}
   * @api public
   */

  callback() {
    const fn = compose(this.middleware);

    if (!this.listeners('error').length) this.on('error', this.onerror);

    return (req, res) => {
      res.statusCode = 404;
      const ctx = this.createContext(req, res);
      const onerror = err => ctx.onerror(err);
      onFinished(res, onerror);
      fn(ctx).then(() => respond(ctx)).catch(onerror); --> E
    };
  }

  listen() {
    debug('listen');
    const server =this.server || http.createServer(this.callback());
    return server.listen.apply(server, arguments);
  }
```

`this.callback()`的返回结果是一个函数，即上述`http`处理响应中的用户函数，用户函数是在`http`解析完请求头信息之后，将`req`和`res`实例传递进来的：

- 首先创建了一个`ctx`实例，对`req`和`res`进一步封装
- 然后`onFinished`判断请求是否有错
- 最后在代码 E 行先是调用中间件函数对`ctx`对象进行处理，处理如果没有错误则调用`respond`方法

```javascript
function respond(ctx) {
  // allow bypassing koa
  if (false === ctx.respond) return;

  const res = ctx.res;
  if (!ctx.writable) return;

  let body = ctx.body;

  // body: json
  body = JSON.stringify(body);
  if (!res.headersSent) {
    ctx.length = Buffer.byteLength(body);
  }
  res.end(body);
}
```

在`respond`最后，调用`res.end`方法，把`body`数据写入`socket`，然后结束响应
