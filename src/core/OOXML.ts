import { parseDomFromString } from '../utils'
import { OOXMLValue } from './OOXMLValue'
import { deepMerge, getObjectValueByPath, setObjectValueByPath } from './utils'

export type OOXMLProto = new (...args: any[]) => OOXML

export interface OOXMLAttributeDefinition {
  name: string
  alias: string
  type: string
  defaultValue?: any
}

export interface OOXMLPropertyDefinition {
  name: string
  alias: string
  defaultValue?: any
}

export interface OOXMLChildDefinition {
  tag: string
  isArray: boolean
  defaultValue?: any
}

export interface OOXMLDefinition {
  tag?: string
  namespace?: string
  attributes: Record<string, OOXMLAttributeDefinition>
  properties: Record<string, OOXMLPropertyDefinition>
  children: OOXMLChildDefinition[]
}

export function defineElement(tag: string) {
  return (constructor: any) => {
    const proto = constructor.prototype
    const definition = OOXML.makeDefinition(proto)
    const [namespace, localName] = tag.split(':')
    if (localName) {
      definition.tag = localName
      definition.namespace = namespace
    }
    else {
      definition.tag = namespace
    }
    OOXML.tagToConstructor.set(tag, constructor)
    Object.defineProperty(proto, 'tag', {
      value: definition.tag,
      configurable: true,
      enumerable: true,
    })
  }
}

export interface DefineAttributeUsedOptions {
  type?: string
  isProperty?: boolean
  defaultValue?: any
}

export function defineAttribute(attr: string, options: DefineAttributeUsedOptions | string = {}) {
  let _options
  if (typeof options === 'string') {
    _options = { type: options }
  }
  else {
    _options = options
  }
  const {
    type = 'string',
    isProperty,
    defaultValue,
  } = _options
  return function (proto: any, name: any) {
    const definition = OOXML.makeDefinition(proto)
    definition.attributes[attr] = { name, alias: attr, type, defaultValue }
    if (isProperty) {
      definition.properties[name] = { name, alias: name }
    }
    Object.defineProperty(proto, name, {
      get() {
        return (this as OOXML).getAttribute(attr)
      },
      configurable: true,
      enumerable: true,
    })
  }
}

export function defineProperty(aliasName?: string) {
  return function (proto: any, name: any) {
    const alias = aliasName ?? name
    const definition = OOXML.makeDefinition(proto)
    definition.properties[alias] = { name, alias }
    if (name !== alias) {
      Object.defineProperty(proto, name, {
        get() {
          return (this as OOXML).offsetGet(alias)
        },
        configurable: true,
        enumerable: true,
      })
    }
  }
}

export interface DefineChildUsedOptions {
  isText?: boolean
  isArray?: boolean
  isProperty?: boolean
  defaultValue?: any
  required?: boolean
}

export function defineChild(tag: string, options: DefineChildUsedOptions = {}): any {
  const {
    isText = false,
    isArray = false,
    isProperty = false,
    defaultValue,
  } = options
  return function (proto: any, name: any) {
    const definition = OOXML.makeDefinition(proto)
    definition.children.push({ tag, defaultValue, isArray })
    if (isProperty) {
      definition.properties[name] = { name, alias: name }
    }
    Object.defineProperty(proto, name, {
      get() {
        if (isText) {
          return (this as OOXML).getChild(tag)?.element.textContent ?? defaultValue
        }
        else if (isArray) {
          return (this as OOXML).getChildren(tag) ?? defaultValue
        }
        else {
          return (this as OOXML).getChild(tag) ?? defaultValue
        }
      },
      configurable: true,
      enumerable: true,
    })
  }
}

export function defineChildren(tag: string, options: Omit<DefineChildUsedOptions, 'isArray'> = {}): any {
  return defineChild(tag, { ...options, isArray: true })
}

export class OOXML {
  static tagToConstructor = new Map<string, OOXMLProto>()
  static protoToDefinition = new WeakMap<OOXMLProto, OOXMLDefinition>()

  static getConstructor(tag: string): OOXMLProto | undefined {
    return this.tagToConstructor.get(tag)
      ?? this.tagToConstructor.get(`a:${tag}`)
  }

  static makeDefinition(proto: any): OOXMLDefinition {
    let definition = OOXML.protoToDefinition.get(proto)
    if (!definition) {
      definition = {
        attributes: {},
        properties: {},
        children: [],
      } as unknown as OOXMLDefinition
      OOXML.protoToDefinition.set(proto, definition)
    }
    return definition
  }

  static getDefinition(proto: any): OOXMLDefinition | undefined {
    let definition: OOXMLDefinition | undefined
    let cur = proto
    while (cur) {
      const _definition = this.protoToDefinition.get(cur)
      if (_definition) {
        definition = deepMerge(definition ?? {}, _definition) as any
      }
      cur = Object.getPrototypeOf(cur)
    }
    return definition
  }

  static make<T extends OOXML = OOXML>(source: string | Element): T {
    let tag: string
    let element: Element | undefined
    if (typeof source === 'string') {
      tag = source
    }
    else {
      tag = source.tagName
      element = source
    }
    return new (this.getConstructor(tag) ?? OOXML)(element) as T
  }

  declare tag?: string
  declare element: Element

  get children(): OOXML[] {
    return this.getChildren()
  }

  get textContent(): string { return this.element.textContent ?? '' }
  set textContent(val: string) { this.element.textContent = val }

  constructor(source: string | Element | Record<string, any> = {}) {
    if (typeof source === 'string') {
      this.element = parseDomFromString(source)
    }
    else if (source.nodeType === 1) {
      this.element = source as Element
    }
    else {
      this._parseIDOC(source)
    }
  }

  protected _parseIDOC(idoc: Record<string, any>): void {
    const definition = this.definition()

    if (!definition)
      return

    const {
      tag,
    } = definition

    if (!tag)
      return

    this.element = document.createElement(tag)

    console.warn('TODO', idoc)
  }

  definition(): OOXMLDefinition | undefined {
    return OOXML.getDefinition(this)
  }

  setAttribute(name: string, value: any): void {
    const definition = this.definition()?.attributes?.[name]
    let newValue = value
    if (definition) {
      try {
        newValue = OOXMLValue.stringify(value, definition.type)
      }
      catch (err: any) {
        console.warn(`${this.tag ?? this.element.tagName} ${name} ${err.message}`, definition)
      }
    }
    this.element.setAttribute(name, newValue)
  }

  getAttribute(name: string): any | undefined {
    const value = this.element.getAttribute(name)
    const definition = this.definition()?.attributes?.[name]
    if (value === null) {
      return value ?? definition?.defaultValue
    }
    if (definition) {
      try {
        return OOXMLValue.parse(value, definition?.type)
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

  offsetSet(path: string, value: any): void {
    return setObjectValueByPath(this, path, value)
  }

  offsetGet<T = any>(path: string): T | undefined {
    return getObjectValueByPath(this, path)
  }

  getChild<T = OOXML>(tag: string): T | undefined {
    const tagName = tag
    const localName = tag?.split(':')[1]
    const element = Array.from(this.element.children).find((element) => {
      return element.tagName === tagName || element.localName === localName
    })
    if (element) {
      return OOXML.make(element) as T
    }
    return undefined
  }

  getChildren<T = OOXML>(tag?: string): T[] {
    const tagName = tag
    const localName = tag?.split(':')[1]
    return Array.from(this.element.children)
      .map((element) => {
        if (!tagName || (element.tagName === tagName || element.localName === localName)) {
          return OOXML.make(element)
        }
        return undefined
      })
      .filter(Boolean) as T[]
  }

  toXML(): string {
    return this.element.outerHTML
  }

  toIDOC(ctx?: any): any {
    const definition = this.definition()
    const properties: Record<string, any> = {}
    if (definition?.properties) {
      Object.values(definition.properties).forEach((property) => {
        let value = this.offsetGet(property.alias)
        if (value instanceof OOXML) {
          value = value.toIDOC(ctx)
        }
        else if (Array.isArray(value)) {
          value = value.map((v) => {
            if (v instanceof OOXML) {
              return v.toIDOC(ctx)
            }
            return v
          })
        }
        if (value !== undefined) {
          properties[property.name] = value
        }
      })
    }
    return properties
  }
}
