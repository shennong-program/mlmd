import { expect, test } from '@jest/globals'
import { parseRehype } from './helper'

test('parse link 1', () => {
  const input = '[[中医药]]'

  const actual = parseRehype(input)

  const expected =
    '<p><a class="mlmd-link" href="/term/中医药">中医药</a></p>'

  expect(actual).toBe(expected)
})

test('parse link 2', () => {
  const input = '[[中医药|传统中医药]]'

  const actual = parseRehype(input)

  const expected =
    '<p><a class="mlmd-link" href="/term/中医药">传统中医药</a></p>'

  expect(actual).toBe(expected)
})

test('parse link 3', () => {
  const input = '[[天然药材|Natural Medicinal Materials|Natural Medicinal Materialss]]'

  const actual = parseRehype(input)

  const expected =
    '<p><a class="mlmd-link" href="/term/天然药材">Natural Medicinal Materialss</a></p>'

  expect(actual).toBe(expected)
})

test('parse link ids', () => {
  const input = '[[nmm-0001|天然药材]]'

  const actual = parseRehype(input)

  const expected =
    '<p><a class="mlmd-link" href="/term/nmm-0001">天然药材</a></p>'

  expect(actual).toBe(expected)
})
