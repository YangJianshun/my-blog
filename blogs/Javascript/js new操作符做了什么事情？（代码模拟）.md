---
date: '2020-06-08'
---


先执行一下new操作符，实例化一个对象。看看new操作符会产生什么效果。代码如下：
```javascript
var Student = function (id) {
  this.id = id
}
var stu1 = new Student(1)
console.log(stu1) // Student { id: 1 }
console.log(stu1 instanceof Student) // true
console.log(stu1.__proto__ === Student.prototype) // true
console.log(stu1.__proto__.constructor === Student) // true

```
在上面代码中，定义了一个Student的构造函数，函数体内只有一行代码`this.id = id`，希望通过这种方式为实例对象添加一个id属性。可以观察到new 操作符得到的实例对象：（1）确实存在id属性，且被赋值为1；（2）其__proto__指向构造函数的prototype原型

我们如果给构造函数加一个返回值会如何呢？
```javascript
var Student = function (id) {
  this.id = id
  return 'hello world'
}
var stu1 = new Student(1)
console.log(stu1) // Student { id: 1 }
console.log(stu1 instanceof Student) // true
console.log(stu1.__proto__ === Student.prototype) // true
console.log(stu1.__proto__.constructor === Student) // true
```
可以看到，构造函数返回一个普通类型（非引用类型）不会产生任何影响
那如果构造函数返回一个引用类型呢
```javascript
var Student = function (id) {
  this.id = id
  return {hello: 'world'}
}
var stu1 = new Student(1)
console.log(stu1) // {hello: 'world'}
console.log(stu1 instanceof Student) // false
console.log(stu1.__proto__ === Student.prototype) // false
console.log(stu1.__proto__.constructor === Student) // false
```
如上面的代码，new操作符直接返回了构造函数的返回值，和直接调用构造函数，效果相同。

至此，我们大致明白了new操作符的处理方式：
- 如果构造函数返回引用类型，则new操作符直接返回该引用类型
- 构造函数没有返回值，或返回值为普通类型，new操作符则返回一个构造函数的实例对象，可以通过构造函数中的this为该实例对象的属性赋值，且该实例对象的__proto__指向了构造函数的prototype

下面用自定义函数模拟以下new操作符
```javascript
var myNew = function(constructor) {

  // 1.创建一个对象 obj
  var obj = {}

  // 2.改变obj的__proto__，为构造函数的prototype
  obj.__proto__ = constructor.prototype

  // 3.调用这个构造函数，改变this指向为 obj; 保存构造函数的返回值
  var args = Array.from(arguments).slice(1)
  var returnObj = constructor.apply(obj, args)
  
  // 4.如果构造函数返回的是对象，那么就直接返回(与new操作符的行为一致)
  if ((returnObj !== null && typeof returnObj === 'object') || typeof returnObj === 'function') return returnObj

  // 5.返回这个obj对象
  return obj
}
```
测试:
```javascript
var stu2 = myNew(Student, 1)
console.log(stu2) // Student { id: 1 }   具有id这个属性，多亏了第3步
console.log(stu2 instanceof Student) // true   多亏了第2步 obj的__proto__原型指向了Student的prototype对象   
console.log(stu2.__proto__.constructor === Student) // true  多亏了第2步，Student.prototype.constructor 指向Student本身
```

总结：
new操作符做了哪些事情：
- 创建一个对象
- 该对象的__proto__指向构造函数的prototype
- 调用构造函数（改变构造函数中this的指向为创建的这个对象）
- 如果构造函数返回值是引用类型，就返回构造函数的返回值
- 如果构造函数返回值不是引用类型，就返回创建的这个对象

以上是我个人理解，仅供参考
