import type { Element, Nodes } from 'hast'
import { findAndReplace } from 'hast-util-find-and-replace'
import { h } from 'hastscript'

export const REF_CLASSNAME = 'mlmd-ref-link'
const REF_REGEX = /{{ref\s*\|([^}]+)}}/i
const REF_LINK_ID_REGEX = /\[\[\s*([^|]+)\s*]]/i
const REF_LINKS_SEPARATOR = /\|(?=(?:(?:[^"]*"){2})*[^"]*$)/
const REF_PARAM_REGEX = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/
const REF_URI_TOKEN = '?'
const REF_ID_TOKEN = ','
const REF_KV_SEPARATOR = '='
const REF_LINK_PREFIX = '[['
const REF_ANCHOR_PREFIX = '@'

function splitIdParam(str: string) {
  const [id, ...rest] = str.split(REF_ID_TOKEN)
  return [id, rest.join(REF_ID_TOKEN)]
}

function splitKv(str: string) {
  const [id, ...rest] = str.split(REF_KV_SEPARATOR)
  return [id, rest.join(REF_KV_SEPARATOR)]
}

function trimRoundQuotes(str: string) {
  if (str.startsWith('"') && str.endsWith('"')) {
    return str.substring(1, str.length - 1)
  } else {
    return str
  }
}

function removeEscapeQuotes(str: string) {
  return str.replace(/"{2}/g, '"')
}

function removeQuotes(str: string) {
  return removeEscapeQuotes(trimRoundQuotes(str))
}

function encodeParams(params: Record<string, string>) {
  const encodePairs = Object.entries(params)
    .map(([k, v]) => [encodeURIComponent(k), encodeURIComponent(v)])
  return new URLSearchParams(encodePairs).toString()
}

function decodeParams(str: string): Record<string, string> {
  const params = new URLSearchParams(str)
  const pairs = Array.from(params.entries())
    .map(([k, v]) => [decodeURIComponent(k), decodeURIComponent(v)])
  return Object.fromEntries(pairs)
}

export function parseFromUri(uri: string) {
  const [id, ...rest] = uri.split(REF_URI_TOKEN)
  const paramStr = rest.join(REF_URI_TOKEN)
  return [decodeURIComponent(id), decodeParams(paramStr)]
}

function parseToUri(id: string, paramStr: string) {
  const params = paramStr.split(REF_PARAM_REGEX).map((x) => x.trim())
    .filter((x) => x.length > 0)
    .map((x) => splitKv(x))
    .map(([k, v]) => [k.trim(), removeQuotes(v.trim())])
    .filter(([k, v]) => k.length > 0 && v.length > 0)

  const encoded = encodeParams(Object.fromEntries(params))

  if (encoded) {
    return `${id}${REF_URI_TOKEN}${encoded}`
  } else {
    return id
  }
}

function parseRefLinkId(value: string) {
  return REF_LINK_ID_REGEX.exec(value.trim())?.at(1)?.trim().toLowerCase()
}

function parseRefLink(value: string) {
  const [idPart, paramPart] = splitIdParam(value)
  const id = parseRefLinkId(idPart)

  if (id?.length) {
    const uri = parseToUri(id, paramPart)
    return ['ref-link', uri]
  }
}

function parseRefAnchor(value: string) {
  const [idPart, paramPart] = splitIdParam(value)
  const id = idPart.trim().slice(REF_ANCHOR_PREFIX.length)

  if (id.length > 0) {
    const uri = parseToUri(id, paramPart)
    return ['ref-anchor', uri]
  }
}

function replace(_value: string, match: string): Element | false {
  const refLinks = match.split(REF_LINKS_SEPARATOR)
    .map((x) => x.trim())
    .filter((x) => x.length > 0)
    .map((x) => {
      if (x.startsWith(REF_LINK_PREFIX)) {
        return parseRefLink(x)
      } else if (x.startsWith(REF_ANCHOR_PREFIX)) {
        return parseRefAnchor(x)
      }
    })
    .filter((x) => x !== undefined) as string[][]

  if (refLinks.length > 0) {
    const dataMap = Object.fromEntries(refLinks.map(([type, uri], i) => (
      [`data-${type}-${i}`, uri]
    )))

    return h('span', {
      class: REF_CLASSNAME,
      ...dataMap,
    })
  } else {
    return false
  }
}

export function parseRefLinks(tree: Nodes) {
  findAndReplace(tree, [REF_REGEX, replace])
}
