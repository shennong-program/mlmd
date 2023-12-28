import { expect, test } from '@jest/globals'
import { parseRemark } from './helper'

test('remove comment', () => {
  const input = '人工智能。<!-- comment -->'

  const actual = parseRemark(input)

  const expected = '人工智能。\n'

  expect(actual).toBe(expected)
})
