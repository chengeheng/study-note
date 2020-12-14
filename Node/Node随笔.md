# Nodejs 随笔

1. `on`和`emit`

- on(事件名, function(){}) --- 相当于 bind，但不会触发
- emit(事件名) --- 相当于触发事件
- once(事件名, function(){}) --- 为指定时间注册一个单次的监听器，触发后立即解除该监听器
