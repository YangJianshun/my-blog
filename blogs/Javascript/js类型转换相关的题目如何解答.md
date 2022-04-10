---
date: '2020-06-07'
---

javascript 是一种弱类型的语言，在代码执行过程中会发生显式和隐式的类型转换，往往让人眼花缭乱。

首先看一组题目，请说出以下js代码会输出什么内容：

```javascript
!{}[1]
{} + []
12 / []
[] == false
[] == ![]
[1] > null
```

如果你还不能很顺利地说出答案和理解答案背后的原理，相信本文的内容会有助于对js类型转换有更深入地理解。



## 基础

### javascript 基本数据类型

ECMAscript3 规定了6种内置数据类型，其中包括5种普通数据类型：`number`,`string`,`boolean`,`undefined`,`null`，以及引用数据类型`object`。

普通类型和引用类型的区别不在本文讨论范围。

注意:

- 数组也属于`object`
- NaN 属于 number
- ES6新增的Map、Set数据结构，本质上属于object类型
- ES6新增的数据类型`symbol`暂不在本文讨论范围。

### toString方法

除了 null 和 undefined之外，其他数据类型的值都有`toString`方法

- number、boolean类型的`toString`方法，返回对应的字符串形式，string类型的toString方法返回本身

```javascript
1.2.toString() // '1.2'
// 点号. 有两个作用：（1）小数点；（2）获取对象的属性方、法，但是会优先处理为小数点
// 错误写法
1.toString() // Uncaught SyntaxError: Invalid or unexpected token
// 正确写法：加括号 或 加空格
(1).toString() // '1'
1 .toString() // '1'

true.toString() // 'true'
'hello world'.toString() // 'hello world'
```

- 普通对象的`toString`方法，返回`'[object Object]'`

```javascript
// {} 有两个作用：（1）对象；（2）代码块 {} 放在最前面时会被优先处理为代码块
{}.toString() // SyntaxError: Unexpected token '.'
// 正确写法，只能加括号
({}).toString() // '[object Object]'
console.log({}.toString)
```

- 数组对象的`toString`方法，返回逗号分隔的数组元素组成的字符串

```javascript
[1, 2, 3].toString() // '1,2,3'
```

- 重写 `Object.prototype.toString`，可以自定义`toString`方法的返回值

```javascript
({toString(){return 666}}).toString() // 666

Object.prototype.toString = ()=>'this is an object'
{}).toString() // 'this is an object'
```

### Number 函数

`Number`函数可以将其它类型转为Number类型，与之类似的有`parseInt`和`parseFloat`函数，但后两者是将字符串解析为数字，在此不做详细讨论。

`Number`函数的规则如下：

- 基本类型
  - 数字返回本身
  - true返回1，false返回0
  - null返回0，undefined返回NaN
  - 字符串含有任意非数字（小数点）的字符，返回NaN；否则返回对应的数字；空字符串返回0
- 对象 先执行ToPrimitive抽象操作，转为普通类型，再按照上述基本类型的规则返回对应的值，ToPrimitive操作包括以下两步：
  1. 如果该对象的`valueOf`方法返回的是基本类型，则ToPrimitive操作返回基本类型，否则执行第2步
  2. 返回该对象`toString`方法的返回值，如果返回值不为普通类型，则报错

图示：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200607205601275.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE4MzY5NjY5,size_16,color_FFFFFF,t_70#pic_center)
示例：

```javascript
Number(12.3) // 12.3
Number(true) // 1
Number(false) // 0
Number(null) // 0
Number(undefined) // NaN
Number('12.3') // 12.3
Number('') // 0
Number('12.3a') // NaN
Number({}) // NaN
Number([]) // 0 [].toString() 返回'', Number('')返回0
Number([1]) // 1 [1].toString() 返回'1', Number('1')返回1
Number([1, 2]) // 1 [1,2].toString() 返回'1', Number('1,2')返回NaN

Number({valueOf () {return '123'}}) // 123
Number({valueOf () {return []}}) // NaN 对象的valueOf返回引用类型，则调用toString方法，返回'[object Object]', Number('[object Object]')返回NaN
Number({toString () {return '456'}}) // 该对象的valueOf方法默认返回本身，而本身为对象，是引用类型，所以继续执行toString方法，返回'456'，Number('456') 返回 456
Number({toString () {return []}}) // 报错， valueOf方法和toString方法都返回引用类型，就会报错
Number({toString () {return '123'}}) // 123
Number({valueOf () {return 123} , toString () {return 456}}) // 123 valueOf方法返回普通类型后，就不再执行toString方法

```

### Boolean 函数

- undefined、null、0、-0、NaN、''转为false
- 其余的包括{}和[]都转为true
注意：Boolean对引用类型转换，不会触发引用类型的ToPrimitive抽象操作
```javascript
Boolean({}) // true
// 之前我这么理解的 {} ToPrimitive 操作转为 '[object Object]'
// Boolean('[object Object]') 返回true
// 如果照这么理解，那么 Boolean([]) 就该是Boolean('') 返回false
Boolean([]) // true
// 实际并不是这么回事，因为Boolean对引用类型，并不会触发ToPrimitive操作！
// 除了 null、undefined、NaN、0、-0、''，其余都返回true！
// 记住 Boolean不触发ToPrimitive操作！！！
```

## 判断 a == b 返回什么

如果 a 和 b类型相同则直接比较，若a和b类型不同，则涉及隐式类型转换，相关规则如下：

- null == undefined 返回true
- a、b中有一个为NaN， 返回false，NaN和任何值（包括NaN本身）比较都为NaN
- null 与 任何值比较都返回false，null与null比较返回true
- undefined 与 任何值比较都返回false，undefined 与undefined 比较返回true
- 如果其中一个是对象，则先对对象进行ToPrimitive抽象操作，转为普通类型。如果ToPrimitive抽象操作失败则会报错
- 对象转为基本类型后，如果a、b类型相同，则直接比较
- 对象转为基本类型后，如果a、b类型不同，则转为数字比较
如果不能理解，请直接看图示：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200607222102819.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzE4MzY5NjY5,size_16,color_FFFFFF,t_70#pic_center)
*该流程图仅仅是我总结的解答相关题目的思路图，并不是程序执行的顺序*
示例：

```javascript
[] == {} // false 引用类型，地址不同
true == 'true' // false Number(true)返回1 Number('true') 返回NaN， 1 == NaN 返回false
[] == false // true 空数组[]的ToPrimitive操作得到空字符串'',此时'' 和 false类型不同，转为number都为0，0==0返回true
[] == ![] // true     取非优先级较高，先执行![]，这里涉及到boolean的隐式类型转换，Boolean([])为true，![]为false。此时变为判断 [] == false，[]转为普通类型'', '' == false, 0 == 0 返回 true

[] == false // true    '' == false、0 == 0 true
[] == true // false    '' == true、0 == 1 false
({}) == false // false
({}) == true // false  Number({})返回NaN,NaN跟任何值比较都返回false

[] == null // false    null跟任何值（null和undefined外）比较，都返回false
[] + 1 == null + 1 // true   + 触发类型转换， 0 + 1 == 0 + 1 返回true
{} + 1 == null + 1 // true   {}被理解为为代码块， +1 == 0+1 返回ture
({}) + 1 == null + 1 // false  + 触发number类型转换 {}加括号被理解为对象，'[object Object]' + 1 == 0 + 1、  '[object Object]1' == 1、 NaN == 1 返回false
```

## 其他

- 算数运算符、比较运算符触发number类型的隐式转换
- if 语句、取非运算符 触发boolean类型的隐藏式转换
- +运算符，如果有字符串，优先执行字符串拼接（引用类型先ToPrimitive转为普通类型）；如果+出现在最前面，则触发number类型的隐式转换

接下来看几个例子

```javascript
12 / true // 12    true转为数字1
12 / [] // Infinity     [] 转为普通类型''，12 / '' 、''再转为数字0 12/0得到无限大Infinity
1 + [] // '1'   1 + '', 由于+运算符比较特殊，既可以做算术运算，也可以拼接字符串，且优先拼接字符串，因此这里1会转为'1'，然后 '1' + '' 得到'1'
+'123' // 123 + 出现在最前面，会转为数字
+ true // 1
+ {} // NaN  {} 转为普通类型为'[object Object]'，+ 在最前面，触发Number({}) 得NaN
1 + {} // '1[object Object]' 相当于 1 + '[object Object]' + 在中间，且有字符串存在，触发字符串拼接
{} + 1 // '[object Object]1'
1 + 18 + 'hello' // '19hello' 第一个+ 触发算术运算，第二个+触发字符串拼接
{} + [] // 0     {}可以表示对象，也可以表示代码块，{} 出现在前面会被解释器处理为代码块 这里相当于 + [] ,+ 触发算术运算
'hi' + [] // hi   +触发字符串拼接
!{}[1] // true ! undefined 触发 boolean的类型转换，undefined 取非为true
[1] > null // true >触发number类型转换，1 > 0 返回true
[1,2] < null // false     NaN < null 返回false
```
