import { test } from '@jest/globals'
import { parseRehype } from './helper'

test('parse zh-pinyin-la-en pair names', () => {
  const input = '{{name |\n' +
    '| zh | 青蒿\n' +
    '| pinyin | qīnghāo\n' +
    '| la | Artemisiae Annuae Herba\n' +
    '| en | Sweet Wormwood Herb\n' +
    '}}'

  const actual = parseRehype(input)

  expect(actual.match(/青蒿/g)?.length).toBe(1)
  expect(actual.match(/qīnghāo/g)?.length).toBe(1)
  expect(actual.match(/Artemisiae Annuae Herba/g)?.length).toBe(1)
  expect(actual.match(/Sweet Wormwood Herb/g)?.length).toBe(1)
  expect(actual.match(/mlmd-name-item/g)?.length).toBe(4)
})
