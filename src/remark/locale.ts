import type { PhrasingContent, Root } from 'mdast'
import { Break } from 'mdast'
import { visit } from 'unist-util-visit'

export type Locale = string
export type Lang = 'zh' | 'en' | 'la'

const LANGS_REGEX = /^{{langs\s*\|([a-z\s*|]+)+}}$/i
const LANG_PART_SEPARATOR = '|'
const HEAD_PART_SEPARATOR = '|'

function localeToLangs(locale: Locale | undefined) {
  if (!locale) {
    return []
  } else {
    return locale.split('-').map((v) => v.trim().toLowerCase() as Lang)
  }
}

function parseLangs(tree: Root) {
  if (!tree.children.length) {
    return []
  }

  const node = tree.children[0]

  if (node.type === 'paragraph' && node.children.length > 0) {
    const langsNode = node.children[0]

    if (langsNode.type === 'text' && langsNode.value) {
      const matches = langsNode.value.match(LANGS_REGEX)
      if (matches && matches.length > 1) {
        const langs = matches[1].split(LANG_PART_SEPARATOR)
          .map(v => v.trim().toLowerCase())

        if (langs.length >= 1) {
          // If lang node matches, remove it
          tree.children.shift()

          return langs as Lang[]
        }
      }
    }
  }

  return []
}

type HeadingLangValues = {
  [K in Lang]?: string
}

function getHeadingValue(values: string[], currentLangs: Lang[], targetLangs: Lang[]) {
  if (values.length <= 1) {
    return values[0] ?? ''
  }

  const hLangValues: HeadingLangValues = {}
  for (let i = 0; i < currentLangs.length; i++) {
    hLangValues[currentLangs[i]] = values[i]
  }

  const langs = targetLangs.length === 0 ? currentLangs : targetLangs

  return langs.map((lang) => hLangValues[lang])
    .filter((v) => v !== undefined)
    .join(' ')
}

function replaceHeadingByLocale(tree: Root, currentLangs: Lang[], targetLangs: Lang[]) {
  visit(tree, 'heading', (node) => {
    if (node.children.length > 0) {
      const first = node.children[0]
      if (first.type === 'text' && first.value) {
        const values = first.value.split(HEAD_PART_SEPARATOR).map((v) => v.trim())
        first.value = getHeadingValue(values, currentLangs, targetLangs)
      }
    }
  })
}

type ParagraphLangValues = {
  [K in Lang]?: PhrasingContent[]
}

function splitByBreak(nodes: PhrasingContent[]) {
  const initValue: {
    all: PhrasingContent[][]
    children: PhrasingContent[]
  } = { all: [], children: [] }

  const result = nodes.reduce((acc, n) => {
    if (n.type === 'break') {
      acc.all.push(acc.children)
      acc.children = []
    } else {
      acc.children.push(n)
    }
    return acc
  }, initValue)

  const values = result.all
  if (result.children.length > 0) {
    values.push(result.children)
  }

  return values
}

function getParagraphChildren(values: PhrasingContent[][], currentLangs: Lang[], targetLangs: Lang[]) {
  if (values.length <= 1) {
    return values[0] ?? []
  }

  const pLangValues: ParagraphLangValues = {}
  for (let i = 0; i < currentLangs.length; i++) {
    pLangValues[currentLangs[i]] = values[i]
  }

  const breakNode: Break = { type: 'break' }

  const children = targetLangs.map((lang) => pLangValues[lang])
    .filter((v) => v !== undefined)
    .flatMap((v) => ([...(v as PhrasingContent[]), breakNode]))

  children.pop()

  return children
}

function replaceParagraphByLocale(tree: Root, currentLangs: Lang[], targetLangs: Lang[]) {
  if (targetLangs.length === 0) {
    return
  }

  visit(tree, 'paragraph', (node) => {
    if (node.children.length > 0) {
      const values = splitByBreak(node.children)
      node.children = getParagraphChildren(values, currentLangs, targetLangs)
    }
  })
}

export function parseLocale(tree: Root, locale: Locale | undefined) {
  const targetLangs = localeToLangs(locale)
  const currentLangs = parseLangs(tree)

  if (currentLangs.length > 0) {
    replaceHeadingByLocale(tree, currentLangs, targetLangs)
    replaceParagraphByLocale(tree, currentLangs, targetLangs)
  }
}
