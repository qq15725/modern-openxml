export function defineChild(tag: string, Klass: new () => XmlObject, isArray = false) {
  return function (proto: any, name: any) {
    Object.defineProperty(proto, name, {
      get() {
        if (isArray) {
          return (this as XmlObject).getChildren(tag).map(node => new Klass().parse(node))
        }
        else {
          const node = (this as XmlObject).getChild(tag)
          if (node) {
            return new Klass().parse(node)
          }
          return undefined
        }
      },
    })
  }
}

export function defineProperty(tag: string, type: any) {
  return function (proto: any, name: any) {
    Object.defineProperty(proto, name, {
      get() {
        return (this as XmlObject).getAttr(tag, type)
      },
    })
  }
}

export abstract class XmlObject {
  readonly namespace?: string
  abstract readonly tag: string
  declare node: HTMLElement
  properties: Record<string, any> = {}

  getAttr(name: string): HTMLElement | undefined {
    return this.node.getAttribute(name)
  }

  getChild(name: string): HTMLElement | undefined {
    return Array.from(this.node.childNodes).find(node => node.nodeName === name)
  }

  getChildren(name: string): HTMLElement[] {
    return Array.from(this.node.childNodes).filter(node => node.nodeName === name)
  }

  setProperties(properties: Record<string, any>): this {
    for (const key in properties) {
      this.properties[key] = properties[key]
    }
    return this
  }

  parse(source: string | HTMLElement): this {
    if (typeof source === 'string') {
      const doc = new DOMParser().parseFromString(source, 'text/xml') as XMLDocument
      const error = doc.querySelector('parsererror')
      if (error) {
        throw new Error(error.textContent ?? 'parser error')
      }
      this.node = doc.documentElement
    }
    else {
      this.node = source
    }
    return this
  }

  toXmlString(): string {
    // TODO
    return ''
  }
}
