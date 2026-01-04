import { test } from '@jest/globals'
import { parseRemark, readFile } from './helper'

describe('Parse text without langs', () => {
  test('parse without locale', () => {
    const input = '# 一级标题 | Level-1 Title'

    const actual = parseRemark(input)

    const expected = '# 一级标题 | Level-1 Title\n'

    expect(actual).toBe(expected)
  })

  test('parse with en-zh', () => {
    const input = '# 一级标题 | Level-1 Title'

    const actual = parseRemark(input, 'en-zh')

    const expected = '# 一级标题 | Level-1 Title\n'

    expect(actual).toBe(expected)
  })
})

describe('Parse text with fixtures', () => {
  test('parse text by zh-en-la', () => {
    const input = readFile('locale.input.md')

    const actual = parseRemark(input)

    const expected = readFile('locale.output.zh-en-la.md')

    expect(actual).toBe(expected)
  })

  test('parse text by zh-en', () => {
    const input = readFile('locale.input.md')

    const actual = parseRemark(input, 'zh-en')

    const expected = readFile('locale.output.zh-en.md')

    expect(actual).toBe(expected)
  })

  test('parse text by en-zh', () => {
    const input = readFile('locale.input.md')

    const actual = parseRemark(input, 'en-zh')

    const expected = readFile('locale.output.en-zh.md')

    expect(actual).toBe(expected)
  })

  test('parse text by zh', () => {
    const input = readFile('locale.input.md')

    const actual = parseRemark(input, 'zh')

    const expected = readFile('locale.output.zh.md')

    expect(actual).toBe(expected)
  })

  test('parse text by en', () => {
    const input = readFile('locale.input.md')

    const actual = parseRemark(input, 'en')

    const expected = readFile('locale.output.en.md')

    expect(actual).toBe(expected)
  })
})
