const PENDING = "PENDING"; // 等待
const FULFILLED = "FULFILLED"; // 成功
const REJECTED = "REJECTED"; // 失败

class MyPromise {
  _value = "";
  _reason = "";
  _status = PENDING;
  _successCallback = [];
  _failCallback = [];

  constructor(executor) {
    try {
      executor(this._resolve, this._reject);
    } catch (err) {
      this._reject(err);
    }
  }

  _resolve = (value) => {
    // if (value instanceof MyPromise) {
    //   return value.then(this._resolve, this._reject); //可能用户使用promise。调用resolve方法的时候，传递的还不是一个promise实例，这时候需要一个特殊判断
    // }
    if (this._status !== PENDING) return;
    this._value = value;
    this._status = FULFILLED;
    this._successCallback.forEach((fn) => fn(this._value));
  };
  _reject = (error) => {
    if (this._status !== PENDING) return;
    this._reason = error;
    this._status = REJECTED;
    this._failCallback.forEach((fn) => fn(this._reason));
  };

  then = (successCallback, failCallback) => {
    successCallback = successCallback ? successCallback : (e) => e;
    failCallback = failCallback
      ? failCallback
      : (e) => {
          throw e;
        };
    if (this._status === PENDING) {
      const p = new MyPromise((resolve, reject) => {
        this._successCallback.push((value) =>
          setTimeout(() => {
            try {
              const r = successCallback(value);
              depthResolvePromise(p, r, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0)
        );
        this._failCallback.push((value) =>
          setTimeout(() => {
            try {
              const e = failCallback(value);
              depthResolvePromise(p, e, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0)
        );
      });
      return p;
    } else {
      const p = new MyPromise((resolve, reject) => {
        setTimeout(() => {
          try {
            if (this._status === FULFILLED) {
              const r = successCallback(this._value);
              depthResolvePromise(p, r, resolve, reject);
            } else {
              const e = failCallback(this._reason);
              depthResolvePromise(p, e, resolve, reject);
            }
          } catch (e) {
            reject(e);
          }
        }, 0);
      });
      return p;
    }
  };

  catch = (failCallback) => {
    return this.then(null, failCallback);
  };
}

const depthResolvePromise = (p, value, resolve, reject) => {
  if (p === value) throw "type error";
  if (value instanceof MyPromise) {
    const then = value.then;
    if (typeof then === "function") {
      try {
        then.call(
          value,
          (y) => {
            depthResolvePromise(p, y, resolve, reject);
          },
          (r) => {
            depthResolvePromise(p, r, resolve, reject);
          }
        );
      } catch (e) {
        reject(e);
      }
    } else {
      resolve(value);
    }
  } else {
    resolve(value);
  }
};

new MyPromise((resolve, reject) => {
  resolve("a");
})
  .then((e) => {
    console.log("then1", e);
    return "b";
  })
  .then((e) => {
    console.log("then2", e);
    throw "c";
  })
  .catch((e) => {
    console.log("error", e);
    return "d";
  })
  .then((e) => {
    console.log("then3", e);
  });

// https://blog.csdn.net/weixin_58679768/article/details/127195147
