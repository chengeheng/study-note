function PriorityQueue() {
  // 创建一个保存数据的对象
  this.items = [];
}

function QueueElement(element, priorty) {
  this.element = element;
  this.priorty = priorty;
}
// 插入元素
PriorityQueue.prototype.enqueue = function (element, priorty) {
  const queueElement = new QueueElement(element, priorty);
  if (this.items.length === 0) {
    this.items.push(queueElement);
  } else {
    let flag = false;

    for (let i = 0; i < this.items.length; i++) {
      if (queueElement.priorty > this.items[i].priorty) {
        this.items.splice(i, 0, queueElement);
        flag = true;
        break;
      }
    }

    if (!flag) {
      this.items.push(queueElement);
    }
  }
};
// 删除元素
PriorityQueue.prototype.dequeue = function () {
  return this.items.shift();
};
PriorityQueue.prototype.front = function () {
  return this.items[0];
};
PriorityQueue.prototype.isEmpty = function () {
  return this.items.length === 0;
};
PriorityQueue.prototype.size = function () {
  return this.items.length;
};
PriorityQueue.prototype.toString = function () {
  return this.items.join("");
};
