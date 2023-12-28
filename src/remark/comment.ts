import type { Html, Node, Parent } from 'mdast'
import { SKIP, visit } from 'unist-util-visit'

const HTML_COMMENT_REGEX = /<!--([\s\S]*?)-->/g

export function removeComments(tree: Node) {
  visit(tree, 'html', (node: Html, index: number, parent: Parent) => {
    const isComment = node.value.match(HTML_COMMENT_REGEX)

    if (isComment) {
      parent.children.splice(index, 1)
      // Do not traverse `node`, continue at the node *now* at `index`.
      return [SKIP, index]
    }
  })
}
