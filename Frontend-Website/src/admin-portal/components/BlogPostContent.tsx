import { createElement, type ReactNode } from 'react'
import { safeBlogUrl } from '../lib/blogRecords'

const allowed = new Set(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'strong', 'b', 'em', 'i', 'u', 's', 'blockquote', 'br', 'hr', 'a', 'pre', 'code', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'img'])
const blocked = new Set(['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'textarea', 'select', 'meta', 'link', 'base', 'svg', 'math', 'template', 'noscript', 'video', 'audio'])

// Rebuild an allowlisted React tree: raw HTML and event/style attributes never
// enter the page. The saved source is retained unchanged for editing.
export default function BlogPostContent({ html }: { html?: string }) {
  const document = new DOMParser().parseFromString(html || '', 'text/html')
  function render(node: ChildNode, key: string, depth = 0): ReactNode {
    if (node.nodeType === 3) return node.textContent
    if (node.nodeType !== 1) return null
    const element = node as Element
    const tag = element.tagName.toLowerCase()
    if (blocked.has(tag)) return null
    if (depth > 40) return element.textContent
    const children = [...element.childNodes].map((child, index) => render(child, key + '-' + index, depth + 1))
    if (!allowed.has(tag)) return children
    if (tag === 'img') {
      const src = safeBlogUrl(element.getAttribute('src'), true)
      return src ? createElement('img', { key, src, alt: element.getAttribute('alt') || '', loading: 'lazy', referrerPolicy: 'no-referrer' }) : null
    }
    const props: Record<string, unknown> = { key }
    if (tag === 'a') {
      props.href = safeBlogUrl(element.getAttribute('href'))
      props.target = '_blank'
      props.rel = 'noopener noreferrer'
    }
    return createElement(tag, props, ...(tag === 'br' || tag === 'hr' ? [] : children))
  }
  return <div className="blog-article-content">{[...document.body.childNodes].map((node, index) => render(node, String(index)))}</div>
}
