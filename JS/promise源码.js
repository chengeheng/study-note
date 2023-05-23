const PromiseStatus = {
  Pending: "Pending",
  Fulfilled: "Fulfilled",
  Rejected: "Rejected",
};
//定义了promise三种状态，等待成功以及失败，状态修改后不可再修改

const isObject = (value) =>
  Object.prototype.toString.call(value) === "[object Object]";
const isPromise = (obj) =>
  (isObject(obj) || typeof obj === "function") &&
  typeof obj.then === "function";
//判断是否为对象或者promise

/**
 * @author syc
 * @description 深度解析promise的返回值
 * @param p 表示上次的promise实例
 * @param preValue 上一次的值
 * @param resolve then 返回promise中的resolve
 * @param reject then 返回promise中的reject
 */
const depthResolvePromise = (p, preValue, resolve, reject) => {
  //如果返回value跟实例是同一个的话，则直接报错
  // TODO? 什么情况下返回value和实例是同一个呢？
  if (p === preValue) {
    throw new TypeError("the same instance cannot be referenced cyclically");
  }

  //判断是否为对象，如果不是对象，直接执行resolve
  console.log(
    "aaa",
    isObject(preValue),
    typeof preValue === "function",
    preValue
  );
  if (isObject(preValue) || typeof preValue === "function") {
    const then = preValue.then;
    //如果then属性不是函数的话，直接执行resolve
    if (typeof then === "function") {
      //从这几句话可以看出.then作为一个新的promise状态，成功与否取决于内部返回的promise的状态
      try {
        then.call(
          preValue,
          (y) => {
            depthResolvePromise(p, y, resolve, reject);
          },
          (r) => {
            depthResolvePromise(p, r, resolve, reject);
          }
        );
      } catch (e) {
        reject(e); //如果异常被捕获到，则直接执行reject函数
      }
    } else {
      resolve(preValue); //如果then属性不是函数的话，直接执行resolve
    }
  } else {
    resolve(preValue); //如果不是对象，直接执行resolve
  }
};

function Promise(execution, id) {
  this.id = id;
  //成功状态的值
  this.value = "";
  //失败的值
  this.reason = "";
  //表示每个promise实例的状态
  this.state = PromiseStatus.Pending;
  //为了应对异步情况，因为执行then的时候，promise实例状态还未保存，所以需要优先保存onFulfilled/ onRejected 方法
  this.fulfilledCallback = [];
  this.rejectedCallback = [];

  //构造函数的resolve 方法
  const resolveFn = (value) => {
    if (value instanceof Promise) {
      return value.then(resolveFn, rejectFn); //可能用户使用promise。调用resolve方法的时候，传递的还不是一个promise实例，这时候需要一个特殊判断
    }
    if (this.state !== PromiseStatus.Pending) return;
    this.value = value;
    this.state = PromiseStatus.Fulfilled;

    this.fulfilledCallback.forEach((fn) => fn(this.value));
  };

  //构造函数的reject方法
  const rejectFn = (reason) => {
    if (this.state !== PromiseStatus.Pending) return;
    this.reason = reason;
    this.state = PromiseStatus.Rejected;

    this.rejectedCallback.forEach((fn) => fn(this.reason));
  };

  try {
    execution(resolveFn, rejectFn);
  } catch (e) {
    rejectFn(e); //如果执行构造函数期间发生异常，捕获到后直接执行reject方法
  }
}

//Promise.prototype.then
/**
 * @author syc
 * @description Promise then 方法 本身是一个微任务
 * @param onFulfilled 成功状态的回调
 * @param onRejected 失败状态的回调
 */
Promise.prototype.then = function (onFulfilled, onRejected) {
  if (typeof onFulfilled !== "function") onFulfilled = (x) => x;
  if (typeof onRejected !== "function")
    onRejected = (err) => {
      throw err;
    };

  // 状态resolve/ rejected 的场合
  if ([PromiseStatus.Fulfilled, PromiseStatus.Rejected].includes(this.state)) {
    //此处代表返回的一个新实例
    const p = new Promise((resolve, reject) => {
      queueMicrotask(() => {
        try {
          const r =
            this.state === PromiseStatus.Fulfilled
              ? onFulfilled(this.value)
              : onRejected(this.reason);
          depthResolvePromise(p, r, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
    });
    return p;
  }

  //状态还是pending的场合
  const p = new Promise((resolve, reject) => {
    this.fulfilledCallback.push((value) => {
      queueMicrotask(() => {
        try {
          const r = onFulfilled(value);
          depthResolvePromise(p, r, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
    });
    this.rejectedCallback.push((reason) => {
      queueMicrotask(() => {
        try {
          const r = onRejected(reason);
          depthResolvePromise(p, r, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
    });
  }, Math.random());
  return p;
};

//Promise.prototype.finally
Promise.prototype.finally = function (fn) {
  try {
    fn();
    return this.then(null, null);
  } catch (e) {
    //如果finally函数调用过程中有异常抛出，后续的会进行异常处理
    const callback = () => {
      throw e;
    };
    return this.then(callback, callback); //finally 实现原理就是不同的场合 调用then方法
  }
};

//Promise.prototype.catch catch方法其实就是then函数的另一种实现
Promise.prototype.catch = function (fn) {
  // catch 执行的逻辑就是then 只执行error的分支
  return this.then(null, fn);
};

//Promise.abort
/**
 * @author syc
 * @description promise中断方法
 * @param userPromise 用户自己promise
 */
Promise.abort = function (userPromise) {
  let abort;
  const innerPromise = new Promise((_, reject) => {
    abort = reject;
  });

  const racePromise = Promise.race([userPromise, innerPromise]);
  racePromise.abort = abort;
  return racePromise; //其实就是利用了函数race的原理，返回第一个成功/ 失败的状态
};

//Promise.resolve
/**
 * @author syc
 * @description 直接返回一个具有成功状态的promise
 * @param params 传递参数
 * @retruns {Promise}
 */
Promise.resolve = function (params) {
  return new Promise((resolve) => {
    resolve(params); //默认就是一个成功的状态promise
  });
};

//Promise.reject
/**
 * @author syc
 * @description 直接返回一个具有失败状态的promise
 * @param params 传递参数
 * @retruns {Promise}
 */
Promise.reject = function (params) {
  return new Promise((_, reject) => {
    reject(params); //默认就是一个失败的promise
  });
};

//Promise.race
/**
 * @author syc
 * @description 直接返回一个promise的状态，无论成功还是失败
 * @param allPromise 表示所有的promise
 */
Promise.race = function (allPromise = []) {
  return new Promise((resolve, reject) => {
    let i = 0;
    for (; i < allPromise.length; i += 1) {
      const item = allPromise[i];

      if (!isPromise(item)) {
        return resolve(item);
      } else {
        item.then(resolve, reject);
        return; //返回第一个成功或是失败的结果
      }
    }
  });
};

//Promise.any
/**
 * @author syc
 * @description 一旦出现一个可兑现的状态，就是可兑现的状态，如果全部不可兑现，就是rejected状态
 * @param allPromise 表示所有的promise
 */
Promise.any = function (allPromise) {
  return new Promise((resolve, reject) => {
    let count = 0;
    const rejectedCallback = () => {
      count += 1;
      if (count >= allPromise.length) {
        reject("[AggregateError: All promises were rejected]");
      }
    };

    let i = 0;
    for (; i < allPromise.length; i += 1) {
      const item = allPromise[i];
      if (!isPromise(item)) {
        return resolve(item); //如果一旦有任意一个promise的状态是成功状态，该结果就会被返回
      } else {
        item.then(
          (res) => {
            return resolve(res);
          },
          () => {
            rejectedCallback(); //如果所有的promise状态都失败了，则返回失败的状态
          }
        );
      }
    }
  });
};

//Promise.allSettled
/**
 * @author syc
 * @description 批量执行promise数组 无论是成功还是失败都会返回 最后返回一个promise 返回结构是{status: 'fulfilled/ rejected', value}
 * @param allPromise 传递参数
 */
Promise.allSettled = function (allPromise = []) {
  return new Promise((resolve) => {
    let count = 0;
    const resultArr = [];

    const callback = (index, value, status) => {
      resultArr[index] = { status, value };
      count += 1;

      if (count >= allPromise.length) {
        resolve(resultArr);
      }
    };

    allPromise.forEach((item, index) => {
      if (!isPromise(item)) {
        callback(index, item, "fulfilled");
      } else {
        item.then(
          (res) => {
            callback(index, res, "fulfilled");
          },
          (err) => {
            callback(index, err, "rejected");
          }
        );
      }
    });
  });
};

//Promise.all
/**
 * @author syc
 * @description 多个promise 同时发出请求，如果全部成功 结果以数组形式全部返回
 * @param promiseAll promise 数组
 * @retruns {Promise} 返回的promise
 */
Promise.all = function (promiseAll = []) {
  return new Promise((resolve, reject) => {
    const resultArr = [];
    let count = 0;
    const callback = (index, res) => {
      count += 1;
      resultArr[index] = res;
      if (count >= promiseAll.length) {
        resolve(resultArr);
      }
    };

    for (let i = 0; i < promiseAll.length; i += 1) {
      const p = promiseAll[i]; //如果所有的promise 都是成功状态，会以数组的形式进行返回
      if (!isPromise(p)) {
        callback(i, p);
      } else {
        p.then((res) => {
          callback(i, res);
        }, reject); //一旦有一个状态是rejected状态。立马执行失败的操作
      }
    }
  });
};

// new Promise((resolve, reject) => {
//   setTimeout(() => resolve("a"), 1000);
// })
//   .then((e) => {
//     console.log("then1", e);
//     return () => {
//       setTimeout(() => resolve("b"), 2000);
//     };
//   })
//   .then((e) => {
//     console.log("then2", e);
//   });

const a = {
  b: () => {
    console.log("c");
    return {
      c: () => console.log("d"),
    };
  },
};

a.b().c();
