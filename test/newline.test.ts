import { expect, test } from '@jest/globals'
import { parseRemark } from './helper'

test('parse newline to break', () => {
  const input = '人工智能。\n现代化。'

  const actual = parseRemark(input)

  const expected = '人工智能。\\\n现代化。\n'

  expect(actual).toBe(expected)
})
