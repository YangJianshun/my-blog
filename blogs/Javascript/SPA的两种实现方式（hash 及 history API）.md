---
title: 'SPA的两种实现方式（hash 及 history API）'
date: '2020-06-10'
---

## 什么是SPA
SPA是single page application的缩写，直译为单页面应用。简单来说就是一个web应用程序只有1个页面（1个html）。
在传统的web程序（多页面应用）中，用户每次进入新的页面都要向服务器发起请求，以获取整个页面的所有代码，几乎每一个响应动作都会刷新整个页面，不但浪费带宽，也影响了用户体验。
而SPA只需要请求一次页面代码，切换功能模块时，通过javascript控制渲染不同的内容，避免了请求新的页面（仅仅需要向服务端请求必要的数据），切换“页面”的时候速度很快。
## SPA 应该具有的特征
SPA核心是[前端路由](https://blog.csdn.net/u014168594/article/details/79181828?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522159178266419724811865160%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=159178266419724811865160&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~top_click~default-1-AB%AF%E8%B7%AF%E7%94%B1)，路由表示URL与资源的对应关系，前端路由简单说就是通过前端js代码处理不同URL与不同组件模块的对应关系。这些不同的URL在后端获取的都是整个页面资源，而在浏览器端，js通过判断不同的URL代表的具体功能模块，从而渲染不同的组件模块。

1个SPA应用具备的特征有：
- 切换组件不刷新页面
- 浏览器的前进后退按钮有效
- URL与组件的一一对应关系

## SPA的两种实现方式
接下来我们通过 hash 与history API 两种方式实现一个简单的SPA页面。
### html结构
```html
<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<title></title>
</head>
<style>
  #router-nav {
    width: 300px;
    height: 50px;
    border: 1px solid red;
    padding: 0;
    margin: 0 auto;
  }
  ul {
    margin: 0;
    padding: 0;
  }
  ul li {
    width: 80px;
    height: 30px;
    line-height: 30px;
    background-color: #e9a;
    list-style: none;
    float: left;
    margin: 10px;
    text-align: center;
    cursor: pointer;
  }
  #router-view {
    width: 300px;
    height: 300px;
    border: 1px solid #555;
    margin: 20px auto;
  }
</style>
<body>
  <div id="router-nav">
    <ul>
    <li class="nav-item" data-id="page1">page1</li>
    <li class="nav-item" data-id="page2">page2</li>
    <li class="nav-item" data-id="page3">page3</li>
    </ul>
  </div>
  <div id="router-view">

  </div>
  <!-- <script src="./router1_hash.js"></script> -->
  <script src="./router2_history.js"></script>
</body>
</html>
```
### 利用hash实现SPA
原理：
- 向通过URL中的hash部分（#后的锚点值）来映射不同的组件。
- 改变hash，也不会向服务端重新请求页面，也不会刷新页面
- 改变hash，会向浏览器的历史记录压入新的记录，使得浏览器的前进后退按钮可以像传统多页面应用一样正常工作
- hash部分不会影响URL在服务端请求的资源，而前端可以通过js判断需要渲染的组件，从而实现URL与组件的一一对应

router1_hash.js 代码如下：
```javascript
;(function () {
  var navItems = document.querySelectorAll('#router-nav .nav-item')
  var view = document.getElementById('router-view')
  
  window.addEventListener('load', function () {
    if (! location.hash) {location.hash = navItems[0].dataset.id}
    view.innerHTML = location.hash.slice(1)
  })

  for (var navItem of navItems) {
    console.log(navItem)
    navItem.addEventListener('click', function () {
      location.hash = this.dataset.id
    })
  }
  window.addEventListener('hashchange', function () {
    view.innerHTML = location.hash.slice(1)
    // ajax here
  })
})()
```
在Http和File协议均能正常运行，效果如图：
![hash实现的SPA，在Http协议下](https://img-blog.csdnimg.cn/20200610221146903.gif#pic_center)
### 利用history API 实现SPA
原理：
- 通过history.replaceState和history.pushState改变历史记录和url
- 如果改变的不仅仅是hash（如果仅仅改变hash，那可以直接用hash的方式实现SPA，何必用history API呢），那么实现URL和组件的一一对应，**需要服务端配合**

router2_history.js 代码如下
```javascript
;(function () {
  var navItems = document.querySelectorAll('#router-nav .nav-item')
  var view = document.getElementById('router-view')
  
  window.addEventListener('load', function () {
    view.innerHTML = navItems[0].dataset.id
    history.replaceState(navItems[0].dataset.id, null, navItems[0].dataset.id)
  })

  for (var navItem of navItems) {
    console.log(navItem)
    navItem.addEventListener('click', function () {
      history.pushState(this.dataset.id, null, this.dataset.id)
      view.innerHTML = this.dataset.id
      // ajax here
    })
  }

  window.addEventListener('popstate', function (e) {
    if (e.state) {view.innerHTML = e.state}
  })

})()
```
仅能在Http协议下有效，File协议修改url会报错，效果如图：
![history API 实现 的SPA，在Http协议下](https://img-blog.csdnimg.cn/202006102216192.gif#pic_center)
虽然通过history API修改了url，但实际上最开始请求服务端的并不是这个url，所以直接刷新会找不到资源。如下图
![history API 实现的SPA的限制，需要服务端配合](https://img-blog.csdnimg.cn/20200610221914217.gif#pic_center)
如果想要用户刷新没毛病，或者直接通过某个url渲染对应的组件，需要服务端配合，为这一系列URL设置同样的后端路由，都响应该SPA页面。然后前端代码再添加相应的逻辑，即可渲染指定的组件。

个人感觉。使用hash实现的SPA比较容易理解，也好实现。

以上内容属于个人总结，请大家评判指正。