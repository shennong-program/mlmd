# Multilingual Markdown (MLMD)

![License](https://img.shields.io/npm/l/mlmd)
[![npm version](https://badge.fury.io/js/mlmd.svg)](https://www.npmjs.com/package/mlmd)
[![downloads](https://img.shields.io/npm/dt/mlmd.svg)](https://www.npmjs.com/package/mlmd)
![GitHub CI](https://github.com/Shennong-Program/mlmd/actions/workflows/ci.yml/badge.svg)

Multilingual Markdown parser

- Remove comments
- Add break between paragraphs
- Parse Multilingual content by locale
- Parse links
- Parse references
- Parse multilingual names

## Documentation

The documentation for `mlmd` is available on the documentation website of the ShennongAlpha ([ShennongDoc](https://shennongalpha.westlake.edu.cn/doc/)):

- [English](https://shennongalpha.westlake.edu.cn/doc/en/mlmd/)
- [中文](https://shennongalpha.westlake.edu.cn/doc/zh/mlmd/)

You can also contribute to the documentation on the [`ShennongDoc`](https://github.com/Shennong-Program/ShennongDoc) GitHub repository by submitting a pull request:

- [English](https://github.com/Shennong-Program/ShennongDoc/tree/main/doc/en/mlmd/)
- [中文](https://github.com/Shennong-Program/ShennongDoc/tree/main/doc/zh/mlmd/)

## Install

```sh
npm install mlmd
```

## Use

```jsx
import React from 'react'
import ReactDom from 'react-dom'
import { ReactMlmd } from 'mlmd'

const markdown = '[[中文|汉语]]'

ReactDom.render(<ReactMlmd locale="zh-en">{markdown}</ReactMlmd>, document.body)
```

## API

### `ReactMlmd`

Component to render markdown.

#### Parameters

- `locale` (Locale, optional)
  Set scoped locale, e.g. `zh-en`, `en-zh`, `zh`, `en`

#### Returns

React element (`JSX.Element`).

## Cite this work

Yang, Z., Yin, Y., Kong, C. et al. ShennongAlpha: an AI-driven sharing and collaboration platform for intelligent curation, acquisition, and translation of natural medicinal material knowledge. Cell Discov 11, 32 (2025). https://doi.org/10.1038/s41421-025-00776-2
