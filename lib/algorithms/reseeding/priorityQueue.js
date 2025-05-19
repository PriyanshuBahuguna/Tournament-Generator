/**
 * Priority Queue implementation for tournament reseeding
 * A min-heap based priority queue where lower values have higher priority
 */
export class PriorityQueue {
    constructor(comparator = (a, b) => a < b) {
      this.heap = []
      this.comparator = comparator
    }
  
    /**
     * Get the size of the queue
     */
    size() {
      return this.heap.length
    }
  
    /**
     * Check if the queue is empty
     */
    isEmpty() {
      return this.size() === 0
    }
  
    /**
     * Get the top element without removing it
     */
    peek() {
      return this.heap[0]
    }
  
    /**
     * insert or add an element to the queue
     */
    enqueue(value) {
      this.heap.push(value)
      this._siftUp(this.heap.length - 1)
      return this.size()
    }
  
    /**
     * Remove and return the top element
     */
    dequeue() {
      if (this.isEmpty()) {
        return null
      }
  
      const poppedValue = this.heap[0]
      const bottom = this.heap.pop()
  
      if (this.size() > 0) {
        this.heap[0] = bottom
        this._siftDown(0)
      }
  
      return poppedValue
    }
  
    /**
     * Helper function to move an element up to its correct position
     */
    _siftUp(index) {
      let parent = Math.floor((index - 1) / 2)
  
      while (index > 0 && this.comparator(this.heap[index], this.heap[parent])) {
        // Swap with parent
        ;[this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]]
        index = parent
        parent = Math.floor((index - 1) / 2)
      }
    }
  
    /**
     * Helper function to move an element down to its correct position
     */
    _siftDown(index) {
      let minIndex = index
      const length = this.size()
  
      while (true) {
        const leftChild = 2 * index + 1
        const rightChild = 2 * index + 2
  
        // Check if left child exists and has higher priority
        if (leftChild < length && this.comparator(this.heap[leftChild], this.heap[minIndex])) {
          minIndex = leftChild
        }
  
        // Check if right child exists and has higher priority
        if (rightChild < length && this.comparator(this.heap[rightChild], this.heap[minIndex])) {
          minIndex = rightChild
        }
  
        // If no changes needed, break
        if (minIndex === index) {
          break
        }
        // Swap with the child that has higher priority
        ;[this.heap[index], this.heap[minIndex]] = [this.heap[minIndex], this.heap[index]]
        index = minIndex
      }
    }
  }
  