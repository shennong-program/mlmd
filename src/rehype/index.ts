import type { Root } from 'hast'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema, type Options } from 'rehype-sanitize'
import { VFile } from 'vfile'
import { LINK_CLASSNAME, parseLinks } from './link'
import { NAME_CLASSNAME, NAME_ITEM_CLASSNAME, parseNames } from './name'
import { parseRefCitations, REF_CITATION_CLASSNAME } from './ref-citation'
import { parseRefLinks, REF_CLASSNAME } from './ref-link'

const aria = ['ariaDescribedBy', 'ariaLabel', 'ariaLabelledBy']

const sanitizeSchema: Options = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames as string[]),
    'svg', 'g', 'path', 'rect', 'circle', 'line',
  ],
  attributes: {
    ...defaultSchema.attributes,
    'a': [
      ...aria,
      // Note: these 3 are used by GFM footnotes, they do work on all links.
      'dataFootnoteBackref',
      'dataFootnoteRef',
      ['className', 'data-footnote-backref', LINK_CLASSNAME],
      'href',
    ],
    'div': [
      'itemScope',
      'itemType',
      ['className', NAME_CLASSNAME, NAME_ITEM_CLASSNAME],
    ],
    'span': [
      ['className', REF_CLASSNAME, REF_CITATION_CLASSNAME],
      'data*',
    ],
    'svg': ['xmlns', 'width', 'height', 'viewBox', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'aria-hidden', 'focusable', 'role', 'xmlns:xlink', 'xlink:href', 'data*'],
    'g': ['fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'aria-hidden', 'focusable', 'role', 'data*'],
    'path': ['d', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'aria-hidden', 'focusable', 'role', 'data*'],
    'rect': ['x', 'y', 'width', 'height', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'aria-hidden', 'focusable', 'role', 'data*'],
    'circle': ['cx', 'cy', 'r', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'aria-hidden', 'focusable', 'role', 'data*'],
    'line': ['x1', 'y1', 'x2', 'y2', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'aria-hidden', 'focusable', 'role', 'data*'],
  },
}

export default function rehypeMlmd() {
  return (tree: Root, file: VFile) => {
    parseNames(tree)
    parseRefCitations(tree)
    parseRefLinks(tree)
    parseLinks(tree)

    tree = rehypeRaw()(tree, file)
    tree = rehypeSanitize(sanitizeSchema)(tree)

    return tree
  }
}
