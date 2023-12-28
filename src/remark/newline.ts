import { Break, Nodes } from 'mdast'
import { findAndReplace, RegExpMatchObject } from 'mdast-util-find-and-replace'
import { NAME_REGEX } from '../rehype/name'
import { REF_CITATION_REGEX } from '../rehype/ref-citation'

const NEWLINE_REGEX = /\r?\n|\r/g

function isTemplete(value: string) {
  return NAME_REGEX.test(value) || REF_CITATION_REGEX.test(value)
}

function replace(_value: string, matchObject: RegExpMatchObject): Break | false {
  if (isTemplete(matchObject.input)) {
    return false
  }

  return { type: 'break' }
}

// Turn normal line endings into hard breaks
export function newlineToBreak(tree: Nodes) {
  findAndReplace(tree, [NEWLINE_REGEX, replace])
}
