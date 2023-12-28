import type { Root } from 'mdast'
import { removeComments } from './comment'
import { type Locale, parseLocale } from './locale'
import { newlineToBreak } from './newline'

export type Options = {
  locale?: Locale
}

export default function remarkMlmd(options?: Options) {
  return (tree: Root) => {
    removeComments(tree)
    newlineToBreak(tree)
    parseLocale(tree, options?.locale)

    return tree
  }
}
