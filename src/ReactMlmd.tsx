import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeMlmd from './rehype'
import remarkMlmd from './remark'
import type { Locale } from './remark/locale'

export type Options = {
  locale: Locale
  children: string
}

export default function ReactMlmd({ locale, children }: Options) {
  return (
    <ReactMarkdown
      remarkPlugins={[[remarkMlmd, { locale }]]}
      rehypePlugins={[rehypeMlmd]}
    >
      {children}
    </ReactMarkdown>
  )
}
