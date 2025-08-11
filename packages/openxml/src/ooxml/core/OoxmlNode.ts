import type { OoxmlValueType } from './OoxmlValue'
import { parseDomFromString } from '../../global'
import { namespaces } from '../namespaces'
import { OoxmlValue } from './OoxmlValue'

export type OOXMLQueryType = 'node' | 'nodes' | OoxmlValueType

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

export class OoxmlNode {
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

  static fromXML(
    xml = '',
    userNamespaces: Record<string, any> = namespaces,
  ): OoxmlNode {
    xml = xml.replace(/xmlns=".*?"/g, '')
    for (const key in fixtures) {
      xml = xml.replace(new RegExp(key, 'gi'), (fixtures as any)[key] as string)
    }
    const doc = parseDomFromString(xml, 'text/xml')
    const namespaces: Record<string, string> = {}
    for (const [, key, value] of xml.matchAll(/xmlns:(\w)="(.+?)"/g)) {
      namespaces[key] = value
    }
    return new OoxmlNode(
      doc.documentElement,
      { ...namespaces, ...userNamespaces },
    )
  }

  getDOM<T = Node>(): T {
    return this.dom as T
  }

  evaluate(
    xpath: string,
    type: number = 0, // XPathResult.ANY_TYPE
  ): XPathResult {
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
        const result = this.evaluate(
          xpath,
          9, // XPathResult.FIRST_ORDERED_NODE_TYPE
        ).singleNodeValue
        return result ? new OoxmlNode(result, this.namespaces) : undefined
      }
      case 'nodes': {
        const result = this.evaluate(
          xpath,
          5, // XPathResult.ORDERED_NODE_ITERATOR_TYPE
        )
        const value = []
        let node
        // eslint-disable-next-line no-cond-assign
        while ((node = result.iterateNext())) {
          value.push(new OoxmlNode(node, this.namespaces))
        }
        return value
      }
      default: {
        let value
        if (xpath[0] === '@' && 'getAttribute' in this.dom) {
          value = (this.dom as Element).getAttribute(xpath.substring(1))
        }
        else {
          value = this.evaluate(
            xpath,
            2, // XPathResult.STRING_TYPE
          ).stringValue
        }
        return OoxmlValue.decode(value || undefined, type as OoxmlValueType)
      }
    }
  }

  get(xpath: string): OoxmlNode[] {
    return this.query(xpath, 'nodes')
  }

  find(xpath: string): OoxmlNode | undefined {
    return this.query(xpath, 'node')
  }

  attr<T = string>(xpath: string, type: OoxmlValueType = 'string'): T | undefined {
    return this.query(xpath, type)
  }
}
