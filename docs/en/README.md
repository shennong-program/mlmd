# Multilingual Markdown (MLMD)

## Core design principles

Multilingual Markdown (MLMD) is a newly designed lightweight markup language, tailored specifically for managing multilingual text. The syntax of MLMD integrates the strengths of Markdown while being specially designed for multilingual parallel corpora.

Primary Objective of MLMD: Allow users to write and manage multilingual parallel text in an easy-to-read and easy-to-write plain text format.

Thanks to the MLMD syntax that can manage multilingual content in a single document, it can be widely applied in the following scenarios:

- Multilingual text writing, content creation
- Unified/Structured management, storage of multilingual texts
- Multilingual display of multilingual texts
- Cross-language text annotation, entity annotation
- Cross-language translation, proofreading
- Cross-language machine translation
- Text analysis/mining of multilingual texts
- Natural language processing of multilingual texts
- ...

## Writing, storage, and file extension

The content of MLMD is in plain-text, making it possible to compose using any plain-text editor.

When saving MLMD content as an independent file, the `.mlmd` extension should be used. For instance, if we save MLMD text in a file named `abc.mlmd`, then `abc` represents the filename and `.mlmd` is the standard extension for MLMD.

Given that MLMD text is plain-text, an independent MLMD text can technically be embedded/stored as a single string within other file formats or databases such as JSON, SQL, MongoDB, etc.

For example, consider the following MLMD text:

```mlmd
{{langs|zh|en}}

你好，世界！
Hello, world!
```

It can be stored as a single string in a JSON structure:

```json
{
    "mlmd_str": "{{langs|zh|en}}\n\n你好，世界！\nHello, world!"
}
```

## Essential syntax

### MLMD language header

Since MLMD can be used to store parallel corpora of any number of languages, it is required to explicitly define the languages of the text stored in MLMD in the first line of every MLMD file, using the format `{{langs|language_code_1|language_code_2|...}}`. Following the syntax of MLMD, MLMD documents can manage parallel corpora of any number of languages, and thus, any number of non-repeating language codes can be used in the MLMD language header.

It is noteworthy that the first language code in the MLMD language header corresponds to the primary language of that particular MLMD document.

For instance, the language header of a bilingual MLMD document in Chinese and English is as follows:

```mlmd
{{langs|zh|en}}
```

Whereas the language header of a trilingual MLMD document in Chinese, English, and Latin is as follows:

```mlmd
{{langs|zh|en|la}}
```

### Multilingual parallel paragraphs

In MLMD, multilingual parallel corpora are managed at the paragraph level. Each multilingual paragraph is treated as a Block within MLMD. Within each Block, the paragraphs of text in different languages are arranged in the order of language codes, and are separated by a line break (when stored as strings, the newline character `\n` is used). Different Blocks are separated by a blank line (when stored as strings, two newline characters `\n\n` are used). For examples:

```mlmd
{{langs|zh|en}}

这是第1段中文。
This is the 1st paragraph in English.

这是第2段中文。
This is the 2nd paragraph in English.
```

```mlmd
{{langs|zh|en|la}}

这是第1段中文。
This is the 1st paragraph in English.
Hic est paragraphus Latinus primus.

这是第2段中文。
This is the 2nd paragraph in English.
Hic est paragraphus Latinus secundus.
```

Incidentally, the concept of a Block is actually one of the cores of MLMD, as when we wish to store data of different structures (such as links, images, etc.) within MLMD, they are essentially treated as individual Blocks. This management approach of Blocks allows MLMD to be conveniently parsed. The Blocks corresponding to multilingual parallel paragraphs are abbreviated as "Multi".

### Lists (ordered/unordered)

MLMD supports standard Markdown lists. In documents with a `{{langs|...}}` header, each paragraph inside a list item is aligned by language order: multiple lines in the same paragraph map to languages, and a blank line inside a list item starts a new paragraph.

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

If you need hard line breaks within a single language, use `<br>` or `<br/>` on the same line to avoid being parsed as multilingual alignment.

```mlmd
{{langs|zh|en}}

- 中文第一行<br>中文第二行
  English line one
```

### Language-invariant paragraphs

In multilingual texts, certain text paragraphs remain the same across all languages. We refer to such text as language-invariant paragraphs. When a Block in our saved MLMD document contains only one paragraph of text, it is automatically regarded as a language-invariant text. This type of Block is abbreviated as "Mono". For example:

```mlmd
{{langs|zh|en}}

这是第1个Block (Multi)中的中文段落。
This is an English paragraph in the 1st Block (Multi).

This is a language-invariant paragraph in English in the 2nd Block (Mono).

这是第3个Block (Mono)中的一段中文的跨语言不变段落。

这是第4个Block (Multi)中的中文段落。
This is an English paragraph in the 4th Block (Multi).
```

### Emphasis

In MLMD, text can be emphasized by wrapping with `**` for bold emphasis and `*` for italic emphasis. For example:

```mlmd
{{langs|zh|en}}

第1个Block (Multi)中的中文**加粗**段落。
A **bold** paragraph in English within the 1st Block (Multi).

A **bold** and *italic* language-invariant paragraph in English in the 2nd Block (Mono).

第3个Block (Mono)中的一段中文的**加粗**和*斜体*的跨语言不变段落。

第4个Block (Multi)中的中文*斜体*段落。
An *italic* paragraph in English within the 4th Block (Multi).
```

### Headings

MLMD supports up to six levels of headings. Headings are denoted using the `#` symbol. By prefixing a paragraph with 1-6 of the `#` symbols, you can designate the heading levels 1-6, respectively. For multilingual headings, use the `|` symbol to separate them. If there is no `|`, the heading content is treated as Mono. For example:

```mlmd
{{langs|zh|en}}

# 一级标题 | Heading Level-1

## 二级标题 | Heading Level-2

### 三级标题 | Heading Level-3

#### 四级标题 | Heading Level-4

##### 五级标题 | Heading Level-5

###### 六级标题 | Heading Level-6

# 一级标题

## Heading Level-2
```

### Coreference annotation

The central linguistic principle of this syntax is "coreference consistency". It recognizes that in multilingual or monolingual texts, different terms or phrases can refer to the same inherent concept or entity. This capacity to discern that, despite variations in form, the essence of the reference remains unchanged, underpins this principle. In MLMD, terms with this shared referential quality are described as having "coreference consistency".

Consider this illustrative example:

```mlmd
{{langs|zh|en}}

神农被中国人认为是医药学的始祖。
Shennong is considered the progenitor of medicine and pharmacy by the Chinese.

炎帝被中国人认为是医药学的始祖。
Yan Emperor is considered the progenitor of medicine and pharmacy by the Chinese.
```

To those familiar with the historical background, irrespective of the terms "神农", "炎帝", "Shennong", or "Yan Emperor" being used, they understand these allude to the same historical figure, specifically "神农" (Shennong). However, for those without this knowledge, these could appear as four separate concepts. To convey this textual coreference consistency within the content, MLMD introduces a dedicated coreference annotation syntax. This not only facilitates easier textual annotations of coreferential relationships but also enhances machine translation and AI natural language processing capabilities in understanding coreference consistency. The specific syntax is as follows:

The double bracket notation `[[...]]` is utilized for coreference annotation. It's crucial that no spaces exist between `[[` and `]]`.

The primary coreference annotations are of two types:

- When the term's expression aligns with its reference: `[[term's reference]]`
- When there's a divergence between the term's expression and its reference: `[[term's reference|term's expression]]`

By employing this approach, the sentences mentioned above can be annotated as:

```mlmd
{{langs|zh|en}}

[[神农]]被中国人认为是医药学的始祖。
[[神农|Shennong]] is considered the progenitor of medicine and pharmacy by the Chinese.

[[神农|炎帝]]被中国人认为是医药学的始祖。
[[神农|Yan Emperor]] is considered the progenitor of medicine and pharmacy by the Chinese.
```

In this framework, "神农" stands as the Primary Term denoting the concept, while "炎帝", "Shennong", and "Yan Emperor" are its coreferential terms. Hence, with the above coreference annotations, even those without the specific historical context can infer that these sentences all point to the same person, specifically "神农".

### Entity annotation

In natural language texts, certain terms often represent specific entities. By utilizing the coreference annotation syntax to corefer a term to its corresponding entity, we can achieve a unified annotation for that entity. In practice, terms can be coreferred to their corresponding entity ID.

For instance, both "青蒿" and "Qing-hao" correspond to the NMM ID "NMM-0001". Hence, we can annotate the entity as follows:

```mlmd
{{langs|zh|en}}

[[NMM-0001|青蒿]]是一种天然药材。
[[NMM-0001|Qing-hao]] is a kind of Natural Medicinal Material.
```

### Comments

For comments, MLMD uses `<!-- ... -->`. For example:

```mlmd
{{langs|zh|en}}

第1个Block (Multi)中的中文**加粗**段落。 <!-- 单行注释 -->
A **bold** paragraph in English within the 1st Block (Multi).  <!-- Single-line comment -->

A **bold** and *italic* language-invariant paragraph in English in the 2nd Block (Mono). <!-- Single-line comment -->

<!-- 多行注释
Multi-line comment
-->

第3个Block (Mono)中的一段中文的**加粗**和*斜体*的跨语言不变段落。 <!-- 单行注释 -->

第4个Block (Multi)中的中文*斜体*段落。
An *italic* paragraph in English within the 4th Block (Multi).
```

### Images

MLMD uses standard Markdown syntax for images. An image is rendered as a Mono block. For example:

```mlmd
{{langs|zh|en}}

人工智能赋能[[中医药]]现代化。
Artificial Intelligence empowers the modernization of [[中医药|traditional Chinese medicine and pharmacy]].

![An AI image](image path)

[[中医药]]是中国的瑰宝。
[[中医药|Traditional Chinese medicine and pharmacy]] is a treasure of China.
```

### Templates

For texts with specific functionalities, MLMD employs the template syntax `{{...}}` for annotation. No spaces are allowed between the double curly brackets `{{` and `}}`. For instance, the MLMD language header is a type of specialized template.

MLMD can be extended to cater to various unique template functional requirements. Detailed template syntax can be found in the MLMD repository. Here, we emphasize the citation template directly related to this paper.

### Citations

Users can conveniently add citations to the MLMD text using the citation template: `{{ref|@<ref_id>]}}`. This makes MLMD suitable for rigorous academic texts. For detailed information related to the `ref_id`, one can store it in BibTeX format using `{{ref-citation|bibtex|<ref_citation_info>}}`. The `ref_id` must match with the `ref_id` in the BibTeX within `ref_citation_info`. For example:

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

Specially, on the ShennongAlpha website, all references are stored in the ShennongKB reference collection. Each reference is assigned a globally unique ID in the format `sna-ref-xxx`. Hence, in ShennongAlpha, one can employ a special reference annotation like `{{ref|[[sna-ref-1]]}}`. Here, `[[sna-ref-1]]` serves as the `@<ref_id>`. Since `sna-ref-1` is encapsulated within `[[]]`, it signifies that `[[sna-ref-1]]` inherently is a coreference related to the citation. Therefore, when ShennongAlpha parses MLMD, it automatically fetches the reference information about `sna-ref-1` from ShennongKB. In this context, there's no further need to supplement the specific reference details through `{{ref-citation|bibtex}}`.

## Machine Translation Compatibility

MLMD natively supports a novel machine translation approach introduced in this paper: Neural Machine Translation based on Coreference Primary Term (NMT-CPT).

By utilizing coreference annotation to denote the relationships between standard Primary Terms and their translations, NMT-CPT offers users a streamlined and interactive presentation of translation results through the ShennongTranslate user interface. This approach significantly enhances the interpretability of machine translations.

## HTML Parsing

Through a parsing flow: MLMD → Abstract Syntax Tree (AST) → HTML, MLMD can be rendered into HTML with rich text formatting, enhancing the user experience while reading its content. ShennongAlpha natively supports HTML rendering of MLMD, offering the bilingual content presentation in four modes: "Chinese-English", "English-Chinese", "Chinese", and "English".

## ShennongAlpha Bilingual Display of MLMD

MLMD can be automatically parsed into HTML on the ShennongAlpha website and supports switching among four display modes: "Chinese-English", "English-Chinese", "Chinese", and "English".

### Example: multi-mono mixed text

```mlmd
{{langs|zh|en}}

青蒿是一种天然药材。
Qing-hao is a kind of NMMs.

NMM-0001是一个NMM ID。

NMM-0001 is a NMM ID.
```

![MLMD demo: multi-mono mixed text - MLMD source](../images/mlmd-multi-mono.png ':size=50%')

Figure: MLMD demo: multi-mono mixed text - MLMD source

![MLMD demo: multi-mono mixed text - Chinese-English mode](../images/mlmd-multi-mono-zh-en.png ':size=50%')

Figure: MLMD demo: multi-mono mixed text - Chinese-English mode

![MLMD demo: multi-mono mixed text - English-Chinese mode](../images/mlmd-multi-mono-en-zh.png ':size=50%')

Figure: MLMD demo: multi-mono mixed text - English-Chinese mode

![MLMD demo: multi-mono mixed text - Chinese mode](../images/mlmd-multi-mono-zh.png ':size=50%')

Figure: MLMD demo: multi-mono mixed text - Chinese mode

![MLMD demo: multi-mono mixed text - English mode](../images/mlmd-multi-mono-en.png ':size=50%')

Figure: MLMD demo: multi-mono mixed text - English mode

### Example: coreference annotation

```mlmd
{{langs|zh|en}}

[[nmm-0001|青蒿]]是一种天然药材。
[[nmm-0001|Qing-hao]] is a kind of NMMs.

[[NMM-0001]]是一个NMM ID。

[[NMM-0001]] is a NMM ID.
```

![MLMD demo: coreference annotation - MLMD source](../images/mlmd-coreference.png ':size=50%')

Figure: MLMD demo: coreference annotation - MLMD source

![MLMD demo: coreference annotation - Chinese-English mode](../images/mlmd-coreference-zh-en.png ':size=50%')

Figure: MLMD demo: coreference annotation - Chinese-English mode

![MLMD demo: coreference annotation - English-Chinese mode](../images/mlmd-coreference-en-zh.png ':size=50%')

Figure: MLMD demo: coreference annotation - English-Chinese mode

![MLMD demo: coreference annotation - Chinese mode](../images/mlmd-coreference-zh.png ':size=50%')

Figure: MLMD demo: coreference annotation - Chinese mode

![MLMD demo: coreference annotation - English mode](../images/mlmd-coreference-en.png ':size=50%')

Figure: MLMD demo: coreference annotation - English mode

### Example: headings

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

![MLMD demo: headings - MLMD source](../images/mlmd-heading.png ':size=50%')

Figure: MLMD demo: headings - MLMD source

![MLMD demo: headings - Chinese-English mode](../images/mlmd-heading-zh-en.png ':size=50%')

Figure: MLMD demo: headings - Chinese-English mode

![MLMD demo: headings - English-Chinese mode](../images/mlmd-heading-en-zh.png ':size=50%')

Figure: MLMD demo: headings - English-Chinese mode

![MLMD demo: headings - Chinese mode](../images/mlmd-heading-zh.png ':size=50%')

Figure: MLMD demo: headings - Chinese mode

![MLMD demo: headings - English mode](../images/mlmd-heading-en.png ':size=50%')

Figure: MLMD demo: headings - English mode
