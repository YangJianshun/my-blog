---
date: '2019-12-05'
---

### fasta文件格式
在生物信息学中，FASTA格式（又称为Pearson格式）是一种基于文本的、用于表示核苷酸序列或氨基酸序列的格式。FASTA文件以序列标识和序列作为一个基本单元，每个基本单元分为两部分：序列标记和序列本身。第一行以‘>’开头，后面紧跟序列标记；从第二行开始，直到下一个标记行(‘>’开头行)出现，或文件末尾，这部分为序列本身。 值得注意的是，序列中的换行符应该被忽略。

fasta文件格式详细介绍请参见： [传送门1](https://www.jianshu.com/p/cd232d34c408) [传送门2](https://baike.baidu.com/item/fasta%E6%A0%BC%E5%BC%8F/1168511?fr=aladdin)

例如：

```
>seq1
ATCGATCG
>seq2
AAATTTCC
CGGG
>seq3
TAGCTAGCTAGC
```
上面就是一个fasta文件的基本格式，描述了3条DNA序列seq1、seq2和seq3。值得注意的是fasta文件允许在序列中存在换行，这给我们的分析工作造成了麻烦。
#### perl读取fasta文件
编写perl脚本读取fasta比较简单，我们可以更改perl的特殊变量$/，让"行"的概念由换行符分割改为由fasta文件中序列标记开头标识">"分割。请参考以下代码

```
open IN,"<",$fa or die $!;
#$/ 默认为换行符'\n'，我们将其改为'>'
$/ = ">";<IN>;
while(<IN>){
        my @lines = split "\n",$_;
        my $seqName = shift @lines;
        my $seq = join '',@lines;
        $seq =~s/>\z//;
        #==============
        #这里拿到了$seqName和$seq分别为序列名和序列本身
        #请在这里编写对序列的分析代码
        #==============
        }
#为了避免对之后代码的影响，及时把$/改回来
$/ = "\n";
close IN;        
```
### python处理fasta文件
我封装了一些处理fasta文件的函数，涉及到读取序列、滑窗操作等，在这里分享给大家。

```

def readFa(fa):
    '''
    @msg: 读取一个fasta文件
    @param fa {str}  fasta 文件路径
    @return: {generator} 返回一个生成器，能迭代得到fasta文件的每一个序列名和序列
    '''
    with open(fa,'r') as FA:
        seqName,seq='',''
        while 1:
            line=FA.readline()
            line=line.strip('\n')
            if (line.startswith('>') or not line) and seqName:
                yield((seqName,seq))
            if line.startswith('>'):
                seqName = line[1:]
                seq=''
            else:
                seq+=line
            if not line:break


def getSeq(fa,querySeqName,start=1,end=0):
    '''
    @msg: 获取fasta文件的某一条序列
    @param fa {str}  fasta 文件路径
    @param querySeqName {str}  序列名
    @param start {int}  截取该序列时，起始位置，可省略，默认为1
    @param end {int}  fasta 截取该序列时，最后位置，可省略，默认为该序列全长
    @return: {str} 返回找到(截取到)的序列
    '''
    if start<0: start=start+1
    for seqName,seq in readFa(fa):
        if querySeqName==seqName:
            if end!=0: returnSeq = seq[start-1:end];print(start-1)
            else: returnSeq = seq[start-1:]
            return returnSeq


def getReverseComplement(sequence):
    '''
    @msg: 获取反向互补序列
    @param sequence {str}  一段DNA序列
    @return: {str} 返回反向互补序列
    '''
        sequence = sequence.upper()
        sequence = sequence.replace('A', 't')
        sequence = sequence.replace('T', 'a')
        sequence = sequence.replace('C', 'g')
        sequence = sequence.replace('G', 'c')
        return sequence.upper()[::-1]

def getGC(sequence):
    '''
    @msg: 获取某一条序列的GC含量
    @param sequence {str}  一段DNA序列
    @return: {float} 返回GC含量
    '''
    sequence=sequence.upper()
    return (sequence.count("G")+sequence.count("C"))/len(sequence)


def readSeqByWindow(sequence,winSize,stepSize):
    '''
    @msg: 滑窗读取某一条序列
    @param sequence {str}  一段DNA序列
    @param winSize {int}  窗口大小
    @param stepSize {int}  步长
    @return: {generator}  返回一个生成器，可迭代得到该序列的每一个窗口序列
    '''
    if stepSize<=0: return False
    now = 0
    seqLen = len(sequence)
    while(now+winSize-stepSize<seqLen):
        yield sequence[now:now+winSize]
        now+=stepSize

def getGapPos(sequence):
    '''
    @msg: 获取某条序列中gap的位置
    @param sequence {str}  一段DNA序列
    @return: {list}  返回一个列表，列表中每个元素为每个gap的起始和结束位置
    '''
    Ns = {'N', 'n'}
    result = []
    i = 0
    for base in sequence:
        i += 1
        if not base in Ns: continue
        if len(result) == 0 : result.append([i,i])
        elif i - result[-1][1] == 1: result[-1][1] = i
        else: result.append([i,i])
    return result


```

以下是两个小例子：

```
fa="./sequence.fasta"
#读取一个fasta文件，并输出其中的每一条序列名，序列长度和GC含量
for seqName,seq in readFa(fa):
    seqLen = len(seq)
    GC = getGC(seq)
    print(seqName,seqLen,GC)

#读取一个fasta文件，并以1000bp为窗口、100bp为步长读取每条序列，
#计算每个窗口的GC含量，并记录在字典中
GCLst = {}
for seqName,seq in readFa(fa):
    GCLst.setdefault(seqName,[])
    for winSeq in readSeqByWindow(seq,1000,100):
        GCLst[seqName].append(getGC(winSeq))

```
