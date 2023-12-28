import { BibtexParser, type Entry } from 'bibtex-js-parser'
import type { Element, Nodes, Parents, Text } from 'hast'
import { h } from 'hastscript'
import { visit } from 'unist-util-visit'

export const REF_CITATION_CLASSNAME = 'mlmd-ref-citation'
export const REF_CITATION_REGEX = /{{ref-citation\s*\|\s*bibtex\s*\|([\S\s]+)}}/i

function parseBibtex(bibtex: Entry) {
  const dataList = Object.entries(bibtex)
    .filter(([k, _v]) => k !== 'raw')
    .map(([k, v]) => ([`data-${k}`, v.toString().trim()]))
  const dataMap = Object.fromEntries(dataList)

  return h('span', {
    class: REF_CITATION_CLASSNAME,
    ...dataMap,
  })
}

function parseCitation(node: Element, index: number | undefined, parent: Parents | undefined) {
  if (index === undefined || parent === undefined || node.tagName !== 'p') {
    return
  }

  const innerChildren = node.children
  if (innerChildren.length !== 1) {
    return
  }

  const innerText = innerChildren[0]
  if (innerText.type !== 'text') {
    return
  }

  const text = (innerText as Text).value
  const matched = REF_CITATION_REGEX.exec(text)

  if (matched) {
    const nodes = BibtexParser.parseToJSON(matched[1]).map(parseBibtex)

    parent.children.splice(index, 1, ...nodes)
  }
}

export function parseRefCitations(tree: Nodes) {
  visit(tree, 'element', parseCitation)
}
