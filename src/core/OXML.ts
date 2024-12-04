export type OXMLProto = new (...args: any[]) => OXML

export interface OXMLAttributeDefinition {
  type: string
  defaultValue?: any
}

export interface OXMLPropertyDefinition {
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
  attributes?: Map<string, OXMLAttributeDefinition>
  properties?: Map<string, OXMLPropertyDefinition>
  children?: OXMLChildDefinition[]
}

export function defineElement(tag: string) {
  return (constructor: any) => {
    const proto = constructor.prototype
    let definition = OXML.protoToDefinition.get(proto)
    if (!definition) {
      definition = {} as OXMLDefinition
      OXML.protoToDefinition.set(proto, definition)
    }
    const tagArr = tag.split(':')
    definition.tag = tag
    definition.namespace = tagArr.length > 1 ? tagArr[0] : undefined
    OXML.tagToConstructor.set(tag, constructor)
    Object.defineProperty(proto, 'tag', {
      value: tag,
      configurable: true,
      enumerable: true,
    })
  }
}

export function defineAttribute(
  attrName: string,
  type: string | Record<string, any> = 'string',
  defaultValue?: any,
) {
  return function (proto: any, name: any) {
    let definition = OXML.protoToDefinition.get(proto)
    if (!definition) {
      definition = {} as OXMLDefinition
      OXML.protoToDefinition.set(proto, definition)
    }
    definition.attributes ??= new Map()
    definition.attributes.set(attrName, { type, defaultValue })
    Object.defineProperty(proto, name, {
      get() {
        return (this as OXML).getAttribute(attrName)
      },
      configurable: true,
      enumerable: true,
    })
  }
}

export function defineProperty(propName: string) {
  return function (proto: any, name: any) {
    let definition = OXML.protoToDefinition.get(proto)
    if (!definition) {
      definition = {} as OXMLDefinition
      OXML.protoToDefinition.set(proto, definition)
    }
    definition.properties ??= new Map()
    definition.properties.set(propName, {})
    Object.defineProperty(proto, name, {
      get() {
        return (this as OXML).getAttribute(propName)
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
      configurable: true,
      enumerable: true,
    })
  }
}

export function defineChildren(tag: string, defaultValue?: any) {
  return defineChild(tag, defaultValue, true)
}

export class OXML {
  static DPI = 72
  static tagToConstructor = new Map<string, OXMLProto>()
  static protoToDefinition = new WeakMap<OXMLProto, OXMLDefinition>()

  static getConstructor(tag: string): OXMLProto | undefined {
    return this.tagToConstructor.get(tag)
  }

  static getDefinition(tag: string): OXMLDefinition | undefined {
    const proto = this.getConstructor(tag)?.prototype
    return proto ? this.protoToDefinition.get(proto) : undefined
  }

  declare tag?: string
  declare element: Element

  definition(): OXMLDefinition | undefined {
    return OXML.protoToDefinition.get(this.constructor.prototype as any)
  }

  getSetterValue(type: string, value: any): any {
    switch (type) {
      case 'boolean':
        return value ? '1' : '0'
      case 'degree':
        return String(Number(value) * 60000)
      case 'fontSize':
        return String(Number(value) * 100)
      case 'number':
        return String(value)
      case 'string':
        return String(value)
      case 'emu':
        return String((Number(value) / OXML.DPI) * 914400)
      case 'dxa':
        return String((Number(value) / OXML.DPI) * 1440)
      case 'percentage':
        return String(Number(value) * 1000)
      case 'rate':
        return String(Number(value) * 100000)
      case 'lineHeight':
        return String((value * 100000) / 1.2018 - 0.0034)
      default:
        throw new Error(`type not found: ${type}`)
    }
  }

  getGetterValue(type: any, value: any): any {
    if (typeof type === 'string') {
      switch (type) {
        case 'boolean':
          return !!value
        case 'degree':
          return Number(value) / 60000
        case 'fontSize':
          return Number(value) / 100
        case 'number':
          return Number(value)
        case 'string':
          return String(value)
        case 'emu':
          return (Number(value) / 914400) * OXML.DPI
        case 'dxa':
          return (Number(value) / 1440) * OXML.DPI
        case 'percentage':
          return Number(value) / 1000
        case 'rate':
          return Number(value) / 100000
        case 'lineHeight':
          return (Number(value) / 100000) * 1.2018 + 0.0034
      }
    }
    else if (typeof type === 'object') {
      return type[value]
    }
    throw new Error(`type not found: ${type}`)
  }

  setAttribute(name: string, value: any): void {
    const definition = this.definition()?.attributes?.get(name)
    let newValue = value
    if (definition) {
      try {
        newValue = this.getSetterValue(definition.type, value)
      }
      catch (err: any) {
        console.warn(`${this.tag ?? this.element.tagName} ${name} ${err.message}`, definition)
      }
    }
    this.element.setAttribute(name, newValue)
  }

  getAttribute(name: string): any | undefined {
    const value = this.element.getAttribute(name)
    const definition = this.definition()?.attributes?.get(name)
    if (value === undefined) {
      return value ?? definition?.defaultValue
    }
    if (definition) {
      try {
        return this.getGetterValue(definition?.type, value)
      }
      catch (err: any) {
        console.warn(`${this.tag ?? this.element.tagName} ${name} ${err.message}`, definition)
      }
    }
    return value
  }

  getAttributes(): Record<string, any> {
    return Object.fromEntries(
      this.element.getAttributeNames().map((name) => {
        return [name, this.getAttribute(name)]
      }),
    )
  }

  getChild(tag: string): OXML | undefined {
    const element = Array.from(this.element.children).find((element) => {
      return element.tagName === tag || element.localName === tag
    })
    if (element) {
      return new (OXML.getConstructor(element.tagName) ?? OXML)().fromElement(element)
    }
    return undefined
  }

  getChildren(tag?: string): OXML[] {
    return Array.from(this.element.children)
      .map((element) => {
        if (!tag || (element.tagName === tag || element.localName === tag)) {
          return new (OXML.getConstructor(element.tagName) ?? OXML)().fromElement(element)
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
      ...this.getAttributes(),
      ...Object.fromEntries(this.getChildren().map((child) => {
        const tag = child.tag ?? child.element.tagName
        const tagArr = tag.split(':')
        return [tagArr[tagArr.length - 1], child.toJSON()]
      })),
    }
  }
}
