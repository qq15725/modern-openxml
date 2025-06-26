export type XmlNodeChild = XmlNode | string | undefined | boolean
export type XmlNodeAttrs = Record<string, any>

export interface XmlNode {
  tag: string
  attrs?: XmlNodeAttrs
  children?: XmlNodeChild[]
}

export class XmlRenderer {
  htmlEntities: Record<string, string> = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    '\'': '&#39;',
    '`': '&#96;',
  }

  encodeHtmlCustom(str: string): string {
    return str.replace(/[<>&"'`]/g, char => this.htmlEntities[char])
  }

  renderAttrs(attrs?: XmlNodeAttrs): string {
    if (!attrs) {
      return ''
    }
    return ` ${Object.keys(attrs).map((key) => {
      let value = attrs[key]
      if (value === '' || value === null || value === undefined) {
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

  renderChildren(children?: XmlNodeChild[]): string {
    return children
      ?.filter(Boolean)
      .map((child: any) => {
        if (typeof child === 'string') {
          return this.encodeHtmlCustom(child)
        }
        else {
          return this.render(child)
        }
      })
      .join('')
      ?? ''
  }

  render(node: XmlNode): string {
    return `<${node.tag}${this.renderAttrs(node.attrs)}>${this.renderChildren(node.children)}</${node.tag}>`
  }
}
