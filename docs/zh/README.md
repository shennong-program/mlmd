# `mlmd`文档：多语Markdown (Multilingual Markdown, MLMD)

多语Markdown (Multilingual Markdown, MLMD) 是由西湖大学神农计划提出的一种全新的、专门为多语文档设计的Markdown语法，其可以在一个单一的文档中并行组织和嵌入多种语言内容，以实现平行对比、统一管理和优化展示。这种方法不仅使文档的编写和编辑更为方便，还为处理和分析多语数据提供了一种结构化方案。

MLMD最初被设计以适应于“神农Alpha” (ShennongAlpha) 网站的共指注释、切换显示中英/英中/中/英或其他多语显示模式等需求。但由于其在设计之初就充分考虑到了泛用性，因此，其也可以被应用于其他应用场景，包括但不限于多语内容管理、国际化和本地化项目管理、机器翻译，等等。

本文档简述了MLMD语法的规则，以及其背后的设计理念。

## 核心理念

让用户可以通过编辑纯文本的形式，进而实现多语复杂内容的管理和展示。

## 撰写、储存与文件后缀

MLMD是一种纯文本语法，可以在任何纯文本编辑器中进行编辑。

将MLMD保存为独立文件时，使用`.mlmd`作为文件后缀。当我们使用`.mlmd`时，我们将带MLMD语法注释的纯文本保存至一个类似于`abc.mlmd`的文件中，其中`abc`是文件名，`.mlmd`是MLMD的标准文件后缀。另外，由于`.mlmd`中储存的内容是字符串，因此，其全部内容实际上可以作为1条字符串被进一步储存/应用于其他文件格式/数据库中，如JSON, SQL, MongoDB, etc。

例如，下面的文本是MLMD的一种形式：

```mlmd
{{langs|zh|en}}

你好，世界！
Hello, world!
```

其可以被储存为json格式：

```json
{
    "mlmd_str": "{{langs|zh|en}}\n\n你好，世界！\nHello, world!"
}
```

## 机器翻译兼容

MLMD原生兼容ShennongAlpha项目所提出的全新的机器翻译方法：基于共指主词的神经机器翻译 (Neural Machine Translation based on coreference primary term, NMT-CPT)。

## HTML解析流

MLMD的解析流为：MLMD字符串 -> 抽象语法树 (Abstract Syntax Tree, AST) -> HTML

## 核心语法

### 共指注释

该语法的核心语言学原理是：共指一致。即，之所以我们能够理解语言中使用某个词语指称的某个固有概念或实体时，我们实际上是理解了该词语本质是对于某个固有概念或实体的共指。

以一个简单的案例为例：

```text
神农被中国人认为是医药学的始祖。
炎帝被中国人认为是医药学的始祖。
Shennong is regarded as the founder of medicine and pharmacy by Chinese people.
```

对于以上3句话，对于有一定背景知识的人而言，无论我们使用的名词是“神农”、“炎帝”、亦或是“Shennong”，其实际都能够理解其指向的是同一个历史人物，即“神农”。而对于不具有相关知识的人而言，他们可能会认为这是3个不同的概念。因此在MLMD中，我们特别设计了一种共指注释语法，来帮助我们方便地在文本中标注共指关系，以便于人们的理解；或在机器翻译和文本处理中，能够更好让机器理解文本的含义。

具体语法如下：

采用`[[]]`双方括号注释语法。注意，`[[`, `]]`双方括号间不得含有任何空格。

基本共指注释包含一下2种形式：

1. 当一个词语和其指向一致时：`[[词指向]]`
2. 当一个词语和其指向不一致时：`[[词指向|词显示]]`

通过这种方法，上述3句话可以被分别注释为：

```text
[[神农]]被中国人认为是医药学的始祖。
[[神农|炎帝]]被中国人认为是医药学的始祖。
[[神农|Shennong]] is regarded as the founder of medicine and pharmacy by Chinese people.
```

在这里，可以理解为`神农`充当了“神农”这一概念所指向的主词，而`炎帝`和`Shennong`则充当了“神农”这一概念的共指词。因此，通过上述注释，即便是不具有相关知识的人，也能够理解这3句话实际上是在讲同一个人，即“神农”。

该语法被解析到HTML后显示为：

[神农氏](<神农>)被中国人视为医药的发明者。

其中`神农氏`自动被解析了共指到`神农`超链接。

#### 术语注释

该语法也便于文本注释者/译者/校对者调整术语标注，如：

```text
人工智能赋能传统[[中医药]]现代化。
↓
人工智能赋能[[中医药|传统中医药]]现代化。
```

`传统中医药`和`中医药`在上述句子中的内涵本质是相同的，因此，我们可以将`传统中医药`共指至`中医药`，从而实现对于术语的统一标注。

上述案例以HTML显示为：

从：

人工智能赋能传统[中医药](<中医药>)现代化。

变为：

人工智能赋能[传统中医药](<中医药>)现代化。

但是，共指超链接词时，实际上都指向了`中医药`页面。

#### 实体注释

在自然语言文本中，有一些术语其实际上是代表了一种实体，因此，通过将术语共指到其对应的实体，我们可以实现对于实体的统一标注。在实践中，我们可以将术语共指到其对应的实体ID。

例如：`青蒿`对应于NMM ID为`NMM-0001`的中药材。则可进行以下实体注释：

```text
[[NMM-0001|青蒿]]是一种天然药材。
[[NMM-0001|Qing-hao]] is a kind of Natural Medicinal Material.
```

#### 译法注释

为了保证跨语言术语共指的一致性，以保证标准化的翻译，我们可以使用NMT-CPT翻译方法，将靶语言中的术语译法共指到其源语言中的术语。

例如，假设我们希望把下面的句子从中文翻译为英文：

```text
[[神农]]被中国人认为是医药学的始祖。
```

则我们可以翻译为：

```text
[[神农|Shennong]] is regarded as the founder of medicine and pharmacy by Chinese people.
```

在这里，我们将`Shennong`共指到了`神农`，从而实现了跨语言的共指一致和术语标准化。

### 平行语料文件头

当`.mlmd`储存的时平行多语文本时，需要在`.mlmd`文件**第1行**加入以下文件头，提示文本多语顺序，方可启动MLMD的文本自动解析。

```mlmd
{{langs|语种code1|语种code2|...}}
```

如，下面的文件头就释义该文档的多语平行结构是中文(zh)-英文(en)：

```mlmd
{{langs|zh|en}}

人工智能赋能[[中医药]]现代化。
Artificial Intelligence empowers the modernization of [[中医药|traditional Chinese medicine and pharmacy]].
```

注意，在上面的案例中，中文（zh）是主语言。`中医药`是一个术语，当希望实现标准化翻译时，其应当使用标准译法`traditional Chinese medicine and pharmacy`进行翻译。基于该项目所提出的翻译的共指主词一致原理。因此在英译端，实际上`traditional Chinese medicine and pharmacy`应当被共指向主语言主词`中医药`。

上述案例在zh-en, en-zh, zh, en下分别显示为：

**zh-en:**

人工智能赋能[中医药](<中医药>)现代化。
Artificial Intelligence empowers the modernization of [traditional Chinese medicine and pharmacy](<中医药>).

**en-zh:**

[Artificial Intelligence](<中医药>) empowers the modernization of [traditional Chinese medicine and pharmacy](<中医药>).
人工智能赋能[中医药](<中医药>)现代化。

（注意和zh-en相比，en-zh先显示了英文，后显示了中文。）

**zh:**

人工智能赋能[中医药](<中医药>)现代化。

**en:**

Artificial Intelligence empowers the modernization of [traditional Chinese medicine and pharmacy](<中医药>).

### Block

为了保持语料文本平行性，在MLMD中，我们是维持段对齐，每一对平行段被视为1个block。当1个`.mlmd`中需要保存多个平行段时，注意block中间**必须空一行**。

! 注意：对于许多md渲染器，如果要实现换行，其必须输入2次回车`\n\n`（段间距大）。而如果想要是段内换行，则需要在行尾额外打2个空格再换行才能实现换行，即`__\n`（下划线代表空格）（段间距小）。而在MLMD中，默认敲1个`\n`即换行，敲2个`\n`，即`\n\n`，分block。（额外敲2个空格太反人类了😓）

Block的概念实际上也是MLMD的核心之一，因为，当我们储存不同类型的数据（如图片等）时，实际上也是将其视为一个个的Block。如果要方便理解的话，可以说该概念和`html`中tag container相类似。

```mlmd
{{langs|zh|en}}

人工智能赋能[[中医药]]现代化。
Artificial Intelligence empowers the modernization of [[中医药|traditional Chinese medicine and pharmacy]].

[[中医药]]是中国的瑰宝。
[[中医药|Traditional Chinese medicine and pharmacy]] is a treasure of China.
```

上述案例在zh-en, en-zh, zh, en下分别显示为：

**zh-en:**

人工智能赋能[中医药](<中医药>)现代化。
Artificial Intelligence empowers the modernization of [traditional Chinese medicine and pharmacy](<中医药>).

[中医药](<中医药>)是中国的瑰宝。
[Traditional Chinese medicine and pharmacy](<中医药>) is a treasure of China.

**en-zh:**

[Artificial Intelligence](<中医药>) empowers the modernization of [traditional Chinese medicine and pharmacy](<中医药>).
人工智能赋能[中医药](<中医药>)现代化。

[Traditional Chinese medicine and pharmacy](<中医药>) is a treasure of China.
[中医药](<中医药>)是中国的瑰宝。

**zh:**

人工智能赋能[中医药](<中医药>)现代化。

[中医药](<中医药>)是中国的瑰宝。

**en:**

Artificial Intelligence empowers the modernization of [traditional Chinese medicine and pharmacy](<中医药>).

[Traditional Chinese medicine and pharmacy](<中医药>) is a treasure of China.

### 列表（有序/无序）

MLMD支持标准Markdown列表。在带`{{langs|...}}`头的文档中，列表项内的每个段落仍按语言顺序对齐：同一段落内的多行分别对应多种语言；列表项内的空行表示新的段落。

```mlmd
{{langs|zh|en|la}}

1. 列表项一
   List item one
   Primum item
2. 列表项二
   List item two
   Secundum item

- 无序项一
  Unordered item one
  Primum inordinatum

- 多段第一段中文
  Multi-paragraph first English
  Primum paragraphum

  多段第二段中文
  Multi-paragraph second English
  Secundum paragraphum
```

如果需要在单语言内强制换行，请在同一行内使用`<br>`或`<br/>`，避免直接换行被解析为多语对齐。

```mlmd
{{langs|zh|en}}

- 中文第一行<br>中文第二行
  English line one
```

### Multilingual

当然，MLMD语法天然也适配多语种拓展性。

如:

```mlmd
{{langs|zh|en|la}}

[[NMM-0001|黄花蒿地上部（NMM-0001, 青蒿）]]是一种草药。
[[NMM-0001|Artemisia annua Part-aerial (NMM-0001, Qing-hao)]] is a herb.
[[NMM-0001|Artemisia annua Part-aerial (NMM-0001, Qing-hao)]] est herba.

zhzhzh
enenen
lalala
```

上述`.mlmd`是一个3语种的文档，其中`zh`是主语言。

类似的，MLMD可以支持任意多种语种的文档。

### 跨语言不变文本（mono）

对于有的文本信息，我们希望其无论在哪种语言中都有相同的显示，则对于这类文本，当我们保存的文档中的1个block中只有1段文本时，其自动被视为是“跨语言不变文本”（简称“mono”）。

如：

```mlmd
{{langs|zh|en}}

[[NMM-0001|青蒿]]包含以下化合物，其ID为：
[[NMM-0001|Qing-hao]] contains the following chemical compounds with IDs:

[[CID-68827]]

[[中医药]]是中国的瑰宝。
[[中医药|Traditional Chinese medicine and pharmacy]] is a treasure of China.
```

上述文本分别在zh-en, en-zh, zh, en显示模式下，显示如下：

**zh-en:**

[青蒿](NMM-0001)包含以下化合物，其ID为：
[Qing-hao](NMM-0001) contains the following chemical compounds with IDs:

[CID-68827](CID-68827)

[中医药](中医药)是中国的瑰宝。
[Traditional Chinese medicine and pharmacy](中医药) is a treasure of China.

**en-zh:**

[Qing-hao](NMM-0001) contains the following chemical compounds with IDs:
[青蒿](NMM-0001)包含以下化合物，其ID为：

[CID-68827](CID-68827)

[Traditional Chinese medicine and pharmacy](中医药) is a treasure of China.
[中医药](中医药)是中国的瑰宝。

**zh:**

[青蒿](NMM-0001)包含以下化合物，其ID为：

[CID-68827](CID-68827)

[中医药](中医药)是中国的瑰宝。

**en:**

[Qing-hao](NMM-0001) contains the following chemical compounds with IDs:

[CID-68827](CID-68827)

[Traditional Chinese medicine and pharmacy](中医药) is a treasure of China.

### 标题

使用`|`进行分割。若无`|`标题内容视为mono。

```mlmd
{{langs|zh|en}}

# 一级标题 | Level-1 Title

## 二级标题| Level-2 Title

### 三级标题| Level-3 Title

#### 四级标题 | Level-4 Title

##### 五级标题 | Level-5 Title

###### 六级标题 | Level-6 Title

## 二级标题mono
```

### 注释

采用和Markdown相同的注释语法：`<!-- ... -->`

### 图片

采用标准Markdown语法。图片的显示形式等价于1个mono。

案例：

```mlmd
{{langs|zh|en}}

人工智能赋能[[中医药]]现代化。
Artificial Intelligence empowers the modernization of [[中医药|traditional Chinese medicine and pharmacy]].

![人工智能的图片](图片路径)

[[中医药]]是中国的瑰宝。
[[中医药|Traditional Chinese medicine and pharmacy]] is a treasure of China.
```

### 模板

对于有特殊文本结构或者功能的文本，使用模板注释语法`{{...}}`。`{{`, `}}`的双重花括号中间不能加入任何空格。

（实际上平行语料文件头就是一种特殊的模板。）

模板中，可以使用分隔符`|`对不同内容进行分割。除非特殊模板，模板中所包含的文本不能含有`|`，如果必须要包含，使用反斜杠`\`消除分隔符功能，即`\|`。

#### 连续模板

案例1：

```mlmd
abc{{
    <!-- 模板1 -->
}}{{ <!-- 这里的下一个模板的左双花括号和上一个模板的右双括号在同一行，因此其被认为和模板1的注释行是相同的 -->
    <!-- 模板2 -->
}}def{{
    <!-- 模板3 -->
}}
```

上述案例等价于：

```mlmd
abc{{<!-- 模板1 -->}}{{<!-- 模板2 -->}}def{{<!-- 模板3 -->}}
```

案例2：

```mlmd
abc{{
    <!-- 模板1 -->
}}
{{ <!-- 这里的下一个模板的左双花括号起始于新行，因此其被认为和模板1的注释行是不同的 -->
    <!-- 模板2 -->
}}def{{
    <!-- 模板3 -->
}}
```

上述案例等价于：

```mlmd
abc{{<!-- 模板1 -->}}
{{<!-- 模板2 -->}}def{{<!-- 模板3 -->}}
```

### 引用注释

采用引用模板：`{{ref|@<ref_id>]}}`。

对于引用id相关的具体信息，使用bibtex格式储存在`{{ref-citation|bibtex|<ref_citation_info>}}`中。

注意`ref_id`要和`ref_citation_info`中的BibTex的`ref_id`一致。

案例：

```mlmd
{{langs|zh|en}}

AI介导的五阶段科学革命，这一理论在《AI成为主脑科学家》这篇论文中被首次提出{{ref|@ai_masterbrain}}。
The theory of the "Five Stages of AI-involved Scientific Revolution" was first introduced in the paper titled "AI Becomes a Masterbrain Scientist" {{ref|@ai_masterbrain}}.

{{ref-citation|bibtex|
@article{ai_masterbrain,
  title={AI becomes a masterbrain scientist},
  author={YANG, Zijie and WANG, Yukai and ZHANG, Lijing},
  journal={bioRxiv},
  pages={2023--04},
  year={2023},
  publisher={Cold Spring Harbor Laboratory}
}
}}
```

#### 引用内参数传递

当引用中包含一些参数补充时，我们可以用`{{ref|<ref_id_1>, key1=value1, key2=value2, ...|<ref_id_2>, key3=value3, key4=value4, ...}}`的形式进行传递。

说明：

- `<ref_id>`可以是`@xxx`或`[[sna-ref-xxx]]`形式，以分别表示引用同文档的引用ID或引用神农数据库中的引用ID。
- 命名时所有的`key`必须使用snake_case命名法。`key`后第一个`=`后面的内容被视为`value`的开始。
- 所有`value`都是无类型的，均被视为字符串。
- 由于`,`在参数传递时被视为分隔符，因此，如果需要在`value`中包含`,`，则需要使用使用`""`进行包裹，即`","`。另一方面，由于`|`在MLMD中被视为模板分隔符，因此，如果需要在`value`中包含`|`，也需要使用`""`进行包裹，即`"|"`。如果`value`中包含`"`则需要使用`""`包裹，并在`"`"前置一个额外的`"`进行转义，即`""""`。（该规则参考[RFC-4180](https://datatracker.ietf.org/doc/html/rfc4180)。）

案例：

```mlmd
{{ref|@ai_masterbrain, key1="abc,def|ghi""jkl!@#$%^&*()-=_+[]{};':./<>?", key2="abc|def"|[[sna-ref-1]], key3=value3, key4=value4}}
```

值得注意的，在这个案例中，我们的MLMD的原字符串中的`key1`, `key2`对应的`value`以原始字符串的形式储存了一些特殊字符。

在MLMD Parser的解析过程中，我们首先将上述语法基于`|`进行分割，获得：

```json
["ref", ["@ai_masterbrain, key1=\"abc,def|ghi\"\"jkl!@#$%^&*()-=_+[]{};':./<>?\", key2=\"abc|def\"", "[[sna-ref-1]], key3=value3, key4=value4"]]
```

在上述分割后，我们获得了一个列表，其中第1个元素为模版的名字，第2个元素为模版的参数列表。

进一步，针对`ref`模版，我们可以进一步基于`,`和`=`进行分割，获得：

```json
{
    "template_name": "ref",
    "template_data": [
        {
            "ref_id": "@ai_masterbrain",
            "key1": "\"abc,def|ghi\"\"jkl!@#$%^&*()-=_+[]{};':./<>?\"",
            "key2": "\"ghi|jkl\""
        },
        {
            "ref_id": "[[sna-ref-1]]",
            "key3": "value3",
            "key4": "value4"
        }
    ]
}
```

进一步，我们对于每个`value`进行去包裹化，并将处于包裹中的`""`转换为`"`，获得：

```json
{
    "template_name": "ref",
    "template_data": [
        {
            "ref_id": "@ai_masterbrain",
            "key1": "abc,def|ghi\"jkl!@#$%^&*()-=_+[]{};':./<>?",
            "key2": "ghi|jkl"
        },
        {
            "ref_id": "[[sna-ref-1]]",
            "key3": "value3",
            "key4": "value4"
        }
    ]
}
```

## 神农Alpha专门语法

### SNA全局Ref引用注释

在神农Alpha网站中，所有的引用都单独保存在引用数据库中。并赋予一个`sna-ref-xxx`形式的全局唯一的ID。

因此在SNA网站中，可以使用`{{ref|[[sna-ref-xxx]]}}`的形式进行引用。

神农Alpha读取到该语法后，会自动从数据库中读取`sna-ref-xxx`对应的引用信息，并进行显示。

## 神农Alpha中英双语展示MLMD

MLMD在神农Alpha网站中可以被自动解析为HTML，并支持在中英、英中、中、英4种显示模式间切换。

### 例：multi-mono文本混排

```mlmd
{{langs|zh|en}}

青蒿是一种天然药材。
Qing-hao is a kind of NMMs.

NMM-0001是一个NMM ID。

NMM-0001 is a NMM ID.
```

![MLMD展示：multi-mono文本混排-MLMD源码](images/mlmd-multi-mono.png ':size=50%')

图：MLMD展示：multi-mono文本混排-MLMD源码

![MLMD展示：multi-mono文本混排-中英模式](images/mlmd-multi-mono-zh-en.png ':size=50%')

图：MLMD展示：multi-mono文本混排-中英模式

![MLMD展示：multi-mono文本混排-英中模式](images/mlmd-multi-mono-en-zh.png ':size=50%')

图：MLMD展示：multi-mono文本混排-英中模式

![MLMD展示：multi-mono文本混排-中模式](images/mlmd-multi-mono-zh.png ':size=50%')

图：MLMD展示：multi-mono文本混排-英模式

![MLMD展示：multi-mono文本混排-英模式](images/mlmd-multi-mono-en.png ':size=50%')

图：MLMD展示：multi-mono文本混排-英模式

### 例：共指注释

```mlmd
{{langs|zh|en}}

[[nmm-0001|青蒿]]是一种天然药材。
[[nmm-0001|Qing-hao]] is a kind of NMMs.

[[NMM-0001]]是一个NMM ID。

[[NMM-0001]] is a NMM ID.
```

![MLMD展示：共指注释-MLMD源码](images/mlmd-coreference.png ':size=50%')

图：MLMD展示：共指注释-MLMD源码

![MLMD展示：共指注释-中英模式](images/mlmd-coreference-zh-en.png ':size=50%')

图：MLMD展示：共指注释-中英模式

![MLMD展示：共指注释-英中模式](images/mlmd-coreference-en-zh.png ':size=50%')

图：MLMD展示：共指注释-英中模式

![MLMD展示：共指注释-中模式](images/mlmd-coreference-zh.png ':size=50%')

图：MLMD展示：共指注释-中模式

![MLMD展示：共指注释-英模式](images/mlmd-coreference-en.png ':size=50%')

图：MLMD展示：共指注释-英模式

### 例：标题

```mlmd
{{langs|zh|en}}

# 一级标题 | Heading Level-1

## 二级标题 | Heading Level-2

### 三级标题 | Heading Level-3

#### 四级标题 | Heading Level-4

##### 五级标题 | Heading Level-5

###### 六级标题 | Heading Level-6

# 单语一级标题

## Heading Level-2 Monolingual
```

![MLMD展示：标题-MLMD源码](images/mlmd-heading.png ':size=50%')

图：MLMD展示：标题-MLMD源码

![MLMD展示：标题-中英模式](images/mlmd-heading-zh-en.png ':size=50%')

图：MLMD展示：标题-中英模式

![MLMD展示：标题-英中模式](images/mlmd-heading-en-zh.png ':size=50%')

图：MLMD展示：标题-英中模式

![MLMD展示：标题-中模式](images/mlmd-heading-zh.png ':size=50%')

图：MLMD展示：标题-中模式

![MLMD展示：标题-英模式](images/mlmd-heading-en.png ':size=50%')

图：MLMD展示：标题-英模式
