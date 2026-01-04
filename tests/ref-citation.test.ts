import { test } from '@jest/globals'
import { parseRehype } from './helper'

test('parse reference citation bibtex article', () => {
  const input = `
{{ref-citation|bibtex|
@article{ai_masterbrain,
  title={AI becomes a masterbrain scientist},
  author={YANG, Zijie and WANG, Yukai and ZHANG, Lijing},
  journal={bioRxiv},
  pages={2023--04},
  year={2023},
  publisher={Cold Spring Harbor Laboratory},
}
}}
`

  const actual = parseRehype(input)

  const expected =
    '<span class="mlmd-ref-citation" data-id="ai_masterbrain" data-type="article" data-title="AI becomes a masterbrain scientist" data-author="YANG, Zijie and WANG, Yukai and ZHANG, Lijing" data-journal="bioRxiv" data-pages="2023--04" data-year="2023" data-publisher="Cold Spring Harbor Laboratory"></span>'

  expect(actual).toBe(expected)
})

test('parse reference citation bibtex article with params', () => {
  const input = `
{{ref-citation|bibtex|
@article{ai_masterbrain,
  title={AI becomes a masterbrain scientist},
  author={YANG, Zijie and WANG, Yukai and ZHANG, Lijing},
  journal={bioRxiv},
  year={2023},
  publisher={Cold Spring Harbor Laboratory},
}
}}
`

  const actual = parseRehype(input)

  const expected =
    '<span class="mlmd-ref-citation" data-id="ai_masterbrain" data-type="article" data-title="AI becomes a masterbrain scientist" data-author="YANG, Zijie and WANG, Yukai and ZHANG, Lijing" data-journal="bioRxiv" data-year="2023" data-publisher="Cold Spring Harbor Laboratory"></span>'

  expect(actual).toBe(expected)
})

test('parse reference citation bibtex multiple', () => {
  const input = `
{{ref-citation|bibtex|
@book{book1,
  title  = "Chinese History",
  author = "Chinese Publisher",
  year   = 2014,
}
@book{book2,
  title  = "@American History",
  author = "@American Publisher",
  year   = 2015,
}
@book{book3,
  title  = "Japan History",
  author = "Japan Publisher",
  year   = 2016,
}
}}
`

  const actual = parseRehype(input)

  const expected =
    '<span class="mlmd-ref-citation" data-id="book1" data-type="book" data-title="Chinese History" data-author="Chinese Publisher" data-year="2014"></span>' +
    '<span class="mlmd-ref-citation" data-id="book2" data-type="book" data-title="@American History" data-author="@American Publisher" data-year="2015"></span>' +
    '<span class="mlmd-ref-citation" data-id="book3" data-type="book" data-title="Japan History" data-author="Japan Publisher" data-year="2016"></span>'

  expect(actual).toBe(expected)
})
