export type OXMLProto = new (...args: any[]) => OXML

export interface OXMLPropertyDefinition {
  key: string
  type: string
  defaultValue?: any
}

export interface OXMLAttrDefinition {
  name: string
  type: string
  defaultValue?: any
}

export interface OXMLChildDefinition {
  tag: string
  isArray: boolean
  defaultValue?: any
}

export interface OXMLDefinition {
  tag?: string
  namespace?: string
  attrs?: OXMLAttrDefinition[]
  properties?: OXMLPropertyDefinition[]
  children?: OXMLChildDefinition[]
}

export function defineElement(tag: string, namespace?: string) {
  return (constructor: any) => {
    const proto = constructor.prototype
    let definition = OXML.protoToDefinition.get(proto)
    if (!definition) {
      definition = {} as OXMLDefinition
      OXML.protoToDefinition.set(proto, definition)
    }
    definition.tag = tag
    definition.namespace = namespace
    OXML.tagToConstructor.set([namespace, tag].filter(Boolean).join(':'), constructor)
    Object.defineProperty(proto, 'tag', {
      value: tag,
      configurable: true,
      enumerable: true,
    })
  }
}

export function defineProperty(attrName: string, type: string, defaultValue?: any) {
  return function (proto: any, name: any) {
    let definition = OXML.protoToDefinition.get(proto)
    if (!definition) {
      definition = {} as OXMLDefinition
      OXML.protoToDefinition.set(proto, definition)
    }
    definition.attrs ??= []
    definition.attrs.push({ name: attrName, type, defaultValue })
    Object.defineProperty(proto, name, {
      get() {
        return (this as OXML).getProperty(attrName)
      },
    })
  }
}

export function defineChild(tag: string, defaultValue?: any, isArray = false) {
  return function (proto: any, name: any) {
    let definition = OXML.protoToDefinition.get(proto)
    if (!definition) {
      definition = {} as OXMLDefinition
      OXML.protoToDefinition.set(proto, definition)
    }
    definition.children ??= []
    definition.children.push({ tag, defaultValue, isArray })
    Object.defineProperty(proto, name, {
      get() {
        if (isArray) {
          return (this as OXML).getChildren(tag) ?? defaultValue
        }
        else {
          return (this as OXML).getChild(tag) ?? defaultValue
        }
      },
    })
  }
}

export function defineChildren(tag: string, defaultValue?: any) {
  return defineChild(tag, defaultValue, true)
}

export class OXML {
  static tagToConstructor = new Map<string, OXMLProto>()
  static protoToDefinition = new WeakMap<OXMLProto, OXMLDefinition>()

  static findConstructor(tag: string): OXMLProto | undefined {
    return this.tagToConstructor.get(tag)
  }

  static findDefinition(tag: string): OXMLDefinition | undefined {
    const proto = this.findConstructor(tag)?.prototype
    return proto ? this.protoToDefinition.get(proto) : undefined
  }

  declare tag?: string
  declare element: Element

  definition(): OXMLDefinition | undefined {
    return OXML.protoToDefinition.get(this.constructor.prototype as any)
  }

  getProperty(name: string): any | undefined {
    return this.element.getAttribute(name)
  }

  getProperties(): Record<string, any> {
    return Object.fromEntries(
      this.element.getAttributeNames().map((name) => {
        return [name, this.element.getAttribute(name)]
      }),
    )
  }

  getChild(tag: string): OXML | undefined {
    const element = Array.from(this.element.children).find((element) => {
      return element.tagName === tag || element.localName === tag
    })
    if (element) {
      return new (OXML.findConstructor(element.tagName) ?? OXML)().fromElement(element)
    }
    return undefined
  }

  getChildren(tag?: string): OXML[] {
    return Array.from(this.element.children)
      .map((element) => {
        if (!tag || (element.tagName === tag || element.localName === tag)) {
          return new (OXML.findConstructor(element.tagName) ?? OXML)().fromElement(element)
        }
        return undefined
      })
      .filter(Boolean) as OXML[]
  }

  fromXML(xml: string): this {
    const doc = new DOMParser().parseFromString(xml, 'text/xml') as XMLDocument
    const error = doc.querySelector('parsererror')
    if (error) {
      throw new Error(error.textContent ?? 'parser error')
    }
    this.element = doc.documentElement
    return this
  }

  fromElement(element: Element): this {
    this.element = element
    return this
  }

  fromJSON(props: Record<string, any>): this {
    // document.createElement('')
    return this
  }

  toXML(): string {
    return this.element.outerHTML
  }

  toJSON(): Record<string, any> {
    return {
      ...this.getProperties(),
      ...Object.fromEntries(this.getChildren().map((child) => {
        const tag = child.tag ?? child.element.tagName
        const tagArr = tag.split(':')
        return [tagArr[tagArr.length - 1], child.toJSON()]
      })),
    }
  }
}
