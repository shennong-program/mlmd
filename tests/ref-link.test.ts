import { test } from '@jest/globals'
import { parseRehype } from './helper'

describe('Parse reference link', () => {
  test('parse reference link', () => {
    const input = '{{ref |[[sna-ref-1]]}}'

    const actual = parseRehype(input)

    const expected =
      '<p><span class="mlmd-ref-link" data-ref-link-0="sna-ref-1"></span></p>'

    expect(actual).toBe(expected)
  })

  test('parse reference link 2', () => {
    const input = '{{ref|\n[[SNA-Ref-1]]}}'

    const actual = parseRehype(input)

    const expected =
      '<p><span class="mlmd-ref-link" data-ref-link-0="sna-ref-1"></span></p>'

    expect(actual).toBe(expected)
  })

  test('parse reference link with params', () => {
    const input = '{{ref|[[sna-ref-2]], p1="1,2", p2="3|4", p3="5=6", p4="7""8", p5=9?}}'

    const actual = parseRehype(input)

    const expected =
      '<p><span class="mlmd-ref-link" data-ref-link-0="sna-ref-2?' +
      'p1=1%252C2&#x26;p2=3%257C4&#x26;p3=5%253D6&#x26;p4=7%25228&#x26;p5=9%253F' +
      '"></span></p>'

    expect(actual).toBe(expected)
  })

  test('parse multiple reference links with params', () => {
    const input = '{{ref|[[sna-ref-3]],volumes=4,pages=52|[[sna-ref-8]],pages=42-45}}'

    const actual = parseRehype(input)

    const expected =
      '<p><span class="mlmd-ref-link" data-ref-link-0="sna-ref-3?volumes=4&#x26;pages=52" ' +
      'data-ref-link-1="sna-ref-8?pages=42-45"></span></p>'

    expect(actual).toBe(expected)
  })
})

describe('Parse reference anchor', () => {
  test('parse reference anchor', () => {
    const input = '{{ref |@ai_masterbrain}}'

    const actual = parseRehype(input)

    const expected =
      '<p><span class="mlmd-ref-link" data-ref-anchor-0="ai_masterbrain"></span></p>'

    expect(actual).toBe(expected)
  })

  test('parse reference anchor with params', () => {
    const input = '{{ref| @ai_masterbrain, p1="1,2", p2="3|4", p3="5=6", p4="7""8", p5=9?}}'

    const actual = parseRehype(input)

    const expected =
      '<p><span class="mlmd-ref-link" data-ref-anchor-0="ai_masterbrain?' +
      'p1=1%252C2&#x26;p2=3%257C4&#x26;p3=5%253D6&#x26;p4=7%25228&#x26;p5=9%253F' +
      '"></span></p>'

    expect(actual).toBe(expected)
  })

  test('parse reference multiple anchors with params', () => {
    const input = `
{{ref|@ai_masterbrain,volumes=4,pages=52|
@ai_synapse,pages=42-45}}`

    const actual = parseRehype(input)

    const expected =
      '<p><span class="mlmd-ref-link" data-ref-anchor-0="ai_masterbrain?volumes=4&#x26;pages=52" ' +
      'data-ref-anchor-1="ai_synapse?pages=42-45"></span></p>'

    expect(actual).toBe(expected)
  })
})

describe('Parse reference link and anchor', () => {
  test('parse reference link and anchor', () => {
    const input = '{{ref| [[sna-ref-1]] |@ai_masterbrain}}'

    const actual = parseRehype(input)

    const expected =
      '<p><span class="mlmd-ref-link" data-ref-link-0="sna-ref-1" data-ref-anchor-1="ai_masterbrain"></span></p>'

    expect(actual).toBe(expected)
  })

  test('parse reference multiple anchors with params', () => {
    const input = '{{ref|[[sna-ref-2]],volumes=4,pages=52|@ai_masterbrain,pages=42-45}}'

    const actual = parseRehype(input)

    const expected =
      '<p><span class="mlmd-ref-link" data-ref-link-0="sna-ref-2?volumes=4&#x26;pages=52" ' +
      'data-ref-anchor-1="ai_masterbrain?pages=42-45"></span></p>'

    expect(actual).toBe(expected)
  })
})
