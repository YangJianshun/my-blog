---
date: '2020-05-19'
---

## 冒泡排序 和 选择排序
### 冒泡排序
- 基础冒泡排序
```javascript
function maopao (arr) {
  var len = arr.length
  for (var i=0; i<len-1; i++) {
    for (var j=0; j<len-1-i; j++) {
      if (arr[j] > arr[j+1]) {
        var tmp = arr[j]
        arr[j] = arr[j+1]
        arr[j+1] = tmp
      }
    }
  }
  return arr
}
```
- 优化1： 冒泡过程中，记录上一次交换的位置，下一次冒泡，冒到上次结束位置就行了
```javascript
function maopao2 (arr) {
  var len = arr.length
  var lastSwapPos = len - 1
  var lastSwapPosTmp
  for (var i=0; i<len-1; i++) {
    for (var j=0; j<lastSwapPos; j++) {
      if (arr[j] > arr[j+1]) {
        var tmp = arr[j]
        arr[j] = arr[j+1]
        arr[j+1] = tmp
        lastSwapPosTmp = j
      }
    }
    lastSwapPos = lastSwapPosTmp
  }
  return arr
}
```
- 优化2：双向冒泡, 也可以结合优化2中的思想，记录上次交换位置，减少循环次数
```javascript
function maopao3 (arr) {
  var len = arr.length
  var low=0, high=len-1
  var lastHighSwapPos, lastLowSwapPos
  while (low < high) {
    for (var i=0; i<high; i++) {
      if (arr[i] > arr[i+1]) {
        var tmp = arr[i]
        arr[i] = arr[i+1]
        arr[i+1] = tmp
        lastHighSwapPos = i
      }
    }
    // high --
    high = lastHighSwapPos

    for (var i=high; i>low; i--) {
      if (arr[i] < arr[i-1]) {
        var tmp = arr[i]
        arr[i] = arr[i-1]
        arr[i-1] = tmp
        lastLowSwapPos = i
      } 
    }
    // low ++
    low = lastLowSwapPos
    console.log(arr)
  }
}
```
### 选择排序
```javascript
function selectSort (arr) {
  var len = arr.length
  for (var i=0; i<len-1; i++) {
    minIndex = i
    for (var j=i+1; j<len; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j
      }
    }
    var tmp = arr[i]
    arr[i] = arr[minIndex]
    arr[minIndex] = tmp
  }
  return arr
}
```
特点：冒泡排序交换次数多，选择排序交换次数少
**冒泡排序稳定，选择排序不稳定**
## 插入排序 和 希尔排序
### 插入排序
遍历整个数组，每次都往前面插，前面默认是排序好的
插入排序适合数据量小，或者数据基本有序
```javascript
function insertSort (arr) {
  var len = arr.length
  for (var i=1; i<len; i++) {
    var tmp = arr[i]
    for (var j=i-1; j>=0; j--) {
      if (tmp < arr[j]) {
        arr[j+1] = arr[j]
        arr[j] = tmp
      } else {
        break
      }
    }
  }
  return arr
}
```
### 希尔排序
希尔排序是插入排序的改进版，将适合数据量大、基本无序的排序。
希尔排序先按照一定的间隔，分别进行插入排序（大规模数据拆分成小规模数据）；然后减小间隔再分别进行插入排序（让数据逐渐变得有序），最后间隔减小到1，再进行最后一次插入排序（就是普通的插入排序了，保证排序后完全有序）
不同的希尔排序增量序列，时间复杂度不同，比较复杂
```javascript
// 获取希尔排序增量序列
function getGaps (len, name) {
  var gap = 1
  var gaps = []
  name = name === 'Knuth' ? 3 : name
  // 按照一定步长的希尔排序增量序列
  if (typeof name === 'number') {
    let step = parseInt(name)
    gaps.unshift(gap)
    while (gap < len/step) {
      gap = gap * step + 1
      gaps.unshift(gap)
    }
  }
  else if (name === 'Shell') {
    while (gap < len) {
      gaps.unshift(gap)
      gap *= 2
    }
  }
  else if (name === 'Gonnet') {
    while (gap < len) {
      gaps.unshift(gap)
      gap *= 2.2
      gap = Math.floor(gap)
    }
  }
  else if (name === 'Sedgewick') {
    let sedgewickGaps = [
      1073643521, 603906049, 268386305,
       150958081,  67084289,  37730305,
        16764929,   9427969,   4188161,
         2354689,   1045505,    587521,
          260609,    146305,     64769,
           36289,     16001,      8929,
            3905,      2161,       929,
             505,       209,       109,
              41,        19,         5,
               1
    ]
    let index = sedgewickGaps.findIndex(item => item < len)
    gaps = sedgewickGaps.slice(index)
  }
  // console.log('gaps', gaps)
  return gaps
}

// 希尔排序
function shellSort (arr, gaps) {
  var len = arr.length
  if (! gaps) {
    gaps = getGaps(len, 5)
  }
  for (var gap of gaps) {
    for (var i=1; i<len; i++ ) {
      var tmp = arr[i]
      for (var j=i-gap; j>=0; j-=gap) {
        if (tmp < arr[j]) {
          arr[j+gap] = arr[j]
          arr[j] = tmp
        } else {
          break
        }
      }
    }
  }
  return arr
}
```
特点：如果希尔排序增量序列为 [1] 的希尔排序等价于普通插入排序
**插入排序是稳定的，希尔排序是不稳定的**
## 归并排序和快速排序
### 归并排序
```javascript
// 必须left arr 和 right arr 中都排序好，或者 有一个长度为1
function merge(left, right) {
  var result = []
  while(left.length && right.length) {
    if (left[0] < right[0]) {
      result.push(left.shift())
    } else {
      result.push(right.shift())
    }
  }
  
  while (left.length)
    result.push(left.shift())
  while (right.length)
  result.push(right.shift())

  return result
}
function mergeSort (arr) {
  var len = arr.length
  if (len <= 1) {
    return arr
  }
  var middle = Math.floor(len / 2), left = arr.slice(0, middle), right = arr.slice(middle)
  return merge(mergeSort(left), mergeSort(right))
}
```
### 快速排序
以第一个元素为基准，左边开始往右边找比基准值小的，右边开始忘左边找比基准值大的，找到后就交换位置，这样就左边小，右边大，直到左右游标相遇，则相遇的位置应该是较小的数，此时，将基准值和相遇位置的交换。对左边和右边分别再次进行快速排序，这样迭代进行。
js中也可以不使用左右游标，交换位置的方式。直接将小值和大值分别push到新数组，再递归调用快排函数就行了。
```javascript
function quickSort (arr, start=0, end) {
  if (arr.length === 1) return arr
  if ((! end) && (end != 0)) end = arr.length - 1
  if (start >= end) return
  var leftIndex = start, rightIndex = end
  var baseIndex = start
  var centerIndex = start
  var tmp
  // console.log(arr, start, end, arr[baseIndex])
  while (1) {
    while (arr[rightIndex] >= arr[baseIndex] && rightIndex > 0) {rightIndex --} // 右边先找一个比base小的
    while (arr[leftIndex] <= arr[baseIndex] && leftIndex < rightIndex) {leftIndex ++} // 左边找一个比 base 大的，或者与右边相遇
    
    centerIndex = leftIndex
    // console.log(leftIndex, '=>', arr[leftIndex], '\t', rightIndex, '=>', arr[rightIndex])
    if (leftIndex >= rightIndex) break

    tmp = arr[leftIndex]
    arr[leftIndex] = arr[rightIndex]
    arr[rightIndex] = tmp
    // console.log(arr)
    
  }
  tmp = arr[baseIndex]
  arr[baseIndex] = arr[centerIndex]
  arr[centerIndex] = tmp
  // console.log('===')
  // console.log(arr)
  // console.log(start, centerIndex - 1)
  // console.log(centerIndex + 1, end)
  quickSort(arr, start, centerIndex - 1)
  quickSort(arr, centerIndex + 1, end)
  return arr
}
```
归并排序 和 快速排序 都采用了“分而治之”的思想。归并排序是对两个有序数组的合并，快排是对无序数组，以某个基准值，分为大值数组和小值数组。
归并是先递归到最小数组，再归并；快排是先划分再递归。
**归并排序稳定，快速排序不稳定**

## 计数排序和桶排序
### 计数排序
将待排序数组中的值作为countArr数组的下标，countArr中则记录待排序数组中该元素的个数。
为了尽量避免浪费空间，待排序数组中的值减去一个最小值
```javascript
function countSort (arr) {
  var len = arr.length
      countArr = []
  if (len <= 1) return arr
  var min = Math.min.apply(null, arr)
  // var max = Math.max.apply(null, arr)

  arr.forEach((value, index) => {
    countArr[value-min] = countArr[value-min] ? countArr[value-min]: 0
    countArr[value-min]++
  })
  var list = []
  countArr.forEach((value, index) => {
    if (! value) cointinue
    for (var i=0; i<value; i++) {
      list.push(index+min)
    }
  })
  return list
}
```
### 桶排序
将待排序数组中的值分到若干个“桶”中（如对1 ~ 100的数，分为1 ~ 20、21 ~ 30 ...,  91 ~ 100，共10个桶），对每个桶单独排序（可以用任意其他排序方法），分的桶越多，越浪费空间
计数排序是桶排序的一种特殊形式，即所用桶都只允许装一个元素，每个元素给一个桶。此时速度最快，但很浪费空间。
```javascript
function bucketSort (arr, num) {
  var len = arr.length,
      max = Math.max.apply(null, arr),
      min = Math.min.apply(null, arr),
      space = Math.ceil((max - min + 1) / num)
      buckets = []
      console.log(space)
  for (value of arr) {
    var index = Math.floor((value-min)/space)
    buckets[index] = buckets[index] ? buckets[index]: []
    buckets[index].push(value)    
  }
  var result = []
  buckets.forEach(item => {
    console.log(item)
    result = result.concat(quickSort(item))
  })
  return result

}
```

**计数排序和桶排序都是稳定的**

## 堆排序
如果要顺序排序，则要先构建最大堆 （反之构建最小堆）
构建最大堆时，从最后一个非叶子节点开始调整堆结构，最后一个非叶子节点为 Math.floor(len / 2) - 1, 往前面走都是非叶子节点
```
         0 
       /   \
     1      2
    / \    / \
   3   4  5   6
  / \
 7   8

 如上面所示，下标3就是最后一个非叶子节点（9/2-1=3.5），往前面都是非叶子节点
 从下标3开始调整堆结构，构建最大堆，这是堆排序第一步
```
构建最大堆后，最后一个元素和堆顶元素交换，然后最后一个元素移除堆，再次维护最大堆。依次迭代，每次都通过堆找出最大值，放在最后面。
```javascript
function heapify (arr, i, len) {
  var l = 2 * i + 1,
      r = 2 * i + 2,
      largest = i,
      temp
  if (l < len && arr[l] > arr[largest]) {
    largest = l
  }
  if (r < len && arr[r] > arr[largest]) {
    largest = r
  }
  // console.log(i, len, largest)
  if (largest !== i) {
    temp = arr[largest]
    arr[largest] = arr[i]
    arr[i] = temp
    if (largest <= Math.floor(len / 2) - 1)
      heapify(arr, largest, len)
  }
  // console.log(arr)
}

function heapSort (arr) {
  arr = arr.slice()
  var len = arr.length
  // 构建最大堆
  for (var i = Math.floor(len / 2) - 1; i >= 0; i--) {
    heapify(arr, i, len)
  }
  // 最后一个元素和堆顶元素交换，然后最后一个元素移除堆，再次维护最大堆
  for (var j=len-1; j>0; j--) {
    var temp = arr[j]
    arr[j] = arr[0]
    arr[0] = temp
    heapify(arr, 0, j)
  }
  return arr
}
```

堆排序可以改为求某个数组，第n大的值
```javascript
function nthLargest (arr, n) {
  arr = arr.slice()
  var len = arr.length
  var result
  // 构建最大堆
  for (var i = Math.floor(len / 2) - 1; i >= 0; i--) {
    heapify(arr, i, len)
  }
  // 最后一个元素和堆顶元素交换，然后最后一个元素移除堆，再次维护最大堆
  for (var j=len-1,k=1; j>0 && k<=n; j--) {
    var temp = arr[j]
    arr[j] = arr[0]
    arr[0] = temp
    result = arr[j]
    heapify(arr, 0, j)
    k ++
  }
  return result
}

```