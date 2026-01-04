import * as fs from 'node:fs'
import * as path from 'node:path'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkStringify from 'remark-stringify'
import { unified } from 'unified'
import rehypeMlmd from '../src/rehype'
import remarkMlmd from '../src/remark'

const base = path.join('tests', 'fixtures')

export function readFile(filename: string) {
  return String(fs.readFileSync(path.join(base, filename)))
}

export function parseRemark(markdown: string, locale?: string) {
  return unified()
    .use(remarkParse)
    .use(remarkMlmd, { locale })
    .use(remarkStringify, { bullet: '-' })
    .processSync(markdown)
    .toString()
}

export function parseRehype(markdown: string) {
  return unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeMlmd)
    .use(rehypeStringify)
    .processSync(markdown)
    .toString()
}
