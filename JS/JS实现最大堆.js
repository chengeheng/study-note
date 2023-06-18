/**
 * 最大堆
 * 1. 完全二叉树
 * 2. 堆中每一个节点的值都必须大于等于（或小于等于）其子树中每个节点的值
 */
class MaxHeap {
  constructor(data) {
    this.data = [];
    this.init(data);
  }

  init(data) {
    for (let i = 0; i < data.length; i++) {
      this.insert(data[i]);
    }
  }

  insert(val) {
    let curPosition = this.data.length;
    this.data[curPosition] = val;
    this.adjust_insert(curPosition);
    return true;
  }

  remove() {
    if (!this.data.length) return null;
    const max = this.data[0];
    if (this.data.length > 1) {
      this.data[0] = this.data.pop();
    } else {
      this.data.pop();
    }
    this.adjust_remove();
    return max;
  }

  adjust_insert(curPosition) {
    let parentIndex = (curPosition - 1) >> 1;
    while (curPosition > 0) {
      if (this.data[curPosition] <= this.data[parentIndex]) {
        break;
      } else {
        [this.data[curPosition], this.data[parentIndex]] = [
          this.data[parentIndex],
          this.data[curPosition],
        ];
        curPosition = parentIndex;
        parentIndex = (curPosition - 1) >> 1;
      }
    }
  }

  adjust_remove() {
    let leftNodeIndex = 1;
    let rightNodeIndex = 2;
    let curPosition =
      this.data[rightNodeIndex] &&
      this.data[leftNodeIndex] < this.data[rightNodeIndex]
        ? rightNodeIndex
        : leftNodeIndex;
    let parentIndex = (curPosition - 1) >> 1;
    while (curPosition < this.data.length) {
      if (this.data[curPosition] <= this.data[parentIndex]) {
        break;
      } else {
        [this.data[curPosition], this.data[parentIndex]] = [
          this.data[parentIndex],
          this.data[curPosition],
        ];
        leftNodeIndex = (curPosition + 1) * 2 - 1;
        rightNodeIndex = (curPosition + 1) * 2;
        parentIndex = curPosition;
        curPosition =
          this.data[leftNodeIndex] > this.data[rightNodeIndex]
            ? leftNodeIndex
            : rightNodeIndex;
        // parentIndex = (curPosition -1)>>1;
      }
    }
  }

  print() {
    console.log(this.data);
  }
}

const heap = new MaxHeap([3, 1, 2, 4, 5]);
console.log(heap.remove());
console.log(heap.remove());
console.log(heap.remove());
console.log(heap.remove());
console.log(heap.remove());
