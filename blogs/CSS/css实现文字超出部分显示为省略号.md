---
date: '2020-05-31'
---


html部分，一个div
```html
<div>
  hello world! I am Jason Yang. What's your name?
</div>
```

### 实现单行超出部分显示为省略号

主要需要设置3个属性，white-space、overflow、text-overflow
```css
div {
  width: 100px;
  background-color: #e9a;
  /* 不换行 */
  white-space: nowrap; 
  /* 超出部分隐藏 */
  overflow: hidden;
  /* 文字超出的部分显示为省略号 */
  text-overflow: ellipsis;
}
```
效果
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200531190341257.png#pic_center)

### 实现多行超出部分显示为省略号
```css
div {
  /* height: 50px; */
  width: 100px;
  background-color: #e9a;
  /* 超出部分隐藏 */
  overflow: hidden;
  /* 文字超出的部分显示为省略号 */
  text-overflow: ellipsis;
  
  display: -webkit-box;
  /* 显示的行数 */
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
```
效果
![在这里插入图片描述](https://img-blog.csdnimg.cn/20200531190533957.png#pic_center)
实测在最新版本的chrome、firefox浏览器均能实现该效果