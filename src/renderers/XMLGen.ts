export type XMLNodeChild = XMLNode | string | undefined | boolean
export type XMLNodeAttrs = Record<string, any>

export interface XMLNode {
  tag: string
  attrs?: XMLNodeAttrs
  children?: XMLNodeChild[]
}

export class XMLGen {
  static htmlEntities: Record<string, string> = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    '\'': '&#39;',
    '`': '&#96;',
  }

  static encodeHtmlCustom(str: string): string {
    return str.replace(/[<>&"'`]/g, char => this.htmlEntities[char])
  }

  static attrs(attrs?: XMLNodeAttrs): string {
    if (!attrs) {
      return ''
    }
    return ` ${Object.keys(attrs).map((key) => {
      let value = attrs[key]
      if (value === undefined) {
        return undefined
      }
      else if (key === 'style') {
        value = Object.keys(value)
          .map((k) => {
            const v = value[k]
            if (v === '' || v === null || v === undefined) {
              return undefined
            }
            return `${k}: ${v};`
          })
          .filter(Boolean)
          .join(' ')
      }
      return `${key}="${value}"`
    }).filter(Boolean).join(' ')}`
  }

  static children(children?: XMLNodeChild[]): string {
    return children
      ?.filter(Boolean)
      .map((child: any) => {
        if (typeof child === 'string') {
          return this.encodeHtmlCustom(child)
        }
        else {
          return this.node(child)
        }
      })
      .join('')
      ?? ''
  }

  static node(node: XMLNode): string {
    return `<${node.tag}${this.attrs(node.attrs)}>${this.children(node.children)}</${node.tag}>`
  }
}
