---
date: '2020-06-17'
---

排序二叉树，满足节点的值大于左子树上的所有节点的值，且小于右子树上所有节点的值。

### 排序二叉树的实现
```javascript
function BinaryTree () {
  // 节点的构造函数
  var Node = function (key) {
    this.key = key
    this.left = null
    this.right = null
  }
  // 根节点默认为null
  var root = null
  // 插入节点
  var insertNode = function (node, newNode) {
    if (newNode.key < node.key) {
      if (node.left === null) {
        node.left = newNode
      } else {
        insertNode(node.left, newNode)
      }
    } else {
      if (node.right === null) {
        node.right = newNode
      } else {
        insertNode(node.right, newNode)
      }
    }
  }
  // 插入数值的方法
  this.insert = function (key) {
    var newNode = new Node(key)
    if (root === null) {
      root = newNode
    } else {
      insertNode(root, newNode)
    }
  }

  // 中序遍历，通过中序遍历可以升序打印排序二叉树
  // 左 -> 父 -> 右
  var inOrderTraverseNode = function (node, callback) {
    if (node.left) {
      inOrderTraverseNode(node.left, callback)
    }
    callback(node.key)
    if (node.right) {
      inOrderTraverseNode(node.right, callback)
    }
  }

  this.inOrderTraverse = function (callback) {
    inOrderTraverseNode(root, callback)
  }
  
  // 前序遍历 父 -> 左 -> 右
  // 可以通过前序遍历 复制二叉树，（通过插入的方式复制一个已经存在的二叉树，时间复杂度更高 n*log(n)）
  var preOrderTraverseNode = function (node, callback) {
    callback(node.key)
    if (node.left) {
      preOrderTraverseNode(node.left, callback)
    }
    if (node.right) {
      preOrderTraverseNode(node.right, callback)
    }
  }

  this.preOrderTraverse = function (callback) {
    preOrderTraverseNode(root, callback)
  }

  // 后续遍历 左 -> 右 -> 父 
  var postOrderTraverseNode = function (node, callback) {
    if (node.left) {
      postOrderTraverseNode(node.left, callback)
    }
    if (node.right) {
      postOrderTraverseNode(node.right, callback)
    }
    callback(node.key)
  }

  this.postOrderTraverse = function (callback) {
    postOrderTraverseNode(root, callback)
  }
  // 前序，中序，后序遍历，都是父->左->父->右->父，关键是什么时候打印父
  // 前序 父* ->  左  ->  父  ->  右  ->父
  // 中序 父  ->  左  ->  父* ->  右  ->父
  // 后序 父  ->  左  ->  父  ->  右  ->父*
  // 前中后序遍历都属于深度优先遍历

  // 层序遍历，属于广度优先遍历，通过一个队列实现
  this.levelOrderTraverse = function (callback) {
    var queue = [root]
    while (queue.length > 0) {
      var node = queue.pop()
      callback(node.key)
      if (node.left) queue.unshift(node.left)
      if (node.right) queue.unshift(node.right)
    }
  }

  // 查找最小值
  // 循环实现 最‘左边’的节点
  var minkey = function (node) {
    while (node.left) {
      node = node.left
    }
    return node.key
  }
  // 查找最小值的方法
  this.min = function () {
    return minkey(root)
  }

  // 查找最大值， 最‘右边’的节点
  var maxkey = function (node) {
    while (node.right) {
      node = node.right
    }
    return node.key
  }
  // 查找最大值的方法
  this.max = function () {
    return maxkey(root)
  }

  // 查找指定值
  var searchNode = function (node, key) {
    if (key === node.key) {console.log('ok');return true}
    else if (key < node.key && node.left) {return searchNode(node.left, key)}
    else if (node.right) {return searchNode(node.right, key)}
    return false
  }
  // 查找指定值的方法
  this.search = function (key) {
    return searchNode(root, key)
  }

  // 删除节点
  // 查找最小值，返回最小值的节点
  var minNode = function (node) {
    while (node.left) {
      node = node.left
    }
    return node
  }
  // 在某个子树中删除某个节点，参数1：子树的根节点， 参数2：删除值为多少的节点, 返回删除该节点后的子树根节点
  var removeNode = function (node, key) {
    // 该节点就是要删除的节点
    if (key === node.key) {
      // 该节点只有左孩子
      if (node.left && ! node.right) {
        node = node.left
      // 该节点只有右孩子
      } else if (node.right && ! node.left) {
        node = node.right
      // 该节点为叶子节点
      } else if ((! node.left) && (! node.right)) {
        node = null
      // 该节点同时具有左右子节点
      } else if (node.left && node.right) {
        var minNodeTmp = minNode(node.right)
        node.key = minNodeTmp.key
        node.right = removeNode(node.right, minNodeTmp.key)
      }
    // 要删除的节点 小于 该节点，在左子树中继续找
    } else if (key < node.key && node.left) {
      node.left = removeNode(node.left, key)
    // 要删除的节点 大于 该节点，在右子树中继续找
    } else if (node.right) {
      node.right = removeNode(node.right, key)
    }
    
    // 正常情况都返回这个node本身
    // 特殊情况返回null或需要接到上一层的节点，表示删除
    return node
  }
  // 删除节点的方法
  this.remove = function (key) {
    removeNode(root, key)
  }

  // 判断是否是完全二叉树，
  // 完全二叉树成立条件：层序遍历二叉树，找到某个节点，其左子节点为null，或左右子节点都为null，那么之后的节点都必须为叶子节点
  this.isCompleteTree = function () {
    var queue = [root], findEnd = false
    while (queue.length > 0) {
      var node = queue.pop()
      // 某个节点无左子节点且有右子节点 不是完全二叉树
      if (!(node.left) && node.right ) return false
      // 找到一个节点，有一个子节点为null（左null右不为null不为完全二叉树，已经排除），则后面的节点必须为叶子节点。通过一个flag保存这个状态
      if ((!node.left) || (!node.right)) findEnd = true
      // 如果已经找到了子节点存在null的节点，而当前节点又不是叶子节点，那么不是完全二叉树
      if (findEnd && (node.left || node.right)) return false
	
	  // 层序遍历，左右子节点的入队列
      if (node.left) queue.unshift(node.left)
      if (node.right) queue.unshift(node.right)
    }
    return true
  }

}

```
### 插入节点
```javascript
var nodes = [8, 3, 10, 1, 6, 14, 4, 7, 13]
var binaryTree = new BinaryTree()
nodes.forEach(function (key) {
  binaryTree.insert(key)
})
```
得到的排序二叉树如图：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200617180241579.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE4MzY5NjY5,size_16,color_FFFFFF,t_70#pic_center)
满足排序二叉树的条件
### 遍历
```javascript
var inOrderResult = [], preOrderResult = [], postOrderResult = [], levelOrderResult= []

binaryTree.inOrderTraverse(function (key) {inOrderResult.push(key)})
console.log('中序遍历：', inOrderResult.join(' => '))

binaryTree.preOrderTraverse(function (key) {preOrderResult.push(key)})
console.log('前序遍历：', preOrderResult.join(' => '))

binaryTree.postOrderTraverse(function (key) {postOrderResult.push(key)})
console.log('后序遍历：', postOrderResult.join(' => '))

binaryTree.levelOrderTraverse(function (key) {levelOrderResult.push(key)})
console.log('层序遍历：', levelOrderResult.join(' => '))
```
输出结果：
```
中序遍历： 1 => 3 => 4 => 6 => 7 => 8 => 10 => 13 => 14
前序遍历： 8 => 3 => 1 => 6 => 4 => 7 => 10 => 14 => 13
后序遍历： 1 => 4 => 7 => 6 => 3 => 13 => 14 => 10 => 8
层序遍历： 8 => 3 => 10 => 1 => 6 => 14 => 4 => 7 => 13
```
### 判断是否为完全二叉树
```javascript
console.log(binaryTree.isCompleteTree()) // false
```

当我们插入和删除一些节点后：
```javascript
binaryTree.insert(-1)
binaryTree.insert(2)
binaryTree.insert(9)
binaryTree.remove(13)

console.log(binaryTree.isCompleteTree()) // true
```
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200617184908392.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE4MzY5NjY5,size_16,color_FFFFFF,t_70#pic_center)
此时为完全二叉树
