---
date: '2019-12-05'
---

分享几个自己编写的处理数值区间的函数
#### 合并多个区间
```
def merge(intervals):
    '''
    @msg: 合并多个区间
    @param intervals {list} 一个二维数组，每一项代表一个区间
    @return: {list}  返回合并后的区间列表
    '''

    intervals = [sorted(x) for x in intervals]
    intervals.sort(key=lambda x: x[0])
    merged = []
    for interval in intervals:
        if not merged or merged[-1][1] < interval[0]:
            merged.append(interval)
        else:
             merged[-1][1] = max(merged[-1][1], interval[1])
    return merged

```
例如将 [1,3]、[2,8]、[3,5]、[-100,-10]、[-5,2.5] 这几个区间合并：

```
intervals=[[1,3],[2,8],[3,5],[-100,-10],[-5,2.5]]
print(merge(intervals)) 
# 输出 [[-100, -10], [-5, 8]]
```
#### 判断两个区间的关系

```
def relation(interval1,interval2):
    '''
    @msg: 判断两个区间的关系
    @param interval1 {list} 第一个区间
    @param interval2 {list} 第二个区间
    @return: {int}  返回两个区间的关系，0:两个区间相等、1:两个区间相离、2:两个区间相交、3:两个区间为包含关系
    '''

    min1,max1=sorted(interval1)
    min2,max2=sorted(interval2)
    if(min1==min2 and max1==max2):return 0
    if(max1<min2 or max2<min1):return 1
    if(min1<min2<=max1<max2 or min2<min1<=max2<max1):return 2
    if(min1<=min2<=max2<=max1 or min2<=min1<=max1<=max2):return 3

```
例如分别判断：[1,10]和[1,10]、[1,10]和[11,20]、[1,10]和[5,15]、[1,20]和[5,15] 的关系

```
print(relation([1,10],[1,10]))  #0，相等
print(relation([1,10],[11,20])) #1，相离
print(relation([1,10],[5,15]))  #2，相交
print(relation([1,20],[5,15]))  #3，包含
```
#### 某个区间是否被另一个区间包含

```
def is_in(interval1,interval2):
    '''
    @msg: 判断某个区间是否被另一个区间包含
    @param interval1 {list} 第一个区间
    @param interval2 {list} 第二个区间
    @return: {bool}  interval1被interval2包含返回真，否则返回假
    '''

    min1,max1=sorted(interval1)
    min2,max2=sorted(interval2)
    if(min2<=min1<=max1<=max2):return True
    else: return False

```
例如，判断区间 [1,10] 是否被 [-5,15] 包含、[1,10] 是否被 [5,15] 包含：

```
print(is_in([1,10],[-5,15]))  #True
print(is_in([1,10],[5,15]))   #False
```
#### 求多个区间在某个大区间上的补集

```
def complement(wide,intervals):
    '''
    @msg: 求多个区间在某个大区间上的补集
    @param wide {list} 大区间
    @param intervals {list} 多个区间列表
    @return: {list}  返回补集区间列表
    '''

    start,end=wide
    front,back=start,start
    result=[]
    intervals = [sorted(x) for x in intervals]
    intervals.sort(key=lambda x: x[0])
    for (start1,end1) in intervals:
        if start1 > end: break
        front=start1
        if front>back:result.append([back,front-1])
        if end1+1>back: back=end1+1
    if back<=end: result.append([back,end])
    return(result)

```
例如，求区间 [1,200]、[300,600]、[500,700] 在 大区间 [1,1000] 上没有覆盖到的区间

```
wide = [1,1000]
intervals = [[1,200],[300,600],[500,700]]
print(complement(wide,intervals))
#输出 [[201, 299], [701, 1000]]
```
#### 求两个区间的交集

```
def intersection(interval1,interval2):
    '''
    @msg: 求两个区间的交集
    @param interval1 {list} 第一个区间
    @param interval2 {list} 第二个区间
    @return: {list}  若两个区间存在交集，则返回交集，否则返回空列表
    '''

    nums=sorted(interval1+interval2)
    if relation(interval1,interval2) != 1:
        return [nums[1],nums[2]]
    else:return []

```
例如，分别求：[1,10] 和 [15,25]、[1,10] 和 [5,15] 的交集
```
print(intersection([1,10],[15,25]))  # []
print(intersection([1,10],[5,15]))  # [5,10]
```
