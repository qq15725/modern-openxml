import type { OOXMLValueType } from './ooxml-value'
import { namespaces } from '../namespaces'
import { OOXMLValue } from './ooxml-value'

export type OOXMLQueryType = 'node' | 'nodes' | OOXMLValueType

const fixtures = {
  '&sbquo;': '‚',
  '&bdquo;': '„',
  '&hellip;': '…',
  '&permil;': '‰',
  '&circ;': 'ˆ',
  '&cent;': '￠',
  '&pound;': '£',
  '&yen;': '¥',
  '&euro;': '€',
  '&sect;': '§',
  '&copy;': '©',
  '&reg;': '®',
  '&trade;': '™',
  '&times;': '×',
  '&divide;': '÷',
  '&fnof;': 'ƒ',
}

export class OOXMLNode {
  doc: Document
  resolver: XPathNSResolver = prefix => (prefix ? this.namespaces[prefix] || null : null)

  get name(): string {
    return this.dom.nodeName
  }

  constructor(
    public dom: Node,
    public namespaces: Record<string, any>,
  ) {
    this.doc = dom.ownerDocument!

    this.find = this.find.bind(this)
    this.get = this.get.bind(this)
    this.attr = this.attr.bind(this)
    this.query = this.query.bind(this)
  }

  static fromXML(xml = '', userNamespaces: Record<string, any> = namespaces): OOXMLNode {
    xml = xml.replace(/xmlns=".*?"/g, '')
    for (const key in fixtures) {
      xml = xml.replace(new RegExp(key, 'gi'), (fixtures as any)[key] as string)
    }
    const doc = new DOMParser().parseFromString(xml, 'text/xml')
    const namespaces: Record<string, string> = {}
    for (const [, key, value] of xml.matchAll(/xmlns:(\w)="(.+?)"/g)) {
      namespaces[key] = value
    }
    return new OOXMLNode(
      doc.documentElement,
      { ...namespaces, ...userNamespaces },
    )
  }

  getDOM<T = Node>(): T {
    return this.dom as T
  }

  evaluate(xpath: string, type: number = XPathResult.ANY_TYPE): XPathResult {
    return this.doc.evaluate(
      xpath,
      this.dom,
      this.resolver,
      type,
      null,
    )
  }

  query(xpath: string, type: OOXMLQueryType = 'node'): any {
    switch (type) {
      case 'node': {
        const result = this.evaluate(xpath, XPathResult.FIRST_ORDERED_NODE_TYPE).singleNodeValue
        return result ? new OOXMLNode(result, this.namespaces) : undefined
      }
      case 'nodes': {
        const result = this.evaluate(xpath, XPathResult.ORDERED_NODE_ITERATOR_TYPE)
        const value = []
        let node
        // eslint-disable-next-line no-cond-assign
        while ((node = result.iterateNext())) {
          value.push(new OOXMLNode(node, this.namespaces))
        }
        return value
      }
      default: {
        return OOXMLValue.decode(
          this.evaluate(xpath, XPathResult.STRING_TYPE).stringValue || undefined,
          type as OOXMLValueType,
        )
      }
    }
  }

  get(xpath: string): OOXMLNode[] {
    return this.query(xpath, 'nodes')
  }

  find(xpath: string): OOXMLNode | undefined {
    return this.query(xpath, 'node')
  }

  attr<T = string>(xpath: string, type: OOXMLValueType = 'string'): T | undefined {
    return this.query(xpath, type)
  }
}
