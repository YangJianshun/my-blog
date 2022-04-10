---
date: '2020-11-19'
---

一道字节的面试题，要求补全以下代码，实现一个 Scheduler 类，完成对Promise 的并发控制，使得以下代码的输出顺序是：2、3、1、4
```javascript
class Scheduler {
  constructor () {
  }
  addTask () {
  }
}

const timeout = (time) => new Promise(resolve => {
    setTimeout(resolve, time)
})

const scheduler = new Scheduler()

scheduler.addTask(() => timeout(1000)).then(() => console.log(1))
scheduler.addTask(() => timeout(500)).then(() => console.log(2))
scheduler.addTask(() => timeout(300)).then(() => console.log(3))
scheduler.addTask(() => timeout(400)).then(() => console.log(4))
```

大致分析一下，addTask方法传入的应该是一个函数，这个函数返回值是一个 Promise 实例，addTask方法的返回值为一个 Promise 对象。
当时想了一晚上也没想出来怎么写，原因是有一个思维定式，就是： 
```javascript
new Promise ((resolve, reject) => {
	// resolve 和 reject 的调用只能写在这里
	// 这是个思维定式，其实不然，resolve，reject可以当成参数传递给其他函数，或者放到数组等数据结构中，在其它地方拿出来调用。
})
```
之前有了这个思维定式，怎么也想不出好的解决办法，因为控制并发很容易实现，但是要addTask方法返回一个恰当的Promise对象与之对应则不好实现。
其实 resolve、reject 可以当成参数传递给其他函数，或者放到数组等数据结构中，在其它地方拿出来调用。这样就写了两种实现方式

## 实现方式1
将任务存放在一个队列里面，每次执行完都从队列里面拿新的任务。为了addTask返回的是一个Promise，且在添加的这个任务执行完之后，这个Promise再变为fullfiled状态，则需要把**这个Promise回调函数的resolve和reject也存到队列里面**
```javascript
class Schrduler { 
    /**
     * @description: 构造函数
     * @param {Number} max 最大并发数量，默认为3
     * @param {Boolean} autoCancelTasks 在某个 Promise 任务变为 rejected 状态时候
     *                                 是否自动取消其它所有暂未执行的任务
     * @return {*}
     */    
    constructor (max = 2, autoCancelTasks = false) {
        this.max = max
        this.count = 0
        this.taskQueue = []
        this.autoCancelTasks = autoCancelTasks
        this.canAddTask = true
    }
    /**
     * @description: 添加任务，传入一个生成 Promise 对象的函数及其运行时候的参数，
     *               但该函数不会立即执行，调度器会在当前并发数量小于最大并发数量
     *               的时候按顺序执行添加的任务，即调用该函数
     * @param {*} promiseCreator 一个函数，其返回值应该是 Promise 实例对象
     * @param {array} args  传入 promiseCreator 的参数
     * @return {Promise} 返回一个Promise 对象
     */ 
    addTask (promiseCreator, ...args) {
        return new Promise((resolve, reject) => {
            if (this.canAddTask) {
                this.taskQueue.push([promiseCreator, resolve, reject, ...args])
                this.__runNextTask() 
            } else {
                reject(new Error('Failed to add new task'))
            }
             
        })
    }
    /**
     * @description: 从任务队列中取出一个任务执行。
     */    
    __runNextTask () {
        if (this.count < this.max && this.taskQueue.length > 0) {
            let [promiseCreator, resolve, reject, ...args] = this.taskQueue.shift()
            this.count ++
            promiseCreator(...args).then(msg => {
                this.count --
                resolve(msg)
                this.__runNextTask()
            }, err => {
                this.count --
                if (this.autoCancelTasks) this.__cancelTask()
                reject(err)
                this.__runNextTask()
            })
        }
    }
    /**
     * @description: 取消所有任务，将执行以下操作
     *               清空 taskQueue，已经添加过的任务还未执行的，不会被再执行
     *               设置 canAddTask 为 false，也无法添加新的任务
     */
    __cancelTask () {
        this.taskQueue.length = 0
        this.canAddTask = false
    }
}

```
## 实现方式2
为每个任务增加一个“阻塞”，即前面用一个Promise对象完成阻塞，只有这个Promise对象状态变为fullfiled之后（resolve调用之后），才会触发后续的.then，**所以用一个队列存放“阻塞Promise”的resolve**，每次任务执行完后，都调用一个resolve，解除一个阻塞。
```javascript
class Schrduler { 
    /**
     * @description: 构造函数
     * @param {Number} max 最大并发数量，默认为3
     * @param {Boolean} autoCancelTasks 在某个 Promise 任务变为 rejected 状态时候
     *                                 是否自动取消其它所有暂未执行的任务
     * @return {*}
     */    
    constructor (max = 2, autoCancelTasks = false) {
        this.max = max
        this.autoCancelTasks = autoCancelTasks
        this.count = 0
        this.canAddTask = true
        this.blockResolveQueue = []
    }
    /**
     * @description: 添加任务，传入一个生成 Promise 对象的函数及其运行时候的参数，
     *               但该函数不会立即执行，调度器会在当前并发数量小于最大并发数量
     *               的时候按顺序执行添加的任务，即调用该函数
     * @param {*} promiseCreator 一个函数，其返回值应该是 Promise 实例对象
     * @param {array} args  传入 promiseCreator 的参数
     * @return {Promise} 返回一个Promise 对象
     */    
    addTask (promiseCreator, ...args) {
        return new Promise((resolve, reject) => {
            if (!this.canAddTask) {
              reject(new Error('Failed to add new task'))  
            } else if (this.count < this.max) {
                this.count ++
                resolve()
            } else {
                this.blockResolveQueue.push(resolve)
            }
        })
        .then(() => {
            return new Promise((resolve, reject) => {
                promiseCreator(...args).then(msg => {
                    resolve(msg)
                    this.__cancelBlock()
                }, err => {
                    reject(err)
                    if (this.autoCancelTasks) this.__cancelTask()
                    this.__cancelBlock()
                })
            })
        })
    }
    /**
     * @description: 取消一个阻塞，让下一个任务开始执行。
     */    
    __cancelBlock () {
        this.count --
        if (this.blockResolveQueue.length > 0) {
            this.count ++
            this.blockResolveQueue.shift()()
        }
    }
    /**
     * @description: 取消所有任务，将执行以下操作
     *               清空 blockResolveQueue，已经添加过的任务还未执行的，不会被再执行
     *               设置 canAddTask 为 false，也无法添加新的任务
     */
    __cancelTask () {
        this.blockResolveQueue.length = 0
        this.canAddTask = false
    }
}
```
