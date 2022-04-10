---
date: '2020-05-19'
---

BFC（Block formatting context），直译为块格式化上下文，是CSS2.1中的一个概念，难以明确定义和解释（[什么是BFC](https://www.jianshu.com/p/0d713b32cd0d)）。
设置了BFC的元素有两个特性：

 - 能包裹住内部（浮动）元素
 - 能与外部浮动元素划清界限、产生边界

通过以下几种方式可以对某个元素触发BFC

- `display: flow-root;` 这是一个专门用来设置BFC的属性
- `display: inline-block;` display为flex也行
- `overflow: hidden;`
- `float: left;` float不为none都行
- `position: absolute;` position 为 absolute 或 fixed

以上方式根据实际情况使用即可。

下面讲述BFC的主要三种应用场景，以及每种应用场景的其他实现方式：
## 清除浮动
一个父元素包含了浮动的子元素后，父元素无法完全包裹子元素
```html
<div class="parent">
    <div class="sub"></div>
    <div class="sub"></div>
</div>
```
```css
.parent {
  border: 3px solid red;
}
.sub {
  border: 3px solid blue;
  width: 100px;
  height: 100px;
  background-color: #e9a;
  float: left;
}
```
![父元素没有设置高度，无法包裹浮动的子元素](https://img-blog.csdnimg.cn/20200529170621168.png#pic_center)
<center>图1. 父元素没有设置高度，无法包裹浮动的子元素</center>

怎样让父元素能包裹子元素呢？我们可以通过BFC的方式和clear属性的方式实现
### 使用BFC清除浮动
根据前面提到的BFC的特性，设置了BFC的元素能包裹住内部浮动的元素，所以只需要**对父元素设置BFC**就行
修改父元素的css：
```css
.parent {
  border: 3px solid red;
  display: flow-root;
  /* overflow: hidden; */
  /* display: inline-block; */
  /* float: left; */
  /* position: absolute; */
}
```
![使用BFC清除浮动后](https://img-blog.csdnimg.cn/20200529170542209.png#pic_center)
<center>图2. 使用BFC清除浮动后，父元素可以包裹浮动的子元素</center>

需要值得注意的是，使用`overflow: hidden` 和 `display: flow-root`，父元素宽度仍然为100%，而使用3种其他方式，父元素宽度变为刚好能包裹住子元素的宽度。实际开发中可以灵活应用恰当的方式
### 通过clear属性清除浮动
clear 属性规定元素的哪一侧不允许其他浮动元素，允许的属性值有`left`、`right`和`both`
如果在父元素中，最后添加一个空元素，并不允许它两边有浮动元素，则实现了清除浮动
```html
<div class="parent">
  <div class="sub"></div>
  <div class="sub"></div>
  <!-- 添加一个空元素，并为其设置clear -->
  <div class="empty" style="clear: both;"></div>
</div>
```
效果与图2相同
但是这样做，改变了DOM结构，是不推荐的做法，实际开发中往往通过设置父元素的::after伪元素，达到同样的效果
```css
.parent::after {
  content: '';
  display:block;
  clear:both;
}
```
## 两栏自适应布局
当我们需要左侧一个固定宽度的容器，右侧一个自适应宽度容器的布局时，传统的做法是右边元素设置一个比左侧元素大的margin，而通过BFC也可以很方便地实现这样的效果。

比如下面的html和css代码
```html
<body>
  <div class="left">123</div>
  <div class="right">456</div>
</body>
```
```css
div {
  border: 3px solid red;
  height: 100px;
}
.left {
  width: 100px;
  margin-right: 20px;
  float: left
}
.right {
  border-color: blue;
}
```
![左侧元素设置浮动后，右侧元素会与其重叠](https://img-blog.csdnimg.cn/20200529170503367.png#pic_center)
<center>图3. 左侧元素设置浮动后，右侧元素会与其重叠</center>

当左侧元素设置float后，左右两侧的两个块级元素能在同一行。虽然右侧元素的文字能环绕浮动的左侧元素，但是右侧元素与左侧元素还是重叠的（注意观察右侧元素的border-right）。左侧元素的margin-right仅仅对文字"456"起到了作用。
下面介绍两种方式解决重叠问题
### 右侧元素设置margin-left实现两栏自适应布局
传统的方式，右侧元素设置一个比左侧元素宽度大的margin-left
```css
div {
  border: 3px solid red;
  height: 100px;
}
.left {
  width: 100px;
  float: left
}
.right {
  border-color: blue;
  margin-left: 120px;
}
```
![通过为右侧元素设置margin-left实现两栏自适应布局](https://img-blog.csdnimg.cn/20200529171627695.png#pic_center)
<center>图4. 通过为右侧元素设置margin-left实现两栏自适应布局</center>

### 通过BFC实现两栏自适应布局
正如前面说到的BFC特性，能与外部浮动元素划清界限、产生边界。
可以通过为右侧元素设置BFC直接实现这种布局效果。
```css
div {
  border: 3px solid red;
  height: 100px;
}
.left {
  width: 100px;
  margin-right: 20px;
  float: left
}
.right {
  border-color: blue;
  /* margin-left: 120px; */
  display: flow-root;
  /* overflow: hidden; */
  /* 以下 BFC 的方式，虽然能与浮动元素划清界限，但无法实现宽度自适应*/
  /* display: inline-block; */
  /* float: left; */
  /* position: absolute; */
}
```
效果与图4相同。这里左侧元素的margin-left起到了作用。
需要注意的是，使用`display: inline-block;`、`float: left;`、`position: absolute;`等方式，虽然能与浮动元素划清界限，但无法实现宽度自适应，不能实现两栏自适应布局的要求。

### 通过flex实现
谈到布局，怎么少的了flex呢。flex布局在移动端兼容性很好，操作方便，布局简单！通过flex实现两栏自适应布局，需要添加一个外层容器，代码如下：
```html
<div class="wrapper">
  <div class="left">123</div>
  <div class="right">456</div>
</div>
```
```css
.wrapper {
  display: flex;
  flex-direction: row;
}
.left {
  width: 100px;
  border: 3px solid red;
  height: 100px;
  margin-right: 20px;
}
.right {
  border: 3px solid blue;
  height: 100px;
  flex: 1;
}
```
效果与图4相同

## margin塌陷
常见的margin塌陷大致分为两种情况：

- 父元素和第一个（最后一个）子元素的margin-top（margin-bottom），会合并
- 两个兄弟元素的margin-bottom和margin-top，会合并

左右margin不会出现margin合并的现象

下面分别对这两种情况进行讨论
### 父子元素margin塌陷
```html
<hr>
<div class="parent">
  <div class="sub">
  </div>
</div>
```
```css
.parent {
  margin-top: 20px;
  background-color: #777;
  height: 100px;
  width: 100px;
}
.sub {
  background-color: #e9a;
  margin-top: 10px;
  height: 50px;
  width: 50px;
}
```
![父子元素margin塌陷](https://img-blog.csdnimg.cn/2020052918575687.png#pic_center)
<center>图5. 父子元素margin塌陷</center>

对父元素设置margin-top为20px，子元素设置margin-top为10px，可以看到，这两个margin合并到了一起，表现为父元素的20px的margin-top。

那么如何让子元素的margin-top生效呢？可以通过传统的方式为父元素设置border或padding（不推荐），也可以设置父元素为BFC。
#### 通过border或padding解决父子元素margin塌陷
- 为父元素加border
```css
.parent {
  margin-top: 20px;
  background-color: #777;
  height: 100px;
  width: 100px;
  border: 1px solid red;
}
.sub {
  background-color: #e9a;
  margin-top: 10px;
  height: 50px;
  width: 50px;
}
```
![为父元素添加border解决父子元素margin塌陷](https://img-blog.csdnimg.cn/20200529190646179.png#pic_center)
<center>图6. 为父元素添加border，解决父子元素margin塌陷</center>


- 为父元素添加padding
```css
.parent {
  margin-top: 20px;
  background-color: #777;
  height: 100px;
  width: 100px;
  padding-top: 10px;
}
.sub {
  background-color: #e9a;
  margin-top: 10px;
  height: 50px;
  width: 50px;
}
```
![为父元素添加padding解决父子元素margin塌陷](https://img-blog.csdnimg.cn/20200529191116764.png#pic_center)
<center>图7. 为父元素添加padding，解决父子元素margin塌陷</center>

#### 通过父元素设置BFC解决父子元素margin塌陷
```css
.parent {
  margin-top: 20px;
  background-color: #777;
  height: 100px;
  width: 100px;
  display: flow-root;
  /* overflow: hidden; */
  /* display: inline-block; */
  /* float: left; */
  /* position: absolute; */
}
.sub {
  background-color: #e9a;
  margin-top: 10px;
  height: 50px;
  width: 50px;
}
```
![通过BFC解决父子元素margin塌陷](https://img-blog.csdnimg.cn/20200529191453300.png#pic_center)
<center>图8. 通过BFC解决父子元素margin塌陷</center>

### 兄弟元素margin塌陷
两个兄弟（块级）元素的margin-bottom和margin-top会发生合并
```html
<div class="sub1"></div>
<div class="sub2"></div>
```
```css
div[class^="sub"] {
  width: 100px;
  height: 100px;
  background-color: #e9a;
}
.sub1 {
  margin-bottom: 100px;
}
.sub2 {
  margin-top: 100px;
}
```
![兄弟元素margin塌陷](https://img-blog.csdnimg.cn/20200529191943405.png#pic_center)
<center>图9. 兄弟元素margin塌陷</center>
如图9所示，两个高100px的div，分别有100px的margin-bottom和margin-top，但是两个元素的间距并不是200px，而是合并为了100px

那么如何解决这个问题呢？
我们可以为后面一个元素外层添加一个容器，并对容器设置为BFC
```html
  <div class="sub1"></div>
<div class="parent">
  <div class="sub2"></div>
</div>
```
```css
.parent {
    display: flow-root;
    /* overflow: hidden; */
    /* display: inline-block; */
    /* float: left; */
    /* position: absolute; */
  }
```
![通过BFC解决兄弟元素的margin塌陷](https://img-blog.csdnimg.cn/20200529192557110.png#pic_center)
<center>图10. 通过BFC解决兄弟元素margin塌陷</center>
如图10，两个兄弟元素的外间距没有发生合并了

但是这种方式需要添加一个外层元素，同样改变了原有的DOM结构，不推荐这么做！
其实，兄弟元素之间的margin塌陷，完全可以不用解决，设置不同的margin，达到想要的页面效果就行了

## 总结
本文总结了BFC的概念和特性，以及BFC的三种主要用途--两栏自适应布局、清除浮动、清除margin塌陷。

两栏自适应布局布局可以通过如下方式实现：
- 右侧元素设置大于左侧元素宽度的margin-left
- 右侧元素设置BFC
- flex布局

清除浮动可以通过以下方式实现：
- 为父元素设置BFC
- 为父元素的::after伪元素设置 clear

清除父子元素margin塌陷可以通过如下方式解决：
- 为父元素设置border或padding（不推荐）
- 为父元素设置BFC
