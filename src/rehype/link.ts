import type { Element, Nodes } from 'hast'
import { findAndReplace } from 'hast-util-find-and-replace'
import { h } from 'hastscript'

export const LINK_CLASSNAME = 'mlmd-link'
const LINK_REGEX = /\[\[([^\]\n]*\|?)+]]/g
const LINK_PART_SEPARATOR = '|'

function buildUrl(text: string) {
  return `/term/${text}`
}

function toLinkNode(url: string, text: string): Element {
  return h('a', { class: LINK_CLASSNAME, href: url }, [text])
}

function replace(_value: string, match: string) {
  const parts = match.split(LINK_PART_SEPARATOR)

  if (parts.length >= 2) {
    const urlPart = parts.shift()!.trim()
    const url = buildUrl(urlPart)
    const textPart = parts.pop()!.trim()

    return toLinkNode(url, textPart)
  } else if (parts.length === 1) {
    const textPart = parts.shift()!.trim()
    const url = buildUrl(textPart)

    return toLinkNode(url, textPart)
  } else {
    return false
  }
}

export function parseLinks(tree: Nodes) {
  findAndReplace(tree, [LINK_REGEX, replace])
}
